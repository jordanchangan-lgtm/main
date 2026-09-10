import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
for (const [name, opts] of [['d',{viewport:{width:1440,height:900}}],['m',{...devices['iPhone 13']}]]){
  const pg = await (await b.newContext(opts)).newPage();
  await pg.goto('http://127.0.0.1:8094/', {waitUntil:'load'}); await pg.waitForTimeout(800);
  const ih = name==='d'?900:844; let k=0, y=0;
  async function at(sel, f, wait){ const info = await pg.evaluate(s=>{ const e=document.querySelector(s); return {t:e.getBoundingClientRect().top+scrollY, h:e.offsetHeight}; }, sel);
    const t=info.t+(info.h-ih)*f; if(t<y){ y=t-800; await pg.evaluate(v=>scrollTo(0,v),y);} while(y<t){ y=Math.min(t,y+170); await pg.evaluate(v=>scrollTo(0,v),y); await pg.waitForTimeout(10);} await pg.waitForTimeout(wait); await pg.screenshot({path:`pk_${name}_${k++}.png`}); }
  await at('#work',0.55,800); await at('#work',0.97,800);
  await at('#process',0.15,600); await at('#process',0.40,600); await at('#process',0.9,600);
  await pg.close();
}
await b.close();
