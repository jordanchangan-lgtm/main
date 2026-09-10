import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
for (const [name, opts] of [['d',{viewport:{width:1440,height:900}}],['m',{...devices['iPhone 13']}]]){
  const pg = await (await b.newContext(opts)).newPage(); const errs=[]; pg.on('pageerror', e=>errs.push(e.message.slice(0,200)));
  await pg.goto('http://127.0.0.1:8094/', {waitUntil:'load'}); await pg.waitForTimeout(800);
  const ih = name==='d'?900:844; let k=0, y=0;
  const info = await pg.evaluate(()=>{ const e=document.querySelector('#process'); return {t:e.getBoundingClientRect().top+scrollY, h:e.offsetHeight}; });
  for(const f of [0.02,0.1,0.18,0.26,0.34,0.42,0.5,0.58,0.66,0.74,0.82,0.9]){ const t=info.t+(info.h-ih)*f; while(y<t){ y=Math.min(t,y+170); await pg.evaluate(v=>scrollTo(0,v),y); await pg.waitForTimeout(10);} await pg.waitForTimeout(500); await pg.screenshot({path:`gp_${name}_${k++}.png`}); }
  const wide = await pg.evaluate(()=>[...document.querySelectorAll('#process .gp-row')].filter(e=>{const r=e.getBoundingClientRect(); return r.width>0 && (r.left<-2||r.right>innerWidth+2);}).length);
  console.log(name,'errors',errs,'procH',info.h,'wide',wide); await pg.close();
}
await b.close();
