# latənt — brand book

Identity system for Latent Studio (Amman → worldwide), rebuilt page for page from the
Feelgood Lab brand book in https://www.instagram.com/p/DcbLjZatZ0W/ (all 35 frames read,
see `reference/`), in Latent's system: INK `#14141A` · IVORY `#F2EFE7` · MARROW `#BB4A2E`.

Every image is generated inside those three colours, the way the reference keeps every frame
in burgundy, and every image is about what Latent does: real skin with pores and freckles,
one hard light, an empty studio with no camera, film grain, ivory paper, one rust-red object.

## Deliverables

| Path | What |
|---|---|
| `latent-brand-book.pdf` | 35-page vector PDF, 1920 × 1080 px per page (16:9). Text stays selectable. |
| `pages/NN-name.png` | One PNG per page at 2× (3840 × 2160). |
| `brand-book-overview.jpg` | Contact sheet of every page. |
| `logo/` | Vector wordmark and symbol as SVG in the three colours (outlines, no font dependency). |
| `images/` | Every photographic frame and mockup used in the book. |
| `reference/` | Frame-by-frame breakdown of the reference reels, with the laptop screen cropped from each frame. |
| `book.html` | The whole book as one HTML file. |
| `src/build.py` | Generator. Edit copy or layout here, then re-run to regenerate PNGs + PDF. |

## Page map (reference page → Latent page)

| Ref | Reference panel | Latent |
|---|---|---|
| 01 | Cover: giant "Brand Book", small photo overlapping, one-line description | `01-cover` |
| 02 | (01) Contents: image strip + dotted leaders | `02-contents` |
| 03 | (02) The Story: photo left, colour right with paragraphs | `03-story` |
| 04 | (03) Mission: dark, tiny photo, paragraph | `04-mission` |
| 05 | (04) Vision: light, tiny photo, paragraph | `05-vision` |
| 06 | (05) The Mood: four numbered photo columns | `06-mood` |
| 07 | (06) Logo Suite: texture strip | `07-logo-open` |
| 08 | Main logo | `08-logo-main` |
| 09 | Logo anatomy with callouts, dark | `09-logo-anatomy` |
| 10 | Icon in outline box + three colour squares | `10-logo-icon` |
| 11 | Logo lockups: three colour columns | `11-logo-lockups` |
| 12 | Applications: four columns incl. pattern | `12-logo-applications` |
| 13 | Wordmark over photo | `13-logo-photo` |
| 14–16 | Full lockup + tagline (two pages), clear space | `14`–`16` |
| 17 | (07) Colours & Textures: abstract strip | `17-colour-open` |
| 18 | Colour palette: 3 × 2 blocks with HEX / RGB / CMYK | `18-colour-palette` |
| 19 | Colour palette with pairing dots and roles | `19-colour-pairings` |
| 20 | Textures: four vertical strips | `20-colour-textures` |
| 21 | (09) Typography: strip | `21-type-open` |
| 22 | Header font: big sample, name / weights / setting | `22-type-header` |
| 23 | Body font: paragraph sample, name / weights / setting | `23-type-body` |
| 24 | Type in use: designed layout on photo + spec rows | `24-type-inuse` |
| 25 | (10) Mockups: strip | `25-mock-open` |
| 26 | Three phones on the brand colour | `26-mock-phones` |
| 27 | Debossed wordmark | `27-mock-embossed` |
| 28 | Poster with wordmark over a face | `28-mock-poster` |
| 29 | Booklet held in a chair | `29-mock-booklet` |
| 32 | Card on a tray → card on black stone | `30-mock-card` |
| — | Pylon sign board (added) | `31-mock-pylon` |
| — | Business cards (added) | `32-mock-cards` |
| 33 | Wordmark over a two-panel photo | `33-mock-twopanel` |
| 34 | Tape with the repeated wordmark | `34-mock-tape` |
| 35 | Thank you | `35-thanks` |

## Rebuild

```bash
python3 brand-book/src/build.py             # book.html, pages/*.png, latent-brand-book.pdf
python3 brand-book/src/build.py --html      # book.html only
python3 brand-book/src/build.py --only=1,5  # re-render just those page numbers
```

Requires a headless Chromium (`headless_shell`) and the open fonts installed system-wide:
Inter / Inter Display, IBM Plex Sans Arabic, IBM Plex Mono. The primary licensed stack
(Söhne Kräftig, GT America Bold, PP Neue Machina) is documented on the header-font page; swap
it in by changing the `font-family` values in `src/build.py`.

## Notes

- The wordmark is set in Inter Display ExtraBold at −4.5 % tracking with the schwa (ə)
  replacing the "e", as specified in the brand bible. To use an existing logo file, drop it
  over `logo/latent-wordmark-*.svg` and `logo/latent-symbol-*.svg` and re-run the build.
- Mockups carry the real wordmark: the vector logo is rendered to a reference image and the
  generator reproduces it exactly.
