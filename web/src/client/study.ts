import type {Resource} from '../types';
const key='deutsch-hub.study.v1';
type Plan={goal:{level:string;exam:string;hours:string};favorites:string[];tasks:{id:string;title:string;minutes:number;done:boolean}[]};
const fresh=():Plan=>({goal:{level:'',exam:'',hours:''},favorites:[],tasks:[]});
export function validatePlan(value:unknown):Plan {
  if(!value||typeof value!=='object')throw Error('备份格式不正确');
  const v=value as Plan;
  if(!Array.isArray(v.favorites)||!Array.isArray(v.tasks)||v.favorites.length>500||v.tasks.length>500)throw Error('收藏或任务格式不正确');
  const validId=(id:unknown)=>typeof id==='string'&&/^[a-z0-9-]{1,100}$/.test(id);
  if(v.favorites.some(id=>!validId(id))||v.tasks.some(t=>!t||!validId(t.id)||typeof t.title!=='string'||t.title.length>300||!Number.isInteger(t.minutes)||t.minutes<1||t.minutes>480||typeof t.done!=='boolean'))throw Error('备份包含无效任务');
  const goal=v.goal??fresh().goal;
  if(typeof goal.level!=='string'||!['','A1','A2','B1','B2','C1','C2'].includes(goal.level)||typeof goal.exam!=='string'||goal.exam.length>60||typeof goal.hours!=='string'||(goal.hours!==''&&(!Number.isFinite(Number(goal.hours))||Number(goal.hours)<1||Number(goal.hours)>80)))throw Error('目标格式不正确');
  return {goal:{level:goal.level,exam:goal.exam,hours:goal.hours},favorites:[...new Set(v.favorites)],tasks:v.tasks.map(t=>({id:t.id,title:t.title,minutes:t.minutes,done:t.done}))};
}
const read=():Plan=>{const raw=localStorage.getItem(key);return raw?validatePlan(JSON.parse(raw)):fresh();};
const write=(data:Plan)=>localStorage.setItem(key,JSON.stringify(validatePlan(data)));
export function saveFavorite(id:string){const p=read();const exists=p.favorites.includes(id);p.favorites=exists?p.favorites.filter(v=>v!==id):[...p.favorites,id];write(p);return !exists;}
export function addTask(r:Resource){const p=read();if(!p.tasks.some(t=>t.id===r.id))p.tasks.push({id:r.id,title:r.titleZh,minutes:30,done:false});write(p);}
export function initStudy(items:Resource[]) {
  const note=document.querySelector('#plan-note')!;
  const message=(text:string)=>note.textContent=text;
  const safely=(work:()=>void)=>{try{work();}catch{message('读取或保存失败，原数据未改变。请检查浏览器存储权限或备份格式。');}};
  const input=(id:string)=>document.querySelector<HTMLInputElement|HTMLSelectElement>(id)!;
  const byId=new Map(items.map(r=>[r.id,r]));
  function render(){const p=read();input('#goal-level').value=p.goal.level;input('#goal-exam').value=p.goal.exam;input('#goal-hours').value=p.goal.hours;document.querySelector('#task-count')!.textContent=`${p.tasks.filter(t=>t.done).length} / ${p.tasks.length} 完成`;document.querySelector('#favorite-count')!.textContent=`${p.favorites.length} 个`;
    const tasks=document.querySelector('#task-list')!;tasks.replaceChildren();if(!p.tasks.length)tasks.textContent='在资源说明页点击“加入本周计划”开始。';
    p.tasks.forEach((task,index)=>{const row=document.createElement('div');row.className='task';const check=document.createElement('input');check.type='checkbox';check.checked=task.done;check.setAttribute('aria-label',`完成 ${task.title}`);const title=document.createElement('span');title.textContent=`${task.title} · ${task.minutes} 分钟`;const remove=document.createElement('button');remove.textContent='移除';remove.addEventListener('click',()=>safely(()=>{const next=read();next.tasks.splice(index,1);write(next);render();}));check.addEventListener('change',()=>safely(()=>{const next=read();next.tasks[index].done=check.checked;write(next);render();}));row.append(check,title,remove);tasks.append(row);});
    const favorites=document.querySelector('#favorite-list')!;favorites.replaceChildren();if(!p.favorites.length)favorites.textContent='收藏的资源会出现在这里。';p.favorites.forEach(id=>{const r=byId.get(id);const row=document.createElement('div');const a=document.createElement('a');a.href=r?`/resource/${r.slug}/`:'/resources/';a.textContent=r?.titleZh??`${id}（已归档或暂不可用）`;const remove=document.createElement('button');remove.textContent='取消收藏';remove.addEventListener('click',()=>safely(()=>{saveFavorite(id);render();}));row.append(a,remove);favorites.append(row);});
  }
  document.querySelector('#save-goal')?.addEventListener('click',()=>safely(()=>{const p=read();p.goal={level:input('#goal-level').value,exam:input('#goal-exam').value,hours:input('#goal-hours').value};write(p);document.querySelector('#goal-note')!.textContent='目标已保存在本浏览器。';}));
  document.querySelector('#export-plan')?.addEventListener('click',()=>safely(()=>{const a=document.createElement('a');const url=URL.createObjectURL(new Blob([JSON.stringify(read(),null,2)],{type:'application/json'}));a.href=url;a.download='deutsch-lernen-study-plan.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}));
  input('#import-plan').addEventListener('change',async()=>{const file=(input('#import-plan') as HTMLInputElement).files?.[0];if(!file)return;if(file.size>1024*1024){message('备份超过 1 MB，原计划未改变。');return;}try{const next=validatePlan(JSON.parse(await file.text()));write(next);render();message('备份已导入。');}catch{message('文件格式不正确或存储不可用，原计划未改变。');}});
  document.querySelector('#clear-plan')?.addEventListener('click',()=>{if(confirm('确定清空当前浏览器中的学习计划吗？'))safely(()=>{localStorage.removeItem(key);render();});});
  safely(render);
}
