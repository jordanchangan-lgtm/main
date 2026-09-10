# ---- How it works, version five (HOW=5): the white path, built like the black one. Nothing pinned. Each step is a
#      picture that opens widthwise from the left as it scrolls in, then its plain sentence a little further down that
#      brightens word by word as it climbs, exactly as the paragraph does on the black run. ----
_steps5=''
for k,(img,r,num,word,txt) in enumerate(STEPS):
    _steps5+='''    <div class="wp-step">
      <figure class="wp-img js-wp-img"><img src="%s" alt="" loading="lazy" decoding="async"></figure>
      <p class="wp-txt js-wp-txt">%s. %s</p>
    </div>
'''%(img,word,txt)
V2H='''<div class="blinds wh js-blinds" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
<section class="sec light wp js-wp" id="how">
  <div class="inner wp-in">
%s  </div>
  <div class="hw2-type">
    <p class="ty2-kick rv">What we make</p>
    <h2 class="ty2-stack"><span class="rv" style="--k:0">Posts</span><span class="rv" style="--k:1">Reels</span><span class="rv" style="--k:2">Campaigns</span><span class="rv" style="--k:3">Identity</span><span class="rv" style="--k:4">Websites</span></h2>
    <p class="ty2-foot rv"><span>&#9679; Directed with taste. Built to ship.</span><a class="mono-link" href="#prices">View prices <span>&rarr;</span></a></p>
  </div>
</section>
<div class="blinds rev wh js-blinds" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>

'''%_steps5
_hi=V2.index('<div class="blinds js-blinds"')
V2=V2[:_hi]+V2H
