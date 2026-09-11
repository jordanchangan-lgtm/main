import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
for (const [name, opts] of [['d',{viewport:{width:1440,height:900}}],['m',{...devices['iPhone 13']}]]){
  const pg = await (await b.newContext(opts)).newPage(); const errs=[]; pg.on('pageerror', e=>errs.push(e.message.slice(0,200)));
  await pg.goto('http://127.0.0.1:8095/', {waitUntil:'load'}); await pg.waitForTimeout(600);
  await pg.addStyleTag({content:'html{scroll-behavior:auto!important}'});
  const ih = await pg.evaluate(()=>innerHeight); let k=0, y=0;
  const info = await pg.evaluate(()=>{ const e=document.querySelector('#work'); return {t:e.getBoundingClientRect().top+scrollY, h:e.offsetHeight}; });
  const step = async (t, w)=>{ if(t<y){ y=t; await pg.evaluate(v=>scrollTo(0,v),y);} while(y<t){ y=Math.min(t,y+200); await pg.evaluate(v=>scrollTo(0,v),y); await pg.waitForTimeout(8);} await pg.waitForTimeout(w); await pg.screenshot({path:`pg2_${name}_${k++}.png`}); };
  await step(info.t, 150); await step(info.t, 500); await step(info.t, 1200);
  await step(info.t+ih*0.95, 1200);
  // open the first project
  const btn = await pg.$('.js-pg-open'); await btn.scrollIntoViewIfNeeded(); y = await pg.evaluate(()=>scrollY); await pg.waitForTimeout(800); await pg.screenshot({path:`pg2_${name}_${k++}.png`});
  await btn.click(); await pg.waitForTimeout(200); await pg.screenshot({path:`pg2_${name}_${k++}.png`}); await pg.waitForTimeout(1200); await pg.screenshot({path:`pg2_${name}_${k++}.png`});
  await pg.evaluate(()=>scrollBy(0,innerHeight*.9)); await pg.waitForTimeout(1200); await pg.screenshot({path:`pg2_${name}_${k++}.png`});
  const st = await pg.evaluate(()=>({H:document.querySelector('#work').offsetHeight, shown:document.querySelectorAll('.pg-more:not([hidden])').length, lbl:document.querySelector('.js-pg-open-t').textContent, wide:[...document.querySelectorAll('#work *')].filter(e=>{const r=e.getBoundingClientRect(); return r.width>0 && (r.left<-2||r.right>innerWidth+2);}).length, small:[...document.querySelectorAll('#work *')].filter(e=>e.children.length===0&&e.textContent.trim()&&parseFloat(getComputedStyle(e).fontSize)<11&&innerWidth<500).length}));
  console.log(name,'errors',errs,JSON.stringify(st)); await pg.close();
}
await b.close();
