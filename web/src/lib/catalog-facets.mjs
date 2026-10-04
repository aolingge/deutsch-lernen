import {selectResources,isDirectoryResource} from './resource-directory.mjs';
/** @param {import('../types').Resource} r */
export const providerKey = r => r.providerId || new URL(r.url).hostname.replace(/^www\./,'');
/** @param {import('../types').Resource[]} rows */
export function catalogCounts(rows) {
  const items=rows.filter(isDirectoryResource);
  return {resources:items.length,categories:new Set(items.map(r=>r.primaryCategory)).size,sites:new Set(items.map(r=>new URL(r.url).hostname.replace(/^www\./,''))).size,providers:new Set(items.map(providerKey)).size};
}
/** @param {import('../types').Resource[]} items @param {URLSearchParams} params @param {string[]} favorites */
export function buildFacets(items,params=new URLSearchParams(),favorites=[]) {
  /** @type {Record<string, (r: import('../types').Resource) => string[]>} */
  const values = {
    level: r=>r.levelScope==='any'||r.levelScope==='information'?['A1','A2','B1','B2','C1','C2']:r.levels,
    price: r=>[r.price], access: r=>[r.access], skill:r=>r.skills, exam:r=>r.exams.filter(v=>v!=='非考试专项'),
    format:r=>r.mediaTypes?.length?r.mediaTypes:r.formats, provider:r=>[providerKey(r)],
  };
  return Object.fromEntries(Object.entries(values).map(([key,get])=>{
    const all=[...new Set(items.filter(isDirectoryResource).flatMap(get))];
    const selected=params.get(key);
    const available=new Set(all);
    if (selected && !available.has(selected)) all.push(selected);
    const other=new URLSearchParams(params);other.delete(key);
    const relevant=selectResources(items,other,favorites);
    return [key,all.sort((a,b)=>a.localeCompare(b,'zh-CN')).map(value=>({value,count:relevant.filter(r=>get(r).includes(value)).length,available:available.has(value)}))];
  }));
}
