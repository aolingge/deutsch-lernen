import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { buildResourceEdit, prepareDraftImport } from '../src/lib/catalog-edit.mjs';
const fixture = JSON.parse(fs.readFileSync(new URL('../data/resources.json', import.meta.url))).find(r => r.status === 'published' && r.rights === 'link-only');

test('admin edits preserve invisible metadata and independently curated canonical URLs', () => {
  const original = {...fixture, aliases:['old-name'], interfaceLanguages:['中文'], providerType:'institution', editorialStatus:'partial', evidence:[{url:fixture.url,fields:['name'],checkedAt:'2026-10-04'}], canonicalUrl:'https://example.org/canonical'};
  const edited = buildResourceEdit(original, [['titleZh','修改名称'],['skills','听力，阅读']]);
  assert.equal(edited.titleZh,'修改名称');
  for (const key of ['aliases','interfaceLanguages','providerType','editorialStatus','evidence','canonicalUrl']) assert.deepEqual(edited[key], original[key]);
  assert.deepEqual(edited.skills,['听力','阅读']);
  assert.deepEqual(original.skills, fixture.skills);
  assert.equal(buildResourceEdit(original,[['url','https://example.org/new']]).canonicalUrl,'https://example.org/new');
  assert.equal(buildResourceEdit({...original,costNoteZh:'旧说明'},[['costNoteZh','']]).costNoteZh,undefined);
});

test('draft imports reject collisions with existing records and within the upload', () => {
  const fresh = {...fixture, id:'new-id',slug:'new-slug',url:'https://example.org/new',canonicalUrl:'https://example.org/new',revision:8};
  const [draft] = prepareDraftImport([fresh],[fixture]);
  assert.equal(draft.status,'draft');
  assert.equal(draft.revision,undefined);
  for (const key of ['id','slug','canonicalUrl']) assert.throws(()=>prepareDraftImport([{...fresh,[key]:fixture[key]}],[fixture]),/重复/);
  assert.throws(()=>prepareDraftImport([fresh,fresh],[]),/第 2 条/);
  assert.throws(()=>prepareDraftImport([],[]),/1–200/);
});
