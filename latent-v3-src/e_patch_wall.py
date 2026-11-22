# Our work: "We worked for." A wall of the clients' marks in the site's own manner: marks in ink, each cell's mark,
# name and field rising through line masks as the scroll reaches it and lifting away as it leaves, hairlines between
# rows, mono filters by field. Each cell opens the client's site where there is one. Takes the ledger's place inside
# #ourwork. Idempotent.
import sys, json
P='/home/user/main/latent-v3e/index.html'; s=open(P,encoding='utf-8').read()
if 'js-lw' in s: print('already patched'); sys.exit(0)
MK=json.load(open('/home/user/main/latent-v3-src/wall_marks.json'))
ITEMS=[('AS Abaya','fashion','Fashion','Riyadh','https://asabaya.com',MK['abaya'],''),
       ('Sudqi Planet','beauty','Beauty & care','Amman','https://sudqiplanet.com',MK['sudqi'],''),
       ('Atelier Rebul','beauty','Beauty & care','Amman','https://www.atelierrebul.com.tr',MK['rebul'],''),
       ('Buraq Al Omur','trade','Trade & industry','Zarqa','https://buraqalomur.com',MK['buraq'],''),
       ('Rawabina Al Khadraa','green','Landscaping','Riyadh','https://rawabinaalkhadhraa.com',MK['rawabina'],' lw-ink'),
       ('Cube Coffee House','food','Food & drink','Amman',None,MK['cube'],''),
       ('One Point Solutions','build','BIM & construction','Riyadh','https://onepoint.com.sa',MK['onepoint'],'')]
