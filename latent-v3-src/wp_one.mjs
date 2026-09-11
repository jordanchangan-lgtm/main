import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
for (const [name, opts] of [['d',{viewport:{width:1440,height:900}}],['m',{...devices['iPhone 13']}]]){
  const pg = await (await b.newContext(opts)).newPage(); const errs=[]; pg.on('pageerror', e=>errs.push(e.message.slice(0,200)));
  await pg.goto('http://127.0.0.1:8094/', {waitUntil:'load'}); await pg.waitForTimeout(600);
  await pg.addStyleTag({content:'html{scroll-behavior:auto!important}'});
  const ih = await pg.evaluate(()=>innerHeight);
  const top = await pg.evaluate(()=>{ const e=document.querySelectorAll('.wp-step')[1]; return e.getBoundingClientRect().top+scrollY; });
  await pg.evaluate(v=>scrollTo(0,v), top - ih*.95); await pg.waitForTimeout(700); let k=0;
  await pg.screenshot({path:`wpo_${name}_${k++}.png`});
  await pg.mouse.wheel(0, 120); // one notch
  for(const w of [120,250,400,900]){ await pg.waitForTimeout(w); await pg.screenshot({path:`wpo_${name}_${k++}.png`}); }
  const st = await pg.evaluate(()=>{ const e=document.querySelectorAll('.js-wp-img')[1]; return e.style.clipPath+' | '+e.className+' | p='+document.querySelectorAll('.js-wp-txt')[1].style.getPropertyValue('--p'); });
  console.log(name,'errors',errs,st); await pg.close();
}
await b.close();
