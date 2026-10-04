import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import {generateKeyPair,exportJWK,SignJWT} from 'jose';
import worker from '../.wrangler/test-worker.mjs';
import catalog from '../data/resources.json' with {type:'json'};
const origin='https://hub.example.invalid';
const now=new Date().toISOString();
function database(){const db=new DatabaseSync(':memory:');for(const file of fs.readdirSync('migrations').sort())db.exec(fs.readFileSync('migrations/'+file,'utf8'));const adapter={prepare(sql){let values=[];return {bind(...v){values=v;return this;},async run(){const r=db.prepare(sql).run(...values);return {meta:{changes:Number(r.changes)}};},async first(){return db.prepare(sql).get(...values)??null;},async all(){return {results:db.prepare(sql).all(...values)};}};}};return {db,adapter};}
const request=(path,body)=>new Request(origin+path,{method:body?'POST':'GET',headers:body?{'content-type':'application/json',origin}:{},...(body?{body:JSON.stringify(body)}:{})});
test('concurrent retries increment one persistent view and two distinct events increment two',async()=>{const {db,adapter}=database();const env={DB:adapter};const event={eventId:'concurrent-event-00001',path:'/'};const responses=await Promise.all(Array.from({length:20},()=>worker.fetch(request('/api/visit',event),env)));const payloads=await Promise.all(responses.map(r=>r.json()));assert.equal(payloads.filter(r=>r.accepted).length,1);assert.equal(db.prepare('SELECT page_views FROM visit_totals').get().page_views,1);await worker.fetch(request('/api/visit',{...event,eventId:'different-event-00002'}),env);assert.equal(db.prepare('SELECT page_views FROM visit_totals').get().page_views,2);assert.equal(db.prepare('SELECT sum(page_views) AS views FROM visit_daily').get().views,2);db.close();});
test('failed counter transaction preserves event retry and API reports unavailable',async()=>{const {db,adapter}=database();db.exec('DROP TABLE visit_daily');const response=await worker.fetch(request('/api/visit',{eventId:'retry-atomic-event-01',path:'/'}),{DB:adapter});assert.equal(response.status,503);assert.equal(db.prepare('SELECT count(*) AS count FROM visit_events').get().count,0);db.close();});
test('public catalog excludes drafts, audit identity and revisions',async()=>{const {db,adapter}=database();const r=catalog[0];db.prepare('INSERT INTO catalog_entries(id,slug,canonical_url,category,status,payload_json,updated_at) VALUES(?,?,?,?,?,?,?)').run(r.id,r.slug,r.canonicalUrl,r.primaryCategory,'published',JSON.stringify(r),now);const draft={...r,id:'draft-resource',slug:'draft-resource',canonicalUrl:'https://example.invalid/draft',status:'draft'};db.prepare('INSERT INTO catalog_entries(id,slug,canonical_url,category,status,payload_json,updated_at) VALUES(?,?,?,?,?,?,?)').run(draft.id,draft.slug,draft.canonicalUrl,draft.primaryCategory,draft.status,JSON.stringify(draft),now);const owned={...catalog.find(r=>r.rights==='owned'),status:'published'};db.prepare('INSERT INTO catalog_entries(id,slug,canonical_url,category,status,payload_json,updated_at) VALUES(?,?,?,?,?,?,?)').run(owned.id,owned.slug,owned.canonicalUrl,owned.primaryCategory,owned.status,JSON.stringify(owned),now);const result=await (await worker.fetch(request('/api/public-catalog'),{DB:adapter})).json();assert.equal(result.resources.length,1);assert.equal((await worker.fetch(request('/resource/'+owned.slug),{DB:adapter})).status,302);assert.equal((await worker.fetch(request('/resource/nonexistent-resource'),{DB:adapter})).status,404);assert.ok(!('actor' in result.resources[0]));assert.ok(!('revision' in result.resources[0]));db.close();});

