import fs from 'node:fs/promises';
import path from 'node:path';
import https from 'node:https';
import dns from 'node:dns';
import net from 'node:net';
import { pathToFileURL } from 'node:url';
import { isDirectoryResource } from '../src/lib/resource-directory.mjs';
import { validateResource, categoryIds } from '../src/lib/catalog-schema.mjs';

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
// Resolve once and connect to that checked address. Bound the body while streaming,
// including responses without Content-Length; keep the timeout through body completion.
export async function requestPublic(value, { maxBytes = 0, headers = {}, timeoutMs = 15000 } = {}, { get = https.get, lookup = dns.lookup } = {}) {
  const url = validateTarget(value);
  return new Promise((resolve, reject) => {
    let request;
    const timer = setTimeout(() => { request?.destroy(); reject(Error('request-timeout')); }, timeoutMs);
    const fail = (error) => { clearTimeout(timer); reject(error); request?.destroy(); };
    request = get(url, {
      headers: { 'user-agent': 'DeutschResourceDirectoryLinkCheck/1.0', ...headers },
      lookup(hostname, options, callback) {
        lookup(hostname, { all: true }, (error, addresses) => {
          if (error) return callback(error);
          if (!addresses.length || addresses.some(({ address }) => !isPublicAddress(address))) return callback(Error('unsafe-address'));
          const selected = addresses.find(entry => entry.family === 4) || addresses[0];
          if (options.all) callback(null, [selected]); else callback(null, selected.address, selected.family);
        });
      },
    }, response => {
      const result = { code: response.statusCode || 0, headers: response.headers, body: '' };
      if (!maxBytes) { clearTimeout(timer); resolve(result); response.destroy(); return; }
      if (Number(response.headers['content-length']) > maxBytes) { fail(Error('live-catalog-too-large')); response.destroy(); return; }
      const chunks = [];
      let bytes = 0;
      response.on('data', chunk => {
        bytes += chunk.length;
        if (bytes > maxBytes) { fail(Error('live-catalog-too-large')); response.destroy(); return; }
        chunks.push(chunk);
      });
      response.on('end', () => { clearTimeout(timer); resolve({ ...result, body: Buffer.concat(chunks).toString('utf8') }); });
      response.on('aborted', () => fail(Error('response-aborted')));
      response.on('error', fail);
    });
    request.on('error', fail);
  });
}
export async function loadCatalog({ liveUrl, request = requestPublic } = {}) {
  if (!liveUrl) {
    const resources = JSON.parse(await fs.readFile(new URL('../data/resources.json', import.meta.url), 'utf8')).filter(isDirectoryResource);
    return { source: 'repository', resources };
  }
  const endpoint = validateTarget(liveUrl);
  if (!endpoint.pathname.endsWith('/api/public-catalog')) throw Error('live-catalog-path-required');
  const response = await request(endpoint.href, { maxBytes: 5 * 1024 * 1024, headers: { accept: 'application/json' } });
  if (response.code !== 200) throw Error(`live-catalog-http-${response.code}`);
  const body = JSON.parse(response.body);
  if (body?.schemaVersion !== 1 || !Array.isArray(body.resources) || !Array.isArray(body.categories) || body.resources.length > 500) throw Error('live-catalog-schema-invalid');
  const categories = new Set();
  for (const category of body.categories) {
    if (!categoryIds.includes(category?.id) || typeof category.name !== 'string' || !category.name.trim() || categories.has(category.id)) throw Error('live-catalog-category-invalid');
    categories.add(category.id);
  }
  const identifiers = new Set();
  const resources = body.resources.map(raw => {
    let item;
    try { item = validateResource(raw); } catch { throw Error('live-catalog-resource-invalid'); }
    if (!isDirectoryResource(item) || !categories.has(item.primaryCategory) || identifiers.has(item.id)) throw Error('live-catalog-resource-invalid');
    identifiers.add(item.id);
    return item;
  });
  return { source: endpoint.href, resources };
}
export async function checkUrl(value, redirects = 0) {
  const url = validateTarget(value);
  const result = await requestPublic(url.href, { headers: { range: 'bytes=0-1023' }, timeoutMs: 10000 });
  if ([301,302,303,307,308].includes(result.code) && result.headers.location) {
    if (redirects >= 4) throw Error('redirect-limit');
    return checkUrl(new URL(result.headers.location, url).href, redirects + 1);
  }
  return { status: classifyStatus(result.code), httpStatus: result.code, finalUrl: url.href, redirects };
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
