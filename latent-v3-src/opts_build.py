import re, json, base64, io, random
from PIL import Image
s=open('/home/user/main/latent-v3e/index.html').read()
wk=json.loads(re.search(r'window\.__WK=(\[.*?\]);</script>', s).group(1))
tiles=re.findall(r'<div class="pg-tile(?: pg-more)? rv js-pg-tile[^"]*" data-i="(\d)" data-name="([^"]*)" data-piece="([^"]*)"[^>]*>(.*?)</div>\n', s, re.S)
proj={}
for i,name,piece,inner in tiles:
    m=re.search(r'(?:poster|src)="(media/[^"]+\.(?:jpg|png|webp))"', inner); ar=re.search(r'--ar:(\d+)/(\d+)',inner)
    if not m: continue
    proj.setdefault(int(i),{'name':name,'piece':piece,'imgs':[]})['imgs'].append((m.group(1),int(ar.group(1)),int(ar.group(2))))
cache={}
def img(path,maxw=900):
    if path in cache: return cache[path]
    im=Image.open('/home/user/main/latent-v3e/'+path).convert('RGB'); w,h=im.size
    if w>maxw: im=im.resize((maxw,int(h*maxw/w)))
    b=io.BytesIO(); im.save(b,'JPEG',quality=78); cache[path]='data:image/jpeg;base64,'+base64.b64encode(b.getvalue()).decode(); return cache[path]
P=[proj[k] for k in sorted(proj)]
meta={p['t']:p for p in wk}
for p in P: p['meta']=meta.get(p['name'],{'meta':'','note':''})
def esc(x): return x.replace('&','&amp;').replace('<','&lt;')
o1=''
for i,p in enumerate(P):
    cells=''.join('<div class="t"><img src="%s" alt=""><i>%s</i></div>'%(img(a),esc(p['piece'])) for a,w,h in p['imgs'][:3])
    cells+='<div class="t open"><b>%02d</b><span>Reveal full project</span><small>%d more pieces</small></div>'%(i+1,max(0,len(p['imgs'])-3))
    o1+='<div class="blk" data-name="%s" data-piece="%s">%s</div>'%(esc(p['name']),esc(p['piece']),cells)
o2=''
for i,p in enumerate(P):
    nxt=P[(i+1)%len(P)]
    slides=''.join('<figure class="pp-f" style="--ar:%d/%d"><img src="%s" alt=""></figure>'%(w,h,img(a)) for a,w,h in p['imgs'][:4])
    o2+='<div class="pp"><aside class="pp-side"><p class="k">( %02d / %02d )</p><h3>%s</h3><dl><dt>Piece</dt><dd>%s</dd><dt>Meta</dt><dd>%s</dd><dt>Note</dt><dd>%s</dd></dl><a class="pp-next" href="#o2"><img src="%s" alt=""><span>Next<br>%s</span></a></aside><div class="pp-stream">%s</div></div>'%(i+1,len(P),esc(p['name']),esc(p['piece']),esc(p['meta']['meta']),esc(p['meta']['note']),img(nxt['imgs'][0][0]),esc(nxt['name']),slides)
names=''.join('<li data-i="%d"><b>%s</b><span>%s</span></li>'%(i,esc(p['name']),esc(p['piece'])) for i,p in enumerate(P))
imgs3=''.join('<img class="ni-img%s" data-i="%d" src="%s" alt="" style="--ar:%d/%d">'%(' on' if i==0 else '',i,img(p['imgs'][0][0]),p['imgs'][0][1],p['imgs'][0][2]) for i,p in enumerate(P))
random.seed(7); sc=''
allimgs=[(a,w,h,p['name']) for p in P for (a,w,h) in p['imgs'][:4]]
for k,(a,w,h,n) in enumerate(allimgs):
    sc+='<div class="sc-t" style="--x:%d;--y:%d;--r:%d;--ar:%d/%d;--k:%d"><img src="%s" alt=""></div>'%(random.randint(4,88),random.randint(8,80),random.randint(-14,14),w,h,k,img(a))
o5=''
for i,p in enumerate(P):
    a=p['imgs'][0]; b=p['imgs'][1] if len(p['imgs'])>1 else p['imgs'][0]
    o5+='<div class="tu"><figure><img src="%s" alt=""></figure><figure><img src="%s" alt=""></figure><p class="tu-cap"><b>%s</b> %s &middot; %s</p></div>'%(img(a[0]),img(b[0]),esc(p['name']),esc(p['piece']),esc(p['meta']['meta']))
html=open('opts_tpl.html').read()
for k,v in {'@N@':str(len(P)),'@NAME0@':esc(P[0]['name']),'@PIECE0@':esc(P[0]['piece']),'@META0@':esc(P[0]['meta']['meta']),'@O1@':o1,'@O2@':o2,'@IMGS3@':imgs3,'@NAMES@':names,'@SC@':sc,'@O5@':o5}.items(): html=html.replace(k,v)
open('wall_options.html','w').write(html); print(len(html)//1024,'KB', len(P),'projects', len(allimgs),'scatter pieces')
