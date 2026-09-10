import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
for (const [name, opts] of [['d',{viewport:{width:1440,height:900}}],['m',{...devices['iPhone 13']}]]){
  const pg = await (await b.newContext(opts)).newPage(); const errs=[]; pg.on('pageerror', e=>errs.push(e.message.slice(0,200)));
  await pg.goto('http://127.0.0.1:8094/', {waitUntil:'load'}); await pg.waitForTimeout(800);
  const ih = await pg.evaluate(()=>innerHeight); let k=0, y=0;
  // scroll so the second step's image top sits at 80% of the screen, then wait and shoot at 0 / 400 / 900 / 1600 ms
  const top = await pg.evaluate(()=>{ const e=document.querySelectorAll('.wp-step')[1]; return e.getBoundingClientRect().top+scrollY; });
  const t = top - ih*.72; while(y<t){ y=Math.min(t,y+170); await pg.evaluate(v=>scrollTo(0,v),y); await pg.waitForTimeout(10);}
  for(const w of [50,350,500,700]){ await pg.waitForTimeout(w); await pg.screenshot({path:`wpt_${name}_${k++}.png`}); }
  const st = await pg.evaluate(()=>{ const e=document.querySelectorAll('.js-wp-img')[1]; return e.className+' | '+getComputedStyle(e).clipPath+' | '+document.querySelectorAll('.js-wp-txt')[1].className; });
  console.log(name,'errors',errs,st); await pg.close();
}
await b.close();
