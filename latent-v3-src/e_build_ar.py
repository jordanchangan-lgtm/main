# -*- coding: utf-8 -*-
# The Arabic page: the finished English page, every string in Arabic, right to left, in IBM Plex Sans Arabic, with the
# same mechanisms. Written to ar/index.html; the English page gets the language links. Run last, after the prune.
import re, html, json, os, sys
sys.path.insert(0,'/home/user/main/latent-v3-src'); from ar_strings import AR, ATTR, TITLE, DESC
D='/home/user/main/latent-v3e/'; EN=D+'index.html'; os.makedirs(D+'ar',exist_ok=True)
s=open(EN,encoding='utf-8').read()
SITE='https://latent-studio-ai.com'
# the English page: language links and the switch
if 'hreflang="ar"' not in s:
    s=s.replace('<link rel="canonical" href="%s/">'%SITE,'<link rel="canonical" href="%s/">\n<link rel="alternate" hreflang="en" href="%s/">\n<link rel="alternate" hreflang="ar" href="%s/ar/">\n<link rel="alternate" hreflang="x-default" href="%s/">'%(SITE,SITE,SITE,SITE))
    s=s.replace('<a href="#contact">[ Contact ]</a></nav>','<a href="#contact">[ Contact ]</a><a href="ar/" lang="ar" hreflang="ar" class="bar-lang">[ عربي ]</a></nav>',1)
    open(EN,'w',encoding='utf-8').write(s)
a=s
# ---- head
a=a.replace('<html lang="en">','<html lang="ar" dir="rtl">',1)
a=re.sub(r'<title>.*?</title>','<title>%s</title>'%TITLE,a,count=1,flags=re.S)
a=re.sub(r'<meta name="description" content="[^"]*">','<meta name="description" content="%s">'%DESC,a,count=1)
a=a.replace('<link rel="canonical" href="%s/">'%SITE,'<link rel="canonical" href="%s/ar/">'%SITE)
a=a.replace('<meta property="og:url" content="%s/">'%SITE,'<meta property="og:url" content="%s/ar/">'%SITE)
a=a.replace('<meta property="og:locale" content="en_GB">','<meta property="og:locale" content="ar_JO">')
a=re.sub(r'<meta property="og:title" content="[^"]*">','<meta property="og:title" content="%s">'%TITLE,a)
a=re.sub(r'<meta name="twitter:title" content="[^"]*">','<meta name="twitter:title" content="%s">'%TITLE,a)
a=a.replace('<meta property="og:description" content="Brand visuals made with AI, directed like film. Not your average AI post.">','<meta property="og:description" content="صور للعلامات بالذكاء الاصطناعي، مُخرَجة كالفيلم. ليس كأي ذكاء اصطناعي.">')
a=a.replace('<a href="ar/" lang="ar" hreflang="ar" class="bar-lang">[ عربي ]</a>','<a href="../" lang="en" hreflang="en" class="bar-lang">[ EN ]</a>')
# paths: one folder down
a=re.sub(r'((?:src|poster|data-src|data-src-m|data-poster-m|href)=")media/', r'\1../media/', a)
a=a.replace('url(media/','url(../media/')
# structured data in Arabic
def ld_ar(m):
    try: d=json.loads(m.group(1))
    except Exception: return m.group(0)
    if d.get('@type')=='FAQPage':
        for q in d['mainEntity']:
            q['name']=AR.get(q['name'],q['name']); q['acceptedAnswer']['text']=AR.get(q['acceptedAnswer']['text'],q['acceptedAnswer']['text'])
        d['inLanguage']='ar'
    elif d.get('@type')=='ProfessionalService':
        d['url']=SITE+'/ar/'; d['inLanguage']='ar'; d['name']='لاتنت ستوديو'; d['alternateName']='Latent Studio'
        d['description']='استوديو إبداعي في عمّان يعمل بالذكاء الاصطناعي: منشورات، كاروسيل، ريلز، حملات، هويات بصرية، مواقع إلكترونية وبورتفوليو، مُخرَجة كالفيلم.'
        d['address']={"@type":"PostalAddress","addressLocality":"عمّان","addressCountry":"JO"}
        for o in d.get('makesOffer',[]): o['name']=AR.get(o['name'].replace(' package',''),o['name'])+' · باقة'; o['description']=AR.get(o['description'],o['description']); o['url']=SITE+'/ar/#prices'
        for it in d.get('hasOfferCatalog',{}).get('itemListElement',[]): n=it['itemOffered']['name']; it['itemOffered']['name']=AR.get(n,n)
    return '<script type="application/ld+json">'+json.dumps(d,ensure_ascii=False,separators=(',',':'))+'</script>'
