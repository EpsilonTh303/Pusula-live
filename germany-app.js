// 3 RENDER — vocabulary is bilingual data; engine outputs remain theme independent.
const G=GERMANY_DATA,defaults=G.defaults,el=id=>document.getElementById(id);
const keys=Object.keys(defaults).filter(k=>el(k)),params=new URLSearchParams(location.search);
let language=params.get('lang')==='en'?'en':'tr',activeTheme='mission',chartState=null,budgetState=null;
function t(key,values={}){
 if(key.startsWith('theme:')){const label=THEMES[key.slice(6)].label;return typeof label==='string'?label:label[language];}
 const entry=THEMES[activeTheme].lexicon[key]??UI_LEXICON[key];
 if(entry===undefined)throw Error(`Missing lexicon key: ${key}`);
 const text=typeof entry==='string'?entry:entry[language];
 return text.replace(/\{(\w+)\}/g,(_,k)=>String(values[k]??`{${k}}`));
}
function lex(node,key,values={}){node.dataset.lex=key;node.textContent=t(key,values);}
const money=n=>new Intl.NumberFormat(language==='tr'?'tr-TR':'en-GB',{maximumFractionDigits:0}).format(n)+' EUR';
function applyTheme(id){
 activeTheme=Object.hasOwn(THEMES,id)?id:'mission';const theme=THEMES[activeTheme];
 for(const[key,value]of Object.entries(theme.tokens))document.documentElement.style.setProperty(key,value);
 for(const[key,value]of Object.entries(theme.fonts))document.documentElement.style.setProperty(`--font-${key}`,value);
 for(const[key,value]of Object.entries(theme.chart))document.documentElement.style.setProperty(`--chart-${key}`,value);
 document.documentElement.lang=language;
 el('theme').replaceChildren(...Object.keys(THEMES).map(key=>{const o=document.createElement('option');o.value=key;lex(o,`theme:${key}`);return o;}));
 el('theme').value=activeTheme;el('language').value=language;
 document.querySelectorAll('[data-lex]').forEach(node=>{if(!node.dataset.dynamic)node.textContent=t(node.dataset.lex);});
 document.querySelectorAll('[data-lex-aria]').forEach(node=>node.setAttribute('aria-label',t(node.dataset.lexAria)));
 el('decor').className=theme.decor==='none'?'':`decor-${theme.decor}`;
 const url=new URL(location.href);url.searchParams.set('theme',activeTheme);url.searchParams.set('lang',language);
 try{history.replaceState(null,'',url);}catch{}
 renderProgram(false);renderBudget();render();
}
function draw(results,reserve){
 const svg=el('chart'),w=svg.clientWidth||300,h=300,left=w<400?48:70,right=14,top=28,bottom=42,ns='http://www.w3.org/2000/svg';
 svg.setAttribute('viewBox',`0 0 ${w} ${h}`);svg.replaceChildren();
 const rows=results.chart_rows,values=rows.flatMap(r=>[r.liquid,r.blocked]);
 let low=Math.min(0,...values),high=Math.max(1,reserve,...values),pad=(high-low)*.08;low-=pad;high+=pad;
 const x=m=>left+m/60*(w-left-right),y=v=>h-bottom-(v-low)/(high-low)*(h-top-bottom);
 function add(tag,attrs,key,values){const n=document.createElementNS(ns,tag);for(const[k,v]of Object.entries(attrs))n.setAttribute(k,v);if(key){lex(n,key,values);n.dataset.dynamic='true';}svg.append(n);return n;}
 add('title',{},'chartAria');
 const points=rows.map(r=>[x(r.month),y(Math.min(0,r.liquid))]);
 add('path',{class:'negative-area',d:`M ${x(0)} ${y(0)} `+points.map(p=>`L ${p.join(' ')}`).join(' ')+` L ${x(60)} ${y(0)} Z`});
 add('line',{class:'zero',x1:left,x2:w-right,y1:y(0),y2:y(0)});
 for(let i=0;i<4;i++){
  const v=low+(high-low)*i/3;
  add('text',{x:left-6,y:y(v)+4,'text-anchor':'end'}).textContent=new Intl.NumberFormat(language==='tr'?'tr-TR':'en-GB',{notation:'compact',maximumFractionDigits:1}).format(v);
  add('text',{x:x(i*20),y:h-bottom+22,'text-anchor':i===0?'start':i===3?'end':'middle'}).textContent=i*20;
 }
 for(const prop of ['liquid','blocked'])add('path',{class:prop,d:rows.map((r,i)=>`${i?'L':'M'}${x(r.month)},${y(r[prop])}`).join(' ')});
 add('path',{class:'reserve',d:`M ${x(0)} ${y(reserve)} L ${x(60)} ${y(reserve)}`});
 add('text',{x:left,y:16},'balance');add('text',{x:w-right,y:h-3,'text-anchor':'end'},'months');
}
function render(){
 el('error').textContent='';const p={...defaults};
 try{
  for(const key of keys){const e=el(key);if(['move_month','shared_start'].includes(key)&&!e.value){p[key]=null;continue;}if(!e.value||!e.checkValidity())throw Error('invalid');p[key]=['start_date','birth_date'].includes(key)?e.value:Number(e.value);}
  p.relationship=el('relationship').value;
  const r=GermanyCash.calculate(p);chartState={r,reserve:p.reserve};
  HorizonAlerts.update({kind:'germany',title:el('program').selectedOptions[0].textContent,items:HorizonAlertsModel.germany({program:G.programs.find(x=>x.id===el('program').value),result:r,inputs:p})});
  const gap=r.additional_liquid_required>0;
  lex(el('scenario-state'),gap?'cashGapState':'cashCoveredState');
  lex(el('scenario-note'),gap?'cashGapNote':'cashCoveredNote',{amount:money(r.additional_liquid_required)});el('scenario-note').dataset.dynamic='true';
  el('total').textContent=money(r.required_initial_total);el('graduation').textContent=money(r.graduation_liquid);
  lex(el('negative'),r.first_negative_month===null?'none':'month',{n:r.first_negative_month});el('negative').dataset.dynamic='true';
  lex(el('depleted'),r.blocked_depleted_month===null?'none':'month',{n:r.blocked_depleted_month});el('depleted').dataset.dynamic='true';
  el('negative-card').classList.toggle('critical',r.first_negative_month!==null);
  lex(el('cash-detail'),'cashDetail',{locked:money(p.blocked_initial),liquid:money(r.required_initial_liquid),additional:money(r.additional_liquid_required),horizon:r.projection_months});el('cash-detail').dataset.dynamic='true';
  el('timeline').replaceChildren(...r.timeline.map(event=>{const n=document.createElement('li');lex(n,'eventText',{event:t(event.event==='graduation'?'graduationEvent':event.event),date:event.date,age:event.age});n.dataset.dynamic='true';return n;}));
  const effect=r.life_effects;
  lex(el('time-life'),'timeEffect',{gross:money(effect.student_gross),net:money(effect.student_net),hours:effect.weekly_unallocated,load:t(effect.overbooked?'overbooked':'manageable'),level:el('german_level').value});el('time-life').dataset.dynamic='true';
  lex(el('relationship-life'),effect.relationship);lex(el('housing-life'),'housing');draw(r,p.reserve);
 }catch(error){
  chartState=null;lex(el('error'),'invalid');
  HorizonAlerts.update({kind:'germany',title:el('program').selectedOptions[0]?.textContent||'Almanya',items:HorizonAlertsModel.germany({program:G.programs.find(x=>x.id===el('program').value),result:null,inputs:p,error:t('invalid')})});
  for(const id of ['total','graduation','negative','depleted']){el(id).textContent='—';delete el(id).dataset.lex;}
  for(const id of ['cash-detail','time-life','relationship-life','housing-life','scenario-state','scenario-note']){el(id).textContent='';delete el(id).dataset.lex;}
  el('negative-card').classList.remove('critical');el('timeline').replaceChildren();el('chart').replaceChildren();
 }
}
function renderProgram(updateFees){
 const p=G.programs.find(p=>p.id===el('program').value);if(!p)return;
 lex(el('program-info'),'programUnknown',{summary:t(p.id)});el('program-info').dataset.dynamic='true';
 lex(el('program-fees'),'programFees',{period:p.fee_period,fee:p.semester_fee===null?t('unknown'):money(p.semester_fee),tuition:p.tuition_per_semester===null?t('unknown'):money(p.tuition_per_semester)});el('program-fees').dataset.dynamic='true';
 if(updateFees){el('semester_fee').value=p.semester_fee??'';el('tuition').value=p.tuition_per_semester??'';}
 const relevant=G.life.records.filter(r=>UI_LEXICON[r.id]&&(!/dortmund|dresden|duisburg|essen|ude/.test(r.id)||r.id.includes(p.city.toLowerCase())||(p.city==='Duisburg'&&r.id.includes('ude'))));
 el('sources').replaceChildren(...[{id:'officialProgram',source_url:p.sources[0]},...relevant].map(item=>{const li=document.createElement('li'),a=document.createElement('a');a.href=item.source_url;lex(a,item.id);a.target='_blank';a.rel='noreferrer';li.append(a);return li;}));
}
function renderBudget(){
 if(!budgetState)return;
 const node=el('profile-budget');
 if(budgetState.invalid){lex(node,'budgetInvalid');return;}
 if(budgetState.mode==='sources'){
  lex(node,'budget',{total:money(budgetState.total),gap:money(budgetState.gap),branch:t(budgetState.extra?'rotatingYes':'rotatingNo')});node.dataset.dynamic='true';
 }else{
  delete node.dataset.lex;
  node.textContent=(language==='en'?'Manual allocation total: ':'Manuel dağılım toplamı: ')+money(budgetState.total)+(language==='en'?'. The disabled AZN source fields are not included in this calculation.':'. Devre dışı AZN kaynak alanları bu hesaba dahil edilmez.');
 }
}
function budgetMode(mode){
 el('budget-mode').value=mode;el('budget-sources').disabled=mode==='allocation';
}
function applySources(){
 budgetMode('sources');const saving=el('savings_azn'),rate=el('azn_per_eur');
 if(!saving.value||!rate.value||!saving.checkValidity()||!rate.checkValidity()){
  budgetState={invalid:true};el('initial_liquid').value='';el('blocked_initial').value='';renderBudget();render();return;
 }
 const extra=Number(el('rotating_branch').value),total=(Number(saving.value)+extra)/Number(rate.value),target=defaults.blocked_initial;
 el('blocked_initial').value=Math.min(total,target).toFixed(2);el('initial_liquid').value=Math.max(0,total-target).toFixed(2);
 budgetState={mode:'sources',total:Number(el('initial_liquid').value)+Number(el('blocked_initial').value),gap:Math.max(0,target-total),extra};renderBudget();render();
}
function allocationChanged(){
 budgetMode('allocation');const liquid=el('initial_liquid'),blocked=el('blocked_initial');
 budgetState=liquid.value&&blocked.value&&liquid.checkValidity()&&blocked.checkValidity()?{mode:'allocation',total:Number(liquid.value)+Number(blocked.value)}:{invalid:true};renderBudget();render();
}
function setupBudget(){
 const panel=el('savings_azn').closest('details');panel.open=true;panel.classList.add('budget-panel');
 const modeLabel=document.createElement('label');modeLabel.textContent='Finansman girişi';const mode=document.createElement('select');mode.id='budget-mode';
 for(const[value,label]of [['sources','AZN kaynaklarından otomatik dağıt'],['allocation','Likit / bloke tutarlarını elle düzenle']]){const o=document.createElement('option');o.value=value;o.textContent=label;mode.append(o);}
 modeLabel.append(mode);panel.insertBefore(modeLabel,panel.querySelector('fieldset'));
 const sources=panel.querySelector('fieldset');sources.id='budget-sources';
 const allocation=document.createElement('fieldset');allocation.className='controls';const legend=document.createElement('legend');legend.textContent='Likit ve bloke dağılımı (EUR)';allocation.append(legend);
 for(const key of ['initial_liquid','blocked_initial'])allocation.append(el(key).closest('label'));
 panel.insertBefore(allocation,el('apply-budget'));el('scenario').insertBefore(panel,el('scenario').querySelector('fieldset'));
 mode.addEventListener('change',()=>mode.value==='sources'?applySources():allocationChanged());
 for(const key of ['savings_azn','azn_per_eur'])el(key).addEventListener('input',applySources);
 el('rotating_branch').addEventListener('change',applySources);
 for(const key of ['initial_liquid','blocked_initial'])el(key).addEventListener('input',allocationChanged);
 el('apply-budget').addEventListener('click',applySources);
 applySources();
}
// 4 UI — collect inputs and wire events; financial ledger remains in ENGINE.
for(const p of G.programs){const o=document.createElement('option');o.value=p.id;o.textContent=`${p.city} · ${p.name}`;el('program').append(o);}
for(const key of keys)el(key).value=defaults[key]??'';
el('program').addEventListener('change',()=>{renderProgram(true);render();});
for(const key of keys)el(key).addEventListener('input',render);
for(const key of ['german_level','relationship'])el(key).addEventListener('change',render);
el('theme').addEventListener('change',()=>applyTheme(el('theme').value));
el('language').addEventListener('change',()=>{language=el('language').value;applyTheme(activeTheme);});
new ResizeObserver(()=>{if(chartState)draw(chartState.r,chartState.reserve);}).observe(el('chart'));
renderProgram(true);applyTheme(params.get('theme'));setupBudget();
