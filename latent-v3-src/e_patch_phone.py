# Phone pass on the built E page: the nav fits the width at 11px, the footer credit becomes a static last line
# instead of a fixed bar over the content, the "What we skip" stage flows as a column over a darker scrim.
# Run after e_patch_td.py, before the hero swap and extraction. Idempotent.
P='/home/user/main/latent-v3e/index.html'; s=open(P,encoding='utf-8').read()
if 'e_patch_phone' in s: print('phone already'); raise SystemExit
# the footer credit moves to the end of the body so it can be the last line on a phone
import re
m=re.search(r'<div class="foot js-foot"[^>]*>.*?</div>\n?', s, re.S); foot=m.group(0); s=s[:m.start()]+s[m.end():]
k=s.rfind('<script'); s=s[:k]+foot+s[k:]
# with reduced motion on, the bar used to read the page geometry before it was measured; it now waits a frame
old='if(reduce){ barTick(); window.addEventListener("scroll", barTick, { passive:true }); }'
new='if(reduce){ window.addEventListener("scroll", barTick, { passive:true }); requestAnimationFrame(barTick); }'
assert old in s, 'barTick reduce line'; s=s.replace(old,new,1)
# every work image says what it is
ALTS=['Step 01, Brief: the product, the palette and the mood arrive at Latent Studio','Step 02, Direct: light, lens, angle and story decided before a frame exists','Step 03, Generate: hundreds of frames made from the written direction','Step 04, Select: only the frames that look shot survive','Step 05, Craft: retouch, grade and type by hand','Step 06, Deliver: final files in every format, in days']
n=[0]
def alt(m):
    a=ALTS[n[0]] if n[0]<len(ALTS) else 'Latent Studio work'; n[0]+=1; return m.group(1)+a+m.group(2)
s=re.sub(r'(<(?:figure|span) class="wp-img js-sk-img"[^>]*><img[^>]*alt=")(")', alt, s)
# the What we make thumbnail names its picture when it swaps
old='pv.querySelector("img").src = ti.getAttribute("src");'
new='pv.querySelector("img").src = ti.getAttribute("src"); pv.querySelector("img").alt = (items[i].querySelector(".td-name") || items[i]).textContent.trim() + (document.documentElement.lang === "ar" ? " — من أعمال لاتنت ستوديو" : " — work by Latent Studio");'
assert old in s, 'td-pv src line'; s=s.replace(old,new,1)
# the thumbnail is born with the first item's name, not an empty alt
old2='''pvEl.innerHTML = '<img alt="" decoding="async">';'''
new2='''pvEl.innerHTML = '<img alt="' + ((items[0] && (items[0].querySelector(".td-name") || items[0]).textContent.trim()) || "Latent Studio work") + (document.documentElement.lang === "ar" ? " — من أعمال لاتنت ستوديو" : " — work by Latent Studio") + '" decoding="async">';'''
assert old2 in s, 'td-pv create line'; s=s.replace(old2,new2,1)
css='''
/* e_patch_phone */
.fy-card .play{font-size:11px}
@media(max-width:820px){
.bar .brand{font-size:11px;letter-spacing:.1em;gap:7px}
.bar nav{gap:9px;font-size:11px;letter-spacing:.04em}
.bar nav a[href="#work"]{display:none}
.foot{position:static;opacity:1!important;transform:none!important;justify-content:space-between;flex-wrap:wrap;gap:4px 16px;padding:18px var(--gut) 22px;background:var(--ink);color:rgba(242,239,231,.62);font-size:11px}
.foot span:last-child{display:inline}
.method .stage{display:flex;flex-direction:column;align-items:flex-start;gap:18px;padding:76px 0 52px;min-height:0;height:auto}
.method .c-tr{display:none}
.method .c-mid{margin:6px 0 2px;width:100%}
.method .c-bl{max-width:none}
.method .c-br{text-align:start}
.method-scrim{background:linear-gradient(180deg,rgba(20,20,26,.8),rgba(20,20,26,.64) 50%,rgba(20,20,26,.82))}
.td-pv{width:100%;max-width:100%;height:auto;max-height:140px;aspect-ratio:var(--ar,4/5)}
.sk-steps{margin-right:0;margin-inline-end:calc(-1 * var(--gut) + 6px)}
/* what we make on a phone: one column with air; the line, the picture, then the list */
.td-grid{grid-template-columns:minmax(0,1fr)!important;grid-template-rows:auto auto;gap:20px!important;align-content:center;align-items:start;padding:76px var(--gut) 36px!important}
.td-quote{order:1!important;justify-self:stretch!important;max-width:none!important;grid-template-rows:auto auto;row-gap:14px}
.td-q{font-size:14px;line-height:1.5;max-width:34ch}
.td-pv{margin-top:0;height:120px;max-height:none;width:auto;max-width:100%}
.td-list{order:2!important;justify-self:stretch!important;align-items:flex-start}
.td-items{align-items:flex-start;gap:3px}
.td-item{width:max-content;max-width:100%}
.td-name{font-size:clamp(17px,5vw,20px);line-height:1.25;white-space:normal}
}
@media(max-width:820px) and (max-height:620px){
.td-grid{align-content:start;padding-top:112px!important}
.td-pv{height:100px}
.td-pv img{object-fit:contain;object-position:top}
}
'''
j=s.rfind('</style>'); s=s[:j]+css+s[j:]
open(P,'w',encoding='utf-8').write(s); print('phone ok')
