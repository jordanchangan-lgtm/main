---
name: cinematic-animated-websites
description: The way the Latent Studio site (latent-v3e) was designed and animated — the design principles, the section recipe from hero to contact, and the scroll mechanisms (word brightening on a run, line masks, side wipes, the blinds cut, pinned lists, the staircase, the gathering sentence, the composer). Use whenever a new website or a new section should be built in this same way: cinematic, scroll-driven, direction-first. Not a template to copy; the method and the working code to build from.
---

# Cinematic animated websites — the Latent method

This is how the Latent Studio site was made, saved so the next site is made the same way. It is not about
copying the Latent sections. It is the rules, the rhythm and the working mechanisms. Read it all before
building; then read `site-delivery` for how it ships.

The three files in `references/` are the real code from the live build, not illustrations:

- `references/drivers.js` — every scroll driver on the site, plain JS, one IIFE per mechanism.
- `references/patterns.css` — the section CSS: runs, cuts, masks, wipes, lists, the phone rules.
- `references/check.mjs` — the Playwright check run before every delivery.

The build sources of the site itself live in `latent-v3-src/` (the `v3_*.py` builders, `v3_cases2.js`,
`v3_css8.css`, the `e_patch_*.py` patches on the built page, and `checks/` with the contact sheets).

## 1. The principles (do not bend these)

1. **Direction first.** Every panel is one decision: one thing on screen, one thing moving, one idea read.
   If a panel has two ideas, it is two panels.
2. **The scroll is the timeline.** Nothing plays on a timer. The page scroll drives every reveal, every wipe,
   every brightening, so the reader is the editor. Scrolling back replays everything in reverse.
3. **Runs, not slides.** Content flows on long runs — the dark run, the white run — and arrives as the reader
   reaches it. Pinning (sticky) is used only where it carries the story: the hero, a pinned list, a giant
   sentence. Never pin a paragraph.
4. **Cuts, not fades.** Dark to white and white to dark happen on a hard cut: the blinds (eight bars closing
   from alternating sides) or a wipe. No cross-fades between sections. The ground changes colour like a cut
   in a film.
5. **Text is cinematic.** Big statements brighten word by word as they rise. Headlines rise through line masks.
   Labels are mono, small, uppercase, placed in corners like film slates. Kickers are bold lines in the
   display face, uppercase, never bracketed mono.
6. **Pictures open, they do not appear.** A picture wipes open widthwise from its own side (right, then left,
   alternating), on a window short enough that one scroll reveals it whole, smoothed frame to frame. It closes
   back the same way as it leaves.
7. **Annotation micrography.** Pictures that explain the work carry a layer of small squares, leader lines
   with arrowheads and mono labels (light, lens, ratio notes like 60 · 30 · 10). They draw once the picture is
   open. Labels never leave their picture.
8. **Asymmetry over symmetry.** Alternate sides. Stagger. Offset. A staircase beats a grid.
   Two columns out of step beat two columns aligned.
