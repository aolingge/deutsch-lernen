"""Real browser checks for vocabulary portability, selection and curated filters."""
import csv
import io
import json
import os
from playwright.sync_api import sync_playwright
from browser_support import ROOT, launch_browser, ready, duplicate_ids

base = os.environ.get('RESOURCE_HUB_BASE', 'http://127.0.0.1:4360').rstrip('/')
output = ROOT / 'output/site-connections-qa'
output.mkdir(parents=True, exist_ok=True)
reports = []
browsers = tuple(os.environ.get('RESOURCE_HUB_BROWSERS', 'chromium,firefox,webkit').split(','))
assert browsers and all(name in ('chromium', 'firefox', 'webkit') for name in browsers)
report_path = output / ('report.json' if len(browsers) == 3 else 'report-' + '-'.join(browsers) + '.json')
with sync_playwright() as p:
    for name in browsers:
        print(f'Checking {name}: {base}', flush=True)
        browser = launch_browser(p, name)
        page = browser.new_page(viewport={'width': 1440, 'height': 1000}, accept_downloads=True)
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        ready(page, base, '/')
        page.locator('.directory-extras a[href="/apps/"]').click()
        page.wait_for_url('**/apps/')
        assert page.locator('[data-app-resource]').count() == 10
        assert '不自动同步' in page.locator('[data-app-resource=ankiweb]').inner_text()
        for a in page.locator('[data-app-resource] h3 a').all():
            assert a.get_attribute('href').startswith('https://')
            assert a.get_attribute('rel') == 'noopener noreferrer'
        for width in (320, 375, 768, 1440):
            page.set_viewport_size({'width': width, 'height': 1000})
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), ('apps', name, width)
        if name == 'chromium':
            page.screenshot(path=str(output/'apps-desktop.png'))
            page.add_script_tag(path=str(ROOT/'node_modules/axe-core/axe.min.js'))
            assert not page.evaluate("async()=> (await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>v.id)")
        page.goto(base + '/reading/?level=B1&price=free', wait_until='domcontentloaded')
        page.wait_for_function("document.querySelector('#readingFilters [name=level]').value==='B1'")
        visible = page.locator('[data-reading-resource]:visible')
        assert visible.count() > 0
        assert all(a.get_attribute('data-price') == 'free' and 'B1' in a.get_attribute('data-levels').split(',') for a in visible.all())
        page.locator('#readingFilters [name=q]').fill('not-a-match-不存在')
        assert page.locator('#readingEmpty').is_visible()
        assert page.locator('#readingFilterCount').inner_text() == '0 个入口'
        page.locator('#readingFilters button').click()
        page.wait_for_function("document.querySelectorAll('[data-reading-resource]:not([hidden])').length===24")
        page.locator('#readingFilters [name=q]').fill('Readlang')
        assert page.locator('[data-reading-resource]:visible').count() == 1
        url = page.url
        page.reload(wait_until='domcontentloaded')
        assert page.url == url
        assert page.locator('[data-reading-resource]:visible').count() == 1
        page.locator('#readingFilters button').click()
        page.wait_for_function("document.querySelectorAll('[data-reading-resource]:not([hidden])').length===24")
        for width in (320, 375, 768, 1440):
            page.set_viewport_size({'width': width, 'height': 1000})
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), ('reading', name, width)
        if name == 'chromium':
            page.screenshot(path=str(output/'reading-filters-desktop.png'))
            page.add_script_tag(path=str(ROOT/'node_modules/axe-core/axe.min.js'))
            assert not page.evaluate("async()=> (await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>v.id)")
        # WebKit headless has no OS speech engine; inject one only for the disclosure check.
        page.add_init_script("""(() => {
          const synth={getVoices:()=>[],addEventListener(){},cancel(){}};
          Object.defineProperty(window,'speechSynthesis',{value:synth,configurable:true});
          window.SpeechSynthesisUtterance=class {constructor(text){this.text=text}};
        })();""")
        page.goto(base + '/reader/', wait_until='domcontentloaded', timeout=60000)
        page.wait_for_selector('#paragraph-2')
        assert not page.locator('#speechOptions').is_visible()
        page.locator('#speechToggle').click()
        assert not page.locator('#speechRange').is_visible()
        page.locator('#speechScope').select_option('range')
        assert page.locator('#speechRange').is_visible()
        page.locator('#speechScope').select_option('current')
        assert not page.locator('#speechRange').is_visible()
        page.keyboard.press('Escape')
        assert page.locator('#speechStatus').get_attribute('class') == 'reader-sr-only'
        assert page.locator('#speechStatus').evaluate('el=>el.closest("[hidden]")===null')
        selected = page.evaluate("""() => {
          const p=document.querySelector('#paragraph-2 .german'), text=p.firstChild;
          const end=Math.min(8,text.length), range=document.createRange();
          range.setStart(text,0);range.setEnd(text,end);const s=getSelection();s.removeAllRanges();s.addRange(range);
          return s.toString().replace(/\\s+/g,' ').trim();
        }""")
        page.wait_for_timeout(120)
        page.locator('#vocabularyToggle').click()
        assert page.locator('#vocabularyDialog').is_visible()
        assert page.locator('#vocabularyTerm').input_value() == selected
        assert page.locator('#vocabularyContext').input_value()
        assert page.locator('#vocabularySource').get_attribute('href').endswith('#paragraph-2')
        page.locator('#vocabularyTerm').fill('größer "Straße"')
        page.locator('#vocabularyMeaning').fill('更大\t街道\n复习')
        page.locator('#vocabularyContext').fill('Eine größere Straße. <img src=x onerror="window.__injected=true">')
        links = page.locator('#vocabularyDictionaries a')
        assert links.count() == 3
        assert '%C3%B6' in links.first.get_attribute('href')
        page.locator('#vocabularyForm button').click()
        assert page.locator('#vocabularyCount').inner_text() == '1'
        page.locator('#vocabularyMeaning').fill('更新释义')
        page.locator('#vocabularyForm button').click()
        assert page.locator('#vocabularyCount').inner_text() == '1'
        page.locator('.vocabulary-transfer summary').click()
        with page.expect_download() as dl:
            page.locator('#vocabularyAnki').click()
        exported = output / f'{name}.tsv'
        dl.value.save_as(str(exported))
        text = exported.read_text(encoding='utf-8')
        assert text.startswith('#separator:Tab\n#html:false\n#columns:Front\tBack\n')
        rows = list(csv.reader(io.StringIO('\n'.join(text.splitlines()[3:])), delimiter='\t'))
        assert len(rows) == 1 and len(rows[0]) == 2
        assert rows[0][0] == 'größer "Straße"'
        assert '更新释义' in rows[0][1] and '#paragraph-2' in rows[0][1]
        with page.expect_download() as dl:
            page.locator('#vocabularyBackup').click()
        backup = output / f'{name}.json'
        dl.value.save_as(str(backup))
        data = json.loads(backup.read_text(encoding='utf-8'))
        assert data['version'] == 1 and len(data['items']) == 1
        # Merge a duplicate and an unsafe note: no overwrite and no executable markup.
        data['items'][0]['meaning'] = '不得覆盖'
        data['items'].append({'term':'<img src=x onerror="window.__injected=true">', 'meaning':'备份词', 'context':'测试', 'bookId':'bad', 'paragraph':2})
        page.locator('#vocabularyImport').set_input_files({'name':'backup.json','mimeType':'application/json','buffer':json.dumps(data,ensure_ascii=False).encode('utf-8')})
        page.wait_for_function("document.querySelector('#vocabularyCount').textContent==='2'")
        assert '更新释义' in page.locator('#vocabularyList').inner_text()
        assert not page.locator('#vocabularyList img').count()
        assert not page.evaluate('Boolean(window.__injected)')
        page.locator('#vocabularyImport').set_input_files({'name':'bad.json','mimeType':'application/json','buffer':b'{"version":1,"items":[null]}'})
        page.wait_for_function("document.querySelector('#vocabularyStatus').textContent.startsWith('导入失败')")
        assert page.locator('#vocabularyCount').inner_text() == '2'
        for width in (320, 375, 768, 1440):
            page.set_viewport_size({'width': width, 'height': 1000})
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), ('reader', name, width)
            assert page.locator('#vocabularyDialog').evaluate('el=>el.scrollWidth <= el.clientWidth'), ('dialog', name, width)
        if name == 'chromium':
            page.set_viewport_size({'width': 375, 'height': 900})
            page.screenshot(path=str(output/'vocabulary-mobile.png'))
            page.add_script_tag(path=str(ROOT/'node_modules/axe-core/axe.min.js'))
            violations = page.evaluate("async()=> (await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))")
            assert not violations, violations
        page.keyboard.press('Escape')
        page.locator('#vocabularyDialog').wait_for(state='hidden')
        page.reload(wait_until='domcontentloaded', timeout=60000)
        page.wait_for_function("document.querySelector('#readingContent').dataset.ready==='true'", timeout=60000)
        page.locator('#vocabularyToggle').click()
        assert page.locator('#vocabularyCount').inner_text() == '2'
        assert not duplicate_ids(page)
        # Simulate full storage: failure must not be reported as a successful save.
        page.evaluate("() => { Storage.prototype.setItem=function(){throw new DOMException('full','QuotaExceededError')}; }")
        page.locator('#vocabularyTerm').fill('Speicherfehler')
        page.locator('#vocabularyForm button').click()
        assert page.locator('#vocabularyStatus').inner_text().startswith('保存失败')
        assert page.locator('#vocabularyCount').inner_text() == '2'
        page.keyboard.press('Escape')
        page.evaluate("window.scrollTo({top:scrollY<125?250:0,behavior:'instant'})")
        page.wait_for_function("document.querySelector('.reader-footer').textContent.includes('无法保存')")
        if name == 'chromium':
            # Restore in a separate browser context; protect an unreadable old record first.
            fresh = browser.new_context(viewport={'width':375,'height':900})
            restored = fresh.new_page()
            restored.add_init_script("localStorage.setItem('gutenberg-vocabulary-v1','broken-json')")
            original = json.loads(backup.read_text(encoding='utf-8'))['items'][0]
            restored.goto(base + '/reader/?book=' + original['bookId'] + '#paragraph-2', wait_until='domcontentloaded', timeout=60000)
            restored.locator('#vocabularyToggle').click()
            restored.locator('#vocabularyTerm').fill('Daten erhalten')
            restored.locator('#vocabularyForm button').click()
            assert restored.evaluate("localStorage.getItem('gutenberg-vocabulary-v1')") == 'broken-json'
            restored.locator('.vocabulary-transfer summary').click()
            restored.locator('#vocabularyImport').set_input_files(str(backup))
            restored.wait_for_function("document.querySelector('#vocabularyCount').textContent==='1'")
            restored.locator('.vocabulary-item').click()
            assert restored.locator('#vocabularyTerm').input_value() == 'größer "Straße"'
            assert restored.locator('#vocabularyMeaning').input_value() == '更新释义'
            restored.locator('#vocabularySource').click()
            assert not restored.locator('#vocabularyDialog').is_visible()
            restored.wait_for_function("() => { const el=document.getElementById('paragraph-2'); if(!el) return false; const r=el.getBoundingClientRect(); return r.top<innerHeight&&r.bottom>0; }")
            fresh.close()
        assert not errors, errors
        reports.append({'browser':name, 'vocabularyExportAndMerge':True, 'safeImport':True, 'filters':True, 'speechDisclosure':'API mock', 'apps':10, 'widths':[320,375,768,1440], 'errors':errors})
        report_path.write_text(json.dumps({'base':base,'complete':False,'checks':reports},indent=2),encoding='utf-8')
        browser.close()
report_path.write_text(json.dumps({'base':base,'complete':True,'checks':reports},indent=2),encoding='utf-8')
print(json.dumps(reports,ensure_ascii=False))
