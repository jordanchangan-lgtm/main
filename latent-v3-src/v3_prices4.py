# ---- prices, version four (PRICES=4): no list. A small brief and the market note, then the bold line and the
#      link that opens the email. Everything gathers in on the endless-scroll mechanism. ----
import urllib.parse as _up4
_pi4=s.index('<section class="sec light" id="prices">'); _pj4=s.index('</section>',_pi4)+len('</section>')
_mail4='mailto:latentstudio.jo@gmail.com?subject='+_up4.quote("I have an idea, let's generate")+'&body='+_up4.quote("Hello Latent Studio,\n\nI have an idea, let's generate.\n\nBrand / product:\nWhat we are launching:\nWhen:\n\nPlease send me the price list.\n\nThanks,\n")
_new4='''<section class="sec light pz js-path" id="prices">
  <div class="inner pz-in">
    <p class="pz-kick rv"><b>( Prices )</b> What about them?</p>
    <p class="pz-brief js-words">What about the prices? Ours sit comfortably inside the market, and every package costs less than the same pieces bought one by one. Tell us what you are launching and the list is in your inbox the same day.</p>
    <div class="pz-ask">
      <h2 class="pz-q js-words">Have something in mind?</h2>
      <a class="pz-go js-words" href="%s">Let&rsquo;s generate &rarr;</a>
    </div>
  </div>
</section>'''%_mail4
s=s[:_pi4]+_new4+s[_pj4:]
