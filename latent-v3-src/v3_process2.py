# ---- the four moves, version two (PROCESS=2): after Aceternity's Sticky Scroll Reveal on 21st. The moves stack
#      down the left with a lot of air; the card on the right sticks and swaps its picture and colour as the
#      nearest move becomes the active one; inactive moves sit at a third of their opacity. ----
import re as _r2
_pi=s.index('<section class="sec light wipe" id="process"'); _pj=s.index('</section>',_pi)+len('</section>')
_psec=s[_pi:_pj]
_imgs=[]
for _tag in _r2.findall(r'<img [^>]*data-i="\d"[^>]*>', _psec):
    _src=_r2.search(r'src="([^"]+)"',_tag); _di=_r2.search(r'data-i="(\d)"',_tag)
    if _src and _di: _imgs.append((_src.group(1),'1000/1250',_di.group(1)))
MOVES=[('01','Brief','Product, palette, audience. What the work has to do.','Mark · construction'),
       ('02','Direction','Concept, light, motion, grade — agreed before anything is made.','Mark · in the world'),
       ('03','Frames','We make many. We show the ones that pass.','Mark · on the plate'),
       ('04','Delivery','Final files, sized for every placement.','Mark · shipped')]
_caps=_r2.findall(r'<span class="js-ixl-cap2">([^<]*)</span>', _psec)
_steps=''.join('        <div class="ss-step js-ss-step%s" data-i="%d"><span class="ss-n">%s</span><h3 class="ss-t">%s</h3><p class="ss-d">%s</p></div>\n'%(' on' if i==0 else '',i,n,t,d) for i,(n,t,d,c) in enumerate(MOVES))
_pics=''.join('          <img src="%s" alt="" data-i="%s" loading="lazy" decoding="async"%s>\n'%(src,i,' class="on"' if i=='0' else '') for src,ar,i in _imgs)
_new='''<section class="sec light wipe ss js-ss" id="process" style="--prev:var(--ink)">
  <div class="inner">
    <div class="ixl-head rv">
      <p class="ixl-filter"><b>( How it works )</b><span data-i="0" class="js-ss-tab on">Brief</span><span data-i="1" class="js-ss-tab">Direction</span><span data-i="2" class="js-ss-tab">Frames</span><span data-i="3" class="js-ss-tab">Delivery</span></p>
      <p class="ixl-title">Four moves<sup>[ 4 ]</sup></p>
      <p class="ixl-count">Days, not weeks</p>
    </div>
    <div class="ss-grid">
      <div class="ss-steps js-ss-steps">
%s      </div>
      <div class="ss-side"><figure class="ss-card js-ss-card" style="--c:var(--ink)">
%s          <figcaption><span class="js-ss-cap">Brief</span><span class="js-ss-cap2">Mark &middot; construction</span></figcaption>
      </figure></div>
    </div>
    <p class="ixl-note rv">Every job runs the same way, in the same order. You see the direction before anything is made, and the frames before anything is final.</p>
  </div>
</section>'''%(_steps,_pics)
s=s[:_pi]+_new+s[_pj:]
