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
| `assets/product/{tank,bra,trouser}-{red,cream,pink,purple}.jpg` | Product shots, one per piece per colour, 3:4. None exist yet; crops of the 360° turn videos would work |

If a file is `.png`, change the extension in `script.js` (`POSTS`, and the
moodboard loop).

## What's on the page

Built on the pattern current fashion sites share (Sporty & Rich, SET,
Girlfriend Collective, Bode): full-bleed photography, a small centred
wordmark, sentence-case type in small sizes, square corners, underlined text links.

1. **Ticker**: a black strip of short lines, each with a set-coloured dot.
2. **Header**: transparent over the hero with the white wordmark, then turns peach with the black wordmark once you scroll past it.
3. **Hero**: full-bleed `red-1`, with a Caveat line and "Shop the set | View campaign".
4. **Split**: Cream and Pink frame 1, edge to edge.
5. **The sets**: four portrait cards. Hovering swaps frame 1 for frame 3. With no photo, a card shows the set as colour blocks (bra, tank, trousers).
6. **Colour story**: a full-screen sticky panel that changes to each set's colour, with one line each, as you scroll.
7. **The pieces**: three product cards with colour dots for switching the colourway.
8. **Campaign**: the 17 prints in a horizontal strip you can drag.
9. **Footer**: an email sign-up, the English wordmark large at bottom-left and the Arabic at bottom-right. No studio credit.

EN / عربي switches the whole page to right-to-left Arabic.
