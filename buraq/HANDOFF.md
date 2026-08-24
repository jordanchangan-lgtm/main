# Buraq Al Omur — website handoff

**Read this first if you are a Claude session picking this project up.**
Everything needed to continue is in this file plus `buraq/index.html`.

- **Repo:** `jordanchangan-lgtm/main` · **branch:** `claude/buraq-al-omur-website-brxxgx`
- **Site:** `buraq/` — one self-contained `index.html` plus `assets/`. **No build step, no framework, no npm.** Open the file directly.
- **Live domain (not yet pointed):** `buraqalomur.com`
- **Preview artifact:** https://claude.ai/code/artifact/5d9770b2-bab4-439f-954f-373a3f39f40f

---

## 1. The client and the brief

**Buraq Al Omur Car Trading Company** — شركة براق العمر لتجارة السيارات.
Vehicle **import and export**, Jordan.

Brief as supplied by the client, verbatim:

> a company that was established in 2022, the main branch is in al 7orah at al zarqa
>
> وهي عباره عن شركه استيراد وتصدير سيارات، وتملك مستودعات ومخازن في منطقه الحره تبلغ مساحتها 70 الف متر مربع و لديها مكاتب لوجيستيه ومكاتب ترخيص وتسجيل ومعاينه وفحص فني و صاله عرض تبلغ مساحتها 2500 متر مربع و مساحه تخزين لصاله العرض 2000 متر مربع و منها يتم انتشار كافه المركبات الى كافه ارجاء المملكه والوطن العربي

Facts drawn from it — **do not invent beyond these**:

| Fact | Value |
|---|---|
| Founded | 2022 |
| Main branch | Free Zone (المنطقة الحرة), Al Zarqa, Jordan |
| Business | Vehicle import & export |
| Yard + bonded warehousing | 70,000 m² |
| Showroom | 2,500 m² |
| Showroom storage | 2,000 m² |
| On site | Logistics offices · licensing & registration offices · inspection & technical testing |
| Distribution | All of Jordan, and the Arab world |

