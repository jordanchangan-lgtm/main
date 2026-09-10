import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch(); const port=process.env.PORT||'8093', tag=process.env.TAG||'c';
for (const [name, opts] of [['d',{viewport:{width:1440,height:900}}],['m',{...devices['iPhone 13']}]]){
  const pg = await (await b.newContext(opts)).newPage(); const errs=[]; pg.on('pageerror', e=>errs.push(e.message.slice(0,200)));
  await pg.goto('http://127.0.0.1:'+port+'/', {waitUntil:'load'}); await pg.waitForTimeout(800);
  const info = await pg.evaluate(()=>{ const w=document.querySelector('#work'); return {t:w.getBoundingClientRect().top+scrollY, h:w.offsetHeight}; });
  let k=0;
  if(tag==='c'){
    await pg.evaluate(t=>scrollTo(0,t+8),info.t); await pg.waitForTimeout(1500); await pg.screenshot({path:`pf_${tag}_${name}_${k++}.png`});
    if(name==='d'){ const rb=await (await pg.$$(".js-wk3-row"))[2].boundingBox(); await pg.mouse.move(rb.x+40, rb.y+rb.height/2); await pg.waitForTimeout(900); await pg.screenshot({path:`pf_${tag}_${name}_${k++}.png`});
      await pg.click('.js-wk3-filter span[data-f="film"]'); await pg.waitForTimeout(700); await pg.screenshot({path:`pf_${tag}_${name}_${k++}.png`}); await pg.click('.js-wk3-filter span[data-f="all"]'); }
    await pg.click('.js-wk3-reveal'); await pg.waitForTimeout(1200); await pg.screenshot({path:`pf_${tag}_${name}_${k++}.png`});
    await pg.evaluate(()=>scrollBy(0,innerHeight*1.2)); await pg.waitForTimeout(1200); await pg.screenshot({path:`pf_${tag}_${name}_${k++}.png`});
    await pg.click('.js-wk3-grid .js-film'); await pg.waitForTimeout(900); await pg.screenshot({path:`pf_${tag}_${name}_${k++}.png`});
  } else {
    const n=name==='d'?12:8; for(let i=0;i<n;i++){ await pg.evaluate(([t,h,i,n])=>scrollTo(0,t-innerHeight*.3+(h-innerHeight*.4)*(i/(n-1))),[info.t,info.h,i,n]); await pg.waitForTimeout(800); await pg.screenshot({path:`pf_${tag}_${name}_${k++}.png`}); }
  }
  const wide = await pg.evaluate(()=>[...document.querySelectorAll('#work *')].filter(e=>{const r=e.getBoundingClientRect(); return r.width>0 && (r.left<-2||r.right>innerWidth+2) && !e.closest('.fm-modal');}).length);
  console.log(tag,name,'errors',errs,'wide',wide,'shots',k,JSON.stringify(info)); await pg.close();
}
await b.close();
