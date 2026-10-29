# Our work rows: real links and hover thumbnails for the three client sites. Idempotent; run after e_patch_fly.py.
import sys
P='/home/user/main/latent-v3e/index.html'; s=open(P,encoding='utf-8').read()
if 'href="https://buraqalomur.com"' in s: print('already patched'); sys.exit(0)
b,q=open('/home/user/main/latent-v3-src/ow_thumbs.txt').read().split()
L=[('Buraq Al Omur','https://buraqalomur.com','media/'+b),('Sudqi Planet','https://sudqiplanet.com','media/'+q),('Rawabina Al Khadraa','https://rawabinaalkhadhraa.com',None)]
for name,href,img in L:
    i=s.index('<span class="ow-name">%s</span>'%name); a=s.rfind('<a class="ow-row',0,i); e=s.index('</a>',i)+4; row=s[a:e]
    row=row.replace('href="#" data-soon="1"','href="%s" target="_blank" rel="noopener"'%href).replace('<span class="ow-go">Soon','<span class="ow-go">Open')
    if img and 'ow-pic' not in row: row=row.replace('</a>','<span class="ow-pic" style="--ar:16/10"><img src="%s" alt="" loading="lazy" decoding="async"></span></a>'%img)
    s=s[:a]+row+s[e:]
open(P,'w',encoding='utf-8').write(s); print('patched links')
