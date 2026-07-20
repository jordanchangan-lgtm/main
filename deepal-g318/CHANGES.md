# Deepal G318 page — design-alignment changes

Corrected build of `Models/EN/G318.aspx` (+ `Assets/Deepal/CSS/G318.css`) to match the
reference design **Web_G318_1.pdf** exactly.

- `G318.html` — corrected page markup (captured from the rendered page, so it includes the
  shared header/footer includes inline). Asset paths are unchanged, so fragments can be
  copied straight back into the ASP.NET source files.
- `G318.css` — corrected stylesheet, drop-in replacement for `/Assets/Deepal/CSS/G318.css`.

Every change below is old → new so it can also be applied by hand to the original source.

## 1. Text / content fixes (markup)

| # | Where | Old | New |
|---|-------|-----|-----|
| 1 | Hero REEV specs | `<strong>135 + 185 kW</strong>` | `<strong>131 + 185 kW</strong>` |
| 2 | Hero specs (EV + REEV) | `<span>0–100 km/h</span>` (en dash) | `<span>0-100 km/h</span>` (hyphen, as in design) |
| 3 | Interior color options (desktop + mobile) | `CAMEL BRWON` | `CAMEL BROWN` |
| 4 | Learn-more Range card (EV + REEV) | `<div class="value">1000 km</div>` | `<div class="value">1,000 km</div>` |
| 5 | Learn-more Range card (EV + REEV) | `<p class="dim">30 - 80% 15min</p>` | `<p class="dim">30 - 80% 30min</p>` |

## 2. Header (markup)

| # | Change |
|---|--------|
| 6 | Removed the `Home` item from the desktop `.main-menu` (design has no Home item; mobile menu untouched). |
| 7 | Added the design's sub-nav items after the model-title link inside `#subMenu`:<br>`<a href="#performance" data-target="performance">Performance</a>`<br>`<a href="#interior" data-target="interior">Interior</a>`<br>`<a href="#tech" data-target="tech">Technology</a>`<br>`<a href="#" class="safety-link">Safety</a>`<br>The existing scroll-spy + underline JS picks them up automatically. Note: the page has no safety section yet, so Safety is a dead link (`#`) until one exists. |
| 8 | Added `class="active"` to `<a href="#hero" id="title" data-target="hero">` so the underline shows on load (previously it only appeared after the first scroll). |
| 9 | Header button text: `Book a test drive` → `Stay up to date` (desktop `.stay-btn`; behavior/JS unchanged). |

## 3. Removed overlay copy not present in the design (markup)

The design shows these four panels as clean imagery with no text. Removed:

| # | Section | Removed block |
|---|---------|---------------|
| 10 | Rear view (`.section--rear`) | `<div class="left-text anim"><p>designed for rough roads, …</p></div>` |
| 11 | Top view (`#tech`) | `<div class="center-text"><p>a rigid tough design, …</p></div>` |
| 12 | Panoramic roof (`#PanoramicView`) | `<div class="left-text-absolute anim"><p>A panoramic glimpse of the wild. …</p></div>` |
| 13 | Interior switch (`#interior`) | `<div id="text" class="interior-text anim"><p>The wrap-around interior of an off roader. …</p></div>` |

## 4. Stylesheet fixes (`G318.css`)

| # | Change |
|---|--------|
| 14 | `.hero__tabs .active` color `#000` → `#b9b9b9` (design shows REEV as a light-gray watermark; color sampled from the PDF). |
| 15 | `.learn-title` — added `color: #5b5b5b`, `opacity: 1` (was near-white at `opacity: .85`; design heading is dim gray on black). |
| 16 | Fixed two malformed `background-image` rules: `url("../../Deepal/Images/G318/MainPageBackground.png") %>") !important` → `url("../../Deepal/Images/G318/MainPageBackground.png") !important` (the stray `%>")` broke the rule, so the hero background never loaded). |
| 17 | Appended a `DESIGN-ALIGNMENT OVERRIDES` block (desktop ≥ 1201px) that re-proportions the hero to the design artboard (1920px): hero height `37.45vw`, title 43px at the design position, REEV beside the title, hr/stat spacing, and the car image sized/positioned to the design. Verified against the PDF at 1920×1080 — title, stats and car body land within ±3px of the design. |

## 5. Known gaps (need assets / decisions — not code)

- **Exterior slider is empty because images are missing on the server**: `ExteriorL1.jpg`
  exists (7 KB placeholder), `ExteriorL2.jpg`–`ExteriorL6.jpg` return **404**. Upload the
  real images to `/Assets/Deepal/Images/G318/` and the existing slider will show them.
  (The design also shows this frame as an empty box with arrows.)
- The performance section is a **video** (`G318.mp4` + play button); the static design
  shows the desert/trailer scene as a plain image. Kept as video.
- The design PDF spells the nav items "Deepla SO5 / SO7 / G318" — treated as a typo in the
  design; the build keeps "Deepal S05 / S07 / G318".
