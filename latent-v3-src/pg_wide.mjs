import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch(); const pg = await (await b.newContext({...devices['iPhone 13']})).newPage();
await pg.goto('http://127.0.0.1:8095/', {waitUntil:'load'}); await pg.waitForTimeout(500);
await pg.addStyleTag({content:'html{scroll-behavior:auto!important}'});
const t = await pg.evaluate(()=>{ const e=document.querySelector('#work'); return e.getBoundingClientRect().top+scrollY; });
await pg.evaluate(v=>scrollTo(0,v), t+600); await pg.waitForTimeout(1200);
console.log(await pg.evaluate(()=>{ const w=[...document.querySelectorAll('#work *')].filter(e=>{const r=e.getBoundingClientRect(); return r.width>0 && (r.left<-2||r.right>innerWidth+2);}); return JSON.stringify({n:w.length, s:w.slice(0,5).map(e=>e.tagName+'.'+e.className.slice(0,30)+' '+(e.getBoundingClientRect().left|0)+'-'+(e.getBoundingClientRect().right|0)), cols:[...document.querySelectorAll('.pg-col')].map(c=>c.offsetHeight)}); }));
await b.close();
