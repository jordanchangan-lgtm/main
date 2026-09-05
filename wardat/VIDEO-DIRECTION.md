# Wardat Al-Zuhoor — the two films

Two slots, both video, both already wired into the site:

| Slot | Files | Where |
|---|---|---|
| **01 · Hero** | `assets/hero.webm` · `hero.mp4` · `hero.jpg` | full-bleed behind **TRADE / TRANSPORT / DELIVER** |
| **02 · Road** | `assets/road.webm` · `road.mp4` · `road.jpg` | the pinned mid-page panel, *"The distance is the whole business."* |

Drop the files in and each panel fills itself — film → poster → placeholder, no code change.

---

## Brand intake

Derived from the logo, the letterhead and the site. **Confirm before we generate a set.**

| | |
|---|---|
| **Brand** | Wardat Al-Zuhoor Co. Ltd — vehicle trading · general transport · general trading. Mosul, Nineveh, Iraq |
| **Ground (60%)** | `#060B24` deep navy — the site's own ground |
| **Subject (30%)** | steel, glass, dust, asphalt — all desaturated |
| **Accent (10%)** | `#0A42DE` / `#3E6BFF`, the logo blue. **It has to be a real light in the frame** — a marker lamp, a beacon, a reflection on glass. Never a filter laid over the shot |
| **Mood** | ordered · moving · plain-spoken — **confirm, these are my words not yours** |
| **Type in frame** | none. The site sets the type over the film |
| **Audience** | buyers taking one vehicle, or a consignment |
| **Subject reference** | ⛔ **missing — your photographs.** Mandatory. Nothing gets generated from a text description of a yard we have not seen |
| **Forbidden** | ⛔ **unconfirmed** — anything the company will not show? |

---

## Two constraints the panels impose

**The hero is cropped hard on phones.** It is a full-bleed `cover` at `100lvh`, so a 16:9
frame gets cut to roughly its centre third on a phone. **Keep everything that matters in the
middle of the frame.** Nothing important in the outer thirds.

**The headline sits over the lower-left.** Keep the busy detail upper and right; leave the
lower-left quiet so TRADE / TRANSPORT / DELIVER has something plain to sit on.

**Both panels are muted.** `generate_audio: false`, and `-an` on export — an audio track is
pure weight. Which means **the image alone carries the pacing.** No sound design to lean on.

---

## FILM 01 · HERO — *one becomes many*

| | |
|---|---|
| **Intent** | Make the volume land without stating a number. It sits *behind* a headline, so it must not compete with it |
| **Mode** | Hyperreal cinematic, held with minimalist restraint |
| **One idea** | **Scale revealed, not announced.** Opens on one vehicle, ends on the whole compound |
| **Camera** | One unbroken rise from ground level in the gap between two rows, clearing the roofline and opening onto the full lot. Never cuts |
| **Light** | Low late sun raking straight down the row. Long shadows, dust hanging in the beam |
| **Motion** | Only the camera moves. Plus dust and heat shimmer. Nothing else |
| **Material moment** | The instant the camera clears the roofline and the dust catches the sun |
| **First frame** | A tight low detail — wheel, sill, dust on paint. That frame is also the poster, and it reads well under the type |

### The one rule

**Nothing drives.** Rows of near-identical parked cars are precisely where video models melt:
repeated body panels morph into each other, parked wheels start turning, badges turn to
gibberish. Every prompt says it, and the negative prompt says it again.

### Prompt

> Use the uploaded photograph exactly as provided. Do not change the vehicles' shapes, badges, colours or proportions, or the layout of the yard. Do not restyle, redesign or reinterpret the vehicles or the site.
>
> The camera begins low, at wheel height, in the gap between two rows of parked vehicles, and rises slowly and continuously — clearing the roofline and opening onto the full extent of the compound as the frame widens. Low late-afternoon sun rakes straight down the row, throwing long shadows across the asphalt; fine dust hangs in the light and drifts. Every vehicle is parked and completely still: nothing drives, no wheel turns, no doors open, no people in frame. Heat shimmer low over the ground. One continuous rise, no cut, holding for the full length.
>
> *[grade block]* · *[camera block]*

---

## FILM 02 · ROAD — *the load, moving*

The hero proves the volume. This one proves it **moves** — which is the half the copy on that
panel is about.

| | |
|---|---|
| **Intent** | Show transit as something run properly, not just distance covered |
| **Mode** | Hyperreal cinematic |
| **One idea** | **The load, secured, eating distance** |
| **Camera** | Low, tracking alongside a loaded transporter on open road, settling onto one strap. One move, holds |
| **Light** | Hard high sun, dust haze flattening the horizon |
| **Motion** | The truck moves. Wheels rotate at the speed the ground demands. Motion blur on what moves, nothing else |
| **Material moment** | **The ratchet strap** across a wheel, humming with the road. It is the one detail that says *secured and accounted for* — and it belongs to this business and no other |

