import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
for (const [name, opts] of [['d',{viewport:{width:1440,height:900}}],['m',{...devices['iPhone 13']}]]){
  const pg = await (await b.newContext(opts)).newPage(); const errs=[]; pg.on('pageerror', e=>errs.push(e.message.slice(0,200)));
  await pg.goto('http://127.0.0.1:8095/', {waitUntil:'load'}); await pg.waitForTimeout(500);
  await pg.addStyleTag({content:'html{scroll-behavior:auto!important}'}); let k=0;
  const info = await pg.evaluate(()=>{ const e=document.getElementById('ourwork'); return {t:e.getBoundingClientRect().top+scrollY, h:e.offsetHeight}; });
  await pg.evaluate(o=>scrollTo(0,o.t-innerHeight*0.6), info); await pg.waitForTimeout(500); await pg.screenshot({path:`ow_${name}_${k++}.png`});
  await pg.evaluate(o=>scrollTo(0,o.t+o.h*0.5-innerHeight*0.5), info); await pg.waitForTimeout(1400); await pg.screenshot({path:`ow_${name}_${k++}.png`});
  if(name==='d'){ const r=await pg.$('.js-ow-row[style*="--k:3"]'); await r.hover(); await pg.waitForTimeout(700); await pg.screenshot({path:`ow_${name}_${k++}.png`}); }
  const st=await pg.evaluate(()=>({H:document.getElementById('ourwork').offsetHeight, rows:[...document.querySelectorAll('.js-ow-row')].map(a=>a.getAttribute('href')), wide:[...document.querySelectorAll('#ourwork *')].filter(e=>{const r=e.getBoundingClientRect(); return r.width>0&&(r.left<-2||r.right>innerWidth+2);}).length, small:[...document.querySelectorAll('#ourwork *')].filter(e=>e.children.length===0&&e.textContent.trim()&&parseFloat(getComputedStyle(e).fontSize)<11).length}));
  console.log(name,'errors',errs,JSON.stringify(st)); await pg.close();
}
await b.close();
