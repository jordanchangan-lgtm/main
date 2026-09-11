# ---- KB=1: the bracketed mono kickers become short bold lines, in the site's own face, gathering on the scroll
#      where the section is a run; the bracket labels go. ----
import re as _rk
s=s.replace('<p class="pz-kick rv"><b>( How it works )</b></p>\n','')
s=s.replace('<p class="pz-kick rv"><b>( The craft )</b> Direction first</p>\n','')
s=s.replace('<p class="pz-kick rv"><b>( Prices )</b> What about them?</p>\n','')
s=s.replace('<p class="gp-kick"><b>( Four moves )</b> Every job, the same order</p>','<h2 class="gp-kick kb js-words">Four moves. Every job, the same order.</h2>')
s=s.replace('<section class="sec dark gp js-gp" id="process">','<section class="sec dark gp js-gp js-path" id="process">')
s=s.replace('<p class="c-tl eyebrow rv"><b>( The method )</b></p>','<p class="c-tl eyebrow rv kb">What we skip.</p>')
s=s.replace('<p class="td-mono td-kick"><i>&#9679;</i> What we make</p>','<p class="td-mono td-kick kb">What we make.</p>')
s=_rk.sub(r'<p class="td-mono">\( What we do \) <b>(\d\d)</b> / (\d\d)</p>', r'<p class="td-mono kb-s">What we do <b>\1</b> / \2</p>', s)
