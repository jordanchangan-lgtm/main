# Mairo — brand brief

Everything a fresh session needs to work on Mairo. Written to be read first, before
any code or generation. If something here conflicts with a newer instruction from
Laith, he wins.

---

## The client

**Mairo** is an activewear label. Latent Studio (Laith, Amman) produces its campaign.

**Latent Studio branding never appears on Mairo work.** No Latent logo, no `ə`, no
studio URL, no credit page, no "what's next" slide. Not in the images, not in the
proposal, not in the website footer. This is absolute.

Copy voice is short, flat and declarative — four to six words, full stop, no
exclamation. "One panel. Nothing crosses." / "The back. One piece." / "Fold
everything. Nothing creases." Arabic, when used, is formal MSA, never colloquial.
No emojis, no hashtags.

---

## Logo

A handwritten wordmark, drawn once in English and once in Arabic (مايرو). Thin,
even, single-weight stroke — it reads as marker on paper, not as a typeface.

| File | What it is |
|---|---|
| `01 Logo/mairo-logo-card.jpg` | The client's original card — peach ground, both wordmarks |
| `01 Logo/mairo-black.png` | English wordmark, black, transparent, 470×71 |
| `01 Logo/mairo-white.png` | English wordmark, white, transparent |
| `01 Logo/mairo-ar-black.png` | Arabic wordmark, black, transparent, 339×113 |
| `01 Logo/mairo-ar-white.png` | Arabic wordmark, white, transparent |

The English and Arabic marks are used **together** as a pair, English above Arabic
and centred, or English bottom-left and Arabic bottom-right of a frame. Never
stretch, never re-letter, never set the name in a real font as a substitute.

**Brand ground colour: `#F0AB96`** — the peach of the logo card and the paper
shopping bag. This is the one colour that belongs to Mairo itself rather than to a
product colourway. Use it as the site's warm neutral field.

---

## Product

Three pieces. Every one of these rules came from a client correction, so none of
them are negotiable.

**Asymmetric tank** — one wide strap over the wearer's LEFT shoulder, and a single
bound diagonal edge sweeping down to under the RIGHT arm. The right shoulder is
bare apart from the bra strap showing.

**Racerback sports bra** — wide scoop front, thick smooth under-band. The back is
**one single solid closed panel** covering the whole upper back, tapering to one
narrow strap at the nape. No keyhole, no gap, no crossing straps, no X. This was
wrong four times before it was right.

**Wide-leg trousers** — genuinely wide, falling full and broad to the floor and
breaking over bare feet. Completely plain: no pockets, tabs, patches, stripes or
drawstring, and **no vertical centre seam or crease** front or back. The fold-over
waistband is wide and sits **high at the natural waist, just above the navel**.

### Colourways

| Set | Bra + waistband | Trousers | Tank | Wordmark ink |
|---|---|---|---|---|
| Red | `#D8382C` | navy `#1E2A47` | aqua `#80E0E6` | near-black navy |
| Cream | ivory `#F3ECE4` / `#F2EBE3` | black `#1B191A` | taupe `#AB907B` | soft dark grey |
| Pink | rose `#F698AC` / `#F28FA4` | wine `#4D151B` | burgundy `#49121F` | white |
| Purple | orchid `#D178D8` / `#D27BDA` | black `#181617` | lime `#E2EBBE` | black |

### Wordmark on the garment

**Back only.** Fronts are completely plain. It appears exactly twice: centred on the
spine on the **bra's under-band strip** (below the seam, above the hem) and centred
on the spine on the **back of the fold-over waistband**.

**Width = 21% of that band's width.** Measured off the client's product photos. It
has been too big and mis-placed more than once — when in doubt, smaller.

---

## Look

The campaign is **shiny, sunny and bright**. Hard midday Mediterranean sun,
whitewashed plaster, saturated true colour, one crisp black shadow per frame. Not
moody, not dusk, not neon. An earlier purple set was shot at night and rejected for
exactly this reason.

Every generated frame carries the realism block:

> Highly visible realistic skin texture, defined pores, natural micro-detail,
> subtle uneven texture, slight redness, natural tonal variation, visible knuckle
> creases and veins on the hands, slight facial asymmetry, natural flyaway hairs.
> Untouched high-resolution RAW capture, strong micro-contrast, natural sebum
> sheen. **Do not smooth, airbrush, beautify or soften the skin.**

Plus one hard light source with a real direction, 85mm at f/2, mild vignette,
halation on the highlights, 35mm grain, framing a few degrees imperfect. Airbrushed
skin and directionless light are what made earlier frames read as AI.

**No low-from-behind or rear-focused angles.** Laith's words: "this is not a porno."
High angled camera looking down, eye level, and side-on are all fine.

Model is locked: the same East Asian woman across every frame — identical face, long
straight black hair, slim build, barefoot.

The locked identity reference is `assets/model/model-ref.png` (front, three-quarter,
profile) and `assets/model/model-ref-faces.png` (face close-ups). Attach both to every
generation. Edits on an old image keep the old face; build the frame from the
reference instead. Barefoot always, even though the reference wears trainers.

Films play start to end and restart; no start=end loops. Real handheld camera and
natural body movement.

---

## Typography

Campaign lines are set in **Caveat** — a handwriting face chosen because it sits
close to the logo's stroke while staying readable. It is a Google Font, so it drops
straight into a website: `Caveat`, weights 400–700.

The proposal book uses the AVATR typeface for body copy. That is a licensed
automotive face and should **not** go on the website. For web, pair Caveat (headlines
and pull quotes only) with a clean neutral grotesque for everything else.

---

## What exists

Folder: `Desktop\Mairo`

```
01 Logo/          wordmarks + the original logo card
02 Posts/         four carousels, one folder per colourway
  Red/            red-1..3 + MAIRO-red-set.jpg  (+ red-2-alt-realism.png)
  Cream/          cream-1..3 + sheet
  Pink/           pink-1..3 + sheet
  Purple/         purple-1-topview, purple-1-eyelevel, purple-2, purple-3
                  + a sheet for each of the two versions
03 Moodboard reel/
  tiles/          17 numbered prints, board order
  MAIRO-moodboard-board.jpg      the whole board as one tall image
  MAIRO-moodboard-endcard.png    the frame the reel lands on
  MAIRO-moodboard-reel.mp4       14s vertical scroll down the board and back
  MAIRO-moodboard-popup.mp4      10.5s, prints land on the logo card then peel off
replacement-prompts.md            the six prompts behind the newest tiles
```

Each carousel is three frames: a model in a location whose palette echoes the set, an
object or place still-life with the wordmark stamped dead centre, and the weirdest
angle. Frames 1 and 3 carry a vertical Caveat line plus the English wordmark
bottom-left and the Arabic bottom-right.

There are also four 360° turn videos, one per colourway — front, side, back in one
locked-off shot. They exist but were never saved to disk; ask Laith.

---

## The website

Client note, verbatim: **"Funky, colorful, minimalist (website)"**. Also on that
list: "Look for mairo domain."

Nothing else about the site has been decided — no stack, no page list, no copy, no
domain. Treat the four colourways, the peach ground and the 17 moodboard prints as
the raw material and ask Laith before assuming structure.

Two things that are already settled: the site is bilingual English and Arabic, and
the product rules above govern any render, mockup or illustration of the garments
that appears on it.

---

## Working rules with Laith

- One complete self-contained prompt per image. Never a shared "lock block" plus
  fragments to assemble. When a prompt uses reference images, list what each
  attachment is, in order, at the top of the prompt.
- When an image already exists and only part of it is wrong, write a short
  edit-only instruction on that image. Do not re-describe and regenerate the whole
  scene.
- Generative edits rewrite faces and frames. Use them only when the garment must be
  rebuilt in 3D. Anything that must not move — seams, wordmark placement, cleanup —
  is composited locally instead.
- He works in short, directive messages and expects the professional detail to be
  filled in without a round of questions. Flag accuracy problems proactively.
- Deliverables go to his Desktop, organised, not just into the chat.
