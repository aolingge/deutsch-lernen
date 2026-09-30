import fs from 'node:fs';
import { validateResource } from '../src/lib/catalog-schema.mjs';
const rows = JSON.parse(fs.readFileSync(new URL('../data/resources.json',import.meta.url),'utf8')).map(validateResource);
const literal = value => `'${String(value).replaceAll("'","''")}'`;
const sql = rows.map(r => `INSERT OR IGNORE INTO catalog_entries(id,slug,canonical_url,category,status,payload_json,revision,updated_at) VALUES(${[r.id,r.slug,r.canonicalUrl,r.primaryCategory,r.status,JSON.stringify(r),1,new Date().toISOString()].map(literal).join(',')});`).join('\n');
fs.mkdirSync(new URL('../.wrangler/',import.meta.url),{recursive:true});
fs.writeFileSync(new URL('../.wrangler/catalog-seed.sql',import.meta.url),sql);
console.log(`Prepared ${rows.length} resources; existing edits remain unchanged.`);
