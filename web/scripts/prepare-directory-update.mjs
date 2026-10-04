import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { validateResource } from '../src/lib/catalog-schema.mjs';

const literal = value => `'${String(value).replaceAll("'", "''")}'`;

// Update only untouched seed rows. Every change keeps the existing audit trail.
export function prepareCatalogUpdate(baseline, current, now = new Date().toISOString()) {
  const before = new Map(baseline.map(validateResource).map(r => [r.id, r]));
  const desired = current.map(validateResource);
  if (new Set(desired.map(r => r.id)).size !== desired.length) throw Error('Duplicate resource ID');
  const statements = [];
  let inserted = 0, updated = 0;
  for (const row of desired) {
    const previous = before.get(row.id);
    const payload = JSON.stringify(row);
    if (!previous) {
      statements.push(`INSERT OR IGNORE INTO catalog_entries(id,slug,canonical_url,category,status,payload_json,updated_at) VALUES(${[row.id,row.slug,row.canonicalUrl,row.primaryCategory,row.status,payload,now].map(literal).join(',')});`);
      inserted++;
    } else if (JSON.stringify(previous) !== payload) {
      statements.push(`UPDATE OR IGNORE catalog_entries SET slug=${literal(row.slug)}, canonical_url=${literal(row.canonicalUrl)}, category=${literal(row.primaryCategory)}, status=${literal(row.status)}, payload_json=${literal(payload)}, updated_at=${literal(now)}, revision=revision+1 WHERE id=${literal(row.id)} AND revision=1 AND actor='catalog-seed' AND status=${literal(previous.status)} AND json(payload_json)=json(${literal(JSON.stringify(previous))});`);
      updated++;
    }
  }
  // Report preserved edits, missing rows or uniqueness conflicts for review.
  const outstanding = desired.map(row => `(${literal(row.id)},${literal(JSON.stringify(row))})`);
  const reviewSql = [];
  for (let i = 0; i < outstanding.length; i += 10) reviewSql.push(`WITH desired(id,payload) AS (VALUES ${outstanding.slice(i, i + 10).join(',')}) SELECT desired.id FROM desired LEFT JOIN catalog_entries existing ON existing.id=desired.id WHERE existing.id IS NULL OR json(existing.payload_json)<>json(desired.payload);`);
  statements.push(...reviewSql);
  return { sql: statements.join('\n'), inserted, updated, reviewSql };
}

if (process.argv[1] && import.meta.url === pathToFileURL(fs.realpathSync(process.argv[1])).href) {
  const baselineRef = process.argv.find(arg => arg.startsWith('--baseline='))?.slice(11);
  if (!baselineRef || !/^[a-zA-Z0-9/_.-]+$/.test(baselineRef) || baselineRef.startsWith('-')) throw Error('Pass --baseline=<reviewed Git commit>');
  const root = new URL('../../', import.meta.url);
  const baseline = JSON.parse(execFileSync('git', ['show', `${baselineRef}:web/data/resources.json`], { cwd: root, encoding: 'utf8' }));
  const current = JSON.parse(fs.readFileSync(new URL('../data/resources.json', import.meta.url), 'utf8'));
  const plan = prepareCatalogUpdate(baseline, current);
  fs.mkdirSync(new URL('../.wrangler/', import.meta.url), { recursive: true });
  fs.writeFileSync(new URL('../.wrangler/directory-update.sql', import.meta.url), plan.sql);
  console.log(`Prepared ${plan.inserted} new rows and ${plan.updated} guarded updates. No database contacted. Final SQL query reports rows needing review.`);
}
