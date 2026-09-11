# ---- How it works, the staircase (STAIR=1, on top of HOW=5): six pictures, each starting further right and lower
#      than the last and a little smaller, opening from the right as it rises; the six sentences pinned on the left as
#      one running list, each brightening as its picture crosses the middle. The annotations stay on the pictures. ----
_si=s.index('<section class="sec light wp js-wp" id="how">'); _sj=s.index('</section>',_si)+len('</section>')
_lis=''.join('      <p class="sk-li js-sk-li" data-k="%d"><b>%02d</b> <span class="js-sk-w">%s. %s</span></p>\n'%(k,k+1,word,txt) for k,(img,r,num,word,txt) in enumerate(STEPS))
_sts=''.join('      <div class="sk-step js-sk-step" data-k="%d" style="--k:%d"><figure class="wp-img js-sk-img"><img src="%s" alt="" loading="lazy" decoding="async">%s</figure></div>\n'%(k,k,img,_ann(ANN[k])) for k,(img,r,num,word,txt) in enumerate(STEPS))
_new6='''<section class="sec light cf js-cf js-path" id="how-intro">
  <div class="inner cf-in cf-short">
    <p class="pz-kick rv"><b>( How it works )</b></p>
    <h2 class="cf-h js-words">Six moves. One order. Every job.</h2>
  </div>
</section>
<section class="sec light sk js-sk" id="how">
  <div class="sk-wrap">
    <div class="sk-list">
%s    </div>
    <div class="sk-steps">
%s    </div>
  </div>
</section>'''%(_lis,_sts)
s=s[:_si]+_new6+s[_sj:]
