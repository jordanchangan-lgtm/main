import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
for (const [name, opts] of [['d',{viewport:{width:1440,height:900}}],['m',{...devices['iPhone 13']}]]){
  const pg = await (await b.newContext(opts)).newPage(); const errs=[]; pg.on('pageerror', e=>errs.push(e.message.slice(0,200)));
  await pg.goto('http://127.0.0.1:8094/', {waitUntil:'load'}); await pg.waitForTimeout(800);
  const tops = await pg.evaluate(()=>[...document.querySelectorAll('.wp-img')].map(e=>e.getBoundingClientRect().top+scrollY));
  let y=tops[0]-1200, k=0; await pg.evaluate(v=>scrollTo(0,v),y);
  for(const t0 of tops){ for(const off of [innerH()*.62, innerH()*.42, innerH()*.2]){ const t=t0-off; while(y<t){ y=Math.min(t,y+160); await pg.evaluate(v=>scrollTo(0,v),y); await pg.waitForTimeout(10);} await pg.waitForTimeout(off===innerH()*.2?1700:250); await pg.screenshot({path:`wp2_${name}_${k++}.png`}); } }
  function innerH(){ return name==='d'?900:844; }
  const wide = await pg.evaluate(()=>[...document.querySelectorAll('#how *')].filter(e=>{const r=e.getBoundingClientRect(); return r.width>0 && (r.left<-2||r.right>innerWidth+2) && !e.closest('.an');}).length);
  console.log(name,'errors',errs,'wide',wide); await pg.close();
}
await b.close();
