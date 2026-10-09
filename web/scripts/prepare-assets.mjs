import fs from 'node:fs';
fs.writeFileSync(new URL('../dist/.assetsignore', import.meta.url), '_worker.js\n');
console.log('Prepared Cloudflare asset exclusions');
