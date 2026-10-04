import json
import os
import traceback
from pathlib import Path
from playwright.sync_api import sync_playwright
from browser_support import ROOT, launch_browser, ready, duplicate_ids


def main():
    base = os.environ.get("RESOURCE_HUB_BASE", "http://127.0.0.1:4321")
    report = []
    with sync_playwright() as p:
        for name in ("chromium", "firefox", "webkit"):
            try:
                browser = launch_browser(p, name)
            except Exception as error:
                report.append({"browser": name, "status": "unavailable", "reason": str(error)[:240]})
                continue
            page = browser.new_page(viewport={"width": 1280, "height": 900})
            errors = []
            page.on("pageerror", lambda error: errors.append(str(error)))
            try:
                ready(page, base, '/resources/')
                page.locator('input[name="q"]').fill('worterbuch')
                page.wait_for_function("document.querySelector('[data-active-filters]').textContent.includes('worterbuch')")
                assert page.locator('[data-result-count]').inner_text() != '0 个资源'
                page.locator('[data-view-toggle="list"]').focus()
                page.keyboard.press('/')
                assert page.locator('input[name="q"]').evaluate('el => document.activeElement === el')
                page.locator('[data-reset]').click()
                # Sort must create ONE history entry, so Back restores the original order.
                history_length = page.evaluate('history.length')
                page.locator('select[name="sort"]').select_option('title')
                assert page.evaluate('history.length') == history_length + 1
                page.go_back(wait_until='domcontentloaded')
                assert page.locator('select[name="sort"]').input_value() == 'default'
                page.locator('summary').filter(has_text='更多筛选').click()
                page.locator('select[name="provider"]').select_option(index=1)
                assert page.locator('[data-active-filters]').inner_text()
                directory_url = page.url
                page.locator('.detail-link').first.click()
                page.locator('.live-detail h1').wait_for()
                page.locator('.detail-back').click()
                page.wait_for_url(directory_url)
                ready(page, base, '/favorites/')
                private = {'goal':{'level':'B1'},'tasks':[{'title':'private test fixture'}], 'favorites':['anki']}
                page.evaluate('(value)=>localStorage.setItem("deutsch-hub.study.v1",JSON.stringify(value))', private)
                ready(page, base, '/favorites/')
                dialogs=[]
                page.on('dialog', lambda d: (dialogs.append(d.message), d.accept()))
                backup={'version':1,'favorites':['anki','duden-mentor','archived-resource']}
                page.locator('[data-import-favorites]').set_input_files({'name':'backup.json','mimeType':'application/json','buffer':json.dumps(backup).encode()})
                page.wait_for_function("document.querySelector('#favorites-note').textContent.includes('已新增')")
                stored=page.evaluate('JSON.parse(localStorage.getItem("deutsch-hub.study.v1"))')
                assert stored['favorites']==backup['favorites']
                assert stored['goal']==private['goal'] and stored['tasks']==private['tasks']
                assert len(dialogs)==1 and '暂未' in dialogs[0]
                with page.expect_download() as download:
                    page.locator('[data-export-favorites]').click()
                exported=json.loads(Path(download.value.path()).read_text(encoding='utf-8'))
                assert exported['favorites']==stored['favorites'] and 'goal' not in exported and 'tasks' not in exported
                page.locator('[data-import-favorites]').set_input_files({'name':'invalid.json','mimeType':'application/json','buffer':b'{"version":2,"favorites":["anki"]}'})
                page.wait_for_function("document.querySelector('#favorites-note').textContent.includes('不支持')")
                assert len(dialogs)==1, 'Invalid backup must not request confirmation'
                assert page.evaluate('JSON.parse(localStorage.getItem("deutsch-hub.study.v1"))')==stored
                assert not duplicate_ids(page)
                # An overflow is rejected before asking or writing; no IDs are clipped.
                full={**private,'favorites':[f'resource-{i}' for i in range(500)]}
                page.evaluate('(value)=>localStorage.setItem("deutsch-hub.study.v1",JSON.stringify(value))',full)
                page.locator('[data-import-favorites]').set_input_files({'name':'overflow.json','mimeType':'application/json','buffer':b'{"version":1,"favorites":["anki"]}'})
                page.wait_for_function("document.querySelector('#favorites-note').textContent.includes('超过上限')")
                assert len(dialogs)==1 and page.evaluate('JSON.parse(localStorage.getItem("deutsch-hub.study.v1"))')==full
                for width in (320,375,768,1440):
                    page.set_viewport_size({'width':width,'height':900})
                    assert page.locator('body').evaluate('el => el.scrollWidth <= window.innerWidth'), width
                # Malformed API data must keep a usable snapshot, rather than poison state.
                page.route('**/api/public-catalog', lambda route: route.fulfill(json={'schemaVersion':1,'resources':[{'id':'bad'}],'categories':[]}))
                ready(page,base,'/resources/')
                assert page.locator('.resource-card').count()>0
                assert '本地目录' in page.locator('#directory-note').inner_text()
                page.unroute('**/api/public-catalog')
                page.goto(base.rstrip('/')+'/reader/',wait_until='load')
                translation=page.locator('.translation').first
                translation.focus()
                page.keyboard.press('Enter')
                assert translation.get_attribute('aria-expanded')=='true'
                page.keyboard.press('Space')
                assert translation.get_attribute('aria-expanded')=='false'
                assert not errors, errors
                report.append({'browser':name,'version':browser.version,'status':'passed','errors':errors,
                    'flows':['search','keyboard shortcut','sort/back','provider','detail return','favorites merge/export/invalid/overflow','private preservation','responsive','malformed API fallback','reader keyboard']})
            except Exception as error:
                report.append({'browser':name,'status':'failed','reason':traceback.format_exc(limit=3),'errors':errors})
            finally:
                browser.close()
    print(json.dumps(report, ensure_ascii=False))
    destination=ROOT/'.wrangler/qa/cross-browser.json'
    destination.parent.mkdir(parents=True,exist_ok=True)
    destination.write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
    assert all(item['status']=='passed' for item in report), report


if __name__ == "__main__":
    main()
