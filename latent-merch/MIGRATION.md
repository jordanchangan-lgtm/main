# Migration Brief — porting latent_merch.html into this app

The existing prototype is a single-file HTML storefront (`latent_merch.html`, ~v9) with all assets
base64-inlined. It is the design source of truth. Port it into React components — match the visuals
exactly, then make them dynamic against the catalog.

## Step 1 — get the prototype into the repo
Drop `latent_merch.html` at the repo root (or /reference). Read it in full before porting. The visual
language and exact timings live in its CSS/JS — replicate, don't reinvent.

## Step 2 — extract assets out of base64
The HTML inlines everything as base64. Pull these out into real files:
- Garment MP4s (the rotating/360 spin videos) -> Supabase Storage, reference by URL.
- Hero model images (tee + hoodie hero shots, background already removed) -> Supabase Storage or /public.
- Decode each base64 blob, save with a real extension, upload. Don't keep base64 in React — it bloats
  bundles and kills caching.

## Step 3 — map visual features to components
Port these named features from the prototype (they are the brand, keep them faithful):
- **Jade void hero** — procedural animated CSS background. Keep as CSS (cheap, GPU-friendly); wrap entry
  in framer-motion.
- **Cloudy ink panels** — animated CSS panel backgrounds with scroll-triggered transitions.
- **Rotating MP4 garment showcase** — video-based 360 spin per product. Component: `<GarmentVideo />`.
- **X-ray hover reveal** — hover effect swapping/overlaying garment layers. Component: `<XrayReveal />`.
- **Scroll-reveal sequencing** — staggered entrance of cards/sections. Rebuild with framer-motion
  `whileInView` + stagger (replaces the prototype's hand-rolled scroll-poll / Lenis workaround).
- Watch the **card animation clipping** issue from the prototype — fix with proper overflow/transform
  contexts in the component, don't carry the workaround over.

## Step 4 — make it dynamic
Replace hardcoded products with catalog reads from Supabase (`products` + `product_variants`).
Each product card -> its variants -> add to cart -> checkout (see CLAUDE.md commerce flow).

## Animation decision rule
- Procedural/ambient backgrounds (jade void, ink panels): keep as CSS.
- Entrance, scroll-reveal, stagger, page transitions: framer-motion.
- Don't animate the same property in both CSS and framer-motion — pick one owner per effect.
