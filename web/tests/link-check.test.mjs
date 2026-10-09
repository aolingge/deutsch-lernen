import test from 'node:test';
import assert from 'node:assert/strict';
import { validateTarget, isPublicAddress, classifyStatus, loadCatalog, requestPublic } from '../scripts/check-resource-links.mjs';
import { PassThrough } from 'node:stream';
import { EventEmitter } from 'node:events';
test('resource link checker rejects private destinations and credentialed or nonstandard URLs', () => {
  const ipv4 = (octets) => octets.join('.');
  const loopback = ipv4([127,0,0,1]);
  const metadataAddress = ipv4([169,254,169,254]);
  for (const url of ['http://example.invalid', 'https://localhost/', `https://${loopback}/`, 'https://[::1]/', `https://${metadataAddress}/`, 'https://user:pass'+'@'+'example.invalid/', 'https://example.invalid:8443/']) assert.throws(() => validateTarget(url));
  const privateAddresses = [[10,0,0,2], [172,16,0,1], [192,168,0,1], [100,64,0,1]].map(ipv4);
  for (const address of [...privateAddresses, `::ffff:${loopback}`, 'fc00::1', 'fe80::1', '2001:db8::1']) assert.equal(isPublicAddress(address), false);
  assert.equal(isPublicAddress('8.8.8.8'), true);
  assert.equal(validateTarget('https://www.goethe.de/').hostname, 'www.goethe.de');
});
test('resource link checker separates automation restrictions, actual missing pages and uncertain failures', () => {
  for (const code of [200,206]) assert.equal(classifyStatus(code), 'ok');
  for (const code of [401,403,429]) assert.equal(classifyStatus(code), 'restricted');
  for (const code of [404,410]) assert.equal(classifyStatus(code), 'broken');
  for (const code of [0,500,503]) assert.equal(classifyStatus(code), 'unchecked');
});
test('live catalog loader validates endpoint, schema and resource shape', async () => {
    const request = async () => ({ code: 200, body: JSON.stringify({ schemaVersion: 1, categories: [], resources: [] }) });
    const loaded = await loadCatalog({ liveUrl: 'https://example.org/api/public-catalog', request });
    assert.equal(loaded.source, 'https://example.org/api/public-catalog');
    assert.deepEqual(loaded.resources, []);
    await assert.rejects(() => loadCatalog({ liveUrl: 'https://example.org/not-catalog', request }), /live-catalog-path-required/);
    await assert.rejects(() => loadCatalog({ liveUrl: 'https://example.org/api/public-catalog', request: async()=>({code:302,body:''}) }), /http-302/);
    await assert.rejects(() => loadCatalog({ liveUrl: 'https://example.org/api/public-catalog', request: async()=>({code:200,body:JSON.stringify({schemaVersion:1,categories:[],resources:[{status:'published',rights:'link-only',url:'https://example.org'}]})}) }), /resource-invalid/);
});

function transport({ address = '8.8.8.8', chunks = ['{}'], headers = {} } = {}) {
  let lookups = 0;
  let connected;
  return {
    get lookups() { return lookups; }, get connected() { return connected; },
    lookup(hostname, options, callback) { lookups++; callback(null,[{address,family:4}]); },
    get(url, options, responseCallback) {
      const request = new EventEmitter(); request.destroy=()=>{};
      queueMicrotask(()=> options.lookup(url.hostname,{},(error,selected)=> {
        if(error) { request.emit('error',error); return; }
        connected=selected;
        const response=new PassThrough();response.statusCode=200;response.headers=headers;
        responseCallback(response);
        for (const chunk of chunks) response.write(Buffer.from(chunk));
        response.end();
      }));
      return request;
    },
  };
}
test('catalog transport pins the validated DNS address and rejects private resolutions', async () => {
  const publicTransport=transport();
  const response=await requestPublic('https://example.org/',{maxBytes:20},publicTransport);
  assert.equal(response.body,'{}');
  assert.equal(publicTransport.lookups,1);assert.equal(publicTransport.connected,'8.8.8.8');
  const privateTransport=transport({address:[127,0,0,1].join('.')});
  await assert.rejects(()=>requestPublic('https://example.org/',{maxBytes:20},privateTransport),/unsafe-address/);
  assert.equal(privateTransport.connected,undefined);
});
test('catalog transport enforces streamed and declared byte limits', async () => {
  await assert.rejects(()=>requestPublic('https://example.org/',{maxBytes:5},transport({chunks:['123','456']})),/too-large/);
  await assert.rejects(()=>requestPublic('https://example.org/',{maxBytes:5},transport({headers:{'content-length':'6'}})),/too-large/);
  await assert.rejects(()=>requestPublic('https://example.org/',{maxBytes:5},transport({chunks:['中文']})),/too-large/);
});
