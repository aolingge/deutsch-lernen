import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { directoryGroups } from '../src/lib/category-groups.mjs';
import { selectResources } from '../src/lib/resource-directory.mjs';

const categories = JSON.parse(fs.readFileSync(new URL('../data/categories.json', import.meta.url)));
const resources = JSON.parse(fs.readFileSync(new URL('../data/resources.json', import.meta.url)));

test('grouped navigation retains every category once, including future categories', () => {
  const future = [...categories, {id:'future',name:'新增分类'}];
  const groups = directoryGroups(future);
  assert.deepEqual(groups.flatMap(g=>g.categories.map(c=>c.id)).sort(), future.map(c=>c.id).sort());
  assert.ok(groups[0].categories.some(c=>c.id==='postal'));
  assert.ok(groups[1].categories.some(c=>c.id==='courses'));
});

test('app filter includes verified messaging, postal and health clients', () => {
  const ids = new Set(selectResources(resources, new URLSearchParams({format:'应用'})).map(r=>r.id));
  for(const id of ['whatsapp','signal','telegram','post-dhl','tk-app','adac-drive']) assert.ok(ids.has(id),id);
  assert.ok(!ids.has('familienportal'));
  assert.deepEqual(selectResources(resources, new URLSearchParams({format:'应用',category:'postal'})).map(r=>r.id).sort(), ['dpd','gls','hermes','post-dhl','ups-germany']);
});

test('Chinese and German everyday search terms find relevant services', () => {
  for(const [query,id] of [['快递','post-dhl'],['paket','post-dhl'],['strom','eon'],['报税','taxfix'],['maps','google-maps'],['krankenkasse','tk-app']]) {
    assert.ok(selectResources(resources,new URLSearchParams({q:query})).some(r=>r.id===id),query);
  }
});
