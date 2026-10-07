import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function prepareReaderAssets(root = fileURLToPath(new URL('../public/reader/', import.meta.url))) {
  const source = fs.readFileSync(path.join(root, 'data/books.js'), 'utf8');
  const match = source.trim().match(/^window\.GUTENBERG_BOOKS\s*=\s*(\[[\s\S]*\]);?$/);
  if (!match) throw new Error('Reader data is not a JSON book array');
  const books = JSON.parse(match[1]);
  if (!Array.isArray(books) || !books.length) throw new Error('Empty reader library');
  const ids = new Set();
  books.forEach(book => {
    if (!/^\d{2}$/.test(book.id) || ids.has(book.id) || !Array.isArray(book.paragraphs) || !book.paragraphs.length || book.paragraphs.some(p => typeof p.de !== 'string' || (p.zh != null && typeof p.zh !== 'string'))) throw new Error('Invalid reader book');
    ids.add(book.id);
  });
  const destination = path.join(root, 'data/books');
  fs.mkdirSync(destination, { recursive: true });
  const metadata = books.map(book => {
    const { paragraphs, ...fields } = book;
    fs.writeFileSync(path.join(destination, `${book.id}.json`), JSON.stringify(book));
    return { ...fields, paragraphCount: paragraphs.length, translatedParagraphs: paragraphs.filter(p => String(p.zh || '').trim()).length, dataUrl: `data/books/${book.id}.json` };
  });
  const catalog = '// @ts-nocheck\nwindow.GUTENBERG_BOOKS = ' + JSON.stringify(metadata).replace(/</g, '\\u003c') + ';\n';
  fs.writeFileSync(path.join(root, 'data/catalog.js'), catalog);
  console.log(`Prepared ${books.length} reader books; index ${Buffer.byteLength(catalog)} bytes`);
  return metadata;
}
