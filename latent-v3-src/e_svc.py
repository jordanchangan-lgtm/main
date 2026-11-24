# The four service pages (English and Arabic) built in another session on 24 Nov 2026 and already indexed: copied
# in unchanged from latent-v3-src/svc/, with their media, their sitemap and llms.txt entries, and the Services
# column in the footer of both home pages. Run last in the chain, after e_build_ar.py. Idempotent.
import os, re, shutil
SRC='/home/user/main/latent-v3-src/svc'; D='/home/user/main/latent-v3e'
PAGES=['ai-video-production','ai-product-photography','brand-identity','website-design']
for p in PAGES:
    for lang in ['', 'ar/']:
        os.makedirs(D+'/'+lang+p, exist_ok=True); shutil.copy2(SRC+'/'+lang+p+'/index.html', D+'/'+lang+p+'/index.html')
if os.path.isdir(D+'/media/svc'): shutil.rmtree(D+'/media/svc')
shutil.copytree(SRC+'/media/svc', D+'/media/svc')
# sitemap: one entry per page, English 0.8, Arabic 0.7
sm=open(D+'/sitemap.xml',encoding='utf-8').read()
if 'ai-video-production' not in sm:
    ent=''
    for p in PAGES:
        for lang,pr in [('',0.8),('ar/',0.7)]:
            ent+='  <url>\n    <loc>https://latent-studio-ai.com/%s%s/</loc>\n    <xhtml:link rel="alternate" hreflang="en" href="https://latent-studio-ai.com/%s/"/>\n    <xhtml:link rel="alternate" hreflang="ar" href="https://latent-studio-ai.com/ar/%s/"/>\n    <lastmod>2026-11-24</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>%.1f</priority>\n  </url>\n'%(lang,p,p,p,pr)
    sm=sm.replace('</urlset>', ent+'</urlset>'); open(D+'/sitemap.xml','w',encoding='utf-8').write(sm)
# llms.txt: the service pages section before the clients
ll=open(D+'/llms.txt',encoding='utf-8').read()
if '## Service pages' not in ll:
    sec='''## Service pages
- AI video production: https://latent-studio-ai.com/ai-video-production/ (Arabic: https://latent-studio-ai.com/ar/ai-video-production/). AI reels, ad films, product films and talking AI characters for brands in Jordan, Saudi Arabia and the Gulf. Directed like film, delivered in days. From 200 JD.
- AI product photography: https://latent-studio-ai.com/ai-product-photography/ (Arabic: https://latent-studio-ai.com/ar/ai-product-photography/). AI product photos, campaign visuals, posts and carousels that keep your product exact. For brands in Jordan, Saudi Arabia and the Gulf. From 200 JD.
- Brand identity design: https://latent-studio-ai.com/brand-identity/ (Arabic: https://latent-studio-ai.com/ar/brand-identity/). Logos, colour, type, brand books and packaging for brands in Jordan, Saudi Arabia and the Gulf, in Arabic and Latin. Latent Studio, Amman.
- Website design: https://latent-studio-ai.com/website-design/ (Arabic: https://latent-studio-ai.com/ar/website-design/). Cinematic, fast, phone-first websites, online stores and portfolios for brands in Jordan, Saudi Arabia and the Gulf. Arabic and English. Latent Studio, Amman.

'''
    ll=ll.replace('## Clients', sec+'## Clients',1) if '## Clients' in ll else ll+'\n'+sec
    open(D+'/llms.txt','w',encoding='utf-8').write(ll)
# the Services column in both footers, and room for four columns on a phone
COL={'index.html':'<p class="sp-blk"><b>Services</b><a href="ai-video-production/">[ AI video ]</a><br><a href="ai-product-photography/">[ AI photos ]</a><br><a href="brand-identity/">[ Brand identity ]</a><br><a href="website-design/">[ Websites ]</a></p>',
     'ar/index.html':'<p class="sp-blk"><b>الخدمات</b><a href="../ai-video-production/">[ الفيديو ]</a><br><a href="../ai-product-photography/">[ تصوير المنتجات ]</a><br><a href="../brand-identity/">[ الهوية البصرية ]</a><br><a href="../website-design/">[ المواقع ]</a></p>'}
for f,col in COL.items():
    s=open(D+'/'+f,encoding='utf-8').read()
    if 'ai-video-production/' not in s:
        m=re.search(r'(<div class="c-br sp-cols[^>]*>\s*<p class="sp-blk">.*?</p>)', s, re.S); assert m, f
        s=s[:m.end()]+'\n        '+col+s[m.end():]
        s=s.replace('</head>','<style>@media (max-width:760px){#contact .c-br.sp-cols{flex-wrap:wrap;row-gap:14px}}</style>\n</head>',1)
        open(D+'/'+f,'w',encoding='utf-8').write(s)
print('svc ok:', len(PAGES)*2, 'pages,', len(os.listdir(D+'/media/svc')), 'media files')
