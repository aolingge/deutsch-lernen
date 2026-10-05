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
      const titleMatches=html.includes(`<h1>${escapeHtml(item.titleZh)}</h1>`);
      const noindex=html.includes('content="noindex, follow"');
      if(response.status!==200 || !titleMatches || noindex) throw Error(`detail-content-or-indexing: HTTP ${response.status}, titleMatches=${titleMatches}, noindex=${noindex}`);
      checked++;
    }catch(error){failures.push({id:item.id,error:String(error)});}
  }
}));
let sitemapChecked=false;
try {
  const response=await fetch(base+'/sitemap.xml',{signal:AbortSignal.timeout(30000)});
  if(response.status!==200)throw Error(`sitemap HTTP ${response.status}`);
  const sitemap=await response.text();
  if(!sitemap.includes('<urlset'))throw Error('invalid sitemap document');
  sitemapChecked=true;
  for(const r of catalog.resources)if(!sitemap.includes(`/resource/${r.slug}/`))failures.push({id:r.id,error:'missing-from-sitemap'});
}catch(error){failures.push({error:String(error)});}
for(const r of catalog.resources)if('evidence' in r || 'howToUseZh' in r)failures.push({id:r.id,error:'unexpected-public-editorial-fields'});
let shareImage=null;
try {
  const response=await fetch(base+'/og-directory.png',{signal:AbortSignal.timeout(30000)});
  if(response.status!==200)throw Error(`share image HTTP ${response.status}`);
  const png=Buffer.from(await response.arrayBuffer());
  if(png.length<24 || png.subarray(0,8).toString('hex')!=='89504e470d0a1a0a')throw Error('invalid share image PNG');
  if(png.readUInt32BE(16)!==1200 || png.readUInt32BE(20)!==630)throw Error('share-image-dimensions');
  shareImage='1200x630';
}catch(error){failures.push({error:String(error)});}
const report={base,resources:catalog.resources.length,detailsChecked:checked,sitemapChecked,shareImage,failures};
await fs.mkdir('.wrangler/qa',{recursive:true});
await fs.writeFile('.wrangler/qa/release.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report));
if(failures.length)process.exitCode=1;
