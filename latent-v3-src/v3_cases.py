# ---- the studio panel after the hero: the statement, then the work flowing up in three columns ----
_sa=s.index('<section class="sec light" id="studio" style="padding:0">'); _sb=s.index('<!-- ================= METHOD')
_ten=re.findall(r'<img class="sp-pic sp-pic-[lr]" src="([^"]+)"', spm)
# each row: a label, a line, then pictures as (image, caption, column start, span, top offset in vh, parallax factor)
ROWS=[
 ('01 · Posts & carousels','Posts that stop the scroll.',[
   (care[0],'Cube Care Center · poster',1,4,0,.06),(cafe[0],'Cube Coffee House · poster',7,3,14,-.05),(care[1],'Cube Care Center · poster',10,3,6,.02)]),
 ('02 · Reels & campaigns','Directed like film.',[
   (atel_hi[1],'Atelier Rebul · Élixir 2',2,3,4,-.04),(pour['poster'],'Cube Coffee House · film',6,4,0,.05),(atel_hi[3],'Atelier Rebul · plate 04',10,3,16,.01)]),
 ('03 · Identity','A mark that means something.',[
   (plates[0]['img'],'Latent · the mark',1,4,0,.03),(plates[1]['img'],'Latent · colour',6,3,18,-.05),(plates[3]['img'],'Latent · colophon',9,4,8,.04)]),
 ('04 · Websites & portfolios','Built like this one.',[
   (a['rawabina'],'Rawabina · Touch of Green',1,6,0,.02),(rw[0][2],'Rawabina · home',8,5,12,-.04)]),
 ('05 · The rule','Minimal, simple, never average.',[
   (_ten[0],'Minimalism',3,3,0,.04),(_ten[1],'Simplicity',8,3,10,-.03)]),
]
_rows=''
for lbl,line,pics in ROWS:
    _items=''.join('        <figure class="cs-item rv" style="--c:%d;--s:%d;--o:%dvh;--k:%s;--r:%s"><div class="cs-img"><img src="%s" alt="" loading="lazy" decoding="async"></div><figcaption>%s</figcaption></figure>\n'%(c,sp,o,k,ar(u),u,esc(cap)) for (u,cap,c,sp,o,k) in pics)
    _rows+='      <div class="cs-row">\n        <p class="cs-lbl rv"><b>%s</b><span>%s</span></p>\n%s      </div>\n'%(esc(lbl),esc(line),_items)
CASES=('<section class="sec light cs js-cs" id="studio">\n  <div class="inner">\n    <div class="cs-head">\n'
 '      <p class="eyebrow rv"><b>( Studio )</b> Amman</p>\n'
 '      <p class="cs-stmt rv" style="--k:1">Latent is an AI-native design studio in Amman. We make the visual side of a brand &mdash; posts and carousels, reels and campaigns, the identity, the website, the portfolio &mdash; with generative tools in the hands of art directors.</p>\n'
 '    </div>\n'+_rows+'  </div>\n</section>\n\n')
s=s[:_sa]+CASES+s[_sb:]
CSJS=open(SP+'v3_cases.js').read()
s=s.replace('</body>', '<script>\n'+CSJS+'</script>\n</body>', 1)
_j=s.rfind('</style>'); s=s[:_j]+open(SP+'v3_css7.css').read()+s[_j:]
