import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
for (const [name, opts] of [['d',{viewport:{width:1440,height:900}}],['m',{...devices['iPhone 13']}]]){
  const pg = await (await b.newContext(opts)).newPage(); const errs=[]; pg.on('pageerror', e=>errs.push(e.message.slice(0,200)));
  await pg.goto('http://127.0.0.1:8095/', {waitUntil:'load'}); await pg.waitForTimeout(500);
  await pg.addStyleTag({content:'html{scroll-behavior:auto!important}'}); let k=0;
  const row = await pg.$('.js-ow-client'); await row.scrollIntoViewIfNeeded(); await pg.evaluate(()=>scrollBy(0,-innerHeight*0.35)); await pg.waitForTimeout(1200); await pg.screenshot({path:`ab_${name}_${k++}.png`});
  await row.click(); await pg.waitForTimeout(1500); await pg.screenshot({path:`ab_${name}_${k++}.png`});
  const piece = await pg.$('.ow-piece'); await piece.click(); await pg.waitForTimeout(900); await pg.screenshot({path:`ab_${name}_${k++}.png`});
  const st = await pg.evaluate(()=>({fm: !document.querySelector('.js-fm').hidden, title: document.querySelector('.js-fm-title').textContent, pieces: document.querySelectorAll('.ow-piece.in').length, wide:[...document.querySelectorAll('#ourwork *')].filter(e=>{const r=e.getBoundingClientRect(); return r.width>0&&(r.left<-2||r.right>innerWidth+2);}).length}));
  console.log(name,'errors',errs,JSON.stringify(st)); await pg.close();
}
await b.close();
