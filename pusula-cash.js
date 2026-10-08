(function(root){
'use strict';
function number(v){if(typeof v!=='number'||!Number.isFinite(v)||v<0)throw Error('Sonlu, negatif olmayan sayı gir.');return v;}
function project(n,policy,budget,award=0,multiplier=1,repay=0,repayMonths=0){
 [budget,award,multiplier,repay].forEach(number);if(!multiplier)throw Error('Yaşam çarpanı pozitif olmalı.');
 if(!Number.isInteger(repayMonths)||repayMonths<0||repayMonths>120)throw Error('Katkı süresi 0–120 ay.');
 const s=policy.hypothetical_degree_stress;number(s.annual_cost_growth);number(s.setup_cost_azn);
 if(s.annual_cost_growth>1)throw Error('Yıllık artış 0–1.');
 for(const k of ['post_degree_search_months','reserve_months'])if(!Number.isInteger(s[k])||s[k]<0||s[k]>36)throw Error('Süre 0–36 ay.');
 if(n.annual_living_basis_local===null||n.annual_tuition_basis_local===null)return null;
 const monthly=number(n.annual_living_basis_local)/12*multiplier,fees=number(n.annual_tuition_basis_local)+(n.annual_fees_basis_local??0),degree=n.duration_months;
 const setup=Math.max(s.setup_cost_azn/n.azn_per_unit,n.initial_setup_in_living_local||0),relative=[-setup];let cumulative=-setup,minimum=cumulative;
 for(let m=1;m<=degree+s.post_degree_search_months;m++){
  let cost=monthly*(1+s.annual_cost_growth)**((m-1)/12);
  if(m<=degree&&(m-1)%6===0)cost+=fees/2*Math.min(6,degree-m+1)/6*(1+s.annual_cost_growth)**((m-1)/12);
  if(m<=repayMonths)cost+=repay/n.azn_per_unit;
  cumulative+=(m<=degree?award/12:0)-cost;minimum=Math.min(minimum,cumulative);relative.push(cumulative);
 }
 const round=v=>Math.round((v+Number.EPSILON)*100)/100,required=round(Math.max(0,monthly*s.reserve_months-minimum));
 const balance=relative.map(v=>round(budget/n.azn_per_unit+v));
 return {minimum_initial_cash:required,required_azn:required*n.azn_per_unit,gap_azn:Math.max(0,required*n.azn_per_unit-budget),balance,
 first_negative_month:balance.findIndex(v=>v<0)<0?null:balance.findIndex(v=>v<0),viable:budget/n.azn_per_unit>=required,
 monthly_living_local:monthly,initial_setup_local_assumed:setup,legal_or_admission_viability:null};
}
const api={project};if(typeof module!=='undefined')module.exports=api;else root.PusulaCash=api;
})(typeof window!=='undefined'?window:globalThis);
