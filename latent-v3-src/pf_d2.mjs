import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
for (const [name, opts, n] of [['d',{viewport:{width:1440,height:900}},12],['m',{...devices['iPhone 13']},8]]){
  const pg = await (await b.newContext(opts)).newPage(); const errs=[]; pg.on('pageerror', e=>errs.push(e.message.slice(0,200)));
  await pg.goto('http://127.0.0.1:8094/', {waitUntil:'load'}); await pg.waitForTimeout(800);
  const info = await pg.evaluate(()=>{ const w=document.querySelector('#work'); return {t:w.getBoundingClientRect().top+scrollY, h:w.offsetHeight}; });
  let y = info.t - 400; await pg.evaluate(y=>scrollTo(0,y),y);
  for(let i=0;i<n;i++){ const target = info.t-innerH(0)+ (info.h)*(i/(n-1)); while(y < target){ y=Math.min(target,y+160); await pg.evaluate(y=>scrollTo(0,y),y); await pg.waitForTimeout(35); } await pg.waitForTimeout(1300); await pg.screenshot({path:`pf2_${name}_${i}.png`}); }
  function innerH(){ return 0; }
  console.log(name,'errors',errs); await pg.close();
}
await b.close();
