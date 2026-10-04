import test from 'node:test';
import assert from 'node:assert/strict';
import catalog from '../data/resources.json' with {type:'json'};
import {canonicalize,validateResource} from '../src/lib/catalog-schema.mjs';
test('URL canonicalization rejects script URLs and strips fragment duplicates',()=>{assert.equal(canonicalize('https://example.invalid/test/?utm_source=x#section'),'https://example.invalid/test');assert.throws(()=>canonicalize('javascript:alert(1)'));assert.throws(()=>canonicalize('https://user:pass'+'@'+'example.invalid/'));});
test('editor input rejects incorrect levels, scalar arrays and non-string identifiers',()=>{assert.throws(()=>validateResource({...catalog[0],levels:['B3']}));assert.throws(()=>validateResource({...catalog[0],tags:'unsafe'}));assert.throws(()=>validateResource({...catalog[0],id:123}));});

test('resource directory accepts entries without historical instructions and retains existing instructions', () => {
  const { howToUseZh, ...resource } = catalog[0];
  assert.ok(!('howToUseZh' in validateResource(resource)));
  assert.equal(validateResource(catalog[0]).howToUseZh, howToUseZh);
  assert.throws(() => validateResource({ ...resource, howToUseZh: { invalid: true } }));
});

test('editorial metadata validates real dates, nonblank lists and evidence while preserving old records', () => {
  assert.throws(() => validateResource({...catalog[0], lastEditorialCheckedAt:'2026-02-31'}));
  assert.throws(() => validateResource({...catalog[0], skills:[' ']}));
  assert.throws(() => validateResource({...catalog[0], mediaTypes:['求职']}));
  const item = validateResource({...catalog[0], formats:[' 网页 ','网页'], providerId:'dw', mediaTypes:['网页','音频'], levelScope:'any', costNoteZh:'公开音频免费', evidence:[{url:'https://example.org/',fields:['price'],checkedAt:'2026-10-04'}]});
  assert.deepEqual(item.formats,['网页']);
  assert.equal(item.providerId,'dw');
  assert.equal(item.evidence[0].fields[0],'price');
  assert.throws(() => validateResource({...catalog[0], evidence:[{url:'javascript:alert(1)',fields:['price'],checkedAt:'2026-10-04'}]}));
});

