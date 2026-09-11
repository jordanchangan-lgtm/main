import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
for (const [name, opts] of [['d',{viewport:{width:1440,height:900}}],['m',{...devices['iPhone 13']}]]){
  const pg = await (await b.newContext(opts)).newPage(); const errs=[]; pg.on('pageerror', e=>errs.push(e.message.slice(0,200)));
  await pg.goto('file:///tmp/claude-0/-home-user-main/ebce930a-c60e-53f2-9cc9-6aaf1c614988/scratchpad/wall_options.html', {waitUntil:'load'}); await pg.waitForTimeout(500);
  await pg.addStyleTag({content:'html{scroll-behavior:auto!important}'}); let k=0;
  for(const id of ['o1','o2','o3','o4','o5']){ const t = await pg.evaluate(i=>{ const e=document.getElementById(i); return e.getBoundingClientRect().top+scrollY; }, id);
    await pg.evaluate(v=>scrollTo(0,v), t+ (id==='o1'||id==='o2'? 380 : 120)); await pg.waitForTimeout(1400); await pg.screenshot({path:`opt_${name}_${k++}.png`}); }
  const wide = await pg.evaluate(()=>[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect(); return r.width>0 && (r.left<-2||r.right>innerWidth+2);}).length);
  console.log(name,'errors',errs,'wide',wide); await pg.close();
}
await b.close();
