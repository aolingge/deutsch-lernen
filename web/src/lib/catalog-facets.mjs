import {selectResources,isDirectoryResource} from './resource-directory.mjs';
/** @param {import('../types').Resource} r */
export const providerKey = r => r.providerId || new URL(r.url).hostname.replace(/^www\./,'');
/** @param {import('../types').Resource[]} rows */
export function providerIndex(rows) {
  const providers = new Map();
  for (const r of rows.filter(isDirectoryResource)) {
    const id = providerKey(r);
    const row = providers.get(id) || { id, name:r.sourceName, count:0 };
    row.count++;
    providers.set(id,row);
  }
  return [...providers.values()].sort((a,b)=>b.count-a.count || a.name.localeCompare(b.name,'zh-CN'));
}
/** @param {import('../types').Resource[]} rows */
export function catalogCounts(rows) {
  const items=rows.filter(isDirectoryResource);
  return {resources:items.length,categories:new Set(items.map(r=>r.primaryCategory)).size,sites:new Set(items.map(r=>new URL(r.url).hostname.replace(/^www\./,''))).size,providers:new Set(items.map(providerKey)).size};
}
/** @param {import('../types').Resource[]} items @param {URLSearchParams} params @param {string[]} favorites */
export function buildFacets(items,params=new URLSearchParams(),favorites=[]) {
  const live = items.filter(isDirectoryResource);
  /** @type {Map<string, import('../types').Resource[]>} */
  const matching = new Map();
  /** @type {Record<string, (r: import('../types').Resource) => string[]>} */
  const values = {
    level: r=>r.levelScope==='any'||r.levelScope==='information'?['A1','A2','B1','B2','C1','C2']:r.levels,
    price: r=>[r.price], access: r=>[r.access], skill:r=>r.skills, exam:r=>r.exams.filter(v=>v!=='非考试专项'),
    format:r=>r.mediaTypes?.length?r.mediaTypes:r.formats, provider:r=>[providerKey(r)],
  };
  return Object.fromEntries(Object.entries(values).map(([key,get])=>{
    const all=[...new Set(live.flatMap(get))];
    const selected=params.get(key);
    const available=new Set(all);
    if (selected && !available.has(selected)) all.push(selected);
    const other=new URLSearchParams(params);other.delete(key);
    // Counts do not depend on ordering or pagination. Reuse identical queries.
    other.delete('page'); other.set('sort','facet-count'); other.sort();
    const query = other.toString();
    let relevant = matching.get(query);
    if (!relevant) { relevant = selectResources(live,other,favorites); matching.set(query,relevant); }
    /** @type {Map<string, number>} */
    const counts = new Map();
    for (const row of relevant) for (const value of new Set(get(row))) counts.set(value,(counts.get(value)||0)+1);
    return [key,all.sort((a,b)=>a.localeCompare(b,'zh-CN')).map(value=>({value,count:counts.get(value)||0,available:available.has(value)}))];
  }));
}
