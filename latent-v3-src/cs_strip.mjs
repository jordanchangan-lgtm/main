import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch(); const port=process.env.PORT||'8092';
for (const [name, opts] of [['d',{viewport:{width:1440,height:900}}],['m',{...devices['iPhone 13']}]]){
  const pg = await (await b.newContext(opts)).newPage(); const errs=[]; pg.on('pageerror', e=>errs.push(e.message.slice(0,160)));
  await pg.goto('http://127.0.0.1:'+port+'/', {waitUntil:'load'}); await pg.waitForTimeout(600);
  const info = await pg.evaluate(()=>{ const h=document.querySelector('.js-cs'); return {top:h.getBoundingClientRect().top+scrollY, h:h.offsetHeight}; });
  const n=8; for (let i=0;i<n;i++){ await pg.evaluate((a)=>scrollTo(0,a.top-60+(a.h-innerHeight*.5)*(a.i/(a.n-1))),{...info,i,n}); await pg.waitForTimeout(500); await pg.screenshot({path:`cs_${name}_${i}.png`}); }
  const wide = await pg.evaluate(()=>[...document.querySelectorAll('.cs-item')].filter(e=>{const r=e.getBoundingClientRect(); return r.left<-1||r.right>innerWidth+1;}).length);
  console.log(name,'errors',errs,'wide',wide,'section',JSON.stringify(info)); await pg.close();
}
await b.close();
