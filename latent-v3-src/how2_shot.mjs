import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
for (const [name, opts, n] of [['d',{viewport:{width:1440,height:900}},12],['m',{...devices['iPhone 13']},8]]){
  const pg = await (await b.newContext(opts)).newPage(); const errs=[]; pg.on('pageerror', e=>errs.push(e.message.slice(0,200)));
  await pg.goto('http://127.0.0.1:8094/', {waitUntil:'load'}); await pg.waitForTimeout(800);
  const info = await pg.evaluate(()=>{ const s=document.querySelector('#studio'), w=document.querySelector('#work'); return {t:s.getBoundingClientRect().top+scrollY+s.offsetHeight-innerHeight*1.2, z:w.getBoundingClientRect().top+scrollY+innerHeight*.6}; });
  let y = info.t-300; await pg.evaluate(y=>scrollTo(0,y),y);
  for(let i=0;i<n;i++){ const target = info.t+(info.z-info.t)*(i/(n-1)); while(y < target){ y=Math.min(target,y+160); await pg.evaluate(y=>scrollTo(0,y),y); await pg.waitForTimeout(30); } await pg.waitForTimeout(1300); await pg.screenshot({path:`how2_${name}_${i}.png`}); }
  const wide = await pg.evaluate(()=>[...document.querySelectorAll('#how *')].filter(e=>{const r=e.getBoundingClientRect(); return r.width>0 && (r.left<-2||r.right>innerWidth+2) && !e.closest('.st2-bg');}).length);
  console.log(name,'errors',errs,'wide',wide); await pg.close();
}
await b.close();
