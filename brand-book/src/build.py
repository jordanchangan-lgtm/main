#!/usr/bin/env python3
"""Builds the Latent Studio brand book.

Page-for-page rebuild of the Feelgood Lab brand book shown in
https://www.instagram.com/p/DcbLjZatZ0W/ (35 frames, all read), in Latent's system:
INK #14141A · IVORY #F2EFE7 · MARROW #BB4A2E. Same chrome on every page (brand label
top-left, "( 01 )" numeral over a centred section title, book label top-right, centred
page number), same section order, same page archetypes. All imagery generated in the
three brand colours around Latent's subject: real skin, real light, no camera, no studio.

Writes ../book.html, then renders ../pages/NN-name.png (2x) and ../latent-brand-book.pdf.
Run: python3 build.py          (build + render)
     python3 build.py --html   (build only)
     python3 build.py --only=1,5
"""
import os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES_DIR = os.path.join(ROOT, "pages")
CHROME = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell"

pages = []

def page(name, cls, body, title=None, num=None, brand="LATENT STUDIO", book="BRAND BOOK", chrome=True):
    n = len(pages) + 1
    head = ""
    if chrome:
        t = ""
        if title:
            if num:
                t = f'<div class="ttl"><div class="tn">( {num} )</div><div class="tt">{title}</div></div>'
            else:
                t = f'<div class="ttl"><div class="ts">{title}</div></div>'
        head = f'<div class="lab tl">{brand}</div>{t}<div class="lab tr">{book}</div>'
    pn = f'<div class="pn">{n:02d}</div>'
    pages.append((name, f'<section class="page {cls}" id="p{n}">{head}{body}{pn}<div class="grain"></div></section>'))

def img(src, pos="center", cls="", style=""):
    return f'<img class="{cls}" src="images/{src}" style="object-position:{pos};{style}">'

WM_INK = '<img class="wm" src="logo/latent-wordmark-ink.svg" alt="latənt">'
WM_IVORY = '<img class="wm" src="logo/latent-wordmark-ivory.svg" alt="latənt">'
WM_MARROW = '<img class="wm" src="logo/latent-wordmark-marrow.svg" alt="latənt">'
SY_INK = '<img class="sy" src="logo/latent-symbol-ink.svg" alt="ə">'
SY_IVORY = '<img class="sy" src="logo/latent-symbol-ivory.svg" alt="ə">'
SY_MARROW = '<img class="sy" src="logo/latent-symbol-marrow.svg" alt="ə">'
TAG = "no camera. no studio. only direction."

# 01 cover  (ref p1: giant title, small photo overlapping, description)
page("cover", "ink cover", f'''
  <h1 class="cover-h">brand book</h1>
  {img("cover-figure.jpg", "center 20%", "cover-photo")}
  <p class="cover-p">the latənt brand book defines the foundation of the studio. it ensures every element — from the mark to colour to typography — works together as one cohesive system across every touchpoint.</p>
''')

# 02 contents  (ref p2: image strip + dotted list)
page("contents", "ink", f'''
  {img("studio-empty.jpg", "center 55%", "strip")}
  <ol class="toc">
    <li><span>about</span><i></i><b>03</b></li>
    <li><span>logo</span><i></i><b>07</b></li>
    <li><span>colours & textures</span><i></i><b>17</b></li>
    <li><span>typography</span><i></i><b>21</b></li>
    <li><span>mockups</span><i></i><b>25</b></li>
  </ol>
''', "contents", "01")

# 03 the story  (ref p3: photo left / colour right with paragraphs)
page("story", "ink split", f'''
  <div class="half photo">{img("story-face.jpg", "center 30%")}</div>
  <div class="half text">
    <p>latent studio is an ai-native visual studio in amman, working with brands anywhere.</p>
    <p>we produce campaign-grade brand imagery — the kind that used to need a photographer, a stylist, a location, a retoucher and six weeks — and we produce it in days. no camera. no studio. only direction.</p>
    <p>we do not sell files. we sell an ongoing visual department on retainer, sitting outside your payroll, holding your brand to one standard every week.</p>
    <p>we say "ai" out loud and never apologise for it. the tool is not the point. the pores, the grain, the one wrong thing in the right place — that is the point.</p>
  </div>
''', "the story", "02")

# 04 mission  (ref p4: dark, tiny photo, paragraph)
page("mission", "ink tiny-page", f'''
  {img("hand-print.jpg", "center 40%", "tiny")}
  <p class="tiny-p">to render the image a brand already contains but could never afford to shoot — and to make it real enough that nobody asks how it was made.</p>
''', "mission", "03")

# 05 vision  (ref p5: light, tiny photo, paragraph)
page("vision", "ivory tiny-page", f'''
  {img("film-canisters.jpg", "center", "tiny")}
  <p class="tiny-p">to be the studio brands hire when the image has to carry the brand: not the fastest, not the cheapest — the one whose frames people believe. ai is the tool. taste is the craft.</p>
''', "vision", "04")