test('one corrupt published record does not break valid catalog entries or sitemap', async () => {
  const { db, adapter } = database();
  const good = catalog.find((r) => r.id === 'anki');
  const insert = db.prepare('INSERT INTO catalog_entries(id,slug,canonical_url,category,status,payload_json,updated_at) VALUES(?,?,?,?,?,?,?)');
  insert.run(good.id,good.slug,good.canonicalUrl,good.primaryCategory,'published',JSON.stringify(good),now);
  insert.run('broken-record','broken-record','https://example.invalid/broken','tools','published',JSON.stringify({ ...good, id: 'broken-record', slug: 'broken-record', levels: ['B3'] }),now);
  const originalError = console.error;
  const diagnostics = [];
  console.error = (...values) => diagnostics.push(values);
  try {
    const response = await worker.fetch(request('/api/public-catalog'), { DB: adapter });
    assert.equal(response.status, 200);
    assert.deepEqual((await response.json()).resources.map((r) => r.id), ['anki']);
    const sitemap = await worker.fetch(request('/sitemap.xml'), { DB: adapter });
    const xml = await sitemap.text();
    assert.equal(sitemap.status, 200);
    assert.ok(xml.includes('/resource/anki/'));
    assert.ok(!xml.includes('broken-record'));
    assert.equal(sitemap.headers.get('x-frame-options'), 'DENY');
    assert.ok(diagnostics.length);
  } finally { console.error = originalError; db.close(); }
});

test('live detail response renders current database content and metadata', async () => {
  const { db, adapter } = database();
  const item = { ...catalog.find((r) => r.id === 'anki'), titleZh: 'Anki 当前内容' };
  db.prepare('INSERT INTO catalog_entries(id,slug,canonical_url,category,status,payload_json,updated_at) VALUES(?,?,?,?,?,?,?)').run(item.id,item.slug,item.canonicalUrl,item.primaryCategory,'published',JSON.stringify(item),now);
  const ASSETS = { async fetch() { return new Response('<head><title>旧</title><meta name="description" content="旧"><link rel="canonical" href="旧"></head><section data-detail>加载中</section>'); } };
  const response = await worker.fetch(request('/resource/anki/?from=%2F%3Flevel%3DB1'), { DB: adapter, ASSETS });
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.ok(html.includes('<h1>Anki 当前内容</h1>'));
  assert.ok(html.includes('href="/?level=B1"'));
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  db.close();
});
test('signed Access identity permits edits; anonymous, forged, wrong origin and stale revisions are denied',async()=>{const {db,adapter}=database();const {privateKey,publicKey}=await generateKeyPair('RS256');const jwk=await exportJWK(publicKey);jwk.kid='test-key';const issuer='https://test-admin.cloudflareaccess.com';const identity=['owner','example.invalid'].join('@');const env={DB:adapter,ACCESS_ISSUER:issuer,ACCESS_AUDIENCE:'test-audience',ADMIN_EMAILS:identity};const originalFetch=globalThis.fetch;globalThis.fetch=async url=>{assert.equal(String(url),issuer+'/cdn-cgi/access/certs');return new Response(JSON.stringify({keys:[jwk]}),{headers:{'content-type':'application/json'}});};
 try {const assertion=await new SignJWT({email:identity}).setProtectedHeader({alg:'RS256',kid:'test-key'}).setIssuer(issuer).setAudience('test-audience').setIssuedAt().setExpirationTime('5m').sign(privateKey);
 const authorized=(method,r,originHeader=origin)=>new Request(origin+'/api/admin/resources',{method,headers:{'Cf-Access-Jwt-Assertion':assertion,'content-type':'application/json',origin:originHeader},...(r?{body:JSON.stringify(r)}:{})});
 assert.equal((await worker.fetch(request('/api/admin/resources'),env)).status,403);
 assert.equal((await worker.fetch(new Request(origin+'/api/admin/resources',{headers:{'Cf-Access-Jwt-Assertion':'forged'}}),env)).status,403);
 const item={...catalog[0],status:'draft'};assert.equal((await worker.fetch(authorized('POST',item,'https://different.example.invalid'),env)).status,403);
 assert.equal((await worker.fetch(authorized('POST',item),env)).status,201);assert.equal((await worker.fetch(authorized('POST',item),env)).status,409);
 const published={...item,status:'published',revision:1};assert.equal((await worker.fetch(authorized('PUT',published),env)).status,200);assert.equal((await worker.fetch(authorized('PUT',published),env)).status,409);
 const publicRows=await (await worker.fetch(request('/api/public-catalog'),env)).json();assert.equal(publicRows.resources[0].status,'published');assert.equal(db.prepare('SELECT count(*) AS count FROM catalog_audit').get().count,2);
 } finally{globalThis.fetch=originalFetch;db.close();}
});