**Brands (10, client-supplied):** Changan, Deepal, Avatr, Bestune, Dongfeng, BAIC, Arcfox, Volkswagen, Audi, BYD.
The client wrote *"aecfox"* — corrected to **Arcfox** (BAIC's EV brand). This was flagged and not objected to.

---

## 2. Design system

The client never sent a palette. It was **derived from the logo**, then corrected to the logo's exact spec once the vector PDF arrived.

### Colour

| Token | Value | Role |
|---|---|---|
| `--ink` | `#0E0E12` | ground (near-black, faint blue-violet bias — not pure black) |
| `--surface` / `--panel` | `#17171E` | panels |
| `--steel` / `--panel-2` | `#22222B` | raised panels, hover |
| `--bone-bg` | `#EDEBE7` | the off-white ground |
| `--red` | `#ED1C2F` | **the logo's exact red.** Signal colour, one use per screen |
| `--red-hi` | `#FF3B41` | glow only |
| `--t1 / --t2 / --t3` | `#F2F0EC` / `#B2B2BE` / `#7C7C89` | text high / mid / low |

Logo-internal tokens: `--lg-plate #282828`, `--lg-paper #FEFEFE`, `--lg-grey #A9ABAE`, `--lg-ink` (→`--t1`), `--lg-red` (→`--red`).

**Committed dark identity** — a floodlit free-zone yard at night. Not theme-aware by design; every colour is painted explicitly.

### Type (Google Fonts, one `<link>`)

| Face | Role | Notes |
|---|---|---|
| **Archivo** | display | variable, uses the real **width axis** (`wdth 75..125`), not just weight |
| **Barlow** | body | transport-signage roots |
| **IBM Plex Mono** | data labels, eyebrows, bay tags | |
| **Almarai** | **all Arabic** | 300/400/700/800 |

**Important:** Almarai is also appended to the fallback stack of Archivo, Barlow and Plex Mono. The Latin faces carry no Arabic glyphs, so Arabic inside *mixed* strings (`المرافق / FACILITIES`, the footer) falls through to the next family — naming Almarai there keeps every Arabic character on the page in one typeface.

### The structural device

**The red slash from the logo.** It is reused as: the section rule (`.slash`), the active-nav underline, the underline beneath "Clear." in the hero, and the hero's moving light sweep. Do not introduce a second decorative motif.

### Section tones

Sections alternate grounds — this was an explicit client instruction ("a cut for each section, one black and red with red glow and interactive, then off white, then back to the black and red at the end"):

```
hero (dark) → about (light) → facilities (dark) → site/building (photo)
→ services (light) → brands (dark) → fleet (dark) → reach (light) → contact (dark)
```

Implemented as `.tone-dark` / `.tone-light` classes that redefine `--t1/--t2/--t3/--line/--panel`, plus a `.tone-bg` layer stack (`.tb-glow`, `.tb-grid`, `.tb-spot`, `.tb-grain`). **Components read `--panel`, never a literal**, so they re-skin themselves to whichever tone they sit in. Dark sections carry a cursor-tracked red glow (`.tb-spot`, class `.lit`).

---

## 3. The hero choreography — three beats

This went through three rounds of client notes. Current spec:

| Beat | Body class | What happens |
|---|---|---|
| 0 | `words` | Three words (`Import. / Clear. / Deliver.`) mask-reveal one by one, **huge and centred**, on an otherwise empty panel. Only the logo is visible. Page is scroll-locked. |
| 1 | `words armed` | Held ~1.8 s, then the first scroll gesture is accepted. `.hold` nudge appears. |
| 2 | `words s2` | Words **shrink to their resting size at the top**; Arabic company name, lede and buttons fade in. Held ~1.3 s. |
| 3 | `words s2 armed` | Next scroll gesture accepted. |
| 4 | `words s2 s3` | The **number strip** appears. After ~0.9 s the page unlocks. |

Mechanics:

- The h1 keeps its **natural layout position at all times**; beat 0 is a pure `transform: translateY(--lift) scale(--zoom)` with `transform-origin: left top`. No reflow, no jump.
- `frameWords()` measures the widest of the three words with a `Range` (the `.w > span` children are block-level, so `getBoundingClientRect` on the h1 returns the column width, not the text width) and caps `--zoom` at `min(1.9, availableWidth / widestWord)` so the words can never overflow the column. Recomputed on resize.
- `--lift` centres the *zoomed* block: `innerHeight/2 − (height × zoom)/2 − top`.
- `prefers-reduced-motion` skips the whole sequence — all classes applied at once, never locked.
- An `IDLE` timer (9 s) auto-advances each armed beat, so a reader who never scrolls is never stranded.
- Locking sets `overflow:hidden` on both `html` and `body` **and** `preventDefault`s `wheel`/`touchmove` (needed on iOS).

**Open note:** the client said the words should go "small to the **top right**". They were anchored **top-left**, to stay consistent with the left rail and the left-aligned body copy. This was flagged; if they confirm they meant a literal top-right corner anchor, change `transform-origin` and the resting alignment.

---

## 4. The fleet gallery

The client pasted a React/shadcn/Tailwind/TypeScript component (`3d-parallax-unfurling-gallery.tsx`, framer-motion) and asked for "this method for car images". **This project is not React** — the effect was **ported to vanilla** rather than rebuilding the project. Same keyframes and ranges:

| Property | Range | Over progress |
|---|---|---|
| banner width / height | `90vw/80vh → 100vw/100vh` | 0 → 0.15 |
| banner radius / border | `48px → 0`, `4px → 0` | 0 → 0.15 |
| `rotateX` | `25° → 4°` | 0.15 → 1 |
| `rotateY` | `−45° → −8°` | 0.15 → 1 |
| `rotateZ` | `15° → 2°` | 0.15 → 1 |
| `translateZ` | `−800px → 0` | 0.15 → 1 |
| column Y | `[0,−40] [−40,10] [0,−40] [−30,20] [−16,−2]` % | 0.15 → 1 |

A **lerp (`cur += (target − cur) * 0.11`)** stands in for `useSpring`. Section is `500vh` (`360vh` on phone) with a `100svh` sticky inner.

**Two deviations from the original, both deliberate:**
1. **Five columns, not four.** Four left the frame half empty once rotated.
2. **`translateX` compensation.** `rotateY` throws the matrix hard to the right; a per-breakpoint `--tx0`/`--tx1` pair (read from computed style in JS, `-22→-11 vw` desktop, `-60→-44 vw` phone) pulls it back. Without this, over half the frame is black.

---

## 5. Assets

### Logo

Client supplied `logo_buraq_alomar.pdf` — **pure vector**, 16 outlined paths, no fonts or rasters. Extracted with PyMuPDF into:

- `assets/logo-lockup.svg` — full lockup, brand colours (print, other uses)
- `assets/logo-mark.svg` — the B plate alone; also the favicon
- **inline in `index.html`** — nav lockup, every fill mapped to a `--lg-*` token

Path index → role (if you ever need to re-extract): `0–4` BURAQ · `5–7` AL OMUR + Q tail · `8–9` tagline · `10` Arabic · `11` red rule · `12` plate · `13–14` white B · `15` red slash.

Two deliberate changes for the nav:
- **"BURAQ" renders bone, not the print charcoal** `#282828`, which would be invisible on the dark nav. Tokens handle this per ground.
- **The Arabic line is dropped from the nav lockup** — at a 40 px logo its letterforms land ~5 px and turn to mush. Its removal left the wordmark high against the plate, so the wordmark group is re-centred (`translate(0, dy)`). Below 360 px the mark alone shows.

### Car photography

34 images in `assets/cars/`, ~2.5 MB total, `assets/cars/manifest.json` maps file → brand → model.

Pulled from nine public Google Drive folders the client supplied. **The folders are named by model, not brand:**

| Drive folder | Actually | Brand | Folder ID |
|---|---|---|---|
| AVATR | Avatr 11 | Avatr | `18H51-sAlk5rTAxolpxvNp0FwSUpSnDKO` |
| e star | Changan E-Star | Changan | `1VH0nIkQjxlcdkYC9tHt_QZaCrzcGaUeP` |
| Eado EV | Changan Eado EV | Changan | `16U979aK6MIDKbIKSaDQzJmP1pfz4hN3b` |
| s7 | Deepal S07 | Deepal | `1VUXm6EMmqaFQcmc1NFyED3FmzU70Hget` |
| Q5 | Audi Q5 | Audi | `1UF148hx4DvGWETS-cT22HnQPdtJhCC4F` |
| Q4 | Audi Q4 e-tron | Audi | `1I6QZwzTXdrc5SnU_ZBKTyFUsfUH3j1nc` |
| new | **Toyota Corolla Hybrid** | *not on the brand list* | `1i9Le-aVZmnFG4it-Pb6BdhFvWj-NX1Ti` |
| ID.6 | Volkswagen ID.6 | Volkswagen | `17-IesqB1_mzNVxRGCqgi5RqmjHTxcXSa` |
| ID.4 | Volkswagen ID.4 | Volkswagen | `1iNtCfdtRLCDH7dp008bPQd5_fbmtZGj9` |

To re-fetch: the folder page HTML embeds `window['_DRIVE_ivd']` with file ids; images resize server-side via `https://lh3.googleusercontent.com/d/<FILE_ID>=w900-rj`.

**⚠ Flagged to the client, unanswered:** every photo carries a **"LEVANT AUTOMOTIVE" dealer plate**. Toyota is excluded (not on the brand list). Five brands have **no photography at all**: Bestune, Dongfeng, BAIC, Arcfox, BYD.

### The yard film — `#site`

`#site` is a **pinned panel**: a 300vh section (260vh on phone) with a `100svh` sticky inner.
Scroll progress through the section drives everything — the frame eases out of its push
(`--vz` 1.14 → 1.04) and each element carrying `data-at="<0–1>"` toggles `.in` when progress
passes its threshold. `classList.toggle` rather than `add`, so the lines replay on the way
back up. Headline lines are mask reveals (`.ln > b` translating out of an `overflow:hidden`
parent); everything else is a fade-and-rise.

Media order of preference: `assets/site.webm` → `assets/site.mp4` → `assets/building.jpg`
(also the poster) → the labelled placeholder. The video plays only while on screen and holds
its poster frame under `prefers-reduced-motion`.

**Two encoding notes.** The supplied source was 18.2 MB, 1280×720, 24fps, 9.5 Mbps with an
audio track — wildly over-bitrated for a muted background loop. Re-encoded to ~1.7 MB with
`-an`. And **Playwright's bundled Chromium has no H.264 decoder** (`canPlayType` for
`avc1` returns empty, media error 4), so an MP4-only panel cannot be verified in this
sandbox at all. The WebM/VP9 source exists partly so the pipeline is provable here, and
partly because it is smaller for the browsers that take it; Safari falls through to the MP4.

