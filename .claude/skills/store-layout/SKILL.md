---
name: store-layout
description: Build an online store landing page and shop page in the layout of modern beauty and cosmetics stores (Rhode, Sulwhasoo, Glossier, Tatcha, Aesop), bilingual Arabic-first when asked, Shopify-ready. Use whenever the user asks for a store, shop, e-commerce site, product landing page, or "the store layout / store skill".
---

# Store layout

The layout below comes from studying modern beauty stores: Rhode, Sulwhasoo, Glossier and Tatcha. Follow the section order exactly. Fill it with the client's brand: colours, type and voice come from their brand book, never from here. For the motion, load the `latent-motion` skill.

Reference build: `sudqi-planet/` in this repo. Use `index.html`, `shop.html`, `assets/js/{shop-config,catalog,main,home,shop}.js` and `assets/css/style.css` as working code to copy from.

## Before building
1. **Read the brand book completely.** Take the palette, the typefaces and the voice from it, plus taglines and approved copy you can quote.
2. **Get the real products.** Read the names off the product photos and labels. Then search the web for each product (size, key ingredients, texture, how to use) and write the descriptions from what you find. Never invent products. If prices are not given, show "Price soon" (`price: null`).
3. **Use the client's own photos and films first.** Brand-book images are only a fallback. Portrait films become hero panels.
4. **Use the stores' layout, not your own.** If the user says to follow a reference, follow it and add nothing of your own.

## Landing page — section order
1. **Announcement bar.** A thin night-coloured strip with 2–3 rotating messages (authenticity, gift wrapping, new arrivals). It hides on scroll down.
2. **Header.** Main links on the start side (Shop · New in · Collections · By concern · Ritual), the logo in the centre, and on the end side the language toggle and a bag icon. It is transparent over the hero, then pearl with a blur after the hero.
3. **Hero.**
   - With portrait films: three side-by-side panels on desktop, one full-bleed panel on phones.
   - With wide images: a carousel. Each slide has a kicker, a headline and a CTA, plus separate desktop and mobile images.
   - The copy sits at the bottom start: kicker pill, a giant headline, a line with a word cycle, a primary and a ghost CTA, and the brand names.
4. **New in rail.** A horizontal rail of product cards with drag, arrow buttons and a progress bar. Tabs switch between **New in** and **Bestsellers** (Tatcha pattern). End it with a "Shop all" link.
5. **Collections.** An index list with a number, a large name, a product count in superscript, a short description and an arrow. On desktop a preview image floats with the cursor; on phones each row shows a thumbnail. Include both brand lines and concerns.
6. **Brand statement.** A night section with a sticky stage, where the story sentence brightens word by word as the reader scrolls.
7. **Shop by concern.** Four image tiles (Dryness, Sensitivity, Impurities, Protection…). Each has a number and name, and on hover a line and an arrow appear (Sulwhasoo pattern).
8. **Bestsellers rail.**
9. **Ritual.** A sticky arched picture on one side and three tall steps on the other. Each step has a number, a big verb, a sentence and a link to the real product for that step. The picture changes with the step in view.
10. **Unboxing or gift band.** Night ground, a film or photo of the packaging, a heading, a sentence and a CTA.
11. **Trust strip.** Four cells: authentic, gift-wrapped, clear ingredients, secure checkout.
12. **"Explore more".** A giant heading, the logo, an orbiting dot and a CTA to the shop page.
13. **Footer.** Brand, Shop links (built from collections), About links, contact details, a giant wordmark line, then © and the mark.

## Shop page
- A night hero with breadcrumbs, a giant "Shop" title and a lede.
- A strip of collection tiles that act as filters. The image fades in on hover or when active, and the filter is kept in `#hash` so links like `shop.html#sun` work.
- A sticky bar with the active collection's name and a product count.
- A 4-column grid (3 at tablet width, 2 on phones).
- A launch note that appears when the shop is not yet connected.

## Product card
- A 4:5 image, with a second image fading in on hover.
- A badge (New / Bestseller), and an **Order now** capsule that slides up on hover and is always visible on touch screens.
- Below the image: `brand · type & size`, the name (a button that opens quick view), a one-line tagline and the price.

## Quick view drawer
- It slides in from the end side.
- The gallery opens with clip reveals; the details rise in one after another.
- Details: brand, name, type, price, description, key ingredients, how to use, and **Order now**.

## Data — one config file (`shop-config.js`)
- `storeDomain`, `storefrontToken`, `storefrontUrl` and `currency`.
- `hero`: films or slides.
- `collections`: `{id, tag, kind: brand|concern|edit, ar, en, desc, image}`.
- `products`: `{handle, brand, collections[], bestseller, badge, name, type, tagline, desc, key, how, price, image, hover, gallery[]}`.
- `catalog.js` loads Shopify Storefront GraphQL (`@inContext(language: AR/EN)`) when a token is set, and falls back to the config otherwise.
- Product tags map to collections. "Order now" uses the cart permalink `https://{domain}/cart/{variantId}:1`.

## Bilingual (Arabic first)
- Every string is written twice: `<span class="ar">…</span><span class="en">…</span>`. CSS hides the inactive language.
- Text in the other script inside a line gets `.keep` plus `direction`/`unicode-bidi: isolate`.
- `dir` and `lang` are set in `<head>` before paint, from `?lang=` or localStorage. Use logical properties everywhere (`inset-inline`, `padding-inline`).
- Arrows flip in RTL, and rails scroll with a sign that depends on `dir`.

## Publishing as an artifact
- Strip doctype, `<html>`, `<head>` and `<body>` from the page. Keep `<title>` (a short name), the fonts and the stylesheet links.
- Move the body's `data-title-*` attributes onto a `<div>`.
- Publish the other files through `files`. Use `#hash`, not `?query`, for state between pages.
- Images and films ship as published files, with videos re-encoded at roughly 150–500 KB each (`ffmpeg -an -crf 27 -movflags +faststart`).
