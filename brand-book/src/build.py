#!/usr/bin/env python3
"""Builds the Latent Studio brand book.

Panel system reverse-engineered frame by frame from the three @studio.sevd reels
(Feelgood Lab, Bastu, Seido): every page carries the brand label top-left, a small
"( 01 )" numeral above a centred section title, the book label top-right and a
centred page number. Content pages follow their archetypes (cover, contents,
chapter opener, split, vision, moodboard, main logo, anatomy, icon, lockups,
logo-on-photo, palette grids, typeface, type annotations, then the mockup run).

Writes ../book.html, then renders ../pages/NN-name.png (2x) and ../latent-brand-book.pdf.
Run: python3 build.py          (build + render)
     python3 build.py --html   (build only)
"""
import os, subprocess, sys, html as H

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES_DIR = os.path.join(ROOT, "pages")
CHROME = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell"

pages = []

def page(name, cls, body, title=None, num=None, brand="LATENT STUDIO", book="BRAND BOOK", chrome=True):
    """title: centred section title. num: small '( 01 )' above it (None = small-caps sub-title)."""
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

# ------------------------------------------------------------------ 01 cover
page("cover", "ink cover", f'''
  <h1 class="cover-h">brand book</h1>
  {img("perfume-honey.jpg", "center 45%", "cover-photo")}
  <p class="cover-p">the latənt brand book defines the foundation of the studio. it ensures every element — from the mark to colour to typography — works together as one cohesive system across every touchpoint.</p>
''')

# ------------------------------------------------------------------ 02 contents
page("contents", "ivory", f'''
  {img("rooftop.jpg", "center 55%", "strip")}
  <ol class="toc">
    <li><span>about</span><i></i><b>03</b></li>
    <li><span>logo</span><i></i><b>08</b></li>
    <li><span>colour</span><i></i><b>16</b></li>
    <li><span>typography</span><i></i><b>21</b></li>
    <li><span>mockups</span><i></i><b>27</b></li>
  </ol>
''', "contents", "01")

# ------------------------------------------------------------------ 03 the studio (opener)
page("about-open", "ink", img("ink-vessel.jpg", "center 60%", "strip low"), "the studio", "02")

# ------------------------------------------------------------------ 04 about (split)
page("about", "ink split", f'''
  <div class="half photo">{img("hands-cup.jpg", "center")}</div>
  <div class="half text">
    <p>latent studio is an ai-native visual studio based in amman, working with brands anywhere. we produce campaign-grade brand imagery — the kind that used to require a photographer, a stylist, a location, a retoucher and six weeks — and we produce it in days.</p>
    <p>we sell ongoing visual production, on retainer. not one-off files: a permanent creative department that sits outside your payroll.</p>
    <p>we are not a filter, a prompt service or a cheap alternative to a photographer. we are the studio you hire when the image has to carry the brand.</p>
  </div>
''', "about", "03")

# ------------------------------------------------------------------ 05 vision
page("vision", "ivory vision", f'''
  {img("portrait.jpg", "20% 20%", "tiny")}
  <p class="vision-p">every brand already contains its best image. it just hasn't been rendered yet. we render it.<br><br>ai is the tool. taste is the craft. we say "ai" out loud, we never apologise for it, and we never hide it.</p>
''', "vision", "04")

# ------------------------------------------------------------------ 06 the mood (4 columns)
page("mood", "ivory mood", f'''
  <div class="mood4">
    <figure><span>( 01 )</span>{img("curtain.jpg", "center")}</figure>
    <figure><span>( 02 )</span>{img("water.jpg", "center")}</figure>
    <figure><span>( 03 )</span>{img("arch.jpg", "center")}</figure>
    <figure><span>( 04 )</span>{img("portrait-m.jpg", "20% center")}</figure>
  </div>
''', "the mood", "05")