Grade is applied in CSS, not baked in: `filter: saturate(.78) contrast(1.07) brightness(.88)`
pulls the bright flat footage toward the site's cool graphite.

---

## 6. File map

```
buraq/
  index.html            the entire site — markup, CSS, JS in one file
  HANDOFF.md            this file
  robots.txt            points at the sitemap
  sitemap.xml           single URL under buraqalomur.com
  _headers              Netlify/Cloudflare: /assets/* cached 1y, HTML revalidated
  assets/
    logo-lockup.svg     full logo, brand colours
    logo-mark.svg       B plate; favicon
    site.webm           the yard film (VP9, preferred)
    site.mp4            the yard film (H.264, Safari fallback)
    building.jpg        poster frame for the film
    cars/*.jpg          34 showroom photographs
    cars/manifest.json  file → brand → model
```

`index.html` is bracketed by `<!--CONTENT-START-->` / `<!--CONTENT-END-->` sentinels. The Artifact preview is built by extracting between them, dropping the bare `</head>` / `<body>` lines and the `rel="icon"` link, then inlining `assets/cars/*` as base64 data URIs (the Artifact CSP blocks relative and external images).

---

## 7. Everything the client asked for, in order

1. **Base layout, colour, backgrounds** — dark free-zone identity, red slash device, site plan drawn to true proportion (showroom = 1/28th of the yard), distribution map plotted on real bearings from Zarqa.
2. **Section backgrounds should cut** between black-and-red (with an interactive red glow) and off-white, ending dark. → tone system.
3. **"remove the car brands slider its so AI looking"** → removed. Later reinstated in a different form (§5 below).
4. **Staged hero** — words one by one, lock 2 s, scroll → brief, lock 2 s, then free.
5. **A liquid glass section bar** — "the actual clean liquid glass". Floating pill, sliding red indicator, specular rim, cursor-tracked highlight, **re-tints (`.on-light`) as it passes over the off-white sections**. It replaced the top-nav link row and the mobile burger menu.
6. **"this panel after the three words appear is so messed up… remove the established point"** → hero eyebrow removed (it duplicated the rail and the number strip); Arabic name became a single identity line.
7. **"make it phone friendly"** → anchors clear the fixed nav (`scroll-margin-top`), content clears the floating bar, the site plan swaps in-drawing labels for a legend below 820 px, bigger touch targets, safe-area inset, denser fleet matrix.
8. **Car images from Drive + "a couple of images with each brand" + a full-screen building slot.**
9. **The 3D parallax gallery + "the brands scrolling from right and left opposite sides"** → two full-bleed marquees running in opposite directions (`runL` / `runR`), pausing on hover.
10. **Arabic in Almarai.**
11. **The real logo PDF.**
12. **`buraqalomur.com` as the main email/domain** → canonical, Open Graph, Twitter card, schema.org `AutoDealer` JSON-LD, domain in contact block and footer.
13. **Netlify-ready zip named after the company.**
14. **Hero in three beats** — words shrink to the top, then brief, then scroll for the numbers.

