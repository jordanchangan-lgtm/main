# Our work as a wall of the clients' marks, the way the reference does it but in the site's own manner: the bold line
# "We worked for.", one quiet sentence, mono filters by field, and a hairline grid of marks in grey that come to ink
# (and colour) under the pointer; each cell opens the client's site when there is one. Takes the ledger's place inside
# #ourwork. Idempotent.
import sys, json
P='/home/user/main/latent-v3e/index.html'; s=open(P,encoding='utf-8').read()
if 'js-lw' in s: print('already patched'); sys.exit(0)
MK=json.load(open('/home/user/main/latent-v3-src/wall_marks.json'))
ITEMS=[('AS Abaya','fashion','Fashion','https://asabaya.com',MK['abaya']),
       ('Sudqi Planet','beauty','Beauty & care','https://sudqiplanet.com',MK['sudqi']),
       ('Atelier Rebul','beauty','Beauty & care','https://www.atelierrebul.com.tr',MK['rebul']),
       ('Buraq Al Omur','trade','Trade & industry','https://buraqalomur.com',MK['buraq']),
       ('Rawabina Al Khadraa','green','Landscaping','https://rawabinaalkhadhraa.com',MK['rawabina']),
       ('Cube Coffee House','food','Food & drink',None,MK['cube'])]
cats=[]; [cats.append((c,l)) for n,c,l,h,m in ITEMS if (c,l) not in cats]
pills='      <button type="button" class="lw-f on js-lw-f" data-cat="all">All</button>\n'+''.join('      <button type="button" class="lw-f js-lw-f" data-cat="%s">%s</button>\n'%(c,l) for c,l in cats)
cells=''
for k,(n,c,l,h,m) in enumerate(ITEMS):
    tag='a' if h else 'div'; attrs=' href="%s" target="_blank" rel="noopener"'%h if h else ''
    cells+='      <%s class="lw-cell rv js-lw-cell" data-cat="%s" style="--k:%d"%s title="%s"><img src="%s" alt="%s" loading="lazy" decoding="async"></%s>\n'%(tag,c,k+1,attrs,n,m,n,tag)
WALL='''    <div class="lw js-lw">
      <div class="lw-filters rv" style="--k:0">
%s      </div>
      <div class="lw-grid js-lw-grid">
%s      </div>
    </div>
'''%(pills,cells)
i=s.index('<section class="sec light cf js-cf js-path ow-sec" id="ourwork">'); j=s.index('</section>',i); sec=s[i:j]
a=sec.index('    <div class="pel-root js-pel">'); b=sec.rindex('    </div>\n  </div>\n')+len('    </div>\n')
sec=sec[:a]+WALL+sec[b:]
sec=sec.replace('<h2 class="cf-h js-words">Our work.</h2>','<h2 class="cf-h js-words">We worked for.</h2>')
sec=sec.replace('Things we made for ourselves and for clients, newest first. Open a row for the story and the link.','Brands in Jordan, Saudi Arabia and the Emirates that trust us with their identity, their feed and their site, grouped by field.')
s=s[:i]+sec+s[j:]
CSS='''
/* we worked for: the wall of marks */
.lw{width:100%;margin-top:clamp(6px,1vh,12px)}
.lw-filters{display:flex;flex-wrap:wrap;gap:6px clamp(16px,2.2vw,30px);margin:0 0 clamp(18px,3vh,30px)}
.lw-f{-webkit-appearance:none;appearance:none;background:none;border:0;padding:8px 0;margin:0;cursor:pointer;position:relative;font-family:"IBM Plex Mono",monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--stone);transition:color .3s ease}
.lw-f::after{content:'';position:absolute;left:0;right:0;bottom:4px;height:1px;background:var(--ink);transform:scaleX(0);transform-origin:0 50%;transition:transform .45s cubic-bezier(.2,.8,.2,1)}
.lw-f:hover,.lw-f.on{color:var(--ink)}
.lw-f.on::after{transform:scaleX(1)}
.lw-f:focus-visible{outline:2px solid var(--ink);outline-offset:2px}
.lw-grid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));border-top:1px solid rgba(20,20,26,.14);border-left:1px solid rgba(20,20,26,.14)}
.lw-cell{display:flex;align-items:center;justify-content:center;aspect-ratio:1.35;min-width:0;padding:clamp(18px,2.2vw,34px);border-right:1px solid rgba(20,20,26,.14);border-bottom:1px solid rgba(20,20,26,.14);text-decoration:none;color:var(--ink);background:transparent;transition:background .35s ease}
.lw-cell img{display:block;max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;filter:grayscale(1);opacity:.5;transition:opacity .35s ease,filter .35s ease,transform .6s cubic-bezier(.2,.8,.2,1)}
.lw-cell:hover img,.lw-cell:focus-visible img{opacity:1;filter:grayscale(0);transform:scale(1.04)}
.lw-cell:focus-visible{outline:2px solid var(--ink);outline-offset:-2px}
.lw-cell.off{display:none}
.lw-cell.in{transition-delay:calc(.15s + var(--k,0) * .06s)}
@media(max-width:820px){.lw-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.lw-cell{aspect-ratio:1.3;padding:22px}.lw-filters{gap:4px 16px}}
'''
j=s.rfind('</style>'); s=s[:j]+CSS+s[j:]
JS='''
/* the wall: a filter shows one field's marks; the rest fold away */
(function(){
  var w = document.querySelector(".js-lw"); if(!w) return;
  var fs = [].slice.call(w.querySelectorAll(".js-lw-f")), cells = [].slice.call(w.querySelectorAll(".js-lw-cell"));
  fs.forEach(function(f){ f.addEventListener("click", function(){
    var c = f.dataset.cat; fs.forEach(function(g){ g.classList.toggle("on", g === f); });
    cells.forEach(function(el, k){ var show = c === "all" || el.dataset.cat === c; el.classList.toggle("off", !show); el.classList.remove("in"); });
    requestAnimationFrame(function(){ requestAnimationFrame(function(){ var n = 0; cells.forEach(function(el){ if(!el.classList.contains("off")){ el.style.setProperty("--k", n++); el.classList.add("in"); } }); }); });
  }); });
})();
'''
k=s.rfind('</script>'); s=s[:k]+'\n'+JS+'\n'+s[k:]
open(P,'w',encoding='utf-8').write(s); print('wall patched', len(s)//1024, 'KB')
