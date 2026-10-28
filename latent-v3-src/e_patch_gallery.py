# Featured gallery after Our work: the 21st.dev ScrollGallery mechanism ported to the site's own vanilla drivers.
# A pinned dark stage; each next piece wipes in through twenty horizontal strips as the page scrolls, the active
# piece easing from 1.25 to 1; the project name slides out and in on the band; the link updates. Idempotent.
import sys, json
P='/home/user/main/latent-v3e/index.html'; s=open(P,encoding='utf-8').read()
if 'js-sg' in s: print('already patched'); sys.exit(0)
ab=[n for n,l in json.load(open('/home/user/main/latent-v3-src/abaya_media.json')) if l=='Cover'][0]
SLIDES=[('Atelier Rebul','Perfume · Istanbul','media/14-e1887959c2.jpg','#work'),
        ('Cube Coffee House','Identity + campaign · Amman','media/17-e2990e6d14.jpg','#work'),
        ('Rawabina Al Khadraa','Editorial website · Amman','media/19-de56f4747b.jpg','#ourwork'),
        ('AS Abaya','Campaign · Abayat Al-Dawam','%s'%ab,'#ourwork'),
        ('Latent','Identity + brand film · Amman','media/18-b1760e8edf.jpg','https://latent-studio-ai.com')]
