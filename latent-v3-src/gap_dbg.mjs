import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch(); const pg = await (await b.newContext({...devices['iPhone 13']})).newPage();
await pg.goto('http://127.0.0.1:8095/', {waitUntil:'load'}); await pg.waitForTimeout(600);
console.log(await pg.evaluate(()=>{ const r=e=>{const b=e.getBoundingClientRect(); return [Math.round(b.top+scrollY),Math.round(b.bottom+scrollY),Math.round(b.left),Math.round(b.width)];}; const q=s=>document.querySelector(s); const cs=e=>getComputedStyle(e);
  return JSON.stringify({intro:r(q('#how-intro')), introIn:r(q('#how-intro .cf-in')), h2:r(q('#how-intro .cf-h')), introPad:[cs(q('#how-intro .cf-in')).paddingTop,cs(q('#how-intro .cf-in')).paddingBottom], how:r(q('#how')), wrap:r(q('.sk-wrap')), wrapPad:cs(q('.sk-wrap')).paddingTop, list:r(q('.sk-list')), steps:r(q('.sk-steps')), step0:r(q('.sk-step')), step1:r(q('.sk-step[data-k="1"]')), tdDesc:r(q('.td-quote')), tdList:r(q('.td-list')), tdListPad:cs(q('.td-list')).paddingRight, vw:innerWidth}); }));
await b.close();
