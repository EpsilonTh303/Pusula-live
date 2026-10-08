(function(root){'use strict';
const text=(v)=>typeof v==='string'&&v.trim()?v.trim():null;
const money=(v,currency)=>typeof v==='number'&&Number.isFinite(v)?new Intl.NumberFormat('tr-TR',{maximumFractionDigits:0}).format(v)+(currency?' '+currency:''):null;
const gateLabels={departure:['Yasal çıkış','legal_departure_verified'],degree:['Diploma','degree_completed'],recognition:['Diploma denkliği','degree_recognized'],offer:['İş teklifi','offer_available'],job_fit:['Pozisyon uygunluğu','job_requirements_verified'],sponsor:['Sponsor','sponsor_approved'],authority_approval:['Yetkili kurum onayı','authority_approval_confirmed'],employer_entry_policy:['İşveren giriş koşulu','employer_entry_policy_verified'],experience:['Nitelikli deneyim','experience_qualifies_verified'],salary:['Maaş koşulu','salary_rule_verified'],language:['Dil koşulu','local_language_certified_cefr'],english_clb:['İngilizce puanı','english_clb'],age_min:['Asgari yaş',''],age_max:['Yaş sınırı',''],selection:['Seçim/davet','selection_or_invitation_confirmed'],points:['Puan eşiği','points_calculation_verified'],funds:['Maddi kanıt','funds_documented'],unencumbered_funds:['Serbest kullanılabilir fon','funds_unencumbered_verified'],extra_route_requirements:['Ek rota koşulları','extra_route_requirements_verified']};
function alert(id,status,title,detail,action,target){return {id,status,title,detail,action,target:target||null};}
function gateAlert(g,inputs,why,route){const spec=gateLabels[g.key]||[g.key,''];let field=spec[1], value=field&&inputs?inputs[field]:undefined;let detail;
 if(g.key==='language'&&route.formal_language_kind==='english')field='english_certified_cefr';
 if(g.key==='experience'&&g.status==='fail'&&typeof route.experience_months_min==='number'&&route.experience_months_min>0){field='experience_months';detail='Bu rota en az '+route.experience_months_min+' ay deneyim istiyor; senaryoda '+(typeof inputs.experience_months==='number'?inputs.experience_months:'bilinmiyor')+' ay girilmiş.';}
 else if(g.key==='salary'&&g.status==='fail'&&typeof route.salary_threshold_annual_local==='number'&&route.salary_threshold_annual_local>0){field='annual_gross_salary_local';detail='Bu rota için modellenen yıllık eşik '+money(route.salary_threshold_annual_local,route.currency||'yerel para')+'; senaryoda '+(typeof inputs.annual_gross_salary_local==='number'?money(inputs.annual_gross_salary_local,route.currency||'yerel para'):'maaş girilmemiş')+' girilmiş.';}
 else if(g.key==='points'&&g.status==='fail'&&typeof route.points_min==='number'){field='route_points';detail='Bu rota için modellenen eşik '+route.points_min+' puan; senaryoda '+(typeof inputs.route_points==='number'?inputs.route_points:'puan bilinmiyor')+' girilmiş.';}
 else if(g.key==='experience'&&inputs&&typeof inputs.experience_months==='number')detail='Girilen deneyim: '+inputs.experience_months+' ay.';
 else if(g.key==='salary'&&inputs&&typeof inputs.annual_gross_salary_local==='number')detail='Girilen yıllık brüt maaş: '+money(inputs.annual_gross_salary_local,route.currency||'yerel para')+'.';
 else if(g.key==='language')detail='Resmî dil yeterliği bu senaryoda doğrulanmadı.';
 else if(g.key==='offer')detail='İş teklifi bu senaryoda '+(value===false?'yok.':'doğrulanmadı.');
 else detail=value===false?'Girilen senaryoda bu koşul sağlanmıyor.':'Bu koşul için doğrulanmış bilgi eksik.';
 const supplied=why&&typeof why==='object'?text(why[g.key]):null;if(supplied)detail=detail+' '+supplied;
 const status=g.status==='fail'?'fail':'unknown';
 return alert('work-gate-'+g.key,status,spec[0],detail,status==='fail'?'İlgili koşulu sağla veya senaryo girdisini güncelle.':'Girdiyi doğrula veya belge bilgisini ekle.',field);
}
function work({route={},result={},inputs={},why}={}){result=result||{};inputs=inputs||{};const out=[];const byKey=new Map((result.gates||[]).map(g=>[g.key,g]));
 for(const key of [...(result.failed_gates||[]),...(result.unknown_gates||[])]){const g=byKey.get(key)||{key,status:(result.failed_gates||[]).includes(key)?'fail':'unknown'};out.push(gateAlert(g,inputs,why,route));}
 const cash=result.cash;
 if(cash&&typeof cash.gap_azn==='number'&&cash.gap_azn>0)out.push(alert('work-cash-gap','fail','Başlangıç nakit açığı',money(cash.gap_azn,'AZN')+' ek kaynak gerekiyor; hesaplanan senaryo bütçesi bunu karşılamıyor.','Bütçeyi, taşınma maliyetini veya senaryo varsayımlarını güncelle.','budget_azn'));
 if(cash&&typeof cash.first_negative_month==='number')out.push(alert('work-cash-negative','fail','Nakit eksiye düşüyor','Senaryo bakiyesi '+cash.first_negative_month+'. ayda negatife geçiyor.','Gider, başlangıç nakdi veya gelir başlangıç ayını gözden geçir.','monthly_expense_local'));
 if(cash===null||cash===undefined)out.push(alert('work-cash-unknown','unknown','Nakit hesabı eksik','Gerekli nakit girdileri tamamlanmadığı için hesap yapılamadı.','Kurulum maliyeti, aylık gider ve net gelir alanlarını doldur.','setup_cost_local'));
 const explanation=text(why);if(explanation)out.push(alert('work-why','info','Açıklama',explanation,'',null));
 return out;
}
function study({program={},normalized={},result={},error,conditional}={}){program=program||{};normalized=normalized||{};result=result||{};const out=[];if(error)out.push(alert('study-invalid','fail','Hesap girdisi geçersiz','Hesaplama tamamlanamadı: '+(text(error.message)||text(error)||'girdileri kontrol et.'),'Eksik veya geçersiz girdileri düzelt.','living'));
 const eligible=program.eligible;
 if(eligible===true)out.push(alert('study-academic-confirmed','info','Akademik koşul','Program verisinde akademik uygunluk açıkça doğrulanmış.','Programın kaynaklarını ve geçerli dönemi kontrol et.',null));
 else out.push(alert(eligible===false?'study-academic-fail':'study-academic-unknown',eligible===false?'fail':'unknown','Akademik uygunluk',text(program.academic_summary)||'Bu program için kişisel akademik uygunluk doğrulanmadı.','Kabul koşullarını transkript ve diploma denkliğiyle karşılaştır.','program'));
 out.push(alert('study-language-unknown','unknown','Dil koşulu',text(program.language_summary)||'Programın dil koşulu doğrulanmadı.','İstenen sınavı ve resmî puanını kontrol et.','program'));
 out.push(alert('study-funding-unknown','unknown','Finansman belgeleri',conditional?'Koşullu burs senaryosu yazılı teklif değildir. '+(text(program.funding_summary)||''):'Girilen bütçe erişilebilir, belgeli kaynak olarak doğrulanmadı. Burs zorunluluğu program ve seçilen dala bağlıdır.','Öz kaynakta banka/ödeme belgelerini; burs dalında net tutar, kapsam, süre ve ödeme takvimini doğrula.',conditional?'award':'budget'));
 const missing=Array.isArray(normalized.missing_cost_fields)?normalized.missing_cost_fields:[];
 const costLabels={tuition_first_year:'ilk yıl öğrenim ücreti',mandatory_fees_first_year:'ilk yıl zorunlu ücretleri',living_first_year:'ilk yıl yaşam maliyeti',total_first_year:'ilk yıl toplam maliyeti'};
 if(missing.length)out.push(alert('study-cost-fields','unknown','Eksik maliyet kalemleri',missing.map(k=>costLabels[k]||k).join(', ')+' eksik; toplam maliyet referansı tamamlanmamış.','Eksik ücret ve yaşam maliyeti verilerini ekle.','living'));
 if(typeof result.gap_azn==='number'&&result.gap_azn>0)out.push(alert('study-cash-gap','fail','Bütçe açığı',money(result.gap_azn,'AZN')+' ek kaynak gerekiyor.','Bütçe veya maliyet varsayımlarını güncelle.','budget'));
 if(typeof result.first_negative_month==='number')out.push(alert('study-cash-negative','fail','Nakit eksiye düşüyor','Senaryo bakiyesi '+result.first_negative_month+'. ayda negatife geçiyor.','Nakit akışını ve gelir varsayımlarını gözden geçir.','budget'));
 if(conditional)out.push(alert('study-conditional-income','info','Koşullu fon senaryosu','Bu fon varsayımsal; yazılı teklif ve sürdürülebilirlik doğrulanmış değil.','Yalnız teklif belgesi geldiğinde fonu kesin kabul et.','award'));
 return out;
}
function germany({program={},result={},inputs={},error}={}){program=program||{};result=result||{};inputs=inputs||{};const out=[];if(error)out.push(alert('germany-invalid','fail','Geçersiz senaryo','Hesaplama tamamlanamadı; girdiler geçersiz veya eksik.','Eksik veya geçersiz girdileri düzelt.','start_date'));
 if(program.eligible===true)out.push(alert('germany-academic-confirmed','info','Akademik koşul','Program verisinde akademik uygunluk açıkça doğrulanmış.','Programın geçerli dönem koşullarını kontrol et.',null));
 else if(program.eligible===false)out.push(alert('germany-academic-ineligible','fail','Akademik koşul',text(program.admission_summary)||text(program.academic_summary)||'Program verisi akademik uygunluğun sağlanmadığını gösteriyor.','Uygunluk koşulunu karşıla veya başka program seç.','program'));
 else out.push(alert('germany-academic-unknown','unknown','Akademik uygunluk',text(program.admission_summary)||text(program.academic_summary)||'Program uygunluğu bu senaryo için doğrulanmadı.','Kabul şartlarını ve diploma denkliğini kontrol et.','program'));
 out.push(alert('germany-language-unknown','unknown','Dil koşulu',text(program.language)||text(program.language_summary)||'Programın dil koşulu doğrulanmadı.','Programın resmî dil şartını ve gerekli belgeyi kontrol et.','program'));
 out.push(alert('germany-funding-unknown','unknown','Finansman belgeleri',inputs.scholarship>0?'Burs geliri senaryoya girilmiş; yazılı teklif, net tutar ve ödeme takvimi doğrulanmadı.':'Likit/bloke tutarlar senaryodur; erişilebilir kaynak ve kabul edilen finansman belgeleri doğrulanmadı. Burs almak her dalda zorunlu değildir.','Burs varsa yazılı teklifini; öz kaynakta erişilebilir bakiye, bloke kanıtı ve ödeme takvimini doğrula.',inputs.scholarship>0?'scholarship':'initial_liquid'));
 if(typeof result.additional_liquid_required==='number'&&result.additional_liquid_required>0)out.push(alert('germany-cash-gap','fail','Ek nakit gerekiyor',money(result.additional_liquid_required,'EUR')+' ek likit kaynak gerekiyor.','Başlangıç likit kaynağını veya nakit varsayımlarını güncelle.','initial_liquid'));
 if(typeof result.first_negative_month==='number')out.push(alert('germany-cash-negative','fail','Nakit eksiye düşüyor','Senaryo bakiyesi '+result.first_negative_month+'. ayda negatife geçiyor.','Giderleri veya likit kaynakları gözden geçir.','initial_liquid'));
 if(result.life_effects&&result.life_effects.overbooked===true)out.push(alert('germany-overbooked','fail','Haftalık zaman aşımı','Girilen ders, çalışma ve yaşam saatleri haftalık kapasiteyi aşıyor.','Haftalık saat varsayımlarını azalt veya programı yeniden düzenle.','study_hours'));
 const conditionalFields=['student_hours','work_net','scholarship'];const active=conditionalFields.filter(k=>typeof inputs[k]==='number'&&inputs[k]>0);
 if(active.length)out.push(alert('germany-conditional-income','info','Koşullu gelir varsayımı','Girilen '+active.join(', ')+' geliri varsayımsaldır; gerçekleşmesi doğrulanmadı.','Bu geliri kesin kaynak saymadan finansman teklifini doğrula.',active[0]));
 return out;
}
const api={work,study,germany};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.HorizonAlertsModel=api;
})(typeof window!=='undefined'?window:globalThis);
