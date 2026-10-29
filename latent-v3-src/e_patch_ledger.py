# Our work as a ledger (a vanilla port of the "Pigment Experience Ledger" React component): every project is a huge
# right-aligned wordmark with its years in italics on the left; a row opens in place to show what we did, the place,
# the industry, the site link and a short story. Pointing at a row blooms a wash of pigment (painted on a small
# canvas, no images) that drifts after the pointer; the open row keeps its wash; closed rows keep a dried residue
# whose length and dryness come from the years. Replaces the rows and the gallery inside #ourwork. Idempotent.
import sys
P='/home/user/main/latent-v3e/index.html'; s=open(P,encoding='utf-8').read()
if 'js-pel' in s: print('already patched'); sys.exit(0)
ITEMS=[
 ('Latent Studio','2025-now','Identity · brand film · website','Amman, Jordan','AI-native creative studio',('latent-studio-ai.com','https://latent-studio-ai.com'),
  ['Our own house: the mark, the film, the site you are on. Everything the studio says about itself was directed, generated and built here.','Brand visuals and film for clients who want work that looks decided, not generated.']),
 ('AS Abaya','2026','Campaign · Abayat Al-Dawam','Riyadh, Saudi Arabia','Fashion · modest wear',None,
  ['A campaign for the everyday abaya: six frames, one woman, one light, the cloth doing the talking.','Shot as a film is shot: a story first, the product second, every frame carrying a trace.']),
 ('Sudqi Planet','2026','Store website · brand identity','Amman, Jordan','Retail · online store',('sudqiplanet.com','https://sudqiplanet.com'),
  ['A brand book and a store: Lunar Pearl identity, a bilingual landing page and a shop that is ready to sell.','One studio photoshoot for every product, so the whole catalogue reads as one set.']),
 ('Buraq Al Omur','2026','Website','United Arab Emirates','Import · logistics',('buraqalomur.com','https://buraqalomur.com'),
  ['Import. Clear. Deliver. A site that says what the company does in three words and then proves it.']),
 ('Rawabina Al Khadraa','2026','Editorial website','Saudi Arabia','Landscaping · green spaces',('rawabinaalkhadhraa.com','https://rawabinaalkhadhraa.com'),
  ['A touch of green across the Kingdom: an editorial site built around the gardens themselves, with the numbers that matter beside them.']),
 ('Atelier Rebul','2026','Cinematic reels · posts','Jordan','Perfume · cosmetics',None,
  ['Reels and posts directed like short films: one material moment per piece, the bottle locked, the light doing the work.']),
 ('Cube Coffee House','2026','Identity + campaign','Amman, Jordan','Coffee',None,
  ['An identity cut from the cube itself, then a campaign that pours, stacks and spills it across the city.']),
]
def esc(t): return t.replace('&','&amp;').replace('<','&lt;')
rows=''
for i,(name,years,role,loc,ind,link,summ) in enumerate(ITEMS):
    meta='<dt class="pel-label">What we did</dt><dd>%s</dd><dt class="pel-label">Location</dt><dd>%s</dd><dt class="pel-label">Industry</dt><dd>%s</dd>'%(esc(role),esc(loc),esc(ind))
    if link: meta+='<dt class="pel-label">Site</dt><dd><a href="%s" target="_blank" rel="noopener">%s &#8599;</a></dd>'%(link[1],esc(link[0]))
    copy=''.join('<p>%s</p>'%esc(p) for p in summ)
    rows+='''        <li class="pel-row rv js-pel-row" data-open="%s" data-lit="false" data-years="%s" style="--k:%d">
          <canvas class="pel-ink js-pel-ink" aria-hidden="true"></canvas>
          <h3 class="pel-h"><button type="button" class="pel-trigger js-pel-trigger" id="pel-b%d" aria-expanded="%s" aria-controls="pel-p%d"><span class="pel-when"><span>(%s)</span><span class="pel-x" aria-hidden="true"></span></span><span class="pel-namecell"><span class="pel-name js-pel-name">%s</span><span class="pel-role">%s</span></span></button></h3>
          <div id="pel-p%d" class="pel-panel" role="region" aria-labelledby="pel-b%d" aria-hidden="%s"><div class="pel-clip"><div class="pel-body"><dl class="pel-meta">%s</dl><div class="pel-copy">%s</div></div></div></div>
        </li>
'''%('true' if i==0 else 'false',years,i,i,'true' if i==0 else 'false',i,years,esc(name),esc(role),i,i,'false' if i==0 else 'true',meta,copy)
LIST='''    <div class="pel-root js-pel">
      <ol class="pel-list">
%s      </ol>
      <p class="pel-note rv" style="--k:%d">Point at a name. Open a row for the story and the link.</p>
    </div>
'''%(rows,len(ITEMS)+1)
i=s.index('<section class="sec light cf js-cf js-path ow-sec" id="ourwork">'); j=s.index('</section>',i)
sec=s[i:j]; a=sec.index('    <div class="ow">'); b=sec.rindex('    </div>\n  </div>\n')+len('    </div>\n')
sec=sec[:a]+LIST+sec[b:]
sec=sec.replace('Things we made for ourselves and for clients. Open a site, or reveal a campaign.','Things we made for ourselves and for clients, newest first. Open a row for the story and the link.')
s=s[:i]+sec+s[j:]
CSS='''
/* our work: the ledger */
.pel-root{position:relative;width:100%;overflow-x:clip;container-type:inline-size;color:var(--ink);isolation:isolate;margin-top:clamp(18px,3vh,34px);--pel-ease:cubic-bezier(.23,1,.32,1);--pel-pad:clamp(.5rem,1.1cqi,.9rem);--pel-muted:var(--stone);--pel-line:rgba(20,20,26,.14)}
.pel-root *,.pel-root *::before,.pel-root *::after{box-sizing:border-box}
.pel-list{list-style:none;margin:0;padding:0;border-top:1px solid var(--pel-line)}
.pel-row{position:relative;border-bottom:1px solid var(--pel-line)}
.pel-ink{position:absolute;left:-40px;top:-64px;width:calc(100% + 80px);height:calc(100% + 128px);max-width:none;display:block;z-index:0;pointer-events:none}
.pel-h{margin:0;font:inherit;position:relative;z-index:1}
.pel-trigger{-webkit-appearance:none;appearance:none;background:none;border:0;border-radius:2px;margin:0;padding:clamp(1.1rem,2.3cqi,1.85rem) var(--pel-pad);width:100%;color:inherit;font:inherit;text-align:inherit;cursor:pointer;display:grid;grid-template-columns:minmax(8.5rem,15rem) minmax(0,1fr);align-items:center;column-gap:1.5rem;-webkit-tap-highlight-color:transparent}
.pel-trigger:focus-visible{outline:2px solid var(--ink);outline-offset:-2px;border-radius:4px}
.pel-when{display:flex;align-items:center;gap:.85rem;font-family:"Newsreader",Georgia,serif;font-style:italic;font-size:clamp(1rem,1.4cqi,1.25rem);letter-spacing:-.01em;color:var(--pel-muted);font-variant-numeric:tabular-nums;transition:color .2s ease,transform .3s var(--pel-ease)}
.pel-x{position:relative;display:block;width:.78rem;height:.78rem;flex:none;font-style:normal;transition:transform .34s var(--pel-ease)}
.pel-x::before,.pel-x::after{content:'';position:absolute;left:0;top:50%;width:100%;height:1.5px;margin-top:-.75px;background:currentColor;border-radius:1px}
.pel-x::after{transform:rotate(90deg)}
.pel-row[data-open='true'] .pel-x{transform:rotate(45deg)}
.pel-namecell{display:flex;flex-direction:column;align-items:flex-end;min-width:0;text-align:right}
.pel-name{display:inline-block;white-space:nowrap;font-family:"Archivo","Helvetica Neue",Arial,sans-serif;font-size:clamp(2.25rem,7.4cqi,6.4rem);font-weight:600;letter-spacing:-.045em;line-height:.9;text-transform:uppercase;padding:0 .02em .04em 0;transform-origin:100% 60%;transition:transform .32s var(--pel-ease)}
.pel-role{display:inline-flex;align-items:center;gap:.55rem;margin-top:.6rem;font-family:"IBM Plex Mono",monospace;font-size:11px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--pel-muted);transition:color .3s ease}
.pel-trigger:active .pel-name{transform:translateX(-.06em) scale(.985);transition-duration:.12s}
@media (hover:hover) and (pointer:fine){.pel-trigger:hover .pel-name{transform:translateX(-.06em)}.pel-trigger:hover .pel-when{transform:translateX(.4rem);color:var(--ink)}.pel-row[data-open='false'] .pel-trigger:hover .pel-x{transform:rotate(90deg)}}
.pel-row[data-lit='true'] .pel-when,.pel-row[data-lit='true'] .pel-role,.pel-row[data-lit='true'] .pel-label{color:var(--ink)}
.pel-panel{display:grid;grid-template-rows:0fr;position:relative;z-index:1;transition:grid-template-rows .2s var(--pel-ease)}
.pel-row[data-open='true'] .pel-panel{grid-template-rows:1fr;transition-duration:.32s}
.pel-clip{overflow:hidden;min-height:0}
.pel-body{display:grid;grid-template-columns:minmax(8.5rem,15rem) minmax(0,.85fr) minmax(0,1.3fr);column-gap:1.5rem;row-gap:1.25rem;padding:.15rem var(--pel-pad) clamp(1.6rem,3.2cqi,2.6rem);opacity:0;transform:translateY(-6px);transition:opacity .14s ease,transform .22s var(--pel-ease)}
.pel-row[data-open='true'] .pel-body{opacity:1;transform:none;transition:opacity .28s ease .06s,transform .32s var(--pel-ease) .03s}
.pel-meta{grid-column:2;margin:0;display:grid;grid-template-columns:auto minmax(0,1fr);column-gap:1.75rem;row-gap:.6rem;align-content:start;font-family:"IBM Plex Mono",monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;line-height:1.5}
.pel-label{color:var(--pel-muted);transition:color .3s ease}
.pel-meta dd{margin:0;font-weight:500;min-width:0;overflow-wrap:anywhere;color:var(--ink)}
.pel-meta a{color:inherit;text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:3px;border-radius:2px}
.pel-meta a:hover{text-decoration-thickness:2px;color:var(--marrow)}
.pel-copy{grid-column:3;font-family:"Newsreader",Georgia,serif;font-size:clamp(16px,1.3vw,20px);line-height:1.5;max-width:56ch;color:var(--ink)}
.pel-copy p{margin:0 0 .8em}
.pel-copy p:last-of-type{margin-bottom:0}
.pel-note{margin:1.2rem 0 0;font-family:"IBM Plex Mono",monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--pel-muted)}
@container (max-width:640px){.pel-trigger{grid-template-columns:minmax(0,1fr);row-gap:.7rem}.pel-when{justify-content:space-between}.pel-namecell{align-items:flex-start;text-align:left}.pel-name{font-size:clamp(2rem,12.5cqi,3.4rem)}.pel-body{grid-template-columns:minmax(0,1fr)}.pel-meta,.pel-copy{grid-column:1}}
@media (prefers-reduced-motion:reduce){.pel-root *{transition-duration:.01ms !important;transition-delay:0s !important}}
'''
j=s.rfind('</style>'); s=s[:j]+CSS+s[j:]
JS=open('/home/user/main/latent-v3-src/pel.js',encoding='utf-8').read()
k=s.rfind('</script>'); s=s[:k]+'\n'+JS+'\n'+s[k:]
open(P,'w',encoding='utf-8').write(s); print('ledger patched', len(s)//1024,'KB')