# 06 the mood  (ref p6: 4-column photo strip, numbered)
page("mood", "ink mood", f'''
  <div class="mood4">
    <figure><span>( 01 )</span>{img("skin-macro.jpg", "center")}</figure>
    <figure><span>( 02 )</span>{img("linen.jpg", "center")}</figure>
    <figure><span>( 03 )</span>{img("film-canisters.jpg", "center")}</figure>
    <figure><span>( 04 )</span>{img("grain-macro.jpg", "center")}</figure>
  </div>
''', "the mood", "05")

# 07 logo suite opener  (ref p7: texture strip)
page("logo-open", "ink", img("grain-macro.jpg", "center", "strip low"), "logo suite", "06")

# 08 main logo  (ref p8)
page("logo-main", "ivory", f'''
  <p class="under-title">the primary logo is a typographic wordmark built around the word latent in lowercase. the schwa — ə — replaces the "e": the most common vowel sound in human speech, and the one nobody notices. present everywhere, seen nowhere. this wordmark is the main identifier and should be used most often across the brand.</p>
  <div class="stage">{WM_INK}</div>
''', "main logo")

# 09 anatomy  (ref p9: dark, callouts)
page("logo-anatomy", "ink anatomy", f'''
  <div class="stage">{WM_IVORY}</div>
  <div class="callout c1"><i></i><span>display grotesk, extra-bold,<br>tracked to −4.5%</span></div>
  <div class="callout c2"><i></i><span>the schwa replaces the "e" —<br>cut from the same optical size,<br>a letter, not an icon</span></div>
  <div class="callout c3"><i></i><span>always lowercase.<br>never title case, never caps</span></div>
  <div class="callout c4"><i></i><span>no tagline is ever<br>locked to the wordmark</span></div>
''', "logo anatomy")

# 10 icon  (ref p10)
page("logo-icon", "ivory icon", f'''
  <p class="side-p">the icon is the schwa on its own. it is our symbol, our avatar, our signature and our sign-off — it closes every caption. minimum size 24 px on screen, 8 mm in print.</p>
  <div class="icon-box"><span class="k">( 01 )</span>{SY_INK}</div>
  <div class="icon-col">
    <div class="sq" style="background:#14141A"><span class="k" style="color:#F2EFE7">( 02 )</span>{SY_IVORY}</div>
    <div class="sq" style="background:#F2EFE7;box-shadow:inset 0 0 0 1px rgba(20,20,26,.15)"><span class="k">( 03 )</span>{SY_MARROW}</div>
    <div class="sq" style="background:#BB4A2E"><span class="k" style="color:#F2EFE7">( 04 )</span>{SY_INK}</div>
  </div>
''', "icon")

# 11 logo lockups  (ref p11: three colour columns, three lockups)
page("logo-lockups", "ivory lockups", f'''
  <p class="under-title">the logo lockups bring the wordmark, the icon and the supporting line into cohesive compositions. these variations allow the brand to adapt across different contexts, from signage and printed materials to digital platforms.</p>
  <div class="cols3">
    <div style="background:#14141A;color:#F2EFE7"><span class="k">( 01 )</span><div class="lk v"><img class="sy" src="logo/latent-symbol-ivory.svg">{WM_IVORY}<span class="tg">{TAG}</span></div></div>
    <div style="background:#BB4A2E;color:#F2EFE7"><span class="k">( 02 )</span><div class="lk h"><img class="sy" src="logo/latent-symbol-ivory.svg">{WM_IVORY}</div></div>
    <div style="background:#14141A;color:#F2EFE7"><span class="k">( 03 )</span><div class="lk v">{WM_IVORY}<span class="tg">studio · amman → worldwide</span></div></div>
  </div>
''', "logo lockups")

# 12 applications  (ref p12: four colour columns incl. pattern)
page("logo-applications", "ivory lockups", f'''
  <p class="under-title">the wordmark in its four colourways: ink on ivory, ivory on ink, marrow on ivory, ink on marrow. nothing else. on photography it sits only over a scrim or a quiet area of the frame.</p>
  <div class="cols4">
    <div style="background:#14141A"><span class="k" style="color:#F2EFE7">( 01 )</span>{WM_IVORY}</div>
    <div style="background:#BB4A2E"><span class="k" style="color:#F2EFE7">( 02 )</span><div class="lk v">{WM_INK}<span class="tg" style="color:#14141A">studio</span></div></div>
    <div class="paper"><span class="k">( 03 )</span>{WM_INK}</div>
    <div style="background:#14141A;position:relative;overflow:hidden"><span class="k" style="color:#F2EFE7">( 04 )</span><img class="water" src="logo/latent-symbol-ivory.svg">{WM_MARROW}</div>
  </div>
''', "applications")

# 13 logo on photo  (ref p13)
page("logo-photo", "photo-full", f'''
  {img("turning-woman.jpg", "right center", "bleed", "transform:scale(1.5);transform-origin:100% 50%")}
  <div class="dim-scrim"></div>
  <div class="stage">{WM_IVORY}</div>
''', chrome=False)

