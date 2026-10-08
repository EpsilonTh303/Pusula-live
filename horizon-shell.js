/* Shared navigation and theme adapter; no financial state or persistent storage. */
(() => {
  const params = new URLSearchParams(location.search);
  const ownSelector = document.querySelector('#theme');
  function carryLinks(theme) {
    document.querySelectorAll('a[href]').forEach(a => {
      const url = new URL(a.getAttribute('href'), location.href);
      if (url.origin === location.origin && url.pathname.endsWith('.html')) {
        url.searchParams.set('theme', theme);
        if (params.has('lang')) url.searchParams.set('lang', document.documentElement.lang);
        a.href = url.href;
      }
    });
  }
  function apply(id) {
    const theme = THEMES[id] || THEMES.mission;
    document.documentElement.dataset.horizonTheme = theme.id;
    if (!ownSelector) {
      Object.entries(theme.tokens).forEach(([key,value]) => document.documentElement.style.setProperty(key,value));
      document.documentElement.style.setProperty('--card',theme.tokens['--panel']);
      document.documentElement.style.setProperty('--fg',theme.tokens['--text']);
      document.documentElement.style.setProperty('--line',theme.tokens['--grid']);
      document.documentElement.style.colorScheme = theme.id === 'horizon' ? 'light' : 'dark';
    }
    carryLinks(theme.id);
    return theme.id;
  }
  const nav = document.querySelector('nav');
  if (nav && !ownSelector) {
    for (const [href,label] of [['germany.html','Almanya ayrıntısı'],['work.html','Doğrudan iş'],['pusula.html','Altı ülke'],['lab.html','Kariyer deneyleri']]) {
      if (!Array.from(nav.querySelectorAll('a')).some(a=>new URL(a.href).pathname.endsWith('/'+href))) {
        const a=document.createElement('a');a.href=href;a.textContent=label;nav.append(a);
      }
    }
  }
  if (nav && !nav.querySelector('[href^="docs.html"]')) {
    const a = document.createElement('a'); a.href='docs.html'; a.textContent=document.documentElement.lang === 'en' ? 'Documents' : 'Belgeler'; nav.append(a);
  }
  if (ownSelector) {
    apply(ownSelector.value || params.get('theme'));
    ownSelector.addEventListener('change',() => apply(ownSelector.value));
    document.querySelector('#language')?.addEventListener('change',() => {
      const a = nav?.querySelector('a[href*="docs.html"]');
      if(a) a.textContent=document.documentElement.lang==='en'?'Documents':'Belgeler';
      carryLinks(ownSelector.value);
    });
  } else {
    const label = document.createElement('label'); label.className='horizon-theme-picker';label.textContent='Görünüm / Theme';
    const select=document.createElement('select');select.id='horizon-theme';
    Object.values(THEMES).forEach(theme=>{const option=document.createElement('option');option.value=theme.id;option.textContent=theme.label.tr;select.append(option);});
    label.append(select);(document.querySelector('header')||document.querySelector('main'))?.prepend(label);
    select.value=apply(params.get('theme'));
    select.addEventListener('change',()=>{const id=apply(select.value);const url=new URL(location.href);url.searchParams.set('theme',id);history.replaceState(null,'',url);});
  }
})();
