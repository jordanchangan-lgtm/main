import base64, io, json
from PIL import Image
steps=json.load(open('how_steps.json'))
def b64(path,maxw=1000):
    im=Image.open('/home/user/main/latent-v3e/'+path).convert('RGB'); w,h=im.size
    if w>maxw: im=im.resize((maxw,int(h*maxw/w)))
    b=io.BytesIO(); im.save(b,'JPEG',quality=76); return 'data:image/jpeg;base64,'+base64.b64encode(b.getvalue()).decode()
S=[(side,b64(src),txt) for side,src,txt in steps]
def words(t): return ''.join('<span class="bw" style="--i:%d">%s</span> '%(i,w) for i,w in enumerate(t.split()))
def step(side,img,txt,cls=''): return '<div class="step %s %s js-step"><figure class="img js-img"><img src="%s" alt=""></figure><p class="txt js-txt">%s</p></div>'%(side,cls,img,words(txt))
opts=[]
opts.append(('00','As it is now','7.6 screens','Six pictures, one per step, each opening from its side as it rises with the sentence beside it, and a full screen of white between them. The gaps between steps are the length.',
 '<div class="run cur">%s</div>'%''.join(step(a,b,c) for a,b,c in S)))
opts.append(('01','The tight run','about 4 screens','The same six, the same alternating wipe, the same sentences; the space between steps roughly halved so the next picture is already rising as the last one settles.',
 '<div class="run tight">%s</div>'%''.join(step(a,b,c) for a,b,c in S)))
pairs=[(S[0],S[1]),(S[2],S[3]),(S[4],S[5])]
opts.append(('02','Three rows, two pictures each','about 3 screens','Steps paired: each row holds two pictures, the left one opening from the left and the right one from the right, with both sentences under them. Half the rows, same wipe.',
 '<div class="run pairs">%s</div>'%''.join('<div class="pair js-pair"><div class="cell"><figure class="img js-img l"><img src="%s" alt=""></figure><p class="txt js-txt">%s</p></div><div class="cell"><figure class="img js-img r"><img src="%s" alt=""></figure><p class="txt js-txt">%s</p></div></div>'%(a[1],words(a[2]),b[1],words(b[2])) for a,b in pairs)))
opts.append(('03','One pinned screen, pictures swapping','1 screen, 6 short scrolls','One locked stage. Each scroll swaps to the next picture, opening from alternating sides, with its sentence beside it and a 01 / 06 counter. One screen of height, the whole story still told in order.',
 '<div class="hold js-hold" style="--n:6"><div class="stage"><p class="count js-count">01 / 06</p><div class="slides">%s</div></div></div>'%''.join('<div class="slide js-slide %s" data-i="%d"><figure class="img js-img"><img src="%s" alt=""></figure><p class="txt js-txt">%s</p></div>'%(a,i,b,words(c)) for i,(a,b,c) in enumerate(S))))
opts.append(('04','The filmstrip','1 screen, about 3 scrolls','The six pictures as one strip pinned on screen; scrolling moves it sideways, each picture opening as it reaches the middle, its sentence under it. Reads like a contact sheet of the process.',
 '<div class="hold strip js-strip"><div class="stage"><div class="track js-track">%s</div></div></div>'%''.join('<div class="card js-card"><figure class="img js-img"><img src="%s" alt=""></figure><p class="txt js-txt small"><b>%02d</b> %s</p></div>'%(b,i+1,words(c)) for i,(a,b,c) in enumerate(S))))
opts.append(('05','All six on one screen','1 screen','A grid of the six pictures on one screen, opening one after another from alternating sides as the screen arrives, each with its first word as a caption and the full sentence on hover. The shortest, and the least cinematic.',
 '<div class="grid js-grid">%s</div>'%''.join('<div class="gcell js-gcell %s" style="--k:%d"><figure class="img js-img"><img src="%s" alt=""></figure><p class="cap"><b>%s</b><span>%s</span></p></div>'%(a,i,b,c.split('.')[0]+'.',c.split('.',1)[1].strip()) for i,(a,b,c) in enumerate(S))))
secs=''.join('<section class="opt" id="o%s"><div class="oh"><span class="n">%s</span><h2>%s</h2><span class="len">%s</span><p>%s</p></div>%s</section>'%(n,n,t,l,d,body) for n,t,l,d,body in opts)
html=open('how_tpl.html').read().replace('@SECS@',secs)
open('how_options.html','w').write(html); print(len(html)//1024,'KB')
