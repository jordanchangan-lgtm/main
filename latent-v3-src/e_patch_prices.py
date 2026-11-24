# The price list as a quiet ledger (number, name with its one feature line, price with one conversion), the note
# carrying the other currencies, and the composer drawn like a chat box: a rounded field, a plus, a small picker,
# a square send. Run after e_patch_faq.py, before extraction. Idempotent.
import re
P='/home/user/main/latent-v3e/index.html'; s=open(P,encoding='utf-8').read()
if 'e_patch_prices' in s: print('prices already'); raise SystemExit
ROWS=[('01','Starter','4 carousel posts · 3 cinematic reels of 15 s · showcase videos · 1080p','200','≈ USD 282'),
      ('02','Essential','5 carousel posts · 5 cinematic reels of 15 s · showcase videos · 1080p','275','≈ USD 388'),
      ('03','Growth','5 carousel posts · 7 cinematic reels of 15 s · scripted film with edits and SFX · 1080p','375','≈ USD 529'),
      ('04','Signature','6 carousel posts · 10 cinematic reels of 20 s · scripted film with edits and SFX · 1080p','425','≈ USD 599'),
      ('05','Brand identity','logo · colour · type · brand book · packaging · Arabic and Latin','350','≈ USD 494','from'),
      ('06','Website','landing page or store · cinematic, phone-first · Arabic and English · live in days','250','≈ USD 353','from'),
      ('07','Custom','any mix of posts · carousels · cinematic reels · films · identity · website · quoted the same day',None,None)]
rows=''
for row in ROWS:
    n,name,feat,price,fx=row[:5]; frm=row[5] if len(row)>5 else ''
    pr=('<span class="pq-price">%s<b>%s</b> <i>JD</i><small class="pq-fx">%s</small></span>'%(('<em class="pq-from">%s</em> '%frm) if frm else '',price,fx)) if price else '<span class="pq-price"><b class="pq-ask">On request</b></span>'
    rows+='      <li class="pq-row rv" style="--k:%d"><span class="pq-n">%s</span><span class="pq-main"><span class="pq-name"><span class="pgw"><span class="pgw-in">%s</span></span></span><small class="pq-feat">%s</small></span>%s</li>\n'%(int(n)-1,n,name,feat,pr)
ul='<ul class="pq-list" aria-label="Packages and prices">\n'+rows+'    </ul>'
s=re.sub(r'<ul class="pq-list".*?</ul>', lambda m: ul, s, count=1, flags=re.S)
# the intro sentence becomes a mono kicker; the note a mono line
s=re.sub(r'<p class="cf-p js-words">Four packages, one price each, and a custom one built around you\. Tell us what you are launching and we answer the same day\.</p>', '<p class="pq-kick">Four packages, identity, website &middot; Jordanian dinars &middot; exclusive of tax</p>', s, count=1)
note='<p class="pq-note rv" style="--k:7">&asymp; SAR 1,060 to 2,250 &middot; AED 1,035 to 2,200 &middot; CAD 394 to 837 across the four &middot; every package costs less than the same pieces bought one by one &middot; the custom one is priced the same day you write</p>'
s=re.sub(r'<p class="pq-note rv"[^>]*>.*?</p>', lambda m: note, s, count=1, flags=re.S)
# the questions: the same index, the question rising through a mask
s=re.sub(r'<dt class="fq-q">([^<]*)</dt>', lambda m: '<dt class="fq-q"><span class="pgw"><span class="pgw-in">%s</span></span></dt>'%m.group(1), s)
# the composer
ic=lambda d: '<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="%s"/></svg>'%d
form='''<form class="cb-box rv js-cb-box" action="mailto:latentstudio.jo@gmail.com?subject=I%20have%20an%20idea%2C%20let%27s%20generate&body=Hello%20Latent%20Studio%2C%0A%0AI%20have%20an%20idea%2C%20let%27s%20generate.%0A%0A" method="get" style="--k:3">
      <label class="sr" for="cb-idea">Describe what you are launching</label>
      <textarea id="cb-idea" class="cb-idea js-cb-idea" rows="2" placeholder="Describe what you are launching&hellip;"></textarea>
      <div class="cb-row">
        <div class="cb-tools"><button type="button" class="cb-ic js-cb-plus" aria-label="Add a reference link" title="Add a reference link">@PLUS@</button></div>
        <div class="cb-right">
          <label class="cb-sel"><span class="sr">What are you launching?</span><select class="js-cb-kind" aria-label="What are you launching?"><option value="">Latent &middot; directed</option><option>Social package</option><option>Website</option><option>Brand identity</option><option>Film</option><option>Not sure yet</option></select>@CHEV@</label>
          <button type="submit" class="cb-send js-cb-btn" aria-label="Send">@SEND@</button>
        </div>
      </div>
    </form>'''.replace('@PLUS@',ic('M8 3.2v9.6M3.2 8h9.6')).replace('@CHEV@',ic('M4 6l4 4 4-4')).replace('@SEND@',ic('M8 13V3M3.6 7.4 8 3l4.4 4.4'))
