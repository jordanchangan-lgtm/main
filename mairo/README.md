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

If a file is `.png`, change the extension in `script.js` (`POSTS`, and the
moodboard loop).

## What's on the page

1. **Hero** — peach ground, English mark above Arabic, centred.
2. **The set** — Red / Cream / Pink / Purple tabs. Picking one recolours the
   section, the swatches and the three pieces below, and swaps in that set's
   carousel frames.
3. **The pieces** — tank, bra, trousers, one flat line each, in the active set's colours.
4. **Moodboard** — the 17 prints, pinned at slight angles.
5. **Footer** — English mark bottom-left, Arabic bottom-right. No studio credit.

EN / عربي toggle in the header flips the page to RTL. Headlines use Caveat
(English) and Aref Ruqaa (Arabic, since Caveat has no Arabic); body text uses
Inter / IBM Plex Sans Arabic.
