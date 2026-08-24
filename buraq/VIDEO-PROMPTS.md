# Buraq Al Omur — the yard film · Kling 2.5 direction sheet

Six shots, 5 s each → a ~22 s silent loop for the full-bleed `#site` panel.

## The direction (decided before any prompt was written)

| | |
|---|---|
| **Intent** | Make the scale land. Not a showroom — a working compound moving thousands of units. |
| **Mode** | Hyperreal cinematic. No hook layer; this sits *behind* a headline on a website, not in a feed. |
| **One idea** | **Thousands become one.** The film opens on a field too big to count and ends on a single headlight. |
| **Material moment** | The **shear** — rows of vehicles sliding past each other at different speeds as the camera moves. That parallax is the whole tactile beat. Shot 6's headlight ignition is the payoff. |
| **Light** | Keep the real overcast maritime light of the source photos. Do **not** fake night — the site is already dark; flat grey footage graded cool sits *inside* the palette instead of fighting it. |
| **Grade** | Desaturated cool graphite, crushed blacks, steel-blue midtones. **One red** — the port crane, taillights — tying to `#ED1C2F`. |
| **Pacing** | Every shot holds. No cutting to hide artifacts. |
| **Sound** | None. The panel autoplays muted; ship the file with no audio track. |

## The one rule for this subject

**The cars must not drive.** Kling will happily set parked stock rolling, spin wheels, and
morph repeated body panels into each other. Rows of near-identical objects are exactly where
AI video melts. Every prompt below states it, and the negative prompt states it again.

---

## Reusable blocks

**Grade + camera block** — paste at the end of every prompt:

> Desaturated cool graphite grade, crushed blacks, muted steel-blue midtones, a single red accent, filmic contrast. 24fps at a 180-degree shutter, natural motion blur only on the camera's own movement, subtle organic drift rather than a smooth robotic dolly, faint fine grain, very slight rolling shutter.

**Negative prompt** — same on all six:

> cars driving, vehicles moving, rotating wheels, morphing car bodies, warping panels, melting geometry, duplicated or extra wheels, extra doors, distorted badges, unreadable text, invented license plates, people walking, floating objects, cartoon, illustration, 3D render, CGI look, plastic surfaces, oversaturated colour, HDR halo, over-sharpened edges, flicker, strobing, blown highlights, watermark, subtitles, timestamp, UI overlay, smooth robotic camera, sudden zoom, teleporting camera

**Settings:** Kling 2.5 · Professional/high quality · 5 s · 16:9 · CFG (creativity) low, around **0.3–0.5** so image-to-video respects the source photograph. Shots 2–6 are image-to-video from your stills; shot 1 is text-to-video.

---

## SHOT 1 · THE FIELD — text-to-video

Nothing in the supplied set is a true straight-down frame, so this one is generated from text. (Alternative: make a nadir still in an image model first, then image-to-video it — more control over the match.)

> Aerial nadir drone shot looking straight down at a vast port vehicle compound. Hundreds of brand-new sedans and SUVs parked in perfectly ordered rows, alternating white and dark grey bodies, bright yellow lane markings ruling straight lines across grey asphalt. The drone climbs slowly and rotates a few degrees clockwise, the rows sliding apart into pure geometry as the frame widens. Overcast maritime daylight, soft flat shadowless light, thin sea haze on the horizon. Every vehicle is parked and completely still — nothing drives, no wheels turn, no people in frame. A distant red port crane is the only saturated colour. *[grade + camera block]*

## SHOT 2 · THE DESCENT — image-to-video

**Source:** the high-angle field of white-and-black off-road SUVs with roof racks.

> The camera descends and tilts from a high oblique down toward the rows of parked off-road SUVs, roof racks and rear-mounted spare wheels resolving into detail as it drops. The vehicles, still wrapped in white protective film, hold perfectly still — nothing drives, no wheels turn. Heavy overcast cloud, port cranes and a glass tower on the horizon. One slow continuous descending move, gentle drone drift, no cut. *[grade + camera block]*

## SHOT 3 · THE SHEAR — image-to-video

**Source:** the head-on rows of Changan sedans with yellow lane markings. **This is the money shot.**

> The camera tracks slowly and steadily to the left, low and close to the ground, sliding past the front ends of a long row of parked sedans. Near rows sweep past quickly while distant rows drift slowly behind them, opening deep parallax across the whole field. Yellow lane markings streak through the foreground. Every car is parked and static — no vehicle moves, no wheel turns. Flat overcast light, city towers hazy in the far background. The shot holds for its full length on one unbroken move. *[grade + camera block]*

## SHOT 4 · SUNLIGHT — image-to-video

**Source:** the sunlit dark-blue SUVs in white protective film, mountains behind.

> Slow forward dolly along the flank of parked SUVs still wearing white protective film, hard sunlight raking across glossy dark blue paint and catching the alloy wheel spokes one by one as the camera passes. The vehicles are parked and motionless. Deep blue sky, mountain ridge and storage tanks on the horizon, heat shimmer low over the concrete. Walking-pace move, holds throughout. *[grade + camera block]*

## SHOT 5 · THE CRANE — image-to-video

**Source:** the black sedans with white roof film and the red gantry crane.

> Slow push forward past a row of parked black sedans with white protective roof film, toward a tall red port gantry crane standing against a pale overcast sky. The crane is the only saturated colour in the frame. The cars are parked and completely still. Cool flat harbour light, faint haze. One continuous push, no cut. *[grade + camera block]*

## SHOT 6 · ONE — image-to-video

**Source:** any clean three-quarter front of a single white sedan. The payoff.

> Slow push in on the front end of a single parked sedan until the headlight fills a third of the frame. The daytime running light glows on — a thin blade of light igniting along the lamp — and reflections crawl slowly across the paint as the camera closes. The car itself does not move. Shallow depth of field, the rows behind falling into soft bokeh. Overcast light, cool reflections on the clear coat. *[grade + camera block]*

---

## Assembly

30 s of material → cut to **~22 s**. Hard cuts, matched on the direction of the camera move
(descent into descent, lateral into lateral). Trim the first ~6 frames of every Kling clip —
the first moments are where the warp lives.

**Loop point:** shot 6 pushes in, shot 1 opens wide from above. That cut carries a whole
scale reset, so the loop reads as intentional rather than as a restart.

## Export for the panel

```bash
ffmpeg -i edit.mov -an \
  -vf "scale=1920:-2,format=yuv420p" \
  -c:v libx264 -preset slow -crf 24 -movflags +faststart \
  site.mp4

ffmpeg -i site.mp4 -vf "select=eq(n\,0)" -vframes 1 building.jpg   # poster frame
```

`-an` strips audio — the panel is muted, so the track is pure weight. Aim under **6 MB**.

Drop both at `buraq/assets/site.mp4` and `buraq/assets/building.jpg`. The panel already
prefers the film, falls back to the still, then to the placeholder — **no code change
needed**. It plays only while on screen, and holds the poster frame under
`prefers-reduced-motion`.

## ⚠ One thing to settle first

The source photographs are a **Chinese port** — Chinese signage, that skyline, those cranes.
The panel they would sit behind currently reads *"The gate every vehicle passes through ·
Free Zone, Al Zarqa."* Footage of a Chinese port under that line misrepresents the location.

Two honest ways round it:

1. **Change the copy** to the origin/shipping story — "Loaded at origin. Cleared in Zarqa." —
   and let the film be exactly what it is: the supply chain arriving.
2. **Keep the Zarqa copy** and shoot or source footage of the actual Zarqa yard.
