(function(root){'use strict';
const levels=['A1','A2','B1','B2','C1','C2'],num=v=>{if(typeof v!=='number'||!Number.isFinite(v)||v<0)throw Error('Sonlu, negatif olmayan sayı gerekir.');return v;},round=v=>Math.round((v+Number.EPSILON)*100)/100;
function cash(p,currency,rate){
 if(['setup_cost_local','monthly_expense_local','monthly_net_pay_local'].some(k=>p[k]===null))return null;
 let pending=0,cumulative=-p.setup_cost_local,minimum=cumulative;const relative=[cumulative],income=[],expenses=[];
 for(let m=1;m<=p.months;m++){
  const lost=p.job_loss_month!==null&&p.job_loss_month<=m&&m<p.job_loss_month+p.job_loss_months;
  pending+=m>=p.income_start_month&&!lost?p.monthly_net_pay_local:0;
  const receipt=m>=p.income_start_month+p.pay_delay_months?pending:0;if(receipt)pending=0;
  const cost=p.monthly_expense_local*(1+p.annual_expense_growth)**((m-1)/12)+(m<=p.repayment_months?p.repayment_monthly_azn/rate:0);
  income.push(receipt);expenses.push(cost);cumulative+=receipt-cost;relative.push(cumulative);minimum=Math.min(minimum,cumulative);
 }
 const reserve=p.monthly_expense_local*p.reserve_months,required=round(Math.max(0,reserve-minimum)),balance=relative.map(v=>round(p.budget_azn/rate+v));
 const idx=balance.findIndex(v=>v<0);
 return {minimum_initial_cash:required,required_azn:required*rate,gap_azn:Math.max(0,required*rate-p.budget_azn),balance,income,expenses,first_negative_month:idx<0?null:idx,viable:p.budget_azn/rate>=required,unreceived_earned_pay_local:pending};
}
function validate(p){
 const date=new Date(p.start_date+'T12:00:00Z');if(!Number.isFinite(+date)||date.toISOString().slice(0,10)!==p.start_date)throw Error('Geçerli tarih gerekli.');
 for(const [k,v] of Object.entries(p)){
  if(k.endsWith('_verified')||['degree_completed','degree_recognized','offer_available','sponsor_approved','selection_or_invitation_confirmed','authority_approval_confirmed','funds_documented'].includes(k)){if(v!==null&&typeof v!=='boolean')throw Error('true/false/null: '+k);}
  if(typeof v==='number')num(v);
 }
 for(const k of ['additional_departure_delay_months','bridge_months','experience_months','months','income_start_month','pay_delay_months','job_loss_months','reserve_months','repayment_months'])if(!Number.isInteger(p[k])||p[k]<0||p[k]>120)throw Error('Tam ay 0–120: '+k);
 if(p.months<1||p.income_start_month<1||p.annual_expense_growth>1)throw Error('Süre/başlangıç/artış geçersiz.');
 if(p.job_loss_month!==null&&(!Number.isInteger(p.job_loss_month)||p.job_loss_month<1||p.job_loss_month>120))throw Error('İş kaybı ayı 1–120.');
 if(p.english_clb!==null&&(!Number.isInteger(p.english_clb)||p.english_clb<0||p.english_clb>12))throw Error('CLB0–12 tam sayı.');
 for(const k of ['local_language_certified_cefr','english_certified_cefr'])if(p[k]!==null&&!levels.includes(p[k]))throw Error('CEFR seviyesi geçersiz.');
}
function evaluate(r,c,fx,p,birth){
 validate(p);const rate=num(fx.azn_per_unit[c.currency]);if(!rate)throw Error('Kur pozitif olmalı.');
 const start=new Date(p.start_date+'T12:00:00Z'),day=start.getUTCDate();start.setUTCDate(1);start.setUTCMonth(start.getUTCMonth()+p.additional_departure_delay_months+p.bridge_months);const end=new Date(start);end.setUTCMonth(end.getUTCMonth()+1);end.setUTCDate(0);start.setUTCDate(Math.min(day,end.getUTCDate()));
 const departure=start.toISOString().slice(0,10),b=new Date(birth+'T12:00:00Z'),age=start.getUTCFullYear()-b.getUTCFullYear()-(departure.slice(5)<birth.slice(5)?1:0),gates=[];
 const gate=(key,v)=>gates.push({key,status:v===null?'unknown':v?'pass':'fail'});
 gate('departure',p.legal_departure_verified);gate('degree',p.degree_completed);
 if(r.recognized_degree_required===true)gate('recognition',p.degree_recognized);
 if(r.requires_offer){gate('offer',p.offer_available);gate('job_fit',p.job_requirements_verified);}
 if(r.sponsor_required===true)gate('sponsor',p.sponsor_approved);
 if(r.authority_approval_required)gate('authority_approval',p.authority_approval_confirmed);
 if(r.employer_extra_payment_required_or_exemption_gate)gate('employer_entry_policy',p.employer_entry_policy_verified);
 if(r.experience_months_min!==null&&r.experience_months_min>0)gate('experience',p.experience_months<r.experience_months_min?false:p.experience_qualifies_verified);
 if(r.salary_threshold_annual_local!==null)gate('salary',p.annual_gross_salary_local===null?null:p.annual_gross_salary_local<r.salary_threshold_annual_local?false:p.salary_rule_verified);
 else if(r.salary_threshold_candidates_local)gate('salary',p.salary_rule_verified);
 if(r.formal_language_cefr){const actual=r.formal_language_kind==='english'?p.english_certified_cefr:p.local_language_certified_cefr;gate('language',actual===null?null:levels.indexOf(actual)>=levels.indexOf(r.formal_language_cefr));}
 if(r.english_clb_min!==undefined&&r.english_clb_min!==null)gate('english_clb',p.english_clb===null?null:p.english_clb>=r.english_clb_min);
 if(r.age_min!==undefined&&r.age_min!==null)gate('age_min',age>=r.age_min);
 if(r.age_max!==undefined&&r.age_max!==null)gate('age_max',age<=r.age_max);
 if(r.qualifying_selection_required)gate('selection',p.selection_or_invitation_confirmed);
 if(r.points_min!==undefined&&r.points_min!==null)gate('points',p.route_points===null?null:p.route_points<r.points_min?false:p.points_calculation_verified);
 if(r.financial_proof.amount_local!==null){const e=p.financial_proof_exemption_verified;gate('funds',e===true?true:e===false&&p.budget_azn/rate<r.financial_proof.amount_local?false:e===false?p.funds_documented:null);}
 if(r.unencumbered_funds_required&&p.financial_proof_exemption_verified!==true)gate('unencumbered_funds',p.funds_unencumbered_verified);
 gate('extra_route_requirements',p.extra_route_requirements_verified);
 const failed=gates.filter(g=>g.status==='fail').map(g=>g.key),unknown=gates.filter(g=>g.status==='unknown').map(g=>g.key);
 return {gates,failed_gates:failed,unknown_gates:unknown,status:failed.length?'fails_modeled_gate':unknown.length?'unverified':'modeled_gates_pass_only',scenario_departure:departure,scenario_age:age,cash:cash(p,c.currency,rate),entry_permission_confirmed:false,settlement_date:null};
}
const api={evaluate,cash};if(typeof module!=='undefined')module.exports=api;else root.WorkModel=api;
})(typeof window!=='undefined'?window:globalThis);
