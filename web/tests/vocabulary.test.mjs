import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const script=readFileSync(new URL('../public/reader/vocabulary.js',import.meta.url),'utf8');
function vocabulary(initial=[]) {
  const elements=new Map(), events=new Map(), saved=new Map([['gutenberg-vocabulary-v1',JSON.stringify(initial)]]);
  const element=id=>{
    if(!elements.has(id)) elements.set(id,{value:'',textContent:'',dataset:{index:'0'},
      addEventListener(name,fn){events.set(id+':'+name,fn);},replaceChildren(){},append(){},focus(){},showModal(){},contains(){return true;},removeAttribute(){}});
    return elements.get(id);
  };
  const paragraph={nodeType:1,textContent:'Öffentlicher Testsatz.',closest(selector){return selector==='.german'?this:{dataset:{index:'0'}};}};
  const context={window:{GUTENBERG_BOOKS:[{id:'13',paragraphCount:100}],getSelection:()=>({isCollapsed:false,rangeCount:1,anchorNode:paragraph,focusNode:paragraph,toString:()=>initial[0]?.term||'Probe'})},
    document:{getElementById:element,addEventListener(){},createElement:()=>element('created')},localStorage:{getItem:key=>saved.get(key),setItem:(key,value)=>saved.set(key,value)},
    location:{href:'https://reader.example.invalid/reader/?book=13',search:'?book=13'},URL,URLSearchParams,
    MutationObserver:class {observe(){}}};
  vm.runInNewContext(script,context);
  return {api:context.window.ReaderVocabulary,element,fire:(id,name)=>events.get(id+':'+name)({preventDefault(){}})};
}
const privateWord={term:'Probe',meaning:'PRIVATE_TEST_NOTE',context:'',bookId:'local-'+'a'.repeat(32)};
const publicWord={term:'Probe',meaning:'Public note',context:'Öffentlicher Testsatz.',bookId:'13',paragraph:1};

test('same-word merge keeps private provenance when a restored local context is empty',()=>{
  const {api}=vocabulary([privateWord]);
  const merged=api.mergeItems([publicWord]);
  assert.equal(merged[0].privateSource,true);
  assert.ok(merged[0].meaning.includes(privateWord.meaning));
});

test('incoming private meanings keep their marker when combined with public context',()=>{
  const {api}=vocabulary([publicWord]);
  const merged=api.mergeItems([privateWord,{...publicWord,term:'PublicControl'}]);
  assert.equal(merged.find(item=>item.term==='Probe').privateSource,true);
  assert.equal(merged.find(item=>item.term==='PublicControl').privateSource,false);
});

test('selecting a public occurrence preserves the marker of its reused private meaning',()=>{
  const {api,fire}=vocabulary([privateWord]);
  fire('vocabularyToggle','click');
  fire('vocabularyForm','submit');
  const saved=api.exportItems()[0];
  assert.equal(saved.meaning,privateWord.meaning);
  assert.equal(saved.bookId,'13');
  assert.equal(saved.privateSource,true);
});
