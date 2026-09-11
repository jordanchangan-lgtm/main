if os.environ.get('PORTFOLIO')=='7':
    # ---- version seven: the scatter. One screen per project. Its pieces and its name are thrown across the screen at
    #      random spots and angles; as the screen arrives they settle, upright and larger, into a second arrangement
    #      that is also random but composed (no two overlapping, none over the text); the name and details rise
    #      through line masks. Leaving the screen throws them again. ----
    import random as _rnd
    _rnd.seed(11)
    def _wm(txt): return ''.join('<span class="pgw"><span class="pgw-in" style="--w:%d">%s</span></span> '%(w,x) for w,x in enumerate(txt.split()))
    def _hit(a,b): return not (a[2]<b[0]-2 or a[0]>b[2]+2 or a[3]<b[1]-3 or a[1]>b[3]+3)
    def _place(n, ars, text_box, wmin, wmax, tries=6000):
        out=[]
        for k in range(n):
            ar=ars[k]; best=None
            for _ in range(tries):
                w=_rnd.uniform(wmin,wmax); h=(w/ar)*(16/9)*0.5625
                x=_rnd.uniform(2,96-w); y=_rnd.uniform(4,94-h)
                box=(x,y,x+w,y+h)
                if _hit(box,text_box) or any(_hit(box,o) for o in out): continue
                best=box; break
            out.append(best or (x,y,x+w,y+h))
        return [(b[0],b[1],b[2]-b[0]) for b in out]
    _panels=''
    for i,p in enumerate(_wk):
        figs=_figs[i][:6]; N=len(figs); ars=[_ar(f)[0]/_ar(f)[1] for f in figs]
        tx=_rnd.choice([6,8,54,58]); ty=_rnd.choice([10,14,56,62]); tbox=(tx,ty,tx+32,ty+24)
        org=_place(N,ars,tbox,12,19)
        tiles=''
        for k,f in enumerate(figs):
            sx=_rnd.uniform(3,88); sy=_rnd.uniform(4,86); sr=_rnd.uniform(-16,16); sw=_rnd.uniform(5.5,8.5)
            ox,oy,ow=org[k]
            tiles+='      <div class="sx-t js-sx-t%s" style="--ar:%d/%d;--sx:%.1f;--sy:%.1f;--sr:%.1f;--sw:%.1f;--ox:%.1f;--oy:%.1f;--ow:%.1f;--k:%d">%s</div>\n'%(' sx-ph' if k>=4 else '',_ar(f)[0],_ar(f)[1],sx,sy,sr,sw,ox,oy,ow,k,f)
        _panels+='    <div class="sx-panel js-sx-panel" data-i="%d">\n%s      <div class="sx-text js-sx-text" style="--tx:%d;--ty:%d">\n        <p class="sx-kick">%s</p>\n        <h3 class="sx-name">%s</h3>\n        <p class="sx-line">%s</p>\n        <p class="sx-note">%s</p>\n      </div>\n    </div>\n'%(i,tiles,tx,ty,_wm('( %02d / %02d ) %s'%(i+1,_n,CAT[i])),_wm(p['t']),_wm(p['proj']+' · '+p['meta']),_wm(p['note']+' · click a piece to open it'))
    _port='<section class="sec light sx js-sx" id="work">\n  <div class="sx-head"><p class="pg-kick rv"><b>( Chosen art pieces )</b> %02d projects &middot; thrown, then set</p></div>\n%s</section>\n'%(_n,_panels)
el
