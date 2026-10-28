# Builds the single-file preview for the artifact from a deploy folder: media under the cap inlined as data URIs.
import re, base64, os, sys, mimetypes
D=sys.argv[1]; OUT=sys.argv[2]; CAP=int(sys.argv[3]) if len(sys.argv)>3 else 4_500_000
s=open(D+'/index.html',encoding='utf-8').read()
def rep(m):
    p=m.group(2); f=os.path.join(D,p)
    if not os.path.exists(f) or os.path.getsize(f)>CAP: return m.group(0)
    mime=mimetypes.guess_type(f)[0] or 'application/octet-stream'
    return m.group(1)+'data:%s;base64,'%mime+base64.b64encode(open(f,'rb').read()).decode()
s=re.sub(r'((?:src|poster|data-src|data-src-m|data-poster-m|href)=")(media/[^"]+)', rep, s)
open(OUT,'w',encoding='utf-8').write(s); print('preview', len(s)//1024//1024,'MB')
