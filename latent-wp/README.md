# Latent Portfolio — the WordPress version

The portfolio stage from the Latent site, as a WordPress theme. Same choreography:
the stage starts ink, each project's pieces lay out in justified rows at their
natural aspect ratio and wipe in one by one, the project names stand stacked on
the right. Nothing is cropped. The difference from the static site: projects are
a post type, so the client adds work from the WordPress admin instead of asking a
developer.

Theme folder: `latent-portfolio/`. Install zip: `latent-portfolio.zip` (Appearance → Themes → Add New → Upload Theme).

## What is in the theme

| Piece | Where | Notes |
|---|---|---|
| "Portfolio" post type | `inc/post-type.php` | One post per project. Ordered by the Order box. Fields: the work, sector, city, year, note, filter word, PDF. |
| Project editor | `inc/meta-boxes.php`, `assets/admin.js` | Details box + a Pieces box: pick images and MP4s from the Media Library, drag to reorder, label each, choose a poster frame for films. Ratios are read from the files. |
| The stage | `inc/render.php`, `assets/portfolio.js`, `style.css` | The same markup, CSS and vanilla JS as the static site. No jQuery, no framework, no page builder. |
| Front page | `front-page.php` | Intro panel → the stage → About panel → contact panel. |
| About panel | `template-parts/about.php`, `page.php` | Any WordPress Page chosen in Customize → Studio → About page. Its text is the panel, its featured image the blurred ground, three credit columns from the Customizer. The page's own URL (`/about/`) shows the same panel. |
| Page template | `template-portfolio.php` | "Portfolio stage" — assign it to any page to get the stage there. |
| Shortcode | `functions.php` | `[latent_portfolio]` drops the stage into any page or builder block. |
| Customizer | `inc/customizer.php` | Appearance → Customize → Studio: tagline, city, email, phone, Instagram, LinkedIn, clock zone, the About page and its three credit columns. |
| Demo importer | `inc/demo.php`, `demo/` | Appearance → Latent demo → one click creates six empty slots (Project 1 … 6) with default plates at mixed ratios, and a placeholder About page. |
| Fonts | `assets/fonts/` | Archivo and IBM Plex Mono served from the theme. No Google Fonts request. |

Requires WordPress 6.4+ and PHP 7.4+. No plugins needed.

## Install

1. Appearance → Themes → Add New → Upload Theme → `latent-portfolio.zip` → Activate.
2. Settings → Reading → "Your homepage displays: A static page" is not required; the theme's `front-page.php` shows the stage on the home URL either way.
3. Appearance → Latent demo → Import the demo: six empty slots named Project 1 to 6 with default plates, so the stage has a shape. Rename them and swap the plates for the client's pieces, or delete them.
4. Appearance → Customize → Studio: put in the studio's own name, tagline, email, links.
5. Settings → Media: nothing to change. Large MP4s need `upload_max_filesize` on the host to allow them (most hosts: 64–256 MB).

## The About page

Write it as an ordinary WordPress Page (Pages → Add New): title, a few paragraphs, a featured image for the ground. Then Appearance → Customize → Studio → About page: pick it. The three credit columns under the text are Customizer textareas; the first line of each is the heading.

## Adding a project

Portfolio → Add project. Title is the brand. Fill the details. In Pieces, "Add pieces" opens the Media Library: select images and films together, then drag the cards into order and give each a short label ("Poster 01", "Film · 9:16 · 0:20"). The first piece leads the project. For a film, "Poster frame" picks the still shown before it plays. Optional: choose a PDF to link under the project. Publish. The stage picks the project up in the order set in Post Attributes → Order.

## How it differs from the static site

- Media is served from the Media Library as files instead of being inlined in the HTML, so the page is small and films stream.
- The theme prints its own `<head>` and drops the block-library CSS, the emoji script and the admin-bar bump, so the sticky stage owns the viewport.
- Everything in the stage reads from post meta, so there is no build step.

## Local run used for the demo

The demo screenshots and recording show the six default slots on WordPress 7.1 with the SQLite Database Integration plugin, PHP 8.4, headless Chromium at 1440×900 and iPhone 13. Films show their poster frames in the recording because headless Chromium ships without H.264.
