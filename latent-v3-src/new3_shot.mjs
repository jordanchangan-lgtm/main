import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
for (const [name, opts] of [['d',{viewport:{width:1440,height:900}}],['m',{...devices['iPhone 13']}]]){
  const pg = await (await b.newContext(opts)).newPage(); const errs=[]; pg.on('pageerror', e=>errs.push(e.message.slice(0,200)));
  await pg.goto('http://127.0.0.1:8094/', {waitUntil:'load'}); await pg.waitForTimeout(800);
  let k=0, y=0; const ih = name==='d'?900:844;
  async function walk(sel, fr, wait){ const info = await pg.evaluate(s=>{ const e=document.querySelector(s); return {t:e.getBoundingClientRect().top+scrollY, h:e.offsetHeight}; }, sel);
    for(const f of fr){ const t=info.t+(info.h-ih)*f; if(t<y){ y=t-800; await pg.evaluate(v=>scrollTo(0,v),y);} while(y<t){ y=Math.min(t,y+170); await pg.evaluate(v=>scrollTo(0,v),y); await pg.waitForTimeout(10);} await pg.waitForTimeout(wait); await pg.screenshot({path:`n3_${name}_${k++}.png`}); } }
  await walk('#work',[0.02,0.2,0.45,0.7,0.95],700);
  await walk('#process',[0.02,0.12,0.22,0.36,0.5,0.62,0.8,0.97],700);
  await walk('#prices',[0.0,0.15,0.3,0.5,0.7,0.9],700);
  const info = await pg.evaluate(()=>{ const q=s=>document.querySelector(s); return { work:q('#work').offsetHeight, proc:q('#process').offsetHeight, pr:q('#prices').offsetHeight, href:q('.gs-line')?.getAttribute('href'), wide:[...document.querySelectorAll('#work *, #process *, #prices *')].filter(e=>{const r=e.getBoundingClientRect(); return r.width>0 && (r.left<-2||r.right>innerWidth+2);}).map(e=>e.className).slice(0,8) }; });
  console.log(name,'errors',errs,JSON.stringify(info),'shots',k); await pg.close();
}
await b.close();
