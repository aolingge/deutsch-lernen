// @ts-nocheck
(function () {
  "use strict";
  const books = window.GUTENBERG_BOOKS || [];
  const savedTranslation = localStorage.getItem("gutenberg-translation-v2");
  const state = { bookId: localStorage.getItem("gutenberg-book") || books[0]?.id, translation: savedTranslation === "hide" || savedTranslation === "show" ? savedTranslation : "hover", theme: localStorage.getItem("gutenberg-theme") || "paper", fontSize: Number(localStorage.getItem("gutenberg-font-size") || 20) };
  const $ = (selector) => document.querySelector(selector);
  const els = { list: $("#bookList"), title: $("#bookTitle"), meta: $("#bookMeta"), number: $("#bookNumber"), content: $("#readingContent"), notice: $("#translationNotice"), bar: $("#progressBar"), progress: $("#progressText"), size: $("#fontSizeLabel"), search: $("#bookSearch") };
  const clean = (value) => String(value || "").replace(/\s+/g, " ").trim();
  function currentBook() { return books.find((book) => book.id === state.bookId) || books[0]; }
  function save() { localStorage.setItem("gutenberg-book", state.bookId); localStorage.setItem("gutenberg-translation-v2", state.translation); localStorage.setItem("gutenberg-theme", state.theme); localStorage.setItem("gutenberg-font-size", String(state.fontSize)); }
  function positionKey() { return `gutenberg-position-${state.bookId}`; }
  function savePosition() { localStorage.setItem(positionKey(), String(Math.round(window.scrollY))); }
  function renderBooks() {
    const query = clean(els.search.value).toLowerCase();
    els.list.innerHTML = books.filter((book) => `${book.title} ${book.germanTitle} ${book.author}`.toLowerCase().includes(query)).map((book) => `<button class="book-card ${book.id === state.bookId ? "active" : ""}" type="button" data-book="${book.id}"><span class="book-card-top"><span>${book.id} · ${book.level}</span><span>${book.study}</span></span><h2>${book.title}</h2><p>${book.germanTitle} · ${book.author}</p><span class="book-status ${book.translationStatus === "not-imported" ? "pending" : ""}">${book.translationStatus === "partial-local" ? "部分本地译文" : "译文待导入"}</span></button>`).join("") || `<p class="library-note">没有匹配的书目。</p>`;
    els.list.querySelectorAll("[data-book]").forEach((button) => button.addEventListener("click", () => { state.bookId = button.dataset.book; save(); renderBooks(); renderReader(); window.scrollTo({ top: 0, behavior: "smooth" }); }));
  }
  function renderReader() {
    const book = currentBook();
    if (!book) return;
    els.title.textContent = book.title;
    els.meta.textContent = `${book.germanTitle} · ${book.author}  /  ${book.level} · ${book.study}`;
    els.number.textContent = book.id;
    els.notice.hidden = book.translationStatus !== "not-imported";
    els.notice.textContent = book.translationStatus === "not-imported" ? "这本书的德语正文已准备好。当前文件夹里没有对应中文译文，因此“显示译文”暂时不会伪造内容；可后续把人工或校订译文导入 data/books.js。" : "第一本书复用了已有沉浸式翻译 HTML 中能精确对应的本地译文，未匹配段落仍保持原文。";
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
    if (savedPosition > 0) requestAnimationFrame(() => window.scrollTo({ top: savedPosition, behavior: "auto" }));
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
  $("#themeButton").addEventListener("click", () => { state.theme = state.theme === "dark" ? "paper" : "dark"; save(); updateControls(); });
  $("#focusButton").addEventListener("click", () => { const active = document.body.classList.toggle("focus-mode"); $("#focusButton").setAttribute("aria-pressed", String(active)); $("#focusButton").title = active ? "退出专注阅读" : "进入专注阅读"; });
  let scrollSaveTimer;
  window.addEventListener("scroll", () => { updateProgress(); clearTimeout(scrollSaveTimer); scrollSaveTimer = setTimeout(savePosition, 120); }, { passive: true });
  window.addEventListener("beforeunload", savePosition);
  renderBooks(); renderReader();
})();
