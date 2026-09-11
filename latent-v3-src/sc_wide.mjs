import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch(); const pg = await (await b.newContext({...devices['iPhone 13']})).newPage();
await pg.goto('http://127.0.0.1:8095/', {waitUntil:'load'}); await pg.waitForTimeout(500);
await pg.addStyleTag({content:'html{scroll-behavior:auto!important}'});
const info = await pg.evaluate(()=>{ const e=document.querySelector('#how'); return {t:e.getBoundingClientRect().top+scrollY, h:e.offsetHeight}; });
await pg.evaluate(o=>scrollTo(0,o.t+(o.h-innerHeight)*0.55), info); await pg.waitForTimeout(900);
console.log(await pg.evaluate(()=>JSON.stringify([...document.querySelectorAll('#how *')].filter(e=>{const r=e.getBoundingClientRect(); return r.width>0 && (r.left<-2||r.right>innerWidth+2);}).slice(0,6).map(e=>e.tagName+'.'+e.className.toString().slice(0,30)+' '+(e.getBoundingClientRect().left|0)+'-'+(e.getBoundingClientRect().right|0)))));
await b.close();
