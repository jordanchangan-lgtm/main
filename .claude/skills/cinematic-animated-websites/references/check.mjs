import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
for (const [name, opts] of [['d',{viewport:{width:1440,height:900}}],['m',{...devices['iPhone 13']}]]){
  const ctx = await b.newContext(opts); const pg = await ctx.newPage(); const errs=[], bad=[]; let bytes3=0; const t0=Date.now();
  pg.on('pageerror', e=>errs.push(e.message)); pg.on('console', m=>{ if(m.type()==='error') errs.push('console: '+m.text().slice(0,120)); });
  pg.on('response', async r=>{ if(r.status()>=400) bad.push(r.status()+' '+r.url().slice(-40)); try{ const h=r.headers(); const len=+(h['content-length']||0); if(Date.now()-t0<3000) bytes3+=len; }catch(e){} });
  await pg.goto('http://127.0.0.1:'+(process.env.PORT||'8091')+'/', {waitUntil:'load'}); await pg.waitForTimeout(3200);
  const hero = await pg.evaluate(()=>{ const vs=[...document.querySelectorAll('.js-pv-v')]; return vs.map(v=>({cls:v.className.replace('pv-v ','').slice(0,12), src:(v.getAttribute('src')||'').slice(-22), disp:getComputedStyle(v).display, rs:v.readyState})); });
  const broken = await pg.evaluate(()=>[...document.images].filter(i=>i.complete && i.naturalWidth===0 && i.getAttribute('src')).length);
  await pg.screenshot({path:`copy_${name}_hero.png`});
  // scroll into the hero lock so its lines come in, then check the bar sits on one line
  await pg.evaluate(()=>{ const h=document.querySelector('.js-lk'); scrollTo(0,(h.offsetHeight-innerHeight)*.9); }); await pg.waitForTimeout(1800);
  await pg.screenshot({path:`copy_${name}_hero2.png`});
  const bar = await pg.evaluate(()=>{ const items=[...document.querySelectorAll('.bar .brand, .bar nav > *')].filter(e=>getComputedStyle(e).display!=='none'); const ys=items.map(e=>Math.round(e.getBoundingClientRect().top)); const right=Math.max(...items.map(e=>e.getBoundingClientRect().right)); return {oneLine: Math.max(...ys)-Math.min(...ys)<6, right:Math.round(right), vw:innerWidth, hs:[...document.querySelectorAll('.hero.home .hs')].map(e=>({op:getComputedStyle(e).opacity,fs:getComputedStyle(e).fontSize,y:Math.round(e.getBoundingClientRect().top)}))}; });
  console.log(name,'bar',JSON.stringify(bar));
  // small text audit on the phone: any visible text node under 11px
  const small = await pg.evaluate(()=>{ const out=[]; const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT); let n; while(n=w.nextNode()){ const t=n.textContent.trim(); if(!t) continue; const el=n.parentElement; const cs=getComputedStyle(el); if(cs.display==='none'||cs.visibility==='hidden') continue; const fs=parseFloat(cs.fontSize); if(fs<11 && el.closest('.bar, .hero, #studio, #method, #sectors, #process, #prices, #contact')) out.push(fs.toFixed(1)+'|'+t.slice(0,20)+'|'+(el.className||el.tagName).toString().slice(0,24)+'<'+(el.parentElement.className||'').toString().slice(0,18)); } return [...new Set(out)].slice(0,12); });
  // walk to the studio statement, craft and method panels
  const shots=[['#studio',0.02],['#studio',0.34],['#studio',0.7],['#method',0.1],['#sectors',0.1]];
  let k=0; for(const [sel,f] of shots){ await pg.evaluate(([s,f])=>{ const e=document.querySelector(s); const hold=e.closest('.lk-hold')||e; const top=hold.getBoundingClientRect().top+scrollY; scrollTo(0, top + (hold.offsetHeight-innerHeight)*f); },[sel,f]); await pg.waitForTimeout(1600); await pg.screenshot({path:`copy_${name}_${k++}.png`}); }
  // statement inside its panel?
  const st = await pg.evaluate(()=>{ const p=document.querySelector('.statement')||document.querySelector('.cs-stmt')||document.querySelector('.st2-line'); const sec=document.querySelector('#studio'); const r=p.getBoundingClientRect(), s=sec.getBoundingClientRect(); return {fs:getComputedStyle(p).fontSize, h:Math.round(r.height), inside: r.top>=s.top-1 && r.bottom<=s.bottom+1, secH:Math.round(s.height)}; });
  console.log(name, 'SMALL', name==='m'?JSON.stringify(small):small.length, 'bytes first 3s', (bytes3/1024).toFixed(0)+'KB', 'hero', JSON.stringify(hero), 'broken', broken, 'errors', errs, 'bad', bad.slice(0,4), 'small', small, 'statement', JSON.stringify(st));
  await ctx.close();
}
await b.close();
