import base64, io
from PIL import Image
im=Image.open('/home/user/main/latent-v3e/media/01-9c8cbf6e11.jpg').convert('RGB'); w,h=im.size
im=im.resize((900,int(h*900/w))); b=io.BytesIO(); im.save(b,'JPEG',quality=78); poster='data:image/jpeg;base64,'+base64.b64encode(b.getvalue()).decode()
LINE="Latent is an AI-native design studio in Amman, making the visual side of a brand with generative tools in the hands of art directors."
LINE2="Our job is to make AI work look shot, not typed: brand visuals that are minimal, simple and never average."
def words(t): return ''.join('<span class="bw" style="--i:%d">%s</span> '%(i,w) for i,w in enumerate(t.split()))
TL='We direct before we generate.<br>Minimal first, craft always,<br>built to ship.'; BL='Focused direction.<br>Measured delivery.'
MQ='<div class="mq"><p class="corner">The rule of Latent.<br>On every job.</p><div class="mq-track"><span class="mq-run">Minimal <i>+</i> Simple <i>+</i> Never average <i>+</i> Minimal <i>+</i> Simple <i>+</i> Never average <i>+</i> </span><span class="mq-run">Minimal <i>+</i> Simple <i>+</i> Never average <i>+</i> Minimal <i>+</i> Simple <i>+</i> Never average <i>+</i> </span></div></div>'
opts=[]
opts.append(('00','As it is now','2.8 screens','The statement starts after the hero is fully gone, then three corner notes with large gaps, then the marquee. The gaps are what make it long.',
 '<div class="run cur js-run"><p class="line js-line">%s</p><p class="corner tl">%s</p><div class="br"><p>%s</p><a>More about us &rarr;</a></div><p class="corner bl">%s</p></div>%s'%(words(LINE),TL,LINE2,BL,MQ)))
opts.append(('01','The tight run','about 1.5 screens','Same run, same order, same mechanism. The statement starts sooner after the hero and the corner notes sit closer, so nothing is removed and the scroll is almost half.',
 '<div class="run tight js-run"><p class="line js-line">%s</p><p class="corner tl">%s</p><div class="br"><p>%s</p><a>More about us &rarr;</a></div><p class="corner bl">%s</p></div>%s'%(words(LINE),TL,LINE2,BL,MQ)))
opts.append(('02','One locked screen','1 screen, 1 scroll','The statement and its notes on one pinned screen, like the hero and the portfolio. The words brighten over a single scroll, then the page releases into the marquee. Reads as one beat.',
 '<div class="hold js-hold"><div class="stage"><p class="corner tl abs">%s</p><p class="line js-line big">%s</p><p class="corner bl abs">%s</p><div class="br abs"><p>%s</p><a>More about us &rarr;</a></div></div></div>%s'%(TL,words(LINE),BL,LINE2,MQ)))
opts.append(('03','Two short beats','about 1.6 screens, faster read','The run is cut into two short lines that each brighten on their own: the studio line, then the job line at the same size. The corner notes become one mono line under each. No marquee.',
 '<div class="run beats js-run"><p class="line js-line">%s</p><p class="corner">We direct before we generate &middot; Minimal first, craft always, built to ship</p></div><div class="run beats js-run"><p class="line js-line">%s</p><p class="corner">Focused direction &middot; Measured delivery &middot; <a>More about us &rarr;</a></p></div>'%(words(LINE),words(LINE2))))
opts.append(('04','Beside the film','about 1.3 screens','The statement on the left with the notes under it, the studio\'s picture pinned on the right at its own ratio. The picture carries the height, so the text needs less of it.',
 '<div class="run beside js-run"><div class="cols"><div class="txt"><p class="line js-line">%s</p><p class="corner">%s</p><div class="br"><p>%s</p><a>More about us &rarr;</a></div></div><div class="pic"><img src="%s" alt=""></div></div></div>'%(words(LINE),TL,LINE2,poster)))
opts.append(('05','The ticker statement','1 screen, about 1.8 scrolls','The statement as one giant line moving right to left through a pinned screen, the way the ask does. Words brighten as they reach the middle. The notes sit in the corners of that screen.',
 '<div class="hold tick js-tick"><div class="stage"><p class="corner tl abs">%s</p><p class="corner bl abs">%s</p><p class="tline js-tline">%s</p></div></div>%s'%(TL,BL,words(LINE),MQ)))
secs=''.join('<section class="opt" id="o%s"><div class="oh"><span class="n">%s</span><h2>%s</h2><span class="len">%s</span><p>%s</p></div>%s</section>'%(n,n,t,l,d,body) for n,t,l,d,body in opts)
html=open('run_tpl.html').read().replace('@SECS@',secs)
open('run_options.html','w').write(html); print(len(html)//1024,'KB')
