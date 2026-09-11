# ---- prices, version six (PRICES=6): the brief first; then "Have something in mind? / Let's generate." rising
#      through line masks like the type block; then a composer panel in the manner of a chat box, with one
#      "Let's generate" button that opens the email (carrying whatever was typed). ----
import urllib.parse as _up6
_pi6=s.index('<section class="sec light" id="prices">'); _pj6=s.index('</section>',_pi6)+len('</section>')
_mail6='mailto:latentstudio.jo@gmail.com?subject='+_up6.quote("I have an idea, let's generate")+'&body='+_up6.quote("Hello Latent Studio,\n\nI have an idea, let's generate.\n\n")
_new6='''<section class="sec light cb js-cb" id="prices">
  <div class="inner cb-in">
    <p class="pz-kick rv"><b>( Prices )</b> What about them?</p>
    <p class="pz-brief js-words">What about the prices? Ours sit comfortably inside the market, and every package costs less than the same pieces bought one by one. Tell us what you are launching and the list is in your inbox the same day.</p>
  </div>
  <div class="inner cb-ask">
    <h2 class="ty2-stack cb-stack"><span class="rv" style="--k:0">Have something</span><span class="rv" style="--k:1">in mind?</span><span class="rv cb-go" style="--k:2">Let&rsquo;s generate.</span></h2>
    <form class="cb-box rv js-cb-box" action="%s" method="get" style="--k:3">
      <label class="sr" for="cb-idea">Describe what you are launching</label>
      <textarea id="cb-idea" class="cb-idea js-cb-idea" rows="3" placeholder="Describe what you are launching&hellip;"></textarea>
      <div class="cb-row">
        <div class="cb-chips"><span class="cb-chip">+</span><span class="cb-chip cb-chip-t">Latent &middot; directed</span></div>
        <button type="submit" class="cb-btn js-cb-btn">Let&rsquo;s generate <span class="cb-arrow" aria-hidden="true">&#8599;</span></button>
      </div>
    </form>
    <p class="cb-note rv" style="--k:4">Opens an email to the studio. The price list comes back the same day.</p>
  </div>
</section>'''%_mail6
s=s[:_pi6]+_new6+s[_pj6:]
