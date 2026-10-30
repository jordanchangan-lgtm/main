# The chosen art pieces as a rising field, right under What we make: a pinned black stage; every project's pieces
# sit in columns across the width at a depth; the scroll lifts them all up through the stage, near ones fast and big, far
# ones slow and small, so pieces enter from below and leave at the top past the name, which swaps through a line mask
# the camera reaches its band. Each piece opens in the site's overlay. Idempotent.
import sys, json, random
P='/home/user/main/latent-v3e/index.html'; s=open(P,encoding='utf-8').read()
if 'js-fy' in s: print('already patched'); sys.exit(0)
M=json.load(open('/home/user/main/latent-v3-src/fly_media.json'))
ORDER=[('AS Abaya','Full social media package','Riyadh · Saudi Arabia · 2026'),('Sudqi Planet Identity','Brand identity · social package','Amman · Jordan · 2026'),('Sudqi Planet Store','Store website','Amman · Jordan · 2026'),('Buraq Al Omur','Website','UAE · 2026'),('Rawabina Al Khadraa','Editorial website','Saudi Arabia · 2026'),('Atelier Rebul','Cinematic reels · posts','Jordan · 2026')]
random.seed(23); cards=''; names=''
import math
for pi,(name,kind,meta) in enumerate(ORDER):
    pieces=M[name][:7]; n=len(pieces)   # at most seven pieces a project
    names+='      <div class="fy-name js-fy-name" data-i="%d"><h2 class="fy-h"><span class="pgw"><span class="pgw-in js-fy-word">%s</span></span></h2></div>\n'%(pi,name)
    S=random.uniform(12,14.5); start=random.randrange(3)
    for k,(path,w,h) in enumerate(pieces):
        # one size a project; a piece keeps its own ratio; a website screenshot (landscape) takes the width. Each piece
        # sits in a lane (three across on desktop, two on phones); the browser stacks the pieces of a lane with a gap
        # measured from their real heights, so no piece ever sits on another
        wide=w/h>=1.3; size=S*2.15 if wide else S; sizem=44 if wide else 30
        lane=(start+k)%3
        cards+='      <figure class="fy-card js-fy-card js-film%s" data-i="%d" data-lane="%d" style="--w:%.1f;--wm:%d;--ar:%d/%d" data-title="%s" data-client="%s" data-note="%s" data-img="1"><img src="%s" alt="%s" loading="lazy" decoding="async"><span class="play">[ Open ]</span></figure>\n'%(' fy-ph' if k>=5 else '',pi,lane,size,sizem,w,h,name,kind,'Piece %02d · %s'%(k+1,meta),path,name)
