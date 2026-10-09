"""Cache raster favicons; no visitor requests to third-party services.

Run manually with Python + requests + Pillow. Existing successful icons are kept.
Only HTTPS/public destinations, bounded downloads and decoded PNG output are used.
"""
import concurrent.futures
import argparse
import io
import ipaddress
import json
import socket
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit, urlencode

import requests
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'public' / 'site-icons'
MANIFEST = ROOT / 'data' / 'site-icons.json'


def download(url, limit):
    session = requests.Session()
    for _ in range(5):
        parsed = urlsplit(url)
        if parsed.scheme != 'https' or parsed.username or parsed.password or parsed.port not in (None, 443):
            raise ValueError('unsafe URL')
        addresses = socket.getaddrinfo(parsed.hostname, 443)
        if not addresses or any(not ipaddress.ip_address(row[4][0]).is_global for row in addresses):
            raise ValueError('non-public destination')
        with session.get(url, timeout=(5, 8), stream=True, allow_redirects=False,
                         headers={'User-Agent': 'Mozilla/5.0 ResourceDirectoryIconCache/1.0'}) as response:
            if response.status_code in (301, 302, 303, 307, 308):
                url = urljoin(url, response.headers['Location'])
                continue
            response.raise_for_status()
            data = bytearray()
            for chunk in response.iter_content(8192):
                data.extend(chunk)
                if len(data) > limit:
                    # Homepage parsing only needs the early head section.
                    if limit > 512000:
                        return bytes(data[:limit]), url
                    raise ValueError('oversized icon')
            return bytes(data), url
    raise ValueError('redirect limit')


class IconLinks(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        rel = attrs.get('rel', '').lower().split()
        if tag == 'link' and any(v in rel for v in ('icon', 'apple-touch-icon', 'apple-touch-icon-precomposed')):
            href = attrs.get('href', '')
            if href and '.svg' not in href.lower():
                self.links.append(href)


def cache_icon(entry):
    host, page = entry
    old = previous.get(host)
    if old and (ROOT / 'public' / old['path'].lstrip('/')).is_file():
        return host, old
    origin = 'https://' + urlsplit(page).netloc
    candidates = []
    try:
        body, final = download(page, 768000)
        parser = IconLinks()
        parser.feed(body.decode('utf-8', errors='replace'))
        candidates.extend(urljoin(final, link) for link in parser.links[:8])
    except Exception:
        pass
    candidates.extend(origin + path for path in ('/favicon.ico', '/apple-touch-icon.png', '/favicon.png'))
    if args.indexed_fallback:
        # Explicit build-time fallback for sites that block direct asset retrieval.
        # Google returns 404 when it has no usable indexed favicon.
        candidates.append('https://www.google.com/s2/favicons?' + urlencode({'domain_url': origin, 'sz': 64}))
    for candidate in dict.fromkeys(candidates):
        try:
            data, source = download(candidate, 512000)
            with Image.open(io.BytesIO(data)) as img:
                if img.format not in ('PNG', 'ICO', 'JPEG', 'WEBP', 'GIF'):
                    continue
                if img.format == 'ICO':
                    img = img.ico.getimage(max(img.ico.sizes()))
                if min(img.size) < 16 or max(img.size) > 2048:
                    continue
                rgba = img.convert('RGBA')
                rgba.thumbnail((96, 96), Image.Resampling.LANCZOS)
                if not rgba.getbbox():
                    continue
                filename = host + '.png'
                rgba.save(DEST / filename, optimize=True)
                return host, {'path': '/site-icons/' + filename, 'source': source,
                              'retrievedAt': args.date,
                              'kind': 'indexed' if urlsplit(source).hostname.endswith('.gstatic.com') else 'original'}
        except Exception:
            continue
    return host, None


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--indexed-fallback', action='store_true')
    parser.add_argument('--date', default=__import__('datetime').date.today().isoformat())
    args = parser.parse_args()
    DEST.mkdir(parents=True, exist_ok=True)
    previous = json.loads(MANIFEST.read_text('utf-8')) if MANIFEST.exists() else {}
    resources = json.loads((ROOT / 'data' / 'resources.json').read_text('utf-8'))
    sites = {}
    for row in resources:
        if row['status'] == 'published' and row['rights'] != 'owned':
            host = urlsplit(row['url']).hostname.removeprefix('www.')
            sites.setdefault(host, row['url'])
    manifest = {}
    missing = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        for host, result in pool.map(cache_icon, sorted(sites.items())):
            if result:
                manifest[host] = result
            else:
                missing.append(host)
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', 'utf-8')
    print(json.dumps({'sites': len(sites), 'cached': len(manifest), 'missing': missing}))
