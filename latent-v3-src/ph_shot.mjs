import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
const pg = await (await b.newContext({...devices['iPhone 13']})).newPage(); const errs=[]; pg.on('pageerror', e=>errs.push(e.message.slice(0,200)));
await pg.goto('http://127.0.0.1:8094/', {waitUntil:'load'}); await pg.waitForTimeout(800);
// portfolio list on the phone, then a tap on a row
const t = await pg.evaluate(()=>document.querySelector('#work').getBoundingClientRect().top+scrollY);
let y=t-1200; await pg.evaluate(v=>scrollTo(0,v),y); while(y<t+10){ y=Math.min(t+10,y+200); await pg.evaluate(v=>scrollTo(0,v),y); await pg.waitForTimeout(10);} await pg.waitForTimeout(1200); await pg.screenshot({path:'ph_0.png'});
await pg.tap('.js-wk3-row[data-i="2"]'); await pg.waitForTimeout(800); await pg.screenshot({path:'ph_1.png'});
// the annotated pictures: each one opened
const tops = await pg.evaluate(()=>[...document.querySelectorAll('.wp-img')].map(e=>e.getBoundingClientRect().top+scrollY));
let k=2; y=tops[0]-1500; await pg.evaluate(v=>scrollTo(0,v),y);
for(const t0 of tops){ const tt=t0-844*.2; if(tt<y){ y=tt-600; await pg.evaluate(v=>scrollTo(0,v),y);} while(y<tt){ y=Math.min(tt,y+160); await pg.evaluate(v=>scrollTo(0,v),y); await pg.waitForTimeout(10);} await pg.waitForTimeout(1800); await pg.screenshot({path:`ph_${k++}.png`}); }
const cut = await pg.evaluate(()=>{ let n=0; document.querySelectorAll('.wp-img').forEach(f=>{ const fr=f.getBoundingClientRect(); f.querySelectorAll('.an-lb').forEach(l=>{ const r=l.getBoundingClientRect(); if(r.left<fr.left-1||r.right>fr.right+1||r.top<fr.top-1||r.bottom>fr.bottom+1) n++; }); }); return n; });
const wide = await pg.evaluate(()=>[...document.querySelectorAll('#work *')].filter(e=>{const r=e.getBoundingClientRect(); return r.width>0 && (r.left<-2||r.right>innerWidth+2);}).length);
console.log('errors',errs,'labels outside',cut,'wide',wide); await b.close();
