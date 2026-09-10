# ---- copy: every panel tells one thing, no category list repeated anywhere ----
rep('<title>Latent Studio — campaign imagery and product film, Amman</title>','<title>Latent Studio — AI-native brand visuals, Amman</title>')
rep('<meta name="description" content="Latent Studio makes campaign imagery and product film for cosmetics, coffee, clothing, jewellery and perfume brands — you name it, we make it. Prices for 2026 inside.">',
    '<meta name="description" content="Latent Studio, Amman. Posts, carousels, reels, campaigns, brand identities, websites and portfolios — made with AI, directed like film. Prices for 2026 inside.">')
rep('<meta property="og:description" content="Campaign imagery and product film. No camera. No studio. Only direction.">',
    '<meta property="og:description" content="Brand visuals made with AI, directed like film. Not your average AI post.">')
# hero
rep('<p class="hs hs-foot js-pu2" style="--d:.55s">Campaign imagery and product film for all brands &mdash;<br>you name it, we make it.</p>',
    '<p class="hs hs-foot js-pu2" style="--d:.55s">Brand visuals made with AI,<br class="ph-br"> directed like film.<br>Not your average AI post.</p>')
rep('var WORDS = ["visual identity","reels","posts","campaigns","websites","branding"];',
    'var WORDS = ["posts","carousels","reels","campaigns","identities","websites","portfolios"];')
# studio: the statement says who we are, the stack says what we make, the tenets say how
rep('<span>Latent Studio makes campaign imagery and product film for cosmetics, coffee, clothing, jewellery and perfume brands — you name it, we make it.</span>',
    '<span>Latent is an AI-native design studio in Amman. We make the visual side of a brand &mdash; the posts and carousels, the reels and campaigns, the identity, the website, the portfolio &mdash; with generative tools in the hands of art directors. Every piece follows the rule of Latent: minimal, simple, and current enough that nobody scrolls past it.</span>')
rep('<p class="sr">Campaign stills, product film, carousels, brand identity, editorial web.</p>','<p class="sr">What leaves the studio</p>')
_w=['Posts &amp; carousels','Reels','Campaigns','Brand identity','Websites','Portfolios']
_lt='<ul class="lt js-lt" aria-hidden="true">\n'+''.join('          <li style="--i:%d"><p>%s</p><p>%s</p></li>\n'%(i,a,b) for i,(a,b) in enumerate(zip(['&nbsp;']+_w,_w+['&nbsp;'])))+'        </ul>'
rep(ltm,_lt)
# method: how the work moves
rep('No set build, no crew, no travel, no reshoot day. That is why the numbers further down look the way they do — and why a brand with one product and no budget for a shoot can still run a campaign that holds up next to one.',
    'No set build, no crew, no travel, no reshoot day. A brief becomes a direction, the direction becomes frames, the frames become final files &mdash; in days. It is why a brand with one product and no budget for a shoot can still launch with a campaign that holds up next to one.')
rep('<p class="c-br sp-blk rv" style="--k:3"><a href="#sectors">[ Where it lands &darr; ]</a></p>','<p class="c-br sp-blk rv" style="--k:3"><a href="#sectors">[ Why it does not look like AI &darr; ]</a></p>')
# the old sectors panel becomes the craft panel: why it does not look like AI
rep('''      <p class="eyebrow rv"><b>( Sectors )</b> Where the work lands</p>
      <h2 class="stk js-stk sec-stk" data-every="2400">
        <span class="stk-l" data-i="01" style="--k:0">You name it,</span>
        <span class="stk-l" data-i="02" style="--k:1">we make it.</span>
      </h2>
      <p class="lede sec-lede js-split" style="--step:.03s"><span class="js-seg">Cosmetics, coffee, clothing, jewellery, perfume &mdash; categories where the product is small, the surface is everything, and a conventional shoot costs more than the launch it supports. Skin, glass, resin, fabric and metal are the hardest things to fake, so they get the most direction.</span></p>
      <p class="sp-blk rv" style="--k:3">Skin &middot; glass &middot; resin &middot; fabric &middot; metal</p>''',
'''      <p class="eyebrow rv"><b>( The craft )</b> Direction first</p>
      <h2 class="stk js-stk sec-stk" data-every="2400">
        <span class="stk-l" data-i="01" style="--k:0">AI is the tool.</span>
        <span class="stk-l" data-i="02" style="--k:1">Taste is the craft.</span>
      </h2>
      <p class="lede sec-lede js-split" style="--step:.03s"><span class="js-seg">Anyone can type a prompt, and it shows. We treat a generation like a shoot: real skin and real light, a camera that breathes, one flat field in the brand&rsquo;s own colour, and one detail that is deliberately unexpected. Every frame is directed before it is generated, and only the frames that pass leave the studio.</span></p>
      <p class="sp-blk rv" style="--k:3">Restraint &middot; story before product &middot; craft in every frame</p>''')
# the last stylesheet word: appended at the very end of the page styles so nothing below it can override
_j=s.rfind('</style>'); s=s[:_j]+open(SP+'v3_css5.css').read()+(open(SP+'v3_css6.css').read() if os.environ.get('TEXTB') else '')+s[_j:]
