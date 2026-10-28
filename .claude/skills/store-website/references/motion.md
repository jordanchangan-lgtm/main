
# Latent motion: text and image reveals

This motion language comes from the Latent Studio site (the user's own artifact, "Latent Studio — AI-native brand visuals, Amman"). It applies to any brand: only the colours change. A working copy lives in `sudqi-planet/assets/css/style.css` (the "Motion primitives" block) and `sudqi-planet/assets/js/main.js`.

Use two easings throughout:
- `--ease: cubic-bezier(.2,.8,.2,1)` for rises and settles.
- `--ease-io: cubic-bezier(.76,0,.24,1)` for curtains and clips.

Always add a `prefers-reduced-motion` block that shows everything at once.

## 1. Words rise out of a mask (headlines)
JS wraps each **word** of `[data-split]` in `.sw > .swi`. Split by word, never by letter, so Arabic letters stay joined. Do it separately for each `.ar` and `.en` child, restarting the counter for each.
```css
.sw{display:inline-block;overflow:hidden;vertical-align:top;padding-block:.1em .16em;margin-block:-.1em -.16em}
.swi{display:inline-block;transform:translateY(108%);transition:transform 1.05s var(--ease) calc(var(--d,0s) + var(--i,0)*.065s)}
.in .swi{transform:none}
```
```js
function splitNode(node,c){[...node.childNodes].forEach(ch=>{if(ch.nodeType===3){const f=document.createDocumentFragment();ch.textContent.split(/(\s+)/).forEach(p=>{if(!p)return;if(/^\s+$/.test(p)){f.append(p);return}const w=document.createElement('span');w.className='sw';const i=document.createElement('span');i.className='swi';i.style.setProperty('--i',c.n++);i.textContent=p;w.append(i);f.append(w)});ch.replaceWith(f)}else if(ch.nodeType===1&&!ch.classList.contains('sw'))splitNode(ch,c)})}
```

## 2. Rise out of a blur (everything else: eyebrows, ledes, buttons, cards)
```css
.rv{opacity:0;transform:translateY(26px);filter:blur(8px);transition:opacity .9s ease-out,transform 1s var(--ease),filter .9s ease-out;transition-delay:calc(var(--d,0s) + var(--k,0)*.08s)}
.rv.in{opacity:1;transform:none;filter:none}
```
Siblings get `--k: 0, 1, 2…`. Product cards use the same move, 40px, staggered `.08s` with `i % 6`.

## 3. Curtain wipe between colour rooms
Use it wherever the background colour changes. The previous room's colour covers the new section, then lifts away.
```css
.wipe{position:relative}
.wipe::after{content:"";position:absolute;inset:0;z-index:8;pointer-events:none;background:var(--prev);transform-origin:50% 0;transition:transform 1.1s var(--ease-io)}
.wipe.in::after{transform:scaleY(0)}
```
Set the colour per section: `style="--prev:var(--night)"`.

## 4. Image clip reveal
```css
.clip{clip-path:inset(14% 10% 14% 10% round var(--r));transition:clip-path 1.4s var(--ease)}
.clip.in{clip-path:inset(0 0 0 0 round var(--r))}
.clip img{transform:scale(1.2);transition:transform 1.8s var(--ease)}.clip.in img{transform:scale(1)}
```
Variants:
- **Hero films and panels:** open from below, `clip-path: inset(100% 0 0 0)` → `inset(0)`, at `1.4s`, staggered `.18s` per panel, while the video scales from 1.18 to 1.
- **Drawer gallery:** opens from the top, staggered `.1s`.
- **Sticky step pictures:** the next picture wipes up over the previous one.

## 5. Word cycle (one word inside a sentence keeps changing)
The old word drops out into a blur (`translateY(.5em)`, opacity 0, `blur(8px)`, .3s). The new word enters from above (`-.5em`), un-blurring over .45s. The container's width springs between measured widths (`.55s cubic-bezier(.22,1,.3,1)`). The interval is 2.6s, in the accent colour.

## 6. Statement that brightens as it is read
- A sticky stage, 100svh tall, inside a hold about 220svh tall. Each word is a `.bw` span with `--i`.
- On scroll, set `--lead = progress * (wordCount + 5)`.
- Each word uses `opacity: clamp(.14, (var(--lead) - var(--i)) / 4, 1)`.
- Key words (the brand's own word, e.g. "orbit"/"مدار") get the accent colour.
- A thin meter line fills with progress.

## 7. Index list with a floating preview
- Rows: number · large name · superscript count · description · round arrow.
- On hover, a fill colour rises behind the row (`scaleY` 0→1, origin bottom), the row pads inward by 18px, and the arrow rotates 45°.
- A fixed 4:5 preview follows the cursor (`translate3d(var(--x),var(--y))`). It scales from .6 to 1, rotates from -6° to -3°, and crossfades its images.
- On phones, swap the floating preview for row thumbnails.

## 8. Sticky step sequence
Pictures stick on one side while tall steps scroll past on the other. An IntersectionObserver with `rootMargin: -45% 0px -45% 0px` marks the active step:
- the active step goes to opacity 1 and the others to .25;
- the picture at that index wipes up, and earlier pictures stay open.

## 9. Small motions
- **Buttons:** a capsule with a round arrow chip; on hover the button lifts 2px and the chip rotates 45° (mirrored in RTL).
- **Announcement messages:** they slide up and out.
- **Tab pill:** slides between tabs (`.55s var(--ease)`).
- **Hero media:** a slow Ken Burns zoom from 1.14 to 1.02 over 10s.
- **Background:** grain overlay at 7% opacity, and an orbit or pattern field drifting over 60s.

## The order: choreography
**Page load (hero):**
1. Films or images open, staggered .18s, from 0.1s.
2. The kicker rises at .9s.
3. Headline words rise from 1s, +.065s per word.
4. The cycling line rises at 1.5s.
5. CTAs and the brand line rise at 1.7s.
6. The header is already in place.

**Each section, as it enters the viewport** (IntersectionObserver, `rootMargin: 0px 0px -10%`, threshold .05, reveal once):
1. The curtain lifts (1.1s).
2. The eyebrow rises (`.rv`, k = 0).
3. Headline words rise.
4. The lede and controls rise (k = 1, 2).
5. Cards or tiles rise, staggered .08s.
6. Images clip open as they arrive.

**Scroll-scrubbed (not timed):** the brightening statement and the sticky step pictures.

**Rules:**
- One orchestrated moment per screen.
- Never animate letter by letter in Arabic.
- Keep text readable at rest when reduced motion is on.
- Choose the colours from the client's brand, never from Latent's palette.
