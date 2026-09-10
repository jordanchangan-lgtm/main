import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
for (const [port,tag] of [['8094','d'],['8093','c']]){
  for (const [name, opts] of [['d',{viewport:{width:1440,height:900}}],['m',{...devices['iPhone 13']}]]){
    const pg = await (await b.newContext(opts)).newPage(); const errs=[]; pg.on('pageerror', e=>errs.push(e.message.slice(0,200)));
    await pg.goto('http://127.0.0.1:'+port+'/', {waitUntil:'load'}); await pg.waitForTimeout(800);
    // walk to the type block
    const y = await pg.evaluate(()=>{ const s=document.querySelector('.ty2-stack'); const hz=s.closest('.js-hz-hold'); if(hz && innerWidth>820){ return hz.getBoundingClientRect().top+scrollY+hz.offsetHeight-innerHeight; } return s.getBoundingClientRect().top+scrollY-innerHeight*.3; });
    let cur = y-1200; await pg.evaluate(v=>scrollTo(0,v),cur); await pg.waitForTimeout(300);
    while(cur<y){ cur=Math.min(y,cur+200); await pg.evaluate(v=>scrollTo(0,v),cur); await pg.waitForTimeout(30); }
    await pg.waitForTimeout(150); await pg.screenshot({path:`ty_${tag}_${name}_0.png`}); await pg.waitForTimeout(500); await pg.screenshot({path:`ty_${tag}_${name}_1.png`}); await pg.waitForTimeout(900); await pg.screenshot({path:`ty_${tag}_${name}_2.png`});
    if(name==='d'){ const c = await pg.$('.ty2-stack span:nth-child(3) .ty2-c:nth-child(4)'); if(c){ await c.hover(); await pg.waitForTimeout(350); await pg.screenshot({path:`ty_${tag}_${name}_3.png`}); } }
    console.log(tag,name,'errors',errs); await pg.close();
  }
}
await b.close();
