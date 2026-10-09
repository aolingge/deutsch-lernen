// @ts-nocheck
(function () {
  "use strict";
  function storageUnavailable() { const note = document.querySelector(".reader-footer span:last-child"); if (note) note.textContent = "浏览器存储不可用：当前进度与设置无法保存，请先备份生词。"; }
  function readSetting(key) { try { return localStorage.getItem(key); } catch { storageUnavailable(); return null; } }
  function writeSetting(key, value) { try { localStorage.setItem(key, value); return true; } catch { storageUnavailable(); return false; } }
  const books = window.GUTENBERG_BOOKS || [];
  books.forEach(book => { book.paragraphCount = book.paragraphCount || book.paragraphs.length; book.chapters = book.chapters || ReaderCore.segments(book.paragraphs); book.translatedParagraphs = book.paragraphs ? book.paragraphs.filter(item => String(item.zh || '').trim()).length : book.translatedParagraphs || 0; });
  const savedTranslation = readSetting("gutenberg-translation-v2");
  const requestedBook = new URLSearchParams(window.location.search).get("book");
  const initialBook = books.find(book => book.id === requestedBook)?.id || books.find(book => book.id === readSetting("gutenberg-book"))?.id || books[0]?.id;
  const state = { bookId: initialBook, translation: new URLSearchParams(location.search).get("listen") === "1" ? "hide" : savedTranslation === "hide" || savedTranslation === "show" ? savedTranslation : "hover", theme: readSetting("gutenberg-theme") || "paper", fontSize: Number(readSetting("gutenberg-font-size") || 20) };
  const speechEngine = "speechSynthesis" in window ? window.speechSynthesis : null;
  const speechSupported = Boolean(speechEngine && "SpeechSynthesisUtterance" in window);
  const storedSpeechRate = Number(readSetting("gutenberg-speech-rate") || 1);
  const normalizedSpeechRate = Number.isFinite(storedSpeechRate) ? Math.min(1.8, Math.max(0.5, Math.round(storedSpeechRate * 20) / 20)) : 1;
  const storedSpeechScope = readSetting("gutenberg-speech-scope");
  const storedSpeechFrom = Number(readSetting("gutenberg-speech-from") || 1);
  const storedSpeechTo = Number(readSetting("gutenberg-speech-to") || 1);
  const speechState = { token: 0, chunks: [], chunkIndex: 0, blockIndex: null, blockEndIndex: null, selectedBlockIndex: null, active: false, previewing: false, rangeActive: false, selectedText: "", rate: normalizedSpeechRate, voiceName: readSetting("gutenberg-speech-voice") || "", autoplay: readSetting("gutenberg-speech-autoplay") === "true", follow: readSetting("gutenberg-speech-follow") !== "false", scope: storedSpeechScope === "selection" || storedSpeechScope === "range" ? storedSpeechScope : "current", rangeFrom: Number.isFinite(storedSpeechFrom) ? Math.max(1, Math.round(storedSpeechFrom)) : 1, rangeTo: Number.isFinite(storedSpeechTo) ? Math.max(1, Math.round(storedSpeechTo)) : 1 };
  let currentBlockElement = null;
  const $ = (selector) => document.querySelector(selector);
  const els = { list: $("#bookList"), title: $("#bookTitle"), meta: $("#bookMeta"), route: $("#bookRoute"), number: $("#bookNumber"), total: $("#bookTotal"), count: $("#bookCount"), readingTime: $("#readingTime"), libraryTitle: $("#libraryTitle"), level: $("#levelFilter"), length: $("#lengthFilter"), content: $("#readingContent"), notice: $("#translationNotice"), bar: $("#progressBar"), progress: $("#progressText"), size: $("#fontSizeLabel"), search: $("#bookSearch"), speechToggle: $("#speechToggle"), speechMenu: $("#speechOptions"), speechSelect: $("#speechSelect"), speechPrev: $("#speechPrev"), speechNext: $("#speechNext"), speechPlay: $("#speechPlay"), speechPause: $("#speechPause"), speechStop: $("#speechStop"), speechPreview: $("#speechPreview"), speechScope: $("#speechScope"), speechTarget: $("#speechTarget"), speechRange: $("#speechRange"), speechFrom: $("#speechFrom"), speechTo: $("#speechTo"), speechVoice: $("#speechVoice"), speechVoiceInfo: $("#speechVoiceInfo"), speechRate: $("#speechRate"), speechRateValue: $("#speechRateValue"), speechAutoplay: $("#speechAutoplay"), speechFollow: $("#speechFollow"), speechStatus: $("#speechStatus") };
  const clean = (value) => String(value || "").replace(/\s+/g, " ").trim();
  function currentBook() { return books.find((book) => book.id === state.bookId) || books[0]; }
  const totalWords = books.reduce((sum, book) => sum + Number(book.wordCount || 0), 0);
  const totalHours = totalWords / 120 / 60;
  function readingTimeText() { const totalWords = books.reduce((sum, book) => sum + Number(book.wordCount || 0), 0), totalHours = totalWords / 7200; return `原文 ${totalWords.toLocaleString("zh-CN")} 词 · 约 ${totalHours.toFixed(1)} 小时（120 词/分钟）`; }
  function save() { writeSetting("gutenberg-book", state.bookId); writeSetting("gutenberg-translation-v2", state.translation); writeSetting("gutenberg-theme", state.theme); writeSetting("gutenberg-font-size", String(state.fontSize)); writeSetting("gutenberg-speech-rate", String(speechState.rate)); writeSetting("gutenberg-speech-voice", speechState.voiceName); writeSetting("gutenberg-speech-autoplay", String(speechState.autoplay)); writeSetting("gutenberg-speech-follow", String(speechState.follow)); writeSetting("gutenberg-speech-scope", speechState.scope); writeSetting("gutenberg-speech-from", String(speechState.rangeFrom)); writeSetting("gutenberg-speech-to", String(speechState.rangeTo)); const url = new URL(window.location.href); if (url.searchParams.get("book") && url.searchParams.get("book") !== state.bookId) url.hash = ""; url.searchParams.set("book", state.bookId); history.replaceState(null, "", url); }
  function positionKey() { return `gutenberg-position-${state.bookId}`; }
  function selectedBlockKey() { return `gutenberg-reading-block-${state.bookId}`; }
  function positionAnchor() {
    const blocks = [...els.content.querySelectorAll('.reading-block')];
    const block = blocks.find(el => el.getBoundingClientRect().bottom > 130) || blocks.at(-1);
    if (!block) return null;
    const rect = block.getBoundingClientRect();
    return { version: 2, paragraph: Number(block.dataset.index) + 1, offset: Math.max(0, Math.min(1, (130 - rect.top) / Math.max(1, rect.height))), updatedAt: Date.now() };
  }
  function savedAnchor(book = currentBook()) { try { return ReaderCore.anchor(JSON.parse(readSetting('gutenberg-anchor-' + book.id) || 'null'), book.paragraphCount); } catch { return null; } }
  function savePosition() {
    if (els.content.dataset.ready !== 'true' || document.body.classList.contains('legacy-position') || document.body.classList.contains('library-open')) return;
    const value = positionAnchor(), old = savedAnchor();
    if (value && !(value.paragraph === 1 && value.offset === 0 && document.querySelector('.reading-block')?.getBoundingClientRect().top > 130)) {
      if (old && old.paragraph === value.paragraph && Math.abs(old.offset - value.offset) < 0.01) value.updatedAt = old.updatedAt;
      writeSetting('gutenberg-anchor-' + state.bookId, JSON.stringify(value));
    }
    writeSetting(positionKey(), String(Math.round(window.scrollY)));
  }
  function closeLibrary() { document.body.classList.remove('library-open'); $('#libraryToggle').setAttribute('aria-expanded', 'false'); }
  function renderBooks() {
    const query = clean(els.search.value).toLowerCase();
    const level = els.level.value; const length = els.length.value;
    const filtered = books.filter((book) => `${book.title} ${book.germanTitle} ${book.author}`.toLowerCase().includes(query) && (!level || String(book.difficulty || book.level).includes(level)) && (!length || book.length === length));
    els.count.textContent = `${filtered.length} / ${books.length} 本书 · 推荐先读短篇，再进入中长篇`;
    els.readingTime.textContent = readingTimeText();
    els.libraryTitle.textContent = `${books.length} 本德语读物`;
    els.list.innerHTML = filtered.map((book) => `<button class="book-card ${book.id === state.bookId ? "active" : ""}" type="button" data-book="${book.id}"><span class="book-card-top"><span>${book.imported ? "本地" : book.id} · ${book.difficulty || book.level}</span><span>${book.length || ""}</span></span><h2>${escapeHtml(book.title)}</h2><p>${escapeHtml(book.germanTitle)} · ${escapeHtml(book.author)}</p><span class="book-status ${book.translationStatus === "not-imported" ? "pending" : ""}">${book.translatedParagraphs ? `已导入 ${book.translatedParagraphs} / ${book.paragraphCount || book.paragraphs.length} 段译文` : "德语原文"} · 约 ${(book.wordCount / 7200).toFixed(1)} 小时</span></button>`).join("") || `<p class="library-note">没有匹配的书目。</p>`;
    els.list.querySelectorAll("[data-book]").forEach((button) => button.addEventListener("click", () => { stopSpeech("已停止朗读"); savePosition(); clearTimeout(scrollSaveTimer); state.bookId = button.dataset.book; save(); closeLibrary(); renderBooks(); renderReader(); }));
  }
  const bookRequests = new Map();
  let readerRequest = 0;
  async function fullBook(book = currentBook()) {
    if (book.paragraphs) return { ...book, paragraphs: book.paragraphs };
    const response = await fetch(book.dataUrl); if (!response.ok) throw Error('Book unavailable');
    const data = await response.json(); if (data.id !== book.id || !Array.isArray(data.paragraphs) || data.paragraphs.length !== book.paragraphCount || data.paragraphs.some(p => !p || typeof p.de !== 'string' || (p.zh != null && typeof p.zh !== 'string'))) throw Error('Invalid book data');
    return data;
  }
  function chapterFor(book, paragraph) { return Math.max(0, book.chapters.findIndex(part => paragraph - 1 >= part.from && paragraph - 1 <= part.to)); }
  async function loadChapter(book, index) {
    const chapter = book.chapters[index];
    if (book.paragraphs) return { from: chapter.from, paragraphs: book.paragraphs.slice(chapter.from, chapter.to + 1) };
    const key = book.id + ':' + index;
    if (!bookRequests.has(key)) bookRequests.set(key, fetch(chapter.url).then(async response => {
      if (!response.ok) throw Error('Book unavailable'); const data = await response.json();
      if (data.id !== book.id || data.from !== chapter.from || !Array.isArray(data.paragraphs) || data.paragraphs.length !== chapter.to - chapter.from + 1 || data.paragraphs.some(p => typeof p.de !== 'string' || (p.zh != null && typeof p.zh !== 'string'))) throw Error('Invalid chapter');
      return data;
    }).catch(error => { bookRequests.delete(key); throw error; }));
    return await bookRequests.get(key);
  }
  async function goToParagraph(paragraph, bookId = state.bookId) {
    if (!books.some(book => book.id === bookId)) return false;
    savePosition(); stopSpeech(); state.bookId = bookId; save(); closeLibrary(); renderBooks();
    const url = new URL(location.href); url.hash = 'paragraph-' + Math.min(currentBook().paragraphCount, Math.max(1, Number(paragraph) || 1)); history.replaceState(null, '', url);
    await renderReader({ paragraph: Number(url.hash.slice(11)) }); return els.content.dataset.ready === 'true';
  }
  async function renderReader(options = {}) {
    const book = currentBook();
    if (!book) return;
    const request = ++readerRequest;
    const previous = options.anchor || savedAnchor(book);
    const hashParagraph = /^#paragraph-\d+$/.test(location.hash) ? Number(location.hash.slice(11)) : null;
    const paragraph = Math.min(book.paragraphCount, Math.max(1, options.paragraph || (options.retain ? previous?.paragraph : hashParagraph) || previous?.paragraph || 1));
    const legacyPosition = !previous && !hashParagraph && !options.paragraph ? Number(readSetting(positionKey()) || 0) : 0;
    const chapterIndex = chapterFor(book, paragraph); state.chapterIndex = chapterIndex;
    let visible;

    if (speechState.active && !options.keepSpeech) stopSpeech("已停止朗读");
    setSpeechMenuOpen(false);
    speechState.selectedText = "";
    const savedBlockIndex = readSetting(selectedBlockKey());
    speechState.selectedBlockIndex = savedBlockIndex !== null && /^\d+$/.test(savedBlockIndex) ? Number(savedBlockIndex) : null;
    currentBlockElement = null;
    els.title.textContent = book.title;
    els.meta.textContent = `${book.germanTitle} · ${book.author}  /  ${book.level} · ${book.study}`;
    els.route.textContent = `${book.difficulty || book.level} · ${book.length || "篇幅未标注"} · ${book.genre || "文学"} · ${book.chapterCount ? `${book.chapterCount} 章` : "按段落"} · 约 ${(book.wordCount / 7200).toFixed(1)} 小时`;
    els.number.textContent = book.imported ? '本地' : book.id; els.number.dataset.bookId = book.id;
    els.total.textContent = `/ ${books.length}`;
    els.notice.hidden = false;
    els.notice.textContent = book.imported ? "自导入 EPUB · 原文保存在当前设备。导出与保存生词可用；本站链接无法分享这本书。" : book.translatedParagraphs ? `已导入 ${book.translatedParagraphs} / ${book.paragraphCount || book.paragraphs.length} 段译文。中文为机器翻译，遇到疑问请结合德语原文理解；数字、网址等内容可能仅保留原文。` : "德语原文 · 无中文译文。等级为编辑估计，历史原著可能含旧拼写。阅读时长按每分钟 120 词估算。";
    const sourceLinks = $("#bookSources");
    sourceLinks.replaceChildren();
    [["原文来源", book.sourceUrl], ["许可说明", book.licenseUrl], ["下载完整 TXT", book.downloadUrl]].forEach(([label, href]) => {
      if (!href) return;
      const link = document.createElement("a");
      link.textContent = label;
      link.href = href;
      if (label === "下载完整 TXT") link.download = "";
      else { link.target = "_blank"; link.rel = "noopener noreferrer"; }
      sourceLinks.append(link);
    });
    document.querySelectorAll('[data-chapter-step]').forEach(button => button.disabled = true);
    els.content.dataset.ready = "false";
    els.content.setAttribute("aria-busy", "true");
    els.content.textContent = "正在加载这本书的德语原文…";
    updateControls(); updateSpeechButtons();
    try {
      if (legacyPosition > 0) { const full = await fullBook(book); visible = { from: 0, paragraphs: full.paragraphs }; document.body.classList.add('legacy-position'); }
      else visible = await loadChapter(book, chapterIndex);
    }
    catch {
      if (request !== readerRequest) return;
      els.content.setAttribute("aria-busy", "false");
      els.content.textContent = "本书暂时无法加载，可以重试或下载完整 TXT。 ";
      const retry = document.createElement("button"); retry.type = "button"; retry.className = "speech-button"; retry.textContent = "重新加载";
      retry.addEventListener("click", renderReader); els.content.append(retry); return;
    }
    if (request !== readerRequest || state.bookId !== book.id) return;
    els.content.dataset.translationMode = state.translation;
    els.content.innerHTML = visible.paragraphs.map((item, localIndex) => { const index = visible.from + localIndex; const text = clean(item.de); const translation = clean(item.zh); const heading = text.length < 100 && (/^(Kapitel|Erstes|Zweites|Drittes|Viertes|Fünftes|Sechstes|Siebentes|Achtes|Neuntes|Zehntes|Inhalt|Personen|Gestalten|Teil|Das Ende)/i.test(text) || /^[A-ZÄÖÜ][^.!?]{2,70}$/.test(text)); const longTranslation = translation.length > 92 || text.length > 150; return `<section id="paragraph-${index + 1}" class="reading-block ${heading ? "is-heading" : ""}" data-index="${index}" data-reading-block="true" tabindex="0" aria-label="第 ${index + 1} 段${heading ? "，标题" : "，选择朗读"}"><p class="german">${escapeHtml(text)}</p>${translation ? `<span class="translation ${longTranslation ? "long" : "short"}" tabindex="0" role="button" aria-label="悬停或点击显示译文" ${state.translation === "hide" ? "hidden" : ""}>${escapeHtml(translation)}</span>` : ""}</section>`; }).join("");
    els.content.querySelectorAll(".translation").forEach((translation) => {
      translation.setAttribute("aria-expanded", String(state.translation === "show"));
      if (state.translation === "show") { translation.removeAttribute("role"); translation.removeAttribute("tabindex"); translation.removeAttribute("aria-label"); translation.removeAttribute("aria-expanded"); }
      translation.addEventListener("click", () => { if (state.translation === "hover") { const expanded=translation.classList.toggle("is-revealed"); translation.setAttribute("aria-expanded",String(expanded)); } });
      translation.addEventListener("keydown", event => { if(state.translation === "hover" && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); translation.click(); } });
    });
    els.content.dataset.ready = "true";
    els.content.setAttribute("aria-busy", "false");
    restoreSelectedBlock();
    updateSpeechButtons();
    updateControls();
    updateProgress();
    document.querySelectorAll('[data-chapter-step]').forEach(button => button.disabled = Number(button.dataset.chapterStep) < 0 ? chapterIndex === 0 : chapterIndex === book.chapters.length - 1);
    $('#chapterLabel').textContent = `${chapterIndex + 1} / ${book.chapters.length} · 第 ${book.chapters[chapterIndex].from + 1}–${book.chapters[chapterIndex].to + 1} 段`;
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    if (request !== readerRequest) { document.body.classList.remove('legacy-position'); return; }
    if (legacyPosition > 0) {
      window.scrollTo({ top: legacyPosition, behavior: 'instant' }); const converted = positionAnchor();
      document.body.classList.remove('legacy-position');
      if (converted) { writeSetting('gutenberg-anchor-' + book.id, JSON.stringify(converted)); await renderReader({ anchor: converted, retain: true }); } return;
    }
    const target = document.getElementById('paragraph-' + paragraph);
    if (target && (previous || hashParagraph || options.paragraph)) { const top = target.getBoundingClientRect().top + scrollY; window.scrollTo({ top: Math.max(0, top + (previous?.paragraph === paragraph ? previous.offset * target.offsetHeight : 0) - 130), behavior: 'instant' }); }
    else window.scrollTo({ top: 0, behavior: 'instant' });
    updateProgress(); updateCurrentBlock(); document.dispatchEvent(new CustomEvent('reader:ready', { detail: { bookId: book.id } }));
  }

  function escapeHtml(value) { return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char])); }
  function updateControls() {
    document.querySelectorAll("[data-translation]").forEach((button) => button.setAttribute("aria-pressed", String((button.dataset.translation === state.translation))));
    document.querySelectorAll("[data-theme]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.theme === state.theme)));
    document.body.classList.toggle("theme-dark", state.theme === "dark");
    if (state.theme === "green") document.body.style.setProperty("--bg", "#e3eddd"); else if (state.theme === "paper") document.body.style.setProperty("--bg", "#f3efe5"); else document.body.style.removeProperty("--bg");
    document.documentElement.style.setProperty("--font-size", `${state.fontSize}px`); els.size.textContent = state.fontSize;
  }
  function updateProgress() { const value = positionAnchor(); const percent = value ? Math.round(100 * (value.paragraph - 1 + value.offset) / currentBook().paragraphCount) : 0; els.bar.style.width = `${percent}%`; els.progress.textContent = `${percent}%`; }
  function currentReadingBlock() { const x = Math.floor(window.innerWidth * 0.62); const toolbarBottom = document.querySelector(".reader-toolbar")?.getBoundingClientRect().bottom || 0; const y = Math.min(Math.max(150, toolbarBottom + 20), window.innerHeight - 1); const block = document.elementFromPoint(x, y)?.closest(".reading-block"); return block && els.content.contains(block) ? block : currentBlockElement?.isConnected ? currentBlockElement : els.content.querySelector(".reading-block"); }
  function selectedReadingBlock() { if (!Number.isInteger(speechState.selectedBlockIndex)) return null; return els.content.querySelector(`[data-reading-block][data-index="${speechState.selectedBlockIndex}"]`); }
  function selectReadingBlock(block, announce = true) { if (!block || !els.content.contains(block)) return null; els.content.querySelectorAll(".reading-block.is-selected").forEach(item => item.classList.remove("is-selected")); block.classList.add("is-selected"); speechState.selectedBlockIndex = Number(block.dataset.index); writeSetting(selectedBlockKey(), String(speechState.selectedBlockIndex)); updateSpeechLabels(); if (announce) setSpeechStatus(`已选择第 ${speechState.selectedBlockIndex + 1} 段；可朗读当前段或勾选连续读`); return block; }
  function restoreSelectedBlock() { const block = selectedReadingBlock(); if (block) block.classList.add("is-selected"); updateSpeechLabels(); }
  function updateCurrentBlock() { const block = currentReadingBlock(); if (!block) return null; const index = Number(block.dataset.index); if (currentBlockElement !== block) { currentBlockElement?.classList.remove("is-current"); block.classList.add("is-current"); currentBlockElement = block; } if (!speechState.active) speechState.blockIndex = index; return block; }
  function setSpeechStatus(message) { if (els.speechStatus) els.speechStatus.textContent = message; }
  function setSpeechMenuOpen(open) { if (!els.speechToggle || !els.speechMenu) return; els.speechMenu.hidden = !open; els.speechToggle.setAttribute("aria-expanded", String(open)); els.speechToggle.classList.toggle("is-open", open); }
  function formatRate(rate) { return `${Number(rate).toFixed(2)}×`; }
  function speechChunks(text) {
    const sentences = String(text || "").replace(/\s+/g, " ").trim().match(/[^.!?。！？;；:：]+[.!?。！？;；:：]+|[^.!?。！？;；:：]+$/gu) || [];
    const chunks = []; let current = "";
    const add = part => { const value = part.trim(); if (!value) return; if (value.length <= 240) { if (current && `${current} ${value}`.length > 240) { chunks.push(current); current = value; } else current = current ? `${current} ${value}` : value; return; } value.split(/\s+/).forEach(word => { if (current && `${current} ${word}`.length > 240) { chunks.push(current); current = word; } else current = current ? `${current} ${word}` : word; }); };
    sentences.forEach(add); if (current) chunks.push(current); return chunks;
  }
  function germanElement(node) { const element = node?.nodeType === 1 ? node : node?.parentElement; return element?.closest?.(".german") || null; }
  function selectedReadingText() { const selection = window.getSelection(); if (!selection || selection.isCollapsed || !selection.rangeCount || !els.content.contains(selection.anchorNode) || !els.content.contains(selection.focusNode) || germanElement(selection.anchorNode) !== germanElement(selection.focusNode)) return ""; return clean(selection.toString()); }
  function germanVoices() { if (!speechSupported) return []; return speechEngine.getVoices().filter(voice => /^(de)([-_]|$)/i.test(String(voice.lang || "")) || /german|deutsch/i.test(String(voice.name || ""))).sort((a, b) => voiceScore(b) - voiceScore(a) || String(a.name).localeCompare(String(b.name), "de")); }
  function voiceScore(voice) { const lang = String(voice.lang || "").toLowerCase().replace("_", "-"); const languageScore = lang === "de-de" ? 100 : lang === "de-at" || lang === "de-ch" ? 90 : lang === "de" ? 80 : 60; const name = String(voice.name || "").toLowerCase(); const qualityScore = /natural|neural|premium|enhanced|online/.test(name) ? 24 : /google|microsoft|apple|eloquence/.test(name) ? 10 : 0; return languageScore + qualityScore + (voice.default ? 2 : 0) + (voice.localService === false ? 1 : 0); }
  function voiceKey(voice) { return `${voice.name}::${voice.lang}`; }
  function selectedVoice() { const voices = germanVoices(); return voices.find(voice => voiceKey(voice) === speechState.voiceName || voice.name === speechState.voiceName) || voices[0] || null; }
  function voiceDescription(voice = selectedVoice()) { return voice ? `${voice.name} · ${voice.lang}` : "浏览器默认声音"; }
  function voiceServiceDescription(voice = selectedVoice()) { return voice ? `${voice.localService === false ? "在线声音" : "本地声音"}${voice.default ? " · 默认" : ""}` : "等待浏览器提供声音"; }
  function populateVoices() {
    if (!speechSupported || !els.speechVoice) return;
    const voices = germanVoices(); const selected = speechState.voiceName;
    els.speechVoice.replaceChildren(); const defaultOption = document.createElement("option"); defaultOption.value = ""; defaultOption.textContent = "系统默认德语"; els.speechVoice.append(defaultOption);
    voices.forEach(voice => { const option = document.createElement("option"); option.value = voiceKey(voice); option.textContent = `${voice.name} · ${voice.lang}`; els.speechVoice.append(option); });
    if (voices.some(voice => voiceKey(voice) === selected || voice.name === selected)) { const matching = voices.find(voice => voiceKey(voice) === selected || voice.name === selected); speechState.voiceName = voiceKey(matching); els.speechVoice.value = speechState.voiceName; } else els.speechVoice.value = "";
    if (!speechState.voiceName && voices[0]) els.speechVoice.value = voiceKey(voices[0]);
    if (els.speechVoiceInfo) els.speechVoiceInfo.textContent = `${voiceDescription()} · ${voiceServiceDescription()}`;
    setSpeechStatus(voices.length ? `已找到 ${voices.length} 个德语声音；自动使用 ${voiceDescription()} · ${formatRate(speechState.rate)}` : `未检测到德语声音，将使用浏览器默认声音 · ${formatRate(speechState.rate)}`);
  }
  function updateRateDisplay() { if (!els.speechRate) return; els.speechRate.value = String(speechState.rate); if (els.speechRateValue) { els.speechRateValue.value = formatRate(speechState.rate); els.speechRateValue.textContent = formatRate(speechState.rate); } els.speechRate.setAttribute("aria-valuetext", formatRate(speechState.rate)); }
  function updateSpeechLabels() { if (!els.speechPlay || !els.speechScope) return; const scope = els.speechScope.value; els.speechPlay.textContent = scope === "selection" ? "朗读选中文本" : scope === "range" ? "朗读指定范围" : els.speechAutoplay.checked ? "连续朗读" : "朗读当前段"; if (els.speechRange) els.speechRange.hidden = scope !== "range"; if (els.speechTarget) { const count = currentBook().paragraphCount; els.speechTarget.textContent = scope === "range" ? `共 ${count} 段` : speechState.selectedBlockIndex !== null ? `已选第 ${speechState.selectedBlockIndex + 1} 段` : "点击正文段落选择起点"; } }
  function updateSpeechButtons() {
    if (!els.speechPlay) return;
    const readingReady = els.content.dataset.ready === "true";
    els.speechPlay.disabled = !speechSupported || !readingReady; els.speechSelect.disabled = !speechSupported || !readingReady; els.speechPrev.disabled = !speechSupported || !readingReady; els.speechNext.disabled = !speechSupported || !readingReady; els.speechPause.disabled = !speechSupported || !speechState.active; els.speechStop.disabled = !speechSupported || (!speechState.active && !speechState.previewing); els.speechPreview.disabled = !speechSupported; els.speechPause.textContent = speechEngine && speechEngine.paused ? "继续" : "暂停"; els.speechVoice.disabled = !speechSupported; els.speechRate.disabled = !speechSupported; els.speechScope.disabled = !speechSupported; els.speechAutoplay.disabled = !speechSupported; els.speechFollow.disabled = !speechSupported; els.speechFrom.disabled = !speechSupported; els.speechTo.disabled = !speechSupported; updateSpeechLabels();
    if (els.speechToggle) els.speechToggle.classList.toggle("is-speaking", speechState.active || speechState.previewing);
  }
  function finishSpeech(message) { speechState.active = false; speechState.previewing = false; speechState.rangeActive = false; speechState.blockEndIndex = null; speechState.chunks = []; speechState.chunkIndex = 0; updateSpeechButtons(); if (message) setSpeechStatus(message); }
  function stopSpeech(message = "已停止朗读") { speechState.token += 1; if (speechEngine) speechEngine.cancel(); finishSpeech(message); }
  function createUtterance(text) { const voice = selectedVoice(); const utterance = new SpeechSynthesisUtterance(text); utterance.lang = voice?.lang || "de-DE"; utterance.rate = speechState.rate; utterance.pitch = 1; utterance.volume = 1; if (voice) utterance.voice = voice; return { utterance, voice }; }
  function rangeBounds() { const count = currentBook().paragraphCount; if (!count) return null; let from = Math.round(Number(els.speechFrom.value) || speechState.rangeFrom || 1); let to = Math.round(Number(els.speechTo.value) || speechState.rangeTo || count); from = Math.min(count, Math.max(1, from)); to = Math.min(count, Math.max(1, to)); if (from > to) [from, to] = [to, from]; speechState.rangeFrom = from; speechState.rangeTo = to; els.speechFrom.value = String(from); els.speechTo.value = String(to); return { from: from - 1, to: to - 1 }; }
  function readingBlockAtIndex(index) { return els.content.querySelector(`[data-reading-block][data-index="${index}"]`); }
  async function moveSelectedBlock(delta) {
    const current = selectedReadingBlock() || currentReadingBlock(); if (!current) return null;
    const index = Math.min(currentBook().paragraphCount - 1, Math.max(0, Number(current.dataset.index) + delta));
    if (speechState.active) stopSpeech('已选择新的段落');
    if (!readingBlockAtIndex(index)) await renderReader({paragraph: index + 1});
    const next = readingBlockAtIndex(index); if (!next) return null; selectReadingBlock(next); next.scrollIntoView({block:'center',behavior:'instant'}); return next;
  }
  async function nextSpeechBlock(index, endIndex = null, token = speechState.token) {
    const book = currentBook();
    for (let next = index + 1; next < book.paragraphCount && (endIndex === null || next <= endIndex); next++) {
      const chapter = chapterFor(book, next + 1), data = await loadChapter(book, chapter), text = clean(data.paragraphs[next - data.from].de);
      if (token !== speechState.token || !speechState.active || state.bookId !== book.id) return null;
      if (text) {
        if (speechState.follow && chapter !== state.chapterIndex) await renderReader({ paragraph: next + 1, keepSpeech: true });
        return { index: next, text };
      }
    }
    return null;
  }
  function speakChunk(token) {
    if (token !== speechState.token || !speechState.active || !speechState.chunks[speechState.chunkIndex]) return;
    const { utterance, voice } = createUtterance(speechState.chunks[speechState.chunkIndex]); utterance.onstart = () => { if (token === speechState.token) setSpeechStatus(`朗读中 · 第 ${speechState.blockIndex === null ? "选中文本" : `${speechState.blockIndex + 1} 段`} · ${formatRate(speechState.rate)} · ${voiceDescription(voice)}`); };
    utterance.onend = async () => { if (token !== speechState.token || !speechState.active) return; speechState.chunkIndex += 1; if (speechState.chunkIndex < speechState.chunks.length) { speakChunk(token); return; } let next; try { next = speechState.autoplay && speechState.blockIndex !== null ? await nextSpeechBlock(speechState.blockIndex, speechState.blockEndIndex, token) : null; } catch { if (token === speechState.token) finishSpeech('下一分段无法加载，请重试'); return; } if (token !== speechState.token || !speechState.active) return; if (next) { speechState.blockIndex = next.index; if (speechState.follow) readingBlockAtIndex(next.index)?.scrollIntoView({ block: 'center', behavior: 'smooth' }); speechState.chunks = speechChunks(next.text); speechState.chunkIndex = 0; setTimeout(() => speakChunk(token), 180); } else finishSpeech(speechState.blockEndIndex !== null ? "指定范围朗读完成" : "本段朗读完成"); };
    utterance.onerror = event => { if (token === speechState.token && event.error !== "canceled" && event.error !== "interrupted") finishSpeech(`朗读失败：${event.error || "浏览器未提供语音"}`); };
    speechEngine.speak(utterance);
  }
  async function playSpeech() {
    if (!speechSupported) { setSpeechStatus("当前浏览器不支持本地朗读，请使用新版 Chrome、Edge 或 Safari"); return; }
    const scope = els.speechScope?.value || "current"; let text = ""; let block = null; speechState.rangeActive = false; speechState.blockEndIndex = null;
    if (scope === "selection") { text = speechState.selectedText || selectedReadingText(); if (!text) { setSpeechStatus("请先在德语原文中拖选文字，再朗读选中文本"); return; } } else if (scope === "range") { const bounds = rangeBounds(); if (!readingBlockAtIndex(bounds.from)) await renderReader({ paragraph: bounds.from + 1 }); block = readingBlockAtIndex(bounds.from); speechState.blockEndIndex = bounds.to; speechState.rangeActive = true; text = clean(block?.querySelector(".german")?.textContent); if (!text) { setSpeechStatus("指定范围起点没有可朗读的正文段落"); return; } selectReadingBlock(block, false); } else { block = selectedReadingBlock() || currentReadingBlock(); text = clean(block?.querySelector(".german")?.textContent); if (!text) { setSpeechStatus("请先点击段落或滚动到正文段落"); return; } selectReadingBlock(block, false); }
    speechState.autoplay = scope === "range" || Boolean(els.speechAutoplay.checked); speechState.token += 1; speechEngine.cancel(); speechState.chunks = speechChunks(text); speechState.chunkIndex = 0; speechState.blockIndex = block ? Number(block.dataset.index) : null; speechState.active = true; speechState.previewing = false; updateSpeechButtons(); setSpeechStatus(scope === "selection" ? `准备朗读选中文本 · ${formatRate(speechState.rate)}` : scope === "range" ? `准备朗读第 ${speechState.blockIndex + 1}–${speechState.blockEndIndex + 1} 段 · ${formatRate(speechState.rate)}` : `准备朗读第 ${speechState.blockIndex + 1} 段 · ${formatRate(speechState.rate)}`); const token = speechState.token; setTimeout(() => speakChunk(token), 40);
  }
  $('#speechNatural').addEventListener('click', () => {
    const voice = germanVoices().find(voice => voice.localService === false || /natural|neural|premium|enhanced/i.test(voice.name));
    if (voice) { speechState.voiceName = voiceKey(voice); save(); populateVoices(); els.speechVoiceInfo.textContent = voiceDescription() + ' · ' + voiceServiceDescription() + '；可试听'; }
    else { els.speechVoiceInfo.textContent = '当前浏览器未提供自然/在线德语音色。可在 Edge 打开纯原文视图，使用其“朗读”功能。'; }
  });
  function previewVoice() {
    if (!speechSupported) { setSpeechStatus("当前浏览器不支持本地朗读"); return; }
    const token = ++speechState.token; speechEngine.cancel(); speechState.active = false; speechState.previewing = true; updateSpeechButtons(); const { utterance, voice } = createUtterance("Guten Tag. Dies ist eine kurze Hörprobe für die deutsche Stimme."); utterance.onstart = () => { if (token === speechState.token) setSpeechStatus(`试听中 · ${voiceDescription(voice)} · ${formatRate(speechState.rate)}`); }; utterance.onend = () => { if (token === speechState.token) finishSpeech(`试听完成 · ${voiceDescription(voice)}`); }; utterance.onerror = event => { if (token === speechState.token && event.error !== "canceled" && event.error !== "interrupted") finishSpeech(`试听失败：${event.error || "浏览器未提供语音"}`); }; speechEngine.speak(utterance);
  }
  function initializeSpeech() {
    updateRateDisplay(); if (els.speechScope) els.speechScope.value = speechState.scope; if (els.speechAutoplay) els.speechAutoplay.checked = speechState.autoplay; if (els.speechFollow) els.speechFollow.checked = speechState.follow; if (els.speechFrom) els.speechFrom.value = String(speechState.rangeFrom); if (els.speechTo) els.speechTo.value = String(speechState.rangeTo);
    if (!speechSupported) setSpeechStatus("当前浏览器不支持本地朗读，仍可正常阅读"); else { populateVoices(); speechEngine.addEventListener("voiceschanged", populateVoices); }
    updateSpeechButtons();
  }
  document.querySelectorAll("[data-translation]").forEach((button) => button.addEventListener("click", () => { savePosition(); state.translation = button.dataset.translation; save(); renderReader({retain:true}); }));
  document.querySelectorAll("[data-theme]").forEach((button) => button.addEventListener("click", () => { state.theme = button.dataset.theme; save(); updateControls(); }));
  document.querySelectorAll("[data-font]").forEach((button) => button.addEventListener("click", () => { savePosition(); const retained = savedAnchor(); state.fontSize = Math.min(30, Math.max(16, state.fontSize + (button.dataset.font === "up" ? 1 : -1))); save(); updateControls(); renderReader({anchor:retained,retain:true}); }));
  els.search.addEventListener("input", renderBooks);
  els.level.addEventListener("change", renderBooks); els.length.addEventListener("change", renderBooks);
  els.speechToggle.addEventListener("click", () => { setSpeechMenuOpen(els.speechMenu.hidden); if (!els.speechMenu.hidden) setTimeout(() => els.speechSelect.focus(), 0); });
  document.addEventListener("click", event => { if (!event.target.closest(".speech-panel")) setSpeechMenuOpen(false); });
  document.addEventListener("keydown", event => { if (event.key === "Escape" && !els.speechMenu.hidden) { setSpeechMenuOpen(false); els.speechToggle.focus(); } });
  els.speechSelect.addEventListener("click", () => { const block = currentReadingBlock(); if (block) { selectReadingBlock(block); block.scrollIntoView({ block: "center", behavior: "smooth" }); } });
  els.speechPrev.addEventListener("click", () => moveSelectedBlock(-1));
  els.speechNext.addEventListener("click", () => moveSelectedBlock(1));
  els.speechPlay.addEventListener("click", playSpeech);
  els.speechPause.addEventListener("click", () => { if (!speechEngine || !speechState.active) return; if (speechEngine.paused) { speechEngine.resume(); setSpeechStatus("继续朗读"); } else { speechEngine.pause(); setSpeechStatus("已暂停"); } updateSpeechButtons(); });
  els.speechStop.addEventListener("click", () => stopSpeech());
  els.speechPreview.addEventListener("click", previewVoice);
  els.speechVoice.addEventListener("change", () => { speechState.voiceName = els.speechVoice.value; save(); if (els.speechVoiceInfo) els.speechVoiceInfo.textContent = `${voiceDescription()} · ${voiceServiceDescription()}`; setSpeechStatus(`已选择 ${voiceDescription()} · ${formatRate(speechState.rate)}；可点击“试听声音”`); });
  els.speechRate.addEventListener("input", () => { speechState.rate = Number(els.speechRate.value); updateRateDisplay(); save(); });
  els.speechRate.addEventListener("change", () => { if (speechState.active) playSpeech(); else setSpeechStatus(`速度已设为 ${formatRate(speechState.rate)} · ${voiceDescription()}`); });
  els.speechScope.addEventListener("change", () => { speechState.scope = els.speechScope.value; save(); updateSpeechLabels(); setSpeechStatus(speechState.scope === "selection" ? "已选择“选中文本”；请在德语原文中拖选范围" : speechState.scope === "range" ? "已选择“指定段落范围”；设置起止段落后开始朗读" : "已选择“当前段落”；点击段落或使用选择按钮设定起点"); });
  els.speechAutoplay.addEventListener("change", () => { speechState.autoplay = els.speechAutoplay.checked; save(); updateSpeechLabels(); });
  els.speechFollow.addEventListener("change", () => { speechState.follow = els.speechFollow.checked; save(); setSpeechStatus(speechState.follow ? "已开启跟随朗读；当前段落会自动滚动到视线附近" : "已关闭跟随朗读；语音仍会继续播放"); });
  [els.speechFrom, els.speechTo].forEach(input => input.addEventListener("change", () => { speechState.rangeFrom = Math.max(1, Math.round(Number(els.speechFrom.value) || 1)); speechState.rangeTo = Math.max(1, Math.round(Number(els.speechTo.value) || 1)); save(); updateSpeechLabels(); }));
  els.content.addEventListener("click", event => { const block = event.target.closest?.(".reading-block"); if (!block || event.target.closest(".translation")) return; if (speechState.active) stopSpeech("已停止朗读；已选择新的段落"); selectReadingBlock(block); });
  els.content.addEventListener("keydown", event => { const block = event.target.closest?.(".reading-block"); if (!block || event.target.closest(".translation") || (event.key !== "Enter" && event.key !== " ")) return; event.preventDefault(); if (speechState.active) stopSpeech("已停止朗读；已选择新的段落"); selectReadingBlock(block); });
  document.addEventListener("selectionchange", () => { speechState.selectedText = selectedReadingText(); });
  $("#themeButton").addEventListener("click", () => { state.theme = state.theme === "dark" ? "paper" : "dark"; save(); updateControls(); });
  $("#focusButton").addEventListener("click", () => { const active = document.body.classList.toggle("focus-mode"); $("#focusButton").setAttribute("aria-pressed", String(active)); $("#focusButton").title = active ? "退出专注阅读" : "进入专注阅读"; });
  let scrollSaveTimer;
  window.addEventListener("scroll", () => { updateProgress(); updateCurrentBlock(); clearTimeout(scrollSaveTimer); scrollSaveTimer = setTimeout(savePosition, 120); }, { passive: true });
  let layoutWidth = innerWidth;
  window.addEventListener('resize', () => {
    if (innerWidth === layoutWidth) return; layoutWidth = innerWidth;
    clearTimeout(scrollSaveTimer); const anchor = savedAnchor();
    if (anchor && els.content.dataset.ready === 'true' && !document.body.classList.contains('library-open')) renderReader({anchor,retain:true,keepSpeech:true});
  });
  window.addEventListener("beforeunload", () => { savePosition(); if (speechEngine) speechEngine.cancel(); });
  function displayMenu(open) { $('#displayOptions').hidden = !open; $('#displayToggle').setAttribute('aria-expanded', String(open)); }
  $('#displayToggle').addEventListener('click', () => { setSpeechMenuOpen(false); displayMenu($('#displayOptions').hidden); });
  document.addEventListener('click', event => { if (!event.target.closest('.display-panel')) displayMenu(false); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !event.isComposing && !$('#displayOptions').hidden) { displayMenu(false); $('#displayToggle').focus(); } });
  let libraryAnchor = null;
  $('#libraryToggle').addEventListener('click', () => { const wasOpen = document.body.classList.contains('library-open'); if (!wasOpen) { savePosition(); libraryAnchor = savedAnchor(); } const open = document.body.classList.toggle('library-open'); $('#libraryToggle').setAttribute('aria-expanded', String(open)); if (wasOpen && libraryAnchor) renderReader({anchor:libraryAnchor,retain:true}); });
  document.querySelectorAll('[data-chapter-step]').forEach(button => button.addEventListener('click', () => { const book = currentBook(), next = state.chapterIndex + Number(button.dataset.chapterStep); if (book.chapters[next]) goToParagraph(book.chapters[next].from + 1); }));
  window.addEventListener('hashchange', () => { if (/^#paragraph-\d+$/.test(location.hash)) renderReader(); });
  window.readerAPI = { currentBook, fullBook, getAnchor: () => { const value = positionAnchor(); return value?.paragraph === 1 && value.offset === 0 && document.querySelector('.reading-block')?.getBoundingClientRect().top > 130 ? savedAnchor() || value : value; }, savePosition, goToParagraph, refresh: () => { renderBooks(); return renderReader({retain:true}); }, selectBook: id => goToParagraph(1,id) };
  renderBooks(); renderReader(); initializeSpeech();
})();