# 14 full lockup  (ref p14: icon + wordmark + tagline, light)
page("logo-lockup-full", "ivory", f'''
  <div class="stage full-lock">{SY_INK}{WM_INK}<span class="tag">{TAG}</span></div>
''', chrome=False)

# 15 full lockup, ink
page("logo-lockup-full-ink", "ink", f'''
  <div class="stage full-lock">{SY_MARROW}{WM_IVORY}<span class="tag">{TAG}</span></div>
''', chrome=False)

# 16 clear space & minimum size
page("logo-clearspace", "ivory clearspace", f'''
  <p class="side-p">clear space on all sides equals the height of the schwa's counter — the enclosed space inside the ə. nothing enters that zone. never stretch, rotate, outline, add a gradient or a shadow, recolour outside the system, or place on a busy photograph without a scrim.</p>
  <div class="cs"><div class="cs-box"><div class="g"></div>{WM_INK}<span class="x t">x</span><span class="x b">x</span><span class="x l">x</span><span class="x r">x</span></div><span class="k">x = height of the schwa counter</span></div>
  <div class="minsize">
    <span class="k">minimum size</span>
    <div class="ms-row"><img src="logo/latent-symbol-ink.svg" style="height:96px"><img src="logo/latent-symbol-ink.svg" style="height:48px"><img src="logo/latent-symbol-ink.svg" style="height:24px"><span class="k">24 px · 8 mm</span></div>
    <div class="ms-row"><img src="logo/latent-wordmark-ink.svg" style="height:56px"><img src="logo/latent-wordmark-ink.svg" style="height:28px"><img src="logo/latent-wordmark-ink.svg" style="height:16px"><span class="k">16 px · 6 mm</span></div>
  </div>
  <div class="misuse">
    <div><div class="mu"><img src="logo/latent-wordmark-ink.svg" style="transform:scaleX(1.5)"></div><span class="k">stretch</span></div>
    <div><div class="mu"><img src="logo/latent-wordmark-ink.svg" style="transform:rotate(-14deg)"></div><span class="k">rotate</span></div>
    <div><div class="mu"><span class="fake outline">latənt</span></div><span class="k">outline</span></div>
    <div><div class="mu"><span class="fake grad">latənt</span></div><span class="k">gradient</span></div>
    <div><div class="mu"><span class="fake" style="color:#2F6FB5">latənt</span></div><span class="k">recolour</span></div>
    <div><div class="mu"><span class="fake" style="text-transform:uppercase;letter-spacing:.02em">LATƏNT</span></div><span class="k">caps</span></div>
  </div>
''', "clear space & misuse")

# 17 colours & textures opener  (ref p17: light, abstract strip)
page("colour-open", "ivory", img("folded-paper.jpg", "center", "strip low"), "colours & textures", "07")

# 18 colour palette  (ref p18: 3x2 blocks, name + HEX/RGB/CMYK)
def blk(name, hexv, rgb, cmyk, bg, fg, extra=""):
    return f'<div class="blk" style="background:{bg};color:{fg};{extra}"><b>{name}</b><span>hex {hexv}<br>rgb {rgb}<br>cmyk {cmyk}</span></div>'
page("colour-palette", "ivory palette", f'''
  <div class="grid6">
    {blk("ink","#14141A","20 · 20 · 26","78 · 72 · 55 · 78","#14141A","#F2EFE7")}
    {blk("ivory","#F2EFE7","242 · 239 · 231","4 · 4 · 8 · 0","#F2EFE7","#14141A","box-shadow:inset 0 0 0 1px rgba(20,20,26,.12)")}
    {blk("marrow","#BB4A2E","187 · 74 · 46","18 · 79 · 88 · 8","#BB4A2E","#F2EFE7")}
    {blk("charcoal","#2C2C31","44 · 44 · 49","72 · 66 · 58 · 62","#2C2C31","#F2EFE7")}
    {blk("bone","#EDE6D6","237 · 230 · 214","6 · 7 · 15 · 0","#EDE6D6","#14141A")}
    {blk("oat","#D7C7A9","215 · 199 · 169","15 · 18 · 34 · 0","#D7C7A9","#14141A")}
  </div>
''', "colour palette")

# 19 colour palette, pairings + roles  (ref p19: same grid with dots + descriptions)
def blk2(name, dots, text, bg, fg, extra=""):
    d = "".join(f'<i style="background:{c}"></i>' for c in dots)
    return f'<div class="blk2" style="background:{bg};color:{fg};{extra}"><div class="row"><b>{name}</b><span class="dots">{d}</span></div><p>{text}</p></div>'
