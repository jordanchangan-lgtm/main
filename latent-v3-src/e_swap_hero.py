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
open(P,'w',encoding='utf-8').write(s); print(new)
