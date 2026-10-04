import { icon } from '../lib/icons.mjs';
import type { Resource, Category } from '../types';
import snapshot from '../../data/resources.json';
import snapshotCategories from '../../data/categories.json';
import { isDirectoryResource, selectResources, resourceCard, escapeHtml, priceLabels, accessLabels } from '../lib/resource-directory.mjs';
import { getFavorites, toggleFavorite } from './favorites';

let items = snapshot.filter(isDirectoryResource) as Resource[];
let categories = snapshotCategories as Category[];
let favorites: string[] = [];
let view = 'grid';
const workspace = document.querySelector<HTMLElement>('[data-directory]');
const grid = document.querySelector<HTMLElement>('[data-catalog-grid]');
const form = document.querySelector<HTMLFormElement>('#resource-filters');
const savedOnly = workspace?.dataset.savedOnly === 'true';
const e = escapeHtml;
const notify = (message: string) => {
  const note = document.querySelector('#directory-note, #resource-note');
  if (note) note.textContent = message;
};
try { favorites = getFavorites(); view = localStorage.getItem('deutsch-hub.directory-view') || 'grid'; }
catch { notify('浏览器存储不可用，收藏暂无法保存。'); }
function params() {
  const value = new URLSearchParams(location.search);
  if (!value.has('category') && workspace?.dataset.defaultCategory) value.set('category', workspace.dataset.defaultCategory);
  if (!value.has('level') && workspace?.dataset.defaultLevel) value.set('level', workspace.dataset.defaultLevel);
  if (savedOnly) value.set('saved', '1');
  return value;
}
function syncForm() {
  if (!form) return;
  const value = params();
  for (const control of Array.from(form.elements)) {
    if (control instanceof HTMLInputElement || control instanceof HTMLSelectElement) control.value = value.get(control.name) || (control.name === 'sort' ? 'default' : '');
  }
}
function navigate(next: URLSearchParams, replace = false) {
  const url = location.pathname + (next.size ? '?' + next : '');
  if (replace) history.replaceState({}, '', url); else history.pushState({}, '', url);
  syncForm(); render();
}
function fromForm() {
  const next = new URLSearchParams();
  if (form) new FormData(form).forEach((value, name) => { if (value && !(name === 'sort' && value === 'default')) next.set(name, String(value)); });
  return next;
}
function updateFavoriteButtons() {
  document.querySelectorAll<HTMLElement>('[data-save]').forEach((button) => {
    const saved = favorites.includes(button.dataset.save!);
    button.setAttribute('aria-pressed', String(saved));
    const r = items.find((r) => r.id === button.dataset.save);
    if (button.classList.contains('bookmark')) {
      button.innerHTML = icon('star');
      button.setAttribute('aria-label', `${saved ? '取消收藏' : '收藏'} ${r?.titleZh || '资源'}`);
    } else button.textContent = saved ? '★ 已收藏' : '☆ 收藏资源';
  });
  document.querySelectorAll('[data-favorite-count]').forEach((node) => { node.textContent = String(items.filter((r) => favorites.includes(r.id)).length); });
}
function render() {
  document.querySelectorAll('[data-resource-count]').forEach((node) => { node.textContent = String(items.length); });
  document.querySelectorAll<HTMLElement>('[data-category-count]').forEach((node) => { node.textContent = String(node.dataset.categoryCount ? items.filter((r) => r.primaryCategory === node.dataset.categoryCount).length : items.length); });
  if (!grid || !form) { updateFavoriteButtons(); return; }
  const value = params();
  const results = selectResources(items, value, favorites) as Resource[];
  const savedCount = items.filter((r) => favorites.includes(r.id)).length;
  const category = categories.find((c) => c.id === value.get('category'));
  document.querySelector('[data-directory-heading]')!.textContent = savedOnly ? '我的收藏' : category?.name || '全部资源';
  document.querySelector('[data-result-count]')!.textContent = `${results.length} 个资源`;
  document.querySelectorAll<HTMLElement>('.category-link').forEach((link) => {
    const current = link.dataset.category === (value.get('category') || '');
    if (current) link.setAttribute('aria-current', 'true'); else link.removeAttribute('aria-current');
    const next = new URLSearchParams(value); next.set('category', link.dataset.category || ''); next.delete('page');
    link.setAttribute('href', location.pathname + '?' + next);
  });
  const total = Math.ceil(results.length / 24);
  const rawPage = Number(value.get('page'));
  const page = Math.max(1, Math.min(Number.isFinite(rawPage) ? Math.floor(rawPage) : 1, total || 1));
  grid.dataset.view = view === 'list' ? 'list' : 'grid';
  grid.innerHTML = results.slice((page - 1) * 24, page * 24).map((r) => resourceCard(r, categories, favorites.includes(r.id))).join('') || `<div class="directory-empty"><strong>${savedOnly && !savedCount ? '还没有收藏资源' : '没有匹配资源'}</strong><p>${savedOnly && !savedCount ? '点击资源卡片右上角的 ☆ 即可收藏。' : '试试其他关键词，或清除筛选。'}</p>${savedOnly && !savedCount ? '<a href="/">浏览资源目录 →</a>' : '<button type="button" data-reset>清除筛选</button>'}</div>`;
  const pager = document.querySelector('.catalog-pager')!;
  pager.innerHTML = total > 1 ? Array.from({ length: total }, (_, i) => { const next = new URLSearchParams(value); next.set('page', String(i + 1)); return `<a href="?${e(next.toString())}" data-page="${i + 1}" ${i + 1 === page ? 'aria-current="page"' : ''}>${i + 1}</a>`; }).join('') + `<span class="pager-summary">${(page - 1) * 24 + 1}–${Math.min(page * 24, results.length)} / ${results.length}</span>` : '';
  const chips = document.querySelector('[data-active-filters]')!;
  const labels: Record<string, string> = { q: '搜索', category: '分类', level: '等级', skill: '技能', exam: '考试', price: '费用', access: '访问', format: '形式' };
  const active = Array.from(value).filter(([key, val]) => key in labels && val);
  chips.innerHTML = active.map(([key, val]) => { const label = key === 'category' ? categories.find((c) => c.id === val)?.name || val : key === 'price' ? priceLabels[val as keyof typeof priceLabels] || val : key === 'access' ? accessLabels[val as keyof typeof accessLabels] || val : val; return `<button type="button" data-remove-filter="${key}" aria-label="移除${labels[key]}筛选：${e(label)}">${e(label)} <span aria-hidden="true">×</span></button>`; }).join('') + (active.length ? '<button type="button" data-reset>清除筛选</button>' : '');
  document.querySelectorAll<HTMLElement>('[data-view-toggle]').forEach((button) => { button.setAttribute('aria-pressed', String(button.dataset.viewToggle === grid.dataset.view)); });
  updateFavoriteButtons();
}
function showDetail() {
  const target = document.querySelector<HTMLElement>('[data-detail]');
  if (!target) return;
  const r = items.find((r) => r.slug === location.pathname.split('/')[2]);
  if (!r) { target.innerHTML = '<h1>资源暂不可用</h1><p>这个资源已归档或不属于公开资源目录。</p><a href="/">返回资源目录 →</a>'; return; }
  document.title = r.titleZh + ' · Deutsch Lernen';
  const status = { ok: '链接可访问', restricted: '自动访问受限', broken: '链接异常', unchecked: '待核验' }[r.linkStatus];
  const facts = [['来源', r.sourceName], ['费用', priceLabels[r.price]], ['访问条件', accessLabels[r.access]], ['参考等级', r.levels.join(' · ') || '未标级'], ['内容形式', r.formats.join(' · ')], ['技能 / 主题', r.skills.join(' · ')], ['语言', r.languages.join(' · ')], ['核验记录', `${status} / ${r.lastEditorialCheckedAt || '暂无日期'}`], ['网站', new URL(r.url).hostname]];
  target.innerHTML = `<a class="detail-back" href="/resources/">← 返回资源目录</a><div class="detail-header"><div><p class="detail-label">${e(categories.find((c) => c.id === r.primaryCategory)?.name)}</p><h1>${e(r.titleZh)}</h1><p class="original">${e(r.titleOriginal)}</p></div></div><p class="detail-intro">${e(r.descriptionZh)}</p><div class="detail-actions"><a class="action-link" href="${e(r.url)}" target="_blank" rel="noopener noreferrer">打开原站 ↗</a><button type="button" data-save="${e(r.id)}">☆ 收藏资源</button></div><p id="resource-note" role="status" class="detail-note"></p><dl class="detail-facts">${facts.map(([key, val]) => `<div><dt>${e(key)}</dt><dd>${e(val)}</dd></div>`).join('')}</dl><p class="detail-note">等级依据：${r.levelBasis === 'official' ? '来源官网标注' : r.levelBasis === 'editorial' ? '编辑参考，非机构认证' : '未标级'}。费用、可用性与地区限制以原站当前页面为准。</p>`;
  updateFavoriteButtons();
}
syncForm(); render(); showDetail();
form?.addEventListener('submit', (event) => { event.preventDefault(); navigate(fromForm()); });
form?.addEventListener('change', (event) => { if (event.target instanceof HTMLSelectElement) navigate(fromForm()); });
const search = form?.querySelector<HTMLInputElement>('[name=q]');
let timer: ReturnType<typeof setTimeout>;
search?.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => navigate(fromForm(), true), 180); });
document.querySelector<HTMLSelectElement>('select[name=sort]')?.addEventListener('change', () => navigate(fromForm()));
window.addEventListener('popstate', () => { syncForm(); render(); });
window.addEventListener('storage', () => { try { favorites = getFavorites(); render(); } catch { notify('读取收藏失败。'); } });
document.addEventListener('keydown', (event) => { if (event.key === '/' && search && !event.ctrlKey && !event.metaKey && !(event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement || (event.target instanceof HTMLElement && event.target.isContentEditable))) { event.preventDefault(); search.focus(); } });
document.addEventListener('click', (event) => {
  const node = event.target instanceof Element ? event.target : null;
  if (!node) return;
  const bookmark = node.closest<HTMLElement>('[data-save]');
  if (bookmark) { try { const saved = toggleFavorite(bookmark.dataset.save!); favorites = getFavorites(); if (savedOnly) render(); else updateFavoriteButtons(); notify(saved ? '已收藏，保存在当前浏览器。' : '已取消收藏。'); } catch { notify('收藏未保存，请检查浏览器存储权限。'); } return; }
  const category = node.closest<HTMLElement>('.category-link');
  const remove = node.closest<HTMLElement>('[data-remove-filter]');
  const reset = node.closest('[data-reset]');
  const page = node.closest<HTMLElement>('[data-page]');
  const toggle = node.closest<HTMLElement>('[data-view-toggle]');
  if (!workspace || !grid) return;
  if ((category || page) && (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0)) return;
  if (category) { event.preventDefault(); const next = params(); next.set('category', category.dataset.category || ''); next.delete('page'); navigate(next); }
  if (remove) { const next = params(); next.set(remove.dataset.removeFilter!, ''); next.delete('page'); navigate(next); }
  if (reset) { const next = new URLSearchParams(); if (workspace.dataset.defaultCategory) next.set('category', ''); if (workspace.dataset.defaultLevel) next.set('level', ''); navigate(next); }
  if (page) { event.preventDefault(); const next = params(); next.set('page', page.dataset.page!); navigate(next); document.querySelector('.catalog-head')?.scrollIntoView({ block: 'start' }); }
  if (toggle) { view = toggle.dataset.viewToggle!; try { localStorage.setItem('deutsch-hub.directory-view', view); } catch {} render(); }
});
async function refresh() {
  try {
    const response = await fetch('/api/public-catalog', { signal: AbortSignal.timeout(7000) });
    if (!response.ok) throw Error('目录读取失败');
    const data = await response.json();
    if (!Array.isArray(data.resources) || !Array.isArray(data.categories)) throw Error('目录格式不正确');
    items = data.resources.filter(isDirectoryResource); categories = data.categories;
    render(); showDetail();
  } catch { notify('当前显示本地目录，实时更新暂不可用。'); }
  finally { document.documentElement.dataset.catalogReady = 'true'; }
}
void refresh();
