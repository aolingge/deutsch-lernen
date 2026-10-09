import test from 'node:test';
import assert from 'node:assert/strict';
import catalog from '../data/resources.json' with {type:'json'};
import {buildFacets,catalogCounts,providerIndex} from '../src/lib/catalog-facets.mjs';
import {selectResources,isDirectoryResource} from '../src/lib/resource-directory.mjs';

test('provider index counts live records by stable ID and excludes drafts',()=>{
  const base={...catalog[0],providerId:'group-one'};
  const rows=[base,{...base,id:'second-entry'},{...base,id:'draft-entry',status:'draft'}, {...base,id:'another-provider',providerId:'group-two'}];
  const index=providerIndex(rows);
  assert.deepEqual(index.map(r=>[r.id,r.count]),[['group-one',2],['group-two',1]]);
});

test('facet aggregation preserves counts under combined filters, saved items and pagination',()=>{
  const queries = ['', 'format=应用&category=postal', 'q=报税&price=unknown', 'level=B1&access=open&sort=title&page=2', 'saved=1&format=应用', 'provider=not-in-catalog'];
  const get = { level:r=>r.levelScope==='any'||r.levelScope==='information'?['A1','A2','B1','B2','C1','C2']:r.levels,
    price:r=>[r.price],access:r=>[r.access],skill:r=>r.skills,exam:r=>r.exams.filter(v=>v!=='非考试专项'),
    format:r=>r.mediaTypes?.length?r.mediaTypes:r.formats,provider:r=>[r.providerId||new URL(r.url).hostname.replace(/^www\./,'')] };
  const favorites=['whatsapp','post-dhl','anki'];
  for(const query of queries) {
    const params=new URLSearchParams(query);
    const facets=buildFacets(catalog,params,favorites);
    for(const [key,options] of Object.entries(facets)) {
      const other=new URLSearchParams(params);other.delete(key);
      const expected=selectResources(catalog.filter(isDirectoryResource),other,favorites);
      for(const option of options) assert.equal(option.count,expected.filter(r=>get[key](r).includes(option.value)).length,`${query}: ${key}=${option.value}`);
    }
  }
});

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
