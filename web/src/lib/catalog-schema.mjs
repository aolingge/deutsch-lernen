// @ts-nocheck
export const fields = ['id','slug','titleOriginal','titleZh','descriptionZh','howToUseZh','primaryCategory','tags','levels','levelBasis','skills','exams','formats','price','access','languages','sourceName','url','canonicalUrl','rights','status','linkStatus','lastEditorialCheckedAt','providerId','providerType','mediaTypes','costNoteZh','accessNoteZh','interfaceLanguages','levelScope','readingDifficultyZh','aliases','lastLinkCheckedAt','editorialStatus','editorialNoteZh','evidence'];
export const mediaTypes = ['网页','PDF','音频','视频','应用','RSS','电子书','图书'];
export function validDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value+'T00:00:00Z');
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0,10) === value;
}
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
  for (const key of ['titleOriginal','titleZh','descriptionZh','sourceName']) if (typeof item[key] !== 'string' || !item[key].trim() || item[key].length > 3000) throw Error(`缺少或过长的字段：${key}`);
  if (item.howToUseZh !== undefined && (typeof item.howToUseZh !== 'string' || item.howToUseZh.length > 3000)) throw Error('历史说明字段格式不正确');
  if (!categoryIds.includes(item.primaryCategory)) throw Error('分类不存在');
  for (const key of ['tags','levels','skills','exams','formats','languages','mediaTypes','interfaceLanguages','aliases']) {
    if (item[key] === undefined && ['mediaTypes','interfaceLanguages','aliases'].includes(key)) continue;
    if (!Array.isArray(item[key]) || item[key].length > 30 || item[key].some(v => typeof v !== 'string' || !v.trim() || v.length > 100)) throw Error(`列表字段格式不正确：${key}`);
    item[key] = [...new Set(item[key].map(v=>v.trim()))];
  }
  if (!item.tags.length || !item.skills.length || !item.formats.length || !item.languages.length) throw Error('标签、技能、形式、语言不能为空');
  if (item.levels.some(v => !['A1','A2','B1','B2','C1','C2'].includes(v))) throw Error('等级不正确');
  for (const [key,allowed] of Object.entries({levelBasis:['official','editorial','unspecified'],price:['free','freemium','paid','unknown'],access:['open','registration','exam-registration','unknown'],rights:['link-only','owned','licensed'],status:['published','draft','archived'],linkStatus:['unchecked','ok','restricted','broken']})) if (!allowed.includes(item[key])) throw Error(`枚举字段不正确：${key}`);
  canonicalize(item.url); item.canonicalUrl = canonicalize(item.canonicalUrl || item.url);
  if (item.lastEditorialCheckedAt && !validDate(item.lastEditorialCheckedAt)) throw Error('资料核验日期不正确');
  if (item.lastLinkCheckedAt && !(validDate(item.lastLinkCheckedAt) || (typeof item.lastLinkCheckedAt==='string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(item.lastLinkCheckedAt) && validDate(item.lastLinkCheckedAt.slice(0,10)) && Number.isFinite(Date.parse(item.lastLinkCheckedAt))))) throw Error('链接检查时间不正确');
  if (item.providerId !== undefined && (typeof item.providerId !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.providerId) || item.providerId.length>100)) throw Error('来源 ID 不正确');
  for (const [key,allowed] of Object.entries({providerType:['institution','public-media','publisher','community','commercial','independent','unspecified'],levelScope:['learning','any','information'],editorialStatus:['verified','partial','unverified']})) if (item[key]!==undefined && !allowed.includes(item[key])) throw Error(`编辑字段不正确：${key}`);
  if (item.mediaTypes?.some(v=>!mediaTypes.includes(v))) throw Error('媒体类型不正确');
  for (const key of ['costNoteZh','accessNoteZh','readingDifficultyZh','editorialNoteZh']) if (item[key]!==undefined && (typeof item[key]!=='string' || item[key].length>1000)) throw Error(`说明字段不正确：${key}`);
  if (item.evidence!==undefined) {
    const scopes=['purpose','name','price','access','levels','languages','media','provider'];
    if (!Array.isArray(item.evidence) || item.evidence.length>10) throw Error('来源依据格式不正确');
    item.evidence=item.evidence.map(entry=>{
      if (!entry || typeof entry!=='object' || !Array.isArray(entry.fields) || !entry.fields.length || entry.fields.some(v=>!scopes.includes(v)) || !validDate(entry.checkedAt)) throw Error('来源依据格式不正确');
      canonicalize(entry.url);
      return {url:entry.url,fields:[...new Set(entry.fields)],checkedAt:entry.checkedAt};
    });
  }
  return item;
}
