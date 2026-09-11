import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
for (const [name, opts] of [['d',{viewport:{width:1440,height:900}}],['m',{...devices['iPhone 13']}]]){
  const pg = await (await b.newContext(opts)).newPage(); const errs=[]; pg.on('pageerror', e=>errs.push(e.message.slice(0,200)));
  await pg.goto('file:///tmp/claude-0/-home-user-main/ebce930a-c60e-53f2-9cc9-6aaf1c614988/scratchpad/how_options2.html', {waitUntil:'load'}); await pg.waitForTimeout(500);
  await pg.addStyleTag({content:'html{scroll-behavior:auto!important}'}); let k=0; const out={};
  for(const id of ['o06','o07','o08','o09','o10','o11']){ const t = await pg.evaluate(i=>{ const e=document.getElementById(i); return {t:e.getBoundingClientRect().top+scrollY,h:e.offsetHeight}; }, id); out[id]=Math.round(t.h/(name==='d'?900:664)*10)/10;
    await pg.evaluate(v=>scrollTo(0,v), t.t+ t.h*0.45); await pg.waitForTimeout(600); await pg.screenshot({path:`how2_${name}_${k++}.png`}); }
  const wide = await pg.evaluate(()=>[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect(); return r.width>0 && !e.closest('.track') && (r.left<-2||r.right>innerWidth+2);}).length);
  console.log(name,'errors',errs,'wide',wide,JSON.stringify(out)); await pg.close();
}
await b.close();
