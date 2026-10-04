import { validateResource, categoryIds } from './catalog-schema.mjs';
import { isDirectoryResource } from './resource-directory.mjs';

/** Validate completely before replacing the working fallback. @param {unknown} input */
export function parsePublicCatalog(input) {
  const body = /** @type {{schemaVersion?:unknown, resources?:unknown[], categories?:import('../types').Category[]}} */ (input);
  if (!body || body.schemaVersion!==1 || !Array.isArray(body.resources) || !Array.isArray(body.categories) || body.resources.length>500 || body.categories.length>categoryIds.length) throw Error('目录格式不正确');
  const categories=new Set();
  for(const category of body.categories){
    if(!category || !categoryIds.includes(category.id) || typeof category.name!=='string' || !category.name.trim() || categories.has(category.id)) throw Error('目录分类不正确');
    categories.add(category.id);
  }
  const ids=new Set();
  const resources=body.resources.map(raw=>{
    const r=validateResource(raw);
    if(!isDirectoryResource(r) || !categories.has(r.primaryCategory) || ids.has(r.id)) throw Error('公开资源格式不正确');
    ids.add(r.id);
    return r;
  });
  return {resources,categories:body.categories};
}