page("colour-pairings", "ivory palette", f'''
  <div class="grid6">
    {blk2("ink",["#F2EFE7","#BB4A2E","#2C2C31"],"the ground. ninety percent of everything: wordmark, symbol, body text, dark surfaces, the studio void behind every product.","#14141A","#F2EFE7")}
    {blk2("ivory",["#14141A","#BB4A2E","#D7C7A9"],"the surface. paper, packaging, screens, light layouts — where the brand speaks about itself.","#F2EFE7","#14141A","box-shadow:inset 0 0 0 1px rgba(20,20,26,.12)")}
    {blk2("marrow",["#F2EFE7","#14141A","#14141A"],"editorial accent only. a punctuation mark, not a fill. one element per layout; a single character set in marrow on a page is the entire campaign.","#BB4A2E","#F2EFE7")}
    {blk2("charcoal",["#F2EFE7","#14141A","#BB4A2E"],"the lifted black inside photographs. blacks are soft, never crushed; this is where they settle.","#2C2C31","#F2EFE7")}
    {blk2("bone",["#14141A","#BB4A2E","#D7C7A9"],"skin and paper in light. warm, never orange. highlights roll off here and never clip.","#EDE6D6","#14141A")}
    {blk2("oat",["#14141A","#BB4A2E","#F2EFE7"],"the warm mid-tone of generated imagery: linen, card, stone. image tones, never brand fills.","#D7C7A9","#14141A")}
  </div>
''', "colour palette")

# 20 textures  (ref p20: four vertical strips, labels above)
page("colour-textures", "ivory textures", f'''
  <div class="tex">
    <div style="background:url(images/grain-macro.jpg) center/cover"><span class="k">( 01 ) film grain</span></div>
    <div style="background:#BB4A2E"><span class="k">( 02 ) marrow</span></div>
    <div style="background:url(images/ivory-paper.jpg) center/cover"><span class="k">( 03 ) ivory paper</span></div>
    <div style="background:#14141A"><span class="k">( 04 ) ivory on ink</span>{WM_IVORY}</div>
  </div>
''', "textures")

# 21 typography opener  (ref p21: dark, strip)
page("type-open", "ink", img("hand-open.jpg", "center", "strip low"), "typography", "09")

# 22 header font  (ref p22)
page("type-header", "ink typeface", f'''
  <div class="sample">no camera.<br>no studio.<br>only direction.</div>
  <div class="specs">
    <div><span class="k">name</span><b>inter display</b><i>alt. söhne kräftig · gt america · pp neue machina</i></div>
    <div><span class="k">weights</span><b>extrabold</b><i>headlines only</i></div>
    <div><span class="k">setting</span><b>−5% tracking · 0.9 leading</b><i>always lowercase</i></div>
  </div>
''', "header font")

# 23 body font  (ref p23)
page("type-body", "ink typeface", f'''
  <p class="body-sample">latent studio is an ai-native visual studio built around one standard: the frame has to be believed. we direct before we prompt, we lock the product from reference, we keep the pores and the grain, and we discard the ninety percent that is merely good.</p>
  <div class="specs">
    <div><span class="k">name</span><b>inter</b><i>arabic: ibm plex sans arabic</i></div>
    <div><span class="k">weights</span><b>regular · medium · semibold</b><i>body · labels · emphasis</i></div>
    <div><span class="k">setting</span><b>−1% tracking · 155% line height</b><i>lowercase, clipped, declarative</i></div>
  </div>
''', "body font")

# 24 type in use  (ref p24: designed layout on photo / spec rows)
page("type-inuse", "ink annot", f'''
  <div class="hero">{img("story-face.jpg", "center 20%")}<div class="hero-t">
    <img class="sy" src="logo/latent-symbol-ivory.svg">
    <h2>no camera.<br>no studio.<br>only direction.</h2>
    <p>latent studio is an ai-native visual studio built around one standard: the frame has to be believed. we direct before we prompt, and we keep the pores and the grain.</p>
    <div class="wmrow">{WM_IVORY}</div></div></div>
  <div class="specs-r">
    <div><span class="k">header</span><b>inter display extrabold</b><i>→ −5% tracking, 0.9 leading, lowercase</i></div>
    <div><span class="k">body</span><b>inter regular</b><i>→ −1% tracking, 155% line height</i></div>
    <div><span class="k">labels</span><b>inter medium · caps</b><i>→ +16% tracking, 12 px</i></div>
  </div>
''', chrome=True, title=None)

# 25 mockups opener  (ref p25)
page("mock-open", "ink", img("neon-room.jpg", "center", "strip low"), "mockups", "10")

# 26 phones triptych  (ref p26: three phones on brand colour)
page("mock-phones", "marrow phones", f'''
  <div class="ph"><div class="scr"><img src="images/cover-figure.jpg" style="object-position:center 15%;opacity:.55"><div class="app"><img class="sy" src="logo/latent-symbol-ivory.svg">{WM_IVORY}<span class="tg">{TAG}</span></div></div></div>
  <div class="ph"><div class="scr"><img src="images/film-canisters.jpg" style="object-position:center 40%"><div class="story-b">{WM_INK}</div></div></div>
  <div class="ph"><div class="scr"><img src="images/story-face.jpg" style="object-position:center 20%"><div class="badge">ə</div></div></div>
''', chrome=False)

