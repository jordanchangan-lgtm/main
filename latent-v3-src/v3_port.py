# ---- the portfolio, two versions, both right after How it works ----
import re as _re, json as _json
_wi=s.index('<section class="sec dark wipe wk" id="work"'); _wj=s.index('</section>',_wi)+len('</section>')
_wsec=s[_wi:_wj]; s=s[:_wi]+s[_wj:].lstrip('\n')
_wk=_json.loads(_re.search(r'window\.__WK=(\[.*?\]);</script>', s).group(1))
_sets=_re.findall(r'<div class="wk-set js-wk-set" data-i="(\d)"><div class="wk-in">(.*?)</div></div>', _wsec, _re.S)
_figs=[_re.findall(r'<figure class="wk-m js-film".*?</figure>', inner, _re.S) for _,inner in _sets]
TAGS=[['perfume','film'],['identity'],['identity','film'],['web'],['identity','film'],['identity']]
CAT=['Perfume','Identity','Identity','Web','Identity','Identity']
# Cube Care Center is out of the portfolio
_keep=[i for i,p in enumerate(_wk) if p['t']!='Cube Care Center']
_wk=[_wk[i] for i in _keep]; _figs=[_figs[i] for i in _keep]; TAGS=[TAGS[i] for i in _keep]; CAT=[CAT[i] for i in _keep]
def _ar(f):
    m=_re.search(r'--ar:(\d+)/(\d+)', f); return (int(m.group(1)),int(m.group(2))) if m else (9,16)
def _poster(f):
    m=_re.search(r'(?:poster|src)="(data:image[^"]+)"', f); return m.group(1) if m else ''
def _year(p): return p['meta'].split('·')[-1].strip()
_n=len(_wk)
if os.environ.get('PORTFOLIO')=='7':
    # ---- version seven: the scatter. One screen per project. Its pieces and its name are thrown across the screen at
    #      random spots and angles; as the screen arrives they settle, upright and larger, into a second arrangement
    #      that is also random but composed (no two overlapping, none over the text); the name and details rise
    #      through line masks. Leaving the screen throws them again. ----
    import random as _rnd
    _rnd.seed(11)
    def _wm(txt): return ''.join('<span class="pgw"><span class="pgw-in" style="--w:%d">%s</span></span> '%(w,x) for w,x in enumerate(txt.split()))
    def _hit(a,b): return not (a[2]<b[0]-2 or a[0]>b[2]+2 or a[3]<b[1]-3 or a[1]>b[3]+3)
    def _place(n, ars, text_box, wmin, wmax, tries=6000, hk=1.0, ymax=94):
        out=[]
        for k in range(n):
            ar=ars[k]; best=None
            for _ in range(tries):
                w=_rnd.uniform(wmin,wmax); h=(w/ar)*hk
                x=_rnd.uniform(2,96-w); y=_rnd.uniform(4,ymax-h)
                box=(x,y,x+w,y+h)
                if _hit(box,text_box) or any(_hit(box,o) for o in out): continue
                best=box; break
            out.append(best or (x,y,x+w,y+h))
        return [(b[0],b[1],b[2]-b[0]) for b in out]
    _panels=''
    for i,p in enumerate(_wk):
        figs=_figs[i][:6]; N=len(figs); ars=[_ar(f)[0]/_ar(f)[1] for f in figs]
        tx=_rnd.choice([6,8,54,58]); ty=_rnd.choice([10,14,56,62]); tbox=(tx,ty,tx+32,ty+24)
        org=_place(N,ars,tbox,12,19,hk=1.6)
        ph=_place(min(N,4),ars,(0,70,100,100),26,40,hk=0.59,ymax=70)
        tiles=''
        for k,f in enumerate(figs):
            sx=_rnd.uniform(3,88); sy=_rnd.uniform(4,86); sr=_rnd.uniform(-16,16); sw=_rnd.uniform(5.5,8.5)
            ox,oy,ow=org[k]; px,py,pw=ph[k] if k<len(ph) else (0,0,0)
            tiles+='      <div class="sx-t js-sx-t%s" style="--ar:%d/%d;--sx:%.1f;--sy:%.1f;--sr:%.1f;--sw:%.1f;--ox:%.1f;--oy:%.1f;--ow:%.1f;--px:%.1f;--py:%.1f;--pw:%.1f;--k:%d">%s</div>\n'%(' sx-ph' if k>=4 else '',_ar(f)[0],_ar(f)[1],sx,sy,sr,sw,ox,oy,ow,px,py,pw,k,f)
        _panels+='    <div class="sx-panel js-sx-panel" data-i="%d">\n%s      <div class="sx-text js-sx-text" style="--tx:%d;--ty:%d">\n        <p class="sx-kick">%s</p>\n        <h3 class="sx-name">%s</h3>\n        <p class="sx-line">%s</p>\n        <p class="sx-note">%s</p>\n      </div>\n    </div>\n'%(i,tiles,tx,ty,_wm('( %02d / %02d ) %s'%(i+1,_n,CAT[i])),_wm(p['t']),_wm(p['proj']+' · '+p['meta']),_wm(p['note']+' · click a piece to open it'))
    _port='<section class="sec light sx js-sx" id="work">\n  <div class="sx-head"><p class="pg-kick rv"><b>( Chosen art pieces )</b> %02d projects &middot; thrown, then set</p></div>\n%s</section>\n'%(_n,_panels)
