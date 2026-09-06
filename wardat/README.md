# Wardat Al-Zuhoor — website

شركة وردة الزهور لتجارة السيارات والنقل العام والتجارة العامة / محدودة المسؤولية — **فرع الموصل**
Wardat Al-Zuhoor Co. for Cars Trading, Transport and General Trading Ltd. — **Mosul branch**

A **single-page static site**. One HTML file, one assets folder. No build step, no
framework, no npm. Open `index.html`, edit, save, reload.

```
wardat/
├── index.html      everything: markup, CSS, JS
├── _headers        cache + security headers (Netlify / Cloudflare Pages)
├── robots.txt · sitemap.xml
├── assets/
│   └── logo-mark.svg      the W mark, rebuilt as clean vector; also the favicon
└── source/
    ├── letterhead.jpg     client scan the brand was taken from
    └── signboard.jpg      client scan of the branch sign
```

Run it locally with a server (video needs HTTP range requests, `file://` has none):

```bash
cd wardat && python3 -m http.server 8000
```

---

## The brand

The logo was supplied only as two CamScanner photographs. The mark has been
**rebuilt as vector** from measured geometry, not traced from the bitmap: it is
four 45° constant-width strokes — a chevron, a free-standing left bar, and a
bottom chevron that carries on into the long right arm as one continuous stroke.
Verified by overlaying the reconstruction on the letterhead scan.

| Token | Value | Role |
|---|---|---|
| `--blue` | `#0A42DE` | **measured off the logo**, the core fill of the mark |
| `--blue-lift` | `#3E6BFF` | hover, glow, the lit accent on dark |
| `--navy` | `#060B24` | the dark ground |
| `--bone` | `#EEF0F5` | the off-white ground |

Sections alternate `.tone-dark` / `.tone-light`, which re-declare the text, line
and glass tokens. **Components read tokens, never a literal colour**, so a card
re-skins itself from whichever section holds it. Keep that discipline.

Type: **Jost** (display — a Futura revival, closest free match to the logo
wordmark), **Inter** (body), **Space Mono** (meta labels), **Tajawal** (Arabic).

---

## The animation set — 21st.dev patterns, ported to vanilla

Each is a hand-written vanilla version of a 21st.dev / Aceternity component.
Nothing is imported; there is no React in this build.

| Section | Pattern | Where |
|---|---|---|
| Nav | tubelight navbar — one pill slides between links | `moveTube()` |
| Hero | blur-fade word rise, dot pattern, conic beam sweep | `body.lit`, `.dots`, `.beam` |
| Hero stats | number ticker | `[data-count]` |
| About | scroll-driven word-by-word text reveal | `[data-reveal]` |
| Services | bento grid + cursor-tracked glowing border | `.bento`, `.glow` |
| Fleet | container scroll animation — 3D tilt flattens, strip pans | `#tiltwrap` |
| Reach | dotted world map with drawing arcs | `#mapsvg` + canvas |
| Reach (phone) | radial bearing diagram — see below | `#radial` |
| Process | tracing beam timeline | `#beamline` |
| Marquee | scroll-velocity marquee, two opposing rows | `#velo1`, `#velo2` |
| Contact | border beam | `.beamborder` |
| *All panels* | **scroll lock until the entrance completes** | `SEQ` / `PLAY` |
| Nav | retracts onto the logo after 2s, returns on hover | `body.navmin` |
| Gate | language choice on a first visit, then it lifts | `#gate` |
| Dark panels | drifting blue fields + a pointer-tracked glow | `.amb` |

### The hero runs in two beats

`PLAY.top` adds `lit` — the three words rise one at a time — then holds for a
second before adding `lit2`, which brings in the Arabic line, the lede and the
four numbers. The hold is what makes the words land as a statement rather than
as the top of a paragraph. Both classes are on `<body>`; nothing else needs to
know.

### Arabic

The whole site runs in two languages. Every translatable string carries a
`data-t` key; the **English lives in the HTML** (so the page reads correctly
with no JavaScript, and search engines index real content) and the Arabic
lives in one `AR` dictionary near the bottom of the script. Values may contain
HTML, because several strings need `<b>`, `<em>` or a `<span class="hl">`.

Switching language sets `lang` and `dir` on `<html>`. Everything directional
uses logical properties (`inset-inline-start`, `padding-inline-start`,
`margin-inline-end`), so the layout mirrors on its own; only a handful of
things needed an override. Three deliberate exceptions stay left-to-right:
the world map, the phone corridor diagram, and the two marquees — geography
and a scrolling band both read wrong mirrored. **Port names on the map stay in
Latin**; the corridor list underneath is translated. Say the word and the map
labels can be Arabic too.

Three things that bite in RTL and are already handled:

