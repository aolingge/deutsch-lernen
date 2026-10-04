// @ts-nocheck
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const categories = JSON.parse(fs.readFileSync(new URL('../data/categories.json', import.meta.url), 'utf8'));
const resources = JSON.parse(fs.readFileSync(new URL('../data/resources.json', import.meta.url), 'utf8'));

test('catalog has the planned category set and enough independently useful entries', () => {
  assert.equal(categories.length, 22);
  assert.ok(resources.length >= 120);
  assert.equal(new Set(resources.map((item) => item.primaryCategory)).size, 22);
});

test('published resources have Chinese explanation, source and safe external URLs', () => {
  for (const item of resources.filter((resource) => resource.status === 'published')) {
    assert.ok(item.titleZh && item.descriptionZh && item.howToUseZh, item.id);
    assert.ok(item.sourceName && /^https:\/\//.test(item.url), item.id);
    assert.ok(item.canonicalUrl && item.linkStatus, item.id);
  }
});

test('resources are unique by stable id and canonical URL', () => {
  assert.equal(new Set(resources.map((item) => item.id)).size, resources.length);
  assert.equal(new Set(resources.map((item) => item.canonicalUrl)).size, resources.length);
});
