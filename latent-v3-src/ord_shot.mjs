import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
for (const [name, opts] of [['d',{viewport:{width:1440,height:900}}],['m',{...devices['iPhone 13']}]]){
  const pg = await (await b.newContext(opts)).newPage(); const errs=[]; pg.on('pageerror', e=>errs.push(e.message.slice(0,200)));
  await pg.goto('http://127.0.0.1:8094/', {waitUntil:'load'}); await pg.waitForTimeout(800);
  const info = await pg.evaluate(()=>{ const h=document.querySelector('#how'), w=document.querySelector('#work'); return {a:h.getBoundingClientRect().top+scrollY+h.offsetHeight-innerHeight*1.3, z:w.getBoundingClientRect().top+scrollY+innerHeight*.6}; });
  let y=info.a-300, k=0; await pg.evaluate(v=>scrollTo(0,v),y);
  for(let i=0;i<10;i++){ const t=info.a+(info.z-info.a)*(i/9); while(y<t){ y=Math.min(t,y+160); await pg.evaluate(v=>scrollTo(0,v),y); await pg.waitForTimeout(10);} await pg.waitForTimeout(900); await pg.screenshot({path:`ord_${name}_${k++}.png`}); }
  console.log(name,'errors',errs); await pg.close();
}
await b.close();
