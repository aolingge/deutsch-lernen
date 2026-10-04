import test from 'node:test';
import assert from 'node:assert/strict';
import catalog from '../data/resources.json' with {type:'json'};
import categories from '../data/categories.json' with {type:'json'};
import { parsePublicCatalog } from '../src/lib/public-catalog.mjs';
const good=catalog.find(r=>r.id==='anki');
const body={schemaVersion:1,resources:[good],categories};
test('public refresh validates an entire candidate without modifying the current records',()=>{
  assert.deepEqual(parsePublicCatalog(body).resources,[good]);
  for(const invalid of [null,{...body,schemaVersion:2},{...body,resources:[good,{...good,id:'bad',levels:['B3']}]},{...body,resources:[good,{...good,status:'draft'}]},{...body,categories:[categories[0],categories[0]]},{...body,resources:[good,good]}])assert.throws(()=>parsePublicCatalog(invalid));
  assert.equal(body.resources.length,1);
  assert.equal(body.resources[0],good);
});
