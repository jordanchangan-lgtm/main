# ---- the hero as an editorial plate (HEROTXT=edit): a mono label row across the top, the headline top left, the
#      year over the subject, two columns of small copy split by thin vertical rules with tab labels, notes in the
#      corners; every word rises through its line mask, the rules draw down. ----
_hs=s.index('<div class="stage">', s.index('<section class="hero')); _he=s.index('</div>', _hs)+len('</div>')
_edit='''<div class="stage he">
    <p class="he-top js-pu2" style="--d:.1s"><span>Latent.</span><span>Brand visuals<br>&amp; film</span><span>AI-native<br>practice</span><span>Amman<br>/ Worldwide</span><span>Edition<br>No. 001</span></p>
    <h1 class="he-head js-pu2" style="--d:.25s">Not your<br>average AI.</h1>
    <p class="he-sub js-pu2" style="--d:.45s">Directed<br>like film.</p>
    <p class="he-year js-pu2" style="--d:.6s">&copy;20<br>26</p>
    <i class="he-rule he-rule1 js-he-rule" style="--d:.5s"></i><i class="he-rule he-rule2 js-he-rule" style="--d:.65s"></i>
    <p class="he-p he-p1 js-pu2" style="--d:.7s">Every frame leaves a trace. Light, lens, angle and story all carry meaning. What looks generated is usually a decision nobody made. Direction begins when someone makes it.</p>
    <p class="he-p he-p2 js-pu2" style="--d:.85s">We do not believe in prompts as briefs. Each product demands its own light, its own lens, its own way of sitting in the frame. The process is one of testing, reducing, shifting and rebuilding until the frame feels shot, not typed.</p>
    <span class="he-tab he-tab1 js-pu2" style="--d:.9s">Working method</span>
    <span class="he-tab he-tab2 js-pu2" style="--d:1s">Design principle</span>
    <span class="he-v he-v1 js-pu2" style="--d:.95s">A frame is a decision</span>
    <span class="he-v he-v2 js-pu2" style="--d:1.05s">Light has weight</span>
    <p class="he-bl js-pu2" style="--d:1.1s">No set. No crew. No reshoot day.</p>
    <a class="he-br js-pu2" href="#prices" style="--d:1.15s">Let&rsquo;s generate &#8599;</a>
    <span class="he-hide"><span class="cyc" id="cyc"></span><span id="clock">&mdash;</span></span>
  </div>'''
s=s[:_hs]+_edit+s[_he:]
