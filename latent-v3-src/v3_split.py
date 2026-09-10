# the deploy folder: a small index.html and a media/ folder, from the single-file build
import re,base64,hashlib,os,shutil
import os
SRC=os.environ.get('OUT','/home/user/main/latent-v3')+'/index.html'; OUT=os.environ.get('OUT','/home/user/main/latent-v3')+'/'; SINGLE='/tmp/claude-0/-home-user-main/ebce930a-c60e-53f2-9cc9-6aaf1c614988/scratchpad/'+os.environ.get('SINGLE','v3_single.html')
s=open(SRC,encoding='utf-8').read()
if 'data-u-src' not in s and 'media/' in s: raise SystemExit('already split; rebuild first')
shutil.copy(SRC,SINGLE)
shutil.rmtree(OUT+'media',ignore_errors=True); os.makedirs(OUT+'media')
EXT={'image/jpeg':'jpg','image/png':'png','image/webp':'webp','video/mp4':'mp4','video/webm':'webm'}
files={}; n=[0]
def store(mime,b64):
    raw=base64.b64decode(b64); h=hashlib.md5(raw).hexdigest()[:10]
    if h not in files:
        n[0]+=1; fn='media/%02d-%s.%s'%(n[0],h,EXT[mime]); open(OUT+fn,'wb').write(raw); files[h]=fn
    return files[h]
# owners: src/poster carrying a large data URI
def own(m): return '%s="%s"'%(m.group(1), store(m.group(2), m.group(3)))
s=re.sub(r'\b(src|poster)="data:(image/[a-z]+|video/[a-z0-9]+);base64,([A-Za-z0-9+/=]{20000,})"(?: data-u-(?:src|poster)="u\d+")?', own, s)
# the phone poster attribute on the method film
s=re.sub(r'data-poster-m="data:(image/[a-z]+);base64,([A-Za-z0-9+/=]{2000,})"', lambda m:'data-poster-m="%s"'%store(m.group(1),m.group(2)), s)
# refs point at their owner: resolve them now
owners={}
for m in re.finditer(r'\b(src|poster)="(media/[^"]+)" data-u-(src|poster)="(u\d+)"', open(SINGLE,encoding='utf-8').read()): pass
# simpler: map uN -> path by walking the single file
single=open(SINGLE,encoding='utf-8').read()
for m in re.finditer(r'\b(?:src|poster)="data:([^;]+);base64,([A-Za-z0-9+/=]{20000,})" data-u-(?:src|poster)="(u\d+)"', single):
    owners[m.group(3)]=store(m.group(1),m.group(2))
def ref(m):
    attr=m.group(1); uid=m.group(2)
    return '%s="%s"'%(attr, owners[uid])
s=re.sub(r'data-ref-(src|poster)="(u\d+)\|(?:src|poster)"', ref, s)
# any leftover large data URIs in <source> tags or CSS url()
s=re.sub(r'<source([^>]*?)src="data:(video/[a-z0-9]+);base64,([A-Za-z0-9+/=]{20000,})"', lambda m:'<source%ssrc="%s"'%(m.group(1),store(m.group(2),m.group(3))), s)
s=re.sub(r'url\("data:(image/[a-z]+);base64,([A-Za-z0-9+/=]{20000,})"\)', lambda m:'url("%s")'%store(m.group(1),m.group(2)), s)
# the hero film may load ahead; every other film waits until it is needed
s=s.replace('class="pv-v pv-d js-pv-v" muted loop playsinline preload="metadata"','class="pv-v pv-d js-pv-v" muted loop playsinline preload="auto"')
s=s.replace('class="pv-v pv-m js-pv-v" muted loop playsinline preload="metadata"','class="pv-v pv-m js-pv-v" muted loop playsinline preload="auto"')
s=s.replace('class="js-tile-v" muted loop playsinline preload="metadata"','class="js-tile-v" muted loop playsinline preload="none"')
# ---- load order on a phone: the hero's poster first, then only the hero cut that is displayed;
#      the method film waits until its panel is near; the portfolio's stills are low priority ----
hero=[]
def hero_v(m):
    tag=m.group(0)
    src=re.search(r' src="(media/[^"]+)"',tag).group(1); poster=re.search(r' poster="(media/[^"]+)"',tag).group(1)
    hero.append((('m' if 'pv-m' in tag else 'd'),src,poster))
    tag=tag.replace(' src="%s"'%src,' data-src="%s"'%src).replace('preload="auto"','preload="none"')
    return tag
s=re.sub(r'<video class="pv-v pv-[dm] js-pv-v"[^>]*>', hero_v, s)
pre=''.join('<link rel="preload" as="image" href="%s" media="%s" fetchpriority="high">\n'%(poster,'(max-width:820px)' if k=='m' else '(min-width:821px)') for k,src,poster in hero)
s=s.replace('<title>', pre+'<title>',1)
# the method film: no autoplay, sources become data attributes, played when near
def method_v(m):
    tag=m.group(0)
    sm=re.search(r'<source src="(media/[^"]+)"[^>]*media="\(max-width: 767px\)">',tag); sd=re.search(r'<source src="(media/[^"]+)" type="video/mp4">',tag)
    head=re.search(r'<video[^>]*>',tag).group(0).replace(' autoplay','').replace('preload="metadata"','preload="none"')
    head=head.replace('<video','<video data-src-m="%s" data-src="%s"'%(sm.group(1),sd.group(1)),1)
    return head
s=re.sub(r'<video class="method-v js-method-v"[^>]*>(?:\s*<source[^>]*>)+', method_v, s)
s=s.replace('<img src="media/','<img fetchpriority="low" src="media/')
LOADER='''<script>
/* what loads first: the hero cut this screen shows, and nothing else heavy until it is needed */
(function(){
  var mq = matchMedia("(max-width:820px)");
  function hero(){ [].forEach.call(document.querySelectorAll(".js-pv-v"), function(v){
    var mine = v.classList.contains("pv-m") === mq.matches;
    if(mine && !v.getAttribute("src")){ v.src = v.getAttribute("data-src"); v.preload = "auto"; v.load(); }
  }); }
  hero(); if(mq.addEventListener) mq.addEventListener("change", hero);
  var mv = document.querySelector(".js-method-v");
  if(mv){
    function arm(){ if(mv.getAttribute("src")) return; mv.src = matchMedia("(max-width: 767px)").matches ? mv.getAttribute("data-src-m") : mv.getAttribute("data-src"); mv.preload = "auto"; var p = mv.play(); if(p && p.catch) p.catch(function(){}); }
    if("IntersectionObserver" in window) new IntersectionObserver(function(es, o){ es.forEach(function(e){ if(e.isIntersecting){ arm(); o.disconnect(); } }); }, { rootMargin:"150% 0px" }).observe(mv);
    else arm();
  }
})();
</script>
'''
_k=s.rfind('<script>'); s=s[:_k]+LOADER+s[_k:]
open(SRC,'w',encoding='utf-8').write(s)
left=len(re.findall(r'data:(?:image|video)/[a-z0-9]+;base64,[A-Za-z0-9+/=]{20000,}',s))
tot=sum(os.path.getsize(OUT+f) for f in files.values())
print('index.html %.0f KB, %d media files %.1f MB, large data URIs left: %d'%(len(s.encode())/1024, len(files), tot/1048576, left))
open(OUT+'_headers','w').write('/*\n  Cache-Control: public, max-age=0, must-revalidate\n  X-Content-Type-Options: nosniff\n/media/*\n  Cache-Control: public, max-age=31536000, immutable\n')
