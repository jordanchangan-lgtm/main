# Builds the single-file preview for the artifact from a deploy folder: images inlined; films over the cap re-encoded
# smaller (cached by name) so the page stays under the 16 MB artifact limit.
import re, base64, os, sys, mimetypes, subprocess, hashlib
D=sys.argv[1]; OUT=sys.argv[2]; CAP=int(sys.argv[3]) if len(sys.argv)>3 else 1_200_000
CACHE=os.path.join(os.path.dirname(OUT),'pvcache'); os.makedirs(CACHE,exist_ok=True)
s=open(D+'/index.html',encoding='utf-8').read()
def small_film(f):
    out=os.path.join(CACHE,hashlib.md5(f.encode()).hexdigest()[:10]+'.mp4')
    if not os.path.exists(out): subprocess.run(['ffmpeg','-v','error','-y','-i',f,'-vf',"scale='min(960,iw)':-2",'-c:v','libx264','-crf','32','-preset','fast','-an','-movflags','+faststart',out],check=True)
    return out
def rep(m):
    p=m.group(2); f=os.path.join(D,p)
    if not os.path.exists(f): return m.group(0)
    if os.path.getsize(f)>CAP:
        if f.endswith('.mp4'): f=small_film(f)
        if os.path.getsize(f)>CAP: return m.group(0)
    mime=mimetypes.guess_type(f)[0] or 'application/octet-stream'
    return m.group(1)+'data:%s;base64,'%mime+base64.b64encode(open(f,'rb').read()).decode()
s=re.sub(r'((?:src|poster|data-src|data-src-m|data-poster-m|href)=")(media/[^"]+)', rep, s)
open(OUT,'w',encoding='utf-8').write(s); print('preview', round(len(s)/1024/1024,1),'MB')
