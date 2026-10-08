(function(root){
 const sensor=[28,29.8,30.2,29.9,30.1,29.7,30.3,32,31.5,30.1,29.9,28];
 const csvExample='time,temperature\n0,20\n1,21\n2,missing\n3,24\n4,23\n5,not-a-number\n6,26\n';
 function control(kp=2,damping=2){
  if(!Number.isFinite(kp)||!Number.isFinite(damping)||kp<.1||kp>10||damping<.1||damping>5)throw Error('Kazanç 0,1–10; sönüm 0,1–5 aralığında olmalı.');
  const target=10,dt=.02,rows=[{time:0,position:0}];let x=0,v=0;
  for(let i=1;i<=1000;i++){v+=(kp*(target-x)-damping*v)*dt;x+=v*dt;rows.push({time:i*dt,position:x});}
  let last=-1;rows.forEach((r,i)=>{if(Math.abs(r.position-target)>.02*target)last=i;});
  return{kind:'synthetic_control_trial',kp,damping,target,overshoot_percent:Math.max(0,(Math.max(...rows.map(r=>r.position))-target)/target*100),settling_seconds_in_observed_window:last<rows.length-1?rows[last+1].time:null,final_position:x,rows};
 }
 function embedded(band=0,values=sensor){
  if(!Number.isFinite(band)||band<0||band>4||!Array.isArray(values)||!values.length||values.length>1000)throw Error('Bant 0–4, sensör dizisi 1–1000 örnek olmalı.');
  let on=false,transitions=0,faults=0;const rows=[];
  values.forEach((value,sample)=>{const before=on,valid=typeof value==='number'&&Number.isFinite(value)&&value>=-40&&value<=125;
   if(!valid){on=false;faults++;}else if(!on&&value>=30+band/2)on=true;else if(on&&value<30-band/2)on=false;
   transitions+=Number(before!==on);rows.push({sample,value:valid?value:null,valid,output_on:on});});
  return{kind:'synthetic_embedded_trial',band,threshold:30,transitions,faults,rows};
 }
 function parseCSV(raw){
  const rows=[];let row=[],cell='',quoted=false,started=false;
  raw=raw.replace(/\r\n?/g,'\n');
  for(let i=0;i<raw.length;i++){const c=raw[i];
   if(quoted){if(c==='"'){if(raw[i+1]==='"'){cell+='"';i++;}else{quoted=false;if(i+1<raw.length&&!['\n',','].includes(raw[i+1]))throw Error('CSV tırnağından sonra ayraç gerekli.');}}else cell+=c;}
   else if(c==='"'&&!started){quoted=true;started=true;}
   else if(c===','){row.push(cell);cell='';started=false;}
   else if(c==='\n'){if(started||cell!==''||row.length)row.push(cell);rows.push(row);row=[];cell='';started=false;}
   else{cell+=c;started=true;}
  }
  if(quoted)throw Error('CSV tırnakları kapanmamış.');
  if(cell!==''||row.length){row.push(cell);rows.push(row);}return rows;
 }
 function software(raw=csvExample){
  if(typeof raw!=='string'||raw.length>100000)throw Error('CSV en fazla 100.000 karakter olmalı.');
  const rows=parseCSV(raw),accepted=[],rejected=[];
  if(!rows.length||rows[0].length!==2||rows[0][0]!=='time'||rows[0][1]!=='temperature')throw Error('CSV başlığı time,temperature olmalı.');
  const numeric=s=>/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(s.trim())?Number(s):NaN;
  rows.slice(1).forEach((r,i)=>{if(!r.length)return;const t=numeric(r[0]),value=numeric(r[1]??'');if(r.length!==2||!Number.isFinite(t)||!Number.isFinite(value)||t<0)rejected.push({line:i+2,reason:'Two finite numeric fields; nonnegative time required'});else accepted.push({time:t,temperature:value});});
  const values=accepted.map(r=>r.temperature);return{kind:'synthetic_software_trial',accepted,rejected,valid_count:values.length,invalid_count:rejected.length,mean:values.length?values.reduce((a,b)=>a+b,0)/values.length:null,minimum:values.length?Math.min(...values):null,maximum:values.length?Math.max(...values):null};
 }
 const api={control,embedded,software,sensor,csvExample};if(typeof module!=='undefined'){module.exports=api;return;}root.CareerLab=api;
 const el=id=>document.getElementById(id);let latest=null;
 function draw(r){const svg=el('control-chart'),w=svg.clientWidth,h=260,l=40,right=14,top=20,bottom=35,ns='http://www.w3.org/2000/svg';svg.replaceChildren();svg.setAttribute('viewBox',`0 0 ${w} ${h}`);const high=Math.max(11,...r.rows.map(v=>v.position))*1.08,xx=t=>l+t/20*(w-l-right),yy=x=>h-bottom-x/high*(h-top-bottom);
  function add(tag,attrs,text){const e=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));if(text)e.textContent=text;svg.append(e);}
  add('line',{class:'target',x1:l,x2:w-right,y1:yy(10),y2:yy(10)});add('text',{x:l,y:yy(10)-5},'Hedef 10');add('path',{class:'trace',d:r.rows.map((p,i)=>`${i?'L':'M'}${xx(p.time)},${yy(p.position)}`).join(' ')});add('text',{x:l,y:h-8},'0 saniye');add('text',{x:w-right,y:h-8,'text-anchor':'end'},'20 saniye');}
 function renderControl(){try{if(!el('gain').value||!el('damping').value)throw Error('İki alanı doldur.');latest=control(Number(el('gain').value),Number(el('damping').value));el('control-error').textContent='';el('control-result').textContent=`Hedefi aşma: %${latest.overshoot_percent.toFixed(1)}. ±%2 bandında kalan yerleşme: ${latest.settling_seconds_in_observed_window===null?'20 saniyede yerleşmedi':latest.settling_seconds_in_observed_window.toFixed(2)+' saniye'}. Bu yalnız seçili sanal model.`;draw(latest);}catch(e){latest=null;el('control-error').textContent=e.message;el('control-result').textContent='';el('control-chart').replaceChildren();}}
 function renderEmbedded(){try{if(!el('band').value)throw Error('Bant değerini doldur.');const r=embedded(Number(el('band').value),el('sensor-case').value==='fault'?[28,32,null,28]:sensor);el('embedded-error').textContent='';el('embedded-result').textContent=`Çıkış değişimi: ${r.transitions}; geçersiz sensör: ${r.faults}.`;el('sensor-trace').textContent=r.rows.map(r=>`${r.sample}: ${r.valid?r.value:'GEÇERSİZ'} → ${r.output_on?'AÇIK':'KAPALI'}`).join('\n');}catch(e){el('embedded-error').textContent=e.message;el('embedded-result').textContent='';el('sensor-trace').textContent='';}}
 function renderSoftware(){try{const r=software(el('csv').value);el('software-error').textContent='';el('software-result').textContent=`Geçerli: ${r.valid_count}; hatalı: ${r.invalid_count}; ortalama: ${r.mean===null?'bilinmiyor':r.mean.toFixed(2)}.`;el('bad-rows').textContent=r.rejected.map(r=>`${r.line}. CSV kaydı hatalı: sayısal iki alan gerekli`).join('\n')||'Hatalı kayıt yok.';}catch(e){el('software-error').textContent=e.message;el('software-result').textContent='';el('bad-rows').textContent='';}}
 for(const id of ['gain','damping'])el(id).addEventListener('input',renderControl);el('band').addEventListener('input',renderEmbedded);el('sensor-case').addEventListener('change',renderEmbedded);el('analyze').addEventListener('click',renderSoftware);el('csv').value=csvExample;
 const presets={slow:[.4,2],balanced:[2,2],oscillatory:[8,.4]};document.querySelectorAll('[data-preset]').forEach(b=>b.addEventListener('click',()=>{const [kp,d]=presets[b.dataset.preset];el('gain').value=kp;el('damping').value=d;renderControl();}));new ResizeObserver(()=>{if(latest)draw(latest);}).observe(el('control-chart'));renderControl();renderEmbedded();renderSoftware();
 globalThis.HorizonView={restore(fields){for(const[id,value]of Object.entries(fields))el(id).value=value===null?'':String(value);renderControl();renderEmbedded();renderSoftware();}};
})(globalThis);