- **A phone number reorders.** `0770 303 0030` is three Latin-digit runs, and
  the bidi algorithm reverses their order in an RTL paragraph — it rendered as
  `0030 303 0770`. Each number is wrapped in `dir="ltr"` with
  `unicode-bidi:isolate`.
- **The hero veil darkens the side the type sits on**, which flips. It reads
  `--veil-side`, set to `left` under `html[lang="ar"]`.
- **The fleet filmstrip inherited RTL** and reversed its flex row, so the
  scroll-driven pan translated every photograph off-screen and the card read
  as blank — in Arabic only. `.strip` is pinned to `direction: ltr`; it is a
  filmstrip, not prose. The captions inside it are set back to RTL.

**Arabic descenders were clipped by both masked headlines.** The hero words and
the film panel's heading each reveal from behind `overflow: hidden`, and the
tails of ق, ي, ل and ه drop below the line box. Raising `line-height` alone was
not enough — glyph *ink* extends past the box, so a box-based measurement
reported no overflow while the page visibly cut the letters. The masks are
padded downward with `padding-bottom: .24em` and the space pulled back with a
matching negative margin, and the hidden state is pushed to `translateY(150%)`
so no sliver shows through the padding. If you ever add another masked reveal,
it needs the same two lines.

Arabic type is **Almarai**, with Tajawal as the fallback. The mono labels have
no Arabic equivalent, so in Arabic they switch to Almarai at a heavier weight
rather than staying in a Latin mono face.

The gate shows once. The choice is kept in `localStorage` under `wz-lang`, and
returning visitors go straight in. The hero hold waits for the gate: the lock
controller exposes `window.__startHero`, and the gate calls it as it lifts.

### The nav retracts

The bar shows itself, then 2.4 s later the links and the Contact button fold
away and the pill shrinks onto the logo, leaving three dots as the affordance.
Hovering the pill — or tabbing into it — brings it back; it re-arms 1.1 s after
the pointer leaves. It only ever collapses at 941 px and up, because below that
the burger *is* the menu and hiding it would strand the visitor.

The pill shrinks **rightward**, so the mark itself never moves. That is the
whole trick: `.navin` goes from `width:100%` to `width:max-content` while the
fixed container stays put.

### The animated ground

`.amb` on a dark section paints two layers behind the content: `::before` is
three large blue fields on a 22 s drift, `::after` is a single field that
follows the pointer and fades in only while the pointer is near that section.
Both are clipped by `overflow:hidden` on `.amb` — without it the drift's
`scale(1.08)` pushes past the section edge and gives the whole page a
horizontal scrollbar.

### The panel lock

Every panel **holds the page while its entrance plays**, then releases — the
hero from first paint, then one hold per section on the way down. The rules
that keep a hold from reading as a frozen page:

- A panel snaps to the top of the viewport, holds, and **never locks again**.
- Holds are 0.9–1.25 s. Nothing longer.
- Scrolling **up** never locks; blowing **past** a panel plays its entrance
  without yanking you backwards.
- **Escape** releases immediately, and `prefers-reduced-motion` skips the whole
  mechanism — nothing locks, everything is revealed at rest.
- No `resize` handler releases a hold: phones fire resize when the address bar
  retracts, and that was cutting the hero hold short.

**Two rules stop it feeling laggy, and both were learned the hard way:**

**Freeze the page, do not fight the wheel.** The first version cancelled
`wheel` events and re-pinned the scroll position on every `scroll` event.
Cancelling `wheel` does not stop trackpad momentum already in flight, so the
hold was spent snapping the page back against it — visible judder. It now sets
`overflow-y: hidden` on `<html>`, which the momentum cannot argue with. Touch
and keyboard are still cancelled directly, because iOS ignores the overflow.
`scrollbar-gutter: stable` on `<html>` is load-bearing here: without it,
hiding the overflow reclaims the scrollbar's width and the whole page jumps
sideways at the start of every hold.

**A hold does not move the page at all.** Not forwards, not backwards, not by
a pixel. The first version scrolled the page onto the panel top; clamping that
forward was not enough, because *any* repositioning reads as the page being
taken away. It now freezes exactly where the reader is and plays the entrance
there, with a single one-frame correction in case the freeze itself shifted
the offset. Verified by sampling `scrollY` every frame through every hold: it
never changes.

**Freeze both axes.** `overflow-y: hidden` alone coerces `overflow-x` from
`visible` to `auto`, which can introduce a horizontal scrollbar, shorten the
viewport and reflow every `100lvh` panel — seen as the page lurching upward at
the moment of the hold. `overflow: hidden` sets both and avoids the coercion.

Holds are 380–480 ms, and the hero 1.15 s. Every entrance is tuned to finish
inside its hold. **The film panel does not hold at all** — its copy reveals on
an IntersectionObserver as you reach it, and the scroll never stops.

