# V2 of the E site, straight to the point: hero, who we are, what we do, why us, the case study, people we worked
# for, prices, questions (with realism and product consistency), contact. Built from the finished E folder into
# latent-v3f/, same animations, nothing deployed. Idempotent: rebuilds the folder each run.
import re, os, shutil, json
SRC='/home/user/main/latent-v3e'; DST='/home/user/main/latent-v3f'
if os.path.exists(DST): shutil.rmtree(DST)
shutil.copytree(SRC, DST)
def section(s, sid):
    i=s.index('id="%s"'%sid); a=s.rfind('<section',0,i); b=s.index('</section>',a)+len('</section>'); return a,b
def cut(s, sid):
    a,b=section(s,sid); return s[:a]+s[b:]
def block(s, sid):
    a,b=section(s,sid); return s[a:b]
NEWQ={'en':[('Will my product look exactly like my product?','Yes. The bottle, the label, the colour and the proportions are locked from your reference before anything is generated, and every frame is checked against it. What leaves the studio is your product, not a lookalike.'),
            ('What keeps it from looking like AI?','Real light, real skin, a camera that breathes and one honest imperfection in every frame. No plastic gloss, no floating objects, no invented text. Direction before generation, and only the frames that pass.')],
      'ar':[('هل سيبدو منتجي كمنتجي تمامًا؟','نعم. الزجاجة والملصق واللون والنِّسَب تُثبَّت من مرجعك قبل أن يُولَّد أي شيء، وكل لقطة تُراجَع عليه. ما يخرج من الاستوديو هو منتجك، لا شبيهه.'),
            ('ما الذي يمنعه من أن يبدو كذكاء اصطناعي؟','ضوء حقيقي، بشرة حقيقية، كاميرا تتنفس، وعيب صادق واحد في كل لقطة. لا لمعان بلاستيكي، لا أشياء طافية، لا نص مخترَع. الإخراج قبل التوليد، ولا يمرّ إلا ما يجتاز.')]}
H={'en':{'what':'What we do.','worked':'People we worked for.','why':'Why us.','whyfoot':'AI is the tool &middot; taste is the craft &middot; restraint &middot; story before product','who':'Who we are.<br>Latent Studio, Amman.'},
   'ar':{'what':'ماذا نفعل.','worked':'من عملنا معهم.','why':'لماذا نحن.','whyfoot':'الذكاء الاصطناعي أداة · الذوق هو الحرفة · اختزال · القصة قبل المنتج','who':'من نحن.<br>لاتنت ستوديو، عمّان.'}}
OLD={'en':{'what':'What we make.','worked':'We worked for.','why':'AI is the tool. Taste is the craft.','whyfoot':'Restraint &middot; story before product &middot; craft in every frame','who':'Focused direction.<br>Measured delivery.'},
     'ar':{'what':'ماذا نصنع.','worked':'عملنا مع.','why':None,'whyfoot':None,'who':None}}
for lang,path in [('en',DST+'/index.html'),('ar',DST+'/ar/index.html')]:
    s=open(path,encoding='utf-8').read()
    # drop the six moves, the staircase and what we skip
    for sid in ['how-intro','how','method']: s=cut(s,sid)
    # why us and the case study come right after what we do; the people we worked for follow as proof
    why=block(s,'sectors'); case=block(s,'process'); s=cut(s,'sectors'); s=cut(s,'process')
    a,_=section(s,'ourwork'); s=s[:a]+why+'\n\n'+case+'\n\n'+s[a:]
    # headings
    s=s.replace('<p class="td-mono td-kick kb">%s</p>'%OLD[lang]['what'], '<p class="td-mono td-kick kb">%s</p>'%H[lang]['what'],1)
    s=s.replace('<h2 class="cf-h js-words">%s</h2>'%OLD[lang]['worked'], '<h2 class="cf-h js-words">%s</h2>'%H[lang]['worked'],1)
    a,b=section(s,'sectors'); sec=s[a:b]
    sec=re.sub(r'<h2 class="cf-h js-words">.*?</h2>', '<h2 class="cf-h js-words">%s</h2>'%H[lang]['why'], sec, count=1, flags=re.S)
    sec=re.sub(r'<p class="cf-foot js-words">.*?</p>', '<p class="cf-foot js-words">%s</p>'%H[lang]['whyfoot'], sec, count=1, flags=re.S)
    s=s[:a]+sec+s[b:]
    s=re.sub(r'(<p class="st2-corner st2-bl rv">).*?(</p>)', lambda m: m.group(1)+H[lang]['who']+m.group(2), s, count=1, flags=re.S)
    s=s.replace('href="#method"','href="#sectors"')
    # two more questions, in the list and in the structured data
    a,b=section(s,'faq'); sec=s[a:b]
    rows=re.findall(r'<div class="fq-row rv" style="--k:\d+">.*?</div>', sec, flags=re.S); last=rows[-1]; k=len(rows)
    add=''.join('\n      <div class="fq-row rv" style="--k:%d"><dt class="fq-q"><span class="pgw"><span class="pgw-in">%s</span></span></dt><dd class="fq-a">%s</dd></div>'%(k+i,q,aa) for i,(q,aa) in enumerate(NEWQ[lang]))
    sec=sec.replace(last, last+add,1); s=s[:a]+sec+s[b:]
    i=s.index('"FAQPage"'); a=s.rfind('>',0,i)+1; b=s.index('</script>',i); d=json.loads(s[a:b])
    for q,aa in NEWQ[lang]: d['mainEntity'].append({'@type':'Question','name':q,'acceptedAnswer':{'@type':'Answer','text':aa}})
    s=s[:a]+json.dumps(d,ensure_ascii=False,separators=(',',':'))+s[b:]
    open(path,'w',encoding='utf-8').write(s)
    print(lang, 'sections', re.findall(r'<section[^>]*id="([^"]+)"', s))
# the files the dropped sections used are no longer needed; keep the folder lean
used=set(); 
for p in [DST+'/index.html',DST+'/ar/index.html']+[DST+'/media/'+f for f in os.listdir(DST+'/media') if f.startswith('site-')]:
    used|=set(re.findall(r'media/([A-Za-z0-9_.-]+\.(?:webp|jpg|png|mp4|svg|css|js|woff2))', open(p,encoding='utf-8').read()))
    used|=set(re.findall(r'fonts/([A-Za-z0-9_.-]+\.woff2)', open(p,encoding='utf-8').read()))
removed=0
for f in os.listdir(DST+'/media'):
    if f=='fonts' or f=='og.jpg': continue
    if f not in used: os.remove(DST+'/media/'+f); removed+=1
print('pruned', removed, 'files; folder', sum(os.path.getsize(os.path.join(r,f)) for r,_,fs in os.walk(DST) for f in fs)//1024//1024, 'MB')
