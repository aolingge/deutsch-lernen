import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { prepareCatalogUpdate } from '../scripts/prepare-directory-update.mjs';
import { validateResource } from '../src/lib/catalog-schema.mjs';
import rows from '../data/resources.json' with { type: 'json' };

test('catalog update preserves edited rows and history, archives guides and can be repeated', () => {
  const db = new DatabaseSync(':memory:');
  for (const file of fs.readdirSync('migrations').sort()) db.exec(fs.readFileSync('migrations/' + file, 'utf8'));
  const baseline = [
    validateResource(rows[0]),
    validateResource(rows[1]),
    validateResource({ ...rows.find(r => r.rights === 'owned'), status: 'published' }),
  ];
  const seed = db.prepare('INSERT INTO catalog_entries(id,slug,canonical_url,category,status,payload_json,updated_at) VALUES(?,?,?,?,?,?,?)');
  for (const r of baseline) seed.run(r.id, r.slug, r.canonicalUrl, r.primaryCategory, r.status, JSON.stringify(r), '2026-10-01');
  const edited = { ...baseline[1], descriptionZh: 'A saved administrator edit' };
  db.prepare("UPDATE catalog_entries SET payload_json=?,revision=2,actor='administrator' WHERE id=?").run(JSON.stringify(edited), edited.id);
  const current = baseline.map(r => ({ ...r, descriptionZh: r.descriptionZh + ' updated', ...(r.rights === 'owned' ? { status: 'archived' } : {}) }));
  current.push(validateResource(rows.find(r => !baseline.some(b => b.id === r.id) && r.rights !== 'owned')));
  const plan = prepareCatalogUpdate(baseline, current);
  db.exec(plan.sql);
  const stored = id => db.prepare('SELECT * FROM catalog_entries WHERE id=?').get(id);
  assert.equal(stored(baseline[0].id).revision, 2);
  assert.equal(stored(baseline[2].id).status, 'archived');
  assert.deepEqual(JSON.parse(stored(edited.id).payload_json), edited);
  assert.equal(stored(current[3].id).revision, 1);
  const history = db.prepare('SELECT count(*) AS count FROM catalog_audit').get().count;
  db.exec(plan.sql);
  assert.equal(db.prepare('SELECT count(*) AS count FROM catalog_audit').get().count, history);
  assert.deepEqual(plan.reviewSql.flatMap(sql => db.prepare(sql).all()).map(r => r.id), [edited.id]);
  db.close();
});
