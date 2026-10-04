import { icon } from '../lib/icons.mjs';
import type { Resource, Category } from '../types';
import snapshot from '../../data/public-snapshot.json';
import snapshotCategories from '../../data/categories.json';
import { isDirectoryResource, selectResources, resourceCard, resourceDetail, directoryReturnPath, escapeHtml, priceLabels, accessLabels } from '../lib/resource-directory.mjs';
import { getFavorites, toggleFavorite } from './favorites';

let items = snapshot.filter(isDirectoryResource) as Resource[];
let categories = snapshotCategories as Category[];
let favorites: string[] = [];
let view = 'grid';
const workspace = document.querySelector<HTMLElement>('[data-directory]');
const grid = document.querySelector<HTMLElement>('[data-catalog-grid]');
const form = document.querySelector<HTMLFormElement>('#resource-filters');
const savedOnly = workspace?.dataset.savedOnly === 'true';
const advancedKeys = ['skill', 'exam', 'access', 'format'];
let timer: ReturnType<typeof setTimeout>;
let composing = false;
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
function syncForm(initial = false) {
  if (!form) return;
  const value = params();
  for (const control of Array.from(form.elements)) {
    if (control instanceof HTMLInputElement || control instanceof HTMLSelectElement) control.value = value.get(control.name) || (control.name === 'sort' ? 'default' : '');
  }
  const advanced = form.querySelector<HTMLDetailsElement>('[data-advanced-filters]');
  if (initial && advanced && advancedKeys.some((key) => value.get(key))) advanced.open = true;
}
function navigate(next: URLSearchParams, replace = false) {
  clearTimeout(timer);
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
    } else { button.textContent = saved ? '★ 已收藏' : '☆ 收藏资源'; button.setAttribute('aria-label', saved ? '取消收藏资源' : '收藏资源'); }
  });
  document.querySelectorAll('[data-favorite-count]').forEach((node) => { node.textContent = String(items.filter((r) => favorites.includes(r.id)).length); });
}
function revealCategory() {
  const nav = document.querySelector<HTMLElement>('#category-navigation');
  const active = nav?.querySelector<HTMLElement>('[aria-current]');
  if (nav && active && nav.scrollWidth > nav.clientWidth) nav.scrollLeft = Math.max(0, active.offsetLeft - nav.offsetLeft - 4);
}
function render() {
  const focused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const pageFocus = focused?.dataset.page;
  const filterFocus = focused?.dataset.removeFilter;
  const favoriteFocus = focused?.dataset.save;
  document.querySelectorAll('[data-resource-count]').forEach((node) => { node.textContent = String(items.length); });
  document.querySelectorAll<HTMLElement>('[data-category-count]').forEach((node) => { node.textContent = String(node.dataset.categoryCount ? items.filter((r) => r.primaryCategory === node.dataset.categoryCount).length : items.length); });
  if (!grid || !form) { updateFavoriteButtons(); return; }
  const value = params();
  const advancedCount = document.querySelector<HTMLElement>('[data-advanced-count]');
  if (advancedCount) {
    const count = advancedKeys.filter((key) => value.get(key)).length;
    advancedCount.hidden = count === 0;
    advancedCount.textContent = String(count);
  }
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
  revealCategory();
  const total = Math.ceil(results.length / 24);
  const rawPage = Number(value.get('page'));
  const page = Math.max(1, Math.min(Number.isFinite(rawPage) ? Math.floor(rawPage) : 1, total || 1));
  grid.dataset.view = view === 'list' ? 'list' : 'grid';
  grid.innerHTML = results.slice((page - 1) * 24, page * 24).map((r) => resourceCard(r, categories, favorites.includes(r.id), location.pathname + location.search)).join('') || `<div class="directory-empty"><strong>${savedOnly && !savedCount ? '还没有收藏资源' : '没有匹配资源'}</strong><p>${savedOnly && !savedCount ? '点击资源卡片右上角的 ☆ 即可收藏。' : '试试其他关键词，或移除下方一个筛选条件。'}</p>${savedOnly && !savedCount ? '<a href="/">浏览资源目录 →</a>' : '<button type="button" data-reset>清除筛选</button>'}</div>`;
  const pager = document.querySelector('.catalog-pager')!;
  pager.innerHTML = total > 1 ? Array.from({ length: total }, (_, i) => { const next = new URLSearchParams(value); next.set('page', String(i + 1)); return `<a href="?${e(next.toString())}" data-page="${i + 1}" ${i + 1 === page ? 'aria-current="page"' : ''}>${i + 1}</a>`; }).join('') + `<span class="pager-summary">${(page - 1) * 24 + 1}–${Math.min(page * 24, results.length)} / ${results.length}</span>` : '';
  const chips = document.querySelector('[data-active-filters]')!;
  const labels: Record<string, string> = { q: '搜索', category: '分类', level: '等级', skill: '技能', exam: '考试', price: '费用', access: '访问', format: '形式' };
  const active = Array.from(value).filter(([key, val]) => key in labels && val);
  chips.innerHTML = active.map(([key, val]) => { const label = key === 'category' ? categories.find((c) => c.id === val)?.name || val : key === 'price' ? priceLabels[val as keyof typeof priceLabels] || val : key === 'access' ? accessLabels[val as keyof typeof accessLabels] || val : val; return `<button type="button" data-remove-filter="${key}" aria-label="移除${labels[key]}筛选：${e(label)}">${e(label)} <span aria-hidden="true">×</span></button>`; }).join('') + (active.length ? '<button type="button" data-reset>清除筛选</button>' : '');
  document.querySelectorAll<HTMLElement>('[data-view-toggle]').forEach((button) => { button.setAttribute('aria-pressed', String(button.dataset.viewToggle === grid.dataset.view)); });
  updateFavoriteButtons();
  if (focused && !focused.isConnected) {
    const replacement = pageFocus ? pager.querySelector<HTMLElement>(`[data-page="${page}"]`)
      : filterFocus ? chips.querySelector<HTMLElement>('[data-remove-filter], [data-reset]')
      : favoriteFocus ? grid.querySelector<HTMLElement>(`[data-save="${CSS.escape(favoriteFocus)}"]`) || grid.querySelector<HTMLElement>('[data-save]') : null;
    const fallback = document.querySelector<HTMLElement>('[data-directory-heading]');
    if (fallback) fallback.tabIndex = -1;
    (replacement || fallback)?.focus({ preventScroll: true });
  }
}
function showDetail() {
  const target = document.querySelector<HTMLElement>('[data-detail]');
  if (!target) return;
  const returnTo = directoryReturnPath(new URLSearchParams(location.search).get('from'));
  if (target.dataset.serverRendered === 'true') {
    target.querySelector<HTMLAnchorElement>('.detail-back')?.setAttribute('href', returnTo);
    updateFavoriteButtons();
    return;
  }
  const r = items.find((r) => r.slug === location.pathname.split('/')[2]);
  if (!r) { target.innerHTML = '<h1>资源暂不可用</h1><p>这个资源已归档或不属于公开资源目录。</p><a href="/">返回资源目录 →</a>'; return; }
  document.title = r.titleZh + ' · Deutsch Lernen';
  target.innerHTML = resourceDetail(r, categories, returnTo);
  updateFavoriteButtons();
}
syncForm(true); render(); showDetail();
form?.addEventListener('submit', (event) => { event.preventDefault(); navigate(fromForm()); });
form?.addEventListener('change', (event) => { if (event.target instanceof HTMLSelectElement) navigate(fromForm()); });
const search = form?.querySelector<HTMLInputElement>('[name=q]');
const scheduleSearch = () => {
  clearTimeout(timer);
  if (!composing) timer = setTimeout(() => navigate(fromForm(), true), 180);
};
search?.addEventListener('compositionstart', () => { composing = true; clearTimeout(timer); });
search?.addEventListener('compositionend', () => { composing = false; scheduleSearch(); });
search?.addEventListener('input', scheduleSearch);
document.querySelector<HTMLSelectElement>('select[name=sort]')?.addEventListener('change', () => navigate(fromForm()));
window.addEventListener('popstate', () => { clearTimeout(timer); syncForm(true); render(); });
window.addEventListener('storage', () => { try { favorites = getFavorites(); render(); } catch { notify('读取收藏失败。'); } });
document.addEventListener('keydown', (event) => { if (event.key === '/' && !event.isComposing && search && !event.ctrlKey && !event.metaKey && !(event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement || (event.target instanceof HTMLElement && event.target.isContentEditable))) { event.preventDefault(); search.focus(); } });
document.addEventListener('click', (event) => {
  const node = event.target instanceof Element ? event.target : null;
  if (!node) return;
  const detail = node.closest<HTMLAnchorElement>('.detail-link');
  if (detail && !event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0) {
    try { sessionStorage.setItem('deutsch-hub.directory-return', JSON.stringify({ url: location.pathname + location.search, scroll: scrollY })); } catch {}
  }
  const expand = node.closest<HTMLElement>('[data-category-expand]');
  if (expand) {
    const opened = expand.getAttribute('aria-expanded') !== 'true';
    expand.setAttribute('aria-expanded', String(opened));
    expand.setAttribute('aria-label', opened ? '收起全部分类' : '展开全部分类');
    expand.closest('.directory-sidebar')?.classList.toggle('categories-expanded', opened);
    if (!opened) revealCategory();
    return;
  }
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
  finally {
    document.documentElement.dataset.catalogReady = 'true';
    if (workspace) try {
      const saved = JSON.parse(sessionStorage.getItem('deutsch-hub.directory-return') || 'null');
      if (saved?.url === location.pathname + location.search && Number.isFinite(saved.scroll)) {
        sessionStorage.removeItem('deutsch-hub.directory-return');
        requestAnimationFrame(() => scrollTo({ top: saved.scroll, behavior: 'instant' }));
      }
    } catch {}
  }
}
void refresh();
