import json,re,html,base64,io
from PIL import Image
SP='/tmp/claude-0/-home-user-main/ebce930a-c60e-53f2-9cc9-6aaf1c614988/scratchpad/'
s=open('/home/user/main/latent/index.html',encoding='utf-8').read()
a=json.load(open(SP+'v2_assets.json')); atel_hi=json.load(open(SP+'atel_hi.json')); rw=json.load(open(SP+'raw_shots.json'))
uniq=lambda L: list(dict.fromkeys(L)); care=uniq(a['care']); cafe=uniq(a['cafe'])
tiles={t['nm']:t for t in a['tiles']}; brand=tiles['Brands']; pour=tiles['Coffee']
plates=[tiles[k] for k in ['Mark','Colour &amp; theme','World','Colophon']]
atel_film=[u for u,m in a['method_sources'] if 'max-width' in m][0]
def du(path,mime): return 'data:%s;base64,'%mime+base64.b64encode(open(SP+path,'rb').read()).decode()
atel_poster=du('method_m_poster.jpg','image/jpeg'); home_bg=du('ref_card.jpg','image/jpeg')
def ar(u):
    im=Image.open(io.BytesIO(base64.b64decode(u.split(',')[1]))); return '%d/%d'%im.size
esc=lambda x: html.escape(x,quote=True)
def rep(o,n,cnt=1):
    global s; assert s.count(o)==cnt,(s.count(o),o[:90]); s=s.replace(o,n)

# ---------------- projects ----------------
LBL_BOOK={1: 'Cover', 9: 'Wordmark on ink', 10: 'The mark', 18: 'Colour system', 22: 'No camera. No studio.', 26: 'Phone mockups', 32: 'Stationery', 34: 'Tape'}
PAGES_BOOK=[1, 9, 10, 18, 22, 26, 32, 34]
PROJ=[
 dict(brand='Atelier Rebul',proj='Élixir 2',sector='Perfume',city='Istanbul',yr='2026',note='Nine plates + film',img=atel_hi[1],ar='900/1612',layout='g3',
      media=[dict(v=atel_film,poster=atel_poster,ar='720/1290',lbl='Film · 9:16 · 0:20',dur='0:20')]+[dict(img=u,ar='900/1612',lbl='Plate %02d'%(k+1)) for k,u in enumerate(atel_hi[1:9])]),
 dict(brand='Cube Care Center',proj='Identity + campaign',sector='Motorcycle wash',city='Amman',yr='2026',note='Logo, palette, type, posters',img=care[0],ar=ar(care[0]),layout='g4',
      media=[dict(img=u,ar=ar(u),lbl='Poster %02d'%(k+1)) for k,u in enumerate(care)]),
 dict(brand='Cube Coffee House',proj='Identity + campaign',sector='Coffee',city='Amman',yr='2026',note='Logo, palette, type, posters, films',img=pour['poster'],video=pour['video'],ar='576/714',dur='0:08',layout='g3',
      media=[dict(v=pour['video'],poster=pour['poster'],ar='576/714',lbl='Film · pour · 0:08',dur='0:08'),dict(img=cafe[0],ar=ar(cafe[0]),lbl='Poster 01'),dict(v=a['bags'],poster=a['bags_poster'],ar='576/714',lbl='Film · bean bags · 0:08',dur='0:08'),dict(img=cafe[1],ar=ar(cafe[1]),lbl='Poster 02'),dict(img=cafe[2],ar=ar(cafe[2]),lbl='Poster 03')]),
 dict(brand='Rawabina Al-Khadhraa',proj='Touch of Green',sector='Landscaping',city='Amman',yr='2026',note='Editorial website · ten panels',img=a['rawabina'],ar=ar(a['rawabina']),layout='g2',media=[]),
 dict(brand='Latent',proj='Identity + brand film',sector='Identity',city='Amman',yr='2026',note='Mark · palette · world · colophon',img=brand['poster'],video=brand['video'],ar='720/1280',dur='0:05',layout='side',
      media=[dict(v=brand['video'],poster=brand['poster'],ar='720/1280',lbl='Brand film · 9:16 · 0:05',dur='0:05')]+[dict(img=t['img'],ar='1000/1250',lbl=['Mark · construction','Colour & theme','World · objects','Colophon'][k]) for k,t in enumerate(plates)]),
 dict(brand='Latent brand book',proj='Thirty-five spreads',sector='Identity',city='Amman',yr='2026',note='Eight of its thirty-five spreads',img=du('book/p01.jpg','image/jpeg'),ar='1440/810',layout='g2',media=[dict(img=du('book/p%02d.jpg'%n,'image/jpeg'),ar='1440/810',lbl=LBL_BOOK[n]) for n in PAGES_BOOK]),
]
labels_d=json.load(open(SP+'raw_labels.json'))
labels_m=['Phone · home','Phone · about','Phone · numbers','Phone · projects']
di=mi=0
for k,n,u,sz in rw:
    lbl=labels_d[di] if k=='d' else labels_m[mi]
    if k=='d': di+=1
    else: mi+=1
    PROJ[3]['media'].append(dict(img=u,ar='%d/%d'%tuple(sz),lbl=lbl))

blocks=''
for i,p in enumerate(PROJ):
    items=''
    for k,m in enumerate(p['media']):
        note=esc(m['lbl']+' · '+p['city']+' · '+p['yr'])
        if m.get('v'):
            items+='        <figure class="aw-tile aw-film rv js-film" style="--k:%d;--ar:%s" data-title="%s" data-client="%s" data-note="%s" data-dur="%s"><div class="aw-img"><video class="js-tile-v" muted loop playsinline preload="metadata" poster="%s" src="%s"></video><span class="play">[ Play ]</span></div><figcaption><span class="nm">%s</span><span>%02d</span></figcaption></figure>\n'%(k%3,m['ar'],esc(p['brand']),esc(p['proj']),note,m['dur'],m['poster'],m['v'],esc(m['lbl']),k+1)
        else:
            items+='        <figure class="aw-tile id-tile rv js-film" style="--k:%d;--ar:%s" data-title="%s" data-client="%s" data-note="%s" data-img="1"><div class="aw-img"><img src="%s" alt="%s" loading="lazy"><span class="play">[ Open ]</span></div><figcaption><span class="nm">%s</span><span>%02d</span></figcaption></figure>\n'%(k%3,m['ar'],esc(p['brand']),esc(p['proj']),note,m['img'],esc(p['brand']),esc(m['lbl']),k+1)
    blocks+='    <article class="prj" id="p%d">\n      <div class="aw-row rv"><h3 class="aw-t">%s <span class="sep">|</span> <span class="cl">%s</span></h3><p class="aw-meta"><span>%s</span><span>%s, %s</span><span>%s</span></p></div>\n      <div class="mg %s">\n%s      </div>\n    </article>\n'%(i,esc(p['brand']),esc(p['proj']),esc(p['sector']),esc(p['city']),p['yr'],esc(p['note']),p['layout'],items)

rows=''; prevs=''
for i,p in enumerate(PROJ):
    rows+='      <li class="ixl-row wk-row js-wk-row" data-i="%d" data-title="%s" data-client="%s" data-note="%s"%s><span class="n">%d</span><span class="nm">%s</span><span class="meta">%s &middot; %s</span></li>\n'%(i,esc(p['brand']),esc(p['proj']),esc(p['sector']+' · '+p['note']),' data-dur="%s"'%p['dur'] if p.get('video') else '',i+1,esc(p['brand']),esc(p['proj']),p['yr'])
    if p.get('video'): prevs+='        <video data-ar="%s" data-i="%d" muted loop playsinline preload="none" poster="%s" src="%s"%s></video>\n'%(p['ar'],i,p['img'],p['video'],' class="on"' if i==0 else '')
    else: prevs+='        <img alt="" data-ar="%s" data-i="%d" src="%s"%s>\n'%(p['ar'],i,p['img'],' class="on"' if i==0 else '')

