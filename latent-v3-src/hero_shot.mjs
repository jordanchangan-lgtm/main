import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
for (const [name, opts] of [['d',{viewport:{width:1440,height:900}}],['m',{...devices['iPhone 13']}]]){
  const pg = await (await b.newContext(opts)).newPage(); const errs=[]; pg.on('pageerror', e=>errs.push(e.message.slice(0,200)));
  await pg.goto('http://127.0.0.1:8094/', {waitUntil:'load'}); await pg.waitForTimeout(1600); let k=0;
  const run = await pg.evaluate(()=>{ const h=document.querySelector('.js-lk'); return h.offsetHeight-innerHeight; });
  for(const f of [0.12,0.3,0.5,0.75]){ await pg.evaluate(v=>scrollTo(0,v), run*f); await pg.waitForTimeout(f===0.12?250:900); await pg.screenshot({path:`hero_${name}_${k++}.png`}); }
  const st = await pg.evaluate(()=>({run:document.querySelector('.js-lk').offsetHeight-innerHeight, in:document.querySelectorAll('.hero .js-pu2.in').length, tr:[...document.querySelectorAll('.hero .hm-in')].slice(0,3).map(e=>getComputedStyle(e).transform)}));
  console.log(name,'errors',errs,JSON.stringify(st)); await pg.close();
}
await b.close();
