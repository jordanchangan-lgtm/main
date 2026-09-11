import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
for (const [name, opts] of [['d',{viewport:{width:1440,height:900}}],['m',{...devices['iPhone 13']}]]){
  const pg = await (await b.newContext(opts)).newPage(); const errs=[]; pg.on('pageerror', e=>errs.push(e.message.slice(0,200)));
  await pg.goto('http://127.0.0.1:8095/', {waitUntil:'load'}); await pg.waitForTimeout(500);
  await pg.addStyleTag({content:'html{scroll-behavior:auto!important}'}); let k=0;
  for(const [id,f] of [['how-intro',0.2],['how-intro',0.6],['prices',0.08],['prices',0.22]]){ const info = await pg.evaluate(i=>{ const e=document.getElementById(i); return {t:e.getBoundingClientRect().top+scrollY, h:e.offsetHeight}; }, id);
    await pg.evaluate(o=>scrollTo(0,o.t+o.h*o.f-innerHeight*0.45), {...info,f}); await pg.waitForTimeout(700); await pg.screenshot({path:`hi_${name}_${k++}.png`}); }
  console.log(name,'errors',errs, await pg.evaluate(()=>document.querySelectorAll('#how-intro .cw, #prices .cw').length)); await pg.close();
}
await b.close();
