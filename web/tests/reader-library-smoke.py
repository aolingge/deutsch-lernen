import argparse
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
    page.add_init_script("""(() => {
      class MockUtterance { constructor(text) { this.text = text; } }
      const voices = [{ name: 'Deutsch Teststimme', lang: 'de-DE' }];
      const synth = {
        paused: false, speaking: false, records: [],
        getVoices() { return voices; },
        addEventListener() {},
        cancel() { this.cancelCount = (this.cancelCount || 0) + 1; this.speaking = false; this.paused = false; },
        speak(utterance) { this.records.push(utterance); this.last = utterance; this.speaking = true; this.paused = false; },
        pause() { this.paused = true; },
        resume() { this.paused = false; }
      };
      Object.defineProperty(window, 'speechSynthesis', { value: synth, configurable: true });
      window.SpeechSynthesisUtterance = MockUtterance;
    })();""")
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    response = page.goto(args.base.rstrip('/') + '/reader/?book=13', wait_until='load')
    assert response.status == 200
    page.wait_for_function('window.GUTENBERG_BOOKS?.length === 20')
    assert page.locator('.book-card').count() == 20
    assert page.locator('#libraryTitle').inner_text() == '20 本德语读物'
    assert '161.4' in page.locator('#readingTime').inner_text()
    books = page.evaluate('window.GUTENBERG_BOOKS.map(b => ({id:b.id, paragraphs:b.paragraphs.length, difficulty:b.difficulty}))')
    records = page.evaluate("fetch('/reader/data/source-records.json').then(async response => { if (!response.ok) throw new Error('Source records unavailable'); return response.json(); })")
    checked = []
    for book in books[12:]:
        page.locator(f'[data-book="{book["id"]}"]').click()
        assert page.locator('.german').count() == book['paragraphs']
        assert page.locator('.translation').count() == 0
        link = page.get_by_role('link', name='下载完整 TXT')
        source_url = page.evaluate('(href) => new URL(href, location.href).href', link.get_attribute('href'))
        downloaded = page.evaluate("""async url => {
          const response = await fetch(url);
          const data = await response.arrayBuffer();
          const digest = await crypto.subtle.digest('SHA-256', data);
          const sha256 = [...new Uint8Array(digest)].map(value => value.toString(16).padStart(2, '0')).join('');
          return { status: response.status, sha256 };
        }""", source_url)
        assert downloaded['status'] == 200
        record = next(item for item in records if item['id'] == book['id'])
        assert downloaded['sha256'] == record['sha256']
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
    page.locator('[data-book="13"]').click()
    page.locator('#speechVoice').select_option(label='Deutsch Teststimme · de-DE')
    page.locator('#speechScope').select_option('selection')
    page.locator('#speechRate').fill('0.9')
    page.evaluate("""() => {
      const text = document.querySelector('.german').firstChild;
      const range = document.createRange();
      range.selectNodeContents(text.parentElement);
      const end = Math.min(35, text.textContent.length);
      range.setEnd(text, end);
      const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
    }""")
    page.locator('#speechPlay').click()
    page.wait_for_function('speechSynthesis.records.length === 1')
    spoken = page.evaluate('({text:speechSynthesis.last.text,lang:speechSynthesis.last.lang,rate:speechSynthesis.last.rate,voice:speechSynthesis.last.voice?.name})')
    assert spoken['text'] and spoken['lang'] == 'de-DE' and spoken['rate'] == 0.9 and spoken['voice'] == 'Deutsch Teststimme'
    page.locator('#speechPause').click()
    assert page.evaluate('speechSynthesis.paused') and page.locator('#speechPause').inner_text() == '继续'
    page.locator('#speechPause').click()
    assert not page.evaluate('speechSynthesis.paused')
    page.locator('#speechStop').click()
    assert page.locator('#speechStatus').inner_text() == '已停止朗读'
    assert page.evaluate('speechSynthesis.cancelCount') >= 1
    page.locator('#speechScope').select_option('current')
    page.locator('#speechSelect').click()
    assert page.locator('.reading-block.is-selected').count() == 1
    page.locator('#speechRate').fill('1.35')
    assert page.locator('#speechRateValue').inner_text() == '1.35×'
    page.locator('#speechPreview').click()
    page.wait_for_function('speechSynthesis.records.length === 2')
    preview = page.evaluate('({text:speechSynthesis.last.text,lang:speechSynthesis.last.lang,rate:speechSynthesis.last.rate,voice:speechSynthesis.last.voice?.name})')
    assert preview['text'].startswith('Guten Tag') and preview['lang'] == 'de-DE' and preview['rate'] == 1.35 and preview['voice'] == 'Deutsch Teststimme'
    page.locator('#speechStop').click()
    assert page.locator('#speechFollow').is_checked()
    page.locator('#speechScope').select_option('range')
    page.locator('#speechFrom').fill('2')
    page.locator('#speechTo').fill('3')
    page.locator('#speechPlay').click()
    page.wait_for_function('speechSynthesis.records.length === 3')
    assert '第 2–3 段' in page.locator('#speechStatus').inner_text()
    page.locator('#speechStop').click()
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
    page.set_viewport_size({'width': 375, 'height': 900})
    page.locator('[data-book="01"]').click()
    page.locator('[data-translation="show"]').click()
    assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth'), 'Translation overflow at 375px'
    page.locator('[data-translation="hover"]').click()
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
    result = {'status':'passed','base':args.base,'books':len(books),'newBooksChecked':checked,'downloadHashes':'matched','speech':'play/pause/resume/stop/voice/rate/selection passed with browser API mock','viewports':layouts,'errors':errors}
    (out / 'report.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf8')
    print(json.dumps(result, ensure_ascii=False))
    browser.close()
