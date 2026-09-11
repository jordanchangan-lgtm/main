import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
for (const [name, opts] of [['d',{viewport:{width:1440,height:900}}],['m',{...devices['iPhone 13']}]]){
  const pg = await (await b.newContext(opts)).newPage(); const errs=[]; pg.on('pageerror', e=>errs.push(e.message.slice(0,200)));
  await pg.goto('http://127.0.0.1:8095/', {waitUntil:'load'}); await pg.waitForTimeout(500);
  await pg.addStyleTag({content:'html{scroll-behavior:auto!important}'}); let k=0;
  for(const [id,f] of [['method',0.5],['work',0.45],['process',0.04],['process',0.12]]){ const info = await pg.evaluate(i=>{ const e=document.getElementById(i); return {t:e.getBoundingClientRect().top+scrollY, h:e.offsetHeight}; }, id);
    await pg.evaluate(o=>scrollTo(0,o.t+(o.h-innerHeight)*o.f), {...info,f}); await pg.waitForTimeout(1200); await pg.screenshot({path:`kb_${name}_${k++}.png`}); }
  console.log(name,'errors',errs); await pg.close();
}
await b.close();
