# Drops media files nothing references any more (the page, the stylesheet, the drivers), so the deploy folder carries
# only what the site uses. The share image and the fonts always stay. Run last.
import re, os
D='/home/user/main/latent-v3e/'; M=D+'media/'
text=open(D+'index.html',encoding='utf-8').read()
for f in os.listdir(M):
    if f.startswith('site-'): text+=open(M+f,encoding='utf-8').read()
refs=set(re.findall(r'media/([^"\')\s?#]+)', text)); keep={'og.jpg'}
gone=0
for f in sorted(os.listdir(M)):
    if f=='fonts' or f=='svc' or os.path.isdir(M+f) or f in keep or f in refs or f.startswith('site-'): continue
    os.remove(M+f); gone+=1
print('pruned', gone, 'files; media now', sum(os.path.getsize(M+f) for f in os.listdir(M) if os.path.isfile(M+f))//1024//1024, 'MB +', len(os.listdir(M+'fonts')), 'fonts')
