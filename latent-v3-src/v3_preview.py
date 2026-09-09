# v3 preview fragment for the artifact: title + font links + style + body
import re
s=open('/tmp/claude-0/-home-user-main/ebce930a-c60e-53f2-9cc9-6aaf1c614988/scratchpad/v3_single.html',encoding='utf-8').read()
title=re.search(r'<title>.*?</title>',s,re.S).group(0)
head=re.search(r'</noscript>(.*?)</head>',s,re.S)
fonts=''.join(re.findall(r'<link[^>]+fonts[^>]*>',s))
style=re.search(r'<style>.*?</style>',s[s.index('</noscript>'):],re.S).group(0)
scripts_head=''.join(re.findall(r'<script>window\.__WK.*?</script>',s,re.S))
body=re.search(r'<body>(.*)</body>',s,re.S).group(1)
open('/tmp/claude-0/-home-user-main/ebce930a-c60e-53f2-9cc9-6aaf1c614988/scratchpad/v3_preview.html','w',encoding='utf-8').write(title+'\n'+fonts+'\n'+scripts_head+'\n'+style+'\n'+body)
print('preview written')
