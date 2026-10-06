import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

const reader = new URL('../../web/public/reader/', import.meta.url);
const source = fs.readFileSync(new URL('data/books.js', reader), 'utf8').replace(/^\uFEFF/, '');
const books = JSON.parse(source.replace(/^\s*window.GUTENBERG_BOOKS\s*=\s*/, '').replace(/;\s*$/, ''));
const records = JSON.parse(fs.readFileSync(new URL('data/source-records.json', reader), 'utf8').replace(/^\uFEFF/, ''));
const manifest = JSON.parse(fs.readFileSync(new URL('books-manifest.json', reader), 'utf8').replace(/^\uFEFF/, ''));
const words = text => (text.match(/\p{L}+(?:[-'’]\p{L}+)*/gu) || []).length;
assert.equal(books.length, manifest.length);
assert.equal(new Set(books.map(book => book.id)).size, books.length);
const report = books.map(book => {
  assert.ok(book.paragraphs.length > 0, book.id);
  const wordCount = book.paragraphs.reduce((sum, paragraph) => sum + words(paragraph.de), 0);
  assert.equal(book.wordCount, wordCount, `${book.id}: display count matches original text`);
  if (Number(book.id) >= 13) {
    assert.ok(book.paragraphs.every(paragraph => !paragraph.zh), `${book.id}: German only`);
    assert.ok(wordCount > 10000, `${book.id}: full text`);
    assert.ok(!book.paragraphs.some(paragraph => /VOCABULARY|Project Gutenberg|Produced by|Transcriber's|PREFACE|Cloth\.\s*\d/.test(paragraph.de)), `${book.id}: non-story material`);
    const record = records.find(item => item.id === book.id);
    const bytes = fs.readFileSync(new URL(book.downloadUrl, reader));
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), record.sha256);
    assert.ok(bytes.toString('utf8').includes('*** END OF THE PROJECT GUTENBERG EBOOK'));
  }
  return { id: book.id, title: book.germanTitle, paragraphs: book.paragraphs.length, wordCount, hoursAt120Wpm: wordCount / 7200, hoursAt240Wpm: wordCount / 14400 };
});
const added = report.filter(book => Number(book.id) >= 13);
const sum = rows => rows.reduce((total, row) => total + row.wordCount, 0);
assert.ok(sum(added) / 14400 >= 20, 'New additions must exceed 20 hours even at 240 words/minute');
const result = { wordsPerMinute: [120, 240], totalWords: sum(report), addedWords: sum(added), totalHoursAt120Wpm: sum(report) / 7200, addedHoursAt120Wpm: sum(added) / 7200, addedHoursAt240Wpm: sum(added) / 14400, books: report };
fs.writeFileSync(new URL('data/reading-stats.json', reader), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result, null, 2));
