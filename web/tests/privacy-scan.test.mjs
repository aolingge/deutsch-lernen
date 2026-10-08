import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,dirname,basename,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const scanner=fileURLToPath(new URL('../../tools/privacy-scan.ps1',import.meta.url));
const counter='to'+'ken';
const firstPhone='+49 151 '+'12345678';
const secondPhone='+49 151 '+'87654321';
function scan(files) {
  const root=mkdtempSync(join(tmpdir(),'resource-privacy-'));
  try {
    for(const [name,content] of Object.entries(files)) {
      const file=join(root,name);mkdirSync(dirname(file),{recursive:true});writeFileSync(file,content);
    }
    const result=spawnSync('pwsh',['-NoProfile','-File',scanner,root,'-ReportPath',join(root,'report.json')],{encoding:'utf8',timeout:20000});
    if(result.error)throw result.error;
    return {...result,report:JSON.parse(readFileSync(join(root,'report.json'),'utf8').replace(/^\uFEFF/,''))};
  } finally {
    if(dirname(resolve(root))!==resolve(tmpdir())||!basename(root).startsWith('resource-privacy-'))throw new Error('Unsafe test cleanup path');
    rmSync(root,{recursive:true,force:true});
  }
}
test('privacy reports identify a leaked credential without echoing its value',()=>{
  const fake='gh'+'p_'+'A'.repeat(36);
  const result=scan({'example.txt':`credential ${fake}`});
  assert.notEqual(result.status,0);
  assert.ok(result.report.some(hit=>hit.Type==='token-like'));
  assert.ok(!(result.stdout+result.stderr+JSON.stringify(result.report)).includes(fake));
});
test('privacy scan accepts URL identifiers, timestamps, UUIDs and SVG geometry',()=>{
  const result=scan({'docs/check.md':'http://127.0.0.1:4357\nhttps://example.org/assets/1476280042340/icon.png\n2026-10-04T15:01:29.210251+00:00\n931c5dec-4096-4701-a666-f7eda2e78535',
    'web/src/lib/icons.mjs':'const icon = \'<svg viewBox="0 0 24 24"><polyline points="9 12 15 12 15 16 9 16 9 12" /></svg>\';',
    'web/public/reader/data/reading-stats.json':JSON.stringify({totalHoursAt120Wpm:1162218/7200})});
  assert.equal(result.status,0,result.stdout+result.stderr);
  assert.deepEqual(result.report,[]);
});
test('privacy exemptions do not hide a phone beside a URL or inside SVG text',()=>{
  const result=scan({'docs/check.md':`http://127.0.0.1:4357; private contact ${firstPhone}`,
    'web/src/lib/icons.mjs':`const icon = '<svg viewBox="0 0 24 24"><text>${secondPhone}</text></svg>';`});
  assert.notEqual(result.status,0);
  assert.equal(result.report.filter(hit=>hit.Type==='phone-like').length,2);
});
test('speech counters and equality checks are not credential assignments',()=>{
  const result=scan({'web/public/reader/app.js':`const speechState = { ${counter}: 0 };\nconst ${counter} = ++speechState.${counter};\nif (${counter} === speechState.${counter}) {}\nconst ${counter} = speechState.${counter};`});
  assert.equal(result.status,0,result.stdout+result.stderr);
});
test('a second credential assignment on a counter line remains blocked',()=>{
  const result=scan({'web/public/reader/app.js':`const speechState = { ${counter}: 0 }; const ${counter} = "privateCredential";`});
  assert.notEqual(result.status,0);
  assert.ok(result.report.some(hit=>hit.Type==='password-word'));
});
