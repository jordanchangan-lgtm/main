# v3 preview fragment for the artifact: title + font links + style + body
import re
import os
s=open('/tmp/claude-0/-home-user-main/ebce930a-c60e-53f2-9cc9-6aaf1c614988/scratchpad/'+os.environ.get('SINGLE','v3_single.html'),encoding='utf-8').read()
title=re.search(r'<title>.*?</title>',s,re.S).group(0)
head=re.search(r'</noscript>(.*?)</head>',s,re.S)
fonts=''.join(re.findall(r'<link[^>]+fonts[^>]*>',s))
style=re.search(r'<style>.*?</style>',s[s.index('</noscript>'):],re.S).group(0)
scripts_head=''.join(re.findall(r'<script>window\.__WK.*?</script>',s,re.S))
body=re.search(r'<body>(.*)</body>',s,re.S).group(1)
# the artifact must stay under 16 MB: films above 900 KB are re-encoded smaller for the preview only (cached by hash)
import base64, hashlib, subprocess, tempfile
SPd='/tmp/claude-0/-home-user-main/ebce930a-c60e-53f2-9cc9-6aaf1c614988/scratchpad/'
os.makedirs(SPd+'pvcache',exist_ok=True)
def slim(m):
    raw=base64.b64decode(m.group(1))
    if len(raw)<4_500_000: return m.group(0)
    h=hashlib.md5(raw).hexdigest()[:12]; out=SPd+'pvcache/'+h+'.mp4'
    if not os.path.exists(out):
        src=SPd+'pvcache/'+h+'.src.mp4'; open(src,'wb').write(raw)
        subprocess.run(['ffmpeg','-v','error','-y','-i',src,'-vf',"scale='min(1280,iw)':-2",'-c:v','libx264','-crf','30','-preset','slow','-an','-movflags','+faststart',out],check=True)
    return 'data:video/mp4;base64,'+base64.b64encode(open(out,'rb').read()).decode()
body=re.sub(r'data:video/mp4;base64,([A-Za-z0-9+/=]+)',slim,body)
open('/tmp/claude-0/-home-user-main/ebce930a-c60e-53f2-9cc9-6aaf1c614988/scratchpad/'+os.environ.get('PREVIEW','v3_preview.html'),'w',encoding='utf-8').write(title+'\n'+fonts+'\n'+scripts_head+'\n'+style+'\n'+body)
print('preview written')