Panel entrances are
registered on a `PLAY` map — `PLAY.reach`, `PLAY.process`, and so on — and the
controller at the bottom of the script calls them. Adding a panel means adding
a `PLAY` entry and one row in `SEQ`.

`prefers-reduced-motion` is honoured throughout: it flattens the pinned
sections, stops the marquees, skips every lock, and reveals everything
statically.

### The two films

Both were generated on Krea from the client's own photographs — Seedance 2.5,
image-to-video, one continuous 10-second take each, no cuts. `VIDEO-DIRECTION.md`
carries the full direction, the prompts and the settings.

Two things that will bite whoever regenerates them:

- **Krea returns HEVC 10-bit with an audio track**, whatever `generate_audio`
  says. Chrome and Firefox will not decode HEVC at all. Always transcode to
  H.264 8-bit `yuv420p` and strip audio with `-an`.
- **Seedance reads "slow" and "gentle" as slow-motion.** The direction called
  for a slow track; the prompt had to say *steadily*, *controlled*,
  *natural realtime* instead. Krea's own prompting guide lists the banned words.

The cool steel grade is applied at export, not asked of the model — it drifted
warm both times. The exact filter chain is in `VIDEO-DIRECTION.md`.

### The map

Desktop draws a real dotted world map. The landmass is a **168 × 74 grid
rasterised offline from Natural Earth 110m land data** and shipped as a
1.7 KB run-length string (`LAND_RLE`), painted to a canvas — 3,763 dots as
DOM nodes would be far too heavy. Arcs are quadratic curves drawn with a
dash offset.

Projection (equirectangular, lat 80°N to 58°S over a 1008 × 444 box):

```
x = (lon + 180) / 360 * 1008
y = (80 - lat)  / 138 * 444
```

**Phones get a different component, not a shrunk map.** A world map at 350 px is
unreadable — that was the exact failure on the previous project. Below 760 px
the map is replaced by a radial diagram: each origin sits on its **true initial
bearing** from Mosul at a log-scaled distance, both computed at runtime from
the coordinates, so adding a city needs no hand-placement.

---

## Still needed from the client

- [ ] **An email address.** Still the one thing missing — the contact row shows
      `TO BE CONFIRMED`. The primary button dials 0770 303 0030 instead.
- [ ] **The Mosul branch street address.** The letterhead gives the *registered*
      office, which is in Baghdad (Al-Qadisiyah, M 602, St 11, Bldg 3/148).
      This site is for the Mosul branch and its own address is still blank.
- [ ] **One phone number resolved.** The letterhead prints a third number twice
      with two different digits — 0750 316 5555 and 0750 361 5555. Neither is
      published; the note on the page says so.
- [ ] **Opening hours.**
- [ ] The authorised director's name was on the letterhead and has been
      removed from the site at the client's request. Put it back only if asked.
- [ ] **Higher-resolution photographs.** The seven in `assets/fleet/` came
      through WhatsApp at 1280 px and are soft at full-bleed sizes. Originals
      off the phone would be noticeably sharper.
- [ ] **A decision on the number plate.** `assets/fleet/06.jpg` and the hero
      film both show a legible temporary trade plate on the company's own
      stock. Normal for a dealer, but say the word and it gets blurred.
- [ ] **Two hero numbers** — "units / year" and "markets served" show `—` and a
      TBC tag until real figures arrive.
- [ ] **Confirm the corridor list.** It is a proposal based on the routes that
      serve Iraq, not a claim about routes the company runs.
- [ ] **The registered English name.** The letterhead prints "Transportion";
      the site spells it "Transport". Say the word if it must match the
      certificate exactly.
- [ ] **Arabic / RTL version** — the site is English with Arabic throughout;
      a full RTL build with a language toggle has not been built.

## Gotchas carried over from the last project

- **Never gate a video's visibility on a load event.** Safari and iOS do not
  fetch media for a `display:none` element, so the event never fires and the
  panel stays blank — while desktop Chrome passes every test.
- **Set `muted` as a property in JS**, not only as an attribute, and call
  `.load()` explicitly; `preload="metadata"` is advisory on mobile.
- **Keep the Google Fonts `<link>` async.** A render-blocking font sheet blocks
  every script after it.
- **No `immutable` in `_headers`** — the asset filenames are not content-hashed.
- **`getTotalLength()` throws** on a non-rendered SVG element; it does not
  return zero. An uncaught throw kills the whole animation loop.
- **An IntersectionObserver threshold is a fraction of the *target*.** A 5% tall
  root band can never cover 2% of a 260vh section, so the nav spy reads
  `elementsFromPoint` instead.

Verified at **390 / 430 / 768 / 1024 / 1400 px** with no horizontal overflow and
no console errors, under the strictest autoplay policy.
