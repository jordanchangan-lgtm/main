import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
for (const [name, opts] of [['d',{viewport:{width:1440,height:900}}],['m',{...devices['iPhone 13']}]]){
  const pg = await (await b.newContext(opts)).newPage(); const errs=[]; pg.on('pageerror', e=>errs.push(e.message.slice(0,200)));
  await pg.goto('http://127.0.0.1:8095/', {waitUntil:'load'}); await pg.waitForTimeout(500);
  await pg.addStyleTag({content:'html{scroll-behavior:auto!important}'}); let k=0;
  const info = await pg.evaluate(()=>{ const e=document.querySelector('.js-fy-hold'); return {t:e.getBoundingClientRect().top+scrollY, h:e.offsetHeight}; });
  for(const f of [0.02,0.1,0.2,0.33,0.5,0.66,0.83,0.97]){ await pg.evaluate(o=>scrollTo(0,o.t+(o.h-innerHeight)*o.f), {...info,f}); await pg.waitForTimeout(900); await pg.screenshot({path:`fy_${name}_${k++}.png`}); }
  const st = await pg.evaluate(()=>{ const vis=[...document.querySelectorAll('.js-fy-card')].filter(c=>c.style.visibility==='visible'); const nm=document.querySelector('.js-fy-name.on'); const r=nm.querySelector('.fy-h').getBoundingClientRect(); const over=vis.filter(c=>{const b=c.getBoundingClientRect(); return !(b.right<r.left||b.left>r.right||b.bottom<r.top||b.top>r.bottom);}).length; return JSON.stringify({H:Math.round(document.querySelector('.js-fy-hold').offsetHeight/innerHeight), visible:vis.length, name:nm.textContent.trim().slice(0,40), overName:over}); });
  console.log(name,'errors',errs,st); await pg.close();
}
await b.close();
