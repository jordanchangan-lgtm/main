# Media renames applied to the built E page after the base is restored (the two 1288x1600 pictures recompressed
# for the phone's first screen). Idempotent.
P='/home/user/main/latent-v3e/index.html'; s=open(P,encoding='utf-8').read()
for a,b in [('05-0c45a9b23b.jpg','05-eea73e82c6.jpg'),('06-42b1448611.jpg','06-de6f1b3e21.jpg')]: s=s.replace('media/'+a,'media/'+b)
open(P,'w',encoding='utf-8').write(s); print('imgs ok')
# phone: the footer line at 11px, and no horizontal page scroll while gap lines slide in from the sides
s=open(P,encoding='utf-8').read()
if 'html,body{overflow-x:clip}' not in s:
    j=s.rfind('</style>'); s=s[:j]+'\n@media(max-width:820px){.foot{font-size:11px}html,body{overflow-x:clip}}\n'+s[j:]; open(P,'w',encoding='utf-8').write(s); print('phone css ok')
