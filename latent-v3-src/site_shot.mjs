import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [,, url, out] = process.argv;
const b = await chromium.launch({args:['--ignore-certificate-errors']});
try{
  for (const [name, opts] of [['d',{viewport:{width:1440,height:900}}],['m',{...devices['iPhone 13']}]]){
    const pg = await (await b.newContext({...opts, ignoreHTTPSErrors:true})).newPage();
    try{ await pg.goto(url, {waitUntil:'load', timeout:60000}); }catch(e){ console.log('goto', name, e.message.slice(0,80)); }
    await pg.waitForTimeout(3500); await pg.evaluate(()=>window.scrollTo(0,0)); await pg.waitForTimeout(500);
    await pg.screenshot({path:`${out}_${name}.png`}); console.log('shot', `${out}_${name}.png`, await pg.title()); await pg.close();
  }
}finally{ await b.close(); }
