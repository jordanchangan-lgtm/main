---
name: store-website
description: End-to-end process for building a store website (landing page + shop page) from a client's brand identity — read the brand book, study the best modern stores in that category, identify the real products and research them, generate one consistent studio photoshoot in Krea, build a short bilingual (Arabic-first) editorial landing page and a filterable Shopify-ready shop with Latent motion (word reveals, clip-panels, curtain wipes, brightening statement, hover index with floating preview), test on desktop and phone, publish as an artifact, and ship a Cloudflare Pages bundle with long-cache images. Use whenever the user asks to create a store, shop, e-commerce site, product website or online store for a brand.
---

# Store website: from brand book to live store

Reference build: **Sudqi Planet** (skincare, Amman). The `template/` folder next to this file holds its full working code:
- `index.html` and `shop.html`;
- `assets/css/style.css` and `assets/js/{shop-config,catalog,main,home,shop}.js`;
- `tools/build.py` and the `README.md`.

Start every new store from that template and re-skin it. Do not start from a blank page.

Companion files, which you must read before the steps that need them:
- `references/motion.md`: the Latent motion system (text and panel animations, and their order).
- `references/images.md`: the Krea photoshoot process.
- The `writing-prompts-and-generating` skill, before any image generation.

## Ground rules (learned the hard way)
- **Do what the user asks, not your own ideas.** When they name a reference ("like Latent", "study the famous stores"), actually open and study it before building. If something is missing (products, images, prices), build with marked placeholders and ask for it in one line.
- **Never copy the brand book's pages onto the website.** The brand book supplies colours, type, logo, voice and motifs. The site's layout comes from real stores in the category.
- **Keep the landing page short.** Five sections; no two may say the same thing.
- **Copy must scale.** Store-level text never says how many products there are ("five pieces") or limits their origin ("Korean beauty") unless the client says that is the store's identity. Product-level text may name a product's real origin.
- **One photoshoot.** Every product image, angle, hover and gallery shot shares the same studio background. No leftover wooden-table or phone photos.
- **Always test the phone version before saying you're done.** If you didn't, say so plainly.
- **Never show the client's cost prices.** Price notes often include them (for example "سعره علي").

## 1 · Brand intake
Read the whole brand book, every page. Extract:
- **Palette:** hex values. Assign 60/30/10:
  - **ground (60%):** the lightest neutral;
  - **surfaces (30%):** the secondary colour, plus night for depth;
  - **accent (10%).**
- **Typefaces:** usually an Arabic face and a Latin face. Load them from Google Fonts if available.
- **Logo:** redraw it as SVG. Use it as a CSS mask (`.mark`) so it takes any colour.
- **Motif:** a pattern or shape to reuse, such as Sudqi Planet's orbit field and planet plinth.
- **Taglines and approved copy:** quote them as given; don't paraphrase.
- **Voice:** for example, addressing the customer in the Arabic feminine.

## 2 · Study the category
Before designing, fetch 4–6 leading modern stores in the client's category with WebFetch and note how each one structures its pages. For beauty, these were Rhode, Sulwhasoo, Glossier and Tatcha; Aesop blocks fetching. For fashion, coffee, perfume and so on, pick that category's leaders. Record:
- section order;
- how new launches and collections are shown;
- product card anatomy: badge, hover image, quick-add button, tagline, price, compare-at price;
- the header and announcement bar;
- the bundle or offer pattern;
- the footer.

Take the **structure** from them. Colours, type and voice still come from the brand.

## 3 · Products: real, researched, priced
1. **Identify the products** from the client's photos and videos. Zoom into the labels with ImageMagick crops.
2. **Research each product** on the web: size, key ingredients or materials, texture, how to use, who it suits.
3. **Write the copy** in both languages: a short tagline, a type and size line, a description, key ingredients, how to use. Never invent claims. Where retailer listings disagree, write the conservative version.
4. **Add prices only from the user.** Note whether prices include delivery and say so on the site ("شامل التوصيل"). Bundles get `compareAt`, shown struck through with a savings chip. If the user's arithmetic doesn't add up (the was-price ≠ the sum of the items), use their number and flag it.
5. **Use the user's product names.** If a box's wording differs from their name, use theirs and mention the difference.
6. **Put all data in `shop-config.js`:**
   - `collections`, each with `{id, tag, kind: brand|concern|edit, ar, en, desc, image}`;
   - `products`, each with `{handle, brand, collections[], featured, bestseller, badge, name, type, tagline, desc, key, how, price, compareAt, image, hover, gallery[]}`.

## 4 · Imagery
Follow `references/images.md`:
- one Krea studio set in the brand palette, by 60/30/10;
- product-locked from the real photos;
- 3 angles per product: main, close-up with texture, flat lay;
- a hero for desktop (16:9) and phone (9:16);
- package shots.

Test one image before running the batch. Check every edge for leaked backgrounds.

## 5 · Landing page: five sections, in this order
1. **Hero (light editorial):**
   - **Image:** the campaign image fills the top ~78% of the hero and fades into its own floor colour. On phones, it's the 9:16 version, full height.
   - **Copy, on the floor below the products:** a kicker pill, then a giant headline (the brand tagline) that rises word by word, then a line with a word cycle.
   - **Buttons:** the primary CTA (Shop now → products) and a line-style CTA (Packages).
   - **Brand line:** built from the data — the first 3 brands, then "& more".
