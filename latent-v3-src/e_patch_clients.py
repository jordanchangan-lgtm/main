# Adds client projects to "Our work": a row per client; clicking it reveals the pieces below the row with the side
# wipe, each piece opening in the site's own overlay. Idempotent.
import sys, json
P='/home/user/main/latent-v3e/index.html'; s=open(P,encoding='utf-8').read()
if 'js-ow-gal' in s: print('already patched'); sys.exit(0)
media=json.load(open('/home/user/main/latent-v3-src/abaya_media.json'))
pieces=[(n,l) for n,l in media if l!='thumb']; thumb=[n for n,l in media if l=='thumb'][0]
CLIENTS=[dict(name='AS Abaya',kind='Campaign · Abayat Al-Dawam',note='Six frames · Riyadh · 2026',pieces=pieces,thumb=thumb,ar='4/5')]
rows=''
k0=s.count('class="ow-row')
for k,c in enumerate(CLIENTS):
    tiles=''.join('        <figure class="ow-piece rv js-film %s" style="--k:%d;--ar:%s" data-title="%s" data-client="%s" data-note="%s" data-img="1"><img src="%s" alt="%s" loading="lazy" decoding="async"><span class="play">[ Open ]</span></figure>\n'%('pg-l' if j%2==0 else 'pg-r',j,c['ar'],c['name'],c['kind'],lbl+' · '+c['note'],n,lbl) for j,(n,lbl) in enumerate(c['pieces']))
    rows+='''      <a class="ow-row rv js-ow-row js-ow-client" href="#" style="--k:%d" role="button" aria-expanded="false"><b class="ow-n">%02d</b><span class="ow-name">%s</span><span class="ow-kind">%s</span><span class="ow-go js-ow-go">Reveal<i>&#8599;</i></span><span class="ow-pic" style="--ar:%s"><img src="%s" alt="" loading="lazy" decoding="async"></span></a>
      <div class="ow-gal js-ow-gal" hidden>
%s      </div>
'''%(k0+k,k0+k+1,c['name'],c['kind'],c['ar'],c['thumb'],tiles)
i=s.index('    </div>\n  </div>\n</section>', s.index('id="ourwork"')); s=s[:i]+rows+s[i:]
s=s.replace('<p class="cf-p js-words">Things we made for ourselves and for clients. Click one to open it.</p>','<p class="cf-p js-words">Things we made for ourselves and for clients. Open a site, or reveal a campaign.</p>')
CSS='''
/* our work: client rows reveal their pieces below */
.ow-gal{display:grid;grid-template-columns:repeat(6,1fr);gap:clamp(8px,1.2vw,16px);padding:clamp(14px,2.4vh,26px) 0 clamp(20px,3vh,34px);border-bottom:1px solid rgba(20,20,26,.14)}
.ow-gal[hidden]{display:none}
.ow-piece{position:relative;margin:0;aspect-ratio:var(--ar,4/5);overflow:hidden;border-radius:6px;background:#EFECE4;cursor:pointer;opacity:1;transform:none;transition:clip-path .9s cubic-bezier(.76,0,.24,1) calc(var(--k,0) * .08s)}
.ow-piece.pg-l{clip-path:inset(0 100% 0 0 round 6px)}.ow-piece.pg-r{clip-path:inset(0 0 0 100% round 6px)}
.ow-piece.in{clip-path:inset(0 0 0 0 round 6px)}
.ow-piece img{width:100%;height:100%;object-fit:cover;display:block;transition:transform 1s cubic-bezier(.2,.8,.2,1)}
.ow-piece:hover img{transform:scale(1.03)}
.ow-piece .play{position:absolute;left:10px;bottom:8px;font-family:"IBM Plex Mono",monospace;font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:#fff;opacity:0;transition:opacity .3s;text-shadow:0 1px 8px rgba(0,0,0,.5)}
.ow-piece:hover .play{opacity:1}
.ow-row.open .ow-go i{transform:rotate(180deg)}
@media(max-width:820px){.ow-gal{grid-template-columns:repeat(3,1fr);gap:8px}.ow-piece .play{font-size:11px}}
'''
j=s.rfind('</style>'); s=s[:j]+CSS+s[j:]
JS='''
/* our work: a client row opens its pieces below it with the side wipe, and closes them again */
(function(){
  [].forEach.call(document.querySelectorAll(".js-ow-client"), function(a){
    var gal = a.nextElementSibling, go = a.querySelector(".js-ow-go"); if(!gal || !gal.classList.contains("js-ow-gal")) return;
    var pieces = [].slice.call(gal.querySelectorAll(".ow-piece"));
    function toggle(e){ e.preventDefault(); var open = !a.classList.contains("open"); a.classList.toggle("open", open); a.setAttribute("aria-expanded", open ? "true" : "false");
      if(open){ gal.hidden = false; pieces.forEach(function(p){ p.classList.remove("in"); }); void gal.offsetWidth; requestAnimationFrame(function(){ pieces.forEach(function(p){ p.classList.add("in"); }); }); if(go) go.firstChild.textContent = "Close"; }
      else { pieces.forEach(function(p){ p.classList.remove("in"); }); setTimeout(function(){ gal.hidden = true; }, 700); if(go) go.firstChild.textContent = "Reveal"; } }
    a.addEventListener("click", toggle); a.addEventListener("keydown", function(e){ if(e.key === "Enter" || e.key === " ") toggle(e); });
  });
})();
'''
k=s.rfind('</script>'); s=s[:k]+JS+s[k:]
open(P,'w',encoding='utf-8').write(s); print('patched', len(s)//1024,'KB')