# 27 embossed  (ref p27)
page("mock-embossed", "photo-full", img("embossed.jpg", "center", "bleed"), chrome=False)
# 28 poster  (ref p28)
page("mock-poster", "photo-full", img("poster-face.jpg", "center", "bleed"), chrome=False)
# 29 booklet in hand  (ref p29)
page("mock-booklet", "photo-full", img("booklet-chair.jpg", "center", "bleed"), chrome=False)
# 30 card on stone  (ref p32: tray card)
page("mock-card", "photo-full", img("card-stone.jpg", "center", "bleed"), chrome=False)
# 31 pylon sign board
page("mock-pylon", "photo-full", img("pylon-ink.jpg", "center", "bleed"), chrome=False)
# 32 business cards
page("mock-cards", "photo-full", img("cards-ink.jpg", "center", "bleed"), chrome=False)
# 33 wordmark over two-panel photo  (ref p33)
page("mock-twopanel", "photo-full twopanel", f'''
  <div class="pane">{img("story-face.jpg", "center 20%")}</div>
  <div class="pane">{img("hands-pressed.jpg", "center")}</div>
  <div class="dim-scrim"></div>
  <div class="stage">{WM_IVORY}</div>
''', chrome=False)
# 32 tape  (ref p34)
page("mock-tape", "photo-full", img("tape.jpg", "center", "bleed"), chrome=False)

# 33 thank you  (ref p35)
page("thanks", "ink thanks", f'''
  <div class="thanks-c">
    <span class="sy-s">ə</span>
    <div class="ty">thank you</div>
    <div class="rule"></div>
    <div class="by">brought to you by latent studio · amman → worldwide</div>
    <div class="url">latent-studio-ai.com · @latentstudio.jo</div>
  </div>
''', chrome=False)

