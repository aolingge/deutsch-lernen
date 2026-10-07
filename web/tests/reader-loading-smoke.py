import json
import os
from playwright.sync_api import sync_playwright
from browser_support import ROOT, launch_browser

base = os.environ.get('RESOURCE_HUB_BASE', 'http://127.0.0.1:4360').rstrip('/')
output = ROOT / 'output/reader-loading-qa'
output.mkdir(parents=True, exist_ok=True)
reports=[]
source=(ROOT/'public/reader/data/books.js').read_text(encoding='utf-8')
original=json.loads(source.split('=',1)[1].strip().removesuffix(';'))
for book in original:
    assert json.loads((ROOT/f'public/reader/data/books/{book["id"]}.json').read_text(encoding='utf-8'))==book
with sync_playwright() as p:
    for name in ('chromium','firefox','webkit'):
        browser=launch_browser(p,name)
        page=browser.new_page(viewport={'width':1440,'height':1000})
        errors=[]
        page.on('pageerror',lambda error:errors.append(str(error)))
        requested=[]
        page.on('request',lambda request:requested.append(request.url))
        page.goto(base+'/reader/?book=13',wait_until='domcontentloaded',timeout=60000)
        page.wait_for_function("document.querySelector('#readingContent').dataset.ready==='true'",timeout=60000)
        first=[url for url in requested if '/data/books/' in url]
        assert len(first)==1 and first[0].endswith('/13.json'),first
        assert not any(url.endswith('/data/books.js') for url in requested)
        assert page.evaluate('window.GUTENBERG_BOOKS.filter(b=>b.paragraphs).length')==1
        held=[]
        page.route('**/data/books/14.json',lambda route:held.append(route))
        page.locator('[data-book="14"]').click()
        page.wait_for_function("document.querySelector('#bookNumber').textContent==='14' && document.querySelector('#readingContent').dataset.ready==='false'")
        page.wait_for_timeout(300)
        assert held
        page.locator('[data-book="15"]').click()
        page.wait_for_function("document.querySelector('#bookNumber').textContent==='15' && document.querySelector('#readingContent').dataset.ready==='true'",timeout=60000)
        held[0].fulfill(status=200,content_type='application/json',body=(ROOT/'public/reader/data/books/14.json').read_bytes())
        page.wait_for_function("window.GUTENBERG_BOOKS.find(b=>b.id==='14').paragraphs")
        assert page.locator('#bookNumber').inner_text()=='15'
        expected=page.evaluate("window.GUTENBERG_BOOKS.find(b=>b.id==='15').paragraphCount")
        assert page.locator('.german').count()==expected
        # A failed book must not overwrite its saved position; retry requests it again.
        page.evaluate("localStorage.setItem('gutenberg-position-16','700')")
        page.route('**/data/books/16.json',lambda route:route.abort())
        page.locator('[data-book="16"]').click()
        retry=page.locator('#readingContent button')
        retry.wait_for()
        assert page.evaluate("localStorage.getItem('gutenberg-position-16')")=='700'
        page.unroute('**/data/books/16.json')
        retry.click()
        page.wait_for_function("document.querySelector('#readingContent').dataset.ready==='true'",timeout=60000)
        page.wait_for_function('Math.abs(scrollY-700)<5')
        assert page.locator('#bookNumber').inner_text()=='16'
        # All raw paragraphs, including Chinese where present, match the legacy source.
        assert not errors,errors
        reports.append({'browser':name,'initialBookRequests':len(first),'race':True,'retry':True,'positionPreserved':True,'errors':errors})
        browser.close()
(output/'report.json').write_text(json.dumps({'base':base,'checks':reports},indent=2),encoding='utf-8')
print(json.dumps(reports,ensure_ascii=False))
