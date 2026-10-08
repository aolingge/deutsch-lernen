"""Generate a real position in the prior reader and migrate it after the layout update."""
import json
import os
import subprocess
from playwright.sync_api import sync_playwright
from browser_support import ROOT, launch_browser
base=os.environ.get('RESOURCE_HUB_BASE','http://127.0.0.1:4360').rstrip('/')
previous={name:subprocess.check_output(['git','show','89cd12f:web/public/reader/'+name],cwd=ROOT.parent) for name in ('index.html','bootstrap.js','app.js','vocabulary.js')}
reports=[]
with sync_playwright() as p:
  for engine in ('chromium','firefox','webkit'):
    browser=launch_browser(p,engine)
    for width in (375,1440):
      page=browser.new_page(viewport={'width':width,'height':1000})
      def legacy(route):
        name=route.request.url.split('?',1)[0].rsplit('/',1)[-1]
        if route.request.resource_type=='document': route.fulfill(status=200,content_type='text/html',body=previous['index.html'])
        elif name in previous: route.fulfill(status=200,content_type='text/javascript',body=previous[name])
        else: route.continue_()
      page.add_init_script("(() => { const original=window.scrollTo; window.scrollTo=function(...args) { if(document.body?.classList.contains('legacy-position')) window.migrationMetrics={toolbar:document.querySelector('.reader-toolbar').offsetHeight,first:document.querySelector('.reading-block').getBoundingClientRect().top+scrollY,library:document.querySelector('.library').offsetHeight,hero:document.querySelector('.reader-hero').offsetHeight}; return original.apply(this,args); }; })();")
      page.route('**/reader/**',legacy)
      page.goto(base+'/reader/?book=13',wait_until='load')
      page.wait_for_function("document.querySelector('#readingContent').dataset.ready==='true'")
      page.evaluate("() => { const block=document.getElementById('paragraph-120'); scrollTo({top:block.getBoundingClientRect().top+scrollY+block.offsetHeight*0.3-130,behavior:'instant'}); }")
      page.wait_for_timeout(250)
      old_point=page.evaluate("() => { const r=document.getElementById('paragraph-120').getBoundingClientRect(); return {top:r.top,height:r.height,offset:(130-r.top)/r.height,toolbar:document.querySelector('.reader-toolbar').offsetHeight, first:document.getElementById('paragraph-1').getBoundingClientRect().top+scrollY}; }")
      position=page.evaluate("Number(localStorage.getItem('gutenberg-position-13'))")
      assert position>0 and page.evaluate("localStorage.getItem('gutenberg-anchor-13')") is None
      page.unroute('**/reader/**',legacy)
      page.reload(wait_until='load')
      page.wait_for_function("document.querySelector('#readingContent').dataset.ready==='true' && !document.body.classList.contains('legacy-position') && JSON.parse(localStorage.getItem('gutenberg-anchor-13')||'null')?.paragraph===120",timeout=60000)
      page.wait_for_function('readerAPI.getAnchor()?.paragraph===120')
      anchor=page.evaluate('readerAPI.getAnchor()')
      assert abs(anchor['offset']-old_point['offset'])<0.04,(engine,width,anchor,old_point,page.evaluate('window.migrationMetrics'),page.evaluate("({toolbar:document.querySelector('.reader-toolbar').offsetHeight,first:document.querySelector('.reading-block').getBoundingClientRect().top+scrollY})"))
      page.set_viewport_size({'width':1440 if width==375 else 375,'height':1000})
      page.locator('#displayToggle').click(); page.locator('[data-font=up]').click()
      page.wait_for_function('readerAPI.getAnchor()?.paragraph===120')
      reports.append({'browser':engine,'oldWidth':width,'paragraph':120,'pixelMigration':True,'fontAndViewport':True})
      page.close()
    browser.close()
out=ROOT/'output/reader-completion-qa';out.mkdir(parents=True,exist_ok=True)
(out/'position-migration.json').write_text(json.dumps(reports,indent=2),encoding='utf-8')
print(json.dumps(reports))
