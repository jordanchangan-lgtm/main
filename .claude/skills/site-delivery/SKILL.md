---
name: site-delivery
description: The delivery standard for every website built in this repo — media as files not inline, hero-first load order, Safari-safe films, phone and Arabic layout rules, the search, AI-search and trust fix list (sitemap, canonical, hreflang, schema, prices in HTML, WhatsApp, speed, security headers), the one audit script that runs the same tests on every site, and how to ship to Cloudflare. Use before building, changing or shipping any site, in any language.
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

## 6. Search, AI search and trust (every site, every language)

The 53-item audit of the Latent site is now the standard. Read `references/search-and-trust-fixlist.md`
before planning any site; the short form:

- One page per service, plus Work, Prices, About, Contact. H1 says what and where; the slogan is not the H1.
  Titles and descriptions per page with the service and the market.
- Prices in plain HTML, no click, in the market's currency and converted (JD, SAR, AED, USD, CAD), excl. tax.
- Questions block with `FAQPage` schema on the home page and each service page. Case study pages when the
  material exists. A trust line: founder, area, domain email. WhatsApp, `tel:` and `mailto:` on every page.
- Full Arabic version of every page (`/ar/`, `dir=rtl`, written strings file), `hreflang` both ways plus
  `x-default`, `og:locale` per language. Market pages when in scope, always subfolders on one domain.
- `ProfessionalService` with `sameAs`, offers and the catalog; `WebSite`; `Service` + `BreadcrumbList` on
  service pages. `og:image` and a Twitter card. `sitemap.xml`, `robots.txt` with the Sitemap line, `llms.txt`.
- Self-hosted fonts, CSS and JS in cached files, WebP, films lazy; HSTS, CSP, frame and content-type headers;
  `/media/*` immutable with `! Cache-Control`. Alt text on every work image. Contrast 4.5:1.
- The owner items (Search Console, GA4, Business Profile, reviews, profile consistency, links, directories)
  go in the delivery message with who does what. Search Console and GA4 come first.

## 7. Phone and Arabic layout

`references/phone-and-arabic-rules.md` holds the rules learned on the Latent site: one column with air on
phones for anything that was two narrow columns, pictures never over text and capped to their column, a
static footer, the nav at 11 px, masks with room for Arabic marks, logical margins and reversed marquees on
the right-to-left page, the language choice on the hero. Apply them on every build, in both languages.

## 8. Verify before every delivery

Playwright with the pre-installed Chromium (no H.264: films show posters, that is expected):

- Run the audit on every page in every language, local first, then live:
  `node .claude/skills/site-delivery/scripts/site_audit.mjs http://127.0.0.1:PORT/` and
  `... https://the-site/ --live`, same for `/ar/` and each service page. Every line must be PASS.
  It checks: console errors (normal and reduced motion), failed requests, broken images, first-three-seconds
  budget, one armed film, text under 11 px, horizontal scroll, pictures over text, title and description
  lengths, H1, canonical, hreflang, Open Graph and Twitter, locale, lang and dir, JSON-LD, prices in HTML,
  WhatsApp, phone and email, alt text, self-hosted fonts, HTML and inline size, WebP, mixed content, Arabic
  mask clipping; and on `--live` the redirects, security headers, media cache, sitemap, robots and llms.
- `bash .claude/skills/site-delivery/scripts/lighthouse.sh <live url>`: mobile performance 90+, SEO 100,
  accessibility 95+, best practices 90+, LCP under 2.5 s.
- Desktop 1440×900 and iPhone 13 by eye as well: walk every locked stage state and every panel, a contact
  sheet of every screen in both languages, content inside its panel, no overlap, bar on one line. Open a film
  then a still in the overlay: still centred, film hidden. Every action link has the right target.
- After deploy: `curl` the live URL, confirm the new build is served, run the live audit, tell them to
  hard-reload.

## 9. Ship

- Deploy from here when the owner has given a Cloudflare token (Workers assets: `wrangler deploy` with a
  config naming the service; it replaces every asset, so the folder must hold every page the site serves).
- Zip the deploy folder (index.html, `_headers`, `media/`, every page folder), under 30 MB, send it.
- Republish the artifact from the single-file copy (read the artifact first if the publish is refused).
- Commit from the repo root on the working branch and push.
