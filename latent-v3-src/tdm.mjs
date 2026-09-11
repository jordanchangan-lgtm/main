import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
for (const vp of [{...devices['iPhone 13']}, {...devices['iPhone 13'], viewport:{width:390,height:600}}]){
  const pg = await (await b.newContext(vp)).newPage();
  await pg.goto('http://127.0.0.1:8094/', {waitUntil:'load'}); await pg.waitForTimeout(500);
  await pg.addStyleTag({content:'html{scroll-behavior:auto!important}'});
  const info = await pg.evaluate(()=>{ const e=document.querySelector('#work'); return {t:e.getBoundingClientRect().top+scrollY, h:e.offsetHeight}; });
  await pg.evaluate(o=>scrollTo(0,o.t+(o.h-innerHeight)*0.95), info); await pg.waitForTimeout(1300);
  await pg.screenshot({path:`tdm_${vp.viewport.height}.png`});
  console.log(await pg.evaluate(()=>{ const q=document.querySelector('.td-desc.on').getBoundingClientRect(), l=document.querySelector('.td-items').getBoundingClientRect(), f=document.querySelector('.foot, footer, .ft')||null; return JSON.stringify({desc:[q.top|0,q.bottom|0], list:[l.top|0,l.bottom|0,l.left|0,l.right|0], vh:innerHeight, small:[...document.querySelectorAll('#work *')].filter(e=>e.children.length===0&&e.textContent.trim()&&parseFloat(getComputedStyle(e).fontSize)<11).length}); }));
  await pg.close();
}
await b.close();
