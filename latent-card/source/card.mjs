import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const OUT='../';
const b = await chromium.launch();
// the print PDF: two pages, 91 × 61 mm each (85 × 55 trim + 3 mm bleed), vector text, fonts embedded
let ctx = await b.newContext(); let pg = await ctx.newPage();
await pg.goto('card.html'); await pg.evaluate(()=>document.fonts.ready); await pg.waitForTimeout(300);
await pg.pdf({ path: OUT+'latent-business-card-print.pdf', width:'91mm', height:'61mm', printBackground:true, preferCSSPageSize:true, margin:{top:0,right:0,bottom:0,left:0} });
await ctx.close();
// PNGs at 300 dpi of the trim area (85 × 55 mm = 1004 × 650 px): each face rendered alone at the page origin,
// the body painted the face colour so no edge pixel blends with white
const dsf = 1004 / (85 * 96 / 25.4);
for (const id of ['front','back']) {
  ctx = await b.newContext({ deviceScaleFactor: dsf, viewport:{width:400,height:300} }); pg = await ctx.newPage();
  await pg.goto('card.html'); await pg.evaluate(()=>document.fonts.ready);
  await pg.addStyleTag({ content: '.page{width:85mm;height:55mm}.face{left:0;top:0}' });
  await pg.evaluate((id)=>{ document.querySelectorAll('.page').forEach(p=>{ if(!p.querySelector('#'+id)) p.remove(); });
    document.documentElement.style.background = document.body.style.background = getComputedStyle(document.getElementById(id)).backgroundColor; }, id);
  await pg.waitForTimeout(200);
  await pg.screenshot({ path: OUT+'latent-business-card-'+id+'.png', clip:{x:0,y:0,width:85*96/25.4,height:55*96/25.4} });
  await ctx.close();
}
await b.close();
