import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
for (const [name, opts] of [['d',{viewport:{width:1440,height:900}}],['m',{...devices['iPhone 13']}]]){
  const pg = await (await b.newContext(opts)).newPage(); const errs=[]; pg.on('pageerror', e=>errs.push(e.message.slice(0,200)));
  await pg.goto('http://127.0.0.1:8094/', {waitUntil:'load'}); await pg.waitForTimeout(800);
  const holds = await pg.evaluate(()=>[...document.querySelectorAll('.js-hr')].slice(0,3).map(h=>({t:h.getBoundingClientRect().top+scrollY,h:h.offsetHeight})));
  let k=0;
  for(const [hi,h] of holds.entries()){ for(const f of [0,.25,.5,.75,1]){ await pg.evaluate(([t,h,f])=>scrollTo(0,t+(h-innerHeight)*f),[h.t,h.h,f]); await pg.waitForTimeout(500); await pg.screenshot({path:`hr_${name}_${k++}.png`}); } }
  const wide = await pg.evaluate(()=>[...document.querySelectorAll('.hr-label *')].filter(e=>{const r=e.getBoundingClientRect(); return r.width>0 && (r.left<-2||r.right>innerWidth+2);}).length);
  console.log(name,'errors',errs,'labelwide',wide); await pg.close();
}
await b.close();
