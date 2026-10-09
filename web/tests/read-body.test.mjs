import test from 'node:test';
import assert from 'node:assert/strict';
import { readBody } from '../worker/read-body.mjs';

test('body limits measure streamed UTF-8 bytes, preserving characters split across chunks', async () => {
  const bytes=new TextEncoder().encode('中文');
  const request=()=>new Request('https://example.invalid/',{method:'POST',duplex:'half',body:new ReadableStream({start(controller){controller.enqueue(bytes.slice(0,2));controller.enqueue(bytes.slice(2));controller.close();}})});
  assert.equal(await readBody(request(),6),'中文');
  await assert.rejects(()=>readBody(request(),5),/body-too-large/);
});
test('oversized declared bodies are rejected before the stream is read', async () => {
  const request=new Request('https://example.invalid/',{method:'POST',headers:{'content-length':'100'},body:'small'});
  await assert.rejects(()=>readBody(request,20),/body-too-large/);
  assert.equal(request.bodyUsed,false);
  assert.equal(await readBody(new Request('https://example.invalid/'),20),'');
});
