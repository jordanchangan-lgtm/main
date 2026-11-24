# Search, AI search and trust: the fix list every site follows

Source: the OnePoint Solutions audit of latent-studio-ai.com (23 Nov 2026, 53 items, checked across Jordan,
Saudi Arabia, the UAE, the US and Canada with Google, ChatGPT, Perplexity, Gemini, Lighthouse and backlink data).
Everything below is now the standard for every site built in this repo. "Build" items are ours and are checked
by `scripts/site_audit.mjs`; "Owner" items need the client, and the delivery message lists them.

## A. Domain and redirects
- Build: `http://` 301s to `https://` (Cloudflare "Always Use HTTPS"). `www` has a DNS record and 301s to the
  main domain. Any other domain the brand owns 301s to the right page.
- The audit checks both redirects on `--live`.

## B. Indexing basics
- Build: `sitemap.xml` listing every page in every language with `xhtml:link` hreflang pairs, `lastmod`,
  `priority`. `robots.txt` with a `Sitemap:` line. A self canonical on every page. `llms.txt` with the studio
  summary, services, prices per currency, clients and page list.
- Owner: Google Search Console as a Domain property verified by DNS, sitemap submitted; Bing Webmaster Tools
  importing from it. Google Analytics 4 with key events for phone, email, WhatsApp and form clicks, linked to
  Search Console. Give the agency access. Tell the owner these two come first: nothing else can be measured
  without them.

## C. Structure and content
- Build: one page per service (not a one-page site): Home, each service, Work, Prices, About, Contact. On a
  one-page site every service still has a real heading and a section, and the service pages are added next.
- Build: the H1 says what and where ("AI brand visuals, films and websites, directed like film. Amman."); the
  slogan sits above or below it. Titles carry the service and the market, in the page's language.
- Build: prices in plain HTML, visible without a click, in the currency of the market and converted to the
  others (JD, SAR, AED, USD, CAD), with a note that they exclude tax. Never built by JavaScript only.
- Build: a questions block (40 to 60 words per answer) on the home page and on each service page: cost in
  each currency, turnaround, will it look real, does the product stay exact, who owns the files, Arabic,
  revisions, sectors. With `FAQPage` schema.
- Build: six case study pages (problem, what we made, result, link), in both languages, once the material
  exists; until then one in-page case study with real frames.
- Build: a trust line: founder name, area of the city, a domain email (never Gmail), reviews once they exist.
- Build: a WhatsApp link on every page (first contact in Jordan and the Gulf), plus `tel:` and `mailto:`.

## D. Arabic and international
- Build: a full `/ar/` version of every page, right to left, `lang="ar" dir="rtl"`, written for people (a
  strings file reviewed line by line, never machine output). `hreflang` in both directions plus `x-default`.
  `og:locale` per language (`en_GB`, `ar_JO`).
- Build, when the market is in scope: Saudi pages Arabic first with SAR, UAE pages English first with AED, one
  Gulf page, US and Canada pages with USD and CAD plus comparison pages (AI studio vs AI tool, AI photos vs a
  photoshoot). One domain with subfolders, never separate country domains.
- The Arabic typography rules are in `phone-and-arabic-rules.md`.

## E. Structured data
- Build: `ProfessionalService` (name, url, logo, phone, address, `areaServed`, `sameAs` to Instagram, LinkedIn,
  Behance and the Google profile, `hasOfferCatalog`, `makesOffer` with every package and starting price),
  `WebSite`, `FAQPage`, `Service` + `BreadcrumbList` on each service page. Same name, phone, email and site link
  everywhere.

## F. Social sharing
- Build: `og:title`, `og:description`, `og:image` (1200×630 JPG), `twitter:card=summary_large_image`.

## G. Phone speed (targets: Lighthouse mobile performance 90+, LCP under 2.5 s)
- Build: fonts self-hosted as WOFF2 with the two first-screen faces preloaded; no Google Fonts stylesheet.
- Build: the first-screen text is visible within a second (stagger capped), never waiting on an animation.
- Build: CSS and JS in cached files, not inline; HTML under 500 KB; images WebP or AVIF with a year's cache;
  phone hero film under 1 MB, every other film lazy; under 1.5 MB in the first three seconds.

## H. Security
- Build: `_headers` with HSTS, a CSP (`'unsafe-inline'` for script and style when the page uses inline
  drivers, plus any analytics host the zone injects), `X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, `Permissions-Policy`. HTML `max-age=0, must-revalidate`; `/media/*` immutable with
  `! Cache-Control` so the root rule is not inherited. No `http://` resources.

## I. Accessibility and images
- Build: body text and labels at 4.5:1 contrast; scroll-brightened words start no dimmer than 0.45 opacity
  if the Lighthouse contrast audit must pass. Descriptive alt text on every work image: client, piece, what it
  is, by whom.

## J. Google Business Profile and reviews (Owner)
- Ask past clients for reviews (target 10 in 30 days), a second category, Arabic and English descriptions,
  services with prices, work photos, WhatsApp, the area. No profiles in countries without a real address.

## K. Name consistency (Owner, with our schema)
- The same name, phone, email and site link on every profile; rename or unlink stray pages that share the name.

## L. Links (Owner, we draft the asks)
- Credit links on every site we build ("visuals by Latent Studio"), the directories that rank in the market
  (JordanYP, Yellow Pages Jordan, smehub.jo, Sortlist, Entasher, digitalagencies.ae, Clutch, GoodFirms, Behance,
  Dribbble), press and award submissions. Leave spam links alone.

## M. AI search
- Build items 11, 13, 14, 17, 26 and K do the work. Then a monthly check: ask ChatGPT, Perplexity and Gemini
  the "who should I hire" questions per market in English and Arabic, log who is named.

## The test, every time
1. `node .claude/skills/site-delivery/scripts/site_audit.mjs <local url>` for every page in every language.
2. After deploy: the same with `--live` on the live URL, plus `bash scripts/lighthouse.sh <live url>`.
3. Anything FAIL is fixed before the delivery message; the owner items are listed in it with who does what.