# ------------------------------------------------------------------ CSS
CSS = r'''
@page { size: 1920px 1080px; margin: 0; }
* { box-sizing: border-box; }
html, body { margin:0; padding:0; background:#888; }
body { font-family:"Inter", system-ui, sans-serif; -webkit-font-smoothing:antialiased; }
.page { position:relative; width:1920px; height:1080px; overflow:hidden; page-break-after:always; break-after:page;
        -webkit-print-color-adjust:exact; print-color-adjust:exact; margin:0 auto; }
.page:last-child { page-break-after:auto; break-after:auto; }
.screen .page { margin:24px auto; }
@media print { .screen .page { margin:0 auto; } html, body { background:#14141A; } }
.ink { background:#14141A; color:#F2EFE7; }
.ivory { background:#F2EFE7; color:#14141A; }
.marrow { background:#BB4A2E; color:#F2EFE7; }
.photo-full { background:#14141A; color:#F2EFE7; }
.grain { position:absolute; inset:0; background:url(src/grain.png) repeat; background-size:384px 384px; opacity:.13; mix-blend-mode:overlay; pointer-events:none; z-index:60; }
.ink .grain, .photo-full .grain, .marrow .grain { opacity:.2; }
img { display:block; }
p { margin:0; }

/* chrome */
.lab { position:absolute; top:50px; font-size:12px; font-weight:500; letter-spacing:.16em; text-transform:uppercase; opacity:.85; z-index:20; }
.lab.tl { left:56px; } .lab.tr { right:56px; }
.ttl { position:absolute; top:40px; left:0; right:0; text-align:center; z-index:20; }
.tn { font-family:"IBM Plex Mono", monospace; font-size:11px; letter-spacing:.12em; opacity:.7; }
.tt { font-family:"Inter Display", sans-serif; font-weight:500; font-size:40px; letter-spacing:-.02em; line-height:1.15; margin-top:2px; }
.ts { font-size:12px; font-weight:500; letter-spacing:.16em; text-transform:uppercase; margin-top:12px; }
.pn { position:absolute; bottom:26px; left:0; right:0; text-align:center; font-family:"IBM Plex Mono", monospace; font-size:11px; opacity:.7; z-index:20; }
.photo-full .pn { color:#F2EFE7; text-shadow:0 0 6px rgba(0,0,0,.5); }
.k { font-family:"IBM Plex Mono", monospace; font-size:10.5px; letter-spacing:.08em; opacity:.75; }
.under-title { position:absolute; top:120px; left:50%; transform:translateX(-50%); width:760px; text-align:center; font-size:13.5px; line-height:1.6; opacity:.85; }
.side-p { position:absolute; top:150px; left:56px; width:300px; font-size:13px; line-height:1.6; opacity:.85; }

/* strips */
.strip { position:absolute; left:56px; right:56px; top:150px; height:420px; width:auto; object-fit:cover; }
.strip.low { top:300px; height:700px; }
.bleed { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }

/* cover */
.cover-h { position:absolute; top:48px; left:40px; right:40px; margin:0; font-family:"Inter Display", sans-serif; font-weight:800; font-size:372px; letter-spacing:-.06em; line-height:1; text-align:center; white-space:nowrap; }
.cover-photo { position:absolute; left:50%; top:330px; transform:translateX(-50%); width:300px; height:340px; object-fit:cover; }
.cover-p { position:absolute; bottom:120px; left:50%; transform:translateX(-50%); width:620px; text-align:center; font-size:12.5px; line-height:1.6; opacity:.85; }

/* contents */
.toc { list-style:none; margin:0; padding:0; position:absolute; left:56px; right:56px; top:612px; }
.toc li { display:flex; align-items:baseline; font-size:26px; letter-spacing:-.01em; font-weight:400; margin-bottom:24px; }
.toc li i { flex:1; border-bottom:2px dotted rgba(242,239,231,.45); margin:0 18px 6px; }
.ivory .toc li i { border-color:rgba(20,20,26,.45); }
.toc li b { font-weight:400; font-family:"IBM Plex Mono", monospace; font-size:20px; }

/* split (story) */
.split .half { position:absolute; top:0; bottom:0; width:50%; }
.split .half.photo { left:0; } .split .half.photo img { width:100%; height:100%; object-fit:cover; }
.split .half.photo:after { content:""; position:absolute; left:0; right:0; top:0; height:200px; background:linear-gradient(to bottom, rgba(20,20,26,.85), rgba(20,20,26,0)); }
.split .half.text { right:0; background:#14141A; display:flex; flex-direction:column; justify-content:center; padding:0 220px 0 190px; gap:18px; }
.split .half.text p { font-size:13.5px; line-height:1.65; opacity:.9; }

/* tiny-photo pages (mission / vision) */
.tiny { position:absolute; left:50%; top:400px; transform:translateX(-50%); width:120px; height:160px; object-fit:cover; }
.tiny-p { position:absolute; top:640px; left:50%; transform:translateX(-50%); width:560px; text-align:center; font-size:13.5px; line-height:1.65; opacity:.85; }

/* mood */
.mood4 { position:absolute; left:0; right:0; top:300px; bottom:0; display:grid; grid-template-columns:repeat(4,1fr); gap:6px; }
.mood4 figure { margin:0; position:relative; overflow:hidden; }
.mood4 figure img { width:100%; height:100%; object-fit:cover; }
.mood4 figure span { position:absolute; top:-22px; left:50%; transform:translateX(-50%); font-family:"IBM Plex Mono", monospace; font-size:10px; opacity:.7; }

/* logo pages */
.stage { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:5; }
.stage .wm { width:560px; }
.anatomy .stage .wm { width:1040px; }
.callout { position:absolute; z-index:6; font-size:11px; line-height:1.5; opacity:.85; }
.callout i { position:absolute; background:rgba(242,239,231,.6); }
.c1 { left:300px; top:230px; width:220px; } .c1 i { left:0; top:44px; width:1px; height:160px; }
.c2 { left:1000px; top:190px; width:260px; } .c2 i { left:0; top:58px; width:1px; height:220px; }
.c3 { left:420px; top:760px; width:220px; } .c3 i { left:0; top:-80px; width:1px; height:70px; }
.c4 { left:1260px; top:800px; width:220px; } .c4 i { left:0; top:-120px; width:1px; height:110px; }
.icon-box { position:absolute; left:50%; top:150px; transform:translateX(-50%); width:840px; height:820px; border:1px solid rgba(20,20,26,.35); display:flex; align-items:center; justify-content:center; }
.icon-box .sy { width:220px; }
.icon-box .k, .sq .k { position:absolute; top:10px; left:12px; }
.icon-col { position:absolute; right:56px; top:150px; display:flex; flex-direction:column; gap:36px; }
.sq { width:250px; height:250px; position:relative; display:flex; align-items:center; justify-content:center; }
.sq .sy { width:70px; }
.cols3, .cols4 { position:absolute; left:0; right:0; top:280px; bottom:0; display:grid; }
.cols3 { grid-template-columns:repeat(3,1fr); } .cols4 { grid-template-columns:repeat(4,1fr); }
.cols3 > div, .cols4 > div { position:relative; display:flex; align-items:center; justify-content:center; }
.cols3 .k, .cols4 .k { position:absolute; top:14px; left:50%; transform:translateX(-50%); }
.cols4 .wm { width:280px; }
.lk { display:flex; align-items:center; justify-content:center; gap:22px; }
.lk.v { flex-direction:column; gap:26px; }
.lk .sy { width:64px; } .lk .wm { width:300px; }
.lk .tg { font-size:10.5px; letter-spacing:.2em; text-transform:uppercase; opacity:.85; }
.cols4 .paper { background:url(images/ivory-paper.jpg) center/cover; }
.water { position:absolute; width:520px; left:50%; top:50%; transform:translate(-50%,-50%); opacity:.12; }
.dim-scrim { position:absolute; inset:0; background:rgba(20,20,26,.38); z-index:1; }
.photo-full .stage .wm { width:900px; }
.full-lock { flex-direction:column; gap:36px; }
.full-lock .sy { width:110px; } .full-lock .wm { width:560px; }
.full-lock .tag { font-size:13px; letter-spacing:.2em; text-transform:uppercase; opacity:.85; margin-top:6px; }

/* clear space + misuse */
.cs { position:absolute; left:440px; top:150px; width:640px; display:flex; flex-direction:column; align-items:center; gap:18px; }
.cs-box { position:relative; padding:56px; }
.cs-box .wm { width:440px; position:relative; z-index:2; }
.cs-box .g { position:absolute; inset:0; border:1px dashed rgba(20,20,26,.4); }
.cs-box .g:before, .cs-box .g:after { content:""; position:absolute; border:1px dashed rgba(20,20,26,.4); }
.cs-box .g:before { left:56px; right:56px; top:0; bottom:0; border-top:0; border-bottom:0; }
.cs-box .g:after { top:56px; bottom:56px; left:0; right:0; border-left:0; border-right:0; }
.cs .x { position:absolute; font-family:"IBM Plex Mono", monospace; font-size:11px; opacity:.6; }
.cs .x.t { top:18px; left:50%; } .cs .x.b { bottom:18px; left:50%; } .cs .x.l { left:22px; top:50%; } .cs .x.r { right:22px; top:50%; }
.minsize { position:absolute; left:440px; top:560px; width:640px; display:flex; flex-direction:column; gap:26px; }
.ms-row { display:flex; align-items:flex-end; gap:40px; } .ms-row .k { margin-left:8px; padding-bottom:4px; }
.misuse { position:absolute; left:1160px; right:56px; top:150px; display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
.misuse .k { display:block; margin-top:8px; }
.misuse .k:before { content:"✕ "; color:#BB4A2E; }
.mu { height:150px; background:#E8E4DA; display:flex; align-items:center; justify-content:center; overflow:hidden; }
.mu img { width:150px; }
.fake { font-family:"Inter Display", sans-serif; font-weight:800; font-size:50px; letter-spacing:-.045em; color:#14141A; }
.fake.outline { color:transparent; -webkit-text-stroke:1.5px #14141A; }
.fake.grad { background:linear-gradient(90deg,#14141A,#BB4A2E); -webkit-background-clip:text; background-clip:text; color:transparent; }

/* colour */
.grid6 { position:absolute; left:56px; right:56px; top:130px; bottom:60px; display:grid; grid-template-columns:repeat(3,1fr); grid-template-rows:1fr 1fr; }
.blk { padding:34px 36px; display:flex; flex-direction:column; }
.blk b { font-family:"Inter Display", sans-serif; font-weight:500; font-size:30px; letter-spacing:-.02em; margin-bottom:auto; }
.blk span { font-family:"IBM Plex Mono", monospace; font-size:11px; letter-spacing:.06em; line-height:1.9; opacity:.85; }
.blk2 { padding:34px 36px; display:flex; flex-direction:column; }
.blk2 .row { display:flex; align-items:center; justify-content:space-between; margin-bottom:auto; }
.blk2 b { font-family:"Inter Display", sans-serif; font-weight:500; font-size:30px; letter-spacing:-.02em; }
.blk2 .dots { display:flex; gap:8px; } .blk2 .dots i { width:26px; height:26px; border-radius:50%; display:block; box-shadow:inset 0 0 0 1px rgba(0,0,0,.08); }
.blk2 p { font-size:12px; line-height:1.55; opacity:.85; max-width:420px; font-style:italic; }
.tex { position:absolute; left:0; right:0; top:200px; bottom:0; display:grid; grid-template-columns:repeat(4,1fr); }
.tex > div { position:relative; display:flex; align-items:center; justify-content:center; }
.tex .k { position:absolute; top:-26px; left:50%; transform:translateX(-50%); white-space:nowrap; color:#14141A !important; }
.tex .wm { width:240px; }

/* typography */
.sample { position:absolute; left:56px; right:56px; top:200px; text-align:center; font-family:"Inter Display", sans-serif; font-weight:800; font-size:150px; letter-spacing:-.055em; line-height:.92; }
.body-sample { position:absolute; left:50%; transform:translateX(-50%); top:150px; width:760px; text-align:center; font-size:14px; line-height:1.6; opacity:.9; }
.specs { position:absolute; left:50%; transform:translateX(-50%); bottom:110px; display:flex; gap:120px; text-align:center; }
.specs .k { display:block; margin-bottom:10px; }
.specs b { display:block; font-weight:500; font-size:14px; }
.specs i { display:block; font-style:normal; font-size:11.5px; opacity:.6; margin-top:4px; }
.annot .hero { position:absolute; left:0; top:0; bottom:0; width:50%; overflow:hidden; }
.annot .hero > img { width:100%; height:100%; object-fit:cover; opacity:.9; }
.annot .hero:after { content:""; position:absolute; inset:0; background:linear-gradient(to top, rgba(20,20,26,.92), rgba(20,20,26,.1) 60%); }
.annot .hero-t { position:absolute; left:64px; right:64px; bottom:80px; z-index:3; }
.annot .hero-t .sy { width:40px; margin-bottom:28px; }
.annot .wmrow .wm { width:140px; margin-top:34px; }
.annot h2 { margin:0 0 18px; font-family:"Inter Display", sans-serif; font-weight:800; font-size:80px; letter-spacing:-.05em; line-height:.9; }
.annot .hero-t p { font-size:13.5px; line-height:1.6; max-width:440px; opacity:.85; }
.specs-r { position:absolute; left:50%; right:0; top:0; bottom:0; padding:150px 96px 0 96px; display:flex; flex-direction:column; justify-content:center; gap:34px; }
.specs-r .k { display:block; margin-bottom:6px; }
.specs-r b { display:block; font-weight:500; font-size:15px; }
.specs-r i { display:block; font-style:normal; font-size:12px; opacity:.6; margin-top:4px; }

/* phones */
.phones .ph { position:absolute; top:120px; width:390px; height:840px; background:#232329; border-radius:52px; padding:12px; box-shadow:0 40px 80px rgba(0,0,0,.45); }
.phones .ph:nth-child(1) { left:330px; } .phones .ph:nth-child(2) { left:765px; } .phones .ph:nth-child(3) { left:1200px; }
.scr { width:100%; height:100%; border-radius:42px; overflow:hidden; position:relative; background:#14141A; }
.scr > img { width:100%; height:100%; object-fit:cover; }
.app { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:26px; }
.app .sy { width:44px; } .app .wm { width:200px; }
.app .tg { font-size:9px; letter-spacing:.2em; text-transform:uppercase; color:#F2EFE7; opacity:.85; }
.story-b { position:absolute; left:0; right:0; bottom:60px; display:flex; justify-content:center; } .story-b .wm { width:150px; }
.badge { position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); width:120px; height:120px; border-radius:50%; border:2px solid #F2EFE7; color:#F2EFE7; display:flex; align-items:center; justify-content:center; font-family:"Inter Display", sans-serif; font-weight:800; font-size:64px; }

/* two-panel */
.twopanel .pane { position:absolute; top:0; bottom:0; width:50%; overflow:hidden; }
.twopanel .pane:nth-child(1) { left:0; } .twopanel .pane:nth-child(2) { right:0; }
.twopanel .pane img { width:100%; height:100%; object-fit:cover; }

/* thanks */
.thanks-c { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px; text-align:center; }
.sy-s { font-family:"Inter Display", sans-serif; font-weight:800; font-size:44px; margin-bottom:180px; }
.ty { font-size:12px; letter-spacing:.2em; text-transform:uppercase; }
.rule { width:160px; height:1px; background:rgba(242,239,231,.5); }
.by { font-size:12px; letter-spacing:.14em; text-transform:uppercase; opacity:.85; }
.url { position:absolute; bottom:64px; font-family:"IBM Plex Mono", monospace; font-size:10.5px; letter-spacing:.08em; opacity:.6; }
'''

