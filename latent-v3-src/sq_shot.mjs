import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
for (const [name, opts] of [['d',{viewport:{width:1440,height:900}}],['m',{...devices['iPhone 13']}]]){
  const pg = await (await b.newContext(opts)).newPage(); const errs=[]; pg.on('pageerror', e=>errs.push(e.message.slice(0,200)));
  await pg.goto('http://127.0.0.1:8094/', {waitUntil:'load'}); await pg.waitForTimeout(800);
  const info = await pg.evaluate(()=>{ const h=document.querySelector('.js-sq-hold'); return {t:h.getBoundingClientRect().top+scrollY, run:h.offsetHeight-innerHeight}; });
  let y=info.t-500, k=0; await pg.evaluate(v=>scrollTo(0,v),y);
  const fr=[-0.08, 0.02, 0.07, 0.12, 0.165, 0.19, 0.24, 0.30, 0.33, 0.5, 0.66, 0.83, 0.995, 1.05];
  for(const f of fr){ const t=info.t+info.run*f; while(y<t){ y=Math.min(t,y+140); await pg.evaluate(v=>scrollTo(0,v),y); await pg.waitForTimeout(10);} await pg.waitForTimeout(250); await pg.screenshot({path:`sq_${name}_${k++}.png`}); }
  const wide = await pg.evaluate(()=>[...document.querySelectorAll('.sq-step.on *')].filter(e=>{const r=e.getBoundingClientRect(); return r.width>0 && (r.left<-2||r.right>innerWidth+2);}).length);
  console.log(name,'errors',errs,'wide',wide); await pg.close();
}
await b.close();
