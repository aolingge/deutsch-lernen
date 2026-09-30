import type { Resource, Category } from '../types';
import { initStudy, saveFavorite, addTask } from './study';
const prices={free:'免费',freemium:'部分免费',paid:'付费',unknown:'费用待核实'};
const conditions={open:'免注册',registration:'需注册','exam-registration':'需报名条件',unknown:'条件待核实'};
const esc=(value:unknown)=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
function card(r:Resource, categories:Category[]) {
  const status={ok:'链接可访问',restricted:'自动检查受限',unchecked:'待核验',broken:'待替换'}[r.linkStatus];
  return `<article class="live-card"><div class="card-top"><span>${esc(categories.find(c=>c.id===r.primaryCategory)?.name)}</span><small>${status}</small></div><h3><a href="/resource/${esc(r.slug)}/">${esc(r.titleZh)}</a></h3><p class="original">${esc(r.titleOriginal)}</p><p>${esc(r.descriptionZh)}</p><div class="chips">${r.levels.map(v=>`<span>${v}</span>`).join('')}${r.skills.slice(0,2).map(v=>`<span>${esc(v)}</span>`).join('')}</div><div class="meta">${prices[r.price]} · ${conditions[r.access]}<br>${esc(r.sourceName)}</div><div class="card-actions"><a href="/resource/${esc(r.slug)}/">查看说明 ↗</a><a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">打开原站</a></div></article>`;
}
async function start() {
  const response=await fetch('/api/public-catalog');
  if (!response.ok) throw Error('目录暂不可用');
  const {resources:items,categories}=await response.json() as {resources:Resource[];categories:Category[]};
  document.documentElement.dataset.catalogReady='true';
  const path=location.pathname;
  const count=document.querySelector('[data-resource-count]'); if(count) count.textContent=String(items.length);
  const form=document.querySelector<HTMLFormElement>('.filters');
  if(form) {
    const params=new URLSearchParams(location.search);
    for(const control of Array.from(form.elements)) if(control instanceof HTMLInputElement||control instanceof HTMLSelectElement) control.value=params.get(control.name)??'';
    form.addEventListener('submit',event=>{event.preventDefault();const next=new URLSearchParams();new FormData(form).forEach((v,k)=>{if(v)next.set(k,String(v))});history.pushState({},'',path+'?'+next); renderList();});
    window.addEventListener('popstate',()=>{const p=new URLSearchParams(location.search); for(const c of Array.from(form.elements)) if(c instanceof HTMLInputElement||c instanceof HTMLSelectElement)c.value=p.get(c.name)??''; renderList();});
  }
  function renderList() {
    const grid=document.querySelector<HTMLElement>('.resource-grid'); if(!grid)return;
    const params=new URLSearchParams(location.search);
    const q=(params.get('q')??'').trim().toLocaleLowerCase().normalize('NFKC');
    const words=q.split(/\s+/).filter(Boolean);
    let filtered=items.filter(r=>words.every(w=>[r.titleZh,r.titleOriginal,r.descriptionZh,r.sourceName,...r.tags,...r.levels,...r.skills,...r.exams].join(' ').toLocaleLowerCase().normalize('NFKC').includes(w))&&(!params.get('level')||r.levels.includes(params.get('level') as Resource['levels'][number]))&&(!params.get('category')||r.primaryCategory===params.get('category'))&&(!params.get('skill')||r.skills.includes(params.get('skill')!))&&(!params.get('exam')||r.exams.includes(params.get('exam')!))&&(!params.get('price')||r.price===params.get('price')));
    if(path.startsWith('/levels/'))filtered=filtered.filter(r=>r.levels.includes(path.split('/')[2].toUpperCase() as Resource['levels'][number]));
    if(path==='/exams/')filtered=filtered.filter(r=>r.primaryCategory==='exams');
    if(path==='/news/')filtered=filtered.filter(r=>['news','listening','reading'].includes(r.primaryCategory));
    if(path==='/')filtered=items.filter(r=>['dw-nicos-weg','vhs-b1-course','testdaf-digital-prep','nachrichtenleicht'].includes(r.id));
    const head=document.querySelector('.catalog-head span,.route-content .section-title span');if(head)head.textContent=`${filtered.length} 条匹配资源`;
    const kicker=document.querySelector('.page-hero .kicker');if(kicker)kicker.textContent=`RESOURCE INDEX / ${filtered.length} RESULTS`;
    const pageSize=24; const page=Math.min(Math.max(Number(params.get('page'))||1,1),Math.max(Math.ceil(filtered.length/pageSize),1));
    grid.classList.add('live-grid'); grid.innerHTML=filtered.slice((page-1)*pageSize,page*pageSize).map(r=>card(r,categories)).join('')||'<p role="status">没有匹配资源，请更换关键词或清除筛选。</p>';
    let pager=document.querySelector('.catalog-pager');if(!pager){pager=document.createElement('nav');pager.className='catalog-pager';pager.setAttribute('aria-label','资源分页');grid.after(pager);}
    pager.innerHTML=Array.from({length:Math.ceil(filtered.length/pageSize)},(_,i)=>{const p=new URLSearchParams(params);p.set('page',String(i+1));return `<a ${i+1===page?'aria-current="page"':''} href="?${esc(p.toString())}">${i+1}</a>`}).join('');
    pager.querySelectorAll('a').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();history.pushState({},'',a.getAttribute('href'));renderList();grid.scrollIntoView({block:'start'});}));
  }
  if(!path.startsWith('/resource/'))renderList();
  if(path.startsWith('/resource/')) {
    const slug=path.split('/')[2]; const r=items.find(v=>v.slug===slug);
    const target=document.querySelector('[data-detail]');
    if(target&&r){document.title=r.titleZh+' · Deutsch Lernen'; target.innerHTML=`<a href="/resources/">← 返回资源库</a><p class="detail-label">${esc(categories.find(c=>c.id===r.primaryCategory)?.name)}</p><h1>${esc(r.titleZh)}</h1><p class="original">${esc(r.titleOriginal)}</p><p>${esc(r.descriptionZh)}</p><div class="detail-section"><h2>怎么使用</h2><p>${esc(r.howToUseZh)}</p></div><div class="detail-section"><h2>适合什么阶段</h2><p>${esc(r.levels.join(' · ')||'未标级')} · ${esc(r.skills.join(' · '))}</p><p>等级依据：${r.levelBasis==='official'?'来源官网标注':r.levelBasis==='editorial'?'本站建议':'未标级'}</p></div><div class="detail-section"><h2>费用、条件与来源</h2><p>${prices[r.price]} · ${conditions[r.access]} · ${esc(r.sourceName)}</p><p>内容形式：${esc(r.formats.join(' · '))}　核验日期：${esc(r.lastEditorialCheckedAt||'待核验')}</p><p>链接状态：${esc(r.linkStatus==='ok'?'链接可访问；价格与功能请以原站为准':r.linkStatus==='restricted'?'自动检查受限':'待核验')}</p></div><div class="detail-actions"><a class="action-link" href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">打开原站 ↗</a><button id="save-resource">☆ 收藏资源</button><button id="plan-resource">加入本周计划</button><a href="/my-study/">查看我的学习</a></div><p role="status" id="resource-note"></p>`;
      document.querySelector('#save-resource')?.addEventListener('click',()=>{try{const saved=saveFavorite(r.id);document.querySelector('#resource-note')!.textContent=saved?'已加入收藏。':'已取消收藏。';}catch{document.querySelector('#resource-note')!.textContent='浏览器存储不可用，请允许本站存储后重试。';}});
      document.querySelector('#plan-resource')?.addEventListener('click',()=>{try{addTask(r);document.querySelector('#resource-note')!.textContent='已加入本周计划。';}catch{document.querySelector('#resource-note')!.textContent='浏览器存储不可用。';}});
    }
  }
  if(path==='/my-study/')initStudy(items);
  const stat=await fetch('/api/stats'); if(stat.ok){const s=await stat.json();const label=document.querySelector('#site-views');if(label&&s.available){label.previousElementSibling!.textContent=String(s.totalPageViews);label.textContent=`累计浏览 · 今日 ${s.todayPageViews} 次`;}}
}
start().catch(()=>{const note=document.createElement('p');note.className='catalog-error';note.setAttribute('role','status');note.textContent='实时目录暂不可用，当前显示构建时的资源快照；请稍后刷新。';document.querySelector('main')?.prepend(note);});
