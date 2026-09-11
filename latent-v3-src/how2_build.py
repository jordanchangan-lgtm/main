import base64, io, json
from PIL import Image
steps=json.load(open('how_steps.json'))
def b64(path,maxw=1000):
    im=Image.open('/home/user/main/latent-v3e/'+path).convert('RGB'); w,h=im.size
    if w>maxw: im=im.resize((maxw,int(h*maxw/w)))
    b=io.BytesIO(); im.save(b,'JPEG',quality=76); return 'data:image/jpeg;base64,'+base64.b64encode(b.getvalue()).decode()
S=[(side,b64(src),txt) for side,src,txt in steps]
def words(t): return ''.join('<span class="bw" style="--i:%d">%s</span> '%(i,w) for i,w in enumerate(t.split()))
def pic(k,side,img,extra=''): return '<figure class="img js-img js-pic %s" data-k="%d" %s><img src="%s" alt=""></figure>'%(side,k,extra,img)
opts=[]
# 06 ladder
lad=''.join('<div class="step lad js-step %s" style="--k:%d"><figure class="img js-img"><img src="%s" alt=""></figure><p class="txt js-txt">%s</p></div>'%(a,i,b,words(c)) for i,(a,b,c) in enumerate(S))
opts.append(('06','The ladder','about 3 screens','Six pictures at six different widths, each shifted along a diagonal and starting before the one above has finished, the sentence tucked into the space the picture leaves. Same side wipe, no two rows alike.','<div class="run ladder">%s</div>'%lad))
# 07 one big, five small
big=S[0]; rest=S[1:]
small=''.join('<div class="step sm js-step %s"><figure class="img js-img"><img src="%s" alt=""></figure><p class="txt js-txt small">%s</p></div>'%('right',b,words(c)) for a,b,c in rest)
opts.append(('07','One big, five small','about 2.6 screens','The first step large and pinned on the left with its sentence; the other five small in a narrow column on the right, each opening from the right as it rises. The eye stays on one picture while the story passes beside it.',
 '<div class="run big5"><div class="bigcol"><div class="step js-step left"><figure class="img js-img"><img src="%s" alt=""></figure><p class="txt js-txt">%s</p></div></div><div class="smcol">%s</div></div>'%(big[1],words(big[2]),small)))
# 08 offset columns
colL=''.join('<div class="step oc js-step left w%d"><figure class="img js-img"><img src="%s" alt=""></figure><p class="txt js-txt small">%s</p></div>'%(k%3,b,words(c)) for k,(a,b,c) in enumerate(S[0::2]))
colR=''.join('<div class="step oc js-step right w%d"><figure class="img js-img"><img src="%s" alt=""></figure><p class="txt js-txt small">%s</p></div>'%((k+1)%3,b,words(c)) for k,(a,b,c) in enumerate(S[1::2]))
opts.append(('08','Two columns, out of step','about 3 screens','Two columns that never line up: the right one starts half a screen lower, and the pictures take three different widths, so the page reads as a loose editorial spread rather than a list. Left column opens from the left, right from the right.',
 '<div class="run offcols"><div class="col">%s</div><div class="col late">%s</div></div>'%(colL,colR)))
# 09 staircase with a running list
stairs=''.join('<div class="stair js-step right" style="--k:%d"><figure class="img js-img js-pic" data-k="%d"><img src="%s" alt=""></figure></div>'%(i,i,b) for i,(a,b,c) in enumerate(S))
lst=''.join('<p class="li js-ltxt" data-k="%d">%s</p>'%(i,words(c)) for i,(a,b,c) in enumerate(S))
opts.append(('09','The staircase','about 2.5 screens','Each picture starts further right and lower than the one before, a little smaller each time, opening from the right. The six sentences sit as one running list pinned on the left, each brightening as its picture crosses the middle.',
 '<div class="run stairs js-linked"><div class="list">%s</div><div class="steps">%s</div></div>'%(lst,stairs)))
# 10 text column, floating pictures
flo=''.join('<div class="flo js-step %s" style="--k:%d"><figure class="img js-img js-pic" data-k="%d"><img src="%s" alt=""></figure></div>'%(a,i,i,b) for i,(a,b,c) in enumerate(S))
opts.append(('10','Sentences pinned, pictures drifting','about 2.5 screens','The six sentences pinned as a column on the left. On the right the pictures drift down at different sizes and offsets, overlapping a little, each opening from its side; the sentence for the picture in the middle brightens.',
 '<div class="run drift js-linked"><div class="list">%s</div><div class="flos">%s</div></div>'%(lst,flo)))
# 11 one wide, then a broken strip
wide=S[2]; others=[S[0],S[1],S[3],S[4],S[5]]
strip=''.join('<div class="sc js-step %s" style="--k:%d"><figure class="img js-img"><img src="%s" alt=""></figure><p class="txt js-txt small">%s</p></div>'%(('left' if i%2 else 'right'),i,b,words(c)) for i,(a,b,c) in enumerate(others))
opts.append(('11','One wide, then a broken strip','about 2 screens','One picture full width, cinema ratio, its sentence set over it; then the other five as a row that does not line up, each at its own width and height offset, opening from alternating sides with the sentence beneath.',
 '<div class="run widestrip"><div class="step wide js-step left"><figure class="img js-img cine"><img src="%s" alt=""></figure><p class="txt js-txt over">%s</p></div><div class="strip5">%s</div></div>'%(wide[1],words(wide[2]),strip)))
secs=''.join('<section class="opt" id="o%s"><div class="oh"><span class="n">%s</span><h2>%s</h2><span class="len">%s</span><p>%s</p></div>%s</section>'%(n,n,t,l,d,body) for n,t,l,d,body in opts)
html=open('how2_tpl.html').read().replace('@SECS@',secs)
open('how_options2.html','w').write(html); print(len(html)//1024,'KB')
