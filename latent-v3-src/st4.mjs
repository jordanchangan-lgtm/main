import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch(); const port=process.env.PORT||'8093';
for (const [name, opts] of [['d',{viewport:{width:1440,height:900}}],['m',{...devices['iPhone 13']}]]){
  const pg = await (await b.newContext(opts)).newPage(); const errs=[]; pg.on('pageerror', e=>errs.push(e.message.slice(0,160)));
  await pg.goto('http://127.0.0.1:'+port+'/', {waitUntil:'load'}); await pg.waitForTimeout(800);
  const a = await pg.evaluate(()=>{ const s=document.querySelector('#studio'); return s.getBoundingClientRect().top+scrollY; });
  const fr=[-0.25,-0.02,0.01,0.2,0.4,0.6];
  for (const [i,f] of fr.entries()){ await pg.evaluate(([a,f])=>scrollTo(0,a+innerHeight*f),[a,f]); await pg.waitForTimeout(700); await pg.screenshot({path:`st4_${name}_${i}.png`}); }
  console.log(name,'errors',errs); await pg.close();
}
await b.close();
