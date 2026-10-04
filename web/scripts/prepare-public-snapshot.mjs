import fs from 'node:fs';
import { isDirectoryResource } from '../src/lib/resource-directory.mjs';
const rows = JSON.parse(fs.readFileSync(new URL('../data/resources.json', import.meta.url), 'utf8'));
const snapshot = rows.filter(isDirectoryResource).map(({ howToUseZh, ...row }) => row);
fs.writeFileSync(new URL('../data/public-snapshot.json', import.meta.url), JSON.stringify(snapshot));
console.log(`Prepared ${snapshot.length} public fallback resources`);
