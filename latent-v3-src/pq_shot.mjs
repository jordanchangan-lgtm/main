import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
for (const [name, opts] of [['d',{viewport:{width:1440,height:900}}],['m',{...devices['iPhone 13']}]]){
  const pg = await (await b.newContext(opts)).newPage(); const errs=[]; pg.on('pageerror', e=>errs.push(e.message.slice(0,200)));
  await pg.goto('http://127.0.0.1:8094/', {waitUntil:'load'}); await pg.waitForTimeout(800);
  const t = await pg.evaluate(()=>document.querySelector('#prices').getBoundingClientRect().top+scrollY);
  let y=t-1500; await pg.evaluate(v=>scrollTo(0,v),y); while(y<t-40){ y=Math.min(t-40,y+200); await pg.evaluate(v=>scrollTo(0,v),y); await pg.waitForTimeout(10);} await pg.waitForTimeout(1200); await pg.screenshot({path:`pq_${name}_0.png`});
  if(name==='d'){ const r = await pg.$('.pq-row:nth-child(3)'); const bb = await r.boundingBox(); await pg.mouse.move(bb.x+400, bb.y+bb.height/2); await pg.waitForTimeout(700); await pg.screenshot({path:`pq_${name}_1.png`}); }
  else { await pg.evaluate(v=>scrollBy(0,v),700); await pg.waitForTimeout(800); await pg.screenshot({path:`pq_${name}_1.png`}); }
  console.log(name,'errors',errs); await pg.close();
}
await b.close();
