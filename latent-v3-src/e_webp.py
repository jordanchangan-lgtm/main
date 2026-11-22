# Every picture the page shows becomes WebP at the same size (about a third lighter); the share image stays JPEG for
# the apps that read it. Runs after the extraction, on the page and the stylesheet. Idempotent.
import re, os, sys
from PIL import Image
D='/home/user/main/latent-v3e/'; P=D+'index.html'; s=open(P,encoding='utf-8').read()
refs=set(re.findall(r'media/(\d+-[0-9a-f]+\.(?:jpg|jpeg|png))', s))
css=[f for f in os.listdir(D+'media') if f.startswith('site-') and f.endswith('.css')]
for c in css: refs|=set(re.findall(r'media/(\d+-[0-9a-f]+\.(?:jpg|jpeg|png))', open(D+'media/'+c,encoding='utf-8').read()))
done=0
for f in sorted(refs):
    src=D+'media/'+f; w=f.rsplit('.',1)[0]+'.webp'; dst=D+'media/'+w
    if not os.path.exists(src): continue
    im=Image.open(src)
    if f.endswith('.png') and im.mode in ('RGBA','LA','P'):
        im=im.convert('RGBA'); im.save(dst,'WEBP',quality=88,method=6)
    else:
        im=im.convert('RGB'); im.save(dst,'WEBP',quality=82,method=6)
    if os.path.getsize(dst)<os.path.getsize(src):
        s=s.replace('media/'+f,'media/'+w); os.remove(src); done+=1
        for c in css:
            t=open(D+'media/'+c,encoding='utf-8').read()
            if 'media/'+f in t: open(D+'media/'+c,'w',encoding='utf-8').write(t.replace('media/'+f,'media/'+w))
    else: os.remove(dst)
open(P,'w',encoding='utf-8').write(s); print('webp', done, 'pictures')
