# latənt — brand book

Identity system for Latent Studio (Amman → worldwide), rebuilt panel-for-panel in the
presentation format of the three reference reels from @studio.sevd (Feelgood Lab, Bastu,
Seido), in Latent's own system: INK `#14141A` · IVORY `#F2EFE7` · MARROW `#BB4A2E`, 90 / 9 / 1.

## Deliverables

| Path | What |
|---|---|
| `latent-brand-book.pdf` | 39-page vector PDF, 1920 × 1080 px per page (16:9). Text stays selectable. |
| `pages/NN-name.png` | One PNG per page at 2× (3840 × 2160). Drop straight into a reel, a carousel, or a site. |
| `brand-book-overview.jpg` | Contact sheet of every page. |
| `logo/` | Vector wordmark and symbol as SVG in the three colours (outlines, no font dependency). |
| `images/` | Every photographic frame and mockup used in the book (generated, warm desaturated register). |
| `reference/` | Frame-by-frame breakdown of the three reels: every distinct frame, plus the laptop screen cropped from each so each panel can be read. |
| `book.html` | The whole book as one HTML file (open in a browser to scroll it). |
| `src/build.py` | Generator. Edit copy or layout here, then re-run to regenerate PNGs + PDF. |

## How the reference works (and how this book follows it)

Every page carries the same chrome: brand name top-left, a small `( 01 )` numeral above a
centred section title, the book label top-right, and a centred page number. The content
pages follow the reel's archetypes in the same order:

| # | Reference panel | Latent page |
|---|---|---|
| 01 | Cover: giant "Brand Book" on a full-bleed brand colour, small photo overlapping the headline, one-line description | `01-cover` |
| 02 | Contents: photo strip + dotted-leader list | `02-contents` |
| 03–07 | Chapter opener with photo strip · About (photo / colour split) · Vision (tiny photo, huge negative space) · Moodboard (4 columns) · Concept (2+1 photos around a paragraph) | `03`–`07` |
| 08–15 | Logo suite opener · Main logo · Logo anatomy with callouts · Icon in a box with colour squares · Lockups in colour columns · Logo on photo · Full lockup + tagline · Clear space, minimum size, misuse | `08`–`15` |
| 16–20 | Colour opener · Palette (photo above swatch, HEX/CMYK/RGB) · Ratio · Photographic register (chips over photos) · Textures (4 strips) | `16`–`20` |
| 21–24 | Typography opener · Brand typeface specimen with name/weights/setting · Type annotations (designed hero + spec rows) · Arabic typeface | `21`–`24` |
| 25–26 | Iconography & UI / slides template → system elements and post templates | `25`–`26` |
| 27–38 | Mockups opener · phone triptych · pylon sign board · card in a jacket pocket · storefront · laptop on a plinth · booklet · app icon · tote · poster · tape · shirt | `27`–`38` |
| 39 | Thank you / studio credit | `39-thanks` |

The photographic mockups carry the real wordmark: the vector logo is rendered to a reference
image and the generator is instructed to reproduce it exactly, which it does (see `images/`).

## Rebuild

```bash
python3 brand-book/src/build.py             # book.html, pages/*.png, latent-brand-book.pdf
python3 brand-book/src/build.py --html      # book.html only
python3 brand-book/src/build.py --only=1,5  # re-render just those page numbers
```

Requires a headless Chromium (`headless_shell`) and the open fonts installed system-wide:
Inter / Inter Display, IBM Plex Sans Arabic, IBM Plex Mono. The primary licensed stack
(Söhne Kräftig, GT America Bold, PP Neue Machina) is documented on the typeface page; swap
it in by changing the `font-family` values in `src/build.py`.

## Notes

- The wordmark is set in Inter Display ExtraBold at −4.5 % tracking with the schwa (ə)
  replacing the "e", as specified in the brand bible. To use an existing logo file, drop it
  over `logo/latent-wordmark-*.svg` and `logo/latent-symbol-*.svg` and re-run the build.
- Arabic is set in IBM Plex Sans Arabic, presented as the locked open-licence choice.
