# The four moves become a case study of the Atelier Rebul film: the same gap lines sliding in on scroll, but each
# gap opens on a big frame from that work, the third on the film itself. Run after e_patch_prices.py, before
# extraction. Idempotent.
import re
P='/home/user/main/latent-v3e/index.html'; s=open(P,encoding='utf-8').read()
if 'gp-case' in s: print('case already'); raise SystemExit
AR=720/1290
LINES=[('media/14-e1887959c2.webp', None, 'Élixir 2 arrived as a bottle, a palette and a mood. We answered with a written direction, not a mood board.'),
       ('media/32-7ac7171781.webp', None, 'One light, one lens, one angle, and objects that carry the pattern of the bottle. Agreed before a frame existed.'),
       ('media/16-5f98d5f7c3.webp', 'media/12-70bfcc9117.mp4', 'Hundreds of frames generated from that direction. The ones that passed became the film.'),
       ('media/31-9b83c7175b.webp', None, 'A twenty-second film and the stills, in every size the feed asks for. Days, not weeks.')]
s=s.replace('<h2 class="gp-kick kb js-words">Four moves. Every job, the same order.</h2>',
            '<h2 class="gp-kick kb gp-case"><b>Case study</b> · Atelier Rebul · Élixir 2 · Istanbul · 2026</h2>',1)
assert 'gp-case' in s
def line(m):
    i=int(m.group(1)); body=m.group(2); pic,film,desc=LINES[i]
    if film:
        tile='<span class="gp-tile" data-ar="%.4f"><video class="gp-v js-gp-v" muted loop playsinline preload="none" poster="%s" data-src="%s" aria-hidden="true"></video></span>'%(AR,pic,film)
    else:
        tile='<span class="gp-tile" data-ar="%.4f"><img fetchpriority="low" src="%s" alt="" loading="lazy" decoding="async"></span>'%(AR,pic)
    body=re.sub(r'<span class="gp-tile">.*?</span>', lambda k: tile, body, count=1, flags=re.S)
    body=re.sub(r'<p class="gp-desc">.*?</p>', lambda k: '<p class="gp-desc">%s</p>'%desc, body, count=1, flags=re.S)
    return '<div class="gp-line js-gp-line" data-i="%d">%s</div>'%(i,body)
s,n=re.subn(r'<div class="gp-line js-gp-line" data-i="(\d)">(.*?)</div>\n(?=\s*(?:<div class="gp-line|</div>))', lambda m: line(m)+'\n', s, flags=re.S)
assert n==4, n
# the driver: a tile with a ratio opens to its real width at its height; the film starts when its line is near
old='var fs = parseFloat(getComputedStyle(o.row).fontSize), tileW = fs * 2.0 * open;'
new='var fs = parseFloat(getComputedStyle(o.row).fontSize), ar = parseFloat(o.t.getAttribute("data-ar")) || 0, tileW = (ar ? o.t.getBoundingClientRect().height * ar : fs * 2.0) * open;\n      if(o.v && !o.v.getAttribute("src") && r.top < vh * 1.6){ o.v.setAttribute("src", o.v.getAttribute("data-src")); o.v.load(); o.v.play().catch(function(){}); }'
assert old in s; s=s.replace(old,new,1)
old2='img: l.querySelector(".gp-tile img") }; });'
new2='img: l.querySelector(".gp-tile img"), v: l.querySelector(".gp-tile video") }; });'
assert old2 in s; s=s.replace(old2,new2,1)
css='''
/* e_patch_case: big frames in the gaps */
.gp-kick.gp-case{max-width:none}
.gp-tile[data-ar]{height:clamp(170px,38vh,420px);margin:0 .08em;border-radius:clamp(6px,.6vw,12px)}
.gp-tile[data-ar] img,.gp-tile video{position:absolute;top:0;left:50%;height:100%;width:auto;min-width:0;transform:translateX(-50%);object-fit:cover;display:block;background:#000}
.gp-row{align-items:center}
@media(max-width:820px){
.gp-tile[data-ar]{height:clamp(130px,24vh,170px);border-radius:6px}
.gp-row{font-size:clamp(20px,5.6vw,30px)}
}
@media (prefers-reduced-motion:reduce){.gp-tile[data-ar]{width:calc(clamp(170px,38vh,420px) * .558)!important}}
'''
j=s.rfind('</style>'); s=s[:j]+css+s[j:]
open(P,'w',encoding='utf-8').write(s); print('case ok')
