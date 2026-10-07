// @ts-nocheck
(function () {
  "use strict";
  const key = "gutenberg-vocabulary-v1";
  const $ = id => document.getElementById(id);
  const dialog = $("vocabularyDialog"), term = $("vocabularyTerm"), meaning = $("vocabularyMeaning"), context = $("vocabularyContext"), list = $("vocabularyList"), status = $("vocabularyStatus"), source = $("vocabularySource");
  const tidy = (value, max) => String(value || "").replace(/\s+/g, " ").trim().normalize("NFC").slice(0, max);
  const identity = value => tidy(value, 160).toLocaleLowerCase("de");
  const dictionaries = [["PONS 德中", "https://zh.pons.com/翻译/德语-中文/"], ["LEO 德中", "https://dict.leo.org/chinesisch-deutsch/"], ["DWDS 德语释义", "https://www.dwds.de/wb/"]];
  const books = window.GUTENBERG_BOOKS || [];
  let items = [], selected = null, origin = null, storageError = "", unreadableBackup = false;
  function sanitize(item) {
    if (!item || typeof item !== "object" || typeof item.term !== "string") return null;
    const word = tidy(item.term, 160);
    if (!word) return null;
    const book = books.find(book => book.id === item.bookId);
    const paragraph = Number(item.paragraph);
    return { term: word, meaning: tidy(item.meaning, 1000), context: tidy(item.context, 1200), bookId: book?.id || "", paragraph: book && Number.isInteger(paragraph) && paragraph > 0 && paragraph <= (book.paragraphCount || book.paragraphs?.length || 0) ? paragraph : null };
  }
  try {
    const saved = JSON.parse(localStorage.getItem(key) || "[]");
    if (!Array.isArray(saved)) throw new Error("Invalid vocabulary");
    items = [...new Map(saved.slice(0, 2000).map(sanitize).filter(Boolean).map(item => [identity(item.term), item])).values()];
  } catch { unreadableBackup = true; storageError = "原有生词无法读取。为保留数据，暂不保存新词；可合并导入有效 JSON 备份恢复。"; }
  function store(next, restoring = false) {
    if (unreadableBackup && !restoring) { status.textContent = storageError; return false; }
    try { localStorage.setItem(key, JSON.stringify(next)); items = next; unreadableBackup = false; return true; }
    catch { status.textContent = "保存失败：浏览器存储不可用或空间不足。请备份当前生词后重试。"; return false; }
  }
  function sourceUrl(item) {
    if (!item?.bookId || !item.paragraph) return "";
    const url = new URL(location.href); url.search = "";
    url.searchParams.set("book", item.bookId); url.hash = `paragraph-${item.paragraph}`;
    return url.href;
  }
  function updateSource() {
    const href = sourceUrl(origin);
    source.hidden = !href;
    if (href) source.href = href; else source.removeAttribute("href");
  }
  function updateDictionaries() {
    const container = $("vocabularyDictionaries"); container.replaceChildren();
    const word = tidy(term.value, 160); if (!word) return;
    dictionaries.forEach(([label, base]) => {
      const link = document.createElement("a"); link.textContent = label + " ↗";
      link.href = base + encodeURIComponent(word); link.target = "_blank"; link.rel = "noopener noreferrer"; container.append(link);
    });
  }
  function loadItem(item) {
    term.value = item.term; meaning.value = item.meaning; context.value = item.context; origin = item;
    updateDictionaries(); updateSource();
  }
  function render() {
    $("vocabularyCount").textContent = String(items.length);
    list.replaceChildren();
    const query = tidy($("vocabularySearch").value, 160).toLocaleLowerCase("de");
    const matches = items.filter(item => `${item.term} ${item.meaning}`.toLocaleLowerCase("de").includes(query));
    matches.slice().reverse().forEach(item => {
      const button = document.createElement("button"); button.type = "button"; button.className = "vocabulary-item";
      const word = document.createElement("strong"), note = document.createElement("span");
      word.textContent = item.term; note.textContent = item.meaning || "尚未填写释义";
      button.append(word, note); button.addEventListener("click", () => { loadItem(item); status.textContent = "修改后保存，可更新这个词。"; term.focus(); }); list.append(button);
    });
    if (!matches.length) { const message = document.createElement("p"); message.textContent = items.length ? "没有匹配的生词。" : "还没有生词。选中原文中的词，或直接输入后保存。"; list.append(message); }
    $("vocabularyAnki").disabled = $("vocabularyBackup").disabled = items.length === 0;
  }
  function captureSelection() {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.rangeCount) return;
    const parent = node => (node.nodeType === 1 ? node : node.parentElement)?.closest(".german");
    const paragraph = parent(selection.anchorNode);
    if (!paragraph || paragraph !== parent(selection.focusNode) || !$("readingContent").contains(paragraph)) return;
    const text = tidy(selection.toString(), 161); if (!text || text.length > 160) { selected = null; return; }
    selected = { term: text, meaning: "", context: tidy(paragraph.textContent, 1200), bookId: new URLSearchParams(location.search).get("book") || books[0]?.id || "", paragraph: Number(paragraph.closest(".reading-block").dataset.index) + 1 };
  }
  document.addEventListener("selectionchange", captureSelection);
  $("readingContent").addEventListener("pointerdown", () => { selected = null; });
  new MutationObserver(() => { selected = null; }).observe($("readingContent"), { childList: true });
  $("vocabularyToggle").addEventListener("click", () => {
    captureSelection();
    if (selected) { const existing = items.find(item => identity(item.term) === identity(selected.term)); loadItem({ ...selected, meaning: existing?.meaning || "" }); }
    else { origin = null; term.value = meaning.value = context.value = ""; updateDictionaries(); updateSource(); }
    status.textContent = storageError; render(); dialog.showModal(); term.focus();
  });
  dialog.addEventListener("click", event => { if (event.target !== dialog) return; const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); });
  dialog.addEventListener("keydown", event => { if (event.key === "Escape" && !event.isComposing) { event.preventDefault(); dialog.close(); } });
  source.addEventListener("click", event => {
    const url = new URL(source.href);
    if (url.searchParams.get("book") === new URLSearchParams(location.search).get("book")) { dialog.close(); const block = document.getElementById(url.hash.slice(1)); if (block) { event.preventDefault(); history.replaceState(null, "", url); block.scrollIntoView({ block: "center", behavior: "instant" }); block.focus({ preventScroll: true }); } }
  });
  term.addEventListener("input", updateDictionaries);
  $("vocabularySearch").addEventListener("input", render);
  $("vocabularyForm").addEventListener("submit", event => {
    event.preventDefault(); const item = sanitize({ ...origin, term: term.value, meaning: meaning.value, context: context.value });
    if (!item) { status.textContent = "请输入德语词或短语。"; return; }
    const index = items.findIndex(existing => identity(existing.term) === identity(item.term));
    if (index < 0 && items.length >= 2000) { status.textContent = "已达到 2000 条，请备份后整理生词。"; return; }
    const next = items.slice(); if (index >= 0) next[index] = item; else next.push(item);
    if (store(next)) { storageError = ""; render(); status.textContent = index >= 0 ? "已更新这个生词。" : "已保存到当前浏览器。"; }
  });
  function download(filename, text, type) {
    const url = URL.createObjectURL(new Blob([text], { type })); const link = document.createElement("a"); link.href = url; link.download = filename; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  $("vocabularyBackup").addEventListener("click", () => download("deutsch-vocabulary.json", JSON.stringify({ version: 1, items }, null, 2), "application/json;charset=utf-8"));
  $("vocabularyAnki").addEventListener("click", () => {
    const field = value => '"' + String(value || "").replace(/[\t\r\n]+/g, " ").replace(/"/g, '""') + '"';
    const text = "#separator:Tab\n#html:false\n#columns:Front\tBack\n" + items.map(item => {
      const book = books.find(book => book.id === item.bookId);
      const back = [item.meaning, item.context, book ? `来源：${book.germanTitle}${item.paragraph ? ` · 第 ${item.paragraph} 段` : ""}` : "", sourceUrl(item)].filter(Boolean).join(" / ");
      return `${field(item.term)}\t${field(back)}`;
    }).join("\n");
    download("deutsch-vocabulary-anki.tsv", text, "text/tab-separated-values;charset=utf-8");
  });
  $("vocabularyImport").addEventListener("change", async event => {
    const input = event.target, file = input.files[0]; if (!file) return;
    try {
      if (file.size > 8 * 1024 * 1024) throw new Error("too-large");
      const data = JSON.parse(await file.text());
      if (data.version !== 1 || !Array.isArray(data.items) || data.items.length > 2000) throw new Error("format");
      const incoming = data.items.map(sanitize);
      if (incoming.some(item => !item)) throw new Error("format");
      const merged = new Map(items.map(item => [identity(item.term), item]));
      incoming.forEach(item => { if (!merged.has(identity(item.term))) merged.set(identity(item.term), item); });
      if (merged.size > 2000) throw new Error("too-many");
      const added = merged.size - items.length;
      if (store([...merged.values()], true)) { storageError = ""; render(); status.textContent = `已合并 ${added} 个新词，已有词保持原样。`; }
    } catch { status.textContent = "导入失败：请选择本站导出的 JSON 备份（最多 2000 条、8 MB）。原有生词保持不变。"; }
    finally { input.value = ""; }
  });
  $("vocabularyToggle").disabled = false;
})();
