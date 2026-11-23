# The technical pass from the OnePoint audit, the part that lives in the build: title and description with the
# services and the countries, canonical, share image, structured data (the studio, its services and its packages),
# self-hosted fonts with no render-blocking stylesheet, the four packages as real HTML in the price panel, mono
# labels at AA contrast. Idempotent.
import sys, re, json
P='/home/user/main/latent-v3e/index.html'; s=open(P,encoding='utf-8').read()
if 'rel="canonical"' in s: print('already patched'); sys.exit(0)
SITE='https://latent-studio-ai.com'
# title and description
s=re.sub(r'<title>.*?</title>','<title>Latent Studio — AI brand visuals, films and websites · Amman, Jordan</title>',s,count=1,flags=re.S)
s=s.replace('<meta name="description" content="Latent Studio, Amman. Posts, carousels, reels, campaigns, brand identities, websites and portfolios — made with AI, directed like film. Prices for 2026 inside.">',
 '<meta name="description" content="Latent Studio, Amman: AI posts, carousels, reels, campaigns, brand identities, websites and portfolios for brands in Jordan, Saudi Arabia, the UAE, the US and Canada. Directed like film. Packages from 200 JD.">')
# canonical, share image, twitter card
s=s.replace('<meta property="og:title" content="Latent Studio">','<link rel="canonical" href="%s/">\n<meta property="og:url" content="%s/">\n<meta property="og:site_name" content="Latent Studio">\n<meta property="og:title" content="Latent Studio — AI brand visuals, films and websites, Amman">\n<meta property="og:image" content="%s/media/og.jpg">\n<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n<meta property="og:image:alt" content="Latent Studio. A man balancing an egg on his forehead against rust orange.">\n<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="Latent Studio — AI brand visuals, films and websites, Amman">\n<meta name="twitter:image" content="%s/media/og.jpg">'%(SITE,SITE,SITE,SITE))
# fonts: self hosted, swapped in, the display face preloaded; the Google stylesheet goes
s=re.sub(r'<link rel="preconnect" href="https://fonts\.googleapis\.com">\s*','',s)
s=re.sub(r'<link rel="preconnect" href="https://fonts\.gstatic\.com" crossorigin>\s*','',s)
s=re.sub(r'<link rel="stylesheet" href="https://fonts\.googleapis\.com/css2[^"]*">','<link rel="preload" as="font" type="font/woff2" href="media/fonts/archivo-var.woff2" crossorigin>\n<link rel="preload" as="font" type="font/woff2" href="media/fonts/plexmono-500.woff2" crossorigin>',s)
FACES='''@font-face{font-family:"Archivo";font-style:normal;font-weight:400 700;font-display:swap;src:url(media/fonts/archivo-var.woff2) format("woff2")}
@font-face{font-family:"IBM Plex Mono";font-style:normal;font-weight:400;font-display:swap;src:url(media/fonts/plexmono-400.woff2) format("woff2")}
@font-face{font-family:"IBM Plex Mono";font-style:normal;font-weight:500;font-display:swap;src:url(media/fonts/plexmono-500.woff2) format("woff2")}
@font-face{font-family:"Newsreader";font-style:normal;font-weight:300 400;font-display:swap;src:url(media/fonts/newsreader-var.woff2) format("woff2")}
@font-face{font-family:"Newsreader";font-style:italic;font-weight:300;font-display:swap;src:url(media/fonts/newsreader-italic-var.woff2) format("woff2")}
'''
i=s.index('<style>'); s=s[:i]+'<style>'+FACES+s[i+7:]
# mono labels at AA contrast on white and ivory
s=s.replace('--stone:#7C776E;','--stone:#6F6A62;')
# the four packages, as real HTML under the price line
PACKS=[('01','Starter','200','A first month of showing up, done properly.','4 carousel posts · 3 reels of 15 s · showcase videos · 1080p'),
       ('02','Essential','275','The steady feed: more posts, more reels.','5 carousel posts · 4 reels of 15 s · showcase videos · 1080p'),
       ('03','Growth','375','Scripted film enters the picture.','5 carousel posts · 3 cinematic reels of 15 s · scripted film with edits and SFX · 1080p'),
       ('04','Signature','425','The full campaign, longer and louder.','6 carousel posts · 3 cinematic reels of 20 s · scripted film with edits and SFX · 1080p')]
