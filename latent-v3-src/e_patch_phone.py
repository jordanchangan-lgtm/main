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
css='''
/* e_patch_phone */
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
