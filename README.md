# Changan Jordan — Connected Brand Landing Site

A single-page app presenting three connected car brands — **Changan**, **Deepal**,
and **Nevo** — under one hub, for the Jordan market (Mallouk Group).

Built with **React 18 + Vite**, Framer Motion, Three.js / react-three-fiber, GSAP,
and `cobe` (the location globe). All content is **data-driven** from one config file,
so most edits are copy/asset swaps — no component surgery.

---

## Quick start

```bash
npm install        # install dependencies (Node 18+)
npm run dev        # local dev server (hot reload)  -> http://localhost:5173
npm run build      # production build  -> ./dist
npm run preview    # serve the built ./dist locally
```

Node **18+** is required (see `netlify.toml`).

---

## Routing

Hash-based routing (no server rewrites needed — works on any static host):

| URL              | Screen                                        |
|------------------|-----------------------------------------------|
| `#/home`         | Brand hub (ocean hero + brand selector)       |
| `#/changan`      | Changan landing page                          |
| `#/deepal`       | Deepal landing page                           |
| `#/nevo`         | Nevo landing page                             |
| `/` (no hash)    | Legacy Mallouk Group homepage (`src/App.jsx`) |

The production entry (`index.html` → `src/main.jsx`) serves the legacy homepage at
`/` and the brand experience under the hashes above. The self-contained preview
entry (`preview.html` → `src/preview-main.jsx`) opens straight on the hub.

---

## Project structure

```
index.html                 production entry (loads src/main.jsx)
preview.html               single-file preview entry (loads src/preview-main.jsx)
vite.config.js             standard multi-file build (outputs ./dist)
vite.singlefile.config.js  inlines everything into one preview.html (./dist-single)
netlify.toml               Netlify build config (command + publish dir)

src/
  main.jsx                 hash router (production)
  preview-main.jsx         hash router (preview)
  index.css                global reset + @font-face (AVATR) + site font
  App.jsx                  legacy Mallouk homepage
  brands/
    brands.js              ← ALL brand content/config lives here (edit this)
    Hub.jsx                the hub: ocean hero + brand selector (logos)
    BrandLanding.jsx       generic brand page (intro → models → globe → CTA)
    BrandIntroScene.jsx    scroll-locked hero → description
    BrandLocation.jsx      the interactive location globe + showrooms
    BrandSwitcher.jsx      persistent brand switcher pill
    useMobilePanelGate.js  mobile: brief per-panel scroll gate for animations
    useViewport.js         responsive helper (isMobile)
    ui/                    reusable effects (FocusRail, glass, blur text, …)
    assets/                all images, logos, and fonts
```

## Editing content

Almost everything is in **`src/brands/assets`** + **`src/brands/brands.js`**:

- **Model line-up**, descriptions, hero words, showroom list, phone/hours, and
  per-brand theme colors are all fields on the `CHANGAN` / `DEEPAL` / `NEVO`
  objects in `brands.js`.
- To swap a model photo, drop the new file in the matching
  `assets/<brand>-models/` folder and point the `import` at it.
- The three hub brand emblems are `assets/changan-logo-white.png`,
  `deepal-logo-white.png`, `nevo-logo-white.png` (white, transparent). They render
  in a shared square box (`Hub.jsx`) so all three read at the same visual size.

### Theme
All three brands currently share one palette (deep-navy background, grey accents,
white type) defined per-brand under `theme` in `brands.js`. Change the `accent` /
`accentBright` values to recolor eyebrows, labels, the switcher pill, and the CTA.

### Typography
The site font is **AVATR** (`src/brands/assets/fonts/AVATRFont-{Light,Regular,Bold}.woff2`),
wired up via `@font-face` in `src/index.css`. Normal text → Regular, bold → Bold,
thin display headings → Light. (The font has no "Black" weight, so the big brand
words render in Bold.)

---

## Deploying to Netlify

**Option A — drag & drop the built site (fastest):**
1. `npm run build`
2. Drag the generated **`dist/`** folder onto app.netlify.com → *Add new site → Deploy manually*.

**Option B — connect the Git repo:** Netlify reads `netlify.toml` automatically
(`command = "npm run build"`, `publish = "dist"`, Node 18). No SPA redirect rules
are needed because the app uses hash routing.

A pre-built, ready-to-upload `dist/` is also provided as a zip in the handoff.

---

## Pending items (to be supplied by the client)

These are the only open placeholders — everything else (car photography, fonts,
copy, showrooms) is final:

1. **Official brand logo files** — the current `*-logo-white.png` emblems are
   working white versions. If official vector/hi-res brand logos are available,
   drop them into `src/brands/assets/` (white, transparent PNG or SVG) with the
   same names and rebuild.
2. **CTA destination links** — the "Dive into <brand> world" button at the bottom
   of each brand page currently has no destination. Add a `worldUrl` field to each
   brand in `brands.js` (e.g. `worldUrl: "https://…"`) and the button will link there.
3. *(Optional)* The **Changan "The Brand" gallery** still uses general Changan
   model photos (UNI-K/T/V, CS75, CS55, Alsvin); swap for preferred imagery if desired.
