import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
for (const [name, opts] of [['d',{viewport:{width:1440,height:900}}],['m',{...devices['iPhone 13']}]]){
  const pg = await (await b.newContext(opts)).newPage(); const errs=[]; pg.on('pageerror', e=>errs.push(e.message.slice(0,200)));
  await pg.goto('http://127.0.0.1:8094/', {waitUntil:'load'}); await pg.waitForTimeout(800);
  const info = await pg.evaluate(()=>{ const e=document.querySelector('#prices'); return {t:e.getBoundingClientRect().top+scrollY, h:e.offsetHeight}; });
  let y=info.t-1200, k=0; await pg.evaluate(v=>scrollTo(0,v),y);
  for(const f of [-0.3,0.05,0.3,0.55,0.8]){ const t=info.t+info.h*f; while(y<t){ y=Math.min(t,y+170); await pg.evaluate(v=>scrollTo(0,v),y); await pg.waitForTimeout(10);} await pg.waitForTimeout(900); await pg.screenshot({path:`pz_${name}_${k++}.png`}); }
  const href = await pg.getAttribute('.pz-go','href'); console.log(name,'errors',errs,'mail', decodeURIComponent(href).slice(0,120).replace(/\n/g,' | ')); await pg.close();
}
await b.close();
