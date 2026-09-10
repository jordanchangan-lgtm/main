import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
for (const [name, opts] of [['d',{viewport:{width:1440,height:900}}],['m',{...devices['iPhone 13']}]]){
  const pg = await (await b.newContext(opts)).newPage(); const errs=[]; pg.on('pageerror', e=>errs.push(e.message.slice(0,200)));
  await pg.goto('http://127.0.0.1:8094/', {waitUntil:'load'}); await pg.waitForTimeout(800);
  const info = await pg.evaluate(()=>{ const h=document.querySelector('.js-tr-hold'); return {t:h.getBoundingClientRect().top+scrollY, h:h.offsetHeight}; });
  let y=info.t-600, k=0; await pg.evaluate(v=>scrollTo(0,v),y);
  for(const f of [-0.3,0,.1,.2,.3,.42,.5,.62,.8,1,1.1]){ const t=info.t+(info.h-innerH())*f; while(y<t){ y=Math.min(t,y+150); await pg.evaluate(v=>scrollTo(0,v),y); await pg.waitForTimeout(12);} await pg.waitForTimeout(f===.1||f===.42?120:900); await pg.screenshot({path:`tr_${name}_${k++}.png`}); }
  function innerH(){ return name==='d'?900:844; }
  const wide = await pg.evaluate(()=>[...document.querySelectorAll('.tr-right *')].filter(e=>{const r=e.getBoundingClientRect(); return r.width>0 && (r.left<-2||r.right>innerWidth+2);}).length);
  console.log(name,'errors',errs,'wide',wide); await pg.close();
}
await b.close();
