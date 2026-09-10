// bake the living still into an 8 s loop: node bake.mjs <image> <w> <h> <out.mp4>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs'; import { execSync } from 'child_process';
const [img,W,H,out]=process.argv.slice(2); const w=+W,h=+H, FPS=24, N=8*FPS;
const dir='/tmp/claude-0/-home-user-main/ebce930a-c60e-53f2-9cc9-6aaf1c614988/scratchpad/frames_'+w+'x'+h; fs.rmSync(dir,{recursive:true,force:true}); fs.mkdirSync(dir);
const html=fs.readFileSync('/tmp/claude-0/-home-user-main/ebce930a-c60e-53f2-9cc9-6aaf1c614988/scratchpad/anim.html','utf8').replace('IMG','file://'+img);
fs.writeFileSync(dir+'/a.html',html);
const b=await chromium.launch(); const pg=await (await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:1})).newPage();
await pg.goto('file://'+dir+'/a.html'); await pg.evaluate(([w,h])=>{document.documentElement.style.setProperty('--w',w+'px');document.documentElement.style.setProperty('--h',h+'px');},[w,h]); await pg.waitForTimeout(500);
for(let i=0;i<N;i++){ await pg.evaluate((t)=>setT(t),i/FPS); await pg.screenshot({path:`${dir}/f${String(i).padStart(3,'0')}.png`,clip:{x:0,y:0,width:w,height:h}}); }
await b.close();
execSync(`ffmpeg -v error -y -framerate ${FPS} -i ${dir}/f%03d.png -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -movflags +faststart -an ${out}`);
console.log('baked', out, fs.statSync(out).size);
