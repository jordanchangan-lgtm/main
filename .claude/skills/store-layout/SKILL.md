---
name: store-layout
description: Build an online store landing page and shop page in the layout of modern beauty and cosmetics stores (Rhode, Sulwhasoo, Glossier, Tatcha, Aesop), bilingual Arabic-first when asked, Shopify-ready. Use whenever the user asks for a store, shop, e-commerce site, product landing page, or "the store layout / store skill".
---

# Store layout

The layout below comes from studying modern beauty stores: Rhode, Sulwhasoo, Glossier and Tatcha. Follow the section order exactly. Fill it with the client's brand: colours, type and voice come from their brand book, never from here. For the motion, load the `latent-motion` skill.

Reference build: `sudqi-planet/` in this repo. Use `index.html`, `shop.html`, `assets/js/{shop-config,catalog,main,home,shop}.js` and `assets/css/style.css` as working code to copy from.

## Before building
0. **Check the length.** Count the sections before you build. If two sections show the same products or make the same point, cut one.
1. **Read the brand book completely.** Take the palette, the typefaces and the voice from it, plus taglines and approved copy you can quote.
2. **Get the real products.** Read the names off the product photos and labels. Then search the web for each product (size, key ingredients, texture, how to use) and write the descriptions from what you find. Never invent products. If prices are not given, show "Price soon" (`price: null`).
3. **Use the client's own photos and films first.** Brand-book images are only a fallback. Portrait films become hero panels.
4. **Use the stores' layout, not your own.** If the user says to follow a reference, follow it and add nothing of your own.

## Landing page — keep it short
The landing page is a front door, not a catalogue. **Every section must say something no other section says.** For a small catalogue (under about 15 products) use only these five, in this order:

1. **Hero.** One campaign image (desktop and mobile versions), with a kicker, the headline, a word-cycle line, a primary CTA (shop now → the products section) and a secondary CTA (packages).
2. **Products.** All single products in **one** rail. No New/Bestseller tabs and no second rail of the same items. End with a link to the store.
3. **Packages or sets.** Only if the brand sells bundles. Show the price with the original struck through and the saving.
4. **Brand story.** One statement that brightens as the reader scrolls. This is the only place the brand voice gets a full paragraph.
5. **Explore more.** A giant heading and the CTA to the shop page.

Then the footer. Put the announcement bar (2–3 rotating messages, such as "prices include delivery") and the header (Shop · Products · Packages · About, plus language and bag) on top.

**Do not add** collections indexes, shop-by-concern tiles, bestseller rails, ritual steps, gift bands or trust strips to the landing page when they repeat the same products or the same message. Collections and filters belong on the shop page. Add one of those sections only when the catalogue is large enough that it shows something new, and never more than one.

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
