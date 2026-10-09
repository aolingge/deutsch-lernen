"""Chapters, local EPUB, original text export, sharing and real encrypted sync."""
import io
import json
import os
import zipfile
import xml.etree.ElementTree as ET
from playwright.sync_api import sync_playwright
from browser_support import ROOT, launch_browser, duplicate_ids

base = os.environ.get('RESOURCE_HUB_BASE', 'http://127.0.0.1:4361').rstrip('/')
out = ROOT / 'output/reader-completion-qa'
out.mkdir(parents=True, exist_ok=True)
browsers = os.environ.get('RESOURCE_HUB_BROWSERS', 'chromium,firefox,webkit').split(',')
mock = """(() => {
  if(window.__readerSpeechMock) return; window.__readerSpeechMock=true;
  window.SpeechSynthesisUtterance=class {constructor(text){this.text=text}};
  const synth={paused:false, records:[],last:null,getVoices:()=>[
    {name:'Local German',lang:'de-DE',localService:true},
    {name:'Natural German',lang:'de-DE',localService:false}],
    addEventListener(){},cancel(){this.last=null;this.paused=false},
    speak(u){this.records.push(u.text);this.last=u;u.onstart?.()},pause(){this.paused=true},resume(){this.paused=false}};
  Object.defineProperty(window,'speechSynthesis',{value:synth,configurable:true});
})();"""

def load(page, book='13', extra=''):
    page.goto(base + '/reader/?book=' + book + extra, wait_until='domcontentloaded', timeout=60000)
    page.wait_for_function("document.querySelector('#readingContent')?.dataset.ready==='true' && !document.querySelector('#readerSyncToggle').disabled", timeout=60000)
    page.wait_for_timeout(150)

def epub_fixture(extra=False, mixed=False):
    target=io.BytesIO()
    with zipfile.ZipFile(target, 'w', compression=zipfile.ZIP_DEFLATED) as z:
        z.writestr('mimetype','application/epub+zip',compress_type=zipfile.ZIP_STORED)
        z.writestr('META-INF/container.xml','<container><rootfiles><rootfile full-path="OPS/package.opf"/></rootfiles></container>')
        z.writestr('OPS/package.opf','<package><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>Eine &lt;Probe&gt;</dc:title><dc:creator>Testautor</dc:creator></metadata><manifest><item id="one" href="one.xhtml" media-type="application/xhtml+xml"/><item id="two" href="two.xhtml" media-type="application/xhtml+xml"/></manifest><spine><itemref idref="two"/><itemref idref="one"/></spine></package>')
        content='<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml"><body><h1>Erstes Kapitel</h1><p onclick="window.bad=true">Der erste Text mit &auml;, ö, ü und ß.</p><script>window.bad=true</script><img src="https://example.invalid/private"/></body></html>'
        if mixed:
            content='<html xmlns="http://www.w3.org/1999/xhtml"><body><p>Ein Absatz.</p><div>Nur div Text</div><ul><li>Elterntext<ul><li>Kindtext</li></ul>Nachtext</li></ul><p>Endabsatz</p></body></html>'
        z.writestr('OPS/one.xhtml',content)
        z.writestr('OPS/two.xhtml','<html xmlns="http://www.w3.org/1999/xhtml"><body><h1>Zweites Kapitel</h1><p>Der zweite Text kommt zuerst.</p></body></html>')
        if extra: z.writestr('../danger.txt','unsafe')
    return target.getvalue()

