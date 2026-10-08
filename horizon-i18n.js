/* Reversible UI translation. Original Markdown documents retain their source language. */
(() => {
 const dictionaries=[window.HORIZON_TRANSLATIONS_WORK,window.HORIZON_TRANSLATIONS_PAGES,window.HORIZON_TRANSLATIONS_EVIDENCE_WORK,window.HORIZON_TRANSLATIONS_EVIDENCE_STUDY,window.HORIZON_TRANSLATIONS_EVIDENCE_OVERSEAS].filter(Boolean);
 const exact=Object.assign({},...dictionaries.map(d=>d.exact));
 // Renderers often add a country prefix, amount or status to authored copy.
 // Include complete phrases so the same translation works in those composed results.
 const fragments=Object.entries(Object.assign({},exact,...dictionaries.map(d=>d.fragments))).sort((a,b)=>b[0].length-a[0].length);
 const records=new WeakMap(),attributes=new WeakMap();let language='tr',scheduled=false;
 function translate(value){
  const trimmed=value.trim();if(exact[trimmed])return value.replace(trimmed,exact[trimmed]);
  const tokens=[];let result=value;
  for(const[source,target]of fragments){
   const escaped=source.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
   const start=/^[\p{L}\p{N}]/u.test(source),end=/[\p{L}\p{N}]$/u.test(source),pattern=new RegExp((start?'(?<![\\p{L}\\p{N}_])':'')+escaped+(end?'(?![\\p{L}\\p{N}_])':''),'gu');
   result=result.replace(pattern,()=>{const id=tokens.push(target)-1;return '\u0001'+id+'\u0002';});
  }
  return result.replace(/\u0001(\d+)\u0002/g,(_,id)=>tokens[Number(id)]);
 }
 const excluded=node=>node.parentElement?.closest('script,style,pre,code,textarea,[data-lex],[data-source-text],#document,#doc-toc,#doc-list,#sources');
 const observer=new MutationObserver(()=>schedule());
 function watch(){observer.observe(document.body,{subtree:true,childList:true,characterData:true});}
 function apply(){
  observer.disconnect();
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node;
  while((node=walker.nextNode())){if(excluded(node)||!node.textContent.trim())continue;const previous=records.get(node);const source=previous&&node.textContent===previous.output?previous.source:node.textContent;
   const output=language==='en'?translate(source):source;records.set(node,{source,output});if(node.textContent!==output)node.textContent=output;
  }
  for(const element of document.querySelectorAll('[placeholder],[aria-label],[title]')){
   if(element.closest('[data-source-text],#document,#doc-toc,#doc-list,#sources'))continue;
   const saved=attributes.get(element)||{};
   for(const name of ['placeholder','aria-label','title']){if(!element.hasAttribute(name))continue;const previous=saved[name],current=element.getAttribute(name),source=previous&&current===previous.output?previous.source:current,output=language==='en'?translate(source):source;saved[name]={source,output};if(current!==output)element.setAttribute(name,output);}
   attributes.set(element,saved);
  }
  watch();window.HorizonShell?.refreshLinks();
 }
 function schedule(){if(scheduled)return;scheduled=true;queueMicrotask(()=>{scheduled=false;apply();});}
 window.HorizonI18n={translate,setLanguage(lang){language=lang==='en'?'en':'tr';document.documentElement.lang=language;apply();},refresh:schedule};
 watch();window.HorizonI18n.setLanguage(new URLSearchParams(location.search).get('lang'));
})();
