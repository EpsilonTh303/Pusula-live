/* Active-scenario alert drawer. In-memory only; financial calculations stay in existing models. */
(() => {
 const nav=document.querySelector('nav');if(!nav)return;
 const button=document.createElement('button');button.type='button';button.id='alerts-tab';button.className='alerts-tab';button.setAttribute('aria-haspopup','dialog');
 const dialog=document.createElement('dialog');dialog.id='alerts-dialog';dialog.className='alerts-dialog';dialog.setAttribute('aria-labelledby','alerts-title');
 const heading=document.createElement('header'),title=document.createElement('h2');title.id='alerts-title';title.textContent='Alerts';
 const close=document.createElement('button');close.type='button';close.className='alerts-close';close.textContent='Kapat / Close';close.addEventListener('click',()=>dialog.close());heading.append(title,close);
 const context=document.createElement('p');context.id='alerts-context';context.className='alerts-context';
 const note=document.createElement('p');note.className='alerts-note';
 const counts=document.createElement('p');counts.id='alerts-summary';counts.setAttribute('role','status');
 const filter=document.createElement('label');filter.textContent='Göster / Show';const select=document.createElement('select');select.id='alerts-filter';
 for(const[value,text]of [['all','Tümü / All'],['fail','Karşılanmıyor / Not met'],['unknown','Doğrulanmalı / Verify'],['info','Varsayım / Assumption']]){const option=document.createElement('option');option.value=value;option.textContent=text;select.append(option);}filter.append(select);
 const list=document.createElement('div');list.id='alerts-list';
 dialog.append(heading,context,note,counts,filter,list);document.body.append(dialog);nav.append(button);
 let snapshot={kind:'none',title:'Yol seçilmedi',items:[]};
 const en=()=>document.documentElement.lang==='en';
 function text(tag,value,parent,cls){const node=document.createElement(tag);node.textContent=value;if(cls)node.className=cls;parent.append(node);return node;}
 function edit(target){dialog.close();let field=document.getElementById(target);if(!field)field=document.querySelector('input,select');
  if(!field)return;for(let node=field.parentElement;node;node=node.parentElement)if(node.tagName==='DETAILS')node.open=true;
  field.scrollIntoView({block:'center',behavior:'auto'});field.focus({preventScroll:true});}
 function render(){
  const items=snapshot.items,failed=items.filter(i=>i.status==='fail').length,unknown=items.filter(i=>i.status==='unknown').length;
  button.textContent='Alerts'+(snapshot.kind==='none'?'':` · ${failed+unknown}`);button.setAttribute('aria-label',`Alerts: ${failed} karşılanmıyor, ${unknown} doğrulanmalı`);
  context.textContent=(en()?'Selected path: ':'Seçili yol: ')+snapshot.title;
  note.textContent=en()?'These are scenario conditions, not notifications from authorities or personal success probabilities. Passing a model gate is not an approval.':'Bunlar seçili senaryonun koşullarıdır. Resmî bildirim veya kişisel başarı olasılığı değildir. Motor kapısının geçmesi onay anlamına gelmez.';
  counts.textContent=snapshot.kind==='none'?(en()?'Select a migration path to see its missing conditions.':'Eksik koşulları görmek için bir göç yolu seç.'):`${failed} karşılanmıyor · ${unknown} doğrulanmalı · ${items.filter(i=>i.status==='info').length} varsayım`;
  list.replaceChildren();
  if(snapshot.kind==='none'){for(const[href,label]of [['work.html','Doğrudan iş yolları'],['pusula.html','Üniversite yolları'],['germany.html','Almanya ayrıntısı']]){const a=text('a',label,list,'alerts-route');const url=new URL(href,location.href);url.searchParams.set('theme',document.documentElement.dataset.horizonTheme||'mission');a.href=url.href;}return;}
  const filtered=items.filter(i=>select.value==='all'||i.status===select.value).sort((a,b)=>['fail','unknown','info'].indexOf(a.status)-['fail','unknown','info'].indexOf(b.status));
  if(!filtered.length)text('p',en()?'No alerts in this category. This is not a guarantee of eligibility.':'Bu kategoride uyarı yok. Bu, uygunluğun garanti edildiği anlamına gelmez.',list);
  for(const item of filtered){const card=document.createElement('article');card.className='alert-card';card.dataset.status=item.status;card.dataset.alertId=item.id;
   const detail=en()&&window.HorizonI18n?HorizonI18n.translate(item.detail):item.detail;
   text('span',({fail:'Karşılanmıyor',unknown:'Doğrulanmalı',info:'Varsayım'})[item.status],card,'alert-status');text('h3',item.title,card);text('p',detail.length>280?detail.slice(0,240)+'…':detail,card);if(detail.length>280){const full=document.createElement('details');text('summary','Koşulun tamamını oku',full);text('p',detail,full);card.append(full);}
   text('p','Sonraki adım: '+item.action,card,'alert-action');
   if(item.target){const action=text('button','İlgili ayara git →',card);action.type='button';action.dataset.target=item.target;action.addEventListener('click',()=>edit(item.target));}
   list.append(card);
  }
 }
 window.HorizonAlerts={update(next){snapshot={...next,items:next.items.map(item=>({...item}))};render();},getSnapshot(){return structuredClone(snapshot);}};
 button.addEventListener('click',()=>{render();dialog.showModal();});select.addEventListener('change',render);
 document.querySelector('#language')?.addEventListener('change',render);document.addEventListener('horizon:preferences',render);render();
})();
