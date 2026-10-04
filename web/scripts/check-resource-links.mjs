import fs from 'node:fs/promises';
import path from 'node:path';
import https from 'node:https';
import dns from 'node:dns';
import net from 'node:net';
import { pathToFileURL } from 'node:url';
import { isDirectoryResource } from '../src/lib/resource-directory.mjs';

export function isPublicAddress(address) {
  if (address.startsWith('::ffff:')) return isPublicAddress(address.slice(7));
  if (net.isIP(address) === 4) {
    const [a,b,c] = address.split('.').map(Number);
    return !(a === 0 || a === 10 || a === 127 || a >= 224 ||
      (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) || (a === 192 && (b === 168 || b === 0 || (b === 88 && c === 99))) ||
      (a === 198 && (b === 18 || b === 19 || (b === 51 && c === 100))) || (a === 203 && b === 0 && c === 113));
  }
  // Global unicast only; reject documentation and transition ranges too.
  return net.isIP(address) === 6 && /^[23]/i.test(address) && !/^2001:(?:db8|0):|^2002:/i.test(address);
}
export function validateTarget(value) {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password || (url.port && url.port !== '443')) throw Error('unsafe-target');
  const hostname = url.hostname.replace(/^\[|\]$/g, '');
  if (hostname === 'localhost' || hostname.endsWith('.localhost') || (net.isIP(hostname) && !isPublicAddress(hostname))) throw Error('unsafe-target');
  return url;
}
export function classifyStatus(status) {
  return status >= 200 && status < 300 ? 'ok' : [401,403,429].includes(status) ? 'restricted' : [404,410].includes(status) ? 'broken' : 'unchecked';
}
export async function loadCatalog({ liveUrl } = {}) {
  if (!liveUrl) {
    const resources = JSON.parse(await fs.readFile(new URL('../data/resources.json', import.meta.url), 'utf8')).filter(isDirectoryResource);
    return { source: 'repository', resources };
  }
  const endpoint = validateTarget(liveUrl);
  if (!endpoint.pathname.endsWith('/api/public-catalog')) throw Error('live-catalog-path-required');
  const addresses = await dns.promises.lookup(endpoint.hostname, { all: true });
  if (!addresses.length || addresses.some(({ address }) => !isPublicAddress(address))) throw Error('unsafe-address');
  const response = await fetch(endpoint, { headers: { accept: 'application/json' }, redirect: 'error', signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw Error(`live-catalog-http-${response.status}`);
  const contentLength = Number(response.headers.get('content-length') || 0);
  if (contentLength > 5 * 1024 * 1024) throw Error('live-catalog-too-large');
  const text = await response.text();
  if (text.length > 5 * 1024 * 1024) throw Error('live-catalog-too-large');
  const body = JSON.parse(text);
  if (body?.schemaVersion !== 1 || !Array.isArray(body.resources) || !Array.isArray(body.categories) || body.resources.length > 500) throw Error('live-catalog-schema-invalid');
  const resources = body.resources.filter(isDirectoryResource);
  if (resources.length !== body.resources.length) throw Error('live-catalog-resource-invalid');
  return { source: endpoint.href, resources };
}
export async function checkUrl(value, redirects = 0) {
  const url = validateTarget(value);
  const result = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => { request.destroy(); reject(Error('request-timeout')); }, 10000);
    const request = https.get(url, {
      headers: { 'user-agent': 'DeutschResourceDirectoryLinkCheck/1.0', range: 'bytes=0-1023' },
      lookup(hostname, options, callback) {
        dns.lookup(hostname, { all: true }, (error, addresses) => {
          if (error) return callback(error);
          if (!addresses.length || addresses.some(({address}) => !isPublicAddress(address))) return callback(Error('unsafe-address'));
          const selected = addresses.find((entry) => entry.family === 4) || addresses[0];
          // Use the checked address in this connection; never resolve a second time.
          if (options.all) callback(null, [selected]); else callback(null, selected.address, selected.family);
        });
      },
    }, (response) => {
      clearTimeout(timer);
      resolve({ code: response.statusCode || 0, location: response.headers.location });
      response.destroy();
    });
    request.on('error', (error) => { clearTimeout(timer); reject(error); });
  });
  if ([301,302,303,307,308].includes(result.code) && result.location) {
    if (redirects >= 4) throw Error('redirect-limit');
    return checkUrl(new URL(result.location, url).href, redirects + 1);
  }
  return { status: classifyStatus(result.code), httpStatus: result.code };
}

async function main() {
  const liveUrl = process.argv.find((arg) => arg.startsWith('--live='))?.slice(7) || process.env.RESOURCE_HUB_CATALOG_URL;
  const catalog = await loadCatalog({ liveUrl });
  const checkedAt = new Date().toISOString();
  const results = new Array(catalog.resources.length);
  let cursor = 0;
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (cursor < catalog.resources.length) {
      const index = cursor++;
      const item = catalog.resources[index];
      let result;
      try { result = await checkUrl(item.url); }
      catch (error) { result = { status: 'unchecked', httpStatus: 0, error: error instanceof Error ? error.message : String(error) }; }
      results[index] = { id: item.id, url: item.url, ...result, lastLinkCheckedAt: checkedAt };
    }
  }));
  const counts = Object.fromEntries(['ok','restricted','broken','unchecked'].map((status) => [status, results.filter((r) => r.status === status).length]));
  const destination = process.argv.find((arg) => arg.startsWith('--report='))?.slice(9) || '.wrangler/resource-links.json';
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.writeFile(destination, JSON.stringify({ schemaVersion: 1, catalogSource: catalog.source, checkedAt, counts, resources: results }, null, 2));
  console.log(JSON.stringify({ counts, catalogSource: catalog.source, report: destination, broken: results.filter((r) => r.status === 'broken').map((r) => r.id) }));
  // Report-only: no record is silently archived and editorial dates are never changed.
  if (counts.broken) process.exitCode = 1;
}
if (process.argv[1] && import.meta.url === pathToFileURL(await fs.realpath(process.argv[1])).href) await main();
