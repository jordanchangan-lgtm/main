import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch(); const port=process.env.PORT||'8093';
for (const [name, opts, n] of [['d',{viewport:{width:1440,height:900}},16],['m',{...devices['iPhone 13']},10]]){
  const pg = await (await b.newContext(opts)).newPage(); const errs=[]; pg.on('pageerror', e=>errs.push(e.message.slice(0,160)));
  await pg.goto('http://127.0.0.1:'+port+'/', {waitUntil:'load'}); await pg.waitForTimeout(800);
  const info = await pg.evaluate(()=>{ const hero=document.querySelector('.hero').closest('.js-lk')||document.querySelector('.hero'); const a=hero.getBoundingClientRect().top+scrollY+hero.offsetHeight-innerHeight*.5; const z=document.querySelector('#method').getBoundingClientRect().top+scrollY; return {a,z}; });
  for (let i=0;i<n;i++){ await pg.evaluate((a)=>scrollTo(0,a.a+(a.z-a.a-innerHeight*.4)*(a.i/(a.n-1))),{...info,i,n}); await pg.waitForTimeout(650); await pg.screenshot({path:`st3_${name}_${i}.png`}); }
  const wide = await pg.evaluate(()=>{ const w=innerWidth; return [...document.querySelectorAll('#studio *, #facts *, #explorations *, #services *')].filter(e=>{const r=e.getBoundingClientRect(); return r.width>0 && (r.left<-2||r.right>w+2) && !e.closest('.mq') && !e.closest('.st2-bg') && !e.closest('.hz-track');}).length; });
  console.log(name,'errors',errs,'wide',wide,JSON.stringify(info)); await pg.close();
}
await b.close();