### The one rule — inverted

Here it **must** move, correctly. The failure modes flip: wheels sliding without rotating or
spinning backwards, the load detaching or morphing, the trailer bending. Guard those instead.

### Prompt

> Use the uploaded photograph exactly as provided. Do not change the vehicles' shapes, badges, colours or proportions, or the transporter's structure. Do not restyle, redesign or reinterpret them.
>
> Low camera tracking alongside a loaded car transporter moving on open road, matching its speed so the truck holds steady in frame while the roadside streaks past behind it. The camera drifts slowly forward along the flank and settles on a single ratchet strap pulled tight across a wheel, the webbing trembling with the road. Wheels rotate at the correct speed for the movement, with natural motion blur on the moving elements only. The load stays firmly strapped and does not shift. Hard high sun, dust haze flattening the horizon, dry ground. One continuous move, no cut, the shot holds.
>
> *[grade block]* · *[camera block]*

---

## The blocks — paste at the end of every prompt

**Grade**

> Desaturated cool grade: steel-blue shadows, crushed blacks, dry warm dust as the only warmth in the frame. One saturated blue accent — a marker lamp, a beacon, a reflection on glass — and nothing else saturated. Filmic contrast.

**Camera** *(this is the block everyone forgets, and a mathematically smooth camera is the loudest AI tell in motion)*

> 24fps at a 180-degree shutter. Natural motion blur on moving elements only, none on static ones. Gentle operator drift rather than a smooth robotic dolly, subtle camera breathing, slight rolling shutter, framing a few degrees off-centre with uneven headroom, focus breathing once on the rack. Fine grain.

**Negative — both films**

> morphing car bodies, warping panels, melting geometry, duplicated or extra wheels, extra doors, distorted badges, unreadable text, invented licence plates, gibberish signage, floating objects, people clipping through vehicles, cartoon, illustration, 3D render, CGI look, plastic surfaces, oversaturated colour, HDR halo, over-sharpened edges, flicker, strobing, blown highlights, watermark, subtitles, timestamp, UI overlay, smooth robotic camera, sudden zoom, teleporting camera, rapid cuts

**Negative — hero only, added:** `cars driving, vehicles moving, rotating wheels, people walking, opening doors`

**Negative — road only, added:** `wheels sliding without rotating, wheels spinning backwards, bending trailer, cargo detaching, straps passing through metal, floating load`

---

## Generation settings — KREA

```
model          bytedance/seedance-2-5     # 30s clips, 1080p, up to 30 reference images
resolution     1080p
aspect_ratio   16:9
duration       14   (hero)   ·   12   (road)
start_image    <your photograph>
reference_images  [ 2–4 more of the same yard / the same trucks, for consistency ]
generate_audio false
enhance_prompt false      # OFF. Krea's enhancer paraphrases the constraints away,
                          # and the constraints are the whole point
seed           <record it — a good take has to be repeatable>
```

**Why Seedance 2.5 and not Kling:** 30-second clips mean **the film never cuts.** Buraq's
yard film was six 5-second shots edited together, and every cut was a place to hide an
artifact. One held shot is both better direction and less risk.

## Export

```bash
# H.264 — required, the universal one
ffmpeg -i take.mp4 -an -vf "scale=1920:-2,format=yuv420p" \
  -c:v libx264 -preset slow -crf 24 -movflags +faststart  hero.mp4

# VP9 — smaller for the browsers that take it
ffmpeg -i hero.mp4 -an -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 \
  -deadline good -cpu-used 2  hero.webm

# poster frame
ffmpeg -i hero.mp4 -ss 0.2 -frames:v 1 -q:v 4  hero.jpg
```

Same for `road.*`. **Ship both formats.** Chromium here carries no H.264 decoder, so an
MP4-only panel cannot be verified in this repo at all; Safari falls through to the MP4.
Aim under 6 MB each.

---

## Before I generate, I need

1. **The photographs.** Which are the yard/lot, and which are the transporters on the road.
2. **Is the lot in the pictures actually Mosul?** On the last project the footage was a
   Chinese port sitting under Jordanian copy. I would rather write the panel to match what
   the film genuinely shows.
3. **Mood + forbidden** confirmed — the three words above are mine, not yours.

One note for when the footage lands: the hero currently carries a heavy dark veil, because
underneath it is an empty placeholder. With a real film there I will lighten it so the
footage actually reads.
