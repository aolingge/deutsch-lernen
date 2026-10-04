import { validateResource } from './catalog-schema.mjs';

const arrays = new Set(['levels','skills','tags','exams','formats','mediaTypes','languages','interfaceLanguages','aliases']);
const optional = new Set(['howToUseZh','providerId','providerType','mediaTypes','costNoteZh','accessNoteZh','interfaceLanguages','levelScope','readingDifficultyZh','aliases','lastLinkCheckedAt','editorialStatus','editorialNoteZh']);

/** Preserve metadata that the editor does not expose. @param {Record<string, unknown>|null} original @param {Iterable<[string, unknown]>} entries */
export function buildResourceEdit(original, entries) {
  const item = { ...original };
  for (const [key, raw] of entries) {
    const value = String(raw).trim();
    if (!value && optional.has(key)) delete item[key];
    else item[key] = arrays.has(key) ? value.split(/[,，]/).map(v => v.trim()).filter(Boolean) : value;
  }
  if (!original || item.url !== original.url) item.canonicalUrl = item.url;
  item.rights ??= 'link-only';
  return validateResource(item);
}

/** Imports only create new drafts; an existing record is never overwritten. @param {unknown[]} rows @param {Record<string, unknown>[]} existing */
export function prepareDraftImport(rows, existing) {
  if (!rows.length || rows.length > 200) throw Error('每次导入 1–200 条资源');
  const used = new Map();
  for (const r of existing) for (const key of ['id','slug','canonicalUrl']) used.set(`${key}:${r[key]}`, String(r.titleZh));
  return rows.map((raw, index) => {
    const r = validateResource({ ...(/** @type {Record<string, unknown>} */ (raw)), status: 'draft' });
    for (const key of ['id','slug','canonicalUrl']) {
      const identifier = `${key}:${r[key]}`;
      if (used.has(identifier)) throw Error(`第 ${index + 1} 条「${r.titleZh}」的 ${key} 与「${used.get(identifier)}」重复；请修正后重新预览`);
      used.set(identifier, r.titleZh);
    }
    return r;
  });
}
