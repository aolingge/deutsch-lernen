import fs from 'node:fs/promises';
import { escapeHtml } from '../src/lib/resource-directory.mjs';
import { loadCatalog } from './check-resource-links.mjs';
const base=(process.env.RESOURCE_HUB_BASE || 'https://deutsch-lernen-resource-hub.pirostonelsonrx688.workers.dev').replace(/\/$/,'');
const catalog=await loadCatalog({liveUrl:base+'/api/public-catalog'});
const failures=[];
let checked=0;
let cursor=0;
await Promise.all(Array.from({length:4},async()=>{
  while(cursor<catalog.resources.length){
    const item=catalog.resources[cursor++];
    try{
      const response=await fetch(`${base}/resource/${item.slug}/`,{signal:AbortSignal.timeout(30000)});
      const html=await response.text();
      if(response.status!==200 || !html.includes(`<h1>${escapeHtml(item.titleZh)}</h1>`) || html.includes('content="noindex, follow"')) throw Error('detail-content-or-indexing');
      checked++;
    }catch(error){failures.push({id:item.id,error:String(error)});}
  }
}));
const sitemap=await(await fetch(base+'/sitemap.xml')).text();
for(const r of catalog.resources)if(!sitemap.includes(`/resource/${r.slug}/`))failures.push({id:r.id,error:'missing-from-sitemap'});
for(const r of catalog.resources)if('evidence' in r || 'howToUseZh' in r)failures.push({id:r.id,error:'unexpected-public-editorial-fields'});
const png=Buffer.from(await(await fetch(base+'/og-directory.png')).arrayBuffer());
if(png.readUInt32BE(16)!==1200 || png.readUInt32BE(20)!==630)failures.push({error:'share-image-dimensions'});
const report={base,resources:catalog.resources.length,detailsChecked:checked,sitemapChecked:true,shareImage:'1200x630',failures};
await fs.mkdir('.wrangler/qa',{recursive:true});
await fs.writeFile('.wrangler/qa/release.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report));
if(failures.length)process.exitCode=1;
