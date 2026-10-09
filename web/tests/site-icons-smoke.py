"""Check actual images, local-only loading, reflow and broken-image fallback."""
import os
import json
from playwright.sync_api import sync_playwright
from browser_support import ROOT, launch_browser, ready

base = os.environ.get('RESOURCE_HUB_BASE', 'http://127.0.0.1:8794')
report = []
with sync_playwright() as p:
    for name in ('chromium', 'firefox', 'webkit'):
        browser = launch_browser(p, name)
        page = browser.new_page(viewport={'width': 1280, 'height': 900})
        images = []
        page.on('request', lambda r: images.append(r.url) if r.resource_type == 'image' else None)
        for path in ('/resources/?category=communication', '/resources/?category=shopping', '/sources/', '/resource/whatsapp/'):
            ready(page, base, path)
            # Force lazy images to load so below-the-fold failures are covered too.
            page.locator('img[data-site-icon]').evaluate_all("els => els.forEach(el => el.loading = 'eager')")
            page.wait_for_function("Array.from(document.querySelectorAll('img[data-site-icon]')).every(img=>img.complete)")
            assert page.locator('img[data-site-icon]').count() > 0, path
            broken = page.locator('img[data-site-icon]').evaluate_all("els => els.filter(el => !el.naturalWidth).map(el => el.src)")
            assert not broken, (path, broken)
            assert page.locator('.source-mark').evaluate_all("els => els.every(el => !el.textContent.trim())")
            page.set_viewport_size({'width': 320, 'height': 900})
            page.evaluate("document.documentElement.style.fontSize='200%'")
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), (path, '200% text')
            page.evaluate("document.documentElement.style.fontSize=''")
            page.set_viewport_size({'width': 1280, 'height': 900})
        ready(page, base, '/resources/?category=communication')
        for width in (320, 375, 768, 1440):
            page.set_viewport_size({'width': width, 'height': 900})
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), width
        page.locator('[data-view-toggle="list"]').click()
        assert page.locator('[data-catalog-grid]').get_attribute('data-view') == 'list'
        assert page.locator('img[data-site-icon]').first.evaluate('el => getComputedStyle(el).objectFit') == 'contain'
        page.route('**/site-icons/__missing.png', lambda route: route.fulfill(status=404, body=''))
        image = page.locator('img[data-site-icon]').first
        image.evaluate("el => {el.loading='eager';el.src='/site-icons/__missing.png'}")
        page.wait_for_function("document.querySelector('img[data-site-icon]').hidden")
        assert image.locator('..').locator('.source-icon-fallback').is_visible()
        assert all(url.startswith(base.rstrip('/') + '/') or url.startswith('data:') for url in images), images
        ready(page, base, '/resources/?category=shopping')
        page.set_viewport_size({'width': 1440, 'height': 1000})
        page.locator('img[data-site-icon]').evaluate_all("els=>els.forEach(el=>el.loading='eager')")
        page.wait_for_function("Array.from(document.querySelectorAll('img[data-site-icon]')).every(img=>img.complete)")
        if name == 'chromium':
            page.screenshot(path=str(ROOT / '.wrangler/site-icons-desktop.png'), full_page=True)
            page.set_viewport_size({'width': 375, 'height': 900})
            page.screenshot(path=str(ROOT / '.wrangler/site-icons-mobile.png'), full_page=True)
        report.append({'browser': name, 'status': 'passed'})
        browser.close()
print(json.dumps(report))
