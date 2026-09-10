import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
for (const [name, opts] of [['d',{viewport:{width:1440,height:900}}],['m',{...devices['iPhone 13']}]]){
  const pg = await (await b.newContext(opts)).newPage(); const errs=[]; pg.on('pageerror', e=>errs.push(e.message.slice(0,200)));
  await pg.goto('http://127.0.0.1:8094/', {waitUntil:'load'}); await pg.waitForTimeout(800);
  let k=0, y=0; function innerH(){ return name==='d'?900:844; }
  async function walk(sel, fr, wait){ const info = await pg.evaluate(s=>{ const e=document.querySelector(s); return {t:e.getBoundingClientRect().top+scrollY, h:e.offsetHeight}; }, sel);
    for(const f of fr){ const t=info.t-innerH()*.4+(info.h)*f; if(t<y){ y=t-800; await pg.evaluate(v=>scrollTo(0,v),y);} while(y<t){ y=Math.min(t,y+170); await pg.evaluate(v=>scrollTo(0,v),y); await pg.waitForTimeout(10);} await pg.waitForTimeout(wait); await pg.screenshot({path:`four_${name}_${k++}.png`}); } }
  await walk('#work',[0.05],900);
  await walk('#process',[0.05,0.25,0.45,0.65,0.85],900);
  await walk('#prices',[0.08],900);
  if(name==='d'){ const r = await pg.$('.pl-row:nth-child(3)'); const bb = await r.boundingBox(); await pg.mouse.move(bb.x+300, bb.y+bb.height/2); await pg.waitForTimeout(700); await pg.screenshot({path:`four_${name}_${k++}.png`}); }
  const wide = await pg.evaluate(()=>[...document.querySelectorAll('#process *, #prices *')].filter(e=>{const r=e.getBoundingClientRect(); return r.width>0 && (r.left<-2||r.right>innerWidth+2);}).length);
  console.log(name,'errors',errs,'wide',wide,'shots',k); await pg.close();
}
await b.close();
