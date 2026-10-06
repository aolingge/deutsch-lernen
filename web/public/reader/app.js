// @ts-nocheck
(function () {
  "use strict";
  const books = window.GUTENBERG_BOOKS || [];
  books.forEach(book => { book.translatedParagraphs = book.paragraphs.filter(item => String(item.zh || '').trim()).length; });
  const savedTranslation = localStorage.getItem("gutenberg-translation-v2");
  const requestedBook = new URLSearchParams(window.location.search).get("book");
  const initialBook = books.find(book => book.id === requestedBook)?.id || books.find(book => book.id === localStorage.getItem("gutenberg-book"))?.id || books[0]?.id;
  const state = { bookId: initialBook, translation: savedTranslation === "hide" || savedTranslation === "show" ? savedTranslation : "hover", theme: localStorage.getItem("gutenberg-theme") || "paper", fontSize: Number(localStorage.getItem("gutenberg-font-size") || 20) };
  const $ = (selector) => document.querySelector(selector);
  const els = { list: $("#bookList"), title: $("#bookTitle"), meta: $("#bookMeta"), route: $("#bookRoute"), number: $("#bookNumber"), total: $("#bookTotal"), count: $("#bookCount"), readingTime: $("#readingTime"), libraryTitle: $("#libraryTitle"), level: $("#levelFilter"), length: $("#lengthFilter"), content: $("#readingContent"), notice: $("#translationNotice"), bar: $("#progressBar"), progress: $("#progressText"), size: $("#fontSizeLabel"), search: $("#bookSearch") };
  const clean = (value) => String(value || "").replace(/\s+/g, " ").trim();
  function currentBook() { return books.find((book) => book.id === state.bookId) || books[0]; }
  const totalWords = books.reduce((sum, book) => sum + Number(book.wordCount || 0), 0);
  const totalHours = totalWords / 120 / 60;
  function readingTimeText() { return `原文 ${totalWords.toLocaleString("zh-CN")} 词 · 约 ${totalHours.toFixed(1)} 小时（120 词/分钟）`; }
  function save() { localStorage.setItem("gutenberg-book", state.bookId); localStorage.setItem("gutenberg-translation-v2", state.translation); localStorage.setItem("gutenberg-theme", state.theme); localStorage.setItem("gutenberg-font-size", String(state.fontSize)); const url = new URL(window.location.href); url.searchParams.set("book", state.bookId); history.replaceState(null, "", url); }
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
    els.list.querySelectorAll("[data-book]").forEach((button) => button.addEventListener("click", () => { savePosition(); clearTimeout(scrollSaveTimer); state.bookId = button.dataset.book; save(); renderBooks(); renderReader(); }));
  }
  function renderReader() {
    const book = currentBook();
    if (!book) return;
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
    requestAnimationFrame(() => { window.scrollTo({ top: savedPosition, behavior: "instant" }); updateProgress(); });
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
  document.querySelectorAll("[data-translation]").forEach((button) => button.addEventListener("click", () => { state.translation = button.dataset.translation; save(); renderReader(); }));
  document.querySelectorAll("[data-theme]").forEach((button) => button.addEventListener("click", () => { state.theme = button.dataset.theme; save(); updateControls(); }));
  document.querySelectorAll("[data-font]").forEach((button) => button.addEventListener("click", () => { state.fontSize = Math.min(30, Math.max(16, state.fontSize + (button.dataset.font === "up" ? 1 : -1))); save(); updateControls(); }));
  els.search.addEventListener("input", renderBooks);
  els.level.addEventListener("change", renderBooks); els.length.addEventListener("change", renderBooks);
  $("#themeButton").addEventListener("click", () => { state.theme = state.theme === "dark" ? "paper" : "dark"; save(); updateControls(); });
  $("#focusButton").addEventListener("click", () => { const active = document.body.classList.toggle("focus-mode"); $("#focusButton").setAttribute("aria-pressed", String(active)); $("#focusButton").title = active ? "退出专注阅读" : "进入专注阅读"; });
  let scrollSaveTimer;
  window.addEventListener("scroll", () => { updateProgress(); clearTimeout(scrollSaveTimer); scrollSaveTimer = setTimeout(savePosition, 120); }, { passive: true });
  window.addEventListener("beforeunload", savePosition);
  renderBooks(); renderReader();
})();
