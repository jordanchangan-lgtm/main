import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch(); const pg = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await pg.goto('http://127.0.0.1:8095/', {waitUntil:'load'}); await pg.waitForTimeout(500);
console.log(await pg.evaluate(()=>{ const out={}; for(const id of ['top','studio','how','method','work','sectors','process','prices','contact']){ const e=document.getElementById(id); if(e) out[id]=Math.round(e.offsetHeight/innerHeight*10)/10+'vh'; } const st=document.querySelector('#studio'); out.studioChildren=[...st.children].map(c=>c.className.slice(0,40)+':'+Math.round(c.offsetHeight/innerHeight*10)/10+'vh'); out.words=document.querySelectorAll('#studio .bw').length; return JSON.stringify(out); }));
await b.close();