def wfig(p,m,cls):
    # (the --k stagger index is folded in by the caller)
    note=esc(m['lbl']+' · '+p['city']+' · '+p['yr'])
    if m.get('v'):
        return '<figure class="%s js-film" style="--ar:%s" data-title="%s" data-client="%s" data-note="%s" data-dur="%s"><video class="js-tile-v" muted loop playsinline preload="metadata" poster="%s" src="%s"></video><span class="play">[ Play ]</span></figure>'%(cls,m['ar'],esc(p['brand']),esc(p['proj']),note,m['dur'],m['poster'],m['v'])
    return '<figure class="%s js-film" style="--ar:%s" data-title="%s" data-client="%s" data-note="%s" data-img="1"><img src="%s" alt="%s" loading="lazy"><span class="play">[ Open ]</span></figure>'%(cls,m['ar'],esc(p['brand']),esc(p['proj']),note,m['img'],esc(m['lbl']))
sets=''; wkdata=[]
for i,p in enumerate(PROJ):
    main=p['media'][0]
    sets+='        <div class="wk-set js-wk-set" data-i="%d"><div class="wk-in">\n          %s\n        </div></div>\n'%(i,'\n          '.join(wfig(p,m,'wk-m').replace('style="--ar:','style="--k:%d;--ar:'%k,1) for k,m in enumerate(p['media'])))
    wkdata.append(dict(t=p['brand'],proj=p['proj'],meta='%s · %s · %s'%(p['sector'],p['city'],p['yr']),note=p['note'],n=len(p['media']),film=bool(main.get('v')),pdf=p.get('pdf')))
WORK='''<!-- ================= PORTFOLIO — one locked stage: the media and the words appear in place, the name rotates in (21st TextRotate) ================= -->
<section class="sec dark wipe wk" id="work" style="--prev:var(--ivory);padding:0">
  <div class="wk-hold js-wk-hold">
    <div class="wk-stage js-wk-stage">
      <div class="ixl-head wk-head">
        <p class="ixl-filter js-wk-filter"><b>( Portfolio )</b><span data-i="0" class="on">Perfume</span><span data-i="1">Care</span><span data-i="2">Coffee</span><span data-i="3">Web</span><span data-i="4">Studio</span><span data-i="5">Book</span></p>
        <p class="ixl-title">Portfolio<sup>[ 6 ]</sup></p>
        <p class="ixl-count"><span class="js-wk-count">&mdash; / 06</span></p>
      </div>
      <div class="wk-body">
        <div class="wk-media js-wk-media">
''' + sets + '''        </div>
        <div class="wk-text">
          <h3 class="stk wk-stk js-wk-stk in" aria-live="polite">
''' + ''.join('            <span class="stk-l" data-i="%02d" style="--k:%d">%s</span>\n'%(i+1,i,esc(p['brand'])) for i,p in enumerate(PROJ)) + '''          </h3>
          <p class="wk-proj swap js-wk-proj"></p>
          <p class="wk-meta swap js-wk-meta"></p>
          <p class="wk-note swap js-wk-note"></p>
          <p class="wk-cta"><button type="button" class="js-wk-open">[ Open full frame ]</button><span class="js-wk-n"></span></p>
        </div>
      </div>
      <p class="st-cue mono-cue wk-cue" aria-hidden="true"><span>Scroll</span><i></i></p>
    </div>
  </div>
</section>

'''
WKJS='window.__WK='+json.dumps(wkdata,ensure_ascii=False)+';'
# ---------------- surgery ----------------
# 1. home: the reference cut's stacked nav over the blurred still
a_h=s.index('<section class="hero" id="top">'); b_h=s.index('</section>',a_h)+len('</section>')
import os
def hv(name,mime):
    return du(name,mime) if os.path.exists(SP+name) else None
HERO=os.environ.get('HERO','hero')
hero_d=hv(HERO+'_d.mp4','video/mp4') or brand['video']; hero_dp=hv(HERO+'_d.jpg','image/jpeg') or brand['poster']
hero_m=hv(HERO+'_m.mp4','video/mp4') or brand['video']; hero_mp=hv(HERO+'_m.jpg','image/jpeg') or brand['poster']
HOME='''<div class="lk-hold js-lk"><section class="hero home prisma js-prisma lk-stage" id="top">
  <div class="pv js-pv" aria-hidden="true">
    <video class="pv-v pv-d js-pv-v" muted loop playsinline preload="metadata" poster="''' + hero_dp + '''" src="''' + hero_d + '''"></video>
    <video class="pv-v pv-m js-pv-v" muted loop playsinline preload="metadata" poster="''' + hero_mp + '''" src="''' + hero_m + '''"></video>
    <i class="pv-noise"></i><i class="pv-grad"></i>
  </div>
  <div class="stage">
    <p class="hs hs-name js-pu2" style="--d:.15s"><span class="logo" role="img" aria-label="Latent Studio"></span><span class="hs-word">Latent Studio</span></p>
    <p class="hs hs-role js-pu2" style="--d:.35s">Your brand deserves better <span class="cyc" id="cyc"></span></p>
    <p class="hs hs-foot js-pu2" style="--d:.55s">Campaign imagery and product film for all brands &mdash;<br>you name it, we make it.</p>
    <p class="hs hs-meta js-pu2" style="--d:.7s">&copy;2026 &nbsp; Amman, Jordan &nbsp; <span id="clock">&mdash;</span></p>
  </div>
</section></div>'''
s=s[:a_h]+HOME+s[b_h:]

# ---- studio: the statement, the stack and the two tenets take turns on one locked stage ----
st_a=s.index('<section class="sec light" id="studio" style="padding:0">'); st_b=s.index('<!-- ================= METHOD')
old=s[st_a:st_b]
stmt=re.search(r'<p class="statement js-split js-lock">.*?</p>', old, re.S).group(0)
ltm=re.search(r'<ul class="lt js-lt" aria-hidden="true">.*?</ul>', old, re.S).group(0)
spm=re.search(r'<div class="sp js-sp" id="tenets" data-side="left">.*?\n  </div>\n</section>', old, re.S).group(0)[:-len('\n</section>')]
sp_l=re.search(r'class="sp-pic sp-pic-l" src="([^"]+)"', spm).group(1); sp_r=re.search(r'class="sp-pic sp-pic-r" src="([^"]+)"', spm).group(1)
STU='''<section class="sec light" id="studio" style="padding:0">
  <!-- One stage, held on screen for four scrolls. The ground is the latent
       space — drifting light, a dot field that comes toward you as you go —
       and on it, one after another: the statement, the stack of what we
       make, Minimalism, then Simplicity. -->
  <div class="st-hold js-hold js-scenes">
    <div class="st-stage js-slider" data-scene="a">
      <div class="lat-bg" aria-hidden="true"><i class="lb lb1"></i><i class="lb lb2"></i><i class="lb lb3"></i><i class="lat-dots"></i><i class="lat-grain"></i><i class="lat-vig"></i></div>
      <div class="sc sc-a js-sc" data-s="a"><div class="st-copy">''' + stmt + '''</div></div>
      <div class="sc sc-b js-sc" data-s="b"><div class="st-stack"><p class="sr">Campaign stills, product film, carousels, brand identity, editorial web.</p>''' + ltm + '''</div></div>
      <div class="sc sc-c js-sc" data-s="c">''' + spm + '''</div>
      <p class="st-cue mono-cue" aria-hidden="true"><span class="js-cue">01 &middot; Studio</span><i></i></p>
    </div>
  </div>
</section>

'''
s=s[:st_a]+STU+s[st_b:]
# the statement reads centred on its own scene
s=s.replace('<p class="statement js-split js-lock"><span class="mk">( Studio )</span>','<p class="statement js-split js-lock"><span class="mk">( Studio )</span>',1)