elif os.environ.get('PORTFOLIO')=='6':
    # ---- version six: the photographer's wall. A white section; the meta column pinned on the left (kicker, the
    #      project's name, piece, category, year, note, and a counter); on the right an edge-to-edge two-column
    #      stream of every piece at its own ratio, each one revealing as it rises; the meta swaps to whichever
    #      project sits mid-screen. ----
    _tiles=''
    def _wm(txt): return ''.join('<span class="pgw"><span class="pgw-in" style="--w:%d">%s</span></span> '%(w,x) for w,x in enumerate(txt.split()))
    for i,p in enumerate(_wk):
        figs=_figs[i]; N=len(figs); shown=figs[:3]; more=figs[3:]; cell=0
        for k,f in enumerate(shown):
            _tiles+='      <div class="pg-tile rv js-pg-tile %s" data-i="%d" data-name="%s" data-piece="%s" style="--k:%d">%s</div>\n'%('pg-l' if cell%2==0 else 'pg-r',i,p['t'],p['proj'],cell%4,f); cell+=1
        _tiles+='      <div class="pg-tile pg-open rv js-pg-open %s" data-i="%d" style="--k:%d" role="button" tabindex="0" aria-expanded="false"><span class="pg-open-in"><b class="pg-open-n">%02d</b><span class="pg-open-t js-pg-open-t">Reveal full project</span><span class="pg-open-c">%d more piece%s</span><span class="pg-open-a">&#8599;</span></span></div>\n'%('pg-l' if cell%2==0 else 'pg-r',i,cell%4,N,len(more),'' if len(more)==1 else 's'); cell+=1
        for j,f in enumerate(more):
            _tiles+='      <div class="pg-tile pg-more rv js-pg-tile %s" data-i="%d" data-name="%s" data-piece="%s" style="--k:%d" hidden>%s</div>\n'%('pg-l' if j%2==0 else 'pg-r',i,p['t'],p['proj'],j%2,f)
    _metas=''.join('<div class="pg-meta js-pg-meta%s" data-i="%d"><h3 class="pg-name">%s</h3><dl class="pg-dl"><dt>Piece</dt><dd>%s</dd><dt>Category</dt><dd>%s</dd><dt>Year</dt><dd>%s</dd><dt>Note</dt><dd>%s</dd></dl></div>'%(' on' if i==0 else '',i,_wm(p['t']),_wm(p['proj']),_wm(CAT[i]),_wm(_year(p)),_wm(p['note'])) for i,p in enumerate(_wk))
    _port='''<section class="sec light pg js-pg" id="work">
  <div class="pg-wrap">
    <aside class="pg-side">
      <p class="pg-kick"><b>( Chosen art pieces )</b> <span class="js-pg-count">01 / %02d</span></p>
      <div class="pg-metas">%s</div>
      <p class="pg-hint"><span>&darr;</span> Scroll the wall &middot; click a piece to open it</p>
      <p class="pg-hover js-pg-hover" aria-hidden="true"><b class="js-pg-hn"></b><span class="js-pg-hp"></span></p>
    </aside>
    <div class="pg-grid js-pg-grid">
%s    </div>
  </div>
</section>
'''%(_n,_metas,_tiles)
elif os.environ.get('PORTFOLIO')=='5':
    # ---- version five: not a portfolio. The things we make, stacked huge on a pinned dark screen, one bright at a
    #      time as the page scrolls, a small picture beside the bright one, a line on the left, words down the right. ----
    def _first_img(i,k=0):
        try: return _poster(_figs[i][k])
        except Exception: return ''
    THINGS=[('Posts',_first_img(0,1),'900/1612','Single frames for the feed. One product, one light, one idea, shot like a still from a film and delivered in every size the platform asks for.'),
            ('Carousels',_first_img(1,0),'4/5','A sequence that reads left to right. The cover pulls, the middle slides show, the last one asks. Written and framed as one story.'),
            ('Reels',_first_img(0,0),'720/1290','Short films for the feed. Directed shot by shot and cut to the beat. No set, no crew, no reshoot day.'),
            ('Campaigns',_first_img(1,1),'4/5','A whole launch in one language. Key visual, feed, stories, print and screen, all from the same direction so nothing looks stitched on.'),
            ('Brand identities',_first_img(3,0),'4/5','The look that comes before the shoot. Colour, type, tone and the rules that keep every frame recognisably yours.'),
            ('Websites',_first_img(2,0),'16/10','One page that sells the product as well as the shoot does. Built to load fast, read clearly and be seen on a phone first.'),
            ('Portfolios',_first_img(4,0),'4/5','Your work, presented. A clean set of pages that shows what you make and gets out of the way.'),
            ('Anything AI',shoes,'1288/1600','Anything a camera cannot reach or a budget cannot cover. Bring the idea; we direct it into frames.')]
    _items=''.join('        <div class="td-item js-td-item%s" data-i="%d"><span class="td-name">%s</span><span class="td-thumb" style="--ar:%s"><img src="%s" alt="" loading="lazy" decoding="async"></span></div>\n'%(' on' if i==0 else '',i,n,ar,img) for i,(n,img,ar,d) in enumerate(THINGS))
    _descs=''.join('<div class="td-desc js-td-desc%s"><p class="td-mono">( What we do ) <b>%02d</b> / %02d</p><p class="td-q">%s</p></div>'%(' on' if i==0 else '',i+1,len(THINGS),d) for i,(n,img,ar,d) in enumerate(THINGS))
    _port='''<section class="sec dark td js-td" id="work">
  <div class="td-hold js-td-hold" style="--n:%d">
    <div class="td-stage">
      <p class="td-mono td-kick"><i>&#9679;</i> What we make</p>
      <div class="td-grid">
        <div class="td-quote">%s</div>
        <div class="td-list"><div class="td-items">
%s        </div></div>
        <div class="td-side"><span>Minimal</span><span>Simple</span><span>Never average</span><span>Directed</span><span>Real</span><span>Shot, not typed</span><span>Days, not weeks</span></div>
      </div>
    </div>
  </div>
</section>
'''%(len(THINGS),_descs,_items)
elif os.environ.get('PORTFOLIO')=='4':
    # ---- version four: the white path mechanism in the black style. Each project is a row: the lead piece opens
    #      widthwise from its side (right, then left, alternating) with the name beside it; the rest of its pieces
    #      wipe in below one after another; every piece opens full frame. ----
    _rows=''
    for i,p in enumerate(_wk):
        figs=_figs[i]; lead=figs[0]; rest=figs[1:]
        side='right' if i%2==0 else 'left'
        m=_re.match(r'<figure class="wk-m js-film" style="([^"]*)"([^>]*)>(<video[^>]*></video>|<img[^>]*>)(.*)</figure>', lead, _re.S)
        media, restin, attrs = m.group(3), m.group(4), m.group(2)
        leadf='<figure class="wk-m js-film pb-lead js-pb-lead"%s><span class="pb-lm">%s</span>%s</figure>'%(attrs,media,restin)
        thumbs=''.join('          <div class="pb-th js-pb-th" style="--k:%d;--ar:%d/%d">%s</div>\n'%(k,_ar(f)[0],_ar(f)[1],f) for k,f in enumerate(rest))
        _rows+='''    <div class="pb-row %s">
      <div class="pb-main">
        %s
        <div class="pb-txt"><p class="pb-kick">%02d / %02d &middot; %s &middot; %s</p><h3 class="pb-name js-pb-name">%s</h3><p class="pb-proj js-pb-line">%s &middot; %s</p><p class="pb-cue">%d pieces &middot; click one to open it</p></div>
      </div>
      <div class="pb-strip">
%s      </div>
    </div>
'''%(side,leadf,i+1,_n,CAT[i],_year(p),p['t'],p['proj'],p['note'],len(figs),thumbs)
    _port='''<section class="sec dark pb js-pb" id="work">
  <div class="inner pb-in">
    <p class="pf2-head rv"><b>( Portfolio )</b> Chosen art pieces <span>[ %02d ]</span></p>
%s  </div>
</section>
'''%(_n,_rows)
elif os.environ.get('PORTFOLIO')=='3':
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
  <div class="inner hr-head"><p class="pf2-head rv"><b>( Portfolio )</b> Chosen art pieces <span>[ %02d ]</span></p></div>
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
    <p class="pf2-head rv"><b>( Portfolio )</b> Chosen art pieces <span>[ %02d ]</span></p>
