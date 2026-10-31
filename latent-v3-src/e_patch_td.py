# What we make: the eight thumbnails come from the new work. Idempotent.
import re, sys
P='/home/user/main/latent-v3e/index.html'; s=open(P,encoding='utf-8').read()
PIC={0:('media/62-5c561bec59.jpg','1334/750'),   # Posts: Sudqi Planet feed posts, brand book
     1:('media/70-2e601fd268.jpg','4/5'),        # Carousels: AS Abaya
     2:('media/14-e1887959c2.jpg','900/1612'),   # Reels: Atelier Rebul
     3:('media/21-7ad07c68ee.jpg','4/5'),        # Campaigns: AS Abaya
     4:('media/59-1fab143a8d.jpg','1334/750'),   # Brand identities: Sudqi Planet mark
     5:('media/81-53406dc03e.jpg','16/10'),      # Websites: Sudqi Planet store
     6:('media/86-610f686580.jpg','16/10'),      # Portfolios: Rawabina Al Khadraa
     7:('media/68-15e32d59bb.jpg','1334/750')}   # Anything AI: Sudqi Planet product shoot
if 'media/62-5c561bec59.jpg" alt="" loading="lazy" decoding="async"></span>' in s and s.count('td-thumb" style="--ar:1334/750"')>=3: print('already patched'); sys.exit(0)
def row(m):
    i=int(m.group(1)); body=m.group(2); src,ar=PIC[i]
    body=re.sub(r'(<span class="td-thumb" style="--ar:)[^"]*(")', lambda k:k.group(1)+ar+k.group(2), body)
    body=re.sub(r'(<img fetchpriority="low" src=")[^"]*(")', lambda k:k.group(1)+src+k.group(2), body)
    return '<div class="td-item js-td-item%s" data-i="%d">%s' % (m.group(3), i, body)
s2,n=re.subn(r'<div class="td-item js-td-item( on)?" data-i="(\d)">(.*?)(?=<div class="td-item js-td-item|\n\s*</div>\s*\n\s*</div>)', lambda m: '<div class="td-item js-td-item%s" data-i="%s">%s' % (m.group(1) or '', m.group(2), re.sub(r'(<img fetchpriority="low" src=")[^"]*(")', lambda k:k.group(1)+PIC[int(m.group(2))][0]+k.group(2), re.sub(r'(<span class="td-thumb" style="--ar:)[^"]*(")', lambda k:k.group(1)+PIC[int(m.group(2))][1]+k.group(2), m.group(3)))), s, flags=re.S)
open(P,'w',encoding='utf-8').write(s2); print('td patched', n)
