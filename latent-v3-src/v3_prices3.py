# ---- prices, version three (PRICES=3): the editorial list. One row per package: the name huge, a one-line reason,
#      the price large on the right; the included items open under the row on hover. Growth carries the marrow. ----
import urllib.parse as _up3
PACKS3=[
 ('01','Starter',200,'A first month of showing up, done properly.',['4 carousel posts','3 reels · 15 s each','Showcase videos, one to two shots','1080p delivery'],False),
 ('02','Essential',275,'The steady feed: more posts, more reels.',['5 carousel posts','4 reels · 15 s each','Showcase videos, one to two shots','1080p delivery'],False),
 ('03','Growth',375,'Scripted film enters the picture.',['5 carousel posts','3 cinematic reels · 15 s each','Full scripted video, cinematics, edits + SFX','2–7 shots per reel','1080p delivery'],True),
 ('04','Signature',425,'The full campaign, longer and louder.',['6 carousel posts','3 cinematic reels · 20 s each','Full scripted video, cinematics, edits + SFX','2–7 shots per reel','1080p delivery'],False),
]
def _mail3(what):
    return 'mailto:latentstudio.jo@gmail.com?subject='+_up3.quote('Enquiry · '+what)+'&body='+_up3.quote('Hello Latent Studio,\n\nI would like to start with the '+what+'.\n\nBrand / product:\nWhat we are launching:\nWhen:\n\nThanks,\n')
_rows3=''.join('''      <a class="pq-row rv%s" style="--k:%d" href="%s">
        <span class="pq-n">%s</span>
        <span class="pq-main"><span class="pq-name">%s%s</span><span class="pq-desc">%s</span><span class="pq-feats">%s</span></span>
        <span class="pq-price">%d<i>JD</i></span>
        <span class="pq-go">Enquire &rarr;</span>
      </a>
'''%(' pop' if pop else '',k,_mail3(name+' package · %d JD'%price),n,name,'<em>Most chosen</em>' if pop else '',desc,''.join('<span>%s</span>'%f for f in feats),price) for k,(n,name,price,desc,feats,pop) in enumerate(PACKS3))
_pl='''<div class="pq" role="list" aria-label="Packages">
%s    </div>'''%_rows3
_xi=s.index('<div class="xg js-xg rv" role="list" aria-label="Packages"></div>')
s=s[:_xi]+_pl+s[_xi+len('<div class="xg js-xg rv" role="list" aria-label="Packages"></div>'):]
