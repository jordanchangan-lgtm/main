import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
for (const [name, opts] of [['d',{viewport:{width:1440,height:900}}],['w',{viewport:{width:1880,height:868}}],['m',{...devices['iPhone 13']}]]){
  const pg = await (await b.newContext(opts)).newPage(); const errs=[]; pg.on('pageerror', e=>errs.push(e.message.slice(0,200)));
  await pg.goto('http://127.0.0.1:8095/', {waitUntil:'load'}); await pg.waitForTimeout(500);
  await pg.addStyleTag({content:'html{scroll-behavior:auto!important}'}); let k=0;
  const info = await pg.evaluate(()=>{ const e=document.querySelector('#how'); return {t:e.getBoundingClientRect().top+scrollY, h:e.offsetHeight}; });
  for(const f of [0.05,0.3,0.55,0.8]){ await pg.evaluate(o=>scrollTo(0,o.t+(o.h-innerHeight)*o.f), {...info,f}); await pg.waitForTimeout(900); await pg.screenshot({path:`sc_${name}_${k++}.png`}); }
  const wk = await pg.evaluate(()=>{ const e=document.querySelector('#work'); return {t:e.getBoundingClientRect().top+scrollY, h:e.offsetHeight}; });
  await pg.evaluate(o=>scrollTo(0,o.t+(o.h-innerHeight)*0.58), wk); await pg.waitForTimeout(1200); await pg.screenshot({path:`sc_${name}_${k++}.png`});
  const st = await pg.evaluate(()=>{ const th=[...document.querySelectorAll('.td-item.on .td-thumb')].map(t=>{const r=t.getBoundingClientRect(); return [r.left|0,r.right|0,innerWidth];}); const wide=[...document.querySelectorAll('#how *, #work .td-thumb')].filter(e=>{const r=e.getBoundingClientRect(); return r.width>0 && (r.left<-2||r.right>innerWidth+2);}).length; const li=[...document.querySelectorAll('.sk-li')].map(l=>parseFloat(l.style.getPropertyValue('--p')||0).toFixed(1)); return JSON.stringify({thumb:th, wide, howH:Math.round(document.querySelector('#how').offsetHeight/innerHeight*10)/10, li}); });
  console.log(name,'errors',errs,st); await pg.close();
}
await b.close();
