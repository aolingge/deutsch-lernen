import test from 'node:test';
import assert from 'node:assert/strict';
import { validateTarget, isPublicAddress, classifyStatus } from '../scripts/check-resource-links.mjs';
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
