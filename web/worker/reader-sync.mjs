import { readBody } from './read-body.mjs';
/** @param {unknown} body */
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' } });
/** @param {Request} request
 * @param {import('./index').Env} env */
export async function readerSync(request, env) {
  if (request.method !== 'POST') return json({ error: 'method-not-allowed' }, 405);
  if (request.headers.get('origin') !== new URL(request.url).origin) return json({ error: 'cross-origin' }, 403);
  if (!env.DB || !env.SYNC_LIMIT) return json({ error: 'sync-unavailable' }, 503);
  if (!(await env.SYNC_LIMIT.limit({ key: request.headers.get('cf-connecting-ip') || 'local' })).success) return json({ error: 'rate-limited' }, 429);
  if (!request.headers.get('content-type')?.startsWith('application/json')) return json({ error: 'expected-json' }, 415);
  const token = request.headers.get('authorization')?.match(/^Bearer ([a-f0-9]{64})$/)?.[1];
  if (!token) return json({ error: 'invalid-token' }, 401);
  let input; try { input = JSON.parse(await readBody(request, 768 * 1024)); } catch { return json({ error: 'invalid-or-large-data' }, 413); }
  if (!input || !/^[a-f0-9]{32}$/.test(input.id) || !['read', 'write'].includes(input.action)) return json({ error: 'invalid-request' }, 400);
  const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token)))].map(byte => byte.toString(16).padStart(2, '0')).join('');
  const row = await env.DB.prepare('SELECT token_hash, revision, iv, ciphertext, updated_at FROM reader_sync WHERE id=?').bind(input.id).first();
  if (row && row.token_hash !== hash) return json({ error: 'invalid-token' }, 401);
  if (input.action === 'read') return row ? json({ revision: row.revision, iv: row.iv, ciphertext: row.ciphertext, updatedAt: row.updated_at }) : json({ error: 'not-found' }, 404);
  if (!Number.isSafeInteger(input.revision) || input.revision < 0 || !/^[A-Za-z0-9+/]{16}$/.test(input.iv) || typeof input.ciphertext !== 'string' || input.ciphertext.length < 24 || input.ciphertext.length > 700000 || !/^[A-Za-z0-9+/]+={0,2}$/.test(input.ciphertext) || input.ciphertext.length % 4) return json({ error: 'invalid-payload' }, 400);
  if ((!row && input.revision !== 0) || (row && row.revision !== input.revision)) return json({ error: 'revision-conflict' }, 409);
  const now = new Date().toISOString();
  if (!row) {
    const result = await env.DB.prepare('INSERT OR IGNORE INTO reader_sync(id,token_hash,revision,iv,ciphertext,updated_at) SELECT ?,?,1,?,?,? WHERE (SELECT count(*) FROM reader_sync)<100').bind(input.id, hash, input.iv, input.ciphertext, now).run();
    if (!result.meta.changes) { const raced = await env.DB.prepare('SELECT id FROM reader_sync WHERE id=?').bind(input.id).first(); return json({ error: raced ? 'revision-conflict' : 'capacity-reached' }, raced ? 409 : 503); }
  } else {
    const result = await env.DB.prepare('UPDATE reader_sync SET revision=revision+1,iv=?,ciphertext=?,updated_at=? WHERE id=? AND token_hash=? AND revision=?').bind(input.iv, input.ciphertext, now, input.id, hash, input.revision).run();
    if (!result.meta.changes) return json({ error: 'revision-conflict' }, 409);
  }
  return json({ revision: input.revision + 1, updatedAt: now });
}
