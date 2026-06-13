# Mallouk Group — AI Generation Prompts
### Deepal & Avatr Jordan · Companion to `content-schedule.html`

Ready-to-paste prompts for the two **moving carousel posts** (§1, §2) and the two **cinematic AI reels** (§3, §4).
Tool-agnostic — works with **Higgsfield, Runway Gen-3/4, Kling, Google Veo, Sora, Pika** (video / image-to-video) and **Midjourney v6+ / Flux / DALL·E** (still keyframes).

**Recommended workflow for the carousels (the "moving" effect):**
1. Generate the wide hero scene as **one ultra-wide still** (image model), then **slice it into 4 frames** of 1080×1350 — that guarantees a *seamless* swipe.
2. Feed each sliced frame into an **image-to-video** model with the per-slide motion prompt below to get the looping movement.
3. Export each as a short **2–4 s vertical video / boomerang loop**; post as a video carousel.
4. Add the **monochrome Mallouk text frame** (Fraunces headline + Inter Tight labels) on top in editing — keep the *car/scene in cinematic colour*, the *brand frame in black & white*.

> **Brand-safety note for every prompt:** correct badges only (no invented logos), realistic proportions, GCC-spec left-hand drive, no visible competitor branding, no distorted wheels/text.

---

## §1 — DEEPAL G318 · Moving Carousel ("Swipe Across the Desert")
**Format:** 4-slide seamless video carousel · each 1080×1350 (4:5) · 2–4 s loop per slide
**Look:** cinematic colour, warm golden-hour desert · monochrome Mallouk frame overlay

### A. Wide hero still (generate first, then slice into 4)
```
Ultra-wide cinematic panorama, a rugged boxy electric off-road SUV (squared-off body,
prominent C-shaped LED daytime running lights, black roof rack, chunky all-terrain tyres,
externally mounted rear spare wheel, two-tone paint) driving left-to-right across vast
Jordanian desert dunes reminiscent of Wadi Rum, red-orange sand, dramatic rock mesas in
the distance, golden-hour sunlight, long shadows, fine dust trailing from the wheels,
shot on 35mm anamorphic, shallow depth of field, hyper-detailed, photoreal, automotive
advertising photography, volumetric light, 8k --ar 4:1
```
*Slice the result into 4 equal vertical frames so the car + horizon line flow continuously across slides.*

### B. Per-slide motion (image-to-video)
- **Slide 1:** `Slow push-in, gentle heat-haze shimmer, dust drifting, the SUV easing in from the right edge, subtle wheel rotation. Loop. Locked horizon.`
- **Slide 2:** `Smooth side-tracking shot keeping the SUV centred, dust kicking from tyres, sand grains catching golden light, distant mesas parallax. Loop.`
- **Slide 3:** `Low hero angle, the SUV crawling over a dune crest, slight body roll, small rocks tumbling, suspension flex, cinematic. Loop.`
- **Slide 4:** `Static beauty hold, sun flaring behind the SUV, slow dust settle, faint LED signature glow pulsing once. Loop.`

### C. On-frame copy (add in edit — monochrome)
| Slide | EN | AR |
|---|---|---|
| 1 | *Swipe. The desert doesn't end —* | اسحب… الصحرا ما بتخلص |
| 2 | 1,000 km range · 0 anxiety | مدى ١٠٠٠ كم · بدون قلق |
| 3 | 424 hp · diff-locks · 240 mm clearance | ٤٢٤ حصان · قفل تفاضلي |
| 4 | Deepal G318 · Book a test drive | احجز تجربة قيادة |

### D. Settings & negatives
- **Settings:** 24 fps, seamless loop, camera moves subtle (carousels are scrubbed, not played).
- **Negative:** `blurry, warped wheels, melted body panels, extra wheels, distorted badges, gibberish text, cartoon, lowres, watermark, competitor logos, snow, rain`
- **References:** Behance → <https://www.behance.net/search/projects/seamless%20carousel> · Pinterest → <https://www.pinterest.com/ideas/3d-car-animation-video/908647782779/> · <https://www.pinterest.com/ideas/car-3d-render/955624890230/>

---

## §2 — AVATR 07 REEV GCC · Moving Carousel ("Swipe to Wake It Up")
**Format:** 4-slide seamless video carousel · each 1080×1350 (4:5) · 2–4 s loop per slide
**Look:** dark luxury studio, glossy black floor, single accent of cool light · monochrome Mallouk frame

### A. Wide hero still (generate first, then slice into 4)
```
Ultra-wide cinematic studio panorama, a sleek premium mid-size electric crossover SUV,
sculpted aerodynamic body, full-width LED light bar front and rear, frameless minimalist
design, flush door handles, glossy pearl-white over black studio, dark seamless infinity
background, wet reflective floor with mirror reflection, dramatic rim lighting and soft
gradient key light, faint cool-blue accent glow, high-end automotive product photography,
photoreal, ray-traced reflections, 8k, elegant, futuristic --ar 4:1
```
*Slice into 4 vertical frames; keep the reflection line continuous across slides.*

### B. Per-slide motion (image-to-video)
- **Slide 1:** `Dark, the car dormant, a single light slowly travelling along the front light bar (half-lit), gentle reflection shimmer on wet floor. Loop.`
- **Slide 2:** `Full-width light bar ignites left-to-right, ambient glow blooms, subtle lens bloom, reflection intensifies. Loop.`
- **Slide 3:** `Slow elegant 3/4 turntable rotation of the SUV, reflections sliding across the sculpted body, cool light raking the surface. Loop.`
- **Slide 4:** `Front hero hold, headlights pulse on, soft volumetric light, slow push-in, premium calm. Loop.`

