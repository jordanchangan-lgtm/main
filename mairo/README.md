# Mairo — website (first draft)

Static, no build step. Open `index.html` in a browser, or serve the folder
(`npx serve mairo`). Read `CLAUDE.md` first — it is the brand brief and its
product rules apply to anything on this site.

## Drop the assets in

The page runs without them (empty outlined slots for the wordmarks, colour
blocks for photos), but the real files go here, copied from `Desktop\Mairo`:

| Put here | From |
|---|---|
| `assets/logo/mairo-black.png`, `mairo-ar-black.png` (+ the white pair) | `01 Logo/` |
| `assets/posts/red-1.jpg` … `red-3.jpg` | `02 Posts/Red/` |
| `assets/posts/cream-1.jpg` … `cream-3.jpg` | `02 Posts/Cream/` |
| `assets/posts/pink-1.jpg` … `pink-3.jpg` | `02 Posts/Pink/` |
| `assets/posts/purple-1-eyelevel.jpg`, `purple-2.jpg`, `purple-3.jpg` | `02 Posts/Purple/` |
| `assets/moodboard/01.jpg` … `17.jpg` | `03 Moodboard reel/tiles/` |
| `assets/product/{tank,bra,trouser}-{red,cream,pink,purple}.jpg` (+ `-back.jpg`) | Product shots on a light grey or white ground, 5:7. None exist yet; front and back stills from the 360° turn videos would work |

If a file is `.png`, change the extension in `script.js` (`POSTS`, and the
moodboard loop).

## What's on the page

Modelled on luxury ready-to-wear sites: The Row, Khaite, Toteme, Loewe.
The page is white with black type at 12–13px. Navigation is text only, the
wordmark is centred, photos run full width, product tiles are grey, and
corners are square. Colour comes only from the photos and the small swatch
chips.

1. **Notice bar**: one black line.
2. **Header**: Shop / Sets / Campaign on the left, wordmark in the centre, Search / العربية / Bag (0) on the right.
3. **Hero**: full-bleed `red-1`, with a small caption on the right: "Collection 01", *Midday* in Caveat, and "Shop".
4. **Two-up**: the Cream and Pink sets, each with its name and "Discover" centred underneath.
5. **Collection 01**: a product grid of 12 cards (3 pieces × 4 colours). Each card has the name in uppercase, the colour name and four colour chips. Filters for All / Red / Cream / Pink / Purple. Hovering shows the back view.
6. **Solo frame**: the Purple set, centred on its own.
7. **Campaign**: the 17 prints in a strip you can drag.
8. **Footer**: a thin rule, link columns and a newsletter line ending in ">". The English wordmark sits bottom-left and the Arabic bottom-right. No studio credit.

Prices are empty in `script.js` (`PRICES`); fill them in and they appear.
Product shots go in `assets/product/{tank,bra,trouser}-{set}.jpg`, with the back
view as `…-{set}-back.jpg` for the hover.
