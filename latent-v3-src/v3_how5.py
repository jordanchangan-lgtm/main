# ---- How it works, version five (HOW=5): the white path, built like the black one. Nothing pinned. Pictures come one
#      by one: from the right with the sentence on the left, then from the left with the sentence on the right. Each
#      opens widthwise as it scrolls in; the sentence brightens word by word beside it. Every picture carries a layer
#      of annotations: small squares, leader lines with arrows, mono notes. ----
# annotations per step: squares (x,y,w,h), lines (x1,y1,x2,y2, arrow), labels (x,y,text, anchor) — in 160x100 units
ANN=[
 dict(sq=[(112,36,30,30)], ln=[(112,51,72,74,1)], lb=[(4,5,'( brief ) product · palette · mood','l'),(40,78,'the one thing out of place','r'),(156,94,'60 · 30 · 10','r')]),
 dict(sq=[(58,48,44,34)], ln=[(80,48,80,18,1),(102,65,134,65,0)], lb=[(4,5,'( direct ) light · lens · angle','l'),(80,12,'light: top, soft','c'),(136,63,'eye level · 35 mm','l'),(156,94,'30 · 60 · 10','r')]),
 dict(sq=[(88,50,22,26)], ln=[(88,63,52,63,0),(110,50,126,30,1)], lb=[(4,5,'( generate ) frame 214 / 600','l'),(50,61,'no plastic skin','r'),(128,26,'grain 8%','l'),(156,94,'seed 0417','r')]),
 dict(sq=[(60,6,34,64)], ln=[(94,38,122,38,1),(60,70,30,86,0)], lb=[(4,5,'( select ) kept 1 / 48','l'),(124,36,'one hard shadow','l'),(28,88,'looks shot','r'),(156,94,'10 · 30 · 60','r')]),
 dict(sq=[(60,18,42,50)], ln=[(102,43,130,26,1),(81,68,81,88,0)], lb=[(4,5,'( craft ) grade · grain · type','l'),(132,22,'warm +6','l'),(81,91,'balance point','c'),(156,94,'60 · 30 · 10','r')]),
 dict(sq=[(70,22,26,52)], ln=[(96,48,128,48,1),(83,74,83,90,0)], lb=[(4,5,'( deliver ) 4:5 · 9:16 · 16:9','l'),(130,46,'shadow kept','l'),(83,93,'final files','c'),(156,94,'days, not weeks','r')]),
]
def _ann(a):
    out='<span class="an" aria-hidden="true"><svg class="an-svg" viewBox="0 0 160 100" preserveAspectRatio="none">'
    for (x,y,w,h) in a['sq']: out+='<rect class="an-sq" x="%s" y="%s" width="%s" height="%s"/>'%(x,y,w,h)
    for (x1,y1,x2,y2,ar) in a['ln']:
        out+='<line class="an-ln" x1="%s" y1="%s" x2="%s" y2="%s"/>'%(x1,y1,x2,y2)
        if ar:
            import math
            ang=math.atan2(y2-y1,x2-x1); L=3.2
            for d in (0.5,-0.5): out+='<line class="an-ln an-ar" x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f"/>'%(x2,y2,x2-L*math.cos(ang+d),y2-L*math.sin(ang+d))
    out+='</svg>'
    for (x,y,t,anc) in a['lb']:
        # on phones a label anchored to the left near the right edge would run past the picture: tuck it under its line, right-aligned
        if anc=='l' and x>96: out+='<i class="an-lb an-%s an-mr" style="--x:%.1f%%;--y:%.1f%%;--xm:97%%;--ym:%.1f%%">%s</i>'%(anc,x/1.6,y,y+9,t)
        else: out+='<i class="an-lb an-%s" style="--x:%.1f%%;--y:%.1f%%">%s</i>'%(anc,x/1.6,y,t)
    return out+'</span>'
_steps5=''
for k,(img,r,num,word,txt) in enumerate(STEPS):
    side='right' if k%2==0 else 'left'
    _steps5+='''    <div class="wp-step %s">
      <figure class="wp-img js-wp-img"><img src="%s" alt="" loading="lazy" decoding="async">%s</figure>
      <p class="wp-txt js-wp-txt">%s. %s</p>
    </div>
'''%(side,img,_ann(ANN[k]),word,txt)
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