9. **Two colours and one accent.** Ink (#14141A) and ivory (#F2EFE7) or white, with marrow (#BB4A2E) and
   ember (#D4633F) as the only accents. Archivo for display, IBM Plex Mono for labels. Nothing else.
10. **Phones get the same film.** Same order, same mechanisms, same two-column layouts where they fit, text
    never under 11 px, nothing clipped at an edge, every panel's content inside its panel.
11. **Every animation goes both ways.** What rises when scrolled to lifts out as it leaves at the top, and
    comes back when scrolled to again.

## 2. The vocabulary of mechanisms

Each has working code in `references/drivers.js` and CSS in `references/patterns.css`. Names below are the
class hooks the drivers look for.

| Mechanism | What it does | Hooks |
|---|---|---|
| Word brightening on a run | A statement's words go from 14% to full as the line rises; `--p` counts words lit, `--q` fades it out at the top | `.js-bright`, `.bw` spans with `--i` |
| Word gather | Words arrive from random offsets with blur and settle, driven by the line's position | `.js-path .js-words`, `.cw` with `--dx --dy --i` |
| Line mask rise | Each word sits in an overflow-hidden mask and rises up into view, staggered | `.hm > .hm-in` (hero), `.pgw > .pgw-in` (lists), `.ty2-stack` (type block) |
| Side wipe | A picture opens widthwise from its side via `clip-path: inset(...)`, smoothed by easing toward a target each frame | `.js-wp-img` in `.wp-step.right/.left`, `.js-sk-img` |
| The blinds cut | Eight bars close from alternating sides to change the ground colour | `.blinds.js-blinds > i`, `.rev` for the reverse |
| The universal reveal | Anything `.rv` rises when in view, lifts out as it leaves, returns on the way back | `.rv`, `.in`, `.out`, `--k` for stagger |
| Pinned list | A sticky stage; the scroll picks one item at a time; the list slides to keep it centred; a description and a picture swap with it | `.js-td`, `.js-td-item`, `.js-td-desc` |
| The staircase | Pictures each further right, lower and smaller, opening from the right; sentences pinned left, brightening with their picture | `.js-sk`, `.js-sk-step`, `.js-sk-li` |
| Gap lines | A line's left words slide in from the left, right words from the right, a picture opens between them then squeezes shut | `.js-gp-line`, `.gp-l .gp-tile .gp-r` |
| Giant sentence | One line wider than the screen scrolls right to left through a pinned stage, each letter settling onto the baseline | `.js-gs-line`, `.gc` |
| Annotations | Squares, lines with arrowheads and labels draw once the picture is open; labels measured and nudged inside | `.an`, `.an-sq .an-ln .an-ar .an-lb`, `.an-on` |
| The composer | A chat-style box; submit opens a mailto with the typed text in the body | `.js-cb-box`, `.js-cb-idea` |

How the drivers are written, every time:

- One IIFE per mechanism. It finds its section by a `js-` class and returns if absent, so any subset ships.
- Scroll handling is `requestAnimationFrame`-throttled; positions are read with `getBoundingClientRect`.
- Progress comes from the element's position in the viewport, never from time. A reveal window is a fraction
  of `innerHeight` (for example from 92% down to 80%), so one scroll reveals a thing whole.
- Anything that should feel filmed is smoothed: keep a `cur` and a `t`, move `cur += (t - cur) * .16` per
  frame until they meet.
- Reduced motion is honoured: `prefers-reduced-motion` shows everything settled.
- Resize re-measures. Fonts ready re-measures.

## 3. The section recipe (the Latent order)

Build a new site in this order, swapping content, keeping the rhythm. Every section is one panel.

1. **Hero, pinned, one scroll.** Film behind, poster preloaded. Text rises through line masks in order.
   Two layouts exist: the editorial plate (mono top row, headline top left, year over the subject, two
   columns of small copy split by thin rules with tab labels, notes in the corners) and the wordmark (name
   huge across the width, a mono line, the ask as a pill). Scrolling lifts the lines away.
2. **The statement, dark run.** Starts only after the hero is fully gone. One statement brightening word by
   word, three mono corner notes, then a marquee of the three values. Keep it under two screens.
3. **The blinds cut to white.**
4. **A bold intro line** ("Six moves. One order. Every job.") gathering on the white run, close to what follows.
5. **How it works, the staircase.** Six pictures with annotations; sentences pinned left. About two screens.
6. **The film panel, dark**, with "What we skip." in bold.
7. **What we make, the pinned list** on white: side words left, the numbered description centred, the eight
   words right, one bright at a time with its thumbnail. On phones the thumbnail shows under the description.
8. **Our work**, a bold list of the studio's own projects, each row a link, a picture floating beside the row
   under the pointer.
9. **The craft**, a short bold statement gathering on the same white run.
10. **The blinds cut to dark. Four moves as gap lines.**
11. **The price line** ("Priced inside the market.") gathering, then the ask rising through masks
    ("Have something in mind? Let's generate."), then the composer that opens the email.
12. **Contact.**

Kickers everywhere are bold lines, not `( Bracketed )` mono labels. Mono is for notes, counters, slates.

## 4. Type and layout numbers that worked

- Display statements: Archivo 500–600, `clamp(28px, 4.6vw, 68px)`, line-height 1.08, letter-spacing -.035em,
  max 22ch. Bold section lines: 600, uppercase, `clamp(34px, 5.6vw, 84px)`, max 14–16ch.
- Mono labels: IBM Plex Mono 11px, letter-spacing .14–.16em, uppercase. Never under 11px on a phone.
- Gutter: `clamp(20px, 5vw, 64px)`. Picture radius: `clamp(10px, 1vw, 16px)`.
- Reveal window: top enters at 92% of the viewport, fully open by 80%; closes between 22% and 4% on the way out.
- Smoothing factor .16 per frame. Easing `t*t*(3-2*t)` for wipes; `cubic-bezier(.76,0,.24,1)` for cuts;
  `cubic-bezier(.19,1,.22,1)` for mask rises; `cubic-bezier(.2,.8,.2,1)` for settles.
- Staircase: step k is `58% - k*4%` wide, shifted `k*8.4%` right; on phones `100% - k*5.5%` and `k*5.5%`.
- Pinned list: hold height = `100svh + items * 55vh`; active item = `floor(progress * N)`.

## 5. Building and checking (the loop that never changes)

1. Build the page (the Latent sources are `latent-v3-src/v3_build.py` and the `v3_*.py` section modules; a
   new site can be hand-written against the same CSS and drivers).
2. Split media out of the single file (`tools/split_media.py` or `latent-v3-src/v3_split.py`); the deploy
   folder is `index.html` + `media/` + `_headers`.
3. Build the single-file preview for the artifact (`latent-v3-src/e_preview.py <deploy-dir> <out.html>`).
4. Serve the deploy folder locally and run `references/check.mjs` at 1440×900 and iPhone 13: zero page
   errors, zero broken media, first three seconds under 1.5 MB, no phone text under 11px.
5. Capture contact sheets of every changed panel on both sizes and look at them. Measure overlaps and
   overflow with `getBoundingClientRect`, do not trust the eye alone.
6. Zip the deploy folder (under 30 MB), copy sources into the sources folder, commit and push, republish the
   artifact with its URL, send the zip and the sheets.

## 6. Things that went wrong once and must not again

- A preview built from a stale single file: always confirm the published copy carries the new markup.
- Thumbnails that took room in list rows pushed the list off screen on short windows: keep decorations out of
  the flow (absolute), and reserve room for them explicitly.
- Build-time placement of scattered pieces overlapped text on other screen sizes: compute placement in the
  browser against the real text box, seeded so it is stable.
- A full-screen `min-height` on a light section left a screen of white under a short intro: short runs get
  `min-height: 0`.
- Annotation labels ran off small pictures: measure after layout, nudge inside, wrap only when wider than
  the picture.
- `.pm`, `.sc`, `.pl` collided with base classes: prefix new section classes uniquely.
- Playwright `innerHeight` is only defined inside `page.evaluate`.
