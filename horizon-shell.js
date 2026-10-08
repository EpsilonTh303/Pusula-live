/* One header, navigation and preference controller for every Horizon view. */
(() => {
 const params=new URLSearchParams(location.search),germany=!!document.querySelector('.dashboard');
 const oldTheme=document.querySelector('#theme'),oldLanguage=document.querySelector('#language'),oldNav=document.querySelector('nav'),alerts=document.querySelector('#alerts-tab');
 const header=document.createElement('header');header.id='horizon-header';header.className='horizon-header';
 const row=document.createElement('div');row.className='horizon-masthead';
 const brand=document.createElement('a');brand.className='horizon-brand brand';brand.href='germany.html';brand.innerHTML='<svg class="brand-icon" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="14"/><ellipse cx="20" cy="20" rx="18" ry="7" transform="rotate(-35 20 20)"/><circle class="brand-node" cx="30" cy="10" r="3"/></svg><span class="brand-stack"><span>HORIZON</span><small aria-hidden="true">FLIGHT DECK · 01</small></span>';
 const controls=document.createElement('div');controls.className='horizon-preferences';
 function control(text,id,existing){const label=document.createElement('label'),caption=document.createElement('span');caption.textContent=text;const select=existing||document.createElement('select');select.id=id;label.append(caption,select);controls.append(label);return select;}
 const theme=control('Tema','theme',oldTheme),language=control('Dil','language',oldLanguage);
 if(!oldTheme)for(const item of Object.values(THEMES)){const option=document.createElement('option');option.value=item.id;option.textContent=item.label.tr;theme.append(option);}
 if(!oldLanguage)for(const[value,text]of [['tr','Türkçe'],['en','English']]){const option=document.createElement('option');option.value=value;option.textContent=text;language.append(option);}
 const settings=document.createElement('dialog');settings.id='horizon-settings';settings.className='horizon-settings';settings.setAttribute('aria-labelledby','settings-title');
 const settingsHeading=document.createElement('header'),settingsTitle=document.createElement('h2');settingsTitle.id='settings-title';
 const close=document.createElement('button');close.id='settings-close';close.type='button';close.textContent='×';close.addEventListener('click',()=>settings.close());settingsHeading.append(settingsTitle,close);settings.append(settingsHeading,controls);document.body.append(settings);
 const settingsToggle=document.createElement('button');settingsToggle.id='settings-toggle';settingsToggle.className='settings-toggle';settingsToggle.type='button';settingsToggle.setAttribute('aria-haspopup','dialog');settingsToggle.setAttribute('aria-controls',settings.id);settingsToggle.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M9 3h6l1 3 3 1 2 5-2 5-3 1-1 3H9l-1-3-3-1-2-5 2-5 3-1Z"/><circle cx="12" cy="12" r="3.5"/></svg>';
 settingsToggle.addEventListener('click',()=>{settings.showModal();theme.focus();});settings.addEventListener('close',()=>settingsToggle.focus());
 row.append(brand,settingsToggle);header.append(row);
 const nav=document.createElement('nav');nav.className='horizon-nav';nav.setAttribute('aria-label','Ana gezinme');
 const route=new URL(location.href).pathname.split('/').pop()||'index.html';
 const mission=germany?'germany.html':route;
 const otherRoutes=document.documentElement.dataset.publicSite==='true'?'routes.html':'index.html';
 for(const[href,text]of [['germany.html','Almanya · Master'],['work.html','Doğrudan iş / göç'],['pusula.html','Altı ülke'],['lab.html','Kariyer deneyleri'],['docs.html','Belgeler'],[otherRoutes,'Diğer yollar']]){
  const a=document.createElement('a');a.dataset.channel=String(nav.children.length+1).padStart(2,'0');a.href=href;a.textContent=text;const channel=document.createElement('span');channel.className='nav-channel';channel.setAttribute('aria-hidden','true');channel.textContent=a.dataset.channel;a.prepend(channel);if(href===mission){a.setAttribute('aria-current','page');a.className='active';}nav.append(a);
 }
 if(alerts)nav.append(alerts);header.append(nav);document.body.prepend(header);
 oldNav?.remove();document.querySelector('.masthead')?.remove();
 const docsHeader=document.querySelector('main>header');if(route==='docs.html')docsHeader?.remove();else docsHeader?.classList.add('page-intro');
 document.documentElement.dataset.horizonPage=germany?'germany':route.replace('.html','');
 function links(){for(const a of document.querySelectorAll('a[href]')){const raw=a.getAttribute('href');if(raw.startsWith('#'))continue;const url=new URL(raw,location.href);if(url.origin===location.origin&&url.pathname.endsWith('.html')){url.searchParams.set('theme',theme.value);url.searchParams.set('lang',language.value);a.href=url.href;}}}
 function preferences(){
  const selected=THEMES[theme.value]||THEMES.mission;theme.value=selected.id;document.documentElement.dataset.horizonTheme=selected.id;
  const english=language.value==='en';settingsTitle.textContent=english?'Settings':'Ayarlar';settingsToggle.setAttribute('aria-label',english?'Settings':'Ayarlar');settingsToggle.title=english?'Theme and language settings':'Tema ve dil ayarları';close.setAttribute('aria-label',english?'Close settings':'Ayarları kapat');
  brand.querySelector('small').textContent=selected.id==='mission'?'FLIGHT DECK · 01':(english?'SCENARIO PLANNER':'SENARYO PLANLAYICI');
  document.documentElement.style.colorScheme=selected.id==='horizon'?'light':'dark';
  if(!oldTheme){for(const[key,value]of Object.entries(selected.tokens))document.documentElement.style.setProperty(key,value);for(const[key,value]of Object.entries(selected.fonts))document.documentElement.style.setProperty('--font-'+key,value);for(const[key,value]of Object.entries(selected.chart))document.documentElement.style.setProperty('--chart-'+key,value);}
  for(const[key,value]of [['--card',selected.tokens['--panel']],['--fg',selected.tokens['--text']],['--line',selected.tokens['--grid']]])document.documentElement.style.setProperty(key,value);
  const url=new URL(location.href);url.searchParams.set('theme',selected.id);url.searchParams.set('lang',language.value);history.replaceState(null,'',url);
  if(!oldTheme)for(const option of theme.options)option.textContent=THEMES[option.value].label[language.value];
  window.HorizonI18n.setLanguage(language.value);links();document.dispatchEvent(new CustomEvent('horizon:preferences',{detail:{theme:theme.value,language:language.value}}));
 }
 window.HorizonShell={refreshLinks:links};theme.value=THEMES[params.get('theme')]?params.get('theme'):'mission';language.value=params.get('lang')==='en'?'en':'tr';
 theme.addEventListener('change',preferences);language.addEventListener('change',preferences);preferences();
 document.documentElement.classList.remove('horizon-initializing');
})();
