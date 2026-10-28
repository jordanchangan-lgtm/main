# Patches the built latent-v3e/index.html: adds "Our work." after the things list, a bold list of the studio's own
# projects, each a link that opens the project; name rows reveal on scroll, a picture floats beside the row under
# the pointer. Idempotent: skips if the section is already there.
import re, sys
P='/home/user/main/latent-v3e/index.html'; s=open(P,encoding='utf-8').read()
if 'id="ourwork"' in s: print('already patched'); sys.exit(0)
WORK=[('Latent Studio','Identity, brand film, website','https://latent-studio-ai.com','media/18-b1760e8edf.jpg','4/5'),
      ('Buraq Al Omur','Website','#','','16/10'),
      ('Sudqi Planet','Website','#','','16/10'),
      ('Rawabina Al Khadraa','Editorial website','#','media/19-de56f4747b.jpg','16/10')]
def words(t): return ' '.join('<span class="pgw"><span class="pgw-in" style="--w:%d">%s</span></span>'%(i,w) for i,w in enumerate(t.split()))
rows=''
for k,(n,kind,href,img,ar) in enumerate(WORK):
    ext=' target="_blank" rel="noopener"' if href.startswith('http') else ' data-soon="1"'
    pic='<span class="ow-pic" style="--ar:%s"><img src="%s" alt="" loading="lazy" decoding="async"></span>'%(ar,img) if img else ''
    rows+='      <a class="ow-row rv js-ow-row" href="%s"%s style="--k:%d"><b class="ow-n">%02d</b><span class="ow-name">%s</span><span class="ow-kind">%s</span><span class="ow-go">%s<i>&#8599;</i></span>%s</a>\n'%(href,ext,k,k+1,n,kind,'Open' if href.startswith('http') else 'Soon',pic)
SEC='''<section class="sec light cf js-cf js-path ow-sec" id="ourwork">
  <div class="inner cf-in cf-short ow-in">
    <h2 class="cf-h js-words">Our work.</h2>
    <p class="cf-p js-words">Things we made for ourselves and for clients. Click one to open it.</p>
    <div class="ow">
%s    </div>
  </div>
</section>
'''%rows
i=s.index('<!-- ================= SECTORS'); s=s[:i]+SEC+s[i:]
CSS='''
/* our work: a bold list of the studio's own projects */
.ow-sec{min-height:0}
.ow-in{align-items:flex-start;text-align:left}
.ow-in .cf-h{max-width:none;margin-bottom:clamp(14px,2.4vh,24px)}
.ow-in .cf-p{margin-bottom:clamp(28px,6vh,56px)}
.ow{width:100%;border-top:1px solid rgba(20,20,26,.14)}
.ow-row{position:relative;display:grid;grid-template-columns:3em minmax(0,1.6fr) minmax(0,1fr) auto;gap:clamp(14px,2.4vw,40px);align-items:center;padding:clamp(16px,2.6vh,26px) 0;border-bottom:1px solid rgba(20,20,26,.14);color:var(--ink);text-decoration:none;transition:padding-left .45s cubic-bezier(.2,.8,.2,1)}
.ow-row:hover{padding-left:12px}
.ow-n{font-family:"IBM Plex Mono",monospace;font-weight:500;font-size:11px;letter-spacing:.16em;color:var(--marrow)}
.ow-name{font-family:"Archivo","Helvetica Neue",Arial,sans-serif;font-weight:600;font-size:clamp(26px,3.6vw,56px);line-height:1;letter-spacing:-.035em;text-transform:uppercase}
.ow-kind{font-family:"IBM Plex Mono",monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--stone)}
.ow-go{font-family:"IBM Plex Mono",monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink);display:inline-flex;align-items:center;gap:8px;white-space:nowrap}
.ow-go i{font-style:normal;display:inline-block;transition:transform .3s cubic-bezier(.2,.8,.2,1)}
.ow-row:hover .ow-go i{transform:translate(2px,-2px)}
.ow-row[data-soon] .ow-go{color:var(--stone)}
.ow-pic{position:absolute;right:16%;top:50%;width:clamp(120px,14vw,220px);aspect-ratio:var(--ar,4/5);border-radius:6px;overflow:hidden;background:#EFECE4;transform:translateY(-50%) rotate(-3deg) scale(.9);opacity:0;pointer-events:none;transition:opacity .35s ease,transform .5s cubic-bezier(.2,.8,.2,1);z-index:2;box-shadow:0 24px 50px -24px rgba(20,20,26,.45)}
.ow-pic img{width:100%;height:100%;object-fit:cover;display:block}
@media(hover:hover){.ow-row:hover .ow-pic{opacity:1;transform:translateY(-50%) rotate(0) scale(1)}}
@media(max-width:820px){.ow-row{grid-template-columns:2.2em minmax(0,1fr) auto;gap:10px;padding:16px 0}.ow-kind{grid-column:2;grid-row:2;font-size:11px}.ow-name{font-size:clamp(22px,6.6vw,30px)}.ow-go{grid-row:1/3}.ow-pic{display:none}.ow-in .cf-p{margin-bottom:28px}}
'''
j=s.rfind('</style>'); s=s[:j]+CSS+s[j:]
JS='''
/* our work: a row marked soon tells instead of leaving */
(function(){ [].forEach.call(document.querySelectorAll(".js-ow-row[data-soon]"), function(a){ a.addEventListener("click", function(e){ e.preventDefault(); var g=a.querySelector(".ow-go"); if(g){ g.textContent="Link coming"; } }); }); })();
'''
k=s.rfind('</script>'); s=s[:k]+JS+s[k:]
open(P,'w',encoding='utf-8').write(s); print('patched', len(s)//1024,'KB')
