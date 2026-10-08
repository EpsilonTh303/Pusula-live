'use strict';
const d=window.PUSULA_DATA,$=id=>document.getElementById(id),money=(v,c='AZN')=>v===null?'Bilinmiyor':new Intl.NumberFormat('tr-TR',{maximumFractionDigits:0}).format(v)+' '+c;
function el(tag,text,parent,cls){const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(cls)node.className=cls;if(parent)parent.append(node);return node;}
function value(id){const raw=$(id).value;if(!raw.trim())throw Error('Boş alan bilinmiyor; hesap için açık varsayım gerekli.');const v=Number(raw);if(!Number.isFinite(v)||v<0)throw Error('Negatif olmayan sonlu değer gir.');return v;}
let conditional=null;
for(const c of Object.values(d.countries)){const option=el('option',c.name_tr,$('country'));option.value=c.id;}
function renderCountries(){
 $('countries').replaceChildren();const budget=value('budget');
 for(const c of Object.values(d.countries)){
  const options=d.programs.filter(p=>p.country_id===c.id),refs=options.map(p=>d.normalized[p.id].first_year_reference_local).filter(x=>x!==null),lowest=refs.length?Math.min(...refs)*d.fx.azn_per_unit[c.currency]:null;
  const card=el('article',undefined,$('countries'),'card');el('h3',c.name_tr,card);el('p',options.length+' seçili program · '+c.currency,card,'muted');el('div',money(lowest),card,'metric');
  el('p',lowest===null?'Tam yaşam bütçesi eksik; maliyet sırası verilmedi.':'İlk-yıl referans açığı: '+money(Math.max(0,lowest-budget)),card);
  if(lowest!==null){const bar=el('div',undefined,card,'bar'),fill=el('span',undefined,bar);fill.style.width=Math.min(100,budget/lowest*100)+'%';}
  el('p',c.id==='US'?'Öz kaynak dalı plan dışında; yazılı fonlu PhD ayrı.':c.id==='PL'?'Yurt tarifesi ayrıca var; yemek/ulaşım/sigorta toplamı eksik.':'Yaşam referansının kapsamı programda gösterilir.',card,'tags');
  const button=el('button','Programlarını aç',card);button.onclick=()=>{$('country').value=c.id;populate();$('program').scrollIntoView({behavior:'smooth',block:'center'});};
 }
}
function selected(){return d.programs.find(p=>p.id===$('program').value);}
function populate(){
 const options=d.programs.filter(p=>$('country').value==='all'||p.country_id===$('country').value);$('program').replaceChildren();
 for(const p of options){const o=el('option',p.campus_city+' · '+p.university+' · '+p.program,$('program'));o.value=p.id;}
 if(options.some(p=>p.id==='tu-dortmund-automation-robotics'))$('program').value='tu-dortmund-automation-robotics';
 selectProgram();
}
function selectProgram(){
 conditional=null;const p=selected(),n=d.normalized[p.id];$('award').value=0;$('living').value=n.annual_living_basis_local===null?'':(n.annual_living_basis_local/12).toFixed(2);
 $('funding-note').textContent='';$('funding').hidden=!d.funding_scenarios.some(f=>f.program_id===p.id);
 $('funding-picker').hidden=$('funding').hidden;$('funding-case').replaceChildren();
 for(const f of d.funding_scenarios.filter(f=>f.program_id===p.id)){const o=el('option',f.id,$('funding-case'));o.value=f.id;}
 $('living-kind').textContent=n.annual_living_basis_local===null?'Toplam yaşam bilinmiyor. Girersen açık varsayım olur.':n.living_basis_kind.includes('statutory')?'Vize geçim tabanı; gerçek şehir maliyeti değil.':'Üniversite yaşam referansı; kişisel gider farklı olabilir.';
 const info=$('program-info');info.replaceChildren();el('h3',p.university+' — '+p.program,info);el('p','Kampüs: '+p.campus_city+' | '+p.duration_months+' ay | '+n.currency+' | '+p.cost_period,info);
 el('p','İlk yıl referansı: '+money(n.first_year_reference_local,n.currency)+' | '+n.reference_kind,info);
 if(n.housing_only_reference_local!==null&&n.housing_only_reference_local!==undefined)el('p','Yalnız konaklama tabanı: '+money(n.housing_only_reference_local,n.currency)+'/yıl; diğer yaşam giderleri dahil değil.',info,'warn');
 el('p',p.cost_notes,info,'muted');el('p','Dil: '+p.language_summary,info);el('p','Akademik kapı: '+p.academic_summary,info);el('p','Fon: '+p.funding_summary,info);
 const gates=$('gates');gates.replaceChildren();el('p','Kişisel kabul, iş ve kalıcı yerleşme şansı: bilinmiyor. Transkript, resmî dil belgesi ve kişisel hukuki uygunluk değerlendirilmedi.',gates,'warn');
 if(p.local_language_required)el('p','Yerel dil kabul şartı var; gerekli dil belgesi ayrıca doğrulanmalıdır.',gates,'warn');
 if(p.graduate_work_gate_summary)el('p',p.graduate_work_gate_summary,gates,'warn');
 const c=d.countries[p.country_id],legal=$('legal');legal.replaceChildren();
 for(const [title,text] of [['Öğrencilik',c.study_work_summary],['Mezuniyet sonrası',c.graduate_work_summary],['Kalıcı statü',c.settlement_summary],['Dil ve iş',c.language_job_summary]]){el('h3',title,legal);el('p',text,legal);}
 const details=el('details',undefined,legal);el('summary','Ülkeye özgü açık riskler',details);const list=el('ul',undefined,details);c.risks.forEach(r=>el('li',r,list));
 $('sources').replaceChildren();for(const url of new Set([...p.sources,...p.cost_sources,...c.sources])){const li=el('li',undefined,$('sources')),a=el('a',url,li);a.href=url;a.target='_blank';a.rel='noopener noreferrer';}
 calculate();
}
function chart(balance,currency){
 const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 600 220');svg.setAttribute('role','img');
 const title=document.createElementNS(ns,'title');title.textContent='Aylık bakiye, '+currency+'; sıfır çizgisinin altı nakit açığı';svg.append(title);
 const low=Math.min(0,...balance),high=Math.max(1,...balance),y=v=>185-(v-low)/(high-low)*145;
 function line(path,color){const n=document.createElementNS(ns,'path');n.setAttribute('d',path);n.setAttribute('fill','none');n.setAttribute('stroke',color);n.setAttribute('stroke-width','2');svg.append(n);}
 line('M20 '+y(0)+' L580 '+y(0),'#edb979');line(balance.map((v,i)=>(i?'L':'M')+(20+i*560/(balance.length-1))+' '+y(v)).join(' '),'#81ded0');
 for(const [x,yy,text] of [[20,20,'Aylık bakiye ('+currency+')'],[20,207,'Varış / ay 0'],[430,207,'Ay '+(balance.length-1)]]){const t=document.createElementNS(ns,'text');t.setAttribute('x',x);t.setAttribute('y',yy);t.setAttribute('fill','#b5c6d6');t.setAttribute('font-size','13');t.textContent=text;svg.append(t);}
 $('chart').replaceChildren(svg);
}
function calculate(){
 $('error').textContent='';$('metrics').replaceChildren();$('chart').replaceChildren();$('balances').textContent='';$('cash-note').textContent='';
 try{
  renderCountries();const p=selected(),n={...d.normalized[p.id]};n.annual_living_basis_local=value('living')*12;
  if(conditional){if(conditional.tuition_waived)n.annual_tuition_basis_local=0;if(conditional.fees_waived)n.annual_fees_basis_local=0;}
  const r=PusulaCash.project(n,d.policy,value('budget'),value('award'),value('multiplier'),value('repay'),value('repay-months'));
  HorizonAlerts.update({kind:'study',title:p.university+' · '+p.program,items:HorizonAlertsModel.study({program:p,normalized:d.normalized[p.id],result:r,conditional})});
  if(!r)throw Error('Harç veya toplam yaşam verisi eksik.');
  for(const [label,v] of [['Koşullu toplam kaynak',money(r.required_azn)],['Planın üzerindeki açık',money(r.gap_azn)],['İlk negatif bakiye ayı',r.first_negative_month===null?'Bu senaryoda yok':String(r.first_negative_month)]]){const card=el('div',undefined,$('metrics'),'card');el('small',label,card);el('p',v,card,'metric');}
  chart(r.balance,n.currency);$('balances').textContent=r.balance.map((v,i)=>'Ay '+i+': '+money(v,n.currency)).join('\n');
  $('cash-note').textContent=(r.viable?'Girilen senaryoda nakit rezervi korunuyor.':'Girilen senaryoda nakit rezervi karşılanmıyor.')+' Bu sonuç kabul, vize veya iş uygunluğu değildir. Yaşam alanına yazılan değer ve fon yalnız senaryo. Katkı 0 girilmesi borç/yükümlülük yok demek değildir. Eksik ücretler ayrıca eklenebilir.';
 }catch(e){$('error').textContent=e.message;const p=selected();HorizonAlerts.update({kind:'study',title:p.university+' · '+p.program,items:HorizonAlertsModel.study({program:p,normalized:d.normalized[p.id],result:null,error:e.message,conditional})});}
}
$('funding').onclick=()=>{conditional=d.funding_scenarios.find(f=>f.id===$('funding-case').value);$('award').value=conditional.annual_award_local;$('funding-note').textContent=conditional.label;calculate();};
$('award').addEventListener('input',()=>{if(conditional){conditional=null;$('funding-note').textContent='Manuel fon varsayımı; koşullu ücret muafiyetleri kaldırıldı.';calculate();}});
$('country').onchange=populate;$('program').onchange=selectProgram;for(const id of ['budget','living','multiplier','award','repay','repay-months'])$(id).addEventListener('input',calculate);populate();

window.HorizonView={captureExtra(){return {fundingApplied:conditional?.id||null};},restore(fields,extra){$('country').value=fields.country;populate();$('program').value=fields.program;selectProgram();for(const[id,value]of Object.entries(fields))$(id).value=value===null?'':String(value);if(extra.fundingApplied){$('funding-case').value=extra.fundingApplied;$('funding').click();$('funding-case').value=fields['funding-case'];}calculate();}};