def build_html():
    body = "\n".join(p[1] for p in pages)
    doc = f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>latənt — brand book</title>
<style>{CSS}</style>
<script>
  addEventListener('DOMContentLoaded', () => {{
    const q = new URLSearchParams(location.search).get('page');
    if (q) {{ document.querySelectorAll('.page').forEach(p => {{ if (p.id !== 'p'+q) p.remove(); }}); document.body.style.background='transparent'; }}
    else document.body.classList.add('screen');
  }});
</script>
</head><body>
{body}
</body></html>'''
    out = os.path.join(ROOT, "book.html")
    with open(out, "w") as f:
        f.write(doc)
    return out

def render(out, only=None):
    os.makedirs(PAGES_DIR, exist_ok=True)
    if only is None:
        for f in os.listdir(PAGES_DIR):
            if f.endswith(".png"):
                os.remove(os.path.join(PAGES_DIR, f))
    url = "file://" + out
    for i, (name, _) in enumerate(pages, 1):
        if only and i not in only:
            continue
        png = os.path.join(PAGES_DIR, f"{i:02d}-{name}.png")
        subprocess.run([CHROME, "--no-sandbox", "--disable-gpu", "--hide-scrollbars",
                        "--window-size=1920,1080", "--force-device-scale-factor=2",
                        f"--screenshot={png}", f"{url}?page={i}"], check=True,
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print("png", png)
    if only:
        return
    pdf = os.path.join(ROOT, "latent-brand-book.pdf")
    subprocess.run([CHROME, "--no-sandbox", "--disable-gpu", "--no-pdf-header-footer",
                    f"--print-to-pdf={pdf}", url], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print("pdf", pdf)

if __name__ == "__main__":
    out = build_html()
    print("html", out, "pages", len(pages))
    if "--html" not in sys.argv:
        only = None
        for a in sys.argv[1:]:
            if a.startswith("--only="):
                only = [int(x) for x in a[7:].split(",")]
        render(out, only)
