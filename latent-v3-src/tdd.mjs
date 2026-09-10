import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
const pg = await (await b.newContext({...devices['iPhone 13']})).newPage();
await pg.goto('http://127.0.0.1:8094/', {waitUntil:'load'}); await pg.waitForTimeout(800);
let y=0; const info = await pg.evaluate(()=>{ const e=document.querySelector('#work'); return {t:e.getBoundingClientRect().top+scrollY, h:e.offsetHeight}; });
const t=info.t+(info.h-844)*0.55; while(y<t){ y=Math.min(t,y+170); await pg.evaluate(v=>scrollTo(0,v),y); await pg.waitForTimeout(10);} await pg.waitForTimeout(1500); await pg.screenshot({path:"tdd_m.png"});
console.log(await pg.evaluate(()=>[...document.querySelectorAll('.td-desc')].map(d=>d.className.replace('td-desc js-td-desc','')+':'+getComputedStyle(d).opacity+':'+getComputedStyle(d).transform).join(' | ')));
console.log(await pg.evaluate(()=>{ const l=document.querySelector('.td-items'); return l.style.transform+' / '+[...document.querySelectorAll('.td-desc')].map(d=>d.getBoundingClientRect().top|0).join(','); }));
await b.close();
