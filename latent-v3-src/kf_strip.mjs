import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch(); const port=process.env.PORT||'8093';
for (const [name, opts] of [['d',{viewport:{width:1440,height:900}}],['m',{...devices['iPhone 13']}]]){
  const pg = await (await b.newContext(opts)).newPage(); const errs=[]; pg.on('pageerror', e=>errs.push(e.message.slice(0,160)));
  await pg.goto('http://127.0.0.1:'+port+'/', {waitUntil:'load'}); await pg.waitForTimeout(800);
  const top = await pg.evaluate(()=>document.querySelector('#facts').getBoundingClientRect().top+scrollY);
  await pg.evaluate(t=>scrollTo(0,t-innerHeight*.9),top); await pg.waitForTimeout(400);
  await pg.evaluate(t=>scrollTo(0,t-innerHeight*.15),top);
  for (const [i,w] of [120,260,320,500,1200].entries()){ await pg.waitForTimeout(w); await pg.screenshot({path:`kf_${name}_${i}.png`}); }
  const wide = await pg.evaluate(()=>[...document.querySelectorAll('#facts *')].filter(e=>{const r=e.getBoundingClientRect(); return r.width>0 && (r.left<-2||r.right>innerWidth+2);}).length);
  console.log(name,'errors',errs,'wide',wide); await pg.close();
}
await b.close();
