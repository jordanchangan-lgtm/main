# ---- the panel after the hero, version two, after the second reference:
#      a dark statement that brightens word by word, a marquee, a blinds wipe into ivory,
#      key facts as cards, selected work in an offset grid, and a stacked type block ----
_sa=s.index('<section class="sec light" id="studio" style="padding:0">'); _sb=s.index('<!-- ================= METHOD')
W=lambda name: du('gen/'+name,'image/jpeg')
shoes,chair,fish,cup,umbrella,cactus=[W(n) for n in ('p1.jpg','p2.jpg','p3.jpg','l1.jpg','l2.jpg','l3.jpg')]
# how it works: six generated pictures at their natural ratio, then the beam film. Small type on every picture,
# the step under it.
STEPS=[
 (shoes,'1288/1600','01','Brief','You send the product, the palette and the mood. We answer with a written direction, not a mood board.'),
 (chair,'1288/1600','02','Direct','Light, lens, angle and story are decided before a single frame exists.'),
 (fish,'1288/1600','03','Generate','Hundreds of frames made from the direction, in our own models and styles.'),
 (cup,'1600/893','04','Select','Only the frames that look shot survive. Most do not.'),
 (umbrella,'1600/893','05','Craft','Retouch, grade and type by hand, so nothing reads as a prompt.'),
 (cactus,'1600/893','06','Deliver','Final files in every format you post, print or build with. Days, not weeks.'),
]
FILM=(du('hero_d.jpg','image/jpeg'),du('hero_d.mp4','video/mp4'),'16/9','07','Motion','The same direction, moving: films that loop without a cut.')
_micro=lambda num,word: '<span class="hw-m hw-tl">( %s ) %s</span><span class="hw-m hw-tr">Latent.</span><span class="hw-m hw-bl">Amman &middot; 2026</span><span class="hw-m hw-br">AI-native</span>'%(num,word)
_work=''
for k,(img,r,num,word,txt) in enumerate(STEPS):
    _work+='        <div class="hw js-hw" style="--k:%d;--r:%s"><span class="hw-img"><img src="%s" alt="" loading="lazy" decoding="async">%s</span><span class="hw-cap"><b>%s</b><em>%s</em><p>%s</p></span></div>\n'%(k,r,img,_micro(num,word),num,word,txt)
_work+='        <div class="hw hw-film js-hw" style="--k:%d;--r:%s"><span class="hw-img"><video class="js-hw-v" muted loop playsinline preload="none" poster="%s" src="%s"></video>%s</span><span class="hw-cap"><b>%s</b><em>%s</em><p>%s</p></span></div>\n'%(len(STEPS),FILM[2],FILM[0],FILM[1],_micro(FILM[3],FILM[4]),FILM[3],FILM[4],FILM[5])
V2='''<section class="sec dark st2 js-st2" id="studio">
  <div class="st2-bg js-st2-bg" aria-hidden="true"><i class="d1"></i><i class="d2"></i></div>
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
<section class="sec light hz js-hz" id="how">
  <div class="hz-hold js-hz-hold">
    <div class="hz-stage">
      <div class="hz-track js-hz-track">
        <div class="hz-head"><p class="hw-kick rv">( How it works )</p><h2 class="sw2-title rv" style="--k:1">How it works</h2><p class="hw-sub rv" style="--k:2">From a brief to final files, the same way every time. Seven steps, no set, no crew.</p><a class="mono-link rv" style="--k:3" href="#work">See the work <span>&rarr;</span></a></div>
''' + _work + '''      </div>
    </div>
  </div>
</section>

'''
s=s[:_sa]+V2+s[_sb:]
# the method panel follows a light section now
s=s.replace('<section class="sec dark method wipe" id="method" style="--prev:var(--ivory)">','<section class="sec dark method wipe" id="method" style="--prev:var(--ivory)">',1)
s=s.replace('</body>', '<script>\n'+open(SP+'v3_cases2.js').read()+'</script>\n</body>', 1)
_j=s.rfind('</style>'); s=s[:_j]+open(SP+'v3_css8.css').read()+s[_j:]