a=re.sub(r'<script type="application/ld\+json">(.*?)</script>', ld_ar, a, flags=re.S)
# ---- body text
head,body=a[:a.index('<body')],a[a.index('<body'):]
parts=re.split(r'(<(?:script|style)[^>]*>.*?</(?:script|style)>)', body, flags=re.S)
def tx(m):
    t=m.group(1); u=html.unescape(t); n=re.sub(r'\s+',' ',u).strip()
    if n in AR:
        lead=u[:len(u)-len(u.lstrip())]; trail=u[len(u.rstrip()):]
        return '>'+lead+html.escape(AR[n],quote=False)+trail+'<'
    return m.group(0)
for i in range(0,len(parts),2):
    parts[i]=re.sub(r'>([^<>]+)<', tx, parts[i])
    parts[i]=re.sub(r'((?:placeholder|aria-label|title)=")([^"]*)(")', lambda m: m.group(1)+html.escape(ATTR.get(html.unescape(m.group(2)),html.unescape(m.group(2))),quote=True)+m.group(3), parts[i])
body=''.join(parts)
# gap lines: the mechanics stay left-to-right (left word slides in from the left, right word from the right), so the
# first Arabic word goes into the right slot and the second into the left slot, and the line reads right to left
def swap_gp(m):
    row=m.group(0)
    l=re.search(r'(<span class="gp-l">)(.*?)(</span>)', row, re.S); r=re.search(r'(<span class="gp-r">)(.*?)(</span>)', row, re.S)
    if not l or not r: return row
    row=row[:l.start()]+l.group(1)+r.group(2)+l.group(3)+row[l.end():]
    r=re.search(r'(<span class="gp-r">)(.*?)(</span>)', row, re.S)
    return row[:r.start()]+r.group(1)+l.group(2)+r.group(3)+row[r.end():]
