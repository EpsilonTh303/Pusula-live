const routeSelect=document.getElementById('route');
const inputs=['initial_cash','initial_cost','income_monthly','expense_monthly','reserve'];
const money=(n,unit)=>`${new Intl.NumberFormat('tr-TR',{maximumFractionDigits:0}).format(n)} ${unit}`;
const stages={
 'de-work':['Diploma tanınması + nitelikli sözleşme + izin + nakit','İşe başlama; probation ve ilk maaş zamanlaması','Uygun iş/katkı/dil ve oturum koşulları sağlanırsa settlement başvurusu'],
 'de-master':['Ders eşdeğerliği + kabul + bütün derece finansmanı + izin','Yaklaşık 2 yıl master; dil, staj ve sanayi tezi','Mezuniyet sonrası uygun iş arama/iş oturumu; şartlı settlement'],
 'us-phd':['Araştırma uyumu + kabul + yazılı 12 ay tam fon + F-1 uygunluğu','Varsayımsal 5–7 yıl PhD; danışman ve fonun devamı','Uygun OPT/STEM ve iş; sonraki çalışma/göç statüsü ayrı, PR tarihi bilinmiyor'],
 'ca-master':['Tezli program kabulü + tuition sonrası yeterli fon + izin','Yaklaşık 2 yıl master; PGWP uygunluğu kontrolü','Uygun PGWP + nitelikli iş; CEC şartları davet/PR garantisi değil'],
 'emjm':['Gerçek burs + program/ders uygunluğu + mobilite izinleri','Yaklaşık 2 yıl, birden çok yerleşme ve ödeme takvimi','Diploma/ülkeye özel mezuniyet ve iş hakları; Alman hakkı otomatik değil'],
 'de-search':['Uygunluk + finansman + geçici arama izni','İş arama: sınırlı süre; geliri varsayma','Uygun iş bulunursa yeni çalışma oturumu; bulunmazsa yasal çıkış/alternatif'],
 'bridge':['Gerçek ilgili iş/RA sözleşmesi + yasal devam','12 ay varsayımsal deneyim, referans ve nakit köprüsü','Yeni teklif + fon + izin varsa 2030 çıkış; çıkış gerçekleşmedi diye kaydet']};
for(const r of IMMIGRATION_DATA.routes){const o=document.createElement('option');o.value=r.id;o.textContent=r.name;routeSelect.append(o);}
let last=null;
function draw(result,reserve,unit){
 const svg=document.getElementById('chart'),w=svg.clientWidth,h=280,left=76,right=14,top=18,bottom=44;
 svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
 const b=result.balance;let low=Math.min(0,...b),high=Math.max(reserve,...b,1),pad=(high-low)*0.08;low-=pad;high+=pad;
 const x=i=>left+i/(b.length-1)*(w-left-right), y=v=>h-bottom-(v-low)/(high-low)*(h-top-bottom);
 const ns='http://www.w3.org/2000/svg';svg.replaceChildren();
 function add(tag,attrs,text){const e=document.createElementNS(ns,tag);for(const[k,v]of Object.entries(attrs))e.setAttribute(k,v);if(text)e.textContent=text;svg.append(e);return e;}
 add('title',{},'Aylık likit bakiye');
 for(const [v,css] of [[0,'zero'],[reserve,'reserve']])add('line',{x1:left,x2:w-right,y1:y(v),y2:y(v),class:css});
 for(let t=0;t<4;t++){const v=low+(high-low)*t/3;add('text',{x:left-8,y:y(v)+4,'text-anchor':'end'},new Intl.NumberFormat('tr-TR',{notation:'compact',maximumFractionDigits:1}).format(v));}
 for(let t=0;t<4;t++){const m=Math.round((b.length-1)*t/3);add('text',{x:x(m),y:h-bottom+21,'text-anchor':t===0?'start':t===3?'end':'middle'},String(m));}
 add('text',{x:left,y:12},`Bakiye (${unit})`);add('text',{x:w-right,y:h-5,'text-anchor':'end'},'Ay');
 add('path',{d:b.map((v,i)=>`${i?'L':'M'}${x(i)},${y(v)}`).join(' '),class:'trace'});
}
function render(){
 const r=IMMIGRATION_DATA.routes.find(r=>r.id===routeSelect.value),caseName=document.getElementById('case').value,c=IMMIGRATION_DATA.assumptions.cases[caseName];
 const values={};document.getElementById('error').textContent='';
 try{
  for(const key of [...inputs,'months']){const e=document.getElementById(key);if(!e.value||!e.checkValidity())throw Error('Bütün alanlara geçerli, negatif olmayan sayı gir.');values[key]=Number(e.value);}
  const result=ImmigrationCash.calc(values,c,values.months);last={result,reserve:values.reserve,unit:r.currency};
  document.getElementById('required').textContent=money(result.minimum_initial_cash,r.currency);
  document.getElementById('ending').textContent=money(result.balance.at(-1),r.currency);
  document.getElementById('negative').textContent=result.first_negative_month===null?'Yok':`Ay ${result.first_negative_month}`;
  document.getElementById('case-detail').textContent=caseName==='adverse'?'Gider +%25; ilk 2 ay gelir gecikir ve ay 3 toplu gelir; ay 7–9 gelir yok; ay 5 ek masraf; %5 gider enflasyonu.':caseName==='base'?'İlk ay gelir gecikir, ay 2 toplu gelir; %3 gider enflasyonu.':'Gider −%15; ödeme gecikmesi yok; %2 gider enflasyonu.';
  draw(result,values.reserve,r.currency);
 }catch(error){last=null;document.getElementById('error').textContent=error.message;for(const id of ['required','ending','negative'])document.getElementById(id).textContent='—';document.getElementById('chart').replaceChildren();}
 document.getElementById('timeline').replaceChildren(...stages[r.id].map(text=>{const e=document.createElement('li');e.textContent=text;return e;}));
 document.getElementById('gates').textContent='Bu yol için kişisel uygunluk, yazılı teklif ve finansman ile yasal geçiş henüz doğrulanmadı. '+r.timeline;
}
function loadRoute(){const r=IMMIGRATION_DATA.routes.find(r=>r.id===routeSelect.value),p=IMMIGRATION_DATA.assumptions.routes[r.id];for(const k of inputs)document.getElementById(k).value=p[k];document.getElementById('months').value=r.duration_months;document.getElementById('unit').textContent=`Tutarlar: ${r.currency} · örnek varsayımlar`;render();}
routeSelect.addEventListener('change',loadRoute);document.getElementById('case').addEventListener('change',render);for(const k of [...inputs,'months'])document.getElementById(k).addEventListener('input',render);
new ResizeObserver(()=>{if(last)draw(last.result,last.reserve,last.unit);}).observe(document.getElementById('chart'));loadRoute();

window.HorizonView={restore(fields){routeSelect.value=fields.route;loadRoute();for(const[id,value]of Object.entries(fields))document.getElementById(id).value=value===null?'':String(value);render();}};
