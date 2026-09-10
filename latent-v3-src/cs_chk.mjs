import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch(); const port=process.env.PORT||'8092';
for (const [name, opts] of [['d',{viewport:{width:1440,height:900}}],['m',{...devices['iPhone 13']}]]){
  const pg = await (await b.newContext(opts)).newPage(); const errs=[];
  pg.on('pageerror', e=>errs.push(e.message.slice(0,160)));
  await pg.goto('http://127.0.0.1:'+port+'/', {waitUntil:'load'}); await pg.waitForTimeout(800);
  const info = await pg.evaluate(()=>{ const h=document.querySelector('.js-cs'); return {top:h.getBoundingClientRect().top+scrollY, h:h.offsetHeight}; });
  console.log(name, 'section', JSON.stringify(info));
  const n = 7;
  for (let k=0;k<n;k++){ await pg.evaluate((a)=>scrollTo(0, a.top - 80 + (a.h)*(a.k/a.n)), {...info,k,n}); await pg.waitForTimeout(1300);
    const st = await pg.evaluate(()=>{ const items=[...document.querySelectorAll('.cs-item')]; const vw=innerWidth; const vis=items.filter(e=>{const r=e.getBoundingClientRect(); return r.bottom>0&&r.top<innerHeight;}); const wide=vis.filter(e=>{const r=e.getBoundingClientRect(); return r.left<-1||r.right>vw+1;}).length; const overl=[]; for(let i=0;i<vis.length;i++)for(let j=i+1;j<vis.length;j++){const a=vis[i].getBoundingClientRect(),b2=vis[j].getBoundingClientRect(); if(!(a.right<b2.left||a.left>b2.right||a.bottom<b2.top||a.top>b2.bottom)) overl.push(i+'-'+j);} return {visible:vis.length, wide, overlaps:overl.length, inCls:vis.filter(e=>e.classList.contains('in')).length}; });
    console.log(name, 'pos', k, JSON.stringify(st)); await pg.screenshot({path:`cs_${name}_${k}.png`}); }
  console.log(name, 'errors', errs); await pg.close();
}
await b.close();
