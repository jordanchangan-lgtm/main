import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
for (const [port,tag] of [['8093','c'],['8094','d']]){
  for (const [name, opts] of [['d',{viewport:{width:1440,height:900}}],['m',{...devices['iPhone 13']}]]){
    const pg = await (await b.newContext(opts)).newPage(); const errs=[]; pg.on('pageerror', e=>errs.push(e.message.slice(0,200)));
    await pg.goto('http://127.0.0.1:'+port+'/', {waitUntil:'load'}); await pg.waitForTimeout(800);
    // scroll the whole page gradually, then back up, and count state classes at a few stops
    const H = await pg.evaluate(()=>document.documentElement.scrollHeight-innerHeight);
    let y=0, k=0, stops=[.12,.3,.5,.7,.9]; const out=[];
    for(const f of stops){ const t=H*f; while(y<t){ y=Math.min(t,y+180); await pg.evaluate(v=>scrollTo(0,v),y); await pg.waitForTimeout(12); } await pg.waitForTimeout(700); out.push(await pg.evaluate(()=>({in:document.querySelectorAll('.rv.in').length, out:document.querySelectorAll('.rv.in.out').length, y:Math.round(scrollY)}))); await pg.screenshot({path:`ex_${tag}_${name}_${k++}.png`}); }
    // back up to the top: everything should reset
    while(y>0){ y=Math.max(0,y-400); await pg.evaluate(v=>scrollTo(0,v),y); await pg.waitForTimeout(8); } await pg.waitForTimeout(500);
    out.push(await pg.evaluate(()=>({in:document.querySelectorAll('.rv.in').length, out:document.querySelectorAll('.rv.in.out').length, total:document.querySelectorAll('.rv').length, y:0})));
    console.log(tag,name,'errors',errs,JSON.stringify(out)); await pg.close();
  }
}
await b.close();
