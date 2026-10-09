// @ts-nocheck
(function () {
  'use strict';
  const $ = id => document.getElementById(id), api = window.readerAPI;
  const dialog = document.createElement('dialog'); dialog.id = 'readerToolsDialog'; dialog.className = 'vocabulary-dialog reader-tools-dialog'; dialog.setAttribute('aria-labelledby', 'readerToolsTitle');
  dialog.innerHTML = `<header class="vocabulary-header"><h2 id="readerToolsTitle">目录 · 导入 · 分享</h2><form method="dialog"><button class="speech-button">关闭 ×</button></form></header>
    <h3>阅读目录</h3><p class="vocabulary-hint">长篇按原有章节和阅读分段加载；“阅读分段”是加载单位。</p><div id="chapterList" class="chapter-list"></div>
    <h3>电子书</h3><div class="reader-tools-actions"><label for="epubImport">导入 EPUB<input id="epubImport" type="file" accept=".epub,application/epub+zip"></label><button id="epubExport" class="speech-button">下载德语原文 EPUB</button></div><p class="vocabulary-hint">导入无加密 EPUB，文件最多 8 MB。正文清洗后仅保存在本设备；清理浏览器会移除导入书籍。请使用有权阅读的文件。下载不含中文译文。</p>
    <h3>分享阅读位置</h3><div class="reader-tools-actions"><button id="readerShare" class="speech-button">系统分享</button><button id="readerCopy" class="speech-button">复制段落链接</button></div><label for="readerShareUrl">当前段落链接</label><input id="readerShareUrl" type="text" readonly><output id="readerToolsStatus" role="status"></output>`;
  document.body.append(dialog);
  const status = $('readerToolsStatus'); let captured = null, epubPromise;
  function loadEPUB() { if (!epubPromise) epubPromise = new Promise((resolve, reject) => { const script = document.createElement('script'); script.src = 'epub.js'; script.onload = () => resolve(window.ReaderEPUB); script.onerror = () => { epubPromise = null; script.remove(); reject(Error('EPUB 模块暂时无法加载，请重试。')); }; document.head.append(script); }); return epubPromise; }
  function shareURL() { const book = api.currentBook(); if (book.id.startsWith('local-')) return ''; const url = new URL(location.href); url.search = ''; url.searchParams.set('book', book.id); url.hash = 'paragraph-' + (captured?.paragraph || 1); return url.href; }
  function render() {
    const book = api.currentBook(), list = $('chapterList'); list.replaceChildren();
    (book.chapters || []).forEach(chapter => { const button = document.createElement('button'); button.type = 'button'; button.textContent = `${chapter.title} · ${chapter.from + 1}–${chapter.to + 1}`; button.setAttribute('aria-current', String(captured?.paragraph >= chapter.from + 1 && captured.paragraph <= chapter.to + 1)); button.addEventListener('click', async () => { dialog.close(); await api.goToParagraph(chapter.from + 1); }); list.append(button); });
    const url = shareURL(); $('readerShareUrl').value = url; $('readerShare').disabled = $('readerCopy').disabled = !url;
    status.textContent = !url ? '自导入书仅在本设备，不能用本站链接分享。可导出 EPUB。' : '';
  }
  $('readerToolsToggle').addEventListener('click', () => { api.savePosition(); captured = api.getAnchor(); render(); dialog.showModal(); });
  dialog.addEventListener('keydown', event => { if (event.key === 'Escape' && !event.isComposing) { event.preventDefault(); dialog.close(); } });
  dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
  $('epubImport').addEventListener('change', async event => {
    const input = event.target, file = input.files[0]; if (!file) return; input.disabled = true; status.textContent = '正在检查 EPUB…';
    try { const epub = await loadEPUB(), book = await epub.importBook(file); await ReaderShelf.save(book); dialog.close(); await api.selectBook(book.id); }
    catch (error) { status.textContent = '导入失败：' + error.message; } finally { input.disabled = false; input.value = ''; }
  });
  $('epubExport').addEventListener('click', async () => {
    const button = $('epubExport'); button.disabled = true; status.textContent = '正在准备整本德语原文…';
    try { const epub = await loadEPUB(), book = await api.fullBook(), bytes = epub.exportBook(book); const url = URL.createObjectURL(new Blob([bytes], { type: 'application/epub+zip' })); const link = document.createElement('a'); link.href = url; link.download = 'deutsch-' + book.id + '.epub'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 30000); status.textContent = '已生成 EPUB，下载由浏览器处理。'; }
    catch (error) { status.textContent = '导出失败：' + error.message; } finally { button.disabled = false; }
  });
  async function copy() { try { await navigator.clipboard.writeText(shareURL()); status.textContent = '已复制当前段落链接。'; } catch { $('readerShareUrl').focus(); $('readerShareUrl').select(); status.textContent = '请复制上方已选中的链接。'; } }
  $('readerCopy').addEventListener('click', copy);
  $('readerShare').addEventListener('click', async () => { if (!navigator.share) { await copy(); return; } try { await navigator.share({ title: api.currentBook().germanTitle, url: shareURL() }); status.textContent = '已打开系统分享。'; } catch (error) { if (error.name !== 'AbortError') await copy(); } });
  function updateNaturalLink() { const url = new URL(location.href); url.searchParams.set('listen', '1'); url.searchParams.set('book', api.currentBook().id); url.hash = 'paragraph-' + (api.getAnchor()?.paragraph || 1); $('naturalReader').href = url.href; }
  $('naturalReader').addEventListener('click', updateNaturalLink); document.addEventListener('reader:ready', updateNaturalLink);
  if (new URLSearchParams(location.search).get('listen') === '1') {
    document.body.classList.add('natural-reading');
    const bar = document.createElement('nav'); bar.className = 'natural-reader-bar'; bar.setAttribute('aria-label','纯原文阅读');
    const back = document.createElement('a'); back.textContent = '← 返回完整阅读器'; back.href = location.href;
    back.addEventListener('click', () => { api.savePosition(); const url = new URL(location.href); url.searchParams.delete('listen'); url.hash = 'paragraph-' + (api.getAnchor()?.paragraph || 1); back.href = url.href; });
    const help = document.createElement('a'); help.textContent = 'Edge：右键正文 → 朗读（自然音色通常需联网） ↗'; help.href = 'https://www.microsoft.com/en-us/edge/features/read-aloud'; help.target = '_blank'; help.rel = 'noopener noreferrer';
    bar.append(back,help); document.body.prepend(bar);
  }
  $('readerToolsToggle').disabled = false;
})();