%s  </div>
</section>
'''%(_n,_ch)
else:
    # ---- version one: a mono list, one preview of the live project in the centre, the full grid behind a button ----
    _rows=''; _pvs=''; _groups=''
    for i,p in enumerate(_wk):
        figs=_figs[i]; w,h=_ar(figs[0])
        _rows+='        <a class="wk3-row js-wk3-row rv" data-i="%d" data-tags="%s" href="#work" style="--k:%d"><span class="r-n">%s</span><span class="r-p">%s</span><span class="r-c">%s</span><span class="r-y">%s</span><span class="r-a">&nearr;</span></a>\n'%(i,' '.join(TAGS[i]),i,p['t'],p['proj'],CAT[i],_year(p))
        _pvs+='        <div class="wk3-pv js-wk3-pv" data-i="%d" style="--ar:%d/%d"><img src="%s" alt="" loading="lazy" decoding="async"></div>\n'%(i,w,h,_poster(figs[0]))
        tiles=''
        for f in figs:
            fw,fh=_ar(f); t=_re.search(r'data-title="([^"]*)"',f).group(1); note=_re.search(r'data-note="([^"]*)"',f).group(1)
            tiles+='          <div class="wk3-tile rv%s"><i class="c1"></i><i class="c2"></i><i class="c3"></i><i class="c4"></i>%s<p class="wk3-cap"><span>%s</span><span>%s</span><em>%s</em></p></div>\n'%(' wide' if fw/fh>1.1 else '', f, t, _year(p), note)
        _groups+='      <div class="wk3-group js-wk3-group" data-i="%d" data-tags="%s"><p class="wk3-gh rv"><b>%02d</b> %s <span>%s &middot; %s &middot; %s</span></p><div class="wk3-tiles">\n%s        </div></div>\n'%(i,' '.join(TAGS[i]),i+1,p['t'],p['proj'],CAT[i],_year(p),tiles)
    _port='''<section class="sec dark wipe wk3 js-wk3" id="work" style="--prev:var(--ivory)">
  <div class="inner">
    <div class="wk3-head">
      <p class="wk3-filter js-wk3-filter"><span data-f="all" class="on">All</span><span data-f="film">Film</span><span data-f="identity">Identity</span><span data-f="perfume">Perfume</span><span data-f="web">Web</span></p>
      <p class="wk3-title rv">Chosen art pieces<sup>[ %02d ]</sup></p>
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
if os.environ.get('HOW')=='5':
    # the film panel follows the white path directly; then the type block, the cut to black, and the portfolio
    _mi=s.index('<!-- ================= METHOD'); _me=s.index('</section>',s.index('id="method"',_mi))+len('</section>')
    s=s[:_me]+'\n'+(TYPE5 if os.environ.get('PORTFOLIO') not in ('5','6','7') else ('<div class="blinds rev wh js-blinds" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>\n' if os.environ.get('PORTFOLIO')=='5' else '<div class="blinds wh js-blinds" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>\n'))+_port+'\n'+s[_me:]
    s=s.replace('<section class="sec dark method wipe" id="method" style="--prev:var(--ivory)">','<section class="sec dark method wipe" id="method" style="--prev:#fff">',1)
else:
    # the portfolio sits right after How it works
    _mi=s.index('<!-- ================= METHOD')
    s=s[:_mi]+_port+'\n'+s[_mi:]
