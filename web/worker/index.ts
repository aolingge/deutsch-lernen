import catalog from '../data/resources.json';
import { createRemoteJWKSet, jwtVerify } from 'jose';

type Env = { DB?: D1Database; ASSETS?: Fetcher; ACCESS_ISSUER?: string; ACCESS_AUDIENCE?: string; ADMIN_EMAILS?: string };
const json = (body: unknown, status = 200, headers: Record<string, string> = {}) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', ...headers } });
const dayInHk = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Hong_Kong' }).format(new Date());

async function adminEmail(request: Request, env: Env) {
  if (!env.ACCESS_ISSUER || !env.ACCESS_AUDIENCE || !env.ADMIN_EMAILS) return null;
  const token = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!token) return null;
  try {
    const issuer = env.ACCESS_ISSUER.replace(/\/$/, '');
    const jwks = createRemoteJWKSet(new URL(`${issuer}/cdn-cgi/access/certs`));
    const { payload } = await jwtVerify(token, jwks, { issuer, audience: env.ACCESS_AUDIENCE });
    const email = typeof payload.email === 'string' ? payload.email.toLowerCase() : '';
    return env.ADMIN_EMAILS.split(',').map((value) => value.trim().toLowerCase()).includes(email) ? email : null;
  } catch { return null; }
}

const resourceFields = ['id','slug','titleOriginal','titleZh','descriptionZh','howToUseZh','primaryCategory','tags','levels','levelBasis','skills','exams','formats','price','access','languages','sourceName','url','canonicalUrl','rights','status','linkStatus','lastEditorialCheckedAt'] as const;
const normalizeResource = (value: Record<string, unknown>) => Object.fromEntries(resourceFields.map((key) => [key, value[key] ?? null]));
async function adminResources(request: Request, env: Env, email: string) {
  if (!env.DB) return json({ ok: false, error: 'database-unavailable' }, 503);
  if (request.method === 'GET') {
    const rows = await env.DB.prepare('SELECT * FROM resources ORDER BY updated_at DESC').all();
    return json({ ok: true, resources: rows.results });
  }
  if (request.method !== 'PUT' && request.method !== 'POST') return json({ ok: false, error: 'method-not-allowed' }, 405);
  let input: Record<string, unknown>; try { input = await request.json(); } catch { return json({ ok: false, error: 'invalid-json' }, 400); }
  const item = normalizeResource(input); const required = ['id','slug','titleZh','descriptionZh','howToUseZh','primaryCategory','sourceName','url','canonicalUrl'];
  if (required.some((key) => typeof item[key] !== 'string' || !item[key])) return json({ ok: false, error: 'missing-required-field' }, 400);
  const now = new Date().toISOString(); const revision = Number(input.revision ?? 1);
  try {
    const exists = await env.DB.prepare('SELECT revision FROM resources WHERE id = ?').bind(item.id).first<{ revision: number }>();
    if (request.method === 'PUT' && (!exists || exists.revision !== revision)) return json({ ok: false, error: 'revision-conflict', currentRevision: exists?.revision ?? null }, 409);
    const nextRevision = exists ? revision + 1 : 1;
    await env.DB.prepare(`INSERT INTO resources (id,slug,title_original,title_zh,description_zh,how_to_use_zh,primary_category,tags_json,levels_json,level_basis,skills_json,exams_json,formats_json,price,access,languages_json,source_name,url,canonical_url,rights,status,link_status,last_editorial_checked_at,revision,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET slug=excluded.slug,title_original=excluded.title_original,title_zh=excluded.title_zh,description_zh=excluded.description_zh,how_to_use_zh=excluded.how_to_use_zh,primary_category=excluded.primary_category,tags_json=excluded.tags_json,levels_json=excluded.levels_json,level_basis=excluded.level_basis,skills_json=excluded.skills_json,exams_json=excluded.exams_json,formats_json=excluded.formats_json,price=excluded.price,access=excluded.access,languages_json=excluded.languages_json,source_name=excluded.source_name,url=excluded.url,canonical_url=excluded.canonical_url,rights=excluded.rights,status=excluded.status,link_status=excluded.link_status,last_editorial_checked_at=excluded.last_editorial_checked_at,revision=excluded.revision,updated_at=excluded.updated_at`).bind(item.id,item.slug,item.titleOriginal,item.titleZh,item.descriptionZh,item.howToUseZh,item.primaryCategory,JSON.stringify(item.tags ?? []),JSON.stringify(item.levels ?? []),item.levelBasis ?? 'unspecified',JSON.stringify(item.skills ?? []),JSON.stringify(item.exams ?? []),JSON.stringify(item.formats ?? []),item.price ?? 'unknown',item.access ?? 'unknown',JSON.stringify(item.languages ?? []),item.sourceName,item.url,item.canonicalUrl,item.rights ?? 'link-only',item.status ?? 'draft',item.linkStatus ?? 'unchecked',item.lastEditorialCheckedAt ?? null,nextRevision,now,now).run();
    await env.DB.prepare('INSERT INTO resource_revisions (resource_id,revision,changed_at,changed_by,payload_json) VALUES (?,?,?,?,?)').bind(item.id,nextRevision,now,email,JSON.stringify(item)).run();
    return json({ ok: true, id: item.id, revision: nextRevision }, exists ? 200 : 201);
  } catch (error) { console.error(String(error)); return json({ ok: false, error: 'write-failed' }, 500); }
}

