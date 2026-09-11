import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
const pg = await (await b.newContext({...devices['iPhone 13']})).newPage();
await pg.goto('http://127.0.0.1:8094/', {waitUntil:'load'}); await pg.waitForTimeout(500);
const info = await pg.evaluate(()=>{ const e=document.querySelector('.cb-ask'); return e.getBoundingClientRect().top+scrollY; });
let y=0; while(y<info-60){ y=Math.min(info-60,y+170); await pg.evaluate(v=>scrollTo(0,v),y); await pg.waitForTimeout(10);} await pg.waitForTimeout(1300);
await pg.screenshot({path:'cb_m_fix.png'});
const r = await pg.evaluate(()=>{ const ws=[...document.querySelectorAll('.cb-stack > span')].map(s=>{const b=s.getBoundingClientRect(); return [s.getAttribute('aria-label'), Math.round(b.height)];}); const act=document.querySelector('.js-cb-box').getAttribute('action'); return {ws, act: decodeURIComponent(act).replace(/\n/g,'|')}; });
console.log(JSON.stringify(r)); await b.close();
