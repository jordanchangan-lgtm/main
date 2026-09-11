import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
for (const [name, port, vp] of [['w',8095,{width:1880,height:868}],['d',8095,{width:1440,height:900}],['s',8094,{width:1280,height:640}],['m',8095,devices['iPhone 13'].viewport]]){
  const pg = await (await b.newContext({viewport:vp, ...(name==='m'?devices['iPhone 13']:{})})).newPage();
  await pg.goto(`http://127.0.0.1:${port}/`, {waitUntil:'load'}); await pg.waitForTimeout(500);
  await pg.addStyleTag({content:'html{scroll-behavior:auto!important}'});
  const info = await pg.evaluate(()=>{ const e=document.querySelector('#work'); return {t:e.getBoundingClientRect().top+scrollY, h:e.offsetHeight}; });
  await pg.evaluate(o=>scrollTo(0,o.t+(o.h-innerHeight)*0.45), info); await pg.waitForTimeout(1300);
  await pg.screenshot({path:`tdw_${name}.png`});
  console.log(name, await pg.evaluate(()=>{ const q=document.querySelector('.td-desc.on').getBoundingClientRect(), on=document.querySelector('.td-item.on').getBoundingClientRect(), l=document.querySelector('.td-items').getBoundingClientRect(); return JSON.stringify({vh:innerHeight, desc:[q.top|0,q.bottom|0], active:[on.top|0,on.bottom|0], list:[l.top|0,l.bottom|0], rows:document.querySelector('.td-item').getBoundingClientRect().height|0}); }));
  await pg.close();
}
await b.close();
