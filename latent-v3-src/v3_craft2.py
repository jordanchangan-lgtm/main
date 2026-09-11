# ---- the craft (SECTORS=2): white, in the flow after the things list as one run; the headline, the paragraph and
#      the closing line gather word by word as the page scrolls, the same mechanism as the white path. ----
_ci=s.index('<section class="sec light wipe" id="sectors"'); _cj=s.index('</section>',_ci)+len('</section>')
_new='''<section class="sec light cf js-cf js-path" id="sectors">
  <div class="inner cf-in">
    <p class="pz-kick rv"><b>( The craft )</b> Direction first</p>
    <h2 class="cf-h js-words">AI is the tool. Taste is the craft.</h2>
    <p class="cf-p js-words">Anyone can type a prompt, and it shows. We treat a generation like a shoot: real skin and real light, a camera that breathes, one flat field in the brand&rsquo;s own colour, and one detail that is deliberately unexpected. Every frame is directed before it is generated, and only the frames that pass leave the studio.</p>
    <p class="cf-foot js-words">Restraint &middot; story before product &middot; craft in every frame</p>
  </div>
</section>'''
s=s[:_ci]+_new+s[_cj:]
