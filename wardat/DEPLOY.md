# Deploying this site

Hand this folder to whoever is publishing. It is a **static site** — plain HTML,
CSS and JavaScript. There is no build step, no npm install, no server-side code
and no database. Upload the folder; that is the deployment.

---

## 1. What is in the folder

```
index.html            the entire site — markup, styles, scripts, both languages
assets/
  logo-mark.svg       favicon and the logo used in the nav
  hero.mp4 / .webm    hero film     (.jpg is the poster shown before it plays)
  road.mp4 / .webm    closing film  (.jpg is the poster)
  fleet/01–07.jpg     the photographs in the fleet strip
_headers              cache and security headers (Netlify / Cloudflare Pages)
robots.txt            search-engine rules
sitemap.xml           the single-page sitemap
README.md             how the site is built, section by section
VIDEO-DIRECTION.md    how the two films were generated, to remake them later
```

Total weight is about 10 MB, almost all of it the two films.

## 2. Set the domain first

The live domain is written into **five** places. Change all five before going
live, or search engines and social previews will point at the wrong host. The
placeholder throughout is `https://wardat-alzohour.com/`.

| File | Line | What to change |
|---|---|---|
| `index.html` | ~15 | `"url"` inside the JSON-LD block |
| `index.html` | ~37 | `<link rel="canonical" href="…">` |
| `index.html` | ~38 | `<meta property="og:url" content="…">` |
| `robots.txt` | 4 | the `Sitemap:` line |
| `sitemap.xml` | 3 | the `<loc>` value |

Find them all at once:

```bash
grep -rn "wardat-alzohour.com" .
```

Keep the trailing slash and keep it `https://`.

## 3. Publish

**Netlify or Cloudflare Pages** — drag the folder into the dashboard, or point
it at the repository with build command *empty* and publish directory set to
this folder. `_headers` is read automatically by both.

**GitHub Pages** — push the folder contents to the branch Pages serves. Note
that Pages ignores `_headers`; the site still works, only the cache tuning is
lost.

**Ordinary shared hosting / cPanel** — upload the folder contents into
`public_html` over FTP. Nothing else to configure.

Whichever host, `index.html` must sit at the **web root**, so the site answers
at `https://wardat-alzohour.com/` and not at `…/wardat-al-zuhoor/`. The asset
paths inside the page are relative, so the folder can also be served from a
subdirectory if that is genuinely wanted — only the five domain strings above
assume the root.

## 4. Requirements on the host

- **HTTPS.** Both films and the Google Fonts stylesheet load over HTTPS; a page
  served over plain HTTP will have them blocked as mixed content.
- **Correct MIME types for `.webm` and `.mp4`.** Every modern host does this.
  On an old Apache box that does not, add to `.htaccess`:
  ```apache
  AddType video/webm .webm
  AddType video/mp4  .mp4
  ```
- **Range requests** (`Accept-Ranges: bytes`) so the films can stream rather
  than download whole. Default on every mainstream host.
- Outbound access to `fonts.googleapis.com` and `fonts.gstatic.com` from the
  visitor's browser. See §6 if that is a problem in the target market.

Nothing else. No Node, no PHP, no runtime.

## 5. After it is live — check these

- [ ] The language gate appears and both **العربية** and **English** work.
- [ ] In Arabic the page is right-to-left and set in Almarai, and phone numbers
      still read left-to-right.
- [ ] Both films play on an iPhone and on an Android phone. They are muted and
      `playsinline`, which is what lets them autoplay — do not remove either
      attribute.
- [ ] The fleet photographs load on a phone.
- [ ] `https://<domain>/sitemap.xml` and `/robots.txt` resolve.
- [ ] Submit the domain to Google Search Console and hand it the sitemap.

## 6. Two things worth knowing

**Fonts come from Google.** Jost, Inter, Space Mono and Almarai are pulled from
`fonts.googleapis.com`. If the client would rather not depend on Google — or if
access is unreliable on Iraqi networks — download the four families, drop the
`woff2` files into `assets/fonts/`, and replace the two `<link>` tags near the
top of `index.html` with local `@font-face` rules. The page is otherwise
entirely self-hosted. This swap has already been done once for the walkthrough
recordings, so it is known to work.

**There is no share card yet.** `index.html` has a comment where `og:image`
belongs. Until a 1200×630 image is made and referenced there, links shared on
WhatsApp, Facebook or LinkedIn will show a bare title with no picture.

## 7. Editing content later

Everything is in `index.html`. English text sits in the markup; the Arabic
translation for each string lives in the `AR` dictionary near the bottom of the
file, keyed by the `data-t` attribute on the element. **Change a string in one
place and you must change it in the other**, or that line will stay English
when the site is switched to Arabic.

`README.md` explains how each section and animation works, and lists the
details still outstanding from the client (the Mosul street address, and which
of two phone numbers is correct).