s=re.sub(r'<form class="cb-box.*?</form>', lambda m: form, s, count=1, flags=re.S)
# the mail carries the picker's answer; the plus drops a reference line in; the send button wakes with the text
old='var t = (idea && idea.value || "").trim();'
new='var kind = box.querySelector(".js-cb-kind"), t = (idea && idea.value || "").trim(); if(kind && kind.value) t = "Launching: " + kind.value + "\\n" + t;'
assert old in s; s=s.replace(old,new,1)
old2='box.addEventListener("submit", function(e){ e.preventDefault(); go(); });'
new2=old2+''' var plus = box.querySelector(".js-cb-plus"), send = box.querySelector(".js-cb-btn");
  if(plus && idea) plus.addEventListener("click", function(){ var v = idea.value; idea.value = (v && !/\\n$/.test(v) ? v + "\\n" : v) + "Reference: "; idea.focus(); idea.setSelectionRange(idea.value.length, idea.value.length); if(send) send.classList.add("on"); });
  if(idea && send){ var wake = function(){ send.classList.toggle("on", !!idea.value.trim()); }; idea.addEventListener("input", wake); wake(); }'''
assert old2 in s; s=s.replace(old2,new2,1)
css='''
/* e_patch_prices: packages and questions as the site's index: number, name through a mask, mono meta, hairlines */
.pq-kick{margin:0 0 clamp(28px,6vh,64px);font-family:"IBM Plex Mono",monospace;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--stone)}
.pq-list{list-style:none;margin:0;padding:0;width:100%;text-align:start;border-top:1px solid rgba(20,20,26,.16)}
.pq-row{display:grid;grid-template-columns:3.2em minmax(0,1fr) minmax(0,.9fr);gap:0 clamp(16px,2.6vw,48px);align-items:start;padding:clamp(22px,3.6vh,40px) 0;border-bottom:1px solid rgba(20,20,26,.16);color:var(--ink)}
.pq-n{font-family:"IBM Plex Mono",monospace;font-weight:500;font-size:11px;letter-spacing:.16em;color:var(--marrow);padding-top:.9em}
.pq-main{display:flex;flex-direction:column;gap:12px;min-width:0}
.pq-name{display:block;font-family:"Archivo","Helvetica Neue",Arial,sans-serif;font-weight:600;font-size:clamp(32px,4.8vw,76px);line-height:.98;letter-spacing:-.04em;text-transform:uppercase;color:var(--ink);transition:color .3s}
.pq-name .pgw{padding:0 .02em .1em;margin:0 -.02em -.1em}
.pq-name .pgw-in{transform:translateY(112%);transition:transform .9s cubic-bezier(.19,1,.22,1) calc(.1s + var(--k,0) * .04s)}
.pq-row.in .pq-name .pgw-in{transform:none}
.pq-feat{display:block;font-family:"IBM Plex Mono",monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;line-height:1.7;color:var(--stone);max-width:56ch}
.pq-price{display:flex;flex-direction:column;align-items:flex-end;text-align:end;padding-top:.55em;font-family:"IBM Plex Mono",monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase;line-height:1.7;color:var(--ink);white-space:nowrap}
.pq-price b{font-family:"Archivo","Helvetica Neue",Arial,sans-serif;font-weight:500;font-size:clamp(26px,2.8vw,44px);letter-spacing:-.03em;line-height:1;font-variant-numeric:tabular-nums;text-transform:none}
.pq-price i{font-style:normal;color:var(--stone);margin-inline-start:6px}
.pq-fx{display:block;margin-top:8px;color:var(--stone);font-weight:400}
.pq-from{font-style:normal;font-family:"IBM Plex Mono",monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--stone);margin-inline-end:6px}
.pq-ask{font-family:"IBM Plex Mono",monospace!important;font-weight:500;font-size:11px!important;letter-spacing:.16em;text-transform:uppercase!important;color:var(--marrow);line-height:1.7}
.pq-note{margin:clamp(18px,3vh,30px) 0 0;max-width:none;width:100%;font-family:"IBM Plex Mono",monospace;font-size:11px;letter-spacing:.1em;line-height:1.8;text-transform:uppercase;color:var(--stone);text-align:start}
.pq-row:hover .pq-name{color:var(--marrow)}
.cb-in.cf-short{align-items:flex-start;text-align:start}
.cb-in .cf-h{margin-left:0;max-width:16ch}
.fq-in{align-items:flex-start;text-align:start}
.fq-list{margin:0;padding:0;width:100%;border-top:1px solid rgba(20,20,26,.16)}
.fq-row{display:grid;grid-template-columns:3.2em minmax(0,1fr) minmax(0,1fr);gap:0 clamp(16px,2.6vw,48px);align-items:start;padding:clamp(22px,3.6vh,40px) 0;border-bottom:1px solid rgba(20,20,26,.16);counter-increment:fq}
.fq-row::before{content:"0" counter(fq);font-family:"IBM Plex Mono",monospace;font-weight:500;font-size:11px;letter-spacing:.16em;color:var(--marrow);padding-top:.9em}
.fq-list{counter-reset:fq}
.fq-q{margin:0;font-family:"Archivo","Helvetica Neue",Arial,sans-serif;font-weight:600;font-size:clamp(24px,3vw,46px);line-height:1;letter-spacing:-.035em;text-transform:uppercase;color:var(--ink)}
.fq-q .pgw{padding:0 .02em .12em;margin:0 -.02em -.12em}
.fq-q .pgw-in{transform:translateY(112%);transition:transform .9s cubic-bezier(.19,1,.22,1) .1s}
.fq-row.in .fq-q .pgw-in{transform:none}
.fq-a{margin:0;padding-top:.3em;font-family:"Archivo","Helvetica Neue",Arial,sans-serif;font-weight:400;font-size:clamp(14px,1.1vw,17px);line-height:1.55;letter-spacing:-.005em;color:var(--stone);max-width:46ch}
.ar-block{border-top:1px solid rgba(20,20,26,.16);display:grid;grid-template-columns:3.2em minmax(0,1fr);gap:0 clamp(16px,2.6vw,48px)}
.ar-block::before{content:"";grid-column:1;grid-row:1/4}
.ar-block>*{grid-column:2}
.ar-h{margin:0 0 10px;font-family:"IBM Plex Sans Arabic","Archivo",sans-serif;font-weight:700;font-size:clamp(22px,2.4vw,34px);line-height:1.2;color:var(--ink)}
.ar-p{margin:0;font-family:"IBM Plex Sans Arabic","Archivo",sans-serif;font-size:clamp(14px,1.1vw,17px);line-height:1.7;color:var(--stone);max-width:52ch}
.ar-mono{margin:12px 0 0;font-family:"IBM Plex Sans Arabic","Archivo",sans-serif;font-size:12px;line-height:1.7;color:var(--stone)}
@media(max-width:820px){
.pq-row{grid-template-columns:2.4em minmax(0,1fr);gap:4px 10px;padding:20px 0}
.pq-name{font-size:clamp(28px,8.6vw,36px)}
.pq-price{grid-column:2;align-items:flex-start;text-align:start;padding-top:2px;flex-direction:row;flex-wrap:wrap;gap:0 10px;white-space:normal}
.pq-price b{font-size:22px}
.pq-fx{margin-top:0;display:inline}
.pq-feat{max-width:none}
.fq-row{grid-template-columns:2.4em minmax(0,1fr);gap:8px 10px;padding:20px 0}
.fq-a{grid-column:2;max-width:none;font-size:15px}
.fq-q{font-size:clamp(22px,6.8vw,30px)}
.ar-block{grid-template-columns:minmax(0,1fr)}
}
.cb-box{width:min(100%,720px);padding:14px 14px 10px;border-radius:22px;background:#fff;border:1px solid rgba(20,20,26,.13);box-shadow:0 1px 2px rgba(20,20,26,.04),0 10px 30px -18px rgba(20,20,26,.25);gap:8px}
.cb-box:focus-within{border-color:rgba(20,20,26,.28);box-shadow:0 1px 2px rgba(20,20,26,.04),0 10px 30px -18px rgba(20,20,26,.25)}
.cb-idea{min-height:2.6em;font-size:16px;line-height:1.5;padding:6px 4px;color:var(--ink)}
.cb-idea::placeholder{color:rgba(20,20,26,.45)}
.cb-row{display:flex;align-items:center;justify-content:space-between;gap:10px}
.cb-tools,.cb-right{display:flex;align-items:center;gap:8px}
.cb-ic{width:32px;height:32px;padding:0;border-radius:999px;border:1px solid rgba(20,20,26,.16);background:transparent;color:rgba(20,20,26,.72);display:inline-flex;align-items:center;justify-content:center;cursor:pointer;transition:background .2s}
.cb-ic:hover{background:rgba(20,20,26,.06)}
.cb-sel{position:relative;display:inline-flex;align-items:center;color:rgba(20,20,26,.7);font:500 13px/1 "Archivo","Helvetica Neue",Arial,sans-serif;letter-spacing:-.01em}
.cb-sel select{appearance:none;-webkit-appearance:none;border:0;background:transparent;font:inherit;color:inherit;padding:8px 24px 8px 10px;border-radius:9px;cursor:pointer;max-width:46vw}
.cb-sel select:hover{background:rgba(20,20,26,.06)}
.cb-sel select:focus{outline:0;background:rgba(20,20,26,.06)}
.cb-sel svg{position:absolute;inset-inline-end:7px;pointer-events:none;width:14px;height:14px;color:rgba(20,20,26,.55)}
html[dir=rtl] .cb-sel select{padding:8px 10px 8px 24px}
.cb-send{width:32px;height:32px;padding:0;border:0;border-radius:10px;background:var(--marrow);color:#fff;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;opacity:.42;transition:opacity .2s,transform .2s}
.cb-send.on,.cb-box:focus-within .cb-send{opacity:1}
.cb-send:hover{transform:translateY(-1px)}
.cb-send:active{transform:none}
@media(max-width:820px){.cb-box{border-radius:20px;padding:12px 12px 10px}.cb-idea{font-size:16px}}
'''
j=s.rfind('</style>'); s=s[:j]+css+s[j:]
open(P,'w',encoding='utf-8').write(s); print('prices ok')