cats=[]; [cats.append((c,l)) for n,c,l,w,h,m,x in ITEMS if (c,l) not in cats]
pills='      <button type="button" class="lw-f on js-lw-f" data-cat="all">All</button>\n'+''.join('      <button type="button" class="lw-f js-lw-f" data-cat="%s">%s</button>\n'%(c,l) for c,l in cats)
cells=''
for k,(n,c,l,w,h,m,x) in enumerate(ITEMS):
    tag='a' if h else 'div'; attrs=' href="%s" target="_blank" rel="noopener"'%h if h else ''
    cells+='''      <%s class="lw-cell rv js-lw-cell" data-cat="%s" style="--k:%d"%s>
        <span class="lw-mk"><span class="lw-mk-in"><img src="%s" alt="%s" loading="lazy" decoding="async"%s></span></span>
        <span class="lw-t"><span class="lw-t-in"><b>%s</b></span></span>
        <span class="lw-t lw-t2"><span class="lw-t-in">%s &middot; %s</span></span>
      </%s>
'''%(tag,c,k,attrs,m,n,(' class="lw-inkimg"' if x else ''),n,l,w,tag)
WALL='''    <div class="lw js-lw">
      <div class="lw-grid js-lw-grid">
%s      </div>
    </div>
'''%(cells)
i=s.index('<section class="sec light cf js-cf js-path ow-sec" id="ourwork">'); j=s.index('</section>',i); sec=s[i:j]
a=sec.index('    <div class="pel-root js-pel">'); b=sec.rindex('    </div>\n  </div>\n')+len('    </div>\n')
sec=sec[:a]+WALL+sec[b:]
sec=sec.replace('<h2 class="cf-h js-words">Our work.</h2>','<h2 class="cf-h js-words">We worked for.</h2>')
sec=sec.replace('Things we made for ourselves and for clients, newest first. Open a row for the story and the link.','Brands in Jordan, Saudi Arabia and the Emirates that trust us with their identity, their feed and their site.')
s=s[:i]+sec+s[j:]
CSS='''
/* we worked for: the wall of marks */
.lw{width:100%;margin-top:clamp(10px,2vh,24px)}
.lw-filters{display:flex;flex-wrap:wrap;gap:6px clamp(16px,2.2vw,30px);margin:0 0 clamp(14px,2.4vh,24px)}
.lw-f{-webkit-appearance:none;appearance:none;background:none;border:0;padding:8px 0;margin:0;cursor:pointer;position:relative;font-family:"IBM Plex Mono",monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--stone);transition:color .3s ease}
.lw-f::after{content:'';position:absolute;left:0;right:0;bottom:4px;height:1px;background:var(--ink);transform:scaleX(0);transform-origin:0 50%;transition:transform .45s cubic-bezier(.2,.8,.2,1)}
.lw-f:hover,.lw-f.on{color:var(--ink)}
.lw-f.on::after{transform:scaleX(1)}
.lw-f:focus-visible{outline:2px solid var(--ink);outline-offset:2px}
.lw-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));column-gap:clamp(18px,3vw,48px);border-top:1px solid rgba(20,20,26,.14)}
.lw-cell{display:flex;flex-direction:column;align-items:flex-start;gap:14px;min-width:0;padding:clamp(26px,4vh,44px) 0 clamp(22px,3.4vh,36px);border-bottom:1px solid rgba(20,20,26,.14);text-decoration:none;color:var(--ink)}
.lw-cell.rv{opacity:1!important;transform:none!important}
.lw-mk{display:block;height:clamp(52px,6vw,84px);overflow:hidden;padding-bottom:2px}
.lw-mk-in{display:block;height:100%;transform:translateY(112%);transition:transform .9s cubic-bezier(.19,1,.22,1)}
.lw-mk img{display:block;height:100%;width:auto;max-width:min(84%,340px);object-fit:contain;object-position:left center;transition:opacity .3s ease}
.lw-inkimg{filter:grayscale(1) brightness(.28) contrast(1.4)}
.lw-t{display:block;overflow:hidden;font-family:"IBM Plex Mono",monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase;line-height:1.5;color:var(--stone)}
.lw-t b{font-weight:500;color:var(--ink)}
.lw-t2{margin-top:-8px}
.lw-t-in{display:block;transform:translateY(112%);transition:transform .8s cubic-bezier(.19,1,.22,1) .08s}
.lw-t2 .lw-t-in{transition-delay:.16s}
.lw-cell.in .lw-mk-in,.lw-cell.in .lw-t-in{transform:none}
.lw-cell.out .lw-mk-in,.lw-cell.out .lw-t-in{transform:translateY(-112%);transition-duration:.5s}
.lw-cell.in .lw-mk-in{transition-delay:calc(var(--k,0) * .07s)}
.lw-cell.in .lw-t-in{transition-delay:calc(.08s + var(--k,0) * .07s)}
.lw-cell.in .lw-t2 .lw-t-in{transition-delay:calc(.16s + var(--k,0) * .07s)}
a.lw-cell:hover .lw-mk img{opacity:.55}
a.lw-cell:hover .lw-t b{color:var(--marrow)}
.lw-cell:focus-visible{outline:2px solid var(--ink);outline-offset:-2px}
.lw-cell.off{display:none}
@media(max-width:820px){.lw-grid{grid-template-columns:repeat(2,minmax(0,1fr));column-gap:18px}.lw-cell{padding:22px 0 18px;gap:12px}.lw-mk{height:44px}.lw-mk img{max-width:92%}.lw-filters{gap:4px 16px}}
@media (prefers-reduced-motion:reduce){.lw-mk-in,.lw-t-in{transform:none!important;transition:none!important}}
'''
j=s.rfind('</style>'); s=s[:j]+CSS+s[j:]
JS='''
/* the wall: a filter keeps one field's marks; the kept ones rise again in order */
(function(){
  var w = document.querySelector(".js-lw"); if(!w) return;
  var fs = [].slice.call(w.querySelectorAll(".js-lw-f")), cells = [].slice.call(w.querySelectorAll(".js-lw-cell"));
  fs.forEach(function(f){ f.addEventListener("click", function(){
    var c = f.dataset.cat; fs.forEach(function(g){ g.classList.toggle("on", g === f); });
    cells.forEach(function(el){ var show = c === "all" || el.dataset.cat === c; el.classList.toggle("off", !show); el.classList.remove("in"); });
    requestAnimationFrame(function(){ requestAnimationFrame(function(){ var n = 0; cells.forEach(function(el){ if(!el.classList.contains("off")){ el.style.setProperty("--k", n++); el.classList.add("in"); } }); }); });
  }); });
})();
'''
k=s.rfind('</script>'); s=s[:k]+'\n'+JS+'\n'+s[k:]
open(P,'w',encoding='utf-8').write(s); print('wall patched', len(s)//1024, 'KB')
