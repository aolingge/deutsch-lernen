import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { selectResources, isDirectoryResource, resourceCard, directoryReturnPath } from '../src/lib/resource-directory.mjs';
const rows = JSON.parse(fs.readFileSync(new URL('../data/resources.json', import.meta.url), 'utf8'));
const categories = JSON.parse(fs.readFileSync(new URL('../data/categories.json', import.meta.url), 'utf8'));
test('directory contains external resources across every category and excludes owned guides', () => {
  const items = rows.filter(isDirectoryResource);
  assert.ok(items.length >= 120);
  assert.equal(new Set(items.map((r) => r.primaryCategory)).size, categories.length);
  assert.ok(!items.some((r) => r.rights === 'owned' || r.url.startsWith('https://github.com/aolingge/deutsch-lernen/blob/')));
});

test('common Chinese and German names find the same existing resources', () => {
  for (const [alias, original] of [['德福', 'TestDaF'], ['字典', '词典'], ['Podcast', '播客'], ['Nikos', 'Nicos'], ['歌德 B1', 'Goethe B1']]) {
    const find = (q) => selectResources(rows, new URLSearchParams({ q })).map((r) => r.id).sort();
    assert.ok(find(alias).length, alias);
    assert.deepEqual(find(alias), find(original));
  }
  assert.ok(selectResources(rows, new URLSearchParams('q=德福考试')).length >= 1);
  assert.equal(selectResources(rows, new URLSearchParams('q=worterbuch')).length, selectResources(rows, new URLSearchParams('q=Wörterbuch')).length);
  assert.ok(selectResources(rows, new URLSearchParams('q=免费')).length > 0);
});

test('detail return links preserve filters and reject external or unsafe destinations', () => {
  const path = '/?category=grammar&level=B1&price=free&page=2';
  assert.equal(directoryReturnPath(path), path);
  for (const unsafe of ['//evil.example', 'https://evil.example/', '/api/admin/resources', '/resource/anki/', '/\\evil.example', '/?q=x\n']) assert.equal(directoryReturnPath(unsafe), '/resources/');
  const html = resourceCard(rows[0], categories, false, path);
  assert.ok(html.includes('from=%2F%3Fcategory%3Dgrammar'));
});
test('combined filters, normalized multiword search, favorites and sorting select actual resources', () => {
  const result = selectResources(rows, new URLSearchParams('q=DW B1&category=courses&price=free&access=open'));
  assert.ok(result.some((r) => r.id === 'dw-nicos-weg'));
  assert.ok(result.every((r) => r.primaryCategory === 'courses' && r.price === 'free' && r.access === 'open' && r.levels.includes('B1')));
  assert.deepEqual(selectResources(rows, new URLSearchParams('q=不存在的资源xyz')), []);
  assert.deepEqual(selectResources(rows, new URLSearchParams('saved=1'), ['anki']).map((r) => r.id), ['anki']);
  const title = selectResources(rows, new URLSearchParams('sort=title'));
  assert.ok(title.every((r, i) => i === 0 || (title[i - 1].titleOriginal || title[i - 1].titleZh).localeCompare(r.titleOriginal || r.titleZh, 'de') <= 0));
});
test('resource names link directly to original sites and untrusted labels remain escaped', () => {
  const row = { ...rows[0], titleZh: '<img src=x onerror=alert(1)>', descriptionZh: 'A & B' };
  const card = resourceCard(row, categories);
  assert.ok(card.includes(`href="${row.url}" target="_blank"`));
  assert.ok(card.includes('&lt;img'));
  assert.ok(card.includes('A &amp; B'));
  assert.ok(!card.includes('onerror=alert(1)>'));
});
