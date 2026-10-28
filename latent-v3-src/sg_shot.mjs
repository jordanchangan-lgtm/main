import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
for (const [name, opts] of [['d',{viewport:{width:1440,height:900}}],['m',{...devices['iPhone 13']}]]){
  const pg = await (await b.newContext(opts)).newPage(); const errs=[]; pg.on('pageerror', e=>errs.push(e.message.slice(0,200)));
  await pg.goto('http://127.0.0.1:8095/', {waitUntil:'load'}); await pg.waitForTimeout(500);
  await pg.addStyleTag({content:'html{scroll-behavior:auto!important}'}); let k=0;
  const info = await pg.evaluate(()=>{ const e=document.querySelector('.js-sg-hold'); return {t:e.getBoundingClientRect().top+scrollY, h:e.offsetHeight}; });
  for(const f of [0.0,0.14,0.22,0.3,0.5,0.75,0.98]){ await pg.evaluate(o=>scrollTo(0,o.t+(o.h-innerHeight)*o.f), {...info,f}); await pg.waitForTimeout(700); await pg.screenshot({path:`sg_${name}_${k++}.png`}); }
  console.log(name,'errors',errs, await pg.evaluate(()=>JSON.stringify({H:Math.round(document.querySelector('.js-sg-hold').offsetHeight/innerHeight*10)/10, title:document.querySelector('.js-sg-title').textContent, href:document.querySelector('.js-sg-link').getAttribute('href'), count:document.querySelector('.js-sg-count').textContent}))); await pg.close();
}
await b.close();