# 2. identity section goes (it is a project block now); work moves before process
a_i=s.index('<!-- ================= IDENTITY ================= -->'); b_i=s.index('<!-- ================= WORK')
s=s[:a_i]+s[b_i:]
a_w=s.index('<!-- ================= WORK'); b_w=s.index('<!-- ================= PRICES')
s=s[:a_w]+s[b_w:]
rep('<!-- ================= PROCESS ================= -->\n<section class="sec light" id="process">', WORK+'<!-- ================= PROCESS ================= -->\n<section class="sec light wipe" id="process" style="--prev:var(--ink)">')

# ---- process: the four moves as four plates ----
steps=[('01','Brief','Product, palette, audience. What the work has to do.'),('02','Direction','Concept, light, motion, grade &mdash; agreed before anything is made.'),('03','Frames','We make many. We show the ones that pass.'),('04','Delivery','Final files, sized for every placement.')]
plate_lbl=['Mark · construction','Colour & theme','World · objects','Colophon']
prow=''; pprev=''
for k,(n,t,d) in enumerate(steps):
    prow+='          <li class="ixl-row" data-i="%d"><span class="n">%d</span><span class="nm">%s</span><span class="meta">%s</span></li>\n'%(k,k+1,t,esc(d.replace('&mdash;','—')))
    pprev+='            <img alt="" data-ar="1000/1250" data-i="%d" src="%s"%s>\n'%(k,plates[k]['img'],' class="on"' if k==0 else '')
pr_a=s.index('<!-- ================= PROCESS ================= -->'); pr_b=s.index('<!-- ================= PRICES')
s=s[:pr_a]+'''<!-- ================= PROCESS — the four moves as an index ================= -->
<section class="sec light wipe" id="process" style="--prev:var(--ink)">
  <div class="inner">
    <div class="beat">
      <div class="ixl js-ixl js-steps" data-every="2800">
        <div class="ixl-head rv">
          <p class="ixl-filter"><b>( How it works )</b><span data-i="0">Brief</span><span data-i="1">Direction</span><span data-i="2">Frames</span><span data-i="3">Delivery</span></p>
          <p class="ixl-title">Four moves<sup>[ 4 ]</sup></p>
          <p class="ixl-count">Days, not weeks</p>
        </div>
        <div class="ixl-body">
          <ol class="ixl-rows rv" style="--k:1">
''' + prow + '''          </ol>
          <div class="ixl-side rv" style="--k:2">
            <figure class="ixl-prev js-ixl-prev">
''' + pprev + '''              <figcaption><span class="js-ixl-cap">Brief</span><span class="js-ixl-cap2">Mark &middot; construction</span></figcaption>
            </figure>
          </div>
        </div>
        <p class="ixl-note rv" style="--k:3">Every job runs the same way, in the same order. You see the direction before anything is made, and the frames before anything is final.</p>
      </div>
    </div>
  </div>
</section>

'''+s[pr_b:]
# ---- prices: one short panel, written outright ----
pz_a=s.index('<!-- ================= PRICES ================= -->'); pz_b=s.index('<!-- ================= CONTACT')
s=s[:pz_a]+'''<!-- ================= PRICES — one short panel ================= -->
<section class="sec light" id="prices">
  <div class="inner">
    <div class="beat pz-beat">
      <div class="aw-row rv"><h3 class="aw-t">Prices <span class="sep">|</span> <span class="cl">2026</span></h3><p class="aw-meta"><span>Jordanian dinar &middot; exclusive of tax</span><span>Every package costs less than the same items bought one by one</span></p></div>
      <div class="xg js-xg rv" role="list" aria-label="Packages"></div>
      <div class="pk-custom rv">
        <div><h3>Client customizable</h3><p>Tell us how many videos and posts you need, and how long each runs &mdash; we build the package around it.</p></div>
        <a class="pk-cta" href="mailto:latentstudio.jo@gmail.com?subject=Enquiry%20%C2%B7%20client%20customizable%20package&body=Hello%20Latent%20Studio%2C%0A%0AI%20would%20like%20to%20start%20with%20the%20client%20customizable%20package.%0A%0ABrand%20%2F%20product%3A%0AWhat%20we%20are%20launching%3A%0AWhen%3A%0A%0AThanks%2C%0A">On request <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
      </div>
      <div class="pr3">
        <div class="pr3-col rv" style="--k:1"><h3 class="grp"><b>02</b> Brand &amp; web</h3>
          <div class="ix">
            <a class="row" href="mailto:latentstudio.jo@gmail.com?subject=Enquiry%20%C2%B7%20Brand%20identity%20%C2%B7%20375%20JD&body=Hello%20Latent%20Studio%2C%0A%0AI%20would%20like%20to%20start%20with%20the%20Brand%20identity%20%C2%B7%20375%20JD.%0A%0ABrand%20%2F%20product%3A%0AWhat%20we%20are%20launching%3A%0AWhen%3A%0A%0AThanks%2C%0A"><span class="ixn">1</span><div class="nm">Brand identity<small>Logo, palette, type, guidelines, mockups</small></div><div class="amt">375<i>JD</i></div></a>
            <a class="row" href="mailto:latentstudio.jo@gmail.com?subject=Enquiry%20%C2%B7%20standard%20website%20%C2%B7%20225%20JD&body=Hello%20Latent%20Studio%2C%0A%0AI%20would%20like%20to%20start%20with%20the%20standard%20website%20%C2%B7%20225%20JD.%0A%0ABrand%20%2F%20product%3A%0AWhat%20we%20are%20launching%3A%0AWhen%3A%0A%0AThanks%2C%0A"><span class="ixn">2</span><div class="nm">Website &middot; standard<small>Static build, no animation</small></div><div class="amt">225<i>JD</i></div></a>
            <a class="row" href="mailto:latentstudio.jo@gmail.com?subject=Enquiry%20%C2%B7%20editorial%20website%20%C2%B7%20375%20to%20550%20JD&body=Hello%20Latent%20Studio%2C%0A%0AI%20would%20like%20to%20start%20with%20the%20editorial%20website%20%C2%B7%20375%20to%20550%20JD.%0A%0ABrand%20%2F%20product%3A%0AWhat%20we%20are%20launching%3A%0AWhen%3A%0A%0AThanks%2C%0A"><span class="ixn">3</span><div class="nm">Website &middot; editorial<small>Fully animated &middot; scope-dependent</small></div><div class="amt">375&ndash;550<i>JD</i></div></a>
          </div>
        </div>
        <div class="pr3-col rv" style="--k:2"><h3 class="grp"><b>03</b> Single pieces</h3>
          <div class="duo">
            <div><h4>Standard reel</h4><p class="sub">One to two shots, showcase only.</p>
              <div class="tier"><span>10 / 20 / 30 seconds</span><b>30 / 55 / 80 JD</b></div>
              <div class="tier"><span>Each additional 5s</span><b>+15 JD</b></div></div>
            <div><h4>Cinematic reel</h4><p class="sub">Scripted, cinematics, edits + SFX &middot; 2&ndash;7 shots.</p>
              <div class="tier"><span>10 / 20 / 30 seconds</span><b>80 / 120 / 180 JD</b></div>
              <div class="tier"><span>Each additional 5s</span><b>+30 JD</b></div></div>
          </div>
          <p class="note">Scripting, sound design and one revision round are included in every cinematic reel.</p>
        </div>
        <div class="pr3-col rv" style="--k:3"><h3 class="grp"><b>04</b> Terms</h3>
          <div class="pz-terms">
            <div class="pct"><b>15%</b><span>off packages &middot; first purchase</span></div>
            <div class="pct"><b>10%</b><span>off single items &middot; first purchase</span></div>
            <div class="pct"><b>35%</b><span>down payment &middot; before work begins</span></div>
          </div>
          <p class="note">Once per client. Standard reels are excluded from the single-item discount. The down payment covers engine costs up front and protects both sides.</p>
        </div>
      </div>
    </div>
  </div>
</section>

'''+s[pz_b:]
# the player's meta line: the tile's note already carries city and year, so the fixed spans go
rep('<span class="js-fm-note">Identity &middot; motion &middot; worlds</span><span>Amman</span><span>2026</span>','<span class="js-fm-note">Identity &middot; motion &middot; worlds</span>')
# 3. chrome: the reference's wording; the bar stays on over the home
rep('''  <a class="brand" href="#top"><span class="logo" role="img" aria-label="Latent Studio"></span><span>Latent Studio</span></a>
  <nav><a href="#work">Work</a><a href="#prices">Prices</a><a href="#contact">Contact</a></nav>''',
'''  <a class="brand" href="#top"><span class="logo" role="img" aria-label="Latent Studio"></span><span>&ldquo;Latent.&rdquo;</span></a>
  <nav><span class="js-foot-clock">--:--</span><span class="bar-gmt">(GMT+3)</span><a href="#work">[ View work ]</a><a href="#prices">[ Prices ]</a><a href="#contact">[ Contact ]</a></nav>''')
