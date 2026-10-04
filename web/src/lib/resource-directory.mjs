import { icon } from './icons.mjs';
// Shared by the static pages and browser. Own study guides remain in the repository.
/** @param {{ status: string, rights: string }} r */
export const isDirectoryResource = (r) => r.status === 'published' && r.rights !== 'owned';
export const priceLabels = { free: '免费', freemium: '部分免费', paid: '付费', unknown: '费用待核实' };
export const accessLabels = { open: '免注册', registration: '需注册', 'exam-registration': '需报名', unknown: '条件待核实' };
/** @param {unknown} value */
const normalize = (value) => String(value ?? '').normalize('NFKC').toLocaleLowerCase().trim();
const aliases = [
  ['testdaf', '德福', '德福考试', 'testdaf考试'], ['词典', '字典', 'dictionary', 'wörterbuch', 'worterbuch'],
  ['免费', '免费资源', 'free'], ['播客', 'podcast', 'podcasts'], ['goethe', '歌德'], ['nicos', 'nikos'],
];
/** @param {string} word */
const searchTerms = (word) => aliases.find((group) => group.includes(word)) || [word];
/** Only directory routes may be used as an internal return destination. @param {unknown} value */
export function directoryReturnPath(value) {
  const text = String(value || '');
  return /^\/(?:resources\/|favorites\/|my-study\/|exams\/|news\/|study\/|levels\/(?:a1|a2|b1|b2|c1|c2)\/)?(?:\?[^#\s]*)?$/.test(text) ? text : '/resources/';
}
/** @param {import('../types').Resource[]} items @param {URLSearchParams} params @param {string[]} favorites */
export function selectResources(items, params, favorites = []) {
  const words = normalize(params.get('q')).split(/\s+/).filter(Boolean);
  const saved = new Set(favorites);
  const selected = items.filter((r) => {
    const haystack = normalize([
      r.titleZh, r.titleOriginal, r.descriptionZh, r.sourceName, r.url,
      ...r.tags, ...r.levels, ...r.skills, ...r.exams, ...r.formats,
      ...(r.mediaTypes || []), ...(r.aliases || []),
      r.price === 'free' ? '免费 free' : r.price === 'freemium' ? '部分免费 freemium' : r.price === 'paid' ? '付费 paid' : '',
    ].join(' '));
    return isDirectoryResource(r) && words.every((word) => searchTerms(word).some((term) => haystack.includes(term)))
      && (!params.get('level') || r.levelScope === 'any' || r.levelScope === 'information' || r.levels.some((level) => level === params.get('level')))
      && (!params.get('category') || r.primaryCategory === params.get('category'))
      && (!params.get('skill') || r.skills.includes(params.get('skill') || ''))
      && (!params.get('exam') || r.exams.includes(params.get('exam') || ''))
      && (!params.get('price') || r.price === params.get('price'))
      && (!params.get('access') || r.access === params.get('access'))
      && (!params.get('format') || (r.mediaTypes?.length ? r.mediaTypes : r.formats).includes(params.get('format') || ''))
      && (!params.get('provider') || (r.providerId || new URL(r.url).hostname.replace(/^www\./,'')) === params.get('provider'))
      && (params.get('saved') !== '1' || saved.has(r.id));
  });
  const sort = params.get('sort');
  if (sort === 'title') selected.sort((a, b) => (a.titleOriginal || a.titleZh).localeCompare(b.titleOriginal || b.titleZh, 'de'));
  if (sort === 'updated') selected.sort((a, b) => (b.lastEditorialCheckedAt || '').localeCompare(a.lastEditorialCheckedAt || '') || a.id.localeCompare(b.id));
  if (sort === 'default' || !sort) {
    /** @param {import('../types').Resource} r */
    const relevance = (r) => words.reduce((score, word) => score + Math.max(...searchTerms(word).map((term) => {
      const title = normalize([r.titleZh, r.titleOriginal].join(' '));
      return (title.includes(term) ? 8 : 0) + (normalize(r.sourceName).includes(term) ? 4 : 0);
    })), 0);
    selected.sort((a, b) => relevance(b) - relevance(a) || a.id.localeCompare(b.id));
  }
  return selected;
}
/** @type {Record<string, string>} */
const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
/** @param {unknown} value */
export const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => entities[c]);
/** @param {import('../types').Resource} r @param {import('../types').Category[]} categories @param {boolean} saved @param {string} returnTo */
export function resourceCard(r, categories, saved = false, returnTo = '') {
  const e = escapeHtml;
  const category = categories.find((c) => c.id === r.primaryCategory);
  const domain = new URL(r.url).hostname.replace(/^www\./, '');
  const status = { ok: '可访问', restricted: '自动访问受限', unchecked: '待核验', broken: '链接异常' }[r.linkStatus];
  /** @type {Record<string, string>} */
  const domainMarks = { 'dw.com': 'DW', 'goethe.de': 'GI', 'testdaf.de': 'TD', 'telc.net': 'telc', 'duden.de': 'Du', 'deepl.com': 'DL', 'duolingo.com': 'Duo', 'apps.ankiweb.net': 'Anki' };
  const mark = domainMarks[domain] || (domain.split('.').at(-2) || domain).slice(0, 3).toUpperCase();
  const detailHref = `/resource/${r.slug}/` + (returnTo ? '?' + new URLSearchParams({ from: directoryReturnPath(returnTo) }) : '');
  const media = [...new Set(r.mediaTypes?.length ? r.mediaTypes : r.formats)].slice(0, 2);
  return `<article class="resource-card live-card" data-category="${e(r.primaryCategory)}">
    <div class="card-top"><span class="source-mark" aria-hidden="true">${e(mark)}</span><div class="source-info"><span>${e(r.sourceName)}</span><small>${e(domain)}</small></div><button type="button" class="bookmark" data-save="${e(r.id)}" aria-label="${saved ? '取消收藏' : '收藏'} ${e(r.titleZh)}" aria-pressed="${saved}">${icon('star')}</button></div>
    <div class="card-body"><h3><a href="${e(r.url)}" target="_blank" rel="noopener noreferrer">${e(r.titleZh)}<span class="out-arrow" aria-hidden="true">${icon('arrow-up-right')}</span></a></h3><p class="description">${e(r.descriptionZh)}</p></div>
    <div class="chips"><span class="category-chip">${e(category?.name || '资源')}</span>${r.levels.length ? `<span title="${r.levelBasis === 'official' ? '来源标级' : '编辑参考等级'}">${e(r.levels.join(' · '))}</span>` : ''}${media.map((format) => `<span class="format-chip">${e(format)}</span>`).join('')}</div>
    ${r.linkStatus !== 'ok' ? `<p class="link-status ${e(r.linkStatus)}">${e(status)}</p>` : ''}
    <div class="card-bottom"><div class="meta"><span class="price ${e(r.price)}">${priceLabels[r.price]}</span><span>${accessLabels[r.access]}</span></div><a class="detail-link" href="${e(detailHref)}" aria-label="${e(r.titleZh)}的资源信息">详情 <span aria-hidden="true">${icon('arrow-right')}</span></a></div>
    <span class="sr-only">链接记录：${e(status)}；${e(r.lastEditorialCheckedAt || '暂无记录日期')}</span>
  </article>`;
}

/** @param {import('../types').Resource} r @param {import('../types').Category[]} categories @param {string} returnTo */
export function resourceDetail(r, categories, returnTo = '/resources/') {
  const e = escapeHtml;
  const status = { ok: '链接可访问', restricted: '自动访问受限', broken: '链接异常', unchecked: '待核验' }[r.linkStatus];
  const facts = [['来源', r.sourceName], ['费用', [priceLabels[r.price], r.costNoteZh].filter(Boolean).join('；')], ['访问条件', [accessLabels[r.access], r.accessNoteZh].filter(Boolean).join('；')], ['参考等级', r.levels.join(' · ') || '未标级'], ['内容形式', (r.mediaTypes?.length ? r.mediaTypes : r.formats).join(' · ')], ['技能 / 主题', r.skills.join(' · ')], ['语言', r.languages.join(' · ')], ['核验记录', `${status} / ${r.lastEditorialCheckedAt || '暂无日期'}`], ['网站', new URL(r.url).hostname]];
  return `<a class="detail-back" href="${e(directoryReturnPath(returnTo))}">← 返回资源目录</a><div class="detail-header"><div><p class="detail-label">${e(categories.find((c) => c.id === r.primaryCategory)?.name)}</p><h1>${e(r.titleZh)}</h1><p class="original">${e(r.titleOriginal)}</p></div></div><p class="detail-intro">${e(r.descriptionZh)}</p><div class="detail-actions"><a class="action-link" href="${e(r.url)}" target="_blank" rel="noopener noreferrer">打开原站 ↗</a><button type="button" data-save="${e(r.id)}" aria-label="收藏资源" aria-pressed="false">☆ 收藏资源</button></div><p id="resource-note" role="status" class="detail-note"></p><dl class="detail-facts">${facts.map(([key, val]) => `<div><dt>${e(key)}</dt><dd>${e(val)}</dd></div>`).join('')}</dl><p class="detail-note">等级依据：${r.levelBasis === 'official' ? '来源官网标注' : r.levelBasis === 'editorial' ? '编辑参考，非机构认证' : '未标级'}。费用、可用性与地区限制以原站当前页面为准。</p>`;
}