SEC='''<section class="sec dark fy js-fy" id="chosen">
  <div class="fy-hold js-fy-hold" style="--n:%d">
    <div class="fy-stage">
      <p class="fy-kick kb">Chosen art pieces.</p>
      <div class="fy-world js-fy-world">
%s      </div>
      <div class="fy-names">
%s      </div>
      <p class="fy-hint">Scroll to fly through &middot; click a piece to open it</p>
    </div>
  </div>
</section>
'''%(len(ORDER),cards,names)
i=s.index('<section class="sec light cf js-cf js-path ow-sec" id="ourwork">'); s=s[:i]+SEC+s[i:]
CSS='''
/* the chosen art pieces: a flight through space */
.fy{padding:0;background:#000;color:var(--ivory)}
.fy-hold{position:relative;height:calc(100svh + var(--n,6) * 190vh)}
.fy-stage{position:sticky;top:0;height:100vh;height:100svh;overflow:hidden;background:#000}
.fy-kick{position:absolute;left:var(--gut);top:clamp(72px,12vh,120px);z-index:5;color:var(--ivory);font-size:clamp(18px,2vw,28px)!important}
.fy-world{position:absolute;inset:0}
.fy-card{position:absolute;left:50%;top:50%;margin:0;width:calc(var(--w) * 1vw);aspect-ratio:var(--ar,4/5);border-radius:4px;overflow:hidden;background:#111;will-change:transform;visibility:hidden;cursor:pointer;z-index:2;box-shadow:0 30px 80px -30px rgba(0,0,0,.9)}
.fy-card img{width:100%;height:100%;object-fit:cover;display:block}
.fy-card .play{position:absolute;left:10px;bottom:8px;font-family:"IBM Plex Mono",monospace;font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:#fff;opacity:0;transition:opacity .3s;text-shadow:0 1px 8px rgba(0,0,0,.6)}
.fy-card:hover .play{opacity:1}
.fy-names{position:absolute;inset:0;display:grid;place-items:center;pointer-events:none;z-index:3;mix-blend-mode:difference}
.fy-name{grid-area:1/1;text-align:center}
.fy-h{margin:clamp(10px,2vh,18px) 0;font-family:"Archivo","Helvetica Neue",Arial,sans-serif;font-weight:700;font-size:clamp(40px,8vw,132px);line-height:.95;letter-spacing:-.04em;text-transform:uppercase;color:#fff}
.fy-h .pgw{display:inline-block;overflow:hidden;vertical-align:bottom;padding:0 .02em .12em;margin:0 -.02em -.12em}
.fy-h .pgw-in{display:inline-block;transform:translateY(112%);transition:none}
.fy-name.on .pgw-in{transform:none;transition:transform .65s cubic-bezier(.16,1,.3,1) .1s}
.fy-name.off .pgw-in{transform:translateY(-112%);transition:transform .35s cubic-bezier(.7,0,.3,1)}
.fy-mono{margin:0;font-family:"IBM Plex Mono",monospace;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(242,239,231,.7)}
.fy-mono b{font-weight:500;color:var(--ember)}
.fy-hint{position:absolute;left:var(--gut);bottom:clamp(24px,5vh,48px);margin:0;font-family:"IBM Plex Mono",monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:rgba(242,239,231,.5);z-index:5}
@media(max-width:820px){.fy-hold{height:calc(100svh + var(--n,6) * 150vh)}.fy-card{width:calc(var(--wm) * 1vw)}.fy-ph{display:none}.fy-h{font-size:clamp(34px,11vw,52px)}.fy-kick{font-size:18px!important}.fy-hint{display:none}}
@media (prefers-reduced-motion:reduce){.fy-hold{height:auto}.fy-stage{position:relative;height:auto;padding:120px var(--gut)}.fy-world{position:relative;display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.fy-card{position:relative;left:auto;top:auto;width:auto;visibility:visible;transform:none!important}.fy-names{display:none}}
'''
j=s.rfind('</style>'); s=s[:j]+CSS+s[j:]
JS='''
/* the field: the scroll lifts every piece up through the pinned stage in lanes (three across on desktop, two on a
   phone), each lane at its own speed so the field has depth; inside a lane the pieces are stacked with a gap measured
   from their real heights, so none ever sits on another. One project at a time: its pieces enter from below, cross
   the stage and leave at the top; then the stage is empty for a stretch, the name goes, and the next project's name
   and pieces arrive. Smoothed frame to frame so it feels filmed */
(function(){
  var sec = document.querySelector(".js-fy"); if(!sec) return;
  var hold = sec.querySelector(".js-fy-hold"), cards = [].slice.call(sec.querySelectorAll(".js-fy-card")), names = [].slice.call(sec.querySelectorAll(".js-fy-name")), N = names.length,
      reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches, at = -1, GAP = 7, REST = 26, cur = -1, target = 0, raf = 0, laid = 0, total = 1, bands = [];
  var C = cards.map(function(c){ return { el: c, i: +c.dataset.i, lane: +c.dataset.lane, c: 0, s: 1, x: 0, h: 0, hidden: false }; });
  function clamp(v){ return Math.min(1, Math.max(0, v)); }
  function layout(){
    var vh = window.innerHeight, vw = window.innerWidth, phone = vw < 820,
        xs = phone ? [-24, 24] : [-33, 0, 33], sp = phone ? [1, .8] : [1, .76, 1.18], L = xs.length, cam0 = 0;
    bands = [];
    for(var pi = 0; pi < N; pi++){
      var cursor = xs.map(function(){ return cam0; }), exit = cam0;
      C.forEach(function(o){
        if(o.i !== pi) return; o.hidden = getComputedStyle(o.el).display === "none"; if(o.hidden) return;
        var l = o.lane % L; o.x = xs[l]; o.s = sp[l]; o.h = o.el.offsetHeight / vh * 100;
        var edge = (50 + o.h / 2 + 3) / o.s, c = Math.max(cursor[l], cam0 + edge);   /* enters from below the screen once the band starts */
        o.c = c; cursor[l] = c + (o.h + GAP) / o.s; exit = Math.max(exit, c + edge);   /* has left the top by here */
      });
      bands.push([cam0, exit]); cam0 = exit + REST;
    }
    total = Math.max(1, cam0 - REST + 6); laid = vw * 10000 + vh;
  }
  function place(cam){
    var vh = window.innerHeight, vw = window.innerWidth; if(laid !== vw * 10000 + vh) layout();
    C.forEach(function(o){
      if(o.hidden) return; var y = (o.c - cam) * o.s;
      if(y < -120 || y > 120){ o.el.style.visibility = "hidden"; return; }
      o.el.style.visibility = "visible";
      o.el.style.transform = "translate3d(calc(-50% + " + (o.x * vw / 100).toFixed(1) + "px), calc(-50% + " + (y * vh / 100).toFixed(1) + "px), 0)";
    });
    var band = -1; for(var k = 0; k < bands.length; k++){ if(cam >= bands[k][0] - 12 && cam <= bands[k][1] + 1){ band = k; break; }   /* the name comes a beat before its first piece */ }
    if(band !== at){ names.forEach(function(n, k){ n.classList.toggle("off", k === at); n.classList.toggle("on", k === band); }); at = band; }
  }
  function tick(){
    raf = 0; cur += (target - cur) * .16; if(Math.abs(target - cur) < .02) cur = target; place(cur);
    if(cur !== target) raf = requestAnimationFrame(tick);
  }
  function onScroll(){
    if(reduce) return; var vh = window.innerHeight, vw = window.innerWidth, b = hold.getBoundingClientRect(); if(b.bottom < -10 || b.top > vh + 10) return;
    if(laid !== vw * 10000 + vh) layout();
    var run = Math.max(1, hold.offsetHeight - vh), p = clamp(-b.top / run); target = p * total;
    if(cur < 0) cur = target; if(!raf) raf = requestAnimationFrame(tick);
  }
  window.addEventListener("scroll", onScroll, { passive:true }); window.addEventListener("resize", function(){ laid = 0; onScroll(); place(cur < 0 ? 0 : cur); });
  window.addEventListener("load", function(){ laid = 0; onScroll(); place(cur < 0 ? 0 : cur); }); onScroll(); place(cur < 0 ? 0 : cur);
})();
'''
k=s.rfind('</script>'); s=s[:k]+JS+s[k:]
open(P,'w',encoding='utf-8').write(s); print('patched', len(s)//1024,'KB', 'cards', len(cards.splitlines()))