rows=''.join('      <li class="pq-row rv" style="--k:%d"><span class="pq-n">%s</span><span class="pq-name">%s</span><span class="pq-desc">%s<small>%s</small></span><span class="pq-price"><b>%s</b> JD</span></li>\n'%(k,n,name,desc,feat,price) for k,(n,name,price,desc,feat) in enumerate(PACKS))
LIST='''    <ul class="pq-list" aria-label="Packages and prices">
%s    </ul>
    <p class="pq-note rv" style="--k:4">Per package, in Jordanian dinars. Every package costs less than the same pieces bought one by one.</p>
'''%rows
a=s.index('id="prices"'); b=s.index('<p class="cf-p js-words">',a); b=s.index('</p>',b)+4
s=s[:b]+'\n'+LIST+s[b:]
s=s.replace('<p class="cf-p js-words">Every package costs less than the same pieces bought one by one. Tell us what you are launching and the list is in your inbox the same day.</p>','<p class="cf-p js-words">Four packages, one price each. Tell us what you are launching and we answer the same day.</p>')
CSS='''
/* the packages, plainly */
.pq-list{list-style:none;margin:clamp(6px,1vh,14px) 0 0;padding:0;width:100%;text-align:left;border-top:1px solid rgba(20,20,26,.14)}
.pq-row{display:grid;grid-template-columns:3em minmax(0,.9fr) minmax(0,1.6fr) auto;gap:clamp(12px,2vw,36px);align-items:baseline;padding:clamp(14px,2.2vh,22px) 0;border-bottom:1px solid rgba(20,20,26,.14)}
.pq-n{font-family:"IBM Plex Mono",monospace;font-weight:500;font-size:11px;letter-spacing:.16em;color:var(--marrow)}
.pq-name{font-family:"Archivo","Helvetica Neue",Arial,sans-serif;font-weight:600;font-size:clamp(20px,2.2vw,32px);line-height:1;letter-spacing:-.03em;text-transform:uppercase;color:var(--ink)}
.pq-desc{font-size:clamp(15px,1.2vw,19px);line-height:1.45;color:var(--ink)}
.pq-desc small{display:block;margin-top:6px;font-family:"IBM Plex Mono",monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;line-height:1.6;color:var(--stone)}
.pq-price{font-family:"IBM Plex Mono",monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--stone);white-space:nowrap}
.pq-price b{font-family:"Archivo","Helvetica Neue",Arial,sans-serif;font-weight:600;font-size:clamp(20px,2.2vw,32px);letter-spacing:-.03em;color:var(--ink);margin-right:6px}
.pq-note{margin:14px 0 clamp(28px,6vh,56px);text-align:left;width:100%;font-family:"IBM Plex Mono",monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--stone)}
@media(max-width:820px){.pq-row{grid-template-columns:2.2em minmax(0,1fr) auto;gap:8px 12px}.pq-desc{grid-column:2/4;font-size:15px}.pq-price{justify-self:end}}
'''
j=s.rfind('</style>'); s=s[:j]+CSS+s[j:]
# structured data: the studio, where it works, what it makes, what it costs
LD={"@context":"https://schema.org","@type":"ProfessionalService","@id":SITE+"/#studio","name":"Latent Studio","alternateName":"Latent.","url":SITE+"/","logo":SITE+"/media/og.jpg","image":SITE+"/media/og.jpg",
 "description":"An AI-native creative studio in Amman: posts, carousels, reels, campaigns, brand identities, websites and portfolios, directed like film.",
 "email":"latentstudio.jo@gmail.com","telephone":"+962799877131",
 "address":{"@type":"PostalAddress","addressLocality":"Amman","addressCountry":"JO"},
 "areaServed":[{"@type":"Country","name":"Jordan"},{"@type":"Country","name":"Saudi Arabia"},{"@type":"Country","name":"United Arab Emirates"},{"@type":"Country","name":"Qatar"},{"@type":"Country","name":"Kuwait"},{"@type":"Country","name":"Bahrain"},{"@type":"Country","name":"Oman"},{"@type":"Country","name":"United States"},{"@type":"Country","name":"Canada"}],
 "sameAs":["https://instagram.com/latentstudio.jo"],
 "knowsLanguage":["en","ar"],
 "hasOfferCatalog":{"@type":"OfferCatalog","name":"What we make","itemListElement":[{"@type":"Offer","itemOffered":{"@type":"Service","name":n}} for n in ["Posts","Carousels","Reels","Campaigns","Brand identities","Websites","Portfolios","AI visuals and films"]]},
 "makesOffer":[{"@type":"Offer","name":name+" package","description":desc,"price":price,"priceCurrency":"JOD","availability":"https://schema.org/InStock","url":SITE+"/#prices"} for n,name,price,desc,feat in PACKS]}
