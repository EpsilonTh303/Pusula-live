/* Strict versioned browser-input format. No profile, results, HTML or storage access. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory;else root.HorizonScenarioModel=factory(HORIZON_SCENARIO_SCHEMA);})(globalThis,function(schema){
 const MAX_BYTES=256*1024,FORMAT='horizon-scenario';
 function fail(code='invalid_schema'){const error=new Error(code);error.code=code;throw error;}
 function object(value){if(!value||typeof value!=='object'||Array.isArray(value)||![Object.prototype,null].includes(Object.getPrototypeOf(value)))fail();}
 function keys(value,allowed,required=allowed){object(value);if(Object.keys(value).some(k=>!allowed.includes(k))||required.some(k=>!Object.hasOwn(value,k)))fail();}
 function date(v){if(typeof v!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(v))return false;const d=new Date(v+'T00:00:00Z');return Number.isFinite(d.getTime())&&d.toISOString().slice(0,10)===v&&Number(v.slice(0,4))>=1900&&Number(v.slice(0,4))<=2200;}
 function number(v,min=0,max=1e12){return typeof v==='number'&&Number.isFinite(v)&&v>=min&&v<=max;}
 function common(c){keys(c,['start_date','budget_azn','azn_per_eur','budget_currency','rate_unit']);if(c.budget_currency!=='AZN'||c.rate_unit!=='AZN/EUR')fail();if(c.start_date!==null&&!date(c.start_date))fail();if(c.budget_azn!==null&&!number(c.budget_azn))fail();if(c.azn_per_eur!==null&&!number(c.azn_per_eur,.0001,1e6))fail();}
 function field(v,spec){if(v===null&&['number','date'].includes(spec.type))return;if(spec.type==='number'){if(!number(v,spec.min??0,spec.max??1e12))fail();if(spec.step){const n=(v-(spec.min??0))/spec.step;if(Math.abs(n-Math.round(n))>1e-5)fail();}}else if(spec.type==='date'){if(!date(v))fail();}else if(spec.type==='enum'){if(typeof v!=='string'||!spec.values.includes(v))fail();}else if(spec.type==='text'){if(typeof v!=='string'||v.length>(spec.maxLength||16000))fail();}else fail();}
 function create(){return {format:FORMAT,version:1,common:{start_date:null,budget_azn:null,azn_per_eur:schema.fx.EUR,budget_currency:'AZN',rate_unit:'AZN/EUR'},views:{}};}
 function validate(value){keys(value,['format','version','common','views']);if(value.format!==FORMAT)fail();if(value.version!==1)fail('unsupported_version');common(value.common);keys(value.views,Object.keys(schema.views),[]);
  for(const[name,state]of Object.entries(value.views)){keys(state,name==='pusula'?['fields','shared','fundingApplied']:['fields','shared']);common(state.shared);const specs=schema.views[name];keys(state.fields,Object.keys(specs));for(const[id,v]of Object.entries(state.fields))field(v,specs[id]);
   if(name==='work'||name==='pusula'){const countries=name==='work'?schema.workCountries:schema.studyCountries,id=name==='work'?'route':'program',country=state.fields.country;if(country!=='all'&&countries[state.fields[id]]!==country)fail();}
   if(name==='pusula'){const id=state.fundingApplied,selected=state.fields['funding-case'];if(selected&&schema.funding[selected]?.program!==state.fields.program)fail();if(id!==null&&(!Object.hasOwn(schema.funding,id)||schema.funding[id].program!==state.fields.program||state.fields.award!==schema.funding[id].award))fail();}
  }
  const serialized=JSON.stringify(value);if(new TextEncoder().encode(serialized).length>MAX_BYTES)fail('file_too_large');return JSON.parse(serialized);
 }
 function parse(text){if(typeof text!=='string'||new TextEncoder().encode(text).length>MAX_BYTES)fail('file_too_large');let value;try{value=JSON.parse(text);}catch{fail('invalid_json');}return validate(value);}
 function stringify(value){return JSON.stringify(validate(value),null,2)+'\n';}
 function rate(currency,c){return currency==='AZN'?1:currency==='EUR'?c.azn_per_eur:schema.fx[currency]??null;}
 return {MAX_BYTES,create,validate,parse,stringify,rate,date};
});