async function visit(request: Request, env: Env) {
  if (!env.DB) return json({ accepted: false, reason: 'stats-unavailable' }, 503);
  let input: { eventId?: string; path?: string };
  try { input = await request.json(); } catch { return json({ accepted: false, reason: 'invalid-json' }, 400); }
  if (!input.eventId || !/^[a-zA-Z0-9_-]{12,80}$/.test(input.eventId) || !input.path?.startsWith('/')) return json({ accepted: false, reason: 'invalid-event' }, 400);
  const now = new Date().toISOString(); const day = dayInHk();
  try {
    const inserted = await env.DB.prepare('INSERT OR IGNORE INTO visit_events (event_id, path, created_at) VALUES (?, ?, ?)').bind(input.eventId, input.path.slice(0, 180), now).run();
    if (inserted.meta.changes !== 1) return json({ accepted: false, duplicate: true });
    await env.DB.batch([
      env.DB.prepare('INSERT INTO visit_daily (day, page_views) VALUES (?, 1) ON CONFLICT(day) DO UPDATE SET page_views = page_views + 1').bind(day),
      env.DB.prepare('UPDATE visit_totals SET page_views = page_views + 1, updated_at = ? WHERE id = 1').bind(now),
    ]);
    return json({ accepted: true });
  } catch (error) { console.error(JSON.stringify({ message: 'visit counter unavailable', error: String(error) })); return json({ accepted: false, reason: 'stats-not-migrated' }, 503); }
}

async function stats(env: Env) {
  if (!env.DB) return json({ available: false, message: '统计服务尚未配置' }, 503);
  let row: Record<string, unknown> | null; let today: Record<string, unknown> | null;
  try { row = await env.DB.prepare('SELECT page_views as totalPageViews, since, updated_at as updatedAt FROM visit_totals WHERE id = 1').first(); today = await env.DB.prepare('SELECT page_views as todayPageViews FROM visit_daily WHERE day = ?').bind(dayInHk()).first(); } catch (error) { console.error(JSON.stringify({ message: 'stats unavailable', error: String(error) })); return json({ available: false, message: '统计数据库尚未初始化' }, 503); }
  return json({ available: true, totalPageViews: row?.totalPageViews ?? 0, todayPageViews: today?.todayPageViews ?? 0, since: row?.since ?? null, updatedAt: row?.updatedAt ?? null }, 200, { 'cache-control': 'public, max-age=60' });
}

export default { async fetch(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  if (url.pathname === '/api/health') return json({ ok: true, service: 'deutsch-lernen-resource-hub' });
  if (url.pathname === '/api/stats' && request.method === 'GET') return stats(env);
  if (url.pathname === '/api/visit' && request.method === 'POST') return visit(request, env);
  if (url.pathname.startsWith('/api/admin/')) {
    const email = await adminEmail(request, env);
    if (!email) return json({ ok: false, error: env.ACCESS_ISSUER ? 'forbidden' : 'admin-auth-not-configured' }, 403);
    if (url.pathname === '/api/admin/resources') return adminResources(request, env, email);
    if (url.pathname === '/api/admin/export') return json({ ok: true, resources: (await env.DB?.prepare('SELECT * FROM resources WHERE status = ? ORDER BY id').bind('published').all())?.results ?? [] });
    return json({ ok: false, error: 'not-found' }, 404);
  }
  if (url.pathname === '/api/public-catalog') return json({ schemaVersion: 1, exportedAt: new Date().toISOString(), resources: catalog.filter((resource) => resource.status === 'published') }, 200, { 'cache-control': 'public, max-age=300' });
  return env.ASSETS?.fetch(request) ?? new Response('Not found', { status: 404 });
} } satisfies ExportedHandler<Env & { ASSETS: Fetcher }>;
