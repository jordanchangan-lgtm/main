# From the audit, the part search engines quote: plain answers to the questions buyers ask (with FAQ structured data),
# an Arabic block so Arabic searches have words to match, and a WhatsApp line from the number already on the page.
# Idempotent.
import sys, json
P='/home/user/main/latent-v3e/index.html'; s=open(P,encoding='utf-8').read()
if 'id="faq"' in s: print('already patched'); sys.exit(0)
QA=[('How much does it cost?','Four packages: Starter 200 JD, Essential 275 JD, Growth 375 JD and Signature 425 JD per package, exclusive of tax. A one-off piece, a brand identity or a website is quoted the same day you write to us.'),
    ('How long does it take?','Everything is done in days, not weeks. Posts, carousels and reels in a few days; a brand identity or a website in days too, with the exact count agreed on the first call.'),
    ('Will it look real?','Yes. Every frame is directed before it is generated: light, lens, angle and story are decisions, not prompts. Skin keeps its texture, products keep their exact shape, label and colour, and nothing is smoothed or airbrushed.'),
    ('Who owns the files?','You do. Every delivered image and film is yours to use anywhere, for as long as you like, with the source files on request.'),
    ('Do you work in Arabic?','Yes. We write and design in Arabic and English, for Jordan, Saudi Arabia, the Emirates and the Gulf, with the right typography for each.'),
    ('How many revisions?','Two rounds are included in every package. Direction notes before we generate are free and welcome; they are how the work gets good.')]
rows=''.join('      <div class="fq-row rv" style="--k:%d"><dt class="fq-q">%s</dt><dd class="fq-a">%s</dd></div>\n'%(k,q,a) for k,(q,a) in enumerate(QA))
AR='''<section class="sec light cf js-cf js-path fq-sec" id="faq">
  <div class="inner cf-in cf-short fq-in">
    <h2 class="cf-h js-words">Questions people ask.</h2>
    <dl class="fq-list" aria-label="Questions and answers">
%s    </dl>
    <div class="ar-block rv" lang="ar" dir="rtl" style="--k:7">
      <h3 class="ar-h">لاتنت ستوديو، عمّان</h3>
      <p class="ar-p">ستوديو إبداعي يعمل بالذكاء الاصطناعي ويُخرج كل لقطة كما يُخرج الفيلم: منشورات، كاروسيل، ريلز، حملات، هويات بصرية، مواقع إلكترونية، وتصوير منتجات وفيديو بالذكاء الاصطناعي. نعمل بالعربية والإنجليزية مع العلامات في الأردن والسعودية والإمارات والخليج.</p>
      <p class="ar-mono">تصميم بالذكاء الاصطناعي &middot; فيديو بالذكاء الاصطناعي &middot; تصوير منتجات &middot; هوية بصرية &middot; باقات من 200 دينار</p>
    </div>
  </div>
</section>
'''%rows
i=s.index('<section'); i=s.index('id="contact"'); i=s.rfind('<section',0,i); s=s[:i]+AR+'\n'+s[i:]
# WhatsApp beside the phone
s=s.replace('<a href="tel:+962799877131">+962 7 998 77131</a>','<a href="tel:+962799877131">+962 7 998 77131</a><br><a href="https://wa.me/962799877131" target="_blank" rel="noopener">WhatsApp</a>',1)
CSS='''
/* questions people ask, plainly, and the Arabic block */
.fq-sec{min-height:0}
.fq-in{align-items:flex-start;text-align:left}
.fq-list{margin:0;padding:0;width:100%;border-top:1px solid rgba(20,20,26,.14)}
.fq-row{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.6fr);gap:clamp(12px,2vw,40px);padding:clamp(16px,2.4vh,26px) 0;border-bottom:1px solid rgba(20,20,26,.14)}
.fq-q{margin:0;font-family:"Archivo","Helvetica Neue",Arial,sans-serif;font-weight:600;font-size:clamp(18px,1.8vw,26px);line-height:1.15;letter-spacing:-.025em;color:var(--ink)}
.fq-a{margin:0;font-family:"Newsreader",Georgia,serif;font-size:clamp(16px,1.3vw,20px);line-height:1.5;color:var(--ink);max-width:60ch}
.ar-block{width:100%;margin-top:clamp(36px,7vh,72px);padding-top:clamp(18px,3vh,30px);border-top:1px solid rgba(20,20,26,.14);font-family:"IBM Plex Sans Arabic","Noto Naskh Arabic","Geeza Pro","Segoe UI",Tahoma,Arial,sans-serif}
.ar-h{margin:0 0 12px;font-size:clamp(22px,2.4vw,34px);font-weight:700;line-height:1.3;color:var(--ink)}
.ar-p{margin:0 0 12px;max-width:62ch;font-size:clamp(16px,1.3vw,20px);line-height:1.8;color:var(--ink)}
.ar-mono{margin:0;font-size:13px;line-height:1.8;color:var(--stone)}
@media(max-width:820px){.fq-row{grid-template-columns:1fr;gap:8px}}
'''
j=s.rfind('</style>'); s=s[:j]+CSS+s[j:]
LD={"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a}} for q,a in QA]}
s=s.replace('</head>','<script type="application/ld+json">'+json.dumps(LD,ensure_ascii=False,separators=(',',':'))+'</script>\n</head>',1)
open(P,'w',encoding='utf-8').write(s); print('faq patched', len(s)//1024,'KB')
