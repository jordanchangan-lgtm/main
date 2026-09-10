# ---- the four moves, version four (PROCESS=4): after "WE CLOSE THAT GAP". Each move is one line on a pinned dark
#      screen: the right words slide in from the right, the left words from the left, a picture grows between them,
#      then squeezes shut as the words close the gap; a one-line description under it; then the next move. ----
_pi4p=s.index('<section class="sec light wipe pm js-path" id="process"') if '<section class="sec light wipe pm js-path" id="process"' in s else s.index('id="process"')
_pi4p=s.rfind('<section',0,_pi4p+1) if not s.startswith('<section',_pi4p) else _pi4p
_pj4p=s.index('</section>',_pi4p)+len('</section>')
GAP=[('We read','the brief','You send the product. We write the direction.',shoes),
     ('We set','the direction','Light, lens, angle, story. Agreed before a frame exists.',chair),
     ('We make','the frames','Hundreds made. You see the ones that pass.',fish),
     ('We ship','the files','Every size, every placement. Days, not weeks.',cactus)]
_lines=''.join('''      <div class="gp-line js-gp-line" data-i="%d">
        <div class="gp-row"><span class="gp-l">%s</span><span class="gp-tile"><img src="%s" alt="" loading="lazy" decoding="async"></span><span class="gp-r">%s</span></div>
        <p class="gp-desc">%s</p>
      </div>
'''%(i,l,img,r,d) for i,(l,r,d,img) in enumerate(GAP))
_new4p='''<section class="sec dark gp js-gp" id="process">
  <div class="gp-hold js-gp-hold" style="--n:%d">
    <div class="gp-stage">
      <p class="gp-kick"><b>( Four moves )</b> Every job, the same order</p>
%s    </div>
  </div>
</section>'''%(len(GAP),_lines)
s=s[:_pi4p]+_new4p+s[_pj4p:]