reports=[]
with sync_playwright() as p:
  for name in browsers:
    print('Checking completion: '+name,flush=True)
    browser=launch_browser(p,name)
    context=browser.new_context(viewport={'width':1440,'height':1000},accept_downloads=True)
    context.add_init_script(mock)
    page=context.new_page(); errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    requested=[]; page.on('request',lambda r:requested.append(r.url))
    load(page)
    assert not any(r.endswith('/13.json') for r in requested)
    chapter=page.evaluate('readerAPI.currentBook().chapters[0]')
    last=chapter['to']+1
    page.evaluate('(n)=>readerAPI.goToParagraph(n)',last)
    page.locator('#speechToggle').click()
    page.locator('#speechNatural').click()
    assert 'Natural German' in page.locator('#speechVoiceInfo').inner_text()
    page.locator('#speechScope').select_option('range')
    page.locator('#speechFrom').fill(str(last))
    page.locator('#speechTo').fill(str(last+1))
    page.locator('#speechTo').press('Tab')
    page.locator('#speechPlay').click()
    try: page.wait_for_function('speechSynthesis.records.length>0',timeout=15000)
    except Exception:
      print(page.evaluate("({status:document.getElementById('speechStatus').textContent,scope:document.getElementById('speechScope').value,from:document.getElementById('speechFrom').value,to:document.getElementById('speechTo').value,ready:document.getElementById('readingContent').dataset.ready,paragraphs:[...document.querySelectorAll('.reading-block')].map(p=>p.id)})"),flush=True)
      raise
    for _ in range(150):
      active=page.evaluate("() => { const u=speechSynthesis.last; if(!u) return false; speechSynthesis.last=null;u.onend?.();return true; }")
      page.wait_for_timeout(200)
      if page.locator('#speechStop').is_disabled(): break
    else: raise AssertionError('Speech never completed')
    full=page.evaluate('readerAPI.fullBook().then(b=>b.paragraphs.map(p=>p.de))')
    spoken=page.evaluate("speechSynthesis.records.join(' ')")
    assert ''.join(spoken.split()) == ''.join(' '.join(full[last-1:last+1]).split()), {'spoken':spoken[:300], 'expected':' '.join(full[last-1:last+1])[:300], 'count':page.evaluate('speechSynthesis.records.length'), 'status':page.locator('#speechStatus').inner_text()}
    assert page.locator('#paragraph-'+str(last+1)).count()==1
    # Paragraph selection and font changes work across loading boundaries.
    page.evaluate('(n)=>readerAPI.goToParagraph(n)',last)
    page.evaluate('(n)=>document.getElementById("paragraph-"+n).click()',last)
    if page.locator('#speechOptions').is_hidden(): page.locator('#speechToggle').click()
    page.locator('#speechNext').click()
    page.wait_for_function('(n)=>document.getElementById("paragraph-"+n)?.classList.contains("is-selected")',arg=last+1)
    assert page.locator('#paragraph-'+str(last+1)).get_attribute('class').find('is-selected')>=0
    if page.locator('#displayOptions').is_hidden(): page.locator('#displayToggle').click()
    page.locator('[data-font=up]').click()
    page.wait_for_function("document.querySelector('#readingContent').dataset.ready==='true'")
    page.locator('#readerToolsToggle').click()
    assert page.locator('#chapterList button').count()==page.evaluate('readerAPI.currentBook().chapters.length')
    assert '#paragraph-' in page.locator('#readerShareUrl').input_value()
    page.evaluate("() => { Object.defineProperty(navigator,'clipboard',{value:{writeText:()=>Promise.reject(Error())},configurable:true}); }")
    page.locator('#readerCopy').click()
    assert '复制上方' in page.locator('#readerToolsStatus').inner_text()
    page.keyboard.press('Escape'); assert not page.locator('#readerToolsDialog').is_visible()
    # Export the original public book and verify its exact text and EPUB spine.
    page.locator('#readerToolsToggle').click()
    with page.expect_download() as event: page.locator('#epubExport').click()
    with zipfile.ZipFile(event.value.path()) as z:
      assert z.infolist()[0].filename=='mimetype' and z.infolist()[0].compress_type==zipfile.ZIP_STORED
      opf=ET.fromstring(z.read('EPUB/package.opf'))
      manifest={el.attrib['id']:el.attrib['href'] for el in opf.findall('.//{*}item')}
      exported=[]
      for el in opf.findall('.//{*}itemref'):
        doc=ET.fromstring(z.read('EPUB/'+manifest[el.attrib['idref']]))
        exported.extend(''.join(el.itertext()) for el in doc.findall('.//{*}p'))
      assert exported==full
    # Compressed EPUB is sanitized and follows the spine, not manifest order.
    page.locator('#epubImport').set_input_files({'name':'probe.epub','mimeType':'application/epub+zip','buffer':epub_fixture()})
    page.wait_for_function("document.querySelector('#bookNumber').dataset.bookId.startsWith('local-') && document.querySelector('#readingContent').dataset.ready==='true'")
    imported=page.evaluate('readerAPI.currentBook().id')
    assert page.locator('#bookTitle').inner_text()=='Eine <Probe>'
    assert page.locator('.german').first.inner_text()=='Zweites Kapitel'
    assert not page.evaluate('window.bad') and page.locator('#readingContent img, #readingContent script').count()==0
    load(page,imported)
    assert page.evaluate('readerAPI.currentBook().paragraphCount')==4
    page.locator('#readerToolsToggle').click()
    assert page.locator('#readerShare').is_disabled()
    page.locator('#epubImport').set_input_files({'name':'bad.epub','mimeType':'application/epub+zip','buffer':epub_fixture(True)})
    page.wait_for_function("document.getElementById('readerToolsStatus').textContent.startsWith('导入失败')")
    assert page.evaluate('GUTENBERG_BOOKS.length')==21
    page.locator('#epubImport').set_input_files({'name':'mixed.epub','mimeType':'application/epub+zip','buffer':epub_fixture(mixed=True)})
    page.wait_for_function("readerAPI.currentBook().paragraphs?.some(p=>p.de==='Ein Absatz.') && document.querySelector('#readingContent').dataset.ready==='true'")
    text=page.evaluate("readerAPI.currentBook().paragraphs.map(p=>p.de).join('\\n')")
    expected=['Ein Absatz.','Nur div Text','Elterntext','Kindtext','Nachtext','Endabsatz']
    assert all(value in text for value in expected),text
    assert [text.index(value) for value in expected]==sorted(text.index(value) for value in expected)
    page.keyboard.press('Escape')
    # Mobile defaults, dialogs, overflow and keyboard accessibility.
    load(page)
    for width in (320,375,768,1440):
      page.set_viewport_size({'width':width,'height':1000}); page.evaluate('scrollTo(0,0)')
      assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(name,width)
      if width<=768:
        assert page.locator('#libraryBody').is_hidden()
        page.locator('#libraryToggle').click(); assert page.locator('#libraryBody').is_visible()
        page.locator('#libraryToggle').click(); assert page.locator('#libraryBody').is_hidden()
      page.locator('#readerToolsToggle').click()
      assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
      page.keyboard.press('Escape')
      if name=='chromium': page.screenshot(path=str(out/f'reader-{width}.png'))
    assert not duplicate_ids(page)
    if name=='chromium':
      page.add_script_tag(path=str(ROOT/'node_modules/axe-core/axe.min.js'))
      for modal in (None,'readerToolsToggle','readerSyncToggle'):
        if modal: page.locator('#'+modal).click()
        violations=page.evaluate("async()=> (await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}))")
        assert not violations,violations
        if modal: page.keyboard.press('Escape')
    load(page,'13','&listen=1'); assert page.locator('body').get_attribute('class').find('natural-reading')>=0
    assert page.locator('.reader-toolbar').is_hidden() and page.locator('.translation:visible').count()==0
    # Two isolated device contexts exchange ciphertext through the actual Worker API.
    if name=='chromium':
      load(page)
      page.evaluate("ReaderVocabulary.mergeItems([{term:'Probe',meaning:'本地释义',context:'Öffentlicher Testsatz.',bookId:'13',paragraph:2}],true)")
      page.evaluate('(id)=>ReaderVocabulary.mergeItems([{term:"Privatwort",meaning:"private",context:"PRIVATE_EPUB_TEXT",bookId:id,paragraph:2}],true)',imported)
      page.evaluate('(n)=>readerAPI.goToParagraph(n)',last+2)
      page.locator('#readerSyncToggle').click(); page.locator('#syncCreate').click()
      transfer=page.locator('#syncCode').input_value()
      assert transfer.startswith('dr1.') and page.locator('#syncCode').get_attribute('type')=='password'
      page.locator('#syncUpload').click()
      page.wait_for_function("document.getElementById('readerSyncStatus').textContent.includes('已合并并上传')",timeout=60000)
      other=browser.new_context(viewport={'width':1440,'height':1000}); other.add_init_script(mock)
      second=other.new_page(); load(second)
      second.evaluate("ReaderVocabulary.mergeItems([{term:'Probe',meaning:'另一设备释义'}],true)")
      second.locator('#readerSyncToggle').click()
      second.locator('#syncCode').fill(transfer[:-1]+('0' if transfer[-1]!='0' else '1'))
      second.locator('#syncConnect').click()
      second.wait_for_function("document.getElementById('readerSyncStatus').textContent.includes('无法解密')")
      assert second.evaluate('ReaderVocabulary.exportItems().length')==1
      restored=page.evaluate("ReaderVocabulary.exportItems().find(item=>item.term==='Privatwort')")
      restored['term']='RestoredPrivate'
      second.locator('#vocabularyImport').set_input_files({'name':'local-backup.json','mimeType':'application/json','buffer':json.dumps({'version':1,'items':[restored]}).encode()})
      second.wait_for_function("ReaderVocabulary.exportItems().some(item=>item.term==='RestoredPrivate')")
      assert second.evaluate("ReaderVocabulary.exportItems().find(item=>item.term==='RestoredPrivate').bookId")==imported
      second.locator('#syncCode').fill(transfer)
      second.locator('#syncConnect').click()
      second.wait_for_function("document.getElementById('readerSyncStatus').textContent.includes('已验证同步码')")
      second.locator('#syncDownload').click()
      second.wait_for_function("document.getElementById('readerSyncStatus').textContent.includes('已下载并合并')")
      items=second.evaluate('ReaderVocabulary.exportItems()')
      assert not any(i['term']=='Privatwort' for i in items)
      word=next(i for i in items if i['term']=='Probe'); assert '本地释义' in word['meaning'] and '另一设备释义' in word['meaning']
      assert second.evaluate("JSON.parse(localStorage.getItem('gutenberg-anchor-13')).paragraph")==last+2
      # Verify no private imported-book context is in the outbound encrypted snapshot.
      second.locator('#syncUpload').click()
      second.wait_for_function("document.getElementById('readerSyncStatus').textContent.includes('已合并并上传')")
      page.locator('#syncDownload').click()
      page.wait_for_function("document.getElementById('readerSyncStatus').textContent.includes('已下载并合并')")
      assert '另一设备释义' in next(i for i in page.evaluate('ReaderVocabulary.exportItems()') if i['term']=='Probe')['meaning']
      assert not any(i['term']=='RestoredPrivate' for i in page.evaluate('ReaderVocabulary.exportItems()'))
      other.close()
    assert not errors,errors
    reports.append({'browser':name,'chapters':True,'speechAcrossBoundary':True,'EPUBSpineAndSanitization':True,'EPUBOriginalExport':True,'sharingFallback':True,'responsive':True,'encryptedSync':name=='chromium','errors':errors})
    context.close(); browser.close()
(out/'report.json').write_text(json.dumps({'base':base,'checks':reports},ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(reports,ensure_ascii=False))
