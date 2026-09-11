# ---- the hero text as one wordmark (HEROTXT=mark): the studio's name huge across the width over the film, a mono
#      line under it, the ask as a pill bottom right; every word rises through its line mask. ----
_hs=s.index('<div class="stage">', s.index('<section class="hero')); _he=s.index('</div>', _hs)+len('</div>')
_mark='''<div class="stage hb">
    <h1 class="hb-mark js-pu2" style="--d:.1s"><span class="hb-w">Latent</span> <span class="hb-w">Studio</span></h1>
    <p class="hb-meta js-pu2" style="--d:.55s"><span>AI-native brand visuals</span><span>Directed like film</span><span>Est. 2026 &middot; Amman</span></p>
    <p class="hs hs-role js-pu2 hb-role" style="--d:.7s">Your brand deserves better <span class="cyc" id="cyc"></span></p>
    <a class="hb-cta js-pu2" href="#prices" style="--d:.85s"><small>Have something in mind?</small><b>Let&rsquo;s generate <span>&#8599;</span></b></a>
    <span id="clock" hidden>&mdash;</span>
  </div>'''
s=s[:_hs]+_mark+s[_he:]