# ------------------------------------------------------------------ 07 concept / principles
page("principles", "ivory concept", f'''
  <div class="c-left">{img("ivory-paper.jpg", "center")}{img("cards-topdown.jpg", "center 40%")}</div>
  <div class="c-mid">
    <p>three principles. no exceptions. every asset that leaves the studio is checked against all three, and any asset that fails one does not ship.</p>
    <p><b>01 — restraint · الاختزال</b><br>we remove until only the essential remains. one subject per frame, one idea per post, one accent colour per campaign.</p>
    <p><b>02 — story before product · القصة قبل المنتج</b><br>every frame earns attention before it asks for it. the product is never the first thing the eye lands on.</p>
    <p><b>03 — craft in every frame · الحرفة بكل لقطة</b><br>generation is the first ten percent. direction, selection, colour, grain, crop and the ruthless discard of the merely good — that is the work.</p>
  </div>
  <div class="c-right">{img("coffee.jpg", "30% center")}</div>
''', "the principles", "06")

# ------------------------------------------------------------------ 08 logo suite (opener)
page("logo-open", "ivory", img("curtain.jpg", "center 40%", "strip low"), "logo suite", "07")

# ------------------------------------------------------------------ 09 main logo
page("logo-main", "ivory center", f'''
  <p class="under-title">the primary logo is a typographic wordmark built around the word latent in lowercase. the schwa — ə — replaces the "e": the most common vowel sound in human speech, and the one nobody notices. present everywhere, seen nowhere. this wordmark is the main identifier and should be used most often across the brand.</p>
  <div class="stage">{WM_INK}</div>
''', "main logo")

# ------------------------------------------------------------------ 10 anatomy (ink, callouts)
page("logo-anatomy", "ink anatomy", f'''
  <div class="stage">{WM_IVORY}</div>
  <div class="callout c1"><i></i><span>display grotesk, extra-bold,<br>tracked to −4.5%</span></div>
  <div class="callout c2"><i></i><span>the schwa replaces the "e" —<br>cut from the same optical size,<br>a letter, not an icon</span></div>
  <div class="callout c3"><i></i><span>always lowercase.<br>never title case, never caps</span></div>
  <div class="callout c4"><i></i><span>no tagline is ever<br>locked to the wordmark</span></div>
''', "logo anatomy")

# ------------------------------------------------------------------ 11 icon
page("logo-icon", "ivory icon", f'''
  <p class="side-p">the icon is the schwa on its own. it is our symbol, our avatar, our signature and our sign-off — it closes every caption. minimum size 24 px on screen, 8 mm in print.</p>
  <div class="icon-box"><span class="k">( 01 )</span>{SY_INK}</div>
  <div class="icon-col">
    <div class="sq" style="background:#14141A"><span class="k" style="color:#F2EFE7">( 02 )</span>{SY_IVORY}</div>
    <div class="sq" style="background:#F2EFE7;box-shadow:inset 0 0 0 1px rgba(20,20,26,.15)"><span class="k">( 03 )</span>{SY_MARROW}</div>
    <div class="sq" style="background:#BB4A2E"><span class="k" style="color:#F2EFE7">( 04 )</span>{SY_INK}</div>
  </div>
''', "icon")

# ------------------------------------------------------------------ 12 logo lockups (colour columns)
page("logo-lockups", "ivory lockups", f'''
  <p class="under-title">the logo colourways bring the wordmark and the icon into the three-colour system. four colourways, nothing else: ink on ivory, ivory on ink, marrow on ivory, ink on marrow.</p>
  <div class="cols4">
    <div style="background:#F2EFE7;box-shadow:inset 0 0 0 1px rgba(20,20,26,.1)"><span class="k">( 01 )</span>{WM_INK}</div>
    <div style="background:#14141A"><span class="k" style="color:#F2EFE7">( 02 )</span>{WM_IVORY}</div>
    <div style="background:#F2EFE7;box-shadow:inset 0 0 0 1px rgba(20,20,26,.1)"><span class="k">( 03 )</span>{WM_MARROW}</div>
    <div style="background:#BB4A2E"><span class="k" style="color:#F2EFE7">( 04 )</span>{WM_INK}</div>
  </div>
''', "logo lockups")

# ------------------------------------------------------------------ 13 logo on photo
page("logo-photo", "photo-full", f'''
  {img("portrait.jpg", "left 30%", "bleed")}
  <div class="dim-scrim"></div>
  <div class="stage">{WM_IVORY}</div>
''', chrome=False)