rep('<span>Amman, Jordan &middot; <span class="js-foot-clock">--:--</span> (GMT+3)</span>','<span>Amman, Jordan</span>')

# ---- sectors: one small animated paragraph ----
sec_a=s.index('<!-- ================= SECTORS ================= -->'); sec_b=s.index('<!-- ================= PORTFOLIO')
s=s[:sec_a]+'''<!-- ================= SECTORS — one line, one paragraph ================= -->
<section class="sec light wipe" id="sectors" style="--prev:var(--ink)">
  <div class="inner">
    <div class="beat sec-beat">
      <p class="eyebrow rv"><b>( Sectors )</b> Where the work lands</p>
      <h2 class="stk js-stk sec-stk" data-every="2400">
        <span class="stk-l" data-i="01" style="--k:0">You name it,</span>
        <span class="stk-l" data-i="02" style="--k:1">we make it.</span>
      </h2>
      <p class="lede sec-lede js-split" style="--step:.03s"><span class="js-seg">Cosmetics, coffee, clothing, jewellery, perfume &mdash; categories where the product is small, the surface is everything, and a conventional shoot costs more than the launch it supports. Skin, glass, resin, fabric and metal are the hardest things to fake, so they get the most direction.</span></p>
      <p class="sp-blk rv" style="--k:3">Skin &middot; glass &middot; resin &middot; fabric &middot; metal</p>
    </div>
  </div>
</section>

'''+s[sec_b:]

# 4. sectors tiles at their own ratio (nothing left to do)
if False:
    sec_a=s.index('<section class="sec light wipe" id="sectors"'); sec_b=s.index('<!-- ================= PORTFOLIO')
    blk=s[sec_a:sec_b]
    def tile_ar(m):
        t=m.group(0)
        v=re.search(r'poster="([^"]+)"',t); im=re.search(r'<img src="([^"]+)"',t)
        r=ar(v.group(1)) if v else ar(im.group(1))
        return re.sub(r'style="--k:(\d)"', r'style="--k:\1;--ar:%s"'%r, t, count=1)
    blk=re.sub(r'<figure class="aw-tile[^"]*" style="--k:\d"[^>]*>.*?</figure>', tile_ar, blk, flags=re.S)
    s=s[:sec_a]+blk+s[sec_b:]
