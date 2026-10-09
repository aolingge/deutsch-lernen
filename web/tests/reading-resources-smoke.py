"""Verify the curated reading collection and its entry points without external login."""
import json
import os
from pathlib import Path
from playwright.sync_api import sync_playwright
from browser_support import ROOT, launch_browser, ready, duplicate_ids

base = os.environ.get('RESOURCE_HUB_BASE', 'http://127.0.0.1:4360').rstrip('/')
output = ROOT / 'output/reading-resources-qa'
output.mkdir(parents=True, exist_ok=True)
collections = json.loads((ROOT/'data/reading-collections.json').read_text(encoding='utf-8'))
expected = {id for group in collections for id in group['resources']}
reports = []
with sync_playwright() as p:
    for name in ('chromium','firefox','webkit'):
        browser = launch_browser(p,name)
        page = browser.new_page(viewport={'width':1440,'height':1000})
        errors = []
        page.on('pageerror',lambda error: errors.append(str(error)))
        ready(page,base,'/')
        page.locator('.directory-extras a[href="/reading/"]').click()
        page.wait_for_url('**/reading/')
        actual = set(page.locator('[data-reading-resource]').evaluate_all('els=>els.map(el=>el.dataset.readingResource)'))
        assert actual == expected, (expected-actual,actual-expected)
        assert not duplicate_ids(page)
        for link in page.locator('[data-reading-resource] h3 a').all():
            assert link.get_attribute('href').startswith('https://')
            assert link.get_attribute('rel') == 'noopener noreferrer'
        goethe = page.locator('[data-reading-resource=goethe-onleihe]')
        assert '需注册' in goethe.inner_text()
        goethe.locator('summary').focus()
        page.keyboard.press('Enter')
        assert goethe.locator('details').get_attribute('open') is not None
        assert '激活 Onleihe' in goethe.inner_text()
        assert '订阅' in page.locator('[data-reading-resource=readle-german]').inner_text()
        assert '免费 MP3' in page.locator('[data-reading-resource=hueber-adult-readers]').inner_text()
        page.locator('.reading-index a[href="#tools"]').click()
        assert page.url.endswith('#tools')
        for width in (320,375,768,1440):
            page.set_viewport_size({'width':width,'height':1000})
            page.evaluate('window.scrollTo(0,0)')
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), (name,width)
            if name == 'chromium':
                page.screenshot(path=str(output/f'collection-{width}.png'),full_page=width==375)
        if name == 'chromium':
            page.set_viewport_size({'width':320,'height':1000})
            page.evaluate("document.documentElement.style.fontSize='200%'")
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
            page.evaluate("document.documentElement.style.fontSize=''")
            page.add_script_tag(path=str(ROOT/'node_modules/axe-core/axe.min.js'))
            violations = page.evaluate("async()=> (await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))")
            assert not violations, violations
        page.goto(base+'/reader/', wait_until='domcontentloaded', timeout=60000)
        assert not page.locator('#speechOptions').is_visible()
        page.locator('.library-resources').click()
        page.wait_for_url('**/reading/')
        assert not errors, errors
        reports.append({'browser':name,'resources':len(actual),'widths':[320,375,768,1440],'keyboard':True,'errors':errors})
        browser.close()
(output/'report.json').write_text(json.dumps(reports,indent=2),encoding='utf-8')
print(json.dumps(reports,ensure_ascii=False))
