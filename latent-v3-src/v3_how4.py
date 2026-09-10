# ---- How it works, version four (HOW=4): after the cut to white, a locked sequence. Each step: the picture opens
#      widthwise from the left, then its sentence appears word by word beside it; the page stays locked until the
#      sentence is complete; then the next picture. No numbers, no notes, no highlights. ----
_steps4=''
for k,(img,r,num,word,txt) in enumerate(STEPS):
    _steps4+='''      <div class="sq-step js-sq-step" style="--i:%d">
        <figure class="sq-img js-sq-img"><img src="%s" alt="" loading="lazy" decoding="async"></figure>
        <p class="sq-txt js-sq-txt">%s. %s</p>
      </div>
'''%(k,img,word,txt)
V2H='''<div class="blinds wh js-blinds" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
<section class="sec light sq js-sq" id="how">
  <div class="sq-hold js-sq-hold" style="--n:%d">
    <div class="sq-stage">
%s    </div>
  </div>
  <div class="hw2-type">
    <p class="ty2-kick rv">What we make</p>
    <h2 class="ty2-stack"><span class="rv" style="--k:0">Posts</span><span class="rv" style="--k:1">Reels</span><span class="rv" style="--k:2">Campaigns</span><span class="rv" style="--k:3">Identity</span><span class="rv" style="--k:4">Websites</span></h2>
    <p class="ty2-foot rv"><span>&#9679; Directed with taste. Built to ship.</span><a class="mono-link" href="#prices">View prices <span>&rarr;</span></a></p>
  </div>
</section>
<div class="blinds rev wh js-blinds" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>

'''%(len(STEPS),_steps4)
_hi=V2.index('<div class="blinds js-blinds"')
V2=V2[:_hi]+V2H