# 5. CSS
CSS='''
/* ---------- the mix: home, project blocks, natural sizes ---------- */
.hero.home{min-height:100vh;min-height:100svh;background:#0B0B0D;display:flex;align-items:center;justify-content:center;overflow:hidden}
.home .bg{position:absolute;top:0;left:0;right:0;bottom:0;z-index:0;overflow:hidden}
.home .bg img{width:100%;height:100%;object-fit:cover;filter:blur(22px) saturate(.9);transform:scale(1.12);opacity:.55}
.home .bg::after{content:"";position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(180deg,rgba(11,11,13,.55),rgba(11,11,13,.35) 50%,rgba(11,11,13,.75))}
.home-in{position:relative;z-index:2;width:100%;max-width:1180px;margin:0 auto;padding:0 var(--gut);display:flex;justify-content:center}
.home .stk-l{color:var(--ivory);font-weight:400;cursor:pointer}
.home .stk.in .stk-l{opacity:.22}
.home .stk.in .stk-l.on{opacity:1}
.bar nav span{opacity:.72}
.bar nav .bar-gmt{margin-left:-10px}
.bar nav a{white-space:nowrap}
/* project blocks on ink */
.prj{margin:clamp(40px,7vh,72px) 0 clamp(56px,10vh,120px)}
.dark .aw-t{color:var(--ivory)} .dark .aw-t .sep{color:rgba(242,239,231,.35)} .dark .aw-t .cl{color:var(--dark-dim)}
.dark .aw-row{border-bottom-color:rgba(242,239,231,.35)} .dark .aw-meta{color:var(--dark-dim)}
.dark .aw-tile figcaption{color:var(--dark-dim)} .dark .aw-tile figcaption .nm{color:var(--ivory)}
.dark .aw-img{background:#08080B}
.mg{display:grid;gap:clamp(18px,3vh,28px) 8px;align-items:start}
.mg.g3{grid-template-columns:repeat(3,minmax(0,1fr))}
.mg.g4{grid-template-columns:repeat(4,minmax(0,1fr))}
.mg.g2{grid-template-columns:repeat(2,minmax(0,1fr))}
.mg.side{grid-template-columns:1.41fr minmax(0,1fr) minmax(0,1fr)}
.mg.side .aw-tile:first-child{grid-row:1/3;display:flex;flex-direction:column}
.mg.side .aw-tile:first-child .aw-img{flex:1;aspect-ratio:auto;min-height:0}
.mg .aw-tile{min-width:0}
.mg .aw-tile figcaption{grid-template-columns:1fr auto}
/* every still and film at its own ratio */
.aw-img,.aw-tile.wide .aw-img,.id-grid .aw-img{aspect-ratio:var(--ar,16/10)}
.aw-grid{align-items:start;grid-template-columns:repeat(3,minmax(0,1fr))}
#sectors .aw-tile:nth-child(n+3){order:-1}
#sectors .aw-tile.wide{grid-column:auto}
@media(max-width:700px){#sectors .aw-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:18px 6px}}
@media(max-width:700px){
  .aw-tile.wide .aw-img{aspect-ratio:var(--ar,16/10)}
  .mg{gap:12px 5px}
  .mg .aw-tile figcaption{grid-template-columns:1fr}.mg .aw-tile figcaption span:last-child{display:none}
  .prj{margin:28px 0 48px}
  .bar nav{gap:8px}.bar nav .bar-gmt{display:none}
}
'''
CSS2=open(SP+'v3_css2.css').read()+open(SP+'v3_css3.css').read()+open(SP+'v3_css4.css').read()
CSS2+='''
.js-steps .ixl-prev figcaption{display:none}
/* the sectors line, stacked like the method's */
.sec-stk{margin:0 auto;width:100%}
.sec-stk .stk-l{font-size:calc(clamp(34px,7.6vw,112px) * var(--fit,1))}
.sec-lede{margin-bottom:clamp(18px,3vh,28px)}
/* prices, short */
#prices{padding-top:clamp(24px,4vh,40px);padding-bottom:clamp(32px,5vh,56px)}
.pz-beat{padding:0;min-height:0}
.pz-beat .aw-row{padding-bottom:10px;margin-bottom:14px}
.pz-beat .xg{height:clamp(190px,24vh,230px);margin-top:0}
.pz-beat .xg-in{padding:14px 16px}
.pz-beat .xg-name{font-size:clamp(16px,1.5vw,22px)}
.pz-beat .xg-price b{font-size:clamp(22px,2.2vw,30px)}
.pz-beat .xg-desc,.pz-beat .xg-feats{display:none}
.pz-beat .pk-custom{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:10px 16px;margin-top:8px}
.pz-beat .pk-custom h3{margin:0;font-size:12px}
.pz-beat .pk-custom p{margin:2px 0 0;font-size:11.5px;max-width:none}
.pz-beat .pk-custom .pk-cta{font-size:10.5px;gap:6px}
.pz-beat .pk-custom .pk-cta svg{width:16px;height:16px}
.pr3{margin-top:clamp(18px,3vh,28px);gap:clamp(18px,3vw,40px)}
.pr3 h3.grp{margin-bottom:8px;font-size:10px}
.pr3 .row{padding:7px 0;gap:8px 12px}
.pr3 .row .nm{font-size:13px}.pr3 .row .nm small{font-size:10.5px;margin-top:2px}.pr3 .row .amt{font-size:13px}.pr3 .row .amt i{font-size:9px}
.pr3 .ixn{font-size:9px}
.pr3 .duo{gap:10px}.pr3 .duo h4{font-size:12px;margin-bottom:2px}.pr3 .duo .sub{font-size:11px;margin-bottom:4px}
.pr3 .tier{font-size:11.5px;padding:5px 0}.pr3 .tier b{font-size:11.5px}
.pr3 .note{font-size:11px;margin-top:10px;line-height:1.5}
.pz-terms{display:flex;flex-direction:column;gap:8px}
.pz-terms .pct{display:flex;align-items:baseline;gap:12px;padding:6px 0;border-bottom:1px solid var(--rule)}
.pz-terms .pct b{display:inline;font-size:20px;min-width:3.2em}
.pz-terms .pct span{display:inline;margin:0;font-size:10px;letter-spacing:.1em}
@media(max-width:700px){.pr3{gap:20px}.pz-beat .xg{height:150px}.pz-beat .xg-in{padding:9px 8px}.pz-beat .xg-n{font-size:6.5px}.pz-beat .xg-name{font-size:8.5px;letter-spacing:0;margin-top:2px}.pz-beat .xg-badge{font-size:5.5px;padding:2px 4px;top:6px;right:6px}.pz-beat .xg-price b{font-size:15px}.pz-beat .xg-price span{font-size:7px}.pz-beat .pk-custom{padding:9px 12px;gap:10px}.pz-beat .pk-custom h3{font-size:10.5px}.pz-beat .pk-custom p{font-size:9.5px}.pz-beat .pk-custom .pk-cta{font-size:9px}.pr3 .row{padding:6px 0}.pr3 .row .nm{font-size:12px}.pr3 .row .nm small{font-size:9.5px}.pr3 .row .amt{font-size:12px}.pr3 h3.grp{font-size:9px}.pz-terms .pct b{font-size:16px}.pz-terms .pct span{font-size:8.5px}}
'''
CSS2+='''
/* the home lines, a size up */
.hero.home .hs{font-size:13px;letter-spacing:.3em}
.hero.home .hs-name{font-size:14px;gap:1em}
.hero.home .hs-name .logo{width:2em;height:2em}
.hero.home .hs-role{font-size:14px;letter-spacing:.2em}
.hero.home .hs-foot{font-size:10.5px}
@media(max-width:820px){.hero.home .hs{font-size:8px;letter-spacing:.12em}.hero.home .hs-name{font-size:8px;left:5%;gap:.6em}.hero.home .hs-name .logo{width:1.6em;height:1.6em}.hero.home .hs-role{font-size:8px;right:5%;letter-spacing:.03em}.hero.home .hs-foot{font-size:8.5px}}
@media(max-width:600px){.bar nav .js-foot-clock{display:none}.bar nav{gap:10px}}
.js-steps .ixl-row{cursor:default}
.js-steps .ixl-prev{pointer-events:none}
'''
rep('\n/* ---------- contact / footer ---------- */', CSS+CSS2+'\n/* ---------- contact / footer ---------- */')
# the sectors' own grid keeps two columns; the cinema tile no longer forces 21:9
rep('.aw-tile.wide .aw-img{aspect-ratio:21/9}','')
s=s.replace('<title>','<script>'+WKJS+'</script>\n<title>',1)

# ---- JS: the scenes ----
rep('''      var lead = p * (g.words.length + 2);''','''      if(g.hold.classList.contains("js-scenes")) p = clamp01((p - .02) / .22);
      var lead = p * (g.words.length + 2);''')
rep('''      spObs.observe(sp);''','''      /* on the locked stage the scene decides, not the observer */''')
rep('''    if(typeof spShow === "function" && !spSeen && sp && sp.getBoundingClientRect().top < vh * .7) spShow();''','''''')
rep('''  function ltLock(){
    if(!lt || ltDone) return;''','''  function ltStart(){
    if(!lt || ltDone) return;
    ltDone = true;
    if(reduce){ lt.classList.add("up"); return; }
    requestAnimationFrame(function(){ lt.classList.add("up"); });
    setTimeout(ltLoop, 1800);
  }
  function ltLock(){
    if(!lt || ltDone || document.querySelector(".js-scenes")) return;''')
