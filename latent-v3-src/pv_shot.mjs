import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
for (const vp of [{...devices['iPhone 13']}, {...devices['iPhone 13'], viewport:{width:390,height:780}}]){
  const pg = await (await b.newContext(vp)).newPage(); const errs=[]; pg.on('pageerror', e=>errs.push(e.message.slice(0,200)));
  await pg.goto('http://127.0.0.1:8095/', {waitUntil:'load'}); await pg.waitForTimeout(500);
  await pg.addStyleTag({content:'html{scroll-behavior:auto!important}'});
  const info = await pg.evaluate(()=>{ const e=document.querySelector('#work'); return {t:e.getBoundingClientRect().top+scrollY, h:e.offsetHeight}; });
  let k=0; for(const f of [0.1,0.55]){ await pg.evaluate(o=>scrollTo(0,o.t+(o.h-innerHeight)*o.f), {...info,f}); await pg.waitForTimeout(1300); await pg.screenshot({path:`pv_${vp.viewport.height}_${k++}.png`}); }
  console.log(vp.viewport.height, 'errors', errs, await pg.evaluate(()=>{ const pv=document.querySelector('.td-pv'); const r=pv.getBoundingClientRect(); const d=document.querySelector('.td-quote').getBoundingClientRect(), L=document.querySelector('.td-list').getBoundingClientRect(); return JSON.stringify({pv:[r.top|0,r.bottom|0,r.width|0,r.height|0], src:(pv.querySelector('img').getAttribute('src')||'').slice(-14), descRight:d.right|0, listLeft:L.left|0, vh:innerHeight}); }));
  await pg.close();
}
await b.close();
