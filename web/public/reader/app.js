// @ts-nocheck
(function () {
  "use strict";
  const books = window.GUTENBERG_BOOKS || [];
  books.forEach(book => { book.translatedParagraphs = book.paragraphs.filter(item => String(item.zh || '').trim()).length; });
  const savedTranslation = localStorage.getItem("gutenberg-translation-v2");
  const requestedBook = new URLSearchParams(window.location.search).get("book");
  const initialBook = books.find(book => book.id === requestedBook)?.id || books.find(book => book.id === localStorage.getItem("gutenberg-book"))?.id || books[0]?.id;
  const state = { bookId: initialBook, translation: savedTranslation === "hide" || savedTranslation === "show" ? savedTranslation : "hover", theme: localStorage.getItem("gutenberg-theme") || "paper", fontSize: Number(localStorage.getItem("gutenberg-font-size") || 20) };
  const speechEngine = "speechSynthesis" in window ? window.speechSynthesis : null;
  const speechSupported = Boolean(speechEngine && "SpeechSynthesisUtterance" in window);
  const storedSpeechRate = Number(localStorage.getItem("gutenberg-speech-rate") || 1);
  const speechState = { token: 0, chunks: [], chunkIndex: 0, blockIndex: null, active: false, selectedText: "", rate: [0.75, 0.9, 1, 1.1, 1.25].includes(storedSpeechRate) ? storedSpeechRate : 1, voiceName: localStorage.getItem("gutenberg-speech-voice") || "", autoplay: localStorage.getItem("gutenberg-speech-autoplay") === "true" };
  let currentBlockElement = null;
  const $ = (selector) => document.querySelector(selector);
  const els = { list: $("#bookList"), title: $("#bookTitle"), meta: $("#bookMeta"), route: $("#bookRoute"), number: $("#bookNumber"), total: $("#bookTotal"), count: $("#bookCount"), readingTime: $("#readingTime"), libraryTitle: $("#libraryTitle"), level: $("#levelFilter"), length: $("#lengthFilter"), content: $("#readingContent"), notice: $("#translationNotice"), bar: $("#progressBar"), progress: $("#progressText"), size: $("#fontSizeLabel"), search: $("#bookSearch"), speechPlay: $("#speechPlay"), speechPause: $("#speechPause"), speechStop: $("#speechStop"), speechVoice: $("#speechVoice"), speechRate: $("#speechRate"), speechAutoplay: $("#speechAutoplay"), speechStatus: $("#speechStatus") };
  const clean = (value) => String(value || "").replace(/\s+/g, " ").trim();
  function currentBook() { return books.find((book) => book.id === state.bookId) || books[0]; }
  const totalWords = books.reduce((sum, book) => sum + Number(book.wordCount || 0), 0);
  const totalHours = totalWords / 120 / 60;
  function readingTimeText() { return `原文 ${totalWords.toLocaleString("zh-CN")} 词 · 约 ${totalHours.toFixed(1)} 小时（120 词/分钟）`; }
  function save() { localStorage.setItem("gutenberg-book", state.bookId); localStorage.setItem("gutenberg-translation-v2", state.translation); localStorage.setItem("gutenberg-theme", state.theme); localStorage.setItem("gutenberg-font-size", String(state.fontSize)); localStorage.setItem("gutenberg-speech-rate", String(speechState.rate)); localStorage.setItem("gutenberg-speech-voice", speechState.voiceName); localStorage.setItem("gutenberg-speech-autoplay", String(speechState.autoplay)); const url = new URL(window.location.href); url.searchParams.set("book", state.bookId); history.replaceState(null, "", url); }
  function positionKey() { return `gutenberg-position-${state.bookId}`; }
  function savePosition() { localStorage.setItem(positionKey(), String(Math.round(window.scrollY))); }
  function renderBooks() {
    const query = clean(els.search.value).toLowerCase();
    const level = els.level.value; const length = els.length.value;
    const filtered = books.filter((book) => `${book.title} ${book.germanTitle} ${book.author}`.toLowerCase().includes(query) && (!level || String(book.difficulty || book.level).includes(level)) && (!length || book.length === length));
    els.count.textContent = `${filtered.length} / ${books.length} 本书 · 推荐先读短篇，再进入中长篇`;
    els.readingTime.textContent = readingTimeText();
    els.libraryTitle.textContent = `${books.length} 本德语读物`;
    els.list.innerHTML = filtered.map((book) => `<button class="book-card ${book.id === state.bookId ? "active" : ""}" type="button" data-book="${book.id}"><span class="book-card-top"><span>${book.id} · ${book.difficulty || book.level}</span><span>${book.length || ""}</span></span><h2>${book.title}</h2><p>${book.germanTitle} · ${book.author}</p><span class="book-status ${book.translationStatus === "not-imported" ? "pending" : ""}">${book.translatedParagraphs ? `已导入 ${book.translatedParagraphs} / ${book.paragraphs.length} 段译文` : "德语原文"} · 约 ${(book.wordCount / 7200).toFixed(1)} 小时</span></button>`).join("") || `<p class="library-note">没有匹配的书目。</p>`;
    els.list.querySelectorAll("[data-book]").forEach((button) => button.addEventListener("click", () => { stopSpeech("已停止朗读"); savePosition(); clearTimeout(scrollSaveTimer); state.bookId = button.dataset.book; save(); renderBooks(); renderReader(); }));
  }
  function renderReader() {
    const book = currentBook();
    if (!book) return;
    if (speechState.active) stopSpeech("已停止朗读");
    speechState.selectedText = "";
    els.title.textContent = book.title;
    els.meta.textContent = `${book.germanTitle} · ${book.author}  /  ${book.level} · ${book.study}`;
    els.route.textContent = `${book.difficulty || book.level} · ${book.length || "篇幅未标注"} · ${book.genre || "文学"} · ${book.chapterCount ? `${book.chapterCount} 章` : "按段落"} · 约 ${(book.wordCount / 7200).toFixed(1)} 小时`;
    els.number.textContent = book.id;
    els.total.textContent = `/ ${books.length}`;
    els.notice.hidden = false;
    els.notice.textContent = book.translatedParagraphs ? `已导入 ${book.translatedParagraphs} / ${book.paragraphs.length} 段译文。中文为机器翻译，遇到疑问请结合德语原文理解；数字、网址等内容可能仅保留原文。` : "德语原文 · 无中文译文。等级为编辑估计，历史原著可能含旧拼写。阅读时长按每分钟 120 词估算。";
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
    els.content.dataset.translationMode = state.translation;
    els.content.innerHTML = book.paragraphs.map((item, index) => { const text = clean(item.de); const translation = clean(item.zh); const heading = text.length < 100 && (/^(Kapitel|Erstes|Zweites|Drittes|Viertes|Fünftes|Sechstes|Siebentes|Achtes|Neuntes|Zehntes|Inhalt|Personen|Gestalten|Teil|Das Ende)/i.test(text) || /^[A-ZÄÖÜ][^.!?]{2,70}$/.test(text)); const longTranslation = translation.length > 92 || text.length > 150; return `<section class="reading-block ${heading ? "is-heading" : ""}" data-index="${index}"><p class="german">${escapeHtml(text)}</p>${translation ? `<span class="translation ${longTranslation ? "long" : "short"}" tabindex="0" role="button" aria-label="悬停或点击显示译文" ${state.translation === "hide" ? "hidden" : ""}>${escapeHtml(translation)}</span>` : ""}</section>`; }).join("");
    els.content.querySelectorAll(".translation").forEach((translation) => {
      translation.setAttribute("aria-expanded", String(state.translation === "show"));
      if (state.translation === "show") { translation.removeAttribute("role"); translation.removeAttribute("tabindex"); translation.removeAttribute("aria-label"); translation.removeAttribute("aria-expanded"); }
      translation.addEventListener("click", () => { if (state.translation === "hover") { const expanded=translation.classList.toggle("is-revealed"); translation.setAttribute("aria-expanded",String(expanded)); } });
      translation.addEventListener("keydown", event => { if(state.translation === "hover" && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); translation.click(); } });
    });
    updateControls();
    updateProgress();
    const savedPosition = Number(localStorage.getItem(positionKey()) || 0);
    requestAnimationFrame(() => { window.scrollTo({ top: savedPosition, behavior: "instant" }); updateProgress(); updateCurrentBlock(); });
  }
  function escapeHtml(value) { return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char])); }
  function updateControls() {
    document.querySelectorAll("[data-translation]").forEach((button) => button.setAttribute("aria-pressed", String((button.dataset.translation === state.translation))));
    document.querySelectorAll("[data-theme]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.theme === state.theme)));
    document.body.classList.toggle("theme-dark", state.theme === "dark");
    if (state.theme === "green") document.body.style.setProperty("--bg", "#e3eddd"); else if (state.theme === "paper") document.body.style.setProperty("--bg", "#f3efe5"); else document.body.style.removeProperty("--bg");
    document.documentElement.style.setProperty("--font-size", `${state.fontSize}px`); els.size.textContent = state.fontSize;
  }
  function updateProgress() { const max = document.documentElement.scrollHeight - window.innerHeight; const percent = max > 0 ? Math.round((window.scrollY / max) * 100) : 0; els.bar.style.width = `${percent}%`; els.progress.textContent = `${percent}%`; }
  function currentReadingBlock() { const x = Math.floor(window.innerWidth * 0.62); const toolbarBottom = document.querySelector(".reader-toolbar")?.getBoundingClientRect().bottom || 0; const y = Math.min(Math.max(150, toolbarBottom + 20), window.innerHeight - 1); const block = document.elementFromPoint(x, y)?.closest(".reading-block"); return block && els.content.contains(block) ? block : currentBlockElement?.isConnected ? currentBlockElement : els.content.querySelector(".reading-block"); }
  function updateCurrentBlock() { const block = currentReadingBlock(); if (!block) return null; const index = Number(block.dataset.index); if (currentBlockElement !== block) { currentBlockElement?.classList.remove("is-current"); block.classList.add("is-current"); currentBlockElement = block; } if (!speechState.active) speechState.blockIndex = index; return block; }
  function setSpeechStatus(message) { if (els.speechStatus) els.speechStatus.textContent = message; }
  function speechChunks(text) {
    const sentences = String(text || "").replace(/\s+/g, " ").trim().match(/[^.!?。！？]+[.!?。！？]+|[^.!?。！？]+$/gu) || [];
    const chunks = []; let current = "";
    const add = part => { const value = part.trim(); if (!value) return; if (value.length <= 220) { if (current && `${current} ${value}`.length > 220) { chunks.push(current); current = value; } else current = current ? `${current} ${value}` : value; return; } value.split(/\s+/).forEach(word => { if (current && `${current} ${word}`.length > 220) { chunks.push(current); current = word; } else current = current ? `${current} ${word}` : word; }); };
    sentences.forEach(add); if (current) chunks.push(current); return chunks;
  }
  function selectedReadingText() { const selection = window.getSelection(); if (!selection || selection.isCollapsed || !selection.rangeCount || !els.content.contains(selection.anchorNode)) return ""; return clean(selection.toString()); }
  function populateVoices() {
    if (!speechSupported || !els.speechVoice) return;
    const voices = speechEngine.getVoices().filter(voice => /^(de)([-_]|$)/i.test(voice.lang) || /german|deutsch/i.test(voice.name));
    const selected = speechState.voiceName;
    els.speechVoice.innerHTML = `<option value="">系统默认德语</option>${voices.map(voice => `<option value="${escapeHtml(voice.name)}">${escapeHtml(voice.name)} · ${escapeHtml(voice.lang)}</option>`).join("")}`;
    if (voices.some(voice => voice.name === selected)) els.speechVoice.value = selected;
    if (voices.length) setSpeechStatus(`已找到 ${voices.length} 个德语声音`); else setSpeechStatus("未检测到德语声音，将使用系统默认声音");
  }
  function updateSpeechButtons() {
    if (!els.speechPlay) return;
    els.speechPlay.disabled = !speechSupported;
    els.speechPause.disabled = !speechSupported || !speechState.active;
    els.speechStop.disabled = !speechSupported || !speechState.active;
    els.speechPause.textContent = speechEngine && speechEngine.paused ? "继续" : "暂停";
    els.speechVoice.disabled = !speechSupported;
    els.speechRate.disabled = !speechSupported;
    els.speechAutoplay.disabled = !speechSupported;
  }
  function finishSpeech(message) { speechState.active = false; speechState.chunks = []; speechState.chunkIndex = 0; updateSpeechButtons(); if (message) setSpeechStatus(message); }
  function stopSpeech(message = "已停止朗读") { speechState.token += 1; if (speechEngine) speechEngine.cancel(); finishSpeech(message); }
  function speakChunk(token) {
    if (token !== speechState.token || !speechState.active || !speechState.chunks[speechState.chunkIndex]) return;
    const utterance = new SpeechSynthesisUtterance(speechState.chunks[speechState.chunkIndex]); utterance.lang = "de-DE"; utterance.rate = speechState.rate; utterance.volume = 1;
    const voice = speechEngine.getVoices().find(item => item.name === speechState.voiceName); if (voice) utterance.voice = voice;
    utterance.onstart = () => { if (token === speechState.token) setSpeechStatus(`朗读中 · 第 ${speechState.chunkIndex + 1} 段语音块`); };
    utterance.onend = () => { if (token !== speechState.token || !speechState.active) return; speechState.chunkIndex += 1; if (speechState.chunkIndex < speechState.chunks.length) { speakChunk(token); return; } let next = null; if (speechState.autoplay && speechState.blockIndex !== null) { for (let index = speechState.blockIndex + 1; index < els.content.children.length; index += 1) { const candidate = els.content.children[index]; if (!candidate.classList.contains("is-heading") && clean(candidate.querySelector(".german")?.textContent)) { next = candidate; break; } } } if (next) { speechState.blockIndex = Number(next.dataset.index); next.scrollIntoView({ block: "center", behavior: "smooth" }); speechState.chunks = speechChunks(next.querySelector(".german")?.textContent); speechState.chunkIndex = 0; setTimeout(() => speakChunk(token), 180); } else finishSpeech("本段朗读完成"); };
    utterance.onerror = event => { if (token === speechState.token && event.error !== "canceled" && event.error !== "interrupted") finishSpeech(`朗读失败：${event.error || "浏览器未提供语音"}`); };
    speechEngine.speak(utterance);
  }
  function playSpeech() {
    if (!speechSupported) { setSpeechStatus("当前浏览器不支持本地朗读，请使用新版 Chrome、Edge 或 Safari"); return; }
    const selected = speechState.selectedText || selectedReadingText(); const block = currentReadingBlock(); const text = selected || block?.querySelector(".german")?.textContent || ""; if (!text) { setSpeechStatus("请先选择文字或滚动到正文段落"); return; }
    speechState.token += 1; speechEngine.cancel(); speechState.chunks = speechChunks(text); speechState.chunkIndex = 0; speechState.blockIndex = selected ? null : Number(block.dataset.index); speechState.active = true; updateSpeechButtons(); setSpeechStatus(selected ? "准备朗读选中文字" : `准备朗读第 ${speechState.blockIndex + 1} 段`); const token = speechState.token; setTimeout(() => speakChunk(token), 40);
  }
  function initializeSpeech() {
    if (els.speechRate) els.speechRate.value = String(speechState.rate); if (els.speechAutoplay) els.speechAutoplay.checked = speechState.autoplay;
    if (!speechSupported) setSpeechStatus("当前浏览器不支持本地朗读，仍可正常阅读"); else { populateVoices(); speechEngine.addEventListener("voiceschanged", populateVoices); }
    updateSpeechButtons();
  }
  document.querySelectorAll("[data-translation]").forEach((button) => button.addEventListener("click", () => { state.translation = button.dataset.translation; save(); renderReader(); }));
  document.querySelectorAll("[data-theme]").forEach((button) => button.addEventListener("click", () => { state.theme = button.dataset.theme; save(); updateControls(); }));
  document.querySelectorAll("[data-font]").forEach((button) => button.addEventListener("click", () => { state.fontSize = Math.min(30, Math.max(16, state.fontSize + (button.dataset.font === "up" ? 1 : -1))); save(); updateControls(); }));
  els.search.addEventListener("input", renderBooks);
  els.level.addEventListener("change", renderBooks); els.length.addEventListener("change", renderBooks);
  els.speechPlay.addEventListener("click", playSpeech); els.speechPause.addEventListener("click", () => { if (!speechEngine || !speechState.active) return; if (speechEngine.paused) { speechEngine.resume(); setSpeechStatus("继续朗读"); } else { speechEngine.pause(); setSpeechStatus("已暂停"); } updateSpeechButtons(); }); els.speechStop.addEventListener("click", () => stopSpeech()); els.speechVoice.addEventListener("change", () => { speechState.voiceName = els.speechVoice.value; save(); }); els.speechRate.addEventListener("change", () => { speechState.rate = Number(els.speechRate.value); save(); if (speechState.active) playSpeech(); }); els.speechAutoplay.addEventListener("change", () => { speechState.autoplay = els.speechAutoplay.checked; save(); });
  document.addEventListener("selectionchange", () => { speechState.selectedText = selectedReadingText(); });
  $("#themeButton").addEventListener("click", () => { state.theme = state.theme === "dark" ? "paper" : "dark"; save(); updateControls(); });
  $("#focusButton").addEventListener("click", () => { const active = document.body.classList.toggle("focus-mode"); $("#focusButton").setAttribute("aria-pressed", String(active)); $("#focusButton").title = active ? "退出专注阅读" : "进入专注阅读"; });
  let scrollSaveTimer;
  window.addEventListener("scroll", () => { updateProgress(); updateCurrentBlock(); clearTimeout(scrollSaveTimer); scrollSaveTimer = setTimeout(savePosition, 120); }, { passive: true });
  window.addEventListener("beforeunload", () => { savePosition(); if (speechEngine) speechEngine.cancel(); });
  renderBooks(); renderReader(); initializeSpeech();
})();
