import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import '../public/reader/reader-core.js';
test('all generated segments retain the complete original paragraph order in every book', () => {
  const catalog = JSON.parse(fs.readFileSync('public/reader/data/catalog.js','utf8').replace(/^.*?=\s*/s,'').replace(/;\s*$/,''));
  for (const book of catalog) {
    const full = JSON.parse(fs.readFileSync('public/reader/'+book.dataUrl));
    const paragraphs = [];
    for (const chapter of book.chapters) { const segment=JSON.parse(fs.readFileSync('public/reader/'+chapter.url)); assert.equal(segment.from,paragraphs.length); assert.equal(segment.id,book.id); assert.equal(segment.paragraphs.length,chapter.to-chapter.from+1); paragraphs.push(...segment.paragraphs); }
    assert.deepEqual(paragraphs,full.paragraphs); assert.equal(paragraphs.length,book.paragraphCount);
  }
});
test('paragraph anchors survive font/layout changes and reject corrupted positions', () => {
  const core=globalThis.ReaderCore;
  assert.equal(core.anchor({version:2,paragraph:15,offset:0.4,updatedAt:123},30).paragraph,15);
  assert.equal(core.anchor({version:2,paragraph:15,offset:2},30).offset,1);
  for (const bad of [null,{}, {version:2,paragraph:31,offset:0}, {version:2,paragraph:1,offset:NaN}]) assert.equal(core.anchor(bad,30),null);
  const original=Array.from({length:180},(_,i)=>({de:'Absatz '+i+'.'})); const bounds=core.segments(original); assert.equal(bounds[0].from,0); assert.equal(bounds.at(-1).to,179); assert.ok(bounds.every(p=>p.to-p.from<80));
});
