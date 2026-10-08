// 2 ENGINE — pure, currency EUR; no theme, DOM or localization dependencies.
(function(root){
 function simulate(p){
  const nums=['initial_liquid','blocked_initial','blocked_release','initial_cost','reserve','rent','food','insurance','social','other','semester_fee','tuition','scholarship','student_hours','hourly_gross','net_factor','work_net','annual_inflation','repayment_monthly','move_cost','shared_saving','german_hours','social_hours','study_hours','commute_hours'];
  for(const k of nums)if(typeof p[k]!=='number'||!Number.isFinite(p[k])||p[k]<0)throw Error('Negatif olmayan geçerli tutarlar ve saatler gir.');
  for(const k of ['study_months','search_months','work_months','student_job_start','salary_delay','repayment_start','repayment_months'])if(!Number.isInteger(p[k])||p[k]<0)throw Error('Süreleri tam sayı gir.');
  if(p.study_months<1||p.study_months>60||p.search_months>36||p.work_months>60||p.student_job_start<1||p.repayment_start<1||p.repayment_months>156||p.student_hours>20||p.net_factor>1||p.annual_inflation>1)throw Error('Alan sınırlarını kontrol et.');
  for(const k of ['move_month','shared_start'])if(p[k]!==null&&(!Number.isInteger(p[k])||p[k]<1))throw Error('Olay ayı boş veya pozitif tam sayı olmalı.');
  let liquid=p.initial_liquid-p.initial_cost,blocked=p.blocked_initial,minimum=liquid,pending=0;
  const rows=[{month:0,phase:'arrival',liquid,blocked,external_income:0,expense:p.initial_cost,transfer:0}];
  const end=p.study_months+p.search_months+p.work_months;
  for(let m=1;m<=end;m++){
   const studying=m<=p.study_months,searching=!studying&&m<=p.study_months+p.search_months;
   const phase=studying?'study':searching?'search':'work';let external=studying?p.scholarship:0;
   if(studying&&m>=p.student_job_start)external+=p.student_hours*(52/12)*p.hourly_gross*p.net_factor;
   if(phase==='work'){const wm=m-p.study_months-p.search_months;if(wm<=p.salary_delay)pending+=p.work_net;else{external+=p.work_net+pending;pending=0;}}
   const transfer=Math.min(blocked,p.blocked_release);blocked-=transfer;
   const base=p.rent+p.food+p.insurance+p.social+p.other;
   const saving=p.shared_start!==null&&m>=p.shared_start?Math.min(p.shared_saving,p.rent):0;
   let expense=(base-saving)*Math.pow(1+p.annual_inflation,(m-1)/12);
   if(studying&&(m-1)%6===0)expense+=p.semester_fee+p.tuition;
   if(m>=p.repayment_start&&m<p.repayment_start+p.repayment_months)expense+=p.repayment_monthly;
   if(m===p.move_month)expense+=p.move_cost;
   liquid+=external+transfer-expense;minimum=Math.min(minimum,liquid);
   rows.push({month:m,phase,liquid,blocked,external_income:external,expense,transfer});
  }
  const required=Math.max(0,p.reserve-(minimum-p.initial_liquid)),additional=Math.max(0,required-p.initial_liquid);
  const shift=n=>{const d=new Date(p.start_date+'T00:00:00Z'),target=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+n,1)),last=new Date(Date.UTC(target.getUTCFullYear(),target.getUTCMonth()+1,0)).getUTCDate();target.setUTCDate(Math.min(last,d.getUTCDate()));return target.toISOString().slice(0,10);};
  const age=s=>{const d=new Date(s+'T00:00:00Z'),b=new Date(p.birth_date+'T00:00:00Z');return d.getUTCFullYear()-b.getUTCFullYear()-Number(d.getUTCMonth()<b.getUTCMonth()||(d.getUTCMonth()===b.getUTCMonth()&&d.getUTCDate()<b.getUTCDate()));};
  const timeline=[{event:'arrival',date:p.start_date},{event:'graduation',date:shift(p.study_months)},{event:'work_start_assumed',date:shift(p.study_months+p.search_months)},{event:'settlement_gate_conditional',date:shift(p.study_months+p.search_months+24)}];
  timeline.forEach(e=>e.age=age(e.date));
  return{rows,initial_total:p.initial_liquid+p.blocked_initial,additional_liquid_required:additional,required_initial_liquid:required,required_initial_total:required+p.blocked_initial,first_negative_month:rows.find(r=>r.liquid<0)?.month??null,graduation_liquid:rows[p.study_months].liquid,work_start_liquid:rows[p.study_months+p.search_months].liquid,blocked_depleted_month:rows.find(r=>r.blocked===0)?.month??null,timeline,weekly_unallocated:168-56-28-p.study_hours-p.student_hours-p.german_hours-p.social_hours-p.commute_hours};
 }
 function calculate(inputs){
  const p={...inputs};
  if(!Number.isInteger(p.work_months)||p.work_months<0||p.work_months>60)throw Error('Invalid work horizon');
  const mode=p.relationship??'open';
  if(!['open','dating','cohabit','marriage'].includes(mode))throw Error('Invalid relationship branch');
  if(!['cohabit','marriage'].includes(mode)){p.shared_start=null;p.shared_saving=0;}
  p.work_months=Math.max(p.work_months,60-p.study_months-p.search_months);
  const r=simulate(p);
  return {...r,projection_months:r.rows.length-1,chart_rows:r.rows.slice(0,61),
   life_effects:{weekly_unallocated:r.weekly_unallocated,overbooked:r.weekly_unallocated<0,
    student_gross:p.student_hours*(52/12)*p.hourly_gross,
    student_net:p.student_hours*(52/12)*p.hourly_gross*p.net_factor,
    relationship:mode,shared_saving:p.shared_saving,shared_start:p.shared_start}};
 }
 if(typeof module!=='undefined')module.exports={simulate,calculate};else root.GermanyCash={simulate,calculate};
})(globalThis);
