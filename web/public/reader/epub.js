// @ts-nocheck
(function () {
  const encoder = new TextEncoder(), decoder = new TextDecoder();
  const crcTable = Array.from({length:256},(_,i) => { let c=i; for(let k=0;k<8;k++) c=(c&1)?0xedb88320^(c>>>1):c>>>1; return c>>>0; });
  function crc(bytes) { let c=0xffffffff; for(const b of bytes) c=crcTable[(c^b)&255]^(c>>>8); return (c^0xffffffff)>>>0; }
  function safePath(name) { return name && name.length<1024 && !name.startsWith('/') && !/[\\\u0000]/.test(name) && !name.split('/').includes('..'); }
  function xml(text) {
    if (/<!ENTITY/i.test(text)) throw Error('不支持包含自定义实体的 EPUB');
    // Remove a plain HTML/XHTML declaration; never fetch a DTD or accept an internal subset.
    text=text.replace(/<!DOCTYPE\s+html(?:\s+(?:PUBLIC\s+["'][^"']+["']\s+["'][^"']+["']|SYSTEM\s+["'][^"']+["']))?\s*>/ig,'');
    if (/<!DOCTYPE/i.test(text)) throw Error('不支持包含外部实体的 EPUB');
    text=text.replace(/&([A-Za-z][A-Za-z0-9]+);/g,(entity,name)=>{
      if (['amp','lt','gt','quot','apos'].includes(name)) return entity;
      const decoder=document.createElement('span'); decoder.innerHTML=entity;
      return decoder.textContent===entity?entity:[...decoder.textContent].map(char=>'&#'+char.codePointAt(0)+';').join('');
    });
    const doc=new DOMParser().parseFromString(text,'application/xml'); if(doc.querySelector('parsererror')) throw Error('EPUB 的 XML 数据损坏'); return doc;
  }
  function pathFrom(base, href) { const url=new URL(href,'https://epub.invalid/'+base); const name=decodeURIComponent(url.pathname.slice(1)); if(url.origin!=='https://epub.invalid'||!safePath(name)) throw Error('EPUB 包含不安全的资源路径'); return name; }
  async function unzip(bytes) {
    const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength); let end=-1;
    for(let i=bytes.length-22;i>=Math.max(0,bytes.length-65557);i--) if(view.getUint32(i,true)===0x06054b50 && i+22+view.getUint16(i+20,true)===bytes.length) {end=i;break;}
    if(end<0 || view.getUint16(end+4,true) || view.getUint16(end+6,true)) throw Error('不是支持的 EPUB ZIP 文件');
    const count=view.getUint16(end+10,true); if(count>4000||count!==view.getUint16(end+8,true)) throw Error('EPUB 文件过多');
    const entries=new Map(); let offset=view.getUint32(end+16,true), expanded=0;
    const centralEnd=offset+view.getUint32(end+12,true); if(centralEnd!==end) throw Error('EPUB ZIP 目录损坏');
    for(let i=0;i<count;i++) {
      if(offset+46>centralEnd||view.getUint32(offset,true)!==0x02014b50) throw Error('EPUB ZIP 目录损坏');
      const flags=view.getUint16(offset+8,true), method=view.getUint16(offset+10,true), size=view.getUint32(offset+24,true), compressed=view.getUint32(offset+20,true);
      const length=view.getUint16(offset+28,true), extra=view.getUint16(offset+30,true), comment=view.getUint16(offset+32,true);
      if(offset+46+length+extra+comment>centralEnd) throw Error('EPUB ZIP 路径损坏');
      const name=decoder.decode(bytes.subarray(offset+46,offset+46+length));
      expanded+=size;
      if(!safePath(name)||entries.has(name)||(flags&1)||![0,8].includes(method)||size>16*1024*1024||expanded>64*1024*1024) throw Error('EPUB 过大、加密或包含不支持的 ZIP 内容');
      entries.set(name,{method,size,compressed,offset:view.getUint32(offset+42,true),crc:view.getUint32(offset+16,true)});
      offset+=46+length+extra+comment;
    }
    if(offset!==centralEnd) throw Error('EPUB ZIP 目录长度异常');
    async function read(name) {
      const entry=entries.get(name); if(!entry) throw Error('EPUB 缺少 '+name);
      const o=entry.offset;
      if(o+30>view.byteLength||view.getUint32(o,true)!==0x04034b50||(view.getUint16(o+6,true)&1)||view.getUint16(o+8,true)!==entry.method) throw Error('EPUB ZIP 内容损坏');
      const start=o+30+view.getUint16(o+26,true)+view.getUint16(o+28,true);
      if(start+entry.compressed>view.getUint32(end+16,true)) throw Error('EPUB ZIP 内容越界');
      let data=bytes.subarray(start,start+entry.compressed);
      if(entry.method===8) {
        if(!globalThis.DecompressionStream) throw Error('此浏览器不能解压 EPUB，请升级浏览器');
        let stream; try { stream=new DecompressionStream('deflate-raw'); } catch {throw Error('此浏览器不支持 EPUB 解压，请升级浏览器');}
        const reader=new Blob([data]).stream().pipeThrough(stream).getReader(), parts=[]; let total=0;
        try { while(true) { const part=await reader.read(); if(part.done) break; total+=part.value.length; if(total>entry.size) {await reader.cancel();throw Error('EPUB 解压长度异常');} parts.push(part.value); } } finally {reader.releaseLock();}
        data=new Uint8Array(total); let pos=0; for(const part of parts) {data.set(part,pos);pos+=part.length;}
      }
      if(data.length!==entry.size||crc(data)!==entry.crc) throw Error('EPUB 内容校验失败');
      return decoder.decode(data);
    }
    return { read, entries };
  }
  async function importBook(file) {
    if(file.size>8*1024*1024) throw Error('EPUB 最大 8 MB');
    const bytes=new Uint8Array(await file.arrayBuffer()), zip=await unzip(bytes);
    if(await zip.read('mimetype')!=='application/epub+zip') throw Error('文件不是 EPUB');
    if(zip.entries.has('META-INF/encryption.xml')) throw Error('不支持加密 EPUB，包括加密字体；请使用未加密的文本版本');
    const container=xml(await zip.read('META-INF/container.xml')), opf=container.getElementsByTagNameNS('*','rootfile')[0]?.getAttribute('full-path');
    if(!safePath(opf)) throw Error('EPUB 缺少书籍目录');
    const doc=xml(await zip.read(opf)), manifest=new Map([...doc.getElementsByTagNameNS('*','item')].map(el=>[el.getAttribute('id'),el]));
    const paragraphs=[], chapters=[]; let textSize=0;
    for(const ref of doc.getElementsByTagNameNS('*','itemref')) {
      if(ref.getAttribute('linear')==='no') continue;
      const item=manifest.get(ref.getAttribute('idref')); if(!item || !['application/xhtml+xml','text/html'].includes(item.getAttribute('media-type'))) throw Error('EPUB 正文格式不支持');
      const content=xml(await zip.read(pathFrom(opf,item.getAttribute('href'))));
      const body=content.getElementsByTagNameNS('*','body')[0]; if(!body) continue;
      body.querySelectorAll('script,style,iframe,object,embed,svg,math,img,link').forEach(el=>el.remove());
      const blocks=[...body.querySelectorAll('p,h1,h2,h3,h4,h5,h6,li,blockquote,pre')].filter(el=>!el.querySelector('p,h1,h2,h3,h4,h5,h6,li,blockquote,pre'));
      const texts=(blocks.length?blocks:[body]).map(el=>el.textContent.replace(/\s+/g,' ').trim()).filter(Boolean);
      const from=paragraphs.length;
      for(const text of texts) {textSize+=text.length;if(textSize>8*1024*1024||text.length>100000||paragraphs.length>=100000) throw Error('EPUB 正文过大');paragraphs.push({de:text,zh:null});}
      if(paragraphs.length>from) chapters.push({from,to:paragraphs.length-1,title:(body.querySelector('h1,h2,h3')?.textContent||`Abschnitt ${chapters.length+1}`).trim().slice(0,240)});
    }
    if(!paragraphs.length) throw Error('EPUB 没有可阅读的文字');
    const digest=await crypto.subtle.digest('SHA-256',bytes), id='local-'+[...new Uint8Array(digest)].slice(0,16).map(b=>b.toString(16).padStart(2,'0')).join('');
    const title=(doc.getElementsByTagNameNS('*','title')[0]?.textContent||file.name.replace(/\.epub$/i,'')).trim().slice(0,240), author=(doc.getElementsByTagNameNS('*','creator')[0]?.textContent||'作者未标注').trim().slice(0,240);
    // Split long spine entries into bounded text segments while keeping order and titles.
    const split=chapters.flatMap(ch=>ReaderCore.segments(paragraphs.slice(ch.from,ch.to+1)).map((part,i)=>({...part,from:part.from+ch.from,to:part.to+ch.from,title:i?`${ch.title} · ${i+1}`:ch.title})));
    return {id,title,germanTitle:title,author,level:'自导入',difficulty:'自导入',study:'设备本地 EPUB',genre:'本地电子书',length:'自导入',paragraphs,paragraphCount:paragraphs.length,chapters:split,wordCount:paragraphs.reduce((sum,p)=>sum+(p.de.match(/\S+/g)||[]).length,0),translationStatus:'not-imported',translatedParagraphs:0,imported:true};
  }
  function archive(files) {
    const local=[], central=[]; let offset=0;
    for(const [name,text] of files) {
      const filename=encoder.encode(name), data=encoder.encode(text), sum=crc(data), header=new Uint8Array(30+filename.length), h=new DataView(header.buffer);
      h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(6,0x800,true);h.setUint16(12,33,true);h.setUint32(14,sum,true);h.setUint32(18,data.length,true);h.setUint32(22,data.length,true);h.setUint16(26,filename.length,true);header.set(filename,30);
      const entry=new Uint8Array(46+filename.length), c=new DataView(entry.buffer);c.setUint32(0,0x02014b50,true);c.setUint16(4,20,true);c.setUint16(6,20,true);c.setUint16(8,0x800,true);c.setUint16(14,33,true);c.setUint32(16,sum,true);c.setUint32(20,data.length,true);c.setUint32(24,data.length,true);c.setUint16(28,filename.length,true);c.setUint32(42,offset,true);entry.set(filename,46);
      local.push(header,data);central.push(entry);offset+=header.length+data.length;
    }
    const centralSize=central.reduce((n,p)=>n+p.length,0), end=new Uint8Array(22), e=new DataView(end.buffer);e.setUint32(0,0x06054b50,true);e.setUint16(8,files.length,true);e.setUint16(10,files.length,true);e.setUint32(12,centralSize,true);e.setUint32(16,offset,true);
    const result=new Uint8Array(offset+centralSize+22);let pos=0;for(const part of [...local,...central,end]){result.set(part,pos);pos+=part.length;}return result;
  }
  const escape=text=>String(text||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
  function exportBook(book) {
    const chapters=book.chapters||ReaderCore.segments(book.paragraphs), title=escape(book.germanTitle||book.title), identifier='urn:deutsch-reader:'+book.id, date=new Date().toISOString().replace(/\.\d{3}Z$/,'Z');
    const files=[['mimetype','application/epub+zip'],['META-INF/container.xml','<?xml version="1.0" encoding="UTF-8"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="EPUB/package.opf" media-type="application/oebps-package+xml"/></rootfiles></container>']];
    files.push(['EPUB/package.opf',`<?xml version="1.0" encoding="UTF-8"?><package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="book-id">${identifier}</dc:identifier><dc:title>${title}</dc:title><dc:language>de</dc:language><dc:creator>${escape(book.author)}</dc:creator><dc:source>${escape(book.sourceUrl||identifier)}</dc:source><dc:rights>${escape(book.licenseUrl||'Imported for personal reading')}</dc:rights><meta property="dcterms:modified">${date}</meta></metadata><manifest><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>${chapters.map((_,i)=>`<item id="part-${i}" href="part-${i}.xhtml" media-type="application/xhtml+xml"/>`).join('')}</manifest><spine>${chapters.map((_,i)=>`<itemref idref="part-${i}"/>`).join('')}</spine></package>`]);
    files.push(['EPUB/nav.xhtml',`<?xml version="1.0" encoding="UTF-8"?><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="de" xml:lang="de"><head><title>${title}</title></head><body><nav epub:type="toc"><h1>Inhalt</h1><ol>${chapters.map((part,i)=>`<li><a href="part-${i}.xhtml">${escape(part.title.startsWith('阅读分段')?'Abschnitt '+(i+1):part.title)}</a></li>`).join('')}</ol></nav></body></html>`]);
    chapters.forEach((part,i)=>files.push([`EPUB/part-${i}.xhtml`,`<?xml version="1.0" encoding="UTF-8"?><html xmlns="http://www.w3.org/1999/xhtml" lang="de" xml:lang="de"><head><title>${title}</title></head><body>${book.paragraphs.slice(part.from,part.to+1).map(p=>`<p>${escape(p.de)}</p>`).join('')}</body></html>`]));
    return archive(files);
  }
  window.ReaderEPUB={importBook,exportBook,archive};
})();
