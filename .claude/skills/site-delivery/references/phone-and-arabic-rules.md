# Phone and Arabic rules, learned on the Latent site

## Phones (under 820 px)
- Two narrow columns are a mess on a phone. A section that is text beside a list, or text beside pictures,
  becomes one column with air: the counter and its line, the picture, then the list. Keep desktop untouched.
- A picture never shares pixels with text. Thumbnails are capped to their column (`width:100%;
  max-width:100%; height:auto; max-height`), scaled whole, never cropped. Pictures that bleed to the screen
  edge use `margin-inline-end`, never `margin-right` (it points into the text on a right-to-left page).
- The nav fits the width at 11 px: drop a link on phones if it must (the work is one scroll away).
- The footer credit is a static last line on phones, never a fixed bar over the content.
- A sticky list must end above the viewport bottom on an iPhone SE (568 px) as well as an iPhone 13; measure
  it after `document.fonts.ready`, not at load, or the Arabic font is not in yet.
- Short screens (`max-height: 620px`) get more top room in pinned sections so counters never sit on headings.
- Stage overlays (hero text over film): the text column keeps one height across states.

## Arabic (`html[dir=rtl]`)
- A full page, not a block: every string in a strings file (`ar_strings.py` pattern: a dict of English to
  Arabic, plus attributes, title, description), the build translates text nodes and attributes, mirrors the
  hero film and the hero plate positions, and swaps the two halves of any "word · tile · word" line.
- Fonts: IBM Plex Sans Arabic 400/500/600/700 self-hosted; `letter-spacing: 0` and `text-transform: none`
  everywhere; Latin labels that must stay mono are re-declared with `!important` after the global rule.
- Masks clip marks. Every mask that reveals text gets room above and below on the Arabic page:
  inline-block word masks `padding: .3em .05em .34em; margin: -.3em -.05em -.34em`, with the hidden state
  pushed further (`translateY(170%)`, `-170%` on the way out) so nothing peeks. Block stacks get
  `line-height: 1.6`. The audit measures each masked box against the text's real ascent and descent.
- Physical offsets become logical: `left/right`, `margin-left/right`, `padding-right`, `object-position`
  are re-declared with `inline-start/end` or mirrored values on the Arabic page.
- A marquee that slides left starts off-screen on a right-to-left page and vanishes for half its cycle:
  reverse the keyframes (`translateX(50%)`) under `html[dir=rtl]`.
- Form controls: `select` and inputs get `line-height: 1.6` and padding on both sides so marks are not cut.
- Letter-by-letter effects become word-by-word in Arabic (letters must stay joined): a `__ch()` helper that
  splits on words when `lang=ar`.
- A language choice before the hero: on the hero film, in the hero's own type and weight, the hero text hidden
  until the choice, remembered in `localStorage`, the same language fades the gate and replays the hero, the
  other language navigates. One `@font-face` for the Arabic word on the English page.

## Phone checks that catch the above
- `scripts/site_audit.mjs` walks the page in screen steps and flags any picture over text, any text under
  11 px, any horizontal scroll, any Arabic mask shorter than its letters.
- Always also look: a contact sheet of every screen (the walk saves screenshots) is read before delivery.
