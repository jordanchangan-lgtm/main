import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
for (const [name, opts] of [['d',{viewport:{width:1440,height:900}}],['m',{...devices['iPhone 13']}]]){
  const pg = await (await b.newContext(opts)).newPage(); const errs=[]; pg.on('pageerror', e=>errs.push(e.message.slice(0,200)));
  await pg.goto('http://127.0.0.1:8095/', {waitUntil:'load'}); await pg.waitForTimeout(600);
  await pg.addStyleTag({content:'html{scroll-behavior:auto!important}'});
  const ih = await pg.evaluate(()=>innerHeight); let k=0, y=0;
  const info = await pg.evaluate(()=>{ const e=document.querySelector('#work'); return {t:e.getBoundingClientRect().top+scrollY, h:e.offsetHeight}; });
  for(const f of [0.0,0.08,0.2,0.35,0.5,0.65,0.8,0.95]){ const t=info.t+(info.h-ih)*f; while(y<t){ y=Math.min(t,y+200); await pg.evaluate(v=>scrollTo(0,v),y); await pg.waitForTimeout(8);} await pg.waitForTimeout(1000); await pg.screenshot({path:`pg_${name}_${k++}.png`}); }
  const st = await pg.evaluate(()=>({H:document.querySelector('#work').offsetHeight, count:document.querySelector('.js-pg-count').textContent, on:document.querySelector('.js-pg-meta.on .pg-name').textContent, wide:[...document.querySelectorAll('#work *')].filter(e=>{const r=e.getBoundingClientRect(); return r.width>0 && (r.left<-2||r.right>innerWidth+2);}).length, cols:[...document.querySelectorAll('.pg-col')].map(c=>c.offsetHeight)}));
  console.log(name,'errors',errs,JSON.stringify(st)); await pg.close();
}
await b.close();
