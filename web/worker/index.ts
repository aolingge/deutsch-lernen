import seed from '../data/resources.json';
import categories from '../data/categories.json';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { validateResource } from '../src/lib/catalog-schema.mjs';
import { isDirectoryResource, escapeHtml } from '../src/lib/resource-directory.mjs';
import { renderDetailDocument } from '../src/lib/detail-document.mjs';
import { readBody } from './read-body.mjs';
import { readerSync } from './reader-sync.mjs';

interface Statement { bind(...values: unknown[]): Statement; run(): Promise<{meta:{changes:number}}> ; first<T=Record<string,unknown>>():Promise<T|null>; all<T=Record<string,unknown>>():Promise<{results:T[]}>; }
export type Env = { DB?: {prepare(sql:string):Statement}; ASSETS: {fetch(request:Request):Promise<Response>}; SYNC_LIMIT?: {limit(input:{key:string}):Promise<{success:boolean}>}; VISIT_LIMIT?: {limit(input:{key:string}):Promise<{success:boolean}>}; ACCESS_ISSUER?: string; ACCESS_AUDIENCE?: string; ADMIN_EMAILS?: string };
const json = (body: unknown, status = 200, headers: Record<string,string> = {}) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', ...headers } });
const jwksByIssuer = new Map<string, ReturnType<typeof createRemoteJWKSet>>();
function publicRecord(item: ReturnType<typeof validateResource>) {
  const { howToUseZh, evidence, ...publicItem } = item;
  return publicItem;
}
export async function adminEmail(request: Request, env: Env) {
  if (!env.ACCESS_ISSUER || !env.ACCESS_AUDIENCE || !env.ADMIN_EMAILS) return null;
  const assertion = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!assertion) return null;
  try {
    const issuer = env.ACCESS_ISSUER.replace(/\/$/, '');
    if (!/^https:\/\/[a-z0-9-]+\.cloudflareaccess\.com$/.test(issuer)) return null;
    let jwks = jwksByIssuer.get(issuer);
    if (!jwks) { jwks = createRemoteJWKSet(new URL(issuer + '/cdn-cgi/access/certs')); jwksByIssuer.set(issuer, jwks); }
    const { payload } = await jwtVerify(assertion, jwks, { issuer, audience: env.ACCESS_AUDIENCE, algorithms: ['RS256'] });
    if (typeof payload.exp !== 'number' || typeof payload.email !== 'string') return null;
    const email = payload.email.toLowerCase();
    return env.ADMIN_EMAILS.split(',').map(v => v.trim().toLowerCase()).includes(email) ? email : null;
  } catch { return null; }
}
async function publicCatalog(env: Env) {
  if (!env.DB) return { resources: seed.filter(isDirectoryResource).map(publicRecord), categories };
  const rows = await env.DB.prepare("SELECT id, payload_json FROM catalog_entries WHERE status = 'published' ORDER BY id").all<{id: string; payload_json: string}>();
  const resources = rows.results.flatMap((row) => {
    try { const item = validateResource(JSON.parse(row.payload_json)); return isDirectoryResource(item) ? [publicRecord(item)] : []; }
    catch { console.error('Invalid public catalog record', row.id); return []; }
  });
  return { resources, categories };
}
async function publicResource(env: Env, slug: string) {
  if (!env.DB) {
    const item = seed.find(r => r.slug === slug && isDirectoryResource(r));
    return item ? publicRecord(item) : null;
  }
  // slug is unique and indexed; detail views need only their current record.
  const row = await env.DB.prepare("SELECT id, payload_json FROM catalog_entries WHERE slug = ? AND status = 'published' LIMIT 1").bind(slug).first<{id:string;payload_json:string}>();
  if (!row) return null;
  try {
    const item = validateResource(JSON.parse(row.payload_json));
    return item.slug === slug && isDirectoryResource(item) ? publicRecord(item) : null;
  } catch { console.error('Invalid public catalog record', row.id); return null; }
}
function secure(response: Response) {
  const secured = new Response(response.body, response);
  secured.headers.set('x-content-type-options', 'nosniff');
  secured.headers.set('referrer-policy', 'strict-origin-when-cross-origin');
  secured.headers.set('x-frame-options', 'DENY');
  secured.headers.set('content-security-policy-report-only', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; object-src 'none'");
  return secured;
}
async function admin(request: Request, env: Env, path: string) {
  const email = await adminEmail(request, env);
  if (!email) return json({ error: env.ACCESS_ISSUER ? 'forbidden' : 'admin-auth-not-configured' }, 403);
  if (!env.DB) return json({ error: 'database-unavailable' },503);
  if (path === '/api/admin/session') return json({ ok:true });
  if (path === '/api/admin/export') return json({ schemaVersion:1, ...(await publicCatalog(env)) });
  if (path !== '/api/admin/resources') return json({ error:'not-found' },404);
  if (request.method === 'GET') {
    const rows = await env.DB.prepare('SELECT payload_json, revision FROM catalog_entries ORDER BY id').all<{payload_json:string;revision:number}>();
    return json({ resources: rows.results.map(r => ({ ...JSON.parse(r.payload_json), revision:r.revision })), categories });
  }
  if (!['POST','PUT'].includes(request.method)) return json({error:'method-not-allowed'},405,{allow:'GET, POST, PUT'});
  if (request.headers.get('origin') !== new URL(request.url).origin) return json({error:'cross-origin-write'},403);
  if (!request.headers.get('content-type')?.startsWith('application/json')) return json({error:'expected-json'},415);
  let raw: string;
  try { raw = await readBody(request, 32768); } catch { return json({error:'resource-too-large'},413); }
  let input: Record<string,unknown>;
  let item: ReturnType<typeof validateResource>;
  try { input=JSON.parse(raw); item=validateResource(input); } catch (error) { return json({error:'invalid-resource',message:String(error)},400); }
  const now=new Date().toISOString();
  const values=[item.slug,item.canonicalUrl,item.primaryCategory,item.status,JSON.stringify(item),now,email];
  try {
    if (request.method === 'POST') {
      await env.DB.prepare('INSERT INTO catalog_entries(slug,canonical_url,category,status,payload_json,updated_at,actor,id) VALUES(?,?,?,?,?,?,?,?)').bind(...values,item.id).run();
      return json({ok:true,id:item.id,revision:1},201);
    }
    if (!Number.isInteger(input.revision) || Number(input.revision)<1) return json({error:'revision-required'},400);
    const result=await env.DB.prepare('UPDATE catalog_entries SET slug=?,canonical_url=?,category=?,status=?,payload_json=?,updated_at=?,actor=?,revision=revision+1 WHERE id=? AND revision=?').bind(...values,item.id,input.revision).run();
    if (result.meta.changes !== 1) return json({error:'revision-conflict'},409);
    return json({ok:true,id:item.id,revision:Number(input.revision)+1});
  } catch { return json({error:'duplicate-id-slug-or-url'},409); }
}
async function visit(request: Request, env: Env) {
  if (!env.DB) return json({accepted:false,reason:'stats-unavailable'},503);
  if (env.VISIT_LIMIT && !(await env.VISIT_LIMIT.limit({key:request.headers.get('cf-connecting-ip')??'local'})).success) return json({accepted:false,reason:'rate-limited'},429,{'retry-after':'60'});
  if (!request.headers.get('content-type')?.startsWith('application/json')) return json({accepted:false,reason:'expected-json'},415);
  const origin=request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return json({accepted:false,reason:'cross-origin'},403);
  let raw: string;
  try { raw=await readBody(request,1024); } catch { return json({accepted:false,reason:'too-large'},413); }
  let input: {eventId?:unknown;path?:unknown};
  try { input=JSON.parse(raw); } catch { return json({accepted:false,reason:'invalid-json'},400); }
  if (!input || typeof input.eventId !== 'string' || !/^[a-zA-Z0-9_-]{12,80}$/.test(input.eventId) || typeof input.path !== 'string' || !/^\/(?!\/)[a-zA-Z0-9/_-]{0,179}$/.test(input.path) || /^\/(admin|api)(\/|$)/.test(input.path)) return json({accepted:false,reason:'invalid-event'},400);
  const now=new Date().toISOString();
  const day=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Hong_Kong'}).format(new Date());
  const inserted=await env.DB.prepare('INSERT OR IGNORE INTO visit_events(event_id,path,created_at,day) VALUES(?,?,?,?)').bind(input.eventId,input.path,now,day).run();
  return json({accepted:inserted.meta.changes===1,duplicate:inserted.meta.changes!==1});
}
async function stats(env: Env) {
  if (!env.DB) return json({available:false,message:'统计服务尚未配置'},503);
  const day=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Hong_Kong'}).format(new Date());
  const row=await env.DB.prepare('SELECT page_views AS totalPageViews,since,updated_at AS updatedAt FROM visit_totals WHERE id=1').first();
  const today=await env.DB.prepare('SELECT page_views AS count FROM visit_daily WHERE day=?').bind(day).first<{count:number}>();
  if (!row) return json({available:false,message:'统计数据库尚未初始化'},503);
  return json({available:true,...row,todayPageViews:today?.count??0},200,{'cache-control':'public, max-age=30'});
}
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url=new URL(request.url); const path=url.pathname.replace(/\/$/,'') || '/';
    try {
      if (path==='/api/health') return json({ok:true,service:'deutsch-lernen-resource-hub'});
      if (path==='/api/public-catalog' && request.method==='GET') return json({schemaVersion:1,...(await publicCatalog(env))},200,{'cache-control':'public, max-age=30'});
      if (path==='/api/stats' && request.method==='GET') return await stats(env);
      if (path==='/api/visit' && request.method==='POST') return await visit(request,env);
      if (path==='/api/reader-sync') return await readerSync(request,env);
      if (path.startsWith('/api/admin/')) return await admin(request,env,path);
      if (path.startsWith('/api/')) return json({error:'not-found'},404);
      if (path === '/sitemap.xml') {
        const { resources } = await publicCatalog(env);
        const paths = ['/', '/exams/', '/news/', '/sources/', '/reading/', '/apps/', ...resources.map((r) => `/resource/${r.slug}/`)];
        const xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + paths.map((p) => `<url><loc>${escapeHtml(new URL(p, url.origin).href)}</loc></url>`).join('') + '</urlset>';
        return secure(new Response(request.method === 'HEAD' ? null : xml, { headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'public, max-age=30' } }));
      }
      if (/^\/resource\/[a-z0-9-]+$/.test(path)) {
        const slug=path.split('/')[2];
        const resource = await publicResource(env, slug);
        if (!resource) {
          if (seed.some(r=>r.slug===slug && r.rights==='owned')) return Response.redirect(url.origin+'/resources/',302);
          return secure(new Response('资源不存在或尚未公开',{status:404}));
        }
        const detailURL = new URL(url);
        url.pathname='/resource/view/';
        url.search = '';
        const template = await env.ASSETS.fetch(new Request(url, { method: 'GET', headers: request.headers }));
        if (!template.ok) throw Error('Detail template unavailable');
        const html = renderDetailDocument(await template.text(), resource, categories, detailURL);
        return secure(new Response(request.method === 'HEAD' ? null : html, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } }));
      }
      const response=await env.ASSETS.fetch(request);
      return secure(response);
    } catch { return json({error:'service-unavailable',message:'服务暂不可用，请稍后重试'},503); }
  }
};