# ------------------------------------------------------------------ 14 full lockup + tagline
page("logo-lockup-full", "ivory center", f'''
  <div class="stage full-lock">{SY_INK}{WM_INK}<span class="tag">no camera. no studio. only direction.</span></div>
''', "full lockup")

# ------------------------------------------------------------------ 15 clear space + misuse
page("logo-clearspace", "ivory clearspace", f'''
  <p class="side-p">clear space on all sides equals the height of the schwa's counter — the enclosed space inside the ə. nothing enters that zone. the wordmark is never stretched, rotated, outlined, given a gradient or a shadow, recoloured outside the system, or placed on a busy photograph without a scrim.</p>
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

# ------------------------------------------------------------------ 16 colour (opener)
page("colour-open", "ink", img("coffee.jpg", "30% center", "strip low"), "colour", "08")

# ------------------------------------------------------------------ 17 colour palette (3 columns, photo + block)
page("colour-palette", "ivory palette3", f'''
  <div class="p3">
    <div><figure>{img("water.jpg", "center")}</figure><div class="blk" style="background:#14141A;color:#F2EFE7"><b>ink</b><span>hex #14141A</span><span>cmyk 78 · 72 · 55 · 78</span><span>rgb 20 · 20 · 26</span></div></div>
    <div><figure>{img("ivory-paper.jpg", "center")}</figure><div class="blk" style="background:#F2EFE7;color:#14141A;box-shadow:inset 0 0 0 1px rgba(20,20,26,.12)"><b>ivory</b><span>hex #F2EFE7</span><span>cmyk 4 · 4 · 8 · 0</span><span>rgb 242 · 239 · 231</span></div></div>
    <div><figure>{img("arch.jpg", "center")}</figure><div class="blk" style="background:#BB4A2E;color:#F2EFE7"><b>marrow</b><span>hex #BB4A2E</span><span>cmyk 18 · 79 · 88 · 8</span><span>rgb 187 · 74 · 46</span></div></div>
  </div>
''', "colour palette")

# ------------------------------------------------------------------ 18 colour ratio / the marrow rule (grid)
page("colour-ratio", "ivory ratio", f'''
  <p class="under-title">the system is three colours; there is no fourth. working ratio 90 / 9 / 1: ninety percent ink or ivory, nine percent the other, one percent marrow. marrow is a punctuation mark, not a fill — one element per layout. a single character set in marrow on a page is the entire campaign.</p>
  <div class="ratio-bar">
    <div style="flex:90;background:#14141A;color:#F2EFE7"><b>90</b><span>ink · the ground</span></div>
    <div style="flex:9;background:#F2EFE7;color:#14141A;box-shadow:inset 0 0 0 1px rgba(20,20,26,.15)"><b>9</b><span>ivory</span></div>
    <div style="flex:2.2;background:#BB4A2E;color:#F2EFE7"><b>1</b></div>
  </div>
''', "colour ratio")

# ------------------------------------------------------------------ 19 photographic register (photos + chips)
page("colour-register", "ivory register", f'''
  <div class="reg">
    <figure>{img("ivory-paper.jpg", "center")}<span class="k">cream · bone</span><div class="chips"><i style="background:#E9E1D2"></i><i style="background:#EDE6D6"></i><i style="background:#D7C7A9"></i></div></figure>
    <figure>{img("ink-vessel.jpg", "center 60%")}<span class="k" style="color:#F2EFE7">charcoal · camel</span><div class="chips"><i style="background:#2C2C31"></i><i style="background:#C2A27E"></i><i style="background:#8A6E4E"></i></div></figure>
    <figure>{img("coffee.jpg", "30% center")}<span class="k" style="color:#F2EFE7">deep green · oat</span><div class="chips"><i style="background:#1F3A2E"></i><i style="background:#D7C7A9"></i><i style="background:#14141A"></i></div></figure>
  </div>
  <p class="foot-p">generated imagery lives in a warm, desaturated register. these are image tones, not brand colours: skin is warm, never orange; blacks are soft, never crushed; highlights roll off, never clip.</p>
''', "photographic register")

# ------------------------------------------------------------------ 20 textures
page("colour-textures", "ivory textures", f'''
  <div class="tex">
    <div style="background:#14141A"><span class="k" style="color:#F2EFE7">( 01 ) ink void</span></div>
    <div style="background:url(images/ivory-paper.jpg) center/cover"><span class="k">( 02 ) ivory paper grain</span></div>
    <div style="background:#BB4A2E"><span class="k" style="color:#F2EFE7">( 03 ) marrow</span>{WM_IVORY}</div>
    <div style="background:url(images/water.jpg) center/cover"><span class="k" style="color:#F2EFE7">( 04 ) film grain</span></div>
  </div>
''', "textures")

# ------------------------------------------------------------------ 21 typography (opener)
page("type-open", "ivory", img("cards-topdown.jpg", "center 35%", "strip low"), "typography", "09")

# ------------------------------------------------------------------ 22 brand typeface
page("type-face", "ivory typeface", f'''
  <div class="sample">no camera.<br>no studio.<br>only direction.</div>
  <div class="specs">
    <div><span class="k">name</span><b>inter display</b><i>alt. söhne kräftig · gt america · pp neue machina</i></div>
    <div><span class="k">weights</span><b>extrabold · semibold · regular</b><i>headlines · labels · body</i></div>
    <div><span class="k">setting</span><b>−5% tracking · 0.9 leading</b><i>always lowercase</i></div>
  </div>
''', "brand typeface")

# ------------------------------------------------------------------ 23 type annotations (designed hero + specs)
page("type-annot", "ink annot", f'''
  <div class="hero">{img("perfume-honey.jpg", "center 40%")}<div class="hero-t">
    <div class="wmrow">{WM_IVORY}</div>
    <h2>the bottle<br>wasn't shot.<br>it was directed.</h2>
    <p>spec frame for a perfume house. product locked from reference; honey poured because the geometry asked for it.</p>
    <span class="cta">dm "frame" →</span></div></div>
  <div class="specs-r">
    <div><span class="k">h1</span><b>inter display extrabold · 88 / 80</b><i>→ −5% tracking, lowercase, two lines maximum</i></div>
    <div><span class="k">eyebrow</span><b>inter semibold · 12 / 16 · caps</b><i>→ +20% tracking, one line, always above</i></div>
    <div><span class="k">body</span><b>inter regular · 16 / 26</b><i>→ never competes with the headline</i></div>
    <div><span class="k">numbers</span><b>01 — 02 — 03 —</b><i>→ em dash and a space. a signature</i></div>
  </div>
''', "type annotations")

# ------------------------------------------------------------------ 24 arabic typeface
page("type-arabic", "ivory typeface ar", f'''
  <div class="sample ar">بدون كاميرا.<br>بدون ستوديو.<br>بس إخراج.</div>
  <div class="specs">
    <div><span class="k">name</span><b>ibm plex sans arabic</b><i>locked · open licence</i></div>
    <div><span class="k">weights</span><b>bold · regular</b><i>headlines · body</i></div>
    <div><span class="k">register</span><b>spoken jordanian</b><i>never modern standard arabic</i></div>
  </div>
''', "arabic typeface")

# ------------------------------------------------------------------ 25 system elements (icons-grid layout)
page("system", "ivory system", f'''
  <div class="sys-l">
    <div class="sys"><b>01 —</b><span class="k">numbering</span></div>
    <div class="sys"><b class="eb">the studio</b><span class="k">eyebrow · caps · +20%</span></div>
    <div class="sys"><b>ə</b><span class="k">sign-off · closes every caption</span></div>
    <div class="sys"><b class="rule"></b><span class="k">hairline rule</span></div>
    <div class="sys"><b>( 01 )</b><span class="k">figure label · mono</span></div>
    <div class="sys"><b class="dots"></b><span class="k">dotted leader</span></div>
    <div class="sys"><b>→</b><span class="k">arrow · amman → worldwide</span></div>
    <div class="sys"><b style="color:#BB4A2E">a</b><span class="k">one marrow character</span></div>
  </div>
  <div class="sys-r"><p>the system elements are small and few. they repeat on every surface — captions, decks, the site — so the brand is recognisable before the logo appears.</p></div>
''', "system elements")

# ------------------------------------------------------------------ 26 post templates (thumbnail grid)
page("templates", "ivory templates", f'''
  <div class="tpl">
    <div class="t ink-t"><span class="eb">01 —</span><span class="h">restraint</span></div>
    <div class="t"><img src="images/ink-vessel.jpg" style="object-position:center 70%"></div>
    <div class="t iv-t"><span class="h2">latənt</span></div>
    <div class="t"><img src="images/portrait.jpg" style="object-position:20% 20%"></div>
    <div class="t marrow-t"><span class="h">ə</span></div>
    <div class="t iv-t"><span class="p">the bottle wasn't shot.<br>it was directed.</span></div>
    <div class="t"><img src="images/coffee.jpg" style="object-position:30% center"></div>
    <div class="t ink-t"><span class="h3">no camera.<br>no studio.<br>only direction.</span></div>
    <div class="t"><img src="images/cards-topdown.jpg" style="object-position:center 40%"></div>
  </div>
  <div class="tpl-r"><p><b>grid</b><br>alternate the worlds: ink post, ivory post. never three of one in a row. every row of three holds one dark frame and one light frame.<br><br><b>caption</b><br>hook · substance · credit · ask. lowercase, clipped, declarative. then the ə.</p></div>
''', "post templates")

# ------------------------------------------------------------------ 27 mockups (opener)
page("mock-open", "ink", img("water.jpg", "center", "strip low"), "mockups", "10")

# ------------------------------------------------------------------ 28 phones triptych
page("mock-phones", "ink phones", f'''
  <div class="ph"><div class="scr ivory-s"><div class="ig-top"><span class="av">ə</span><span>latentstudio.jo</span></div><div class="ig-grid"><img src="images/perfume-honey.jpg"><i></i><img src="images/portrait.jpg" style="object-position:20% 20%"><img src="images/ink-vessel.jpg" style="object-position:center 70%"><i class="m"></i><img src="images/coffee.jpg" style="object-position:30% center"></div></div></div>
  <div class="ph"><div class="scr"><img src="images/perfume-honey.jpg" style="object-position:center 40%"><div class="story-t">the bottle wasn't shot.<br>it was directed.</div><div class="story-b">{WM_IVORY}</div></div></div>
  <div class="ph"><div class="scr marrow-s"><span class="big-sy">ə</span><div class="story-b">{WM_INK}</div></div></div>
''', chrome=False)

# ------------------------------------------------------------------ 29–37 photographic mockups
for name, src in [("mock-pylon", "pylon.jpg"), ("mock-card", "card-pocket.jpg"), ("mock-storefront", "storefront.jpg"),
                  ("mock-laptop", "laptop-plinth.jpg"), ("mock-booklet", "booklet.jpg"), ("mock-appicon", "app-icon.jpg"),
                  ("mock-tote", "tote.jpg"), ("mock-poster", "poster.jpg"), ("mock-tape", "tape.jpg"), ("mock-shirt", "tshirt.jpg")]:
    page(name, "photo-full", img(src, "center", "bleed"), chrome=False)

# ------------------------------------------------------------------ thank you
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
.photo-full { background:#14141A; color:#F2EFE7; }
.grain { position:absolute; inset:0; background:url(src/grain.png) repeat; background-size:384px 384px; opacity:.13; mix-blend-mode:overlay; pointer-events:none; z-index:60; }
.ink .grain, .photo-full .grain { opacity:.2; }
img { display:block; }
.ar, .sample.ar { font-family:"IBM Plex Sans Arabic", "Almarai", sans-serif; }

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
p { margin:0; }
.under-title { position:absolute; top:120px; left:50%; transform:translateX(-50%); width:760px; text-align:center; font-size:13.5px; line-height:1.6; opacity:.85; }
.side-p { position:absolute; top:150px; left:56px; width:300px; font-size:13px; line-height:1.6; opacity:.85; }
.foot-p { position:absolute; bottom:64px; left:50%; transform:translateX(-50%); width:760px; text-align:center; font-size:13px; line-height:1.6; opacity:.8; }

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
.toc li i { flex:1; border-bottom:2px dotted rgba(20,20,26,.45); margin:0 18px 6px; }
.toc li b { font-weight:400; font-family:"IBM Plex Mono", monospace; font-size:20px; }

/* split */
.split .half { position:absolute; top:0; bottom:0; width:50%; }
.split .half.photo { left:0; } .split .half.photo img { width:100%; height:100%; object-fit:cover; }
.split .half.text { right:0; background:#14141A; display:flex; flex-direction:column; justify-content:center; padding:0 220px 0 190px; gap:20px; }
.split .half.text p { font-size:13.5px; line-height:1.65; opacity:.9; }

/* vision */
.tiny { position:absolute; left:50%; top:400px; transform:translateX(-50%); width:120px; height:160px; object-fit:cover; }
.vision-p { position:absolute; top:640px; left:50%; transform:translateX(-50%); width:560px; text-align:center; font-size:13.5px; line-height:1.65; opacity:.85; }

/* mood */
.mood4 { position:absolute; left:0; right:0; top:300px; bottom:0; display:grid; grid-template-columns:repeat(4,1fr); gap:6px; }
.mood4 figure { margin:0; position:relative; overflow:hidden; }
.mood4 figure img { width:100%; height:100%; object-fit:cover; }
.mood4 figure span { position:absolute; top:-22px; left:50%; transform:translateX(-50%); font-family:"IBM Plex Mono", monospace; font-size:10px; opacity:.7; }
.mood .grain { z-index:60; }

/* concept */
.c-left { position:absolute; left:56px; top:190px; bottom:60px; width:420px; display:grid; grid-template-rows:1fr 1fr; gap:14px; }
.c-left img { width:100%; height:100%; object-fit:cover; }
.c-mid { position:absolute; left:560px; right:560px; top:50%; transform:translateY(-50%); font-size:12.5px; line-height:1.6; text-align:center; display:flex; flex-direction:column; gap:16px; opacity:.9; }
.c-mid b { font-weight:600; }
.c-right { position:absolute; right:56px; top:190px; bottom:60px; width:420px; }
.c-right img { width:100%; height:100%; object-fit:cover; }

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
.cols4 { position:absolute; left:0; right:0; top:280px; bottom:0; display:grid; grid-template-columns:repeat(4,1fr); }
.cols4 > div { position:relative; display:flex; align-items:center; justify-content:center; }
.cols4 .wm { width:280px; }
.cols4 .k { position:absolute; top:14px; left:50%; transform:translateX(-50%); }
.dim-scrim { position:absolute; inset:0; background:rgba(20,20,26,.35); z-index:1; }
.photo-full .stage .wm { width:900px; filter:drop-shadow(0 6px 30px rgba(0,0,0,.35)); }
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
.misuse { position:absolute; left:1160px; right:56px; top:150px; display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
.misuse .k { display:block; margin-top:8px; }
.misuse .k:before { content:"✕ "; color:#BB4A2E; }
.mu { height:160px; background:#E8E4DA; display:flex; align-items:center; justify-content:center; overflow:hidden; }
.mu img { width:150px; }
.fake { font-family:"Inter Display", sans-serif; font-weight:800; font-size:50px; letter-spacing:-.045em; color:#14141A; }
.fake.outline { color:transparent; -webkit-text-stroke:1.5px #14141A; }
.fake.grad { background:linear-gradient(90deg,#14141A,#BB4A2E); -webkit-background-clip:text; background-clip:text; color:transparent; }

.minsize { position:absolute; left:440px; top:560px; width:640px; display:flex; flex-direction:column; gap:26px; }
.ms-row { display:flex; align-items:flex-end; gap:40px; } .ms-row .k { margin-left:8px; padding-bottom:4px; }
.misuse .mu { height:150px; }

/* colour */
.p3 { position:absolute; left:56px; right:56px; top:130px; bottom:60px; display:grid; grid-template-columns:repeat(3,1fr); gap:0; }
.p3 > div { display:grid; grid-template-rows:1fr 1fr; }
.p3 figure { margin:0; overflow:hidden; } .p3 figure img { width:100%; height:100%; object-fit:cover; }
.p3 .blk { padding:34px 36px; display:flex; flex-direction:column; }
.p3 .blk b { font-weight:600; font-size:13px; letter-spacing:.14em; text-transform:uppercase; margin-bottom:auto; }
.p3 .blk span { font-family:"IBM Plex Mono", monospace; font-size:11px; letter-spacing:.06em; line-height:1.9; opacity:.85; }
.ratio-bar { position:absolute; left:56px; right:56px; top:260px; bottom:60px; display:flex; }
.ratio-bar > div { position:relative; padding:36px; }
.ratio-bar b { font-family:"Inter Display", sans-serif; font-weight:800; font-size:180px; letter-spacing:-.06em; line-height:.8; display:block; }
.ratio-bar span { position:absolute; left:36px; bottom:36px; font-family:"IBM Plex Mono", monospace; font-size:11px; letter-spacing:.08em; opacity:.8; }
.reg { position:absolute; left:56px; right:56px; top:130px; height:720px; display:grid; grid-template-columns:repeat(3,1fr); gap:6px; }
.reg figure { margin:0; position:relative; overflow:hidden; }
.reg figure img { width:100%; height:100%; object-fit:cover; }
.reg figure .k { position:absolute; top:22px; left:50%; transform:translateX(-50%); white-space:nowrap; }
.reg .chips { position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); display:flex; flex-direction:column; gap:10px; }
.reg .chips i { display:block; width:190px; height:56px; box-shadow:0 8px 24px rgba(0,0,0,.25); }
.tex { position:absolute; left:0; right:0; top:200px; bottom:0; display:grid; grid-template-columns:repeat(4,1fr); }
.tex > div { position:relative; display:flex; align-items:center; justify-content:center; }
.tex .k { position:absolute; top:-26px; left:50%; transform:translateX(-50%); white-space:nowrap; color:#14141A !important; }
.tex .wm { width:240px; }

/* typography */
.sample { position:absolute; left:56px; right:56px; top:200px; text-align:center; font-family:"Inter Display", sans-serif; font-weight:800; font-size:150px; letter-spacing:-.055em; line-height:.92; }
.sample.ar { font-weight:700; font-size:130px; letter-spacing:0; line-height:1.15; direction:rtl; }
.specs { position:absolute; left:50%; transform:translateX(-50%); bottom:110px; display:flex; gap:120px; text-align:center; }
.specs .k { display:block; margin-bottom:10px; }
.specs b { display:block; font-weight:500; font-size:14px; }
.specs i { display:block; font-style:normal; font-size:11.5px; opacity:.6; margin-top:4px; }
.annot .hero { position:absolute; left:0; top:0; bottom:0; width:50%; overflow:hidden; }
.annot .hero > img { width:100%; height:100%; object-fit:cover; opacity:.85; }
.annot .hero-t { position:absolute; left:64px; right:64px; bottom:80px; z-index:2; }
.annot .wmrow .wm { width:120px; margin-bottom:36px; }
.annot h2 { margin:0 0 18px; font-family:"Inter Display", sans-serif; font-weight:800; font-size:88px; letter-spacing:-.05em; line-height:.9; }
.annot .hero-t p { font-size:14px; line-height:1.6; max-width:420px; opacity:.85; margin-bottom:20px; }
.annot .cta { font-size:11px; letter-spacing:.2em; text-transform:uppercase; }
.annot .hero:after { content:""; position:absolute; inset:0; background:linear-gradient(to top, rgba(20,20,26,.9), rgba(20,20,26,0) 60%); }
.annot .hero-t { z-index:3; }
.specs-r { position:absolute; left:50%; right:0; top:0; bottom:0; padding:150px 96px 0 96px; display:flex; flex-direction:column; justify-content:center; gap:34px; }
.specs-r .k { display:block; margin-bottom:6px; }
.specs-r b { display:block; font-weight:500; font-size:15px; }
.specs-r i { display:block; font-style:normal; font-size:12px; opacity:.6; margin-top:4px; }

/* system elements */
.sys-l { position:absolute; left:0; top:0; bottom:0; width:50%; background:#E8E4DA; display:grid; grid-template-columns:repeat(4,1fr); grid-template-rows:repeat(2,1fr); padding:160px 60px 80px; gap:24px; }
.sys { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:22px; text-align:center; }
.sys b { font-family:"Inter Display", sans-serif; font-weight:800; font-size:64px; letter-spacing:-.04em; line-height:1; }
.sys b.eb { font-family:"Inter", sans-serif; font-weight:600; font-size:12px; letter-spacing:.2em; text-transform:uppercase; }
.sys b.rule { width:120px; height:1px; background:#14141A; }
.sys b.dots { width:120px; height:0; border-bottom:2px dotted #14141A; }
.sys-r { position:absolute; right:0; top:0; bottom:0; width:50%; display:flex; align-items:center; justify-content:center; padding:0 200px; text-align:center; font-size:13.5px; line-height:1.65; opacity:.85; }

/* templates */
.tpl { position:absolute; left:56px; top:130px; width:920px; height:890px; display:grid; grid-template-columns:repeat(3,1fr); grid-template-rows:repeat(3,1fr); gap:8px; }
.tpl .t { position:relative; overflow:hidden; display:flex; align-items:center; justify-content:center; background:#14141A; }
.tpl .t img { width:100%; height:100%; object-fit:cover; }
.tpl .ink-t { background:#14141A; color:#F2EFE7; } .tpl .iv-t { background:#F2EFE7; color:#14141A; box-shadow:inset 0 0 0 1px rgba(20,20,26,.12); } .tpl .marrow-t { background:#BB4A2E; color:#F2EFE7; }
.tpl .h { font-family:"Inter Display", sans-serif; font-weight:800; font-size:64px; letter-spacing:-.05em; }
.tpl .h2 { font-family:"Inter Display", sans-serif; font-weight:800; font-size:52px; letter-spacing:-.05em; }
.tpl .h3 { font-family:"Inter Display", sans-serif; font-weight:800; font-size:26px; letter-spacing:-.04em; line-height:1; position:absolute; left:22px; bottom:22px; }
.tpl .eb { position:absolute; left:22px; top:18px; font-family:"Inter Display", sans-serif; font-weight:800; font-size:26px; letter-spacing:-.03em; }
.tpl .ink-t .h { position:absolute; left:22px; bottom:18px; font-size:30px; }
.tpl .p { font-size:14px; line-height:1.4; text-align:center; padding:0 30px; }
.tpl-r { position:absolute; left:1080px; right:56px; top:0; bottom:0; display:flex; align-items:center; font-size:13.5px; line-height:1.65; opacity:.85; }
.tpl-r b { font-weight:600; }

/* phones */
.phones .ph { position:absolute; top:120px; width:390px; height:840px; background:#232329; border-radius:52px; padding:12px; box-shadow:0 40px 80px rgba(0,0,0,.5); }
.phones .ph:nth-child(1) { left:330px; } .phones .ph:nth-child(2) { left:765px; } .phones .ph:nth-child(3) { left:1200px; }
.scr { width:100%; height:100%; border-radius:42px; overflow:hidden; position:relative; background:#14141A; }
.scr > img { width:100%; height:100%; object-fit:cover; }
.ivory-s { background:#F2EFE7; color:#14141A; } .marrow-s { background:#BB4A2E; color:#14141A; display:flex; align-items:center; justify-content:center; }
.ig-top { display:flex; align-items:center; gap:10px; padding:64px 20px 16px; font-size:13px; font-weight:600; }
.ig-top .av { width:34px; height:34px; border-radius:50%; background:#14141A; color:#F2EFE7; display:flex; align-items:center; justify-content:center; font-family:"Inter Display", sans-serif; font-weight:800; font-size:20px; }
.ig-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:2px; }
.ig-grid img, .ig-grid i { display:block; width:100%; aspect-ratio:1/1; object-fit:cover; background:#F2EFE7; box-shadow:inset 0 0 0 1px rgba(20,20,26,.1); }
.ig-grid i.m { background:#BB4A2E; }
.story-t { position:absolute; left:26px; right:26px; bottom:120px; font-family:"Inter Display", sans-serif; font-weight:800; font-size:34px; letter-spacing:-.04em; line-height:.95; color:#F2EFE7; text-shadow:0 2px 20px rgba(0,0,0,.5); }
.story-b { position:absolute; left:26px; bottom:44px; } .story-b .wm { width:80px; }
.big-sy { font-family:"Inter Display", sans-serif; font-weight:800; font-size:260px; line-height:1; color:#14141A; }

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
    for f in os.listdir(PAGES_DIR):
        if f.endswith(".png") and only is None:
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
