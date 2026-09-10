# ---- prices, version five (PRICES=5): the brief first, then the giant sentence after the "So, ready to animate?"
#      reference: a pinned white screen, the line so big it fills the height, scrolling right to left with the page,
#      every letter arriving with its own vertical offset and settling onto the baseline as it crosses the screen. ----
import urllib.parse as _up5
_pi5=s.index('<section class="sec light" id="prices">'); _pj5=s.index('</section>',_pi5)+len('</section>')
_mail5='mailto:latentstudio.jo@gmail.com?subject='+_up5.quote("I have an idea, let's generate")+'&body='+_up5.quote("Hello Latent Studio,\n\nI have an idea, let's generate.\n\nBrand / product:\nWhat we are launching:\nWhen:\n\nPlease send me the price list.\n\nThanks,\n")
_new5='''<section class="sec light gs js-gs js-path" id="prices">
  <div class="inner gs-in">
    <p class="pz-kick rv"><b>( Prices )</b> What about them?</p>
    <p class="pz-brief js-words">What about the prices? Ours sit comfortably inside the market, and every package costs less than the same pieces bought one by one. Tell us what you are launching and the list is in your inbox the same day.</p>
  </div>
  <div class="gs-hold js-gs-hold">
    <div class="gs-stage">
      <a class="gs-line js-gs-line" href="%s" aria-label="Have something in mind? Let's generate. Opens an email to the studio.">Have something in mind? Let&rsquo;s generate.</a>
    </div>
  </div>
</section>'''%_mail5
s=s[:_pi5]+_new5+s[_pj5:]
