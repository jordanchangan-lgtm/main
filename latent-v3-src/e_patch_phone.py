# Phone pass on the built E page: the nav fits the width at 11px, the footer credit becomes a static last line
# instead of a fixed bar over the content, the "What we skip" stage flows as a column over a darker scrim.
# Run after e_patch_td.py, before the hero swap and extraction. Idempotent.
P='/home/user/main/latent-v3e/index.html'; s=open(P,encoding='utf-8').read()
if 'e_patch_phone' in s: print('phone already'); raise SystemExit
# the footer credit moves to the end of the body so it can be the last line on a phone
import re
m=re.search(r'<div class="foot js-foot"[^>]*>.*?</div>\n?', s, re.S); foot=m.group(0); s=s[:m.start()]+s[m.end():]
k=s.rfind('<script'); s=s[:k]+foot+s[k:]
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
.td-pv img{object-fit:contain;object-position:top}
}
'''
j=s.rfind('</style>'); s=s[:j]+css+s[j:]
open(P,'w',encoding='utf-8').write(s); print('phone ok')
