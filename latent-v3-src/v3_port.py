# ---- the portfolio, two versions, both right after How it works ----
import re as _re, json as _json
_wi=s.index('<section class="sec dark wipe wk" id="work"'); _wj=s.index('</section>',_wi)+len('</section>')
_wsec=s[_wi:_wj]; s=s[:_wi]+s[_wj:].lstrip('\n')
_wk=_json.loads(_re.search(r'window\.__WK=(\[.*?\]);</script>', s).group(1))
_sets=_re.findall(r'<div class="wk-set js-wk-set" data-i="(\d)"><div class="wk-in">(.*?)</div></div>', _wsec, _re.S)
_figs=[_re.findall(r'<figure class="wk-m js-film".*?</figure>', inner, _re.S) for _,inner in _sets]
TAGS=[['perfume','film'],['identity'],['identity','film'],['web'],['identity','film'],['identity']]
CAT=['Perfume','Identity','Identity','Web','Identity','Identity']
def _ar(f):
    m=_re.search(r'--ar:(\d+)/(\d+)', f); return (int(m.group(1)),int(m.group(2))) if m else (9,16)
def _poster(f):
    m=_re.search(r'(?:poster|src)="(data:image[^"]+)"', f); return m.group(1) if m else ''
def _year(p): return p['meta'].split('·')[-1].strip()
_n=len(_wk)
if os.environ.get('PORTFOLIO')=='3':
    # ---- version three, after the Halo Reel: each project pins; its pieces ride an ellipse anchored to one edge
    #      and make one full spin as the page scrolls, the name parked in the space the ring leaves; sides alternate ----
    _holds=''
    for i,p in enumerate(_wk):
        figs=_figs[i]; N=len(figs); wide=sum(1 for f in figs if _ar(f)[0]/_ar(f)[1]>1.1)>N/2
        cw,ch=(360,225) if wide else (220,360)
        side='right' if i%2==0 else 'left'   # the ring hangs on the left edge first, the name on the right
        cards=''.join('        '+f+'\n' for f in figs)
        _holds+='''    <div class="hr-hold js-hr %s" data-i="%d">
      <div class="hr-stage">
        <div class="hr-ring js-hr-ring" data-w="%d" data-h="%d">
%s        </div>
        <div class="hr-label"><p class="hr-kick">%02d / %02d &middot; %s &middot; %s</p><h3 class="hr-name">%s</h3><p class="hr-proj">%s &middot; %s</p><p class="hr-cue"><span class="js-hr-cue">Scroll to spin</span> &middot; %d pieces &middot; click one to open it</p></div>
      </div>
    </div>
'''%(side,i,cw,ch,cards,i+1,_n,CAT[i],_year(p),p['t'],p['proj'],p['note'],N)
    _port='''<section class="sec dark hr js-hrsec" id="work">
  <div class="inner hr-head"><p class="pf2-head rv"><b>( Portfolio )</b> All work <span>[ %02d ]</span></p></div>
%s</section>
'''%(_n,_holds)
elif os.environ.get('PORTFOLIO')=='2':
    # ---- version two: the dark dots path; each project's name in the middle, its pieces scattered left and right ----
    _seed=[11]
    def _rnd():
        _seed[0]=(_seed[0]*9301+49297)%233280; return _seed[0]/233280
    _ch=''
    for i,p in enumerate(_wk):
        figs=_figs[i]; N=len(figs); items=''
        for k,f in enumerate(figs):
            w,h=_ar(f); wide=w/h>1.1; left=(k%2==0)
            y=6+(k/N)*82+(_rnd()-.5)*6
            if wide: x=(1+_rnd()*3) if left else (55+_rnd()*3); xm=(0+_rnd()*3) if left else (39+_rnd()*3); W='clamp(300px,38vw,700px)'; WM='58%'
            else:    x=(2+_rnd()*10) if left else (68+_rnd()*8); xm=(2+_rnd()*10) if left else (54+_rnd()*8); W='clamp(180px,22vw,400px)'; WM='36%'
            m=_re.match(r'<figure class="wk-m js-film" style="([^"]*)"([^>]*)>(<video[^>]*></video>|<img[^>]*>)(.*)</figure>', f, _re.S)
            media, rest, attrs = m.group(3), m.group(4), m.group(2)
            items+='      <figure class="pf2-item js-film" style="--x:%.1f%%;--xm:%.1f%%;--y:%.1f%%;--w:%s;--wm:%s"%s><span class="pf2-img" style="--r:%d/%d">%s</span>%s</figure>\n'%(x,xm,y,W,WM,attrs,w,h,media,rest)
        _ch+='''    <div class="pf2-ch" style="--n:%d" data-i="%d">
      <div class="pf2-lab"><p class="pf2-kick">%02d / %02d &middot; %s &middot; %s</p><h3 class="pf2-name js-words">%s</h3><p class="pf2-proj js-words">%s &middot; %s</p></div>
%s    </div>
'''%(N,i,i+1,_n,CAT[i],_year(p),p['t'],p['proj'],p['note'],items)
    _port='''<section class="sec dark pf2 js-pf2" id="work">
  <div class="inner pf2-in">
    <p class="pf2-head rv"><b>( Portfolio )</b> All work <span>[ %02d ]</span></p>
%s  </div>
</section>
'''%(_n,_ch)
else:
    # ---- version one: a mono list, one preview of the live project in the centre, the full grid behind a button ----
    _rows=''; _pvs=''; _groups=''
    for i,p in enumerate(_wk):
        figs=_figs[i]; w,h=_ar(figs[0])
        _rows+='        <a class="wk3-row js-wk3-row" data-i="%d" data-tags="%s" href="#work" style="--k:%d"><span class="r-n">%s</span><span class="r-p">%s</span><span class="r-c">%s</span><span class="r-y">%s</span><span class="r-a">&nearr;</span></a>\n'%(i,' '.join(TAGS[i]),i,p['t'],p['proj'],CAT[i],_year(p))
        _pvs+='        <div class="wk3-pv js-wk3-pv" data-i="%d" style="--ar:%d/%d"><img src="%s" alt="" loading="lazy" decoding="async"></div>\n'%(i,w,h,_poster(figs[0]))
        tiles=''
        for f in figs:
            fw,fh=_ar(f); t=_re.search(r'data-title="([^"]*)"',f).group(1); note=_re.search(r'data-note="([^"]*)"',f).group(1)
            tiles+='          <div class="wk3-tile%s"><i class="c1"></i><i class="c2"></i><i class="c3"></i><i class="c4"></i>%s<p class="wk3-cap"><span>%s</span><span>%s</span><em>%s</em></p></div>\n'%(' wide' if fw/fh>1.1 else '', f, t, _year(p), note)
        _groups+='      <div class="wk3-group js-wk3-group" data-i="%d" data-tags="%s"><p class="wk3-gh"><b>%02d</b> %s <span>%s &middot; %s &middot; %s</span></p><div class="wk3-tiles">\n%s        </div></div>\n'%(i,' '.join(TAGS[i]),i+1,p['t'],p['proj'],CAT[i],_year(p),tiles)
    _port='''<section class="sec dark wipe wk3 js-wk3" id="work" style="--prev:var(--ivory)">
  <div class="inner">
    <div class="wk3-head">
      <p class="wk3-filter js-wk3-filter"><span data-f="all" class="on">All</span><span data-f="film">Film</span><span data-f="identity">Identity</span><span data-f="perfume">Perfume</span><span data-f="web">Web</span></p>
      <p class="wk3-title rv">All work<sup>[ %02d ]</sup></p>
      <p class="wk3-view"><button type="button" class="js-wk3-view on" data-v="list">List</button><i>|</i><button type="button" class="js-wk3-view" data-v="grid">Grid</button></p>
    </div>
    <div class="wk3-listwrap js-wk3-listwrap">
      <div class="wk3-list js-wk3-list">
%s      </div>
      <div class="wk3-prev js-wk3-prev" aria-hidden="true">
%s      </div>
    </div>
    <p class="wk3-cta"><button type="button" class="js-wk3-reveal">[ Reveal full projects ]</button><span class="js-wk3-hint">Hover a project to see it. Click it to open all its pieces.</span></p>
    <div class="wk3-grid js-wk3-grid" hidden>
%s    </div>
  </div>
</section>
'''%(_n,_rows,_pvs,_groups)
# the portfolio sits right after How it works
_mi=s.index('<!-- ================= METHOD')
s=s[:_mi]+_port+'\n'+s[_mi:]
