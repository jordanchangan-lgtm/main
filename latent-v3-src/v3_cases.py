# ---- the studio panel after the hero, after the reference: a wide banner, the title with the counts, then the cases ----
_sa=s.index('<section class="sec light" id="studio" style="padding:0">'); _sb=s.index('<!-- ================= METHOD')
_ten=re.findall(r'<img class="sp-pic sp-pic-[lr]" src="([^"]+)"', spm)
# slots: (image, caption, column start, span, aspect ratio, vertical offset in vh). Three per row, sizes from the reference.
SLOTS=[
 [(care[0],'Cube Care Center',1,4,'4/3',0),(cafe[0],'Cube Coffee House',5,3,'16/10',-6),(care[1],'Cube Care Center',8,5,'4/3',-10)],
 [(atel_hi[1],'Atelier Rebul',1,3,'4/3',0),(pour['poster'],'Cube Coffee House',4,4,'4/5',8),(atel_hi[3],'Atelier Rebul',8,5,'3/2',-6)],
 [(plates[0]['img'],'Latent',1,4,'16/10',0),(plates[1]['img'],'Latent',5,3,'4/3',10),(plates[3]['img'],'Latent',8,5,'4/3',-8)],
 [(a['rawabina'],'Rawabina',1,4,'3/2',0),(rw[0][2],'Rawabina',5,4,'3/2',4),(rw[1][2],'Rawabina',9,4,'3/2',8)],
 [(cafe[1],'Cube Coffee House',1,4,'3/2',0),(_ten[0],'Latent',5,4,'4/3',6),(_ten[1],'Latent',9,4,'4/3',0)],
 [(atel_hi[2],'Atelier Rebul',5,4,'1/1',0)],
]
_rows=''
for row in SLOTS:
    _items=''.join('      <figure class="cs-item" style="--c:%d;--s:%d;--r:%s;--o:%dvh"><div class="cs-img"><img src="%s" alt="" loading="lazy" decoding="async"></div><figcaption>%s</figcaption></figure>\n'%(c,sp,r,o,u,esc(cap)) for (u,cap,c,sp,r,o) in row)
    _rows+='    <div class="cs-row">\n'+_items+'    </div>\n'
_n=sum(len(r) for r in SLOTS)
CASES=('<section class="sec light cs js-cs" id="studio">\n  <div class="inner">\n'
 '    <div class="cs-head">\n'
 '      <ul class="cs-counts"><li>Posts (6)</li><li>Films (3)</li><li>Identity (5)</li><li>Web (3)</li></ul>\n'
 '      <h2 class="cs-title">Selected work</h2>\n'
 '    </div>\n'+_rows+'  </div>\n</section>\n\n')
s=s[:_sa]+CASES+s[_sb:]
CSJS=open(SP+'v3_cases.js').read()
s=s.replace('</body>', '<script>\n'+CSJS+'</script>\n</body>', 1)
_j=s.rfind('</style>'); s=s[:_j]+open(SP+'v3_css7.css').read()+s[_j:]
