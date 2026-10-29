# The chosen art pieces as a flight through space, right under What we make: a pinned black stage with perspective;
# every project's pieces hang in depth at scattered positions; the scroll moves the camera forward so the pieces
# fly past and grow, fading as they pass; the project's name sits in the middle and swaps through a line mask when
# the camera reaches its band. Each piece opens in the site's overlay. Idempotent.
import sys, json, random
P='/home/user/main/latent-v3e/index.html'; s=open(P,encoding='utf-8').read()
if 'js-fy' in s: print('already patched'); sys.exit(0)
M=json.load(open('/home/user/main/latent-v3-src/fly_media.json'))
ORDER=[('Latent Studio','Identity · brand film · website','Amman · Jordan · 2026'),('AS Abaya','Campaign · Abayat Al-Dawam','Riyadh · Saudi Arabia · 2026'),('Sudqi Planet','Store website · brand identity','Amman · Jordan · 2026'),('Buraq Al Omur','Website','UAE · 2026'),('Rawabina Al Khadraa','Editorial website','Saudi Arabia · 2026'),('Atelier Rebul','Cinematic reels · posts','Jordan · 2026'),('Cube Coffee House','Identity + campaign','Amman · Jordan · 2026')]
random.seed(23); DEPTH=2400; cards=''; names=''
for pi,(name,kind,meta) in enumerate(ORDER):
    pieces=M[name]; n=len(pieces); z0=pi*DEPTH
    names+='      <div class="fy-name js-fy-name" data-i="%d"><p class="fy-mono"><b>%02d</b> / %02d &middot; %s</p><h2 class="fy-h"><span class="pgw"><span class="pgw-in js-fy-word">%s</span></span></h2><p class="fy-mono fy-meta">%s</p></div>\n'%(pi,pi+1,len(ORDER),kind,name,meta)
    for k,(path,w,h) in enumerate(pieces):
        # scattered around the middle, never on the name: |x|>14vw or |y|>22vh
        while True:
            x=random.uniform(-42,42); y=random.uniform(-34,34)
            if abs(x)>15 or abs(y)>22: break
        z=z0+k*(DEPTH/n)+random.uniform(0,DEPTH/n*.6); size=random.uniform(13,20)
        cards+='      <figure class="fy-card js-fy-card js-film%s" data-i="%d" style="--x:%.1f;--y:%.1f;--z:%.0f;--w:%.1f;--ar:%d/%d" data-title="%s" data-client="%s" data-note="%s" data-img="1"><img src="%s" alt="%s" loading="lazy" decoding="async"><span class="play">[ Open ]</span></figure>\n'%(' fy-ph' if k>=5 else '',pi,x,y,-z,size,w,h,name,kind,'Piece %02d · %s'%(k+1,meta),path,name)
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
.fy-hold{position:relative;height:calc(100svh + var(--n,6) * 170vh)}
.fy-stage{position:sticky;top:0;height:100vh;height:100svh;overflow:hidden;background:#000;perspective:900px;perspective-origin:50% 50%}
.fy-kick{position:absolute;left:var(--gut);top:clamp(72px,12vh,120px);z-index:5;color:var(--ivory);font-size:clamp(18px,2vw,28px)!important}
.fy-world{position:absolute;inset:0;transform-style:preserve-3d}
.fy-card{position:absolute;left:50%;top:50%;margin:0;width:calc(var(--w) * 1vw);aspect-ratio:var(--ar,4/5);border-radius:4px;overflow:hidden;background:#111;transform-style:preserve-3d;will-change:transform,opacity;opacity:0;cursor:pointer;box-shadow:0 30px 80px -30px rgba(0,0,0,.9)}
.fy-card img{width:100%;height:100%;object-fit:cover;display:block}
.fy-card .play{position:absolute;left:10px;bottom:8px;font-family:"IBM Plex Mono",monospace;font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:#fff;opacity:0;transition:opacity .3s;text-shadow:0 1px 8px rgba(0,0,0,.6)}
.fy-card:hover .play{opacity:1}
.fy-names{position:absolute;inset:0;display:grid;place-items:center;pointer-events:none;z-index:3}
.fy-name{grid-area:1/1;text-align:center;opacity:0;transition:opacity .35s ease}
.fy-name.on{opacity:1}
.fy-h{margin:clamp(10px,2vh,18px) 0;font-family:"Archivo","Helvetica Neue",Arial,sans-serif;font-weight:700;font-size:clamp(40px,8vw,132px);line-height:.95;letter-spacing:-.04em;text-transform:uppercase;color:#fff;text-shadow:0 2px 40px rgba(0,0,0,.6)}
.fy-h .pgw{display:inline-block;overflow:hidden;vertical-align:bottom;padding:0 .02em .12em;margin:0 -.02em -.12em}
.fy-h .pgw-in{display:inline-block;transform:translateY(112%);transition:transform .8s cubic-bezier(.19,1,.22,1)}
.fy-name.on .pgw-in{transform:none}
.fy-name.off .pgw-in{transform:translateY(-112%);transition-duration:.45s}
.fy-mono{margin:0;font-family:"IBM Plex Mono",monospace;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(242,239,231,.7)}
.fy-mono b{font-weight:500;color:var(--ember)}
.fy-hint{position:absolute;left:var(--gut);bottom:clamp(24px,5vh,48px);margin:0;font-family:"IBM Plex Mono",monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:rgba(242,239,231,.5);z-index:5}
@media(max-width:820px){.fy-hold{height:calc(100svh + var(--n,6) * 130vh)}.fy-stage{perspective:700px}.fy-card{width:calc(var(--w) * 2.3vw)}.fy-ph{display:none}.fy-h{font-size:clamp(34px,11vw,52px)}.fy-kick{font-size:18px!important}.fy-hint{display:none}}
@media (prefers-reduced-motion:reduce){.fy-hold{height:auto}.fy-stage{position:relative;height:auto;perspective:none;padding:120px var(--gut)}.fy-world{position:relative;display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.fy-card{position:relative;left:auto;top:auto;width:auto;opacity:1;transform:none!important}.fy-names{display:none}}
'''
j=s.rfind('</style>'); s=s[:j]+CSS+s[j:]
JS='''
/* the flight: the camera moves forward with the scroll; every card sits at its depth and slides toward the viewer,
   fading in from far away and out as it passes; the name of the band the camera is in shows in the middle */
(function(){
  var sec = document.querySelector(".js-fy"); if(!sec) return;
  var hold = sec.querySelector(".js-fy-hold"), cards = [].slice.call(sec.querySelectorAll(".js-fy-card")), names = [].slice.call(sec.querySelectorAll(".js-fy-name")), N = names.length,
      reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches, ticking = false, at = -1, DEPTH = 2400, FAR = 3200, NEAR = 140;
  var C = cards.map(function(c){ return { el: c, x: parseFloat(c.style.getPropertyValue("--x")), y: parseFloat(c.style.getPropertyValue("--y")), z: parseFloat(c.style.getPropertyValue("--z")), i: +c.dataset.i }; });
  function clamp(v){ return Math.min(1, Math.max(0, v)); }
  function frame(){
    ticking = false; if(reduce) return; var vh = window.innerHeight, vw = window.innerWidth, b = hold.getBoundingClientRect(); if(b.bottom < -10 || b.top > vh + 10) return;
    var run = Math.max(1, hold.offsetHeight - vh), p = clamp(-b.top / run), cam = p * (N * DEPTH + 600) - 300;
    C.forEach(function(o){
      var z = o.z + cam; if(z < -FAR - 50 || z > NEAR + 50){ o.el.style.opacity = 0; o.el.style.visibility = "hidden"; return; }
      var op = clamp((z + FAR) / 900) * (1 - clamp((z + 60) / (NEAR + 60)));
      o.el.style.visibility = op > 0.01 ? "visible" : "hidden"; o.el.style.opacity = op.toFixed(3);
      o.el.style.transform = "translate3d(calc(-50% + " + (o.x * vw / 100).toFixed(1) + "px), calc(-50% + " + (o.y * vh / 100).toFixed(1) + "px), " + z.toFixed(1) + "px)";
    });
    var band = Math.min(N - 1, Math.max(0, Math.floor((cam + 700) / DEPTH)));
    if(band !== at){ names.forEach(function(n, k){ n.classList.toggle("off", k === at); n.classList.toggle("on", k === band); }); at = band; }
  }
  window.addEventListener("scroll", function(){ if(!ticking){ ticking = true; requestAnimationFrame(frame); } }, { passive:true }); window.addEventListener("resize", frame); window.addEventListener("load", frame); frame();
})();
'''
k=s.rfind('</script>'); s=s[:k]+JS+s[k:]
open(P,'w',encoding='utf-8').write(s); print('patched', len(s)//1024,'KB', 'cards', len(cards.splitlines()))
