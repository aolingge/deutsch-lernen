// @ts-nocheck
(function () {
  let connection;
  function database() {
    if (!connection) connection = new Promise((resolve, reject) => {
      const request = indexedDB.open('deutsch-reader-library', 1);
      request.onupgradeneeded = () => request.result.createObjectStore('books', { keyPath: 'id' });
      request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
    });
    return connection;
  }
  function valid(book) { return book && /^local-[a-f0-9]{32}$/.test(book.id) && typeof book.title === 'string' && Array.isArray(book.paragraphs) && book.paragraphs.length > 0 && book.paragraphs.length <= 100000 && book.paragraphs.every(p => p && typeof p.de === 'string' && p.de.length <= 100000 && !p.zh) && book.paragraphs.reduce((n,p)=>n+p.de.length,0)<=8*1024*1024; }
  function normalized(book) {
    const paragraphs=book.paragraphs.map(p=>({de:p.de,zh:null})); let next=0;
    const chapters=Array.isArray(book.chapters) && book.chapters.length>0 && book.chapters.every(part=>{const valid=part && part.from===next && Number.isInteger(part.to) && part.to>=part.from && part.to<paragraphs.length && typeof part.title==='string'; if(valid) next=part.to+1; return valid;}) && next===paragraphs.length ? book.chapters.map(part=>({from:part.from,to:part.to,title:part.title.slice(0,240)})) : ReaderCore.segments(paragraphs);
    return {id:book.id,title:book.title.slice(0,240),germanTitle:book.title.slice(0,240),author:typeof book.author==='string'?book.author.slice(0,240):'作者未标注',level:'自导入',difficulty:'自导入',study:'设备本地 EPUB',genre:'本地电子书',length:'自导入',paragraphs,paragraphCount:paragraphs.length,chapters,wordCount:paragraphs.reduce((n,p)=>n+(p.de.match(/\S+/g)||[]).length,0),translationStatus:'not-imported',translatedParagraphs:0,imported:true};
  }
  function add(book) { const books = window.GUTENBERG_BOOKS; const index = books.findIndex(b => b.id === book.id); if (index < 0) books.push(book); else books[index] = book; }
  const ready = database().then(db => new Promise((resolve, reject) => {
    const request = db.transaction('books').objectStore('books').getAll(); request.onsuccess = () => { request.result.filter(valid).map(normalized).forEach(add); resolve(); }; request.onerror = () => reject(request.error);
  })).catch(() => {});
  async function save(book) {
    if (!valid(book)) throw Error('无法保存这本书');
    book = normalized(book);
    const db = await database();
    await new Promise((resolve, reject) => { const tx = db.transaction('books', 'readwrite'); tx.objectStore('books').put(book); tx.oncomplete = resolve; tx.onerror = tx.onabort = () => reject(tx.error); });
    add(book);
  }
  window.ReaderShelf = { ready, save };
})();
