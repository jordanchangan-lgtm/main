import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
for (const [name, opts] of [['d',{viewport:{width:1440,height:900}}],['m',{...devices['iPhone 13']}]]){
  const pg = await (await b.newContext(opts)).newPage(); const errs=[]; pg.on('pageerror', e=>errs.push(e.message.slice(0,200)));
  await pg.goto('http://127.0.0.1:8094/', {waitUntil:'load'}); await pg.waitForTimeout(600);
  const ih = await pg.evaluate(()=>innerHeight); let k=0, y=0;
  const info = await pg.evaluate(()=>{ const e=document.querySelector('#prices'); return {t:e.getBoundingClientRect().top+scrollY, h:e.offsetHeight}; });
  for(const f of [0.0,0.3,0.55,0.8,1.0]){ const t=info.t+(info.h-ih)*f; while(y<t){ y=Math.min(t,y+170); await pg.evaluate(v=>scrollTo(0,v),y); await pg.waitForTimeout(10);} await pg.waitForTimeout(f===0.55?250:1100); await pg.screenshot({path:`cb_${name}_${k++}.png`}); }
  await pg.fill('.js-cb-idea','A coffee launch in October'); 
  let nav=null; pg.on('framenavigated', f=>{ nav=f.url(); });
  const href = await pg.evaluate(()=>{ const box=document.querySelector('.js-cb-box'); let out=null; const orig=window.location; try{ Object.defineProperty(window,'location',{configurable:true,value:{set href(v){out=v;}}}); }catch(e){} box.dispatchEvent(new Event('submit',{cancelable:true})); return out; });
  const wide = await pg.evaluate(()=>[...document.querySelectorAll('#prices *')].filter(e=>{const r=e.getBoundingClientRect(); return r.width>0 && (r.left<-2||r.right>innerWidth+2);}).length);
  console.log(name,'errors',errs,'href',href && decodeURIComponent(href).slice(0,160).replace(/\n/g,'|'),'wide',wide,'H',info.h); await pg.close();
}
await b.close();