2. **Who we are:** the brand story as one statement on night, inside a sticky stage that brightens word by word as the reader scrolls. The brand comes **before** the products.
3. **Products (hover index):**
   - Rows: number · brand · name · tagline · price · arrow.
   - Hovering a row fills it with the secondary colour, and a 4:5 product image floats with the cursor.
   - Clicking a row opens the quick view.
   - On phones, each row shows a thumbnail instead.
   - Show the `featured` products first, at most 8. Link to the shop with a live count.
4. **Packages and sets:** cards with the compare-at price and savings. Include only if the brand sells bundles.
5. **Explore more:** night ground, a giant heading, the logo, a dot orbiting on an SVG path, and a CTA to the shop.

Then the footer: brand, Shop links built from collections, About, Products and Packages links, contact details, a giant tagline that rises in, and ©.

**Above all of it:**
- **Announcement bar:** night ground, 2–3 rotating messages (authentic · prices include delivery · gift wrapping). It hides on scroll down.
- **Header:**
  - **Start side:** About · Products · Packages · Shop.
  - **Centre:** the logo.
  - **End side:** the language toggle and the bag.
  - **On phones:** a menu button opens a night sheet with the links and collection chips. The header icons turn light there.

**Do not add** collections indexes, shop-by-concern tiles, bestseller rails, ritual steps, gift bands or trust strips when they repeat the same products or message. Collections and filters live on the shop page.

## 6 · Shop page
- **Hero:** night ground with the orbit field, breadcrumbs and a giant "Shop" title.
- **Collection strip:** a row of collection tiles that act as filters. The image fades in on hover or when active. The filter is kept in `#hash`, so `shop.html#sun` works from any link.
- **Sticky bar:** the collection title and a live count.
- **Product grid:** 4 columns, 3 on tablet, 2 on phone. Cards have:
  - a 4:5 image, with the close-up fading in on hover;
  - a badge;
  - an "Order now" capsule that slides up on hover and is always visible on touch screens;
  - `brand · type`, the name (a button that opens quick view), the tagline and the price.
- **Quick-view drawer:**
  - it slides in from the end side;
  - the gallery opens with clip reveals; on phones it becomes a horizontal swipe gallery with explicit image heights, and the grid needs `grid-auto-rows: max-content`, or the gallery collapses;
  - it shows the description, key ingredients, how to use, the price with "delivery included", and Order now.
- **Opens at the top:** the shop page always starts at the top (`history.scrollRestoration = "manual"` plus `scrollTo(0,0)` on load and after render).
- **Before Shopify is connected:** a "launching soon" note that points to Instagram.
- **Shopify:** `catalog.js` loads the Storefront API (`@inContext(language: AR/EN)`, `compareAtPriceRange`, `vendor`). Product tags map to collections, and "Order now" uses the cart permalink `https://{domain}/cart/{variantId}:1`.

## 7 · Motion
Apply `references/motion.md` everywhere, following its choreography:
- **Headlines:** words rise out of masks (`data-split`).
- **Everything else:** rises out of a blur (`.rv`).
- **Colour changes:** curtain wipes (`.wipe` with `--prev`).
- **Images:** clip-path reveals (`.clip`).
- **Hero load:** the image clips open, then a slow breathe, then the kicker, the headline words, the line and the CTAs.
- **Story section:** the scroll-scrubbed brightening statement.
- **Products:** the hover index with the floating preview.
- **Cards:** rise in, staggered 0.08s.
- **Drawer:** clip-reveal gallery, then the details stagger in.

Always include `prefers-reduced-motion` fallbacks.

## 8 · Bilingual, Arabic first
- Write every string twice: `<span class="ar">…</span><span class="en">…</span>`. CSS hides the inactive language.
- `.dual` headlines and `.keep` spans isolate the direction of the other script.
- `lang` and `dir` are set in `<head>` before paint, from `?lang=` or `localStorage`.
- Use logical CSS properties throughout. Flip arrows in RTL. Rails and drawers respect direction.
- Arabic is never animated letter by letter; split it by word only.

## 9 · Test
Before reporting, run Playwright on desktop (1440×900) and on `devices['iPhone 13']`, in both languages:
- scroll each page fully;
- open the menu sheet and the quick view;
- hover the index;
- click "Enter the store" from the bottom of the page and confirm the shop starts at the top;
- check `scrollWidth` equals the viewport width (no sideways scroll);
- confirm there are no console errors and no 4xx responses;
- look at every screenshot.

Fix what you find, then re-test.

## 10 · Publish and ship
- **Artifact preview:**
  - Strip the page's doctype, `<html>`, `<head>` and `<body>`. Keep `<title>`, fonts and the CSS link.
  - Move the body's `data-title-*` attributes onto a `<div id="sp-body">`.
  - Publish with the rest of the files through `files`, using `null` for removed files.
  - Use `#hash`, not `?query`, for state.
- **Cloudflare Pages:** run `python3 tools/build.py`. It:
  - converts images to WebP;
  - puts a content hash in every asset's file name;
  - writes `_headers` with `Cache-Control: public, max-age=31536000, immutable` on `/assets/*` and `max-age=0, must-revalidate` on the pages;
  - adds hero preloads;
  - checks every reference;
  - writes a zip.

  Test `dist/` in the browser, then give the user the zip and these steps: Workers & Pages → Create → Pages → Upload assets → Custom domains.
- **Commit and push** the source, `tools/build.py` and a copy of the zip in `releases/`.
