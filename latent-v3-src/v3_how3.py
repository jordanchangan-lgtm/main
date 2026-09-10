# ---- How it works after the 21st "text rotate" demo (HOW=3): a pinned screen, the six pictures scrolling past on
#      the left, the step on the right rotating to match: letters leave upward, the new ones rise in, a tiny stagger ----
import json as _j3, html as _h3
_items=''
for k,(img,r,num,word,txt) in enumerate(STEPS):
    _items+='          <figure class="tr-item" style="--r:%s;--i:%d"><span class="tr-img"><img src="%s" alt="" loading="lazy" decoding="async">%s</span></figure>\n'%(r,k,img,_micro(num,word))
_steps=_h3.escape(_j3.dumps([{'n':num,'w':word,'t':txt} for (_,_,num,word,txt) in STEPS]),quote=True)
V2H='''<div class="blinds wh js-blinds" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
<section class="sec light tr js-tr" id="how" data-steps="%s">
  <div class="tr-hold js-tr-hold" style="--n:%d">
    <div class="tr-stage">
      <div class="tr-left"><div class="tr-col js-tr-col">
%s      </div></div>
      <div class="tr-right js-tr-right">
        <p class="tr-head"><b>( How it works )</b> From a brief to final files</p>
        <p class="tr-kick js-tr-kick" aria-live="polite"></p>
        <h2 class="tr-word js-tr-word"></h2>
        <p class="tr-line js-tr-line"></p>
        <p class="tr-idx"><span class="js-tr-idx">01</span> / %02d &middot; <span class="js-tr-cue">Scroll</span></p>
      </div>
    </div>
  </div>
  <div class="hw2-type">
    <p class="ty2-kick rv">What we make</p>
    <h2 class="ty2-stack"><span class="rv" style="--k:0">Posts</span><span class="rv" style="--k:1">Reels</span><span class="rv" style="--k:2">Campaigns</span><span class="rv" style="--k:3">Identity</span><span class="rv" style="--k:4">Websites</span></h2>
    <p class="ty2-foot rv"><span>&#9679; Directed with taste. Built to ship.</span><a class="mono-link" href="#prices">View prices <span>&rarr;</span></a></p>
  </div>
</section>
<div class="blinds rev wh js-blinds" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>

'''%(_steps,len(STEPS),_items,len(STEPS))
_hi=V2.index('<div class="blinds js-blinds"')
V2=V2[:_hi]+V2H
