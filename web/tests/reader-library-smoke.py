import argparse
import hashlib
import json
from pathlib import Path
from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser()
parser.add_argument('--base', default='http://127.0.0.1:4357')
parser.add_argument('--output', default='output/reader-library-qa')
args = parser.parse_args()
out = Path(args.output)
out.mkdir(parents=True, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 1000}, accept_downloads=True)
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    response = page.goto(args.base.rstrip('/') + '/reader/?book=13', wait_until='load')
    assert response.status == 200
    page.wait_for_function('window.GUTENBERG_BOOKS?.length === 20')
    assert page.locator('.book-card').count() == 20
    assert page.locator('#libraryTitle').inner_text() == '20 本德语读物'
    assert '161.4' in page.locator('#readingTime').inner_text()
    books = page.evaluate('window.GUTENBERG_BOOKS.map(b => ({id:b.id, paragraphs:b.paragraphs.length, difficulty:b.difficulty}))')
    records_response = page.request.get(args.base.rstrip('/') + '/reader/data/source-records.json')
    assert records_response.status == 200
    records = records_response.json()
    checked = []
    for book in books[12:]:
        page.locator(f'[data-book="{book["id"]}"]').click()
        assert page.locator('.german').count() == book['paragraphs']
        assert page.locator('.translation').count() == 0
        link = page.get_by_role('link', name='下载完整 TXT')
        downloaded = page.request.get(link.get_attribute('href') if link.get_attribute('href').startswith('http') else args.base.rstrip('/') + '/reader/' + link.get_attribute('href'))
        assert downloaded.status == 200
        record = next(item for item in records if item['id'] == book['id'])
        assert hashlib.sha256(downloaded.body()).hexdigest() == record['sha256']
        checked.append(book['id'])
    page.locator('#levelFilter').select_option('A2')
    assert page.locator('.book-card').count() == sum('A2' in book['difficulty'] for book in books)
    page.locator('#levelFilter').select_option('')
    page.locator('#bookSearch').fill('Guerber')
    assert page.locator('.book-card').count() == 2
    page.locator('#bookSearch').fill('')
    page.locator('[data-book="13"]').click()
    with page.expect_download() as event:
        page.get_by_role('link', name='下载完整 TXT').click()
    assert event.value.suggested_filename.endswith('.txt')
    page.locator('[data-theme="dark"]').click()
    page.reload(wait_until='load')
    assert page.locator('body').evaluate('e => e.classList.contains("theme-dark")')
    assert '13' in page.locator('#bookNumber').inner_text()
    page.locator('[data-theme="paper"]').click()
    layouts = []
    for width in (320, 375, 768, 1440):
        page.set_viewport_size({'width': width, 'height': 900})
        page.evaluate('window.scrollTo(0, 0)')
        page.wait_for_timeout(300)
        assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth'), f'Overflow at {width}'
        page.screenshot(path=str(out / f'reader-{width}.png'))
        layouts.append(width)
    page.set_viewport_size({'width': 1440, 'height': 1000})
    page.locator('[data-book="01"]').click()
    translation = page.locator('.translation').first
    translation.focus()
    page.keyboard.press('Enter')
    assert translation.get_attribute('aria-expanded') == 'true'
    page.locator('[data-translation="hide"]').click()
    assert page.locator('.translation:visible').count() == 0
    page.locator('[data-translation="hover"]').click()
    page.locator('[data-book="13"]').click()
    page.wait_for_timeout(200)
    page.locator('.german').nth(40).scroll_into_view_if_needed()
    page.wait_for_timeout(500)
    assert int(page.evaluate('localStorage.getItem("gutenberg-position-13")')) > 0
    page.reload(wait_until='load')
    page.wait_for_timeout(300)
    assert page.evaluate('window.scrollY') > 0
    assert not errors, errors
    result = {'status':'passed','base':args.base,'books':len(books),'newBooksChecked':checked,'downloadHashes':'matched','viewports':layouts,'errors':errors}
    (out / 'report.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf8')
    print(json.dumps(result, ensure_ascii=False))
    browser.close()
