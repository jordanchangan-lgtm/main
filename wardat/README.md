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

`prefers-reduced-motion` is honoured throughout: it flattens the pinned
sections, stops the marquees, and reveals everything statically.

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

- [ ] **Phone, email, address and opening hours.** All four render a visible
      `TO BE CONFIRMED` tag rather than a plausible-looking guess, and the
      enquiry button is deliberately inert until there is a real address.
- [ ] **A domain.** `robots.txt` and `sitemap.xml` carry
      `REPLACE-WITH-DOMAIN.example`; the canonical and `og:url` tags are held
      back until it exists.
- [ ] **Photographs** for the five fleet slots.
- [ ] **Two films** — hero (`assets/hero.webm` + `.mp4` + `hero.jpg`) and the
      mid-page panel (`assets/road.*`). Drop them in and they fill themselves;
      no code change. Ship **both** WebM and H.264 MP4.
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
