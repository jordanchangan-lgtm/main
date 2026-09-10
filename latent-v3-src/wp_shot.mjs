import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
for (const [name, opts, n] of [['d',{viewport:{width:1440,height:900}},14],['m',{...devices['iPhone 13']},10]]){
  const pg = await (await b.newContext(opts)).newPage(); const errs=[]; pg.on('pageerror', e=>errs.push(e.message.slice(0,200)));
  await pg.goto('http://127.0.0.1:8094/', {waitUntil:'load'}); await pg.waitForTimeout(800);
  const info = await pg.evaluate(()=>{ const s=document.querySelector('#how'); return {t:s.getBoundingClientRect().top+scrollY-innerHeight*.5, z:s.getBoundingClientRect().top+scrollY+s.offsetHeight-innerHeight}; });
  let y=info.t-400, k=0; await pg.evaluate(v=>scrollTo(0,v),y);
  for(let i=0;i<n;i++){ const t=info.t+(info.z-info.t)*(i/(n-1)); while(y<t){ y=Math.min(t,y+160); await pg.evaluate(v=>scrollTo(0,v),y); await pg.waitForTimeout(10);} await pg.waitForTimeout(200); await pg.screenshot({path:`wp_${name}_${k++}.png`}); }
  const wide = await pg.evaluate(()=>[...document.querySelectorAll('#how *')].filter(e=>{const r=e.getBoundingClientRect(); return r.width>0 && (r.left<-2||r.right>innerWidth+2);}).length);
  console.log(name,'errors',errs,'wide',wide); await pg.close();
}
await b.close();
