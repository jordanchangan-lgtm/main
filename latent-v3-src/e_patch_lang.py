# The language gate: on a first visit the page opens on paper with two words, English and عربي, and remembers the
# choice. The same choice as the page fades the gate and replays the hero; the other one goes to the other page.
# Run after e_patch_prices.py, before extraction. Idempotent.
P='/home/user/main/latent-v3e/index.html'; s=open(P,encoding='utf-8').read()
if 'js-lg' in s: print('lang already'); raise SystemExit
head='<script>try{if(!localStorage.getItem("ls-lang"))document.documentElement.classList.add("lg-on")}catch(e){document.documentElement.classList.add("lg-on")}</script>'
s=s.replace('<head>','<head>\n'+head,1)
gate='''<div class="lg js-lg" role="dialog" aria-label="Language">
  <p class="lg-k"><span>Choose your language</span><span class="lg-dot"></span><span class="lg-ar">اختر لغتك</span></p>
  <div class="lg-row">
    <a class="lg-a" href="/" lang="en" data-l="en" style="--d:.1s"><span class="pgw"><span class="pgw-in">English</span></span></a>
    <span class="lg-sep"></span>
    <a class="lg-a" href="/ar/" lang="ar" dir="rtl" data-l="ar" style="--d:.22s"><span class="pgw"><span class="pgw-in">عربي</span></span></a>
  </div>
  <p class="lg-f"><span>Latent Studio</span><span class="lg-dot"></span><span>Amman</span></p>
</div>
'''
s=s.replace('<body>','<body>\n'+gate,1)
js='''<script>
/* the language gate */
(function(){
  var g = document.querySelector(".js-lg"), h = document.documentElement; if(!g) return;
  if(!h.classList.contains("lg-on")){ g.remove(); return; }
  requestAnimationFrame(function(){ requestAnimationFrame(function(){ g.classList.add("in"); }); });
  g.addEventListener("click", function(e){
    var a = e.target.closest("a[data-l]"); if(!a) return; var l = a.getAttribute("data-l");
    try{ localStorage.setItem("ls-lang", l); }catch(x){}
    if(l !== (h.lang || "en").slice(0,2)) return;
    e.preventDefault(); g.classList.add("out"); h.classList.remove("lg-on");
    [].forEach.call(document.querySelectorAll("#top .in"), function(el){ el.classList.remove("in"); void el.offsetWidth; el.classList.add("in"); });
    setTimeout(function(){ g.remove(); }, 750);
  });
})();
</script>
'''
k=s.rfind('</body>'); s=s[:k]+js+s[k:]
face='@font-face{font-family:"IBM Plex Sans Arabic";font-style:normal;font-weight:500;font-display:swap;src:url(media/fonts/plexar-500.woff2) format("woff2")}'
k=s.index('@font-face{font-family:"Archivo"'); s=s[:k]+face+s[k:]
css='''
/* e_patch_lang: the choice sits on the hero itself, in the hero's type; the hero text waits for it */
.lg{position:fixed;inset:0;z-index:300;display:none;flex-direction:column;align-items:center;justify-content:center;gap:clamp(22px,4.5vh,40px);padding:0 var(--gut);background:rgba(20,20,26,.24);color:#fff;font-family:"IBM Plex Mono",monospace;letter-spacing:.04em;text-transform:uppercase;transition:opacity .7s ease}
html.lg-on .lg{display:flex}
html.lg-on{overflow:hidden}
html.lg-on .hero .stage.he,html.lg-on .bar{visibility:hidden}
.lg.out{opacity:0;pointer-events:none}
.lg-k,.lg-f{margin:0;display:flex;align-items:center;gap:12px;font-size:10.5px;letter-spacing:.14em;line-height:1.35;color:rgba(242,239,231,.72);opacity:0;transition:opacity .9s ease .55s}
.lg.in .lg-k,.lg.in .lg-f{opacity:1}
.lg-f{position:absolute;bottom:clamp(18px,3.6vh,34px);left:0;right:0;justify-content:center}
.lg-ar{font-family:"IBM Plex Sans Arabic","Archivo",sans-serif;font-size:12px;letter-spacing:0;text-transform:none;direction:rtl}
.lg-dot{width:3px;height:3px;border-radius:50%;background:var(--marrow)}
.lg-row{display:flex;align-items:center;gap:clamp(22px,4vw,56px)}
.lg-a{text-decoration:none;color:#fff;font-family:"IBM Plex Mono",monospace;font-weight:500;font-size:clamp(24px,3vw,46px);line-height:1.02;letter-spacing:.04em;text-transform:uppercase;transition:color .3s ease}
.lg-a[lang=ar]{font-family:"IBM Plex Sans Arabic","Archivo",sans-serif;font-weight:500;letter-spacing:0;text-transform:none}
.lg-a:hover,.lg-a:focus-visible{color:var(--marrow);outline:0}
.lg-sep{width:1px;height:clamp(26px,3.2vw,50px);background:rgba(242,239,231,.4);transform:scaleY(0);transition:transform .9s cubic-bezier(.19,1,.22,1) .15s}
.lg.in .lg-sep{transform:none}
.lg .pgw{padding:0 .04em .14em;margin:0 -.04em -.14em}
.lg .pgw-in{transform:translateY(112%);transition:transform 1s cubic-bezier(.19,1,.22,1) var(--d,0s)}
.lg.in .pgw-in{transform:none}
@media(max-width:820px){.lg-row{gap:20px}.lg-a{font-size:clamp(26px,7.6vw,34px)}}
html[dir=rtl] .lg-a[lang=en],html[dir=rtl] .lg-k>span:first-child,html[dir=rtl] .lg-f span{font-family:"IBM Plex Mono",monospace!important;letter-spacing:.04em!important;text-transform:uppercase!important}
html[dir=rtl] .lg-a[lang=en]{font-weight:500!important}
html[dir=rtl] .lg-k>span:first-child,html[dir=rtl] .lg-f span{letter-spacing:.14em!important;font-size:10.5px!important}
'''
j=s.rfind('</style>'); s=s[:j]+css+s[j:]
open(P,'w',encoding='utf-8').write(s); print('lang ok')
