// @ts-nocheck
(function () {
  const heading = text => text.length < 100 && (/^(Kapitel|Erstes|Zweites|Drittes|Viertes|Fünftes|Sechstes|Siebentes|Achtes|Neuntes|Zehntes|Teil|Inhalt)\b/i.test(text) || /^[A-ZÄÖÜ][^.!?]{2,70}$/.test(text));
  function segments(paragraphs) {
    const result = []; let from = 0, size = 0;
    for (let i = 0; i < paragraphs.length; i++) {
      const text = String(paragraphs[i].de).trim();
      if (i > from && (i - from >= 80 || size + text.length > 32000 || (i - from >= 20 && heading(text)))) {
        result.push({ from, to: i - 1 }); from = i; size = 0;
      }
      size += text.length;
    }
    if (paragraphs.length) result.push({ from, to: paragraphs.length - 1 });
    return result.map((part, index) => ({ ...part, title: heading(String(paragraphs[part.from].de).trim()) ? String(paragraphs[part.from].de).trim() : `阅读分段 ${index + 1} · 第 ${part.from + 1}–${part.to + 1} 段` }));
  }
  function anchor(value, count) {
    if (!value || value.version !== 2 || !Number.isInteger(value.paragraph) || value.paragraph < 1 || value.paragraph > count || !Number.isFinite(value.offset)) return null;
    return { version: 2, paragraph: value.paragraph, offset: Math.max(0, Math.min(1, value.offset)), updatedAt: Number.isFinite(value.updatedAt) && value.updatedAt >= 0 ? value.updatedAt : 0 };
  }
  globalThis.ReaderCore = { segments, anchor, heading };
})();
