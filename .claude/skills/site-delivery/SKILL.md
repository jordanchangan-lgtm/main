---
name: site-delivery
description: The delivery standard for every website built in this repo — media as files not inline, hero-first load order, Safari-safe films, phone text and layout rules, the Playwright checks to run, and how to ship to Cloudflare Pages. Use before building, changing or shipping any site.
---

# Site delivery standard

Learned the hard way on the Latent site: a 14 MB single-file page meant ten seconds of black on a phone,
films that Safari refused to play, and tiles laid over text. None of that ships again.

## 1. Files, not inline

- Build however you like, but the deployed page is a small `index.html` (under 500 KB) plus a `media/` folder.
- `python3 tools/split_media.py <single-file.html> <out-dir>` does it: every large `data:` image or video
  becomes `media/NN-<hash>.<ext>`, references are rewritten, `_headers` is written.
- Keep the single-file build only for the artifact preview (the artifact sandbox blocks external files).

## 2. Load order (the hero first)

- `<link rel="preload" as="image" fetchpriority="high">` for the hero poster, one per breakpoint.
- Hero video: `preload="none"` and `data-src`; a tiny inline script sets `src` on the cut the screen
  actually shows and calls `load()`. A hidden `<video>` still downloads, so never leave two cuts armed.
- Every other film: `preload="none"`, `data-src`, armed by an IntersectionObserver with
  `rootMargin: 150% 0px`. No `autoplay` attribute on anything below the first screen.
- Images below the first screen: `loading="lazy" decoding="async" fetchpriority="low"`.
- Budget: under 1.5 MB requested in the first three seconds on a phone.

## 3. Films

- Files, never `data:` URIs. Safari needs byte-range requests and refuses inline video.
- Two cuts of a hero film when the framing differs: 16:9 desktop, 9:16 phone, same source, same loop.
- Posters for every film. Muted, `playsinline`, looped.

## 4. Phones

- No text under 11 px. Labels 11, small body text 12–13.
- A panel is as tall as its content: `min-height: 100svh; height: auto`, never a fixed height that clips.
- Locked stages: the text column keeps one height across states, tiles are laid out from measured
  geometry and re-laid on a ResizeObserver of the media area and the text column.
- Grids that are two columns on desktop stack on phones. Check every panel for overlap.
- Overlays: the picture keeps its own ratio, `max-width/max-height: 100%`, centred; hidden siblings
  `display: none` (the `[hidden]` attribute loses to a `display: block` rule).

## 5. Interaction

- Scroll locks only on the hero and the portfolio. Other panels flow and reveal on scroll.
- Anything that looks like a card is a real `<a>`: packages link to a prewritten `mailto:` with the
  choice in the subject and body.
- Honour `prefers-reduced-motion`.

## 6. Verify before every delivery

Playwright with the pre-installed Chromium (no H.264: films show posters, that is expected):

- Desktop 1440×900 and iPhone 13. Zero `pageerror`, zero failed requests, zero broken images.
- Walk every locked stage state and every panel: content inside its panel, no overlap, bar on one line.
- First-three-seconds bytes on the phone viewport under the budget; only one hero cut has a `src`.
- Open a film then a still in the overlay: still centred, film hidden.
- Every action link (`mailto:`, PDFs, external) has the right target.
- After the user deploys: `curl` the live URL, confirm the new build is served, tell them to hard-reload.

## 7. Ship

- Zip the deploy folder (index.html, `_headers`, `media/`), under 30 MB, send it with its md5.
- Republish the artifact from the single-file copy (read the artifact first if the publish is refused).
- Commit from the repo root on the working branch and push.
