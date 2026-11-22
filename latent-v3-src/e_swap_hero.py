# Swap the hero films and posters of the built E page for new ones. Usage: e_swap_hero.py <d.mp4> <d.jpg> <m.mp4> <m.jpg>
# Copies them into media/ under fresh hashed names (the old ones stay cached nowhere: /media/* is immutable) and
# rewrites the preload links, posters and data-src of the two hero videos. Idempotent for the same inputs.
import sys, hashlib, shutil, re
P='/home/user/main/latent-v3e/index.html'; M='/home/user/main/latent-v3e/media/'
s=open(P,encoding='utf-8').read()
old={'d_mp4':'media/02-ae4a4fc3e1.mp4','d_jpg':'media/01-9c8cbf6e11.jpg','m_mp4':'media/04-f0f04687bf.mp4','m_jpg':'media/03-e05071777b.jpg'}
cur={}
for k,rx in [('d_mp4',r'pv-d js-pv-v"[^>]*data-src="([^"]+)"'),('d_jpg',r'pv-d js-pv-v"[^>]*poster="([^"]+)"'),('m_mp4',r'pv-m js-pv-v"[^>]*data-src="([^"]+)"'),('m_jpg',r'pv-m js-pv-v"[^>]*poster="([^"]+)"')]:
    cur[k]=re.search(rx,s).group(1)
new={}
for k,src,n in [('d_mp4',sys.argv[1],89),('d_jpg',sys.argv[2],88),('m_mp4',sys.argv[3],91),('m_jpg',sys.argv[4],90)]:
    d=open(src,'rb').read(); name='%02d-%s.%s'%(n,hashlib.sha1(d).hexdigest()[:10],src.rsplit('.',1)[1]); open(M+name,'wb').write(d); new[k]='media/'+name
for k in cur:
    if cur[k]!=new[k]: s=s.replace(cur[k],new[k])
# the still under the film, as a real image: what the screen shows first, so the metric measures the picture and not
# the paragraph that follows it. The film covers it the moment it plays.
import re as _re
s=_re.sub(r'<img class="pv-v pv-still-[dm]"[^>]*>\s*','',s)
k=s.index('<video class="pv-v pv-d js-pv-v"')
s=s[:k]+'<img class="pv-v pv-still-d" src="%s" alt="" fetchpriority="high" decoding="async" width="1920" height="1080">\n<img class="pv-v pv-still-m" src="%s" alt="" fetchpriority="high" decoding="async" width="1068" height="1920">\n'%(new['d_jpg'],new['m_jpg'])+s[k:]
if '.pv-still-d{display:none}' not in s:
    j=s.rfind('</style>'); s=s[:j]+'\n.pv-still-d{display:none}.pv-still-m{display:block}@media(min-width:821px){.pv-still-d{display:block}.pv-still-m{display:none}}\n'+s[j:]
open(P,'w',encoding='utf-8').write(s); print(new)
