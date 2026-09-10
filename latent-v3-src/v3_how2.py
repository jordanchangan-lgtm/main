# ---- How it works as part of the dark path (HOW=2): the six pictures scattered left and right, arriving
#      and leaving as the portfolio pieces do, each step's words landing in a random place ----
_seed2=[23]
def _rnd2():
    _seed2[0]=(_seed2[0]*9301+49297)%233280; return _seed2[0]/233280
_chs=''
for k,(img,r,num,word,txt) in enumerate(STEPS):
    wide = r=='1600/893'; left = k%2==0
    if wide: x=(2+_rnd2()*5) if left else (52+_rnd2()*5); W='clamp(300px,34vw,620px)'
    else:    x=(4+_rnd2()*10) if left else (62+_rnd2()*10); W='clamp(180px,19vw,340px)'
    iy=4+_rnd2()*22; tx=(58+_rnd2()*12) if left else (6+_rnd2()*12); ty=28+_rnd2()*34
    _chs+='''    <div class="hw2-ch">
      <figure class="pf2-item hw2-item" style="--x:%.1f%%;--y:%.1f%%;--w:%s"><span class="pf2-img" style="--r:%s"><img src="%s" alt="" loading="lazy" decoding="async">%s</span></figure>
      <div class="hw2-txt" style="--tx:%.1f%%;--ty:%.1f%%"><p class="hw2-kick js-words">( %s ) Step %s of six</p><h3 class="hw2-word js-words">%s</h3><p class="hw2-line js-words">%s</p></div>
    </div>
'''%(x,iy,W,r,img,_micro(num,word),tx,ty,num,num,word,txt)
V2H='''<section class="sec dark pf2 hw2 js-pf2 js-path" id="how">
  <div class="st2-bg" aria-hidden="true"><i class="d1"></i><i class="d2"></i></div>
  <div class="inner pf2-in">
    <div class="hw2-head"><p class="pf2-head rv"><b>( How it works )</b> From a brief to final files</p><h2 class="hw2-title js-words">How it works</h2><p class="hw2-sub js-words">Six steps, the same way every time. No set, no crew, no reshoot day.</p></div>
%s    <div class="hw2-type">
      <p class="ty2-kick rv">What we make</p>
      <h2 class="ty2-stack"><span class="rv" style="--k:0">Posts</span><span class="rv" style="--k:1">Reels</span><span class="rv" style="--k:2">Campaigns</span><span class="rv" style="--k:3">Identity</span><span class="rv" style="--k:4">Websites</span></h2>
      <p class="ty2-foot rv"><span>&#9679; Directed with taste. Built to ship.</span><a class="mono-link" href="#prices">View prices <span>&rarr;</span></a></p>
    </div>
  </div>
</section>

'''%_chs
_hi=V2.index('<div class="blinds js-blinds"'); _hj=V2.index('<!-- ', _hi) if '<!-- ' in V2[_hi:] else len(V2)
V2=V2[:_hi]+V2H
