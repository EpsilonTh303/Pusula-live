/* Apply the requested theme before CSS and content can paint. No stored profile. */
(() => {
 const root=document.documentElement,params=new URLSearchParams(location.search);
 const theme=THEMES[params.get('theme')]||THEMES.mission;
 root.lang=params.get('lang')==='en'?'en':'tr';root.dataset.horizonTheme=theme.id;
 root.style.colorScheme=theme.id==='horizon'?'light':'dark';root.style.backgroundColor='var(--bg)';
 for(const[key,value]of Object.entries(theme.tokens))root.style.setProperty(key,value);
 for(const[key,value]of Object.entries(theme.fonts))root.style.setProperty('--font-'+key,value);
 for(const[key,value]of Object.entries(theme.chart))root.style.setProperty('--chart-'+key,value);
 for(const[key,value]of [['--card',theme.tokens['--panel']],['--fg',theme.tokens['--text']],['--line',theme.tokens['--grid']]])root.style.setProperty(key,value);
 root.classList.add('horizon-initializing');
 // Reveal the complete shell together. If a later script fails, show the fallback page.
 document.addEventListener('DOMContentLoaded',()=>root.classList.remove('horizon-initializing'),{once:true});
})();
