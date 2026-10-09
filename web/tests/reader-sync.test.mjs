import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import worker from '../.wrangler/test-worker.mjs';
const origin = 'https://reader.example.invalid';
function database() { const db = new DatabaseSync(':memory:'); for (const file of fs.readdirSync('migrations').sort()) db.exec(fs.readFileSync('migrations/' + file, 'utf8')); return { db, DB: { prepare(sql) { let values = []; return { bind(...args) { values = args; return this; }, async first() { return db.prepare(sql).get(...values) || null; }, async run() { return {meta:{changes:Number(db.prepare(sql).run(...values).changes)}}; } }; } } }; }
const id = 'ab'.repeat(16), token = 'cd'.repeat(32), payload = {iv: 'Z'.repeat(16), ciphertext: 'Y'.repeat(32)};
const request = (data, bearer = token, source = origin) => new Request(origin + '/api/reader-sync', {method:'POST',headers:{origin:source,'content-type':'application/json',authorization:'Bearer '+bearer},body:JSON.stringify({id,...data})});
test('encrypted sync requires capability, keeps only ciphertext, and detects concurrent revisions', async () => {
  const {db,DB} = database(), env = {DB,SYNC_LIMIT:{limit:async()=>({success:true})}};
  try {
    assert.equal((await worker.fetch(request({action:'read'}),env)).status,404);
    assert.equal((await worker.fetch(request({action:'write',revision:0,...payload}),env)).status,200);
    const read = await worker.fetch(request({action:'read'}),env); assert.equal(read.headers.get('cache-control'),'no-store'); assert.deepEqual((await read.json()).ciphertext,payload.ciphertext);
    const row=db.prepare('SELECT * FROM reader_sync').get(); assert.notEqual(row.token_hash,token); assert.equal(row.ciphertext,payload.ciphertext); assert.ok(!('key' in row));
    assert.equal((await worker.fetch(request({action:'read'},'ef'.repeat(32)),env)).status,401);
    const writes=await Promise.all([1,2].map(()=>worker.fetch(request({action:'write',revision:1,...payload}),env))); assert.deepEqual(writes.map(r=>r.status).sort(),[200,409]);
    assert.equal(db.prepare('SELECT revision FROM reader_sync').get().revision,2);
    assert.equal((await worker.fetch(request({action:'write',revision:0,...payload}),env)).status,409);
  } finally {db.close();}
});
test('sync rejects cross origin, invalid ciphertext, excess bodies, rate limits and missing storage', async () => {
  const {db,DB} = database(), env = {DB,SYNC_LIMIT:{limit:async()=>({success:true})}};
  try {
    assert.equal((await worker.fetch(request({action:'read'},token,'https://other.example.invalid'),env)).status,403);
    assert.equal((await worker.fetch(request({action:'read'},''),env)).status,401);
    assert.equal((await worker.fetch(request({action:'write',revision:0,iv:payload.iv,ciphertext:'wrong'}),env)).status,400);
    assert.equal((await worker.fetch(request({action:'write',revision:0,...payload,ciphertext:'A'.repeat(800000)}),env)).status,413);
    assert.equal((await worker.fetch(request({action:'read'}),{DB,SYNC_LIMIT:{limit:async()=>({success:false})}})).status,429);
    assert.equal((await worker.fetch(request({action:'read'}),{DB})).status,503);
    assert.equal(db.prepare('SELECT count(*) AS n FROM reader_sync').get().n,0);
  } finally {db.close();}
});
test('personal sync storage has a hard creation cap while existing devices can still update', async () => {
  const {db,DB}=database(),env={DB,SYNC_LIMIT:{limit:async()=>({success:true})}};
  try {
    await worker.fetch(request({action:'write',revision:0,...payload}),env);
    const insert=db.prepare('INSERT INTO reader_sync(id,token_hash,revision,iv,ciphertext,updated_at) VALUES(?,?,1,?,?,?)');
    for(let i=0;i<99;i++) insert.run(i.toString(16).padStart(32,'0'),'fixture-hash',payload.iv,payload.ciphertext,'2026-10-08');
    assert.equal((await worker.fetch(request({action:'write',revision:1,...payload}),env)).status,200);
    const full=await worker.fetch(request({id:'ef'.repeat(16),action:'write',revision:0,...payload}),env);
    assert.equal(full.status,503);assert.equal((await full.json()).error,'capacity-reached');
    assert.equal(db.prepare('SELECT count(*) AS n FROM reader_sync').get().n,100);
  } finally {db.close();}
});