rep('''  function paint(){
    ticking = false;''','''  /* ---- the studio scenes: one stage, four scrolls, a ground that moves ---- */
  var scHold = document.querySelector(".js-scenes"), scStage = scHold && scHold.querySelector(".st-stage"),
      scs = scHold ? [].slice.call(scHold.querySelectorAll(".js-sc")) : [], scCue = scHold && scHold.querySelector(".js-cue"), scCueBar = scHold && scHold.querySelector(".st-cue"), scAt = "";
  var SC_NAMES = { a:"01 · Studio", b:"02 · What we make", c:"03 · Minimalism", d:"04 · Simplicity" };
  function scenes(){
    if(!scHold) return;
    var vh = window.innerHeight, run = Math.max(1, geo.scRun);
    var p = clamp01((window.scrollY - geo.sc) / run);
    var cur = p < .30 ? "a" : p < .58 ? "b" : p < .80 ? "c" : "d";
    if(window.innerWidth >= 900){ scStage.style.setProperty("--z", (1 + p * .9).toFixed(3)); scStage.style.setProperty("--py", Math.round(p * 90)); }
    if(scCueBar) scCueBar.style.setProperty("--p", p.toFixed(3));
    if(cur === scAt) return;
    scAt = cur; scStage.dataset.scene = cur;
    var order = ["a","b","c"], vis = cur === "d" ? "c" : cur;
    scs.forEach(function(el){
      var i = order.indexOf(el.dataset.s), j = order.indexOf(vis);
      el.classList.toggle("on", i === j); el.classList.toggle("gone", i < j);
    });
    if(scCue) scCue.textContent = SC_NAMES[cur];
    if(cur === "b") ltStart();
    if(cur === "c" || cur === "d"){ if(typeof spShow === "function") spShow(); }
    if(typeof spSwitch === "function" && sp){
      var want = cur === "d" ? "right" : "left";
      if((cur === "c" || cur === "d") && sp.dataset.side !== want) spSwitch(want);
    }
    if(lt){ ltSeen = cur === "b"; }
  }

  /* ---- the portfolio stage: five projects on one locked screen. It
     starts empty and ink; each project's pieces lay themselves out to
     fill the left side (justified rows, nothing cropped) as you scroll,
     and the names stand stacked on the right, the live one awake ---- */
  var wkHold = document.querySelector(".js-wk-hold"), wkStage = wkHold && wkHold.querySelector(".js-wk-stage"),
      wkSets = wkHold ? [].slice.call(wkHold.querySelectorAll(".js-wk-set")) : [], wkMedia = wkHold && wkHold.querySelector(".js-wk-media"),
      wkStk = wkHold && wkHold.querySelector(".js-wk-stk"), wkLines = wkHold ? [].slice.call(wkHold.querySelectorAll(".js-wk-stk .stk-l")) : [], wkText = wkHold && wkHold.querySelector(".wk-text"), wkProj = wkHold && wkHold.querySelector(".js-wk-proj"), wkMeta = wkHold && wkHold.querySelector(".js-wk-meta"),
      wkNote = wkHold && wkHold.querySelector(".js-wk-note"), wkCount = wkHold && wkHold.querySelector(".js-wk-count"), wkN = wkHold && wkHold.querySelector(".js-wk-n"),
      wkOpen = wkHold && wkHold.querySelector(".js-wk-open"), wkFilter = wkHold ? [].slice.call(wkHold.querySelectorAll(".js-wk-filter span")) : [],
      wkCue = wkHold && wkHold.querySelector(".wk-cue"), wkAt = -1, WK = window.__WK || [];
  function pad2(n){ return (n < 10 ? "0" : "") + n; }
  function wkRotate(txt){
    [].forEach.call(wkTitle.querySelectorAll(".w"), function(w){ w.classList.add("out"); setTimeout(function(){ if(w.parentNode) w.parentNode.removeChild(w); }, 700); });
    var w = document.createElement("span"), n = 0; w.className = "w";
    txt.split(" ").forEach(function(word, wi, arr){
      var ws = document.createElement("span"); ws.className = "wd";
      word.split("").forEach(function(ch){ var c = document.createElement("span"); c.className = "c"; c.textContent = ch; c.style.setProperty("--d", (n++ * .018).toFixed(3) + "s"); ws.appendChild(c); });
      w.appendChild(ws); if(wi < arr.length - 1) w.appendChild(document.createTextNode(" "));
    });
    wkTitle.appendChild(w);
    if(reduce){ w.classList.add("in"); return; }
    requestAnimationFrame(function(){ requestAnimationFrame(function(){ w.classList.add("in"); }); });
  }
  function wkSwap(el, html){
    if(!el) return;
    if(reduce){ el.innerHTML = html; return; }
    el.classList.add("out"); setTimeout(function(){ el.innerHTML = html; el.classList.remove("out"); }, 260);
  }
  function wkLayout(){
    if(!wkMedia) return;
    var W = wkMedia.clientWidth, H = wkMedia.clientHeight, gap = 8;
    if(W < 10 || H < 10) return;
    wkSets.forEach(function(set){
      var items = [].slice.call(set.querySelectorAll(".wk-m"));
      var ars = items.map(function(m){ var r = m.style.getPropertyValue("--ar").split("/"); return parseFloat(r[0]) / parseFloat(r[1] || 1); });
      var total = ars.reduce(function(a, c){ return a + c; }, 0), best = null;
      for(var r = 1; r <= Math.min(6, items.length); r++){
        var rows = [], cum = 0;
        ars.forEach(function(a, i){ var k = Math.min(r - 1, Math.floor((cum + a / 2) / total * r)); (rows[k] = rows[k] || []).push(i); cum += a; });
        rows = rows.filter(function(x){ return x && x.length; });
        var hs = rows.map(function(row){ var s = row.reduce(function(a, i){ return a + ars[i]; }, 0); return (W - gap * (row.length - 1)) / s; });
        var tot = hs.reduce(function(a, c){ return a + c; }, 0) + gap * (rows.length - 1), scale = Math.min(1, H / tot);
        var avg = hs.reduce(function(a, c){ return a + c; }, 0) / hs.length * scale;
        if(!best || avg > best.avg) best = { rows:rows, hs:hs, scale:scale, avg:avg };
      }
      var y = 0, g = gap * best.scale;
      best.rows.forEach(function(row, ri){
        var h = best.hs[ri] * best.scale, x = 0;
        row.forEach(function(i){
          var w = h * ars[i], m = items[i];
          m.style.width = Math.round(w) + "px"; m.style.height = Math.round(h) + "px";
          m.style.left = Math.round(x) + "px"; m.style.top = Math.round(y) + "px";
          x += w + g;
        });
        y += h + g;
      });
      set.style.setProperty("--oy", Math.max(0, Math.round((H - (y - g)) / 2)) + "px");
    });
  }
  function wkFit(){
    if(!wkStk || !wkText) return;
    wkStk.style.setProperty("--fit", "1");
    var room = wkText.clientWidth - 4, widest = 0;
    wkLines.forEach(function(l){ widest = Math.max(widest, l.scrollWidth); });
    if(widest > room) wkStk.style.setProperty("--fit", (room / widest).toFixed(3));
  }
  function wkShow(i){
    if(i === wkAt) return;
    var first = wkAt < 0; wkAt = i;
    if(wkStage) wkStage.classList.toggle("live", i >= 0);
    wkLines.forEach(function(l, k){ l.classList.toggle("on", k === i); });
    if(!WK[i]){ wkCount.textContent = "\u2014 / " + pad2(WK.length); return; }
    wkSets.forEach(function(set, k){
      set.classList.toggle("on", k === i); set.classList.toggle("gone", k < i);
      [].forEach.call(set.querySelectorAll(".js-tile-v"), function(v){ if(k === i) vPlay(v); else v.pause(); });
    });
    wkFilter.forEach(function(sp, k){ sp.classList.toggle("on", k === i); });
    var meta = WK[i].meta, note = WK[i].note, proj = WK[i].proj, n = WK[i].n + (WK[i].n === 1 ? " piece" : " pieces");
    if(first){ wkProj.textContent = proj; wkMeta.textContent = meta; wkNote.textContent = note; wkN.textContent = n; }
    else { wkSwap(wkProj, proj); wkSwap(wkMeta, meta); wkSwap(wkNote, note); wkSwap(wkN, n); }
    wkCount.textContent = pad2(i + 1) + " / " + pad2(WK.length);
    wkOpen.textContent = WK[i].film ? "[ Play the film ]" : "[ Open full frame ]";
    var wkPdf = wkHold.querySelector(".js-wk-pdf"); if(wkPdf){ wkPdf.hidden = !WK[i].pdf; if(WK[i].pdf) wkPdf.href = WK[i].pdf; }
  }
  function wkTick(){
    if(!wkHold) return;
    var vh = window.innerHeight, run = Math.max(1, geo.wkRun), N = wkSets.length;
    var p = clamp01((window.scrollY - geo.wk) / run);
    var q = (p - .06) / .94, idx = q < 0 ? -1 : Math.min(N - 1, Math.floor(q * N)), seg = idx < 0 ? 0 : q * N - idx;
    if(wkCue) wkCue.style.setProperty("--p", p.toFixed(3));
    if(wkMedia) wkMedia.style.setProperty("--sy", ((.5 - seg) * 28).toFixed(1));
    wkShow(idx);
  }
  if(wkHold){
    wkHold.style.height = "calc(100svh + " + (wkSets.length * 80) + "vh)";
    var wkAll = function(){ wkLayout(); wkFit(); };
    wkAll(); window.addEventListener("resize", wkAll, { passive:true });
    if(document.fonts && document.fonts.ready) document.fonts.ready.then(wkAll);
    /* the media area changes height on a phone (the browser bar collapsing, the text column
       swapping) and the tiles sit on measured coordinates, so any resize lays them out again */
    if("ResizeObserver" in window){ var wkRO = new ResizeObserver(function(){ wkLayout(); }); wkRO.observe(wkMedia); if(wkText) wkRO.observe(wkText); }
    wkOpen.addEventListener("click", function(){ var set = wkSets[wkAt]; var m = set && set.querySelector(".wk-m"); if(m) m.click(); });
    wkLines.forEach(function(l, k){ l.addEventListener("click", function(){
      var vh = window.innerHeight, run = Math.max(1, wkHold.offsetHeight - vh);
      window.scrollTo({ top: window.scrollY + wkHold.getBoundingClientRect().top + run * (.06 + .94 * (k + .5) / wkSets.length), behavior: reduce ? "instant" : "smooth" });
    }); });
  }

  /* ---- the home: words pull up (21st WordsPullUp), the film leans with the pointer ---- */
  var prisma = document.querySelector(".js-prisma");
  if(prisma){
    var pw = prisma.querySelector(".pw"), pvs = [].slice.call(prisma.querySelectorAll(".js-pv-v"));
    if(pw){ var txt = pw.textContent; pw.textContent = ""; txt.split("").forEach(function(ch, k){ var c = document.createElement("span"); c.className = "c"; c.textContent = ch; c.style.setProperty("--d", (k * .08 + .12).toFixed(2) + "s"); pw.appendChild(c); }); }
    function pvRun(){ pvs.forEach(function(v){ if(getComputedStyle(v).display === "none"){ v.pause(); } else vPlay(v); }); }
    pvRun(); window.addEventListener("resize", pvRun, { passive:true });
    if("IntersectionObserver" in window) new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting) pvRun(); else pvs.forEach(function(v){ v.pause(); }); }); }, { threshold:.05 }).observe(prisma);
    requestAnimationFrame(function(){ requestAnimationFrame(function(){ prisma.classList.add("pull"); }); });
    if(fine && !reduce){
      prisma.addEventListener("pointermove", function(e){
        var r = prisma.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        prisma.style.setProperty("--px", (x * -16).toFixed(1) + "px"); prisma.style.setProperty("--py", (y * -12).toFixed(1) + "px");
      });
      prisma.addEventListener("pointerleave", function(){ prisma.style.setProperty("--px", "0px"); prisma.style.setProperty("--py", "0px"); });
    }
  }

  /* ---- one-scroll locks: the panel holds for one screen of scroll and
     its pieces come in one after another as you scroll through it; a
     panel taller than the screen is left in flow and reveals as before ---- */
  var lks = [].slice.call(document.querySelectorAll(".js-lk")).map(function(h){
    return { hold:h, stage:h.firstElementChild, items:[].slice.call(h.querySelectorAll(".rv, .js-split, .js-pu2")) };
  });
  function lkMeasure(){
    lks.forEach(function(g){
      g.hold.classList.remove("nolock");
      var tall = g.stage.scrollHeight > window.innerHeight + 2;
      g.hold.classList.toggle("nolock", tall);
      if(tall) g.items.forEach(function(el){ if(el.getBoundingClientRect().top < window.innerHeight * .94) el.classList.add("in"); });
    });
  }
  function lkTick(){
    var vh = window.innerHeight;
    lks.forEach(function(g){
      if(g.hold.classList.contains("nolock")){
        g.items.forEach(function(el){ if(!el.classList.contains("in") && el.getBoundingClientRect().top < vh * .94) el.classList.add("in"); });
        return;
      }
      var run = Math.max(1, g.run || 1), p = clamp01((window.scrollY - g.top) / run), n = g.items.length;
      g.items.forEach(function(el, k){ el.classList.toggle("in", p >= .05 + .6 * (n > 1 ? k / (n - 1) : 0)); });
    });
  }
  if(lks.length){ lkMeasure(); window.addEventListener("resize", lkMeasure, { passive:true }); if(document.fonts && document.fonts.ready) document.fonts.ready.then(lkMeasure); }

  /* ---- page geometry, measured once: the scroll loop never asks layout
     for a rectangle, it compares scrollY with these ---- */
  var geo = { sc:0, scRun:1, wk:0, wkRun:1, heroEnd:0, grounds:[] };
  function docTop(el){ return el.getBoundingClientRect().top + window.scrollY; }
  function measureGeo(){
    var vh = window.innerHeight;
    if(scHold){ geo.sc = docTop(scHold); geo.scRun = scHold.offsetHeight - vh; }
    if(wkHold){ geo.wk = docTop(wkHold); geo.wkRun = wkHold.offsetHeight - vh; }
    lks.forEach(function(g){ g.top = docTop(g.hold); g.run = g.hold.offsetHeight - vh; });
    if(hero){ var hh = hero.closest(".js-lk") || hero; geo.heroEnd = docTop(hh) + hh.offsetHeight; }
    geo.grounds = grounds.map(function(el){ var h = el.closest(".js-lk") || el; var t = docTop(h); return { el:el, top:t, bottom:t + h.offsetHeight, light:el.classList.contains("light") }; });
  }
  measureGeo();
  window.addEventListener("resize", function(){ requestAnimationFrame(measureGeo); }, { passive:true });
  window.addEventListener("load", measureGeo);
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ requestAnimationFrame(measureGeo); });
  setTimeout(measureGeo, 1500); setTimeout(measureGeo, 4000);

  function paint(){
    ticking = false;
    scenes();
    wkTick();
    lkTick();''')

