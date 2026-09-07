# latənt — brand book

Identity system for Latent Studio (Amman → worldwide), built as a landscape deck in the
"brand book on a laptop" format seen in the three reference reels (@studio.sevd), but in
Latent's own system: INK `#14141A` · IVORY `#F2EFE7` · MARROW `#BB4A2E`, 90 / 9 / 1.

## Deliverables

| Path | What |
|---|---|
| `latent-brand-book.pdf` | 35-page vector PDF, 1920 × 1080 px per page (16:9). Text stays selectable. |
| `pages/NN-name.png` | One PNG per page at 2× (3840 × 2160). Drop straight into a reel, a carousel, or a site. |
| `logo/` | Vector wordmark and symbol as SVG in the three colours (outlines, no font dependency). |
| `images/` | The six generated photographic frames used in the book (Ink world / Ivory world). |
| `brand-book-overview.jpg` | Contact sheet of every page. |
| `book.html` | The whole book as a single HTML file (open in a browser to scroll it). |
| `src/build.py` | Generator. Edit copy or layout here, then re-run to regenerate PNGs + PDF. |

## Sections

01 the studio · 02 the principles · 03 the mark · 04 colour · 05 typography ·
06 the image system · 07 applications · 08 voice · 09 the grid

## Rebuild

```bash
python3 brand-book/src/build.py          # writes book.html, pages/*.png, latent-brand-book.pdf
python3 brand-book/src/build.py --html   # book.html only
```

Requires a headless Chromium (`headless_shell`) and the open fonts used in the book installed
system-wide: Inter / Inter Display, IBM Plex Sans Arabic, IBM Plex Mono (Manrope, Geist and
Almarai are referenced as alternates). The primary licensed stack (Söhne Kräftig, GT America
Bold, PP Neue Machina) is documented on the typography page; swap it in by changing the
`font-family` values in `src/build.py`.

## Notes

- The wordmark is set in Inter Display ExtraBold at −4.5 % tracking with the schwa (ə)
  replacing the "e", exactly as specified in the brand bible. If you have an existing logo
  file you prefer, drop it over `logo/latent-wordmark-*.svg` and `logo/latent-symbol-*.svg`
  and re-run the build; every page references those files.
- Arabic is set in IBM Plex Sans Arabic, presented in the book as the locked open-licence
  choice. TT Rounds Neue Arabic and Greta Arabic are listed as licensed upgrades.
- The business-card mockup maps the symbol onto the photographed card with a real
  perspective transform (`matrix3d` in the build), so it sits in the photo rather than on it.
