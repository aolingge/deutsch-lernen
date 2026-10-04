// Shared by the static pages and browser. Own study guides remain in the repository.
/** @param {{ status: string, rights: string }} r */
export const isDirectoryResource = (r) => r.status === 'published' && r.rights !== 'owned';
export const priceLabels = { free: '免费', freemium: '部分免费', paid: '付费', unknown: '费用待核实' };
export const accessLabels = { open: '免注册', registration: '需注册', 'exam-registration': '需报名', unknown: '条件待核实' };
/** @param {unknown} value */
const normalize = (value) => String(value ?? '').normalize('NFKC').toLocaleLowerCase().trim();
/** @param {import('../types').Resource[]} items @param {URLSearchParams} params @param {string[]} favorites */
export function selectResources(items, params, favorites = []) {
  const words = normalize(params.get('q')).split(/\s+/).filter(Boolean);
  const saved = new Set(favorites);
  const selected = items.filter((r) => {
    const haystack = normalize([r.titleZh, r.titleOriginal, r.descriptionZh, r.sourceName, r.url, ...r.tags, ...r.levels, ...r.skills, ...r.exams, ...r.formats].join(' '));
    return isDirectoryResource(r) && words.every((word) => haystack.includes(word))
      && (!params.get('level') || r.levels.some((level) => level === params.get('level')))
      && (!params.get('category') || r.primaryCategory === params.get('category'))
      && (!params.get('skill') || r.skills.includes(params.get('skill') || ''))
      && (!params.get('exam') || r.exams.includes(params.get('exam') || ''))
      && (!params.get('price') || r.price === params.get('price'))
      && (!params.get('access') || r.access === params.get('access'))
      && (!params.get('format') || r.formats.includes(params.get('format') || ''))
      && (params.get('saved') !== '1' || saved.has(r.id));
  });
  const sort = params.get('sort');
  if (sort === 'title') selected.sort((a, b) => (a.titleOriginal || a.titleZh).localeCompare(b.titleOriginal || b.titleZh, 'de'));
  if (sort === 'updated') selected.sort((a, b) => (b.lastEditorialCheckedAt || '').localeCompare(a.lastEditorialCheckedAt || '') || a.id.localeCompare(b.id));
  if (sort === 'default' || !sort) selected.sort((a, b) => a.id.localeCompare(b.id));
  return selected;
}
/** @type {Record<string, string>} */
const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
/** @param {unknown} value */
export const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => entities[c]);
/** @param {import('../types').Resource} r @param {import('../types').Category[]} categories @param {boolean} saved */
export function resourceCard(r, categories, saved = false) {
  const e = escapeHtml;
  const category = categories.find((c) => c.id === r.primaryCategory);
  const domain = new URL(r.url).hostname.replace(/^www\./, '');
  const status = { ok: '可访问', restricted: '访问受限', unchecked: '待核验', broken: '链接异常' }[r.linkStatus];
  const mark = (r.titleOriginal || r.sourceName).replace(/[^a-zA-Z0-9]/g, '').slice(0, 2).toUpperCase() || 'DE';
  return `<article class="resource-card live-card" data-category="${e(r.primaryCategory)}">
    <div class="card-top"><span class="source-mark" aria-hidden="true">${e(mark)}</span><div class="source-info"><span>${e(r.sourceName)}</span><small>${e(domain)}</small></div><button type="button" class="bookmark" data-save="${e(r.id)}" aria-label="${saved ? '取消收藏' : '收藏'} ${e(r.titleZh)}" aria-pressed="${saved}">${saved ? '★' : '☆'}</button></div>
    <div class="card-body"><h3><a href="${e(r.url)}" target="_blank" rel="noopener noreferrer">${e(r.titleZh)}<span class="out-arrow" aria-hidden="true">↗</span></a></h3><p class="description">${e(r.descriptionZh)}</p></div>
    <div class="chips"><span class="category-chip">${e(category?.name || '资源')}</span>${r.levels.length ? `<span title="${r.levelBasis === 'official' ? '来源标级' : '编辑参考等级'}">${e(r.levels.join(' · '))}</span>` : ''}</div>
    <div class="card-bottom"><div class="meta"><span class="price ${e(r.price)}">${priceLabels[r.price]}</span><span>${accessLabels[r.access]}</span></div><a class="detail-link" href="/resource/${e(r.slug)}/" aria-label="${e(r.titleZh)}的资源信息">详情 <span aria-hidden="true">→</span></a></div>
    <span class="sr-only">链接记录：${e(status)}；${e(r.lastEditorialCheckedAt || '暂无记录日期')}</span>
  </article>`;
}
