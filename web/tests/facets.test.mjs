import test from 'node:test';
import assert from 'node:assert/strict';
import catalog from '../data/resources.json' with {type:'json'};
import {buildFacets,catalogCounts} from '../src/lib/catalog-facets.mjs';

test('facets include live values, preserve unavailable choices and count without their own constraint',()=>{
  const a={...catalog[0],id:'facet-a',skills:['新增技能'],formats:['PDF'],mediaTypes:['PDF'],price:'free',providerId:'sample'};
  const b={...a,id:'facet-b',skills:['听力'],price:'paid'};
  const params=new URLSearchParams('skill=新增技能&price=free');
  const f=buildFacets([a,b],params);
  assert.equal(f.skill.find(o=>o.value==='新增技能').count,1);
  assert.equal(f.price.find(o=>o.value==='paid').count,0);
  // Counts retain every other active constraint; only the facet's own filter is removed.
  assert.equal(buildFacets([a,b],new URLSearchParams('skill=新增技能')).price.find(o=>o.value==='paid').count,0);
  assert.equal(f.format.find(o=>o.value==='PDF').count,1);
  assert.equal(f.provider[0].value,'sample');
  const missing=buildFacets([b],new URLSearchParams('skill=新增技能')).skill.find(o=>o.value==='新增技能');
  assert.equal(missing.available,false);
  assert.equal(missing.count,0);
  assert.deepEqual(catalogCounts([a,b]),{resources:2,categories:1,sites:1,providers:1});
});
