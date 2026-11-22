# The big stylesheet and the drivers leave the HTML for two cached files, so a phone downloads them once. The small
# head bits stay inline. Run last in the chain (after the hero swap). Idempotent.
import re, hashlib, os, sys
P='/home/user/main/latent-v3e/index.html'; M='/home/user/main/latent-v3e/media/'; s=open(P,encoding='utf-8').read()
if 'media/site-' in s: print('already extracted'); sys.exit(0)
for f in os.listdir(M):
    if f.startswith('site-'): os.remove(M+f)
# the stylesheet: the largest <style> block
styles=list(re.finditer(r'<style>(.*?)</style>', s, re.S)); big=max(styles, key=lambda m: len(m.group(1)))
css=big.group(1).encode('utf-8'); cn='site-%s.css'%hashlib.sha1(css).hexdigest()[:10]; open(M+cn,'wb').write(css)
s=s[:big.start()]+'<link rel="stylesheet" href="media/%s">'%cn+s[big.end():]
# the drivers: every inline script in the body, in order, as one file at the first one's place
body=s.index('<body'); blocks=[m for m in re.finditer(r'<script>(.*?)</script>', s, re.S) if m.start()>body]
js='\n;\n'.join(m.group(1) for m in blocks).encode('utf-8'); jn='site-%s.js'%hashlib.sha1(js).hexdigest()[:10]; open(M+jn,'wb').write(js)
out=s[:blocks[0].start()]+'<script src="media/%s"></script>'%jn
last=blocks[0].end()
for m in blocks[1:]: out+=s[last:m.start()]; last=m.end()
out+=s[last:]
open(P,'w',encoding='utf-8').write(out); print('extracted', cn, len(css)//1024,'KB', jn, len(js)//1024,'KB; html', len(out)//1024,'KB')