s=s.replace('</head>','<script type="application/ld+json">'+json.dumps(LD,ensure_ascii=False,separators=(',',':'))+'</script>\n</head>',1)
# the H1 says what and where; the slogan stays the big line above it
s=s.replace('<h1 class="he-head js-pu2" style="--d:.25s">Not your<br>average AI.</h1>','<p class="he-head js-pu2" style="--d:.25s">Not your<br>average AI.</p>')
s=s.replace('<p class="he-sub js-pu2" style="--d:.45s">Directed<br>like film.</p>','<h1 class="he-sub js-pu2" style="--d:.45s">AI brand visuals, films and websites,<br>directed like film. Amman.</h1>')
# every package in the four other currencies people search in, approximately
FX={'200':('1,060','1,035','282','394'),'275':('1,455','1,425','388','542'),'375':('1,985','1,945','529','739'),'425':('2,250','2,200','599','837')}
for jd,(sar,aed,usd,cad) in FX.items():
    s=s.replace('<span class="pq-price"><b>%s</b> JD</span></li>'%jd,'<span class="pq-price"><b>%s</b> JD<small class="pq-fx">approx. SAR %s · AED %s · USD %s · CAD %s</small></span></li>'%(jd,sar,aed,usd,cad))
s=s.replace('.pq-note{margin:14px 0 clamp(28px,6vh,56px);','.he-sub{max-width:min(28vw,23ch);font-size:clamp(12px,1.05vw,15px);line-height:1.35}\n@media(max-width:820px){.he-sub{max-width:58%;font-size:12px;top:38%}}\n.pq-fx{display:block;margin-top:6px;font-size:11px;letter-spacing:.08em;white-space:normal;max-width:16ch;line-height:1.5;color:var(--stone)}\n.pq-note{margin:14px 0 clamp(28px,6vh,56px);')
# the studio's other profiles, and the site itself
s=s.replace('"sameAs":["https://instagram.com/latentstudio.jo"]','"sameAs":["https://instagram.com/latentstudio.jo","https://www.linkedin.com/company/140003931/"]')
WS={"@context":"https://schema.org","@type":"WebSite","@id":SITE+"/#site","url":SITE+"/","name":"Latent Studio","inLanguage":["en","ar"],"publisher":{"@id":SITE+"/#studio"}}
s=s.replace('</head>','<script type="application/ld+json">'+json.dumps(WS,separators=(',',':'))+'</script>\n</head>',1)
open(P,'w',encoding='utf-8').write(s); print('seo patched', len(s)//1024,'KB')
open('/home/user/main/latent-v3e/llms.txt','w',encoding='utf-8').write("""# Latent Studio

> An AI-native creative studio in Amman, Jordan. Brand visuals, films and websites made with generative tools in the hands of art directors, directed like film. Working in English and Arabic for brands in Jordan, Saudi Arabia, the UAE, the Gulf, the United States and Canada.

- Site: https://latent-studio-ai.com/ (English), https://latent-studio-ai.com/ar/ (Arabic)
- Email: latentstudio.jo@gmail.com
- Phone and WhatsApp: +962 7 998 77131
- Instagram: https://instagram.com/latentstudio.jo

## What we make
Posts, carousels, reels, campaigns, brand identities, websites, portfolios, and AI visuals and films for anything a camera cannot reach.

## How we work
Brief, direct, generate, select, craft, deliver. Light, lens, angle and story are decided before a frame is generated. Only frames that look shot leave the studio. Days, not weeks. No set, no crew, no reshoot day.

## Packages (per package, Jordanian dinars, exclusive of tax)
- Starter: 200 JD (approx. SAR 1,060 · AED 1,035 · USD 282 · CAD 394). 4 carousel posts, 3 reels of 15 s, showcase videos, 1080p.
- Essential: 275 JD (approx. SAR 1,455 · AED 1,425 · USD 388 · CAD 542). 5 carousel posts, 4 reels of 15 s, showcase videos, 1080p.
- Growth: 375 JD (approx. SAR 1,985 · AED 1,945 · USD 529 · CAD 739). 5 carousel posts, 3 cinematic reels of 15 s, a scripted film with edits and SFX, 1080p.
- Signature: 425 JD (approx. SAR 2,250 · AED 2,200 · USD 599 · CAD 837). 6 carousel posts, 3 cinematic reels of 20 s, a scripted film with edits and SFX, 1080p.
One-off pieces, brand identities and websites are quoted the same day.

## Clients
AS Abaya (Riyadh), Sudqi Planet (Amman), Atelier Rebul (Amman), Buraq Al Omur (Zarqa), Rawabina Al Khadraa (Riyadh), Cube Coffee House (Amman), OnePoint Solutions (Edmonton).

## Questions
- Cost: four packages from 200 JD; anything else quoted the same day.
- Turnaround: posts and carousels in days; a reel in about a week; an identity or a website in two to four weeks.
- Realism: every frame is directed before it is generated; skin keeps its texture, products keep their exact shape, label and colour.
- Files: the client owns every delivered image and film, source files on request.
- Arabic: yes, copy and design in Arabic and English.
- Revisions: two rounds in every package.
""")
