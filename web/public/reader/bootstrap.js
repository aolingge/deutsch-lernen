// @ts-nocheck
(function () {
  function script(src, loaded) {
    const element = document.createElement('script'); element.src = src;
    element.onload = loaded;
    element.onerror = () => { document.getElementById('bookTitle').textContent = '阅读器加载失败，请刷新后重试'; };
    document.head.append(element);
  }
  function start() { script('app.js', () => script('vocabulary.js', () => {})); }
  // Direct file access cannot fetch JSON in Chrome: preserve the original standalone reader.
  if (location.protocol === 'file:') script('data/books.js', start); else start();
})();
