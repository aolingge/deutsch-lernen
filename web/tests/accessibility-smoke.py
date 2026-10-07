import json
import os
from playwright.sync_api import sync_playwright
from browser_support import ROOT, ready, duplicate_ids


def main():
    base = os.environ.get("RESOURCE_HUB_BASE", "http://127.0.0.1:4321")
    results = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 900})
        axe=ROOT/'node_modules/axe-core/axe.min.js'
        for path in ('/','/resources/','/favorites/','/sources/','/exams/','/news/','/privacy/','/resource/anki/','/admin/','/reader/'):
            ready(page,base,path) if path != '/reader/' else page.goto(base.rstrip('/')+path,wait_until='load')
            if path == '/reader/':
                page.wait_for_function("document.querySelector('#readingContent').dataset.ready==='true'")
            if page.locator('[data-advanced-filters]').count():
                page.locator('[data-advanced-filters]').evaluate('el=>el.open=true')
            page.add_script_tag(path=str(axe))
            scan=page.evaluate("async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}});return {violations:r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)})),incomplete:r.incomplete.map(v=>v.id)};}")
            duplicates=duplicate_ids(page)
            results.append({'path':path,'duplicates':duplicates,**scan})
            if path=='/reader/':
                # Inspect revealed translations in all supported themes too.
                page.locator('[data-translation=show]').click()
                page.wait_for_function("document.querySelector('#readingContent').dataset.ready==='true'")
                for theme in ('paper','green','dark'):
                    page.locator(f'[data-theme={theme}]').click()
                    # The book cards animate their background for 200 ms.
                    page.wait_for_timeout(300)
                    themed=page.evaluate("async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa']}});return {violations:r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)})),incomplete:r.incomplete.map(v=>v.id)};}")
                    results.append({'path':f'/reader/#theme-{theme}',**themed})
        ready(page,base,'/resources/')
        page.locator('input[name="q"]').focus()
        page.keyboard.type("TestDaF")
        page.wait_for_timeout(300)
        assert page.locator("[data-result-count]").inner_text() != "0 个资源"
        page.locator("summary").filter(has_text="更多筛选").click()
        page.locator('select[name="provider"]').focus()
        page.keyboard.press("Home")
        page.keyboard.press("ArrowDown")
        page.keyboard.press("Enter")
        assert page.locator("[data-active-filters]").inner_text()
        page.set_viewport_size({"width": 320, "height": 900})
        page.evaluate("document.documentElement.style.fontSize='200%'")
        assert page.locator("body").evaluate("el => el.scrollWidth <= window.innerWidth")
        landmarks = page.locator("main, nav, aside, form").count()
        assert landmarks >= 4, landmarks
        results.append({"keyboard": True, "reflow320": True, "landmarks": landmarks})
        browser.close()
    print(json.dumps([{**row,'violations':[{'id':v['id'],'nodes':len(v['nodes'])} for v in row.get('violations',[])]} for row in results], ensure_ascii=False))
    destination=ROOT/'.wrangler/qa/accessibility.json'
    destination.parent.mkdir(parents=True,exist_ok=True)
    destination.write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
    assert all(not row.get('violations') and not row.get('duplicates') for row in results), 'See .wrangler/qa/accessibility.json for details'


if __name__ == "__main__":
    main()
