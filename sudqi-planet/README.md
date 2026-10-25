# Sudqi Planet — صدقي بلانيت

A minimalist editorial store site built from the *Lunar Pearl* brand book.
It is plain HTML, CSS and JS with no build step, so it can be hosted anywhere (GitHub Pages, Netlify, Vercel, or Shopify's own domain).

| Page | What it is |
| --- | --- |
| `index.html` | The landing page: hero, about (01), collection (02), real skin, ritual (03), how we choose (04), unboxing (05), then **استكشفي المزيد / Explore more**, which opens the store |
| `shop.html` | The store page: category chips, the product grid and a gift bundle. It connects to Shopify |

## Language
- Arabic is the default (`dir="rtl"`). English is one click away through the **EN / عربي** button in the header.
- The choice is saved in the browser and carried through links. `?lang=en` also opens a page in English.
- Every string is written twice, as `<span class="ar">…</span><span class="en">…</span>`. Only the active language is shown.
- Headlines (`.dual`) follow the brand hierarchy and show both languages: the active one first, the other underneath in a smaller size.

## Brand system (from the brand book)
- Colours: Night `#17151C`, Pearl `#F3F0F2`, Lilac Haze `#DCD3E6`, Champagne `#D9C4A1` and Plum `#4A2F45`. They are set as CSS variables in `assets/css/style.css`.
- Typefaces: IBM Plex Sans Arabic for Arabic and Outfit for English, both loaded from Google Fonts.
- `assets/img/symbol.svg` is the q-planet symbol, redrawn as a vector. `.mark` uses it as a mask, so it takes any colour.
- `assets/img/orbit-field.svg` is the orbit field pattern. The CTA is the capsule with a small planet, and section tags are pills with a champagne moon.
- All photography is cropped from the brand book. Replace it with real product shots when you have them, keeping the same file names or updating the paths.

## Connecting Shopify
Open `assets/js/shop-config.js`. There are two levels:

1. **Link only (no API).** Set `storefrontUrl` (for example `https://sudqiplanet.myshopify.com`) and give each sample product the `handle` of the matching Shopify product. **Order now** and **Details** then open that product on Shopify.
2. **Live catalogue (recommended).** Set `storeDomain` (`your-store.myshopify.com`) and `storefrontToken`, a *public* Storefront API token from Shopify admin → Settings → Apps and sales channels → Develop apps, or from the Headless channel. The store page then loads:
   - the real products, prices, images and stock, with sold-out items shown automatically;
   - Arabic and English titles and descriptions, through Shopify **Translate & Adapt**;
   - the collection for each product, taken from product **tags**. The tags match the `tag` values in `shop-config.js`: `new`, `dr-althea`, `beauty-of-joseon`, `clinique`, `hydration`, `calm`, `cleanse`, `sun` and `body`. A `new` tag also adds a "جديد / New" badge, and a `bestseller` tag puts a product in the Bestsellers rail.

   **Order now** uses a Shopify cart permalink, so the customer goes straight to Shopify checkout.

Until Shopify is connected, the page shows the five products listed in `shop-config.js`, with "Price soon" in place of a price. Add a `price` (a number in JOD) to each product to show it. If a customer clicks **Order now** at that stage, they see a short note that sends them to Instagram.
