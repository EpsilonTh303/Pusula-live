/* Restricted Markdown renderer. HTML is escaped; links use an explicit scheme allowlist. */
(() => {
  const docs=window.HORIZON_DOCS||[], article=document.querySelector('#document'), toc=document.querySelector('#doc-toc');
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let current;
  function target(raw) {
    if (/^(https?:\/\/|mailto:|#)/i.test(raw)) return raw;
    if (/^[\w-]+\.html(?:[?#].*)?$/.test(raw)) return raw;
    if (/^ui\/[\w-]+\.html$/.test(raw)) return raw.slice(3);
    if (/\.md(?:#.*)?$/i.test(raw) && !raw.includes(':')) {
      const parts=(current.path.slice(0,current.path.lastIndexOf('/')+1)+raw.split('#')[0]).split('/'), normalized=[];
      for(const part of parts){if(part==='..')normalized.pop();else if(part&&part!=='.')normalized.push(part);}
      const match=docs.find(d=>d.path===normalized.join('/'));
      if(match)return 'docs.html?doc='+encodeURIComponent(match.path)+'&theme='+encodeURIComponent(document.documentElement.dataset.horizonTheme||new URLSearchParams(location.search).get('theme')||'mission');
    }
    return null;
  }
  function inline(raw) {
    const bits=[];
    const stash=html=>{bits.push(html);return '\u0001'+(bits.length-1)+'\u0002';};
    raw=raw.replace(/`([^`]+)`/g,(_,code)=>stash('<code>'+esc(code)+'</code>'));
    raw=raw.replace(/\[([^\]\n]+)\]\(([^\s)]+)\)/g,(_,label,url)=>{const href=target(url);return stash(href?'<a href="'+esc(href)+'"'+(/^https?:/i.test(href)?' target="_blank" rel="noopener noreferrer"':'')+'>'+esc(label)+'</a>':esc(label)+' <small>('+esc(url)+')</small>');});
    raw=raw.replace(/\[\[([^\]]+)\]\]/g,(_,body)=>{const [path,label]=body.split('|');const match=docs.find(d=>d.path===path+'.md'||d.path.endsWith('/'+path+'.md'));return stash(match?'<a href="docs.html?doc='+encodeURIComponent(match.path)+'">'+esc(label||path)+'</a>':esc(label||path));});
    return esc(raw).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/\*([^*]+)\*/g,'<em>$1</em>').replace(/\u0001(\d+)\u0002/g,(_,n)=>bits[Number(n)]);
  }
  function render(content) {
    content=content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/,'');
    const lines=content.split(/\r?\n/), html=[], headings=[];let i=0, number=0;
    while(i<lines.length){
      let line=lines[i];
      if(!line.trim()){i++;continue;}
      if(/^```/.test(line)){const language=line.slice(3).trim(), code=[];i++;while(i<lines.length&&!/^```/.test(lines[i]))code.push(lines[i++]);i++;html.push('<pre><code aria-label="'+esc(language||'Kod')+'">'+esc(code.join('\n'))+'</code></pre>');continue;}
      const heading=/^(#{1,6})\s+(.+)$/.exec(line);
      if(heading){const level=heading[1].length,id='section-'+(++number);headings.push({level,id,title:heading[2]});html.push('<h'+level+' id="'+id+'">'+inline(heading[2])+'</h'+level+'>');i++;continue;}
      if(i+1<lines.length&&line.includes('|')&&/^\s*\|?\s*:?-{3,}/.test(lines[i+1])){
        const cells=s=>s.trim().replace(/^\||\|$/g,'').split('|').map(x=>x.trim());
        const header=cells(line);i+=2;const rows=[];while(i<lines.length&&lines[i].includes('|')&&lines[i].trim())rows.push(cells(lines[i++]));
        html.push('<div class="table-scroll" tabindex="0" aria-label="Tablo"><table><thead><tr>'+header.map(c=>'<th scope="col">'+inline(c)+'</th>').join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr>'+r.map(c=>'<td>'+inline(c)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>');continue;
      }
      if(/^\s*(?:[-*+]\s|\d+\.\s)/.test(line)){const ordered=/^\s*\d+\./.test(line),tag=ordered?'ol':'ul',items=[];while(i<lines.length&&/^\s*(?:[-*+]\s|\d+\.\s)/.test(lines[i]))items.push('<li>'+inline(lines[i++].replace(/^\s*(?:[-*+]\s|\d+\.\s)/,''))+'</li>');html.push('<'+tag+'>'+items.join('')+'</'+tag+'>');continue;}
      if(/^>\s?/.test(line)){const quote=[];while(i<lines.length&&/^>/.test(lines[i]))quote.push(lines[i++].replace(/^>\s?/,''));html.push('<blockquote>'+inline(quote.join(' '))+'</blockquote>');continue;}
      if(/^\s*---\s*$/.test(line)){html.push('<hr>');i++;continue;}
      const paragraph=[line];i++;while(i<lines.length&&lines[i].trim()&&!/^(#|```|>|\s*[-*+]\s|\s*\d+\.\s)/.test(lines[i]))paragraph.push(lines[i++]);html.push('<p>'+inline(paragraph.join(' '))+'</p>');
    }
    article.innerHTML=html.join('');toc.replaceChildren();
    headings.filter(h=>h.level<=3).forEach(h=>{const a=document.createElement('a');a.href='#'+h.id;a.textContent=h.title;a.className=h.level>2?'toc-sub':'';toc.append(a);});
  }
  function open(path,focus=false){
    current=docs.find(d=>d.path===path)||docs[0];if(!current){article.textContent='Belge bulunamadı.';return;}
    render(current.content);document.querySelector('#doc-path').textContent=current.path;document.title=current.title+' — Horizon';
    const url=new URL(location.href);url.searchParams.set('doc',current.path);url.hash='';history.replaceState(null,'',url);
    document.querySelectorAll('#doc-list a').forEach(a=>{if(a.dataset.path===current.path)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
    if(focus){article.focus();article.scrollIntoView({block:'start'});}
  }
  function list(){const query=document.querySelector('#doc-search').value.toLocaleLowerCase('tr'),items=docs.filter(d=>(d.title+' '+d.path+' '+d.content).toLocaleLowerCase('tr').includes(query)),nav=document.querySelector('#doc-list');nav.replaceChildren();
    for(const d of items){const a=document.createElement('a');a.href='?doc='+encodeURIComponent(d.path);a.dataset.path=d.path;a.textContent=d.title;const small=document.createElement('small');small.textContent=d.path;a.append(small);if(current?.path===d.path)a.setAttribute('aria-current','page');a.addEventListener('click',e=>{e.preventDefault();open(d.path,true);if(innerWidth<760)document.querySelector('.document-menu').open=false;});nav.append(a);}
    document.querySelector('#doc-count').textContent=items.length+' belge';
  }
  document.querySelector('#doc-search').addEventListener('input',list);
  if(innerWidth<760)document.querySelector('.contents details').open=false;
  open(new URLSearchParams(location.search).get('doc'));list();
  document.querySelector('.reader-meta a').addEventListener('click',e=>{e.preventDefault();scrollTo({top:0,behavior:'auto'});});
})();
