# ---- the panel after the hero, version two, after the second reference:
#      a dark statement that brightens word by word, a marquee, a blinds wipe into ivory,
#      key facts as cards, selected work in an offset grid, and a stacked type block ----
_sa=s.index('<section class="sec light" id="studio" style="padding:0">'); _sb=s.index('<!-- ================= METHOD')
W=lambda name: du('gen/'+name,'image/jpeg')
shoes,chair,fish,cup,umbrella,cactus=[W(n) for n in ('p1.jpg','p2.jpg','p3.jpg','l1.jpg','l2.jpg','l3.jpg')]
STEPS=[
 ('img',shoes,'01','Brief','You send the product, the palette and the mood. We write the direction.'),
 ('txt',None,None,None,'The same path on every job: brief, direction, frames, craft, files. Days, not weeks.'),
 ('img',chair,'02','Direct','Light, lens, angle and story are decided before a single frame is made.'),
 ('ink',None,'03','Generate','Hundreds of frames. Only the ones that look shot are kept.'),
 ('img',fish,'04','Craft','Retouch, grade and type by hand. Then the files ship in every format.'),
]
WORK=[
 (cup,'Standing on the ceiling','Explorations &middot; 2026'),
 (atel_hi[1],'Atelier Rebul','&Eacute;lixir 2 &middot; nine plates and a film'),
 (umbrella,'The egg on the fork','Explorations &middot; 2026'),
 (care[0],'Cube Care Center','Identity and campaign'),
 (cactus,'Rain indoors','Explorations &middot; 2026'),
 (a['rawabina'],'Rawabina','Touch of Green &middot; editorial website'),
]
_facts=''
for k,(kind,img,num,word,txt) in enumerate(STEPS):
    if kind=='img': _facts+='        <div class="kf kf-img rv" style="--k:%d"><img src="%s" alt="" loading="lazy" decoding="async"><span class="kf-kick">( %s ) %s</span><div class="kf-in"><b class="kf-word">%s</b><p>%s</p></div><i class="kf-num">%s</i></div>\n'%(k,img,num,word,word,txt,num)
    elif kind=='ink': _facts+='        <div class="kf kf-ink rv" style="--k:%d"><span class="kf-kick">( %s ) %s</span><div class="kf-in"><b class="kf-word">%s</b><p>%s</p></div><i class="kf-num">%s</i></div>\n'%(k,num,word,word,txt,num)
    else: _facts+='        <div class="kf kf-txt rv" style="--k:%d"><p>%s</p></div>\n'%(k,txt)
_work=''.join('        <a class="wk2" href="#work" style="--k:%d"><span class="wk2-img" style="--r:%s"><img src="%s" alt="" loading="lazy" decoding="async"></span><span class="wk2-t">%s</span><span class="wk2-d">%s</span></a>\n'%(i%2, '16/10' if i%2==0 else '4/5' if False else '16/10', img, t, d) for i,(img,t,d) in enumerate(WORK))
V2='''<section class="sec dark st2 js-st2" id="studio">
  <div class="st2-bg js-st2-bg" aria-hidden="true"><i class="g1"></i><i class="g2"></i><i class="s1"></i><i class="s2"></i><i class="s3"></i><i class="l1"></i><i class="l2"></i><i class="l3"></i></div>
  <div class="inner st2-in">
    <p class="st2-line js-bright">Latent is an AI-native design studio in Amman, making the visual side of a brand with generative tools in the hands of art directors.</p>
    <p class="st2-corner st2-tl rv">We direct before we generate.<br>Minimal first, craft always,<br>built to ship.</p>
    <div class="st2-br rv"><p>Our job is to make AI work look shot, not typed: brand visuals that are minimal, simple and never average.</p><a class="mono-link" href="#method">More about us <span>&rarr;</span></a></div>
    <p class="st2-corner st2-bl rv">Focused direction.<br>Measured delivery.</p>
  </div>
</section>
<section class="sec dark mq" aria-hidden="true">
  <p class="mq-corner">The rule of Latent.<br>On every job.</p>
  <div class="mq-track"><span class="mq-run">Minimal <i>+</i> Simple <i>+</i> Never average <i>+</i> Minimal <i>+</i> Simple <i>+</i> Never average <i>+</i> </span><span class="mq-run">Minimal <i>+</i> Simple <i>+</i> Never average <i>+</i> Minimal <i>+</i> Simple <i>+</i> Never average <i>+</i> </span></div>
</section>
<div class="blinds js-blinds" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
<section class="sec light kfs" id="facts">
  <div class="inner">
    <h2 class="kf-title rv">How it works</h2>
    <p class="kf-sub rv">From a brief to final files, the same way every time.</p>
    <div class="kf-row">
''' + _facts + '''    </div>
    <p class="kf-clients rv"><b>Clients so far</b><span>Atelier Rebul</span><span>Cube Care Center</span><span>Cube Coffee House</span><span>Rawabina Al-Khadhraa</span></p>
  </div>
</section>
<section class="sec light hz js-hz" id="explorations">
  <div class="hz-hold js-hz-hold">
    <div class="hz-stage">
      <div class="hz-track js-hz-track">
        <div class="hz-head"><h2 class="sw2-title">Selected work<br>&amp; explorations</h2><a class="mono-link" href="#work">View all projects <span>&rarr;</span></a></div>
''' + _work + '''        <div class="hz-disc"><p>Discover the complete collection of posts, films, identities and websites.</p><a class="mono-link" href="#work">View all projects <span>&rarr;</span></a></div>
        <div class="hz-type" id="services">
          <p class="ty2-kick">What we make</p>
          <h2 class="ty2-stack"><span style="--k:0">Posts</span><span style="--k:1">Reels</span><span style="--k:2">Campaigns</span><span style="--k:3">Identity</span><span style="--k:4">Websites</span></h2>
          <p class="ty2-foot"><span>&#9679; Directed with taste. Built to ship.</span><a class="mono-link" href="#prices">View prices <span>&rarr;</span></a></p>
        </div>
      </div>
    </div>
  </div>
</section>

'''
s=s[:_sa]+V2+s[_sb:]
# the method panel follows a light section now
s=s.replace('<section class="sec dark method wipe" id="method" style="--prev:var(--ivory)">','<section class="sec dark method wipe" id="method" style="--prev:var(--ivory)">',1)
s=s.replace('</body>', '<script>\n'+open(SP+'v3_cases2.js').read()+'</script>\n</body>', 1)
_j=s.rfind('</style>'); s=s[:_j]+open(SP+'v3_css8.css').read()+s[_j:]
