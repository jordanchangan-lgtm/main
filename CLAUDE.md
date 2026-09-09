# Latent Studio sites — working rules

Three versions of the studio site live here: `latent/` (current design), `latent-v2/` (reference cut, the
portfolio service demo), `latent-v3/` (the mix, the one deployed to latent-studio-ai.com). `latent-wp/` is the
WordPress theme. Keep all of them; edits go to the one named.

## Delivery standard — applies to every website, no exceptions

Read `.claude/skills/site-delivery/SKILL.md` before building or shipping any site. In short:

- Media lives in files, never inline. The HTML stays under 500 KB. `tools/split_media.py` turns a single-file
  build into `index.html` + `media/`.
- The first screen loads first: hero poster preloaded at high priority, only the hero cut this screen shows,
  every other film `preload="none"` and armed when its panel is near, images lazy and low priority.
  Under 1.5 MB in the first three seconds on a phone.
- Films are files (Safari will not play a `data:` video). Every image at its natural ratio, never cropped.
- Phones: no text under 11 px, panels grow with their content, overlays fit and centre their picture.
- Scroll locks only where they carry the story (hero, portfolio). Everything else flows and reveals on scroll.
- Verify in Playwright at 1440×900 and iPhone 13 before every delivery: zero console errors, zero broken
  media, first-three-seconds budget, every panel's content inside its panel, every action link correct.
- Deploy as one folder to Cloudflare Pages with `_headers` (HTML no-cache, `/media/*` immutable). After the
  user deploys, `curl` the live site and confirm the new build is up. Tell them to hard-reload.
- Deliverables: the deploy folder zipped (under 30 MB), the artifact preview built from the single-file
  copy, commit and push on the working branch.
