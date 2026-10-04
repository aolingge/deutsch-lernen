import fs from 'node:fs';
import { validateResource } from '../src/lib/catalog-schema.mjs';
// @ts-nocheck

const root = new URL('..', import.meta.url);
const file = (name) => new URL(name, root);
const categories = JSON.parse(fs.readFileSync(file('data/categories.json'), 'utf8'));
const resources = JSON.parse(fs.readFileSync(file('data/resources.json'), 'utf8'));
const categoryIds = new Set(categories.map((category) => category.id));
const ids = new Set();
const urls = new Set();
const errors = [];
const validLevels = new Set(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']);
const validStatuses = new Set(['published', 'draft', 'archived']);

for (const item of resources) {
  try { validateResource(item); } catch (error) { errors.push(`${item.id ?? '<unknown>'}: ${error.message}`); }
  const required = ['id', 'slug', 'titleOriginal', 'titleZh', 'descriptionZh', 'primaryCategory', 'sourceName', 'url', 'canonicalUrl'];
  for (const field of required) if (!item[field]) errors.push(`${item.id ?? '<unknown>'}: missing ${field}`);
  if (ids.has(item.id)) errors.push(`${item.id}: duplicate id`);
  if (urls.has(item.canonicalUrl)) errors.push(`${item.id}: duplicate canonicalUrl`);
  ids.add(item.id); urls.add(item.canonicalUrl);
  if (!categoryIds.has(item.primaryCategory)) errors.push(`${item.id}: invalid category ${item.primaryCategory}`);
  if (!validStatuses.has(item.status)) errors.push(`${item.id}: invalid status ${item.status}`);
  if (!/^https?:\/\//.test(item.url)) errors.push(`${item.id}: url must be http(s)`);
  if (!item.levels.every((level) => validLevels.has(level))) errors.push(`${item.id}: invalid level`);
  if (!item.tags?.length) errors.push(`${item.id}: needs at least one tag`);
}

const counts = Object.fromEntries(categories.map((category) => [category.id, resources.filter((item) => item.primaryCategory === category.id).length]));
if (errors.length) {
  console.error(JSON.stringify({ ok: false, resourceCount: resources.length, errors }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, resourceCount: resources.length, categoryCount: categories.length, categoryCounts: counts }, null, 2));
