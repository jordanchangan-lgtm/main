import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
for (const [name, opts] of [['d',{viewport:{width:1440,height:900}}],['m',{...devices['iPhone 13']}]]){
  const pg = await (await b.newContext(opts)).newPage(); const errs=[]; pg.on('pageerror', e=>errs.push(e.message.slice(0,200)));
  await pg.goto('http://127.0.0.1:8094/', {waitUntil:'load'}); await pg.waitForTimeout(800);
  let k=0, y=0;
  async function walk(sel, fr, wait){ const info = await pg.evaluate(s=>{ const e=document.querySelector(s); return {t:e.getBoundingClientRect().top+scrollY, h:e.offsetHeight}; }, sel);
    for(const f of fr){ const t=info.t-innerH()*.5+(info.h)*f; if(t<y){ y=t-800; await pg.evaluate(v=>scrollTo(0,v),y);} while(y<t){ y=Math.min(t,y+170); await pg.evaluate(v=>scrollTo(0,v),y); await pg.waitForTimeout(10);} await pg.waitForTimeout(wait); await pg.screenshot({path:`three_${name}_${k++}.png`}); } }
  function innerH(){ return name==='d'?900:844; }
  await walk('#work',[0.03,0.1,0.18,0.3,0.45,0.6,0.8,0.95],700);
  await walk('#process',[0.15,0.35,0.55,0.75],700);
  await walk('#prices',[0.12,0.3],1400);
  const wide = await pg.evaluate(()=>[...document.querySelectorAll('#work *, #process *, #prices *')].filter(e=>{const r=e.getBoundingClientRect(); return r.width>0 && (r.left<-2||r.right>innerWidth+2);}).length);
  console.log(name,'errors',errs,'wide',wide,'shots',k); await pg.close();
}
await b.close();