---

## 8. Open items

- [ ] **Phone number.** Was a placeholder rendered as a live `tel:` link that dialled nothing — now reads *"To be confirmed"*, and no `telephone` is claimed in the JSON-LD. Restore both when a real number arrives.
- [ ] **Building photograph** → `assets/building.jpg`. Also switch `og:image` to it (currently a showroom car).
- [ ] **Export markets.** The Reach section lists Jordanian governorates from the brief plus "the Arab world". Specific export countries were **not invented** — a visible note says the list is provisional.
- [ ] **The LEVANT AUTOMOTIVE plate** on every car photo — confirm or replace.
- [ ] **Photography for Bestune, Dongfeng, BAIC, Arcfox, BYD.**
- [ ] **Brand logos** — the marquees use typographic wordmarks, not official marks.
- [ ] **Full Arabic / RTL version** with a language toggle. Offered twice, never answered. Currently English with Arabic throughout.
- [ ] **"top right"** for the shrunken hero words — see §3.
- [ ] The client's stated *"the sections and the colour palette"* were never actually sent; both were derived. Worth reconciling if they surface.

---

## 9. Working conventions

**Develop on `claude/buraq-al-omur-website-brxxgx`.** Do not push elsewhere. Commit messages explain *why*, not just what.

**Verify visually before claiming anything works.** There is no test suite; the check is a real browser.

```bash
npm i --no-save playwright-core     # chromium is pre-installed
# executablePath: /opt/pw-browsers/chromium-1194/chrome-linux/chrome
# import from /home/user/main/node_modules/playwright-core/index.mjs
```

Screenshot at **1400×900 and 390×844**. To reach content past the hero, wait ~4.3 s then dispatch a `wheel` event twice (the intro locks scrolling — see §3). Always assert:
`document.documentElement.scrollWidth - window.innerWidth === 0` and zero `pageerror`s.

**Google Fonts do not load in the sandbox** (`ERR_CONNECTION_RESET`), so screenshots show fallback faces. Type *metrics* in screenshots are not trustworthy; layout and colour are.

**Deploy:** zip the contents of `buraq/` with `index.html` **at the archive root** (not inside a wrapper folder, or the homepage lands at `/buraq/`), then drag onto `app.netlify.com/drop`. Cloudflare Pages / Vercel: point at the `buraq` directory with **no build command**.

Note the repo also contains an unrelated **Mallouk Group** Vite/React site at the root (`src/`, `package.json`, `.github/workflows/pages.yml`). That workflow only triggers on a different branch. A repo gets one GitHub Pages site, so publishing Buraq there would collide with Mallouk — use an external host or a separate repo.
