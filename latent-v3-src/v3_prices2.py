# ---- prices, version two (PRICES=2): the four packages print like thermal receipts, after 21st's Receipt Pricing.
#      A mono ledger with dot leaders, dashed rules, a stamp on the most chosen, total due, a barcode; the slips print
#      top to bottom when scrolled to, left to right. ----
import urllib.parse as _up
PACKS2=[
 dict(id='starter',n='01',name='Starter',price=200,tag='A first month of showing up, done properly.',items=[('Carousel posts','4'),('Reels · 15 s','3'),('Showcase video','1–2 shots'),('Delivery','1080p')]),
 dict(id='essential',n='02',name='Essential',price=275,tag='The steady feed: more posts, more reels.',items=[('Carousel posts','5'),('Reels · 15 s','4'),('Showcase video','1–2 shots'),('Delivery','1080p')]),
 dict(id='growth',n='03',name='Growth',price=375,tag='Scripted film enters the picture.',pop=True,items=[('Carousel posts','5'),('Cinematic reels · 15 s','3'),('Scripted film + SFX','Incl.'),('Shots per reel','2–7'),('Delivery','1080p')]),
 dict(id='signature',n='04',name='Signature',price=425,tag='The full campaign, longer and louder.',items=[('Carousel posts','6'),('Cinematic reels · 20 s','3'),('Scripted film + SFX','Incl.'),('Shots per reel','2–7'),('Delivery','1080p')]),
]
def _fnv(seed):
    h=2166136261
    for ch in seed: h^=ord(ch); h=(h*16777619)&0xffffffff
    return h
def _bars(seed,n=46):
    h=_fnv(seed); out=[]
    for _ in range(n):
        h=((h^(h>>15))*2246822519)&0xffffffff; out.append(h%3+1)
    return out
def _mail(what):
    return 'mailto:latentstudio.jo@gmail.com?subject='+_up.quote('Enquiry · '+what)+'&body='+_up.quote('Hello Latent Studio,\n\nI would like to start with the '+what+'.\n\nBrand / product:\nWhat we are launching:\nWhen:\n\nThanks,\n')
_slips=''
for k,p in enumerate(PACKS2):
    order='LS-%d'%((_fnv(p['id'])%90000)+10000); code=order+'-26'
    rows=''.join('<li><span>%s</span><i></i><b>%s</b></li>'%(l,v) for l,v in p['items'])
    bars=''.join('<u style="width:%dpx"%s></u>'%(w,' class="on"' if i%2==0 else '') for i,w in enumerate(_bars(code)))
    _slips+='''      <div class="rc-slip%s" style="--k:%d">
        <article class="rc-paper" aria-label="%s package">
          <header class="rc-head"><p class="rc-merchant">Latent Studio</p><p class="rc-sub">Amman · brand visuals made with AI</p></header>
          <hr class="rc-rule"><dl class="rc-meta"><div><dt>Order</dt><dd>%s</dd></div><div><dt>Package</dt><dd>%s / 04</dd></div></dl><hr class="rc-rule">
          <div class="rc-title"><h3>%s</h3><p>%s</p>%s</div>
          <hr class="rc-rule"><ul class="rc-items">%s</ul><hr class="rc-rule">
          <div class="rc-total"><div><p>Total due</p><p class="rc-amt">%d <span>JD</span></p></div><p class="rc-note">Per package · exclusive of tax · less than the same items one by one</p></div>
          <a class="rc-cta%s" href="%s">Start with %s</a>
          <div class="rc-code" aria-hidden="true"><div class="rc-bars">%s</div><p>%s</p></div>
          <i class="rc-headline" aria-hidden="true"></i>
        </article>
      </div>
'''%(' pop' if p.get('pop') else '',k,p['name'],order,p['n'],p['name'],p['tag'],'<p class="rc-stamp">*** Most chosen ***</p>' if p.get('pop') else '',rows,p['price'],' pop' if p.get('pop') else '',_mail(p['name']+' package · %d JD'%p['price']),p['name'],bars,code)
_rc='''<div class="rc-row rv" role="list" aria-label="Packages">
%s    </div>'''%_slips
_xi=s.index('<div class="xg js-xg rv" role="list" aria-label="Packages"></div>')
s=s[:_xi]+_rc+s[_xi+len('<div class="xg js-xg rv" role="list" aria-label="Packages"></div>'):]
