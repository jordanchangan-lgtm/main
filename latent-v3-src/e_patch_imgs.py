# Media renames applied to the built E page after the base is restored (the two 1288x1600 pictures recompressed
# for the phone's first screen). Idempotent.
P='/home/user/main/latent-v3e/index.html'; s=open(P,encoding='utf-8').read()
for a,b in [('05-0c45a9b23b.jpg','05-eea73e82c6.jpg'),('06-42b1448611.jpg','06-de6f1b3e21.jpg')]: s=s.replace('media/'+a,'media/'+b)
open(P,'w',encoding='utf-8').write(s); print('imgs ok')
# phone: the footer line at 11px, and no horizontal page scroll while gap lines slide in from the sides
s=open(P,encoding='utf-8').read()
if 'html,body{overflow-x:clip}' not in s:
    j=s.rfind('</style>'); s=s[:j]+'\n@media(max-width:820px){.foot{font-size:11px}html,body{overflow-x:clip}}\n'+s[j:]; open(P,'w',encoding='utf-8').write(s); print('phone css ok')
# the hero paragraph is the largest text on a phone: its words still rise one by one, but the stagger is capped so
# the whole paragraph is on screen within about a second of the headline (the audit's LCP note)
s=open(P,encoding='utf-8').read()
if '/* hero paragraph: capped stagger */' not in s:
    j=s.rfind('</style>'); s=s[:j]+'\n/* hero paragraph: capped stagger */\n.he-p{--d:.3s!important}\n.he-p .hm-in{transition-delay:calc(var(--d,0s) + min(calc(var(--w,0) * .04s), .5s))}\n'+s[j:]; open(P,'w',encoding='utf-8').write(s); print('hero stagger capped')

# the hero is the first screen: its lines are in from the start, not from the first scroll or the fonts' arrival
s=open(P,encoding='utf-8').read()
a='el.classList.toggle("in", p >= .05 + .6 * (n > 1 ? k / (n - 1) : 0));'
if a in s and 'g === lks[0] ||' not in s:
    s=s.replace(a,'el.classList.toggle("in", g === lks[0] || p >= .05 + .6 * (n > 1 ? k / (n - 1) : 0));'); open(P,'w',encoding='utf-8').write(s); print('hero in from the start')
