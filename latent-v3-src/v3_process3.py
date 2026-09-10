# ---- the four moves, version three (PROCESS=3): bold and minimal. Each move is one huge word landing in a different
#      place on the screen with a one-line description beside it; both gather out of scattered starts as they arrive,
#      like the words on the black run. No numbers, no cards. ----
_pi=s.index('<section class="sec light wipe" id="process"') if '<section class="sec light wipe" id="process"' in s else s.index('<section class="sec light wipe ss js-ss" id="process"')
_pj=s.index('</section>',_pi)+len('</section>')
MOVES3=[('Brief','You send the product. We write the direction.','0%','left'),
        ('Direction','Light, lens, angle, story. Agreed before a frame exists.','38%','right'),
        ('Frames','We make many. You see the ones that pass.','12%','left'),
        ('Delivery','Final files, every size. Days, not weeks.','52%','right')]
_blocks=''.join('''    <div class="pm-step %s" style="--x:%s">
      <h3 class="pm-word js-words">%s</h3>
      <p class="pm-line js-words">%s</p>
    </div>
'''%(side,x,w,l) for w,l,x,side in MOVES3)
_new='''<section class="sec light wipe pm js-path" id="process" style="--prev:var(--ink)">
  <div class="inner pm-in">
    <p class="pm-kick rv"><b>( Four moves )</b> Every job, the same order</p>
%s  </div>
</section>'''%_blocks
s=s[:_pi]+_new+s[_pj:]
