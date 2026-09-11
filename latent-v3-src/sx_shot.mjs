import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
for (const [name, opts] of [['d',{viewport:{width:1440,height:900}}],['m',{...devices['iPhone 13']}]]){
  const pg = await (await b.newContext(opts)).newPage(); const errs=[]; pg.on('pageerror', e=>errs.push(e.message.slice(0,200)));
  await pg.goto('http://127.0.0.1:8095/', {waitUntil:'load'}); await pg.waitForTimeout(600);
  await pg.addStyleTag({content:'html{scroll-behavior:auto!important}'});
  const ih = await pg.evaluate(()=>innerHeight); let k=0;
  const tops = await pg.evaluate(()=>[...document.querySelectorAll('.sx-hold')].map(e=>e.getBoundingClientRect().top+scrollY));
  // first panel: arriving (scattered), then settled at 250ms / 1500ms; then panels 2 and 4 settled
  await pg.evaluate(v=>scrollTo(0,v), tops[0]-ih*.7); await pg.waitForTimeout(900); await pg.screenshot({path:`sx_${name}_${k++}.png`});
  await pg.evaluate(v=>scrollTo(0,v), tops[0]); await pg.waitForTimeout(250); await pg.screenshot({path:`sx_${name}_${k++}.png`}); await pg.waitForTimeout(1600); await pg.screenshot({path:`sx_${name}_${k++}.png`});
  await pg.evaluate(v=>scrollTo(0,v), tops[0]+ih*.6); await pg.waitForTimeout(600); await pg.screenshot({path:`sx_${name}_${k++}.png`});
  for(const i of [1,2,4]){ await pg.evaluate(v=>scrollTo(0,v), tops[i]); await pg.waitForTimeout(1900); await pg.screenshot({path:`sx_${name}_${k++}.png`}); }
  const st = await pg.evaluate(()=>{ const ov=[]; document.querySelectorAll('.js-sx-panel.org').forEach(p=>{ const ts=[...p.querySelectorAll('.sx-t')].filter(t=>t.offsetParent!==null).map(t=>t.getBoundingClientRect()); const tx=p.querySelector('.sx-text').getBoundingClientRect(); for(let a=0;a<ts.length;a++){ for(let b=a+1;b<ts.length;b++){ const A=ts[a],B=ts[b]; if(!(A.right<B.left||A.left>B.right||A.bottom<B.top||A.top>B.bottom)) ov.push('t'+a+'-t'+b); } if(!(ts[a].right<tx.left||ts[a].left>tx.right||ts[a].bottom<tx.top||ts[a].top>tx.bottom)) ov.push('t'+a+'-text'); if(ts[a].right>innerWidth+2||ts[a].bottom>innerHeight+2||ts[a].left<-2||ts[a].top<-2) ov.push('t'+a+'-off'); } }); return {overlaps:ov, H:document.querySelector('#work').offsetHeight}; });
  console.log(name,'errors',errs,JSON.stringify(st)); await pg.close();
}
await b.close();
