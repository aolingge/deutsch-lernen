import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import manifest from '../data/site-icons.json' with { type: 'json' };
import { siteIcon, siteIconPath } from '../src/lib/site-icons.mjs';

test('icons resolve exact hosts and cannot turn an unknown URL into a remote image', () => {
  const host = Object.keys(manifest)[0];
  assert.ok(host);
  assert.equal(siteIconPath(`https://www.${host}/any/path`), manifest[host].path);
  for (const url of ['https://unknown.example/', 'invalid', `https://${host}.evil.example/`]) {
    assert.equal(siteIconPath(url), '');
    const html = siteIcon(url);
    assert.ok(html.includes('source-icon-fallback'));
    assert.ok(!html.includes('<img'));
  }
  const html = siteIcon(`https://${host}`);
  assert.ok(html.includes('alt=""'));
  assert.ok(html.includes('loading="lazy"'));
  assert.ok(!html.includes('onerror='));
});

test('every cached icon is a local PNG with a public HTTPS provenance URL', () => {
  for (const [host, entry] of Object.entries(manifest)) {
    assert.match(host, /^[a-z0-9.-]+$/);
    assert.equal(entry.path, `/site-icons/${host}.png`);
    const source = new URL(entry.source);
    assert.equal(source.protocol, 'https:');
    assert.equal(source.username + source.password, '');
    const bytes = fs.readFileSync(new URL(`../public${entry.path}`, import.meta.url));
    assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    assert.ok(bytes.readUInt32BE(16) <= 96 && bytes.readUInt32BE(20) <= 96);
  }
});
