import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { prepareReaderAssets } from '../scripts/prepare-reader-assets.mjs';

test('book splitting preserves original text, translations and metadata without executing source code', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'deutsch-reader-assets-test-'));
  try {
    fs.mkdirSync(path.join(root, 'data'));
    const book = {id:'01', title:'Straße', wordCount:8, paragraphs:[{de:'Größer als zuvor. <script>text</script>',zh:'原有译文'},{de:'Weitere Zeile',zh:null}]};
    fs.writeFileSync(path.join(root,'data/books.js'), `window.GUTENBERG_BOOKS = ${JSON.stringify([book])};`);
    const index = prepareReaderAssets(root);
    assert.equal(index[0].paragraphCount,2);
    assert.equal(index[0].translatedParagraphs,1);
    assert.equal(index[0].wordCount,8);
    assert.equal(index[0].paragraphs,undefined);
    assert.deepEqual(JSON.parse(fs.readFileSync(path.join(root,'data/books/01.json'),'utf8')),book);
    fs.writeFileSync(path.join(root,'data/books.js'), 'window.GUTENBERG_BOOKS = []; process.exit(0);');
    assert.throws(() => prepareReaderAssets(root), /JSON book array/);
    fs.writeFileSync(path.join(root,'data/books.js'), `window.GUTENBERG_BOOKS = ${JSON.stringify([{...book,id:'../escape'}])};`);
    assert.throws(() => prepareReaderAssets(root), /Invalid reader book/);
  } finally {
    // Delete only the exact temporary directory created by this test.
    const target = fs.realpathSync(root), parent = fs.realpathSync(os.tmpdir());
    assert.equal(path.dirname(target),parent);
    assert.ok(path.basename(target).startsWith('deutsch-reader-assets-test-'));
    fs.rmSync(target,{recursive:true,force:true});
  }
});
