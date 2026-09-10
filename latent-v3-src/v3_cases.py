# ---- the panel after the hero: who we are, told across an endless ivory scroll ----
# text blocks land in different places, pictures (placeholders until the studio's own arrive) at the reference's sizes
_sa=s.index('<section class="sec light" id="studio" style="padding:0">'); _sb=s.index('<!-- ================= METHOD')
_ten=re.findall(r'<img class="sp-pic sp-pic-[lr]" src="([^"]+)"', spm)
# (kind, column start, span, offset vh, payload). text payload: (kicker, line, size class, optional list); image payload: (src, caption, ratio)
BLOCKS=[
 [('t',2,6,0,('( Studio )','Latent is an AI-native design studio in Amman.','xl',None)),
  ('i',9,4,12,(care[0],'Cube Care Center','4/3'))],
 [('i',1,4,0,(cafe[0],'Cube Coffee House','16/10')),
  ('t',7,5,16,('What we do','We make the visual side of a brand: the posts and carousels, the reels and campaigns, the identity, the website, the portfolio.','lg',None))],
 [('t',2,3,6,('What leaves the studio',None,'list',['Posts','Carousels','Reels','Campaigns','Brand identity','Websites','Portfolios'])),
  ('i',6,3,0,(atel_hi[1],'Atelier Rebul','4/5')),
  ('t',10,3,26,('The rule','Minimal. Simple. Never average.','md',None))],
 [('i',1,5,4,(plates[0]['img'],'Latent','4/3')),
  ('t',8,4,18,('How','Every frame is directed before it is generated. We make many, we show the ones that pass.','md',None))],
 [('t',2,4,10,('Who','An art director and the machines, in the hands of taste. AI is the tool.','md',None)),
  ('i',7,4,0,(pour['poster'],'Cube Coffee House','4/5'))],
 [('i',1,5,0,(a['rawabina'],'Rawabina','3/2')),
  ('t',8,4,22,('Where','Amman, working worldwide. Days, not weeks.','md',None))],
]
_rows=''
for row in BLOCKS:
    _b=''
    for kind,c,sp,o,pl in row:
        if kind=='i':
            u,cap,r=pl
            _b+='      <figure class="cs-item" style="--c:%d;--s:%d;--r:%s;--o:%dvh"><div class="cs-img"><img src="%s" alt="" loading="lazy" decoding="async"></div><figcaption>%s</figcaption></figure>\n'%(c,sp,r,o,u,esc(cap))
        else:
            k,line,size,lst=pl
            body=('<p class="cs-line cs-%s js-words">%s</p>'%(size,esc(line))) if line else ''
            if lst: body+='<ul class="cs-list">'+''.join('<li class="js-words">%s</li>'%esc(x) for x in lst)+'</ul>'
            _b+='      <div class="cs-text" style="--c:%d;--s:%d;--o:%dvh"><p class="cs-kick js-words">%s</p>%s</div>\n'%(c,sp,o,esc(k),body)
    _rows+='    <div class="cs-row">\n'+_b+'    </div>\n'
CASES='<section class="sec light cs js-cs" id="studio">\n  <div class="inner">\n'+_rows+'  </div>\n</section>\n\n'
s=s[:_sa]+CASES+s[_sb:]
CSJS=open(SP+'v3_cases.js').read()
s=s.replace('</body>', '<script>\n'+CSJS+'</script>\n</body>', 1)
_j=s.rfind('</style>'); s=s[:_j]+open(SP+'v3_css7.css').read()+s[_j:]