N=len(SLIDES); PER=120; D0=40; D1=40
frames=''.join('      <figure class="sg-frame js-sg-frame" data-k="%d"><img src="%s" alt="%s" loading="%s" decoding="async"></figure>\n'%(k,img,t,'eager' if k==0 else 'lazy') for k,(t,sub,img,href) in enumerate(SLIDES))
data=json.dumps([dict(title=t,sub=sub,href=href) for t,sub,img,href in SLIDES])
SEC='''<section class="sec dark sg js-sg" id="featured" data-slides='%s'>
  <div class="sg-hold js-sg-hold" style="--n:%d;--per:%d;--d0:%d;--d1:%d">
    <div class="sg-stage">
      <div class="sg-images js-sg-images">
%s      </div>
      <div class="sg-band">
        <div class="sg-band-in">
          <p class="sg-prefix">Featured</p>
          <div class="sg-title"><p class="sg-title-in js-sg-title">%s</p></div>
          <a class="sg-link js-sg-link" href="%s">Open <i>&#8599;</i></a>
        </div>
      </div>
      <p class="sg-count js-sg-count">01 / %02d</p>
    </div>
  </div>
</section>
'''%(data.replace("'","&#39;"),N,PER,D0,D1,frames,SLIDES[0][0],SLIDES[0][3],N)
i=s.index('<!-- ================= SECTORS'); s=s[:i]+SEC+s[i:]
CSS='''
/* featured: the strip-wipe gallery */
.sg{padding:0;background:var(--ink);color:var(--ivory)}
.sg-hold{position:relative;height:calc(100svh + (var(--n) - 1) * var(--per) * 1vh + (var(--d0) + var(--d1)) * 1vh)}
.sg-stage{position:sticky;top:0;height:100vh;height:100svh;overflow:hidden;background:var(--ink)}
.sg-images{position:absolute;inset:0}
.sg-frame{position:absolute;inset:0;margin:0;transform:translateZ(0);backface-visibility:hidden}
.sg-frame img{width:100%;height:100%;object-fit:contain;object-position:center;display:block;transform-origin:center center;backface-visibility:hidden;mask-size:100% 100%;-webkit-mask-size:100% 100%;mask-repeat:no-repeat;-webkit-mask-repeat:no-repeat;will-change:transform,mask-image}
.sg-frame:not(:first-child) img{mask-image:linear-gradient(to bottom,transparent 0%,transparent 100%);-webkit-mask-image:linear-gradient(to bottom,transparent 0%,transparent 100%)}
.sg-band{position:absolute;left:0;top:50%;z-index:2;width:100%;transform:translateY(-50%);border-bottom:1px solid rgba(242,239,231,.2)}
.sg-band-in{display:flex;gap:32px;padding:0 var(--gut) 10px;align-items:baseline}
.sg-prefix,.sg-title-in,.sg-link{margin:0;font-family:"Archivo","Helvetica Neue",Arial,sans-serif;font-weight:500;font-size:clamp(18px,2.5vw,36px);line-height:1;letter-spacing:-.02rem;color:#fff;text-shadow:0 1px 18px rgba(0,0,0,.35)}
.sg-prefix{flex:1}
.sg-title{position:relative;flex:2;height:1.15em;overflow:hidden;font-size:clamp(18px,2.5vw,36px)}
.sg-title-in{will-change:transform;transition:transform .3s cubic-bezier(.2,.8,.2,1)}
.sg-title-in.out-up{transform:translateY(-120%)}.sg-title-in.out-down{transform:translateY(120%)}
.sg-title-in.snap{transition:none}
.sg-link{flex:1;display:flex;justify-content:flex-end;text-decoration:none;gap:.3em}.sg-link i{font-style:normal;transition:transform .3s cubic-bezier(.2,.8,.2,1)}.sg-link:hover i{transform:translate(2px,-2px)}
.sg-count{position:absolute;left:var(--gut);top:clamp(72px,12vh,120px);margin:0;font-family:"IBM Plex Mono",monospace;font-size:11px;letter-spacing:.16em;color:var(--ember)}
@media(max-width:820px){.sg-prefix{display:none}.sg-band-in{gap:16px;padding-bottom:8px}.sg-prefix,.sg-title-in,.sg-link,.sg-title{font-size:18px}}
@media (prefers-reduced-motion:reduce){.sg-hold{height:auto}.sg-stage{position:relative}.sg-frame:not(:first-child){display:none}.sg-frame img{transform:none!important}}
'''
j=s.rfind('</style>'); s=s[:j]+CSS+s[j:]
JS='''
/* featured: the strip-wipe gallery, after the 21st.dev ScrollGallery. Progress comes from the hold's position; each
   transition spans --per vh after --d0 vh of lead; piece k wipes in through twenty strips during transition k-1 and
   eases from 1.25 to 1 across two transitions; the title slides out and in once a transition passes 0.3 */
(function(){
  var sec = document.querySelector(".js-sg"); if(!sec) return;
  var hold = sec.querySelector(".js-sg-hold"), frames = [].slice.call(sec.querySelectorAll(".js-sg-frame")), imgs = frames.map(function(f){ return f.querySelector("img"); }),
      title = sec.querySelector(".js-sg-title"), link = sec.querySelector(".js-sg-link"), count = sec.querySelector(".js-sg-count"), slides = JSON.parse(sec.getAttribute("data-slides")),
      reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches, ticking = false, N = frames.length, STRIPS = 20, SPEED = 2, FROM = 1.25, TO = 1, STEP = (FROM - TO) / 2, THRESH = .3;
  var per = parseFloat(hold.style.getPropertyValue("--per")), d0 = parseFloat(hold.style.getPropertyValue("--d0")), d1 = parseFloat(hold.style.getPropertyValue("--d1")), total = (N - 1) * per + d0 + d1;
  var bounds = []; for(var j = 0; j < STRIPS; j++){ var pos = STRIPS - j - 1, st = 100 / STRIPS; bounds.push({ lower: (pos + 1) * st, upperGap: pos * st - .1, delay: (j / STRIPS) * .5 }); }
  var HID = "linear-gradient(to bottom, transparent 0%, transparent 100%)", REV = "linear-gradient(to bottom, black 0%, black 100%)";
  function mask(el, v){ el.style.maskImage = v; el.style.webkitMaskImage = v; }
  function strip(p){ var iv = []; for(var j = 0; j < STRIPS; j++){ var b = bounds[j], adj = Math.max(0, Math.min(1, (p - b.delay) * SPEED)); if(adj <= 0) continue; var h = b.lower - b.upperGap; iv.push({ top: b.lower - adj * h, bottom: b.lower }); }
    if(!iv.length) return HID; iv.sort(function(a, b){ return a.top - b.top; }); var m = [iv[0]]; for(var k = 1; k < iv.length; k++){ var l = m[m.length - 1], n = iv[k]; if(n.top <= l.bottom) l.bottom = Math.max(l.bottom, n.bottom); else m.push(n); }
    var stops = [], cur = 0; m.forEach(function(r){ if(r.top > cur) stops.push("transparent " + cur + "%", "transparent " + r.top + "%"); stops.push("black " + r.top + "%", "black " + r.bottom + "%"); cur = r.bottom; }); if(cur < 100) stops.push("transparent " + cur + "%", "transparent 100%");
    return "linear-gradient(to bottom, " + stops.join(", ") + ")"; }
  function scaleFor(k, idx, p){ var d = idx + p - k; if(d <= 0) return FROM; if(d >= 2) return TO; return FROM - STEP * d; }
  var cur = 0, busy = false, queued = null;
  function setSlide(i){ if(link){ link.href = slides[i].href; if(/^https?:/.test(slides[i].href)){ link.target = "_blank"; link.rel = "noopener"; } else { link.removeAttribute("target"); link.removeAttribute("rel"); } } if(count) count.textContent = (i + 1 < 10 ? "0" : "") + (i + 1) + " / " + (N < 10 ? "0" : "") + N; }
  function swapTitle(i, dir){ if(i === cur || !title) return; if(busy){ queued = i; return; } busy = true; setSlide(i);
    title.classList.remove("snap"); title.classList.add(dir === "down" ? "out-up" : "out-down");
    setTimeout(function(){ title.textContent = slides[i].title; title.classList.add("snap"); title.classList.remove("out-up", "out-down"); title.classList.add(dir === "down" ? "out-down" : "out-up"); void title.offsetWidth; title.classList.remove("snap"); title.classList.remove("out-up", "out-down");
      setTimeout(function(){ cur = i; busy = false; if(queued !== null && queued !== cur){ var q = queued; queued = null; swapTitle(q, dir); } }, 320); }, 320); }
  var last = 0;
  function frame(){ ticking = false; if(reduce) return; var vh = window.innerHeight, b = hold.getBoundingClientRect(); if(b.bottom < -10 || b.top > vh + 10) return;
    var run = Math.max(1, hold.offsetHeight - vh), pr = Math.min(1, Math.max(0, -b.top / run)) * total, ip;
    if(pr <= d0) ip = 0; else if(pr >= d0 + (N - 1) * per) ip = N - 1; else ip = (pr - d0) / per;
    var idx = Math.floor(ip), p = ip - idx, dir = ip >= last ? "down" : "up"; last = ip;
    var want = (p >= THRESH) ? Math.min(idx + 1, N - 1) : idx; if(want !== cur){ queued = want; if(!busy) swapTitle(want, dir); }
    imgs.forEach(function(im, k){ im.style.transform = "translate3d(0,0,0) scale(" + scaleFor(k, idx, p).toFixed(4) + ")"; if(k === 0) return; var t = k - 1;
      if(t < idx) mask(im, REV); else if(t === idx) mask(im, strip(p)); else mask(im, HID); });
  }
  imgs.forEach(function(im, k){ im.style.transform = "translate3d(0,0,0) scale(" + FROM + ")"; if(k) mask(im, HID); });
  window.addEventListener("scroll", function(){ if(!ticking){ ticking = true; requestAnimationFrame(frame); } }, { passive:true }); window.addEventListener("resize", frame); window.addEventListener("load", frame); frame();
})();
'''
k=s.rfind('</script>'); s=s[:k]+JS+s[k:]
open(P,'w',encoding='utf-8').write(s); print('patched', len(s)//1024,'KB')