# ---- the packages write an email ----
rep('  var xg = document.querySelector(".js-xg");\n  if(xg){','  /* every package writes an email to the studio with the package named in it */\n  var MAIL = "latentstudio.jo@gmail.com";\n  function mailtoFor(what){\n    var subject = "Enquiry \\u00b7 " + what;\n    var body = "Hello Latent Studio,\\n\\nI would like to start with the " + what + ".\\n\\nBrand / product:\\nWhat we are launching:\\nWhen:\\n\\nThanks,\\n";\n    return "mailto:" + MAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);\n  }\n  var xg = document.querySelector(".js-xg");\n  if(xg){')
rep('<div class="xg-price"><b>\' + pk.price + \'</b><span>JD</span></div><div class="xg-open">Open</div></div></div></div>\';','<div class="xg-price"><b>\' + pk.price + \'</b><span>JD</span></div><a class="xg-open" href="\' + mailtoFor(pk.name + " package \\u00b7 " + pk.price + " JD") + \'">Enquire</a></div></div></div>\';')
rep('        \'<a class="xg-cta" href="#contact">Start with \' + pk.name + " " + ARROW + \'</a></div>\' +','        \'<a class="xg-cta" href="\' + mailtoFor(pk.name + " package \\u00b7 " + pk.price + " JD") + \'">Start with \' + pk.name + " " + ARROW + \'</a></div>\' +')
rep('      p.addEventListener("click", function(){\n        // on touch the first tap expands, the second opens — a hover you can feel\n        if(!fine && !p.classList.contains("on")){ hover(i); return; }\n        open(i);\n      });\n      p.addEventListener("keydown", function(e){ if(e.key === "Enter" || e.key === " "){ e.preventDefault(); open(i); } });','      p.addEventListener("click", function(e){\n        if(e.target.closest && e.target.closest(".xg-open")) return; // the link itself\n        location.href = mailtoFor(PACKS[i].name + " package \\u00b7 " + PACKS[i].price + " JD");\n      });\n      p.addEventListener("keydown", function(e){ if(e.key === "Enter" || e.key === " "){ e.preventDefault(); location.href = mailtoFor(PACKS[i].name + " package \\u00b7 " + PACKS[i].price + " JD"); } });')
# ---- the package cards are links ----
rep('      return \'<div class="xg-p\' + (pk.pop ? " pop" : "") + \'" role="listitem" tabindex="0" data-i="\' + i + \'">\' +','      return \'<a class="xg-p\' + (pk.pop ? " pop" : "") + \'" role="listitem" data-i="\' + i + \'" href="\' + mailtoFor(pk.name + " package \\u00b7 " + pk.price + " JD") + \'">\' +')
rep('<a class="xg-open" href="\' + mailtoFor(pk.name + " package \\u00b7 " + pk.price + " JD") + \'">Enquire</a></div></div></div>\';','<span class="xg-open">Enquire</span></div></div></a>\';')
rep('      p.addEventListener("click", function(e){\n        if(e.target.closest && e.target.closest(".xg-open")) return; // the link itself\n        location.href = mailtoFor(PACKS[i].name + " package \\u00b7 " + PACKS[i].price + " JD");\n      });\n      p.addEventListener("keydown", function(e){ if(e.key === "Enter" || e.key === " "){ e.preventDefault(); location.href = mailtoFor(PACKS[i].name + " package \\u00b7 " + PACKS[i].price + " JD"); } });','      /* the card is a link to the written email; nothing to script */')
# ---- source surgery for the new stages ----
rep("""      var tv = tile.querySelector(".js-tile-v"), ti = tile.dataset.img ? tile.querySelector(".aw-img img") : null;""",
    """      var tv = tile.querySelector(".js-tile-v"), ti = tile.dataset.img ? tile.querySelector("img") : null;""")