### C. On-frame copy (add in edit — monochrome)
| Slide | EN | AR |
|---|---|---|
| 1 | *Swipe to wake it up.* | اسحب… وخلّيها تصحى |
| 2 | Powered by Huawei HarmonyOS | بنظام هواوي هارموني |
| 3 | ~1,100 km REEV · 492 hp · GCC | مدى ~١١٠٠ كم · ٤٩٢ حصان |
| 4 | Avatr 07 · Book a private viewing | احجز جلسة خاصة |

### D. Settings & negatives
- **Settings:** 24 fps, seamless loop, restrained motion, cool/neutral grade.
- **Negative:** `blurry, warped reflections, melted panels, distorted badges, gibberish text, extra wheels, plastic look, cartoon, lowres, watermark, competitor logos, cluttered background`
- **References:** Behance → <https://www.behance.net/gallery/105810531/Car-Social-Media-Post-Template> · Pinterest → <https://www.pinterest.com/ideas/car-motion-graphics/916155670697/> · <https://www.pinterest.com/ideas/car-3d-render/955624890230/>

---

## §3 — DEEPAL · Cinematic Reel ("The Last Fuel Stop")
**Format:** vertical 1080×1920 (9:16) · 12–15 s · text-to-video or stitched image-to-video clips

### A. Shot prompts (generate as 3–4 clips, then edit)
```
CLIP 1 (0–2s) — Cinematic wide, an abandoned dusty desert fuel station at golden hour on a
lonely highway, faded pumps, no people, heat haze, a boxy rugged electric off-road SUV with
C-shaped LED lights entering frame from the right, slow tracking, anamorphic 35mm, photoreal.

CLIP 2 (3–7s) — Low fast tracking shot alongside the same SUV accelerating down an empty
desert highway, dust trailing, golden light raking the squared body panels, mountains behind,
motion blur on the tarmac, cinematic colour grade.

CLIP 3 (8–12s) — Drone shot pulling up and back, the SUV a small hero on an endless ribbon of
road through red desert toward the horizon, sun flare, epic scale, volumetric light.

CLIP 4 (13–15s) — Clean static beauty shot of the SUV parked facing camera, LED signature
glowing at dusk, ready for logo lockup, dark gradient sky.
```

### B. On-screen text & audio
- **Hook (0–1.5s):** EN *"Remember gas stations?"* · AR `إيمتى آخر مرة وقفت ع البنزين؟`
- **Mid:** animated counter climbing to **1,000 KM**.
- **End card:** *To the farthest point. No anxiety.* · `لأبعد نقطة. بدون قلق.` + Deepal logo + `احجز تجربة قيادة`.
- **Audio:** deep ambient drone + wind, single bass swell on the end reveal (no engine sound — that's the point).
- **Negative:** `people in frame, fuel nozzle in car, modern busy gas station, warped wheels, text artifacts, competitor logos, lowres`
- **Reference:** Pinterest → <https://www.pinterest.com/ideas/3d-car-animation-video/908647782779/>

---

## §4 — AVATR · Cinematic Reel ("Sculpted by Light")
**Format:** vertical 1080×1920 (9:16) · 12–15 s · text-to-video or stitched image-to-video clips

### A. Shot prompts (generate as 3–4 clips, then edit)
```
CLIP 1 (0–2s) — Black void studio, fine glowing particles swirl and assemble into the
silhouette of a sleek premium electric SUV, dramatic, abstract, cinematic, dark.

CLIP 2 (3–8s) — Slow orbiting camera around the fully-formed sculpted SUV in a dark infinity
studio, cool rim light sliding over aerodynamic body panels, full-width light bar igniting,
glossy reflections, ray-traced, ultra premium automotive film.

CLIP 3 (9–12s) — Interior reveal, a wide wraparound multi-screen cockpit booting up in one
elegant sweep of light, ambient glow, minimalist luxury, soft focus, high-end.

CLIP 4 (13–15s) — Front hero shot, headlights and light bar fully lit in the dark, slow
push-in, ready for logo lockup, cinematic.
```

### B. On-screen text & audio
- **Hook (0–2s):** EN *"This isn't a car. It's a statement."* · AR `هاي مش سيارة… هاي موقف.`
- **End card:** *Intelligence, in silence.* · `الذكاء بصمت.` + Avatr logo + `احجز جلسة خاصة`.
- **Audio:** minimal cinematic ambient, a soft synth rise + one clean "power-on" chime on the cockpit sweep.
- **Negative:** `clutter, people, daylight, plastic look, warped reflections, distorted badges, text artifacts, competitor logos, lowres`
- **Reference:** Pinterest → <https://www.pinterest.com/ideas/car-motion-graphics/916155670697/>

---

### Production notes
- Keep **all Arabic in Jordanian dialect** (not formal MSA) for the hooks — it reads as local, not corporate.
- Final deliverables: square/portrait **4:5** for carousels, **9:16** for reels & stories.
- Always end on a **CTA + dealer handle**; alternate the CTA between *test drive* (Deepal) and *private viewing* (Avatr).
- If generating with **Higgsfield** specifically: use the image model for the wide hero stills, then `image-to-video` (motion) for each sliced slide; predict performance with the virality tool before posting.