body=re.sub(r'<div class="gp-row">.*?</div>', swap_gp, body, flags=re.S)
a=head+body
# ---- Arabic type and right-to-left rules
CSS='''
@font-face{font-family:"IBM Plex Sans Arabic";font-style:normal;font-weight:400;font-display:swap;src:url(../media/fonts/plexar-400.woff2) format("woff2")}
@font-face{font-family:"IBM Plex Sans Arabic";font-style:normal;font-weight:500;font-display:swap;src:url(../media/fonts/plexar-500.woff2) format("woff2")}
@font-face{font-family:"IBM Plex Sans Arabic";font-style:normal;font-weight:600;font-display:swap;src:url(../media/fonts/plexar-600.woff2) format("woff2")}
@font-face{font-family:"IBM Plex Sans Arabic";font-style:normal;font-weight:700;font-display:swap;src:url(../media/fonts/plexar-700.woff2) format("woff2")}
html[dir=rtl] body, html[dir=rtl] *{font-family:"IBM Plex Sans Arabic","Archivo","Helvetica Neue",Arial,sans-serif!important;letter-spacing:0!important;text-transform:none!important}
html[dir=rtl] .bar nav a, html[dir=rtl] .fy-mono, html[dir=rtl] .pq-n, html[dir=rtl] .pq-price, html[dir=rtl] .lw-t, html[dir=rtl] .he-top, html[dir=rtl] .he-tab, html[dir=rtl] .he-sub, html[dir=rtl] .js-foot-clock, html[dir=rtl] .bar-gmt{font-size:12.5px}
html[dir=rtl] .cf-h, html[dir=rtl] .fy-h, html[dir=rtl] .td-name, html[dir=rtl] .pq-name, html[dir=rtl] .fq-q, html[dir=rtl] .sk-h, html[dir=rtl] .kb, html[dir=rtl] .ty2-stack, html[dir=rtl] .gp-l, html[dir=rtl] .gp-r{font-weight:700;line-height:1.25}
html[dir=rtl] .cf-p, html[dir=rtl] .pq-desc, html[dir=rtl] .fq-a, html[dir=rtl] .he-p, html[dir=rtl] .td-desc p, html[dir=rtl] .gp-desc{line-height:1.75;font-weight:400}
html[dir=rtl] .pv-v{transform:scaleX(-1)!important}
html[dir=rtl] .he-head,html[dir=rtl] .he-sub,html[dir=rtl] .he-v2,html[dir=rtl] .he-bl{left:auto;right:var(--hx);text-align:right}
html[dir=rtl] .he-year{left:auto;right:34%}
html[dir=rtl] .he-rule1{left:auto;right:50%}
html[dir=rtl] .he-rule2{left:auto;right:69%}
html[dir=rtl] .he-p1{left:auto;right:51%;text-align:right}
html[dir=rtl] .he-p2{left:auto;right:70%;text-align:right}
html[dir=rtl] .he-tab1{left:auto;right:calc(69% - 8px)}
html[dir=rtl] .he-tab2{left:auto;right:calc(50% - 8px)}
html[dir=rtl] .he-v1{left:auto;right:calc(69% + 6px)}
html[dir=rtl] .he-br{right:auto;left:var(--hx)}
@media(max-width:820px){html[dir=rtl] .he-year{right:auto;left:var(--hx);text-align:left}html[dir=rtl] .he-rule1{right:auto;left:var(--hx)}html[dir=rtl] .he-p1{right:var(--hx);left:calc(var(--hx) + 24px);text-align:right}}
html[dir=rtl] .fy-kick, html[dir=rtl] .fy-hint{left:auto;right:var(--gut)}
html[dir=rtl] .lw-cell, html[dir=rtl] .lw-mk img{align-items:flex-end;object-position:right center}
html[dir=rtl] .pq-list, html[dir=rtl] .pq-note, html[dir=rtl] .fq-in, html[dir=rtl] .ow-in, html[dir=rtl] .lw{text-align:right}
html[dir=rtl] .bar-lang{font-family:"IBM Plex Mono",monospace!important}
html[dir=rtl] .lg-a[lang=en],html[dir=rtl] .lg-k>span:first-child,html[dir=rtl] .lg-f span{font-family:"IBM Plex Mono",monospace!important;text-transform:uppercase!important;letter-spacing:.14em!important}
html[dir=rtl] .lg-a[lang=en]{letter-spacing:.04em!important}
html[dir=rtl] .ar-block{display:none}
html[dir=rtl] .gp-row{direction:ltr}
html[dir=rtl] .gp-l,html[dir=rtl] .gp-r{direction:rtl;unicode-bidi:isolate;padding:0 .08em}
html[dir=rtl] .ty2-c + .ty2-c{margin-inline-start:.22em}
@media(max-width:820px){html[dir=rtl] .sk-li{font-size:11px;line-height:1.38;gap:5px}html[dir=rtl] .sk-list{gap:7px}html[dir=rtl] .sk-li b{padding-top:.15em}}
'''
a=a.replace('</head>','<style>'+CSS+'</style>\n</head>',1)
open(D+'ar/index.html','w',encoding='utf-8').write(a); print('arabic page', len(a)//1024,'KB')
# sitemap with both pages
sm=open(D+'sitemap.xml',encoding='utf-8').read()
if '/ar/' not in sm:
    sm=sm.replace('  <url>\n    <loc>https://latent-studio-ai.com/</loc>','  <url>\n    <loc>https://latent-studio-ai.com/</loc>\n    <xhtml:link rel="alternate" hreflang="en" href="https://latent-studio-ai.com/"/>\n    <xhtml:link rel="alternate" hreflang="ar" href="https://latent-studio-ai.com/ar/"/>')
    sm=sm.replace('xmlns:image=','xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image=')
    sm=sm.replace('</urlset>','  <url>\n    <loc>https://latent-studio-ai.com/ar/</loc>\n    <lastmod>2026-11-23</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.9</priority>\n    <xhtml:link rel="alternate" hreflang="en" href="https://latent-studio-ai.com/"/>\n    <xhtml:link rel="alternate" hreflang="ar" href="https://latent-studio-ai.com/ar/"/>\n  </url>\n</urlset>')
    open(D+'sitemap.xml','w',encoding='utf-8').write(sm); print('sitemap: both pages')