rep("""      var own = tv && tile.contains(tv);
      if(own && "IntersectionObserver" in window){""",
    """      var own = tv && tile.contains(tv);
      if(own && tile.closest(".js-wk-stage")){ /* the portfolio stage plays the active set itself */ }
      else if(own && "IntersectionObserver" in window){""")
rep("""  if(reduce){ barTick(); window.addEventListener("scroll", barTick, { passive:true }); return; }""",
    """  if(reduce){ barTick(); window.addEventListener("scroll", barTick, { passive:true }); }""")
# ---- one-scroll locks around the single panels ----
for _id in []:  # only the hero and the portfolio lock; the single panels flow and reveal as they are reached
    _m=re.search(r'<section class="(sec[^"]*)" id="%s"'%_id, s); assert _m,_id
    _a=_m.start(); _z=s.index('</section>',_a)+len('</section>')
    s=s[:_a]+'<div class="lk-hold js-lk">'+s[_a:_m.end()].replace('class="%s"'%_m.group(1),'class="%s lk-stage"'%_m.group(1))+s[_m.end():_z]+'</div>'+s[_z:]
rep("""  var rv = [].slice.call(document.querySelectorAll(".rv"));""","""  var rv = [].slice.call(document.querySelectorAll(".rv")).filter(function(el){ return !el.closest(".js-lk"); });
  var lkRv = [].slice.call(document.querySelectorAll(".js-lk .rv"));""")
rep("""  var timed = track.filter(function(el){ return !el.classList.contains("js-lock"); });""","""  var timed = track.filter(function(el){ return !el.classList.contains("js-lock") && !el.closest(".js-lk"); });""")
rep("""    requestAnimationFrame(function(){ requestAnimationFrame(function(){ prisma.classList.add("pull"); }); });""","""    if(!prisma.closest(".js-lk")) requestAnimationFrame(function(){ requestAnimationFrame(function(){ prisma.classList.add("pull"); }); });""")
rep("""    wipes.forEach(function(el){ if(!el.classList.contains("in") && el.getBoundingClientRect().top < vh * .82) el.classList.add("in"); });
    rv.forEach(function(el){ if(!el.classList.contains("in") && el.getBoundingClientRect().top < vh * .94) el.classList.add("in"); });""",
"""    if((barTick.n = (barTick.n || 0) + 1) % 3 === 0){
      wipes = wipes.filter(function(el){ if(el.classList.contains("in")) return false; if(el.getBoundingClientRect().top < vh * .82){ el.classList.add("in"); return false; } return true; });
      rv = rv.filter(function(el){ if(el.classList.contains("in")) return false; if(el.getBoundingClientRect().top < vh * .94){ el.classList.add("in"); return false; } return true; });
    }""")
rep("""    bar.classList.toggle("on", hero.getBoundingClientRect().bottom < 40);
    var y = 28, ink = false;
    for(var i = 0; i < grounds.length; i++){
      var r = grounds[i].getBoundingClientRect();
      if(r.top <= y && r.bottom > y){ ink = grounds[i].classList.contains("light"); break; }
    }""","""    var sy = window.scrollY;
    bar.classList.toggle("on", geo.heroEnd - sy < 40);
    var y = sy + 28, ink = false, gg = geo.grounds;
    for(var i = 0; i < gg.length; i++){
      if(gg[i].top <= y && gg[i].bottom > y){ ink = gg[i].light; break; }
    }""")
rep("""  function inContact(){ return contactSec && contactSec.getBoundingClientRect().top < window.innerHeight * .5; }""",
    """  function inContact(){ if(!contactSec) return false; var g = geo.grounds.filter(function(x){ return x.el === contactSec; })[0]; return g ? g.top - window.scrollY < window.innerHeight * .5 : false; }""")
open(os.environ.get('OUT','/home/user/main/latent-v3')+'/index.html','w',encoding='utf-8').write(s)
open(os.environ.get('OUT','/home/user/main/latent-v3')+'/_headers','w').write('/*\n  Cache-Control: public, max-age=0, must-revalidate\n  X-Content-Type-Options: nosniff\n')
print('written',len(s))

# ---------------- dedupe: every big data URI is carried once; repeats point at the first ----------------
s=open(os.environ.get('OUT','/home/user/main/latent-v3')+'/index.html',encoding='utf-8').read()
seen={}; n=[0]
def dd(m):
    attr,uri=m.group(1),m.group(2)
    if uri in seen: return 'data-ref-%s="%s|%s"'%(attr,seen[uri][0],seen[uri][1])
    n[0]+=1; uid='u%d'%n[0]; seen[uri]=(uid,attr)
    return '%s="%s" data-u-%s="%s"'%(attr,uri,attr,uid)
exec(open(SP+'v3_copy.py').read())
s2=re.sub(r'\b(src|poster)="(data:(?:image|video)/[^"]{20000,})"', dd, s)
DEDUPE='''<script>
/* repeats of a still or a film point at the one copy carried in the file */
(function(){
  var own = {};
  ["src","poster"].forEach(function(attr){ [].forEach.call(document.querySelectorAll("[data-u-" + attr + "]"), function(e){ own[e.getAttribute("data-u-" + attr)] = e; }); });
  ["src","poster"].forEach(function(attr){
    [].forEach.call(document.querySelectorAll("[data-ref-" + attr + "]"), function(e){
      var ref = e.getAttribute("data-ref-" + attr).split("|"), o = own[ref[0]]; if(o) e.setAttribute(attr, o.getAttribute(ref[1] || attr));
    });
  });
})();
/* Safari will not play a film carried as a data: URI (it wants byte ranges), so
   every film is handed over as a blob: URL held in memory before the page script runs */
(function(){
  function swap(el, attr){
    var u = el.getAttribute(attr); if(!u || u.indexOf("data:video") !== 0) return;
    try{
      var parts = u.split(","), mime = parts[0].slice(5).split(";")[0], bin = atob(parts[1]), len = bin.length, arr = new Uint8Array(len);
      for(var i = 0; i < len; i++) arr[i] = bin.charCodeAt(i);
      el.setAttribute(attr, URL.createObjectURL(new Blob([arr], { type: mime })));
    }catch(e){}
  }
  [].forEach.call(document.querySelectorAll("video[src], source[src]"), function(el){ swap(el, "src"); });
  [].forEach.call(document.querySelectorAll("video"), function(v){ if(v.querySelector("source")) v.load(); });
})();
</script>
'''
_k=s2.rfind('<script>'); s2=s2[:_k]+DEDUPE+s2[_k:]  # right before the page script, after every owner element
open(os.environ.get('OUT','/home/user/main/latent-v3')+'/index.html','w',encoding='utf-8').write(s2)
print('dedupe: unique',n[0],'size',len(s2))
