// @ts-nocheck
export const fields = ['id','slug','titleOriginal','titleZh','descriptionZh','howToUseZh','primaryCategory','tags','levels','levelBasis','skills','exams','formats','price','access','languages','sourceName','url','canonicalUrl','rights','status','linkStatus','lastEditorialCheckedAt'];
export const categoryIds = ['courses','exams','vocabulary','grammar','listening','speaking','reading','writing','news','video','tools','life'];
export function canonicalize(value) {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password) throw Error('链接必须为不含凭据的 HTTPS 地址');
  url.hash = '';
  for (const key of [...url.searchParams.keys()]) if (/^(utm_|fbclid|gclid)/.test(key)) url.searchParams.delete(key);
  url.pathname = url.pathname.replace(/\/$/, '') || '/';
  return url.href;
}
export function validateResource(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw Error('资源格式不正确');
  const item = Object.fromEntries(fields.map(key => [key, input[key]]).filter(([,value]) => value !== undefined));
  for (const key of ['id','slug']) if (typeof item[key] !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item[key]) || item[key].length > 100) throw Error('ID 和路径只能使用英文小写、数字和连字符');
  for (const key of ['titleOriginal','titleZh','descriptionZh','howToUseZh','sourceName']) if (typeof item[key] !== 'string' || !item[key].trim() || item[key].length > 3000) throw Error(`缺少或过长的字段：${key}`);
  if (!categoryIds.includes(item.primaryCategory)) throw Error('分类不存在');
  for (const key of ['tags','levels','skills','exams','formats','languages']) if (!Array.isArray(item[key]) || item[key].length > 30 || item[key].some(v => typeof v !== 'string' || v.length > 100)) throw Error(`列表字段格式不正确：${key}`);
  if (!item.tags.length || !item.skills.length || !item.formats.length || !item.languages.length) throw Error('标签、技能、形式、语言不能为空');
  if (item.levels.some(v => !['A1','A2','B1','B2','C1','C2'].includes(v))) throw Error('等级不正确');
  for (const [key,allowed] of Object.entries({levelBasis:['official','editorial','unspecified'],price:['free','freemium','paid','unknown'],access:['open','registration','exam-registration','unknown'],rights:['link-only','owned','licensed'],status:['published','draft','archived'],linkStatus:['unchecked','ok','restricted','broken']})) if (!allowed.includes(item[key])) throw Error(`枚举字段不正确：${key}`);
  canonicalize(item.url); item.canonicalUrl = canonicalize(item.canonicalUrl || item.url);
  if (item.lastEditorialCheckedAt && !/^\d{4}-\d{2}-\d{2}$/.test(item.lastEditorialCheckedAt)) throw Error('核验日期格式不正确');
  return item;
}
