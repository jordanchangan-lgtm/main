import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
const pg = await (await b.newContext({viewport:{width:1440,height:900}, ignoreHTTPSErrors:true})).newPage();
try{ await pg.goto('https://sudqiplanet.com/', {waitUntil:'load', timeout:60000}); }catch(e){ console.log('goto', e.message.slice(0,80)); }
await pg.waitForTimeout(3000);
const links = await pg.evaluate(()=>[...document.querySelectorAll('a')].map(a=>[a.textContent.trim().slice(0,30), a.href]).filter(x=>/shop|store|product|collection|متجر|منتج|تسوق/i.test(x[0]+x[1])).slice(0,12));
console.log(JSON.stringify(links));
const h = await pg.evaluate(()=>document.body.scrollHeight); console.log('height', h);
for(let i=1;i<=4;i++){ await pg.evaluate(y=>scrollTo(0,y), i*850); await pg.waitForTimeout(1200); await pg.screenshot({path:`shots/sudqi_s${i}.png`}); }
for(const [t,u] of links.slice(0,3)){ try{ await pg.goto(u,{waitUntil:'load',timeout:60000}); await pg.waitForTimeout(2500); const n='shots/sudqi_'+u.replace(/[^a-z0-9]+/gi,'_').slice(-30)+'.png'; await pg.screenshot({path:n}); console.log('page', t, n); }catch(e){ console.log('fail', u, e.message.slice(0,60)); } }
await b.close();
