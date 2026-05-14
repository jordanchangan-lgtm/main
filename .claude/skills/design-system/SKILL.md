---
name: design-system
description: Apply a real design system when building or styling UI — enforce typography scale, 8px spacing grid, color tokens, component patterns, and avoid generic AI aesthetic. Use whenever writing CSS, Tailwind classes, or component markup.
---

# Design System

When building or styling UI, follow these rules. Do not improvise sizes, spacings, or colors.

## Typography scale

Use a real type system — not random font sizes. Pick from a fixed scale and stick to it.

- Scale (rem): `0.75`, `0.875`, `1`, `1.125`, `1.25`, `1.5`, `1.875`, `2.25`, `3`, `3.75`
- Line-height pairings: tight (`1.1`) for display, snug (`1.25`) for headings, normal (`1.5`) for body, relaxed (`1.625`) for long-form.
- Weights: `400` body, `500` UI labels, `600` headings, `700` display only.
- Never use arbitrary `font-size: 17px` or `19px` values. Round to the scale.
- One typeface for UI + one for display max. No more than 2 families on a page.

## Spacing system (8px base grid)

All padding, margin, gap, and layout offsets must be multiples of 8px. The only allowed exception is 4px for tight inline gaps (icon-to-text).

- Allowed: `4, 8, 16, 24, 32, 40, 48, 64, 80, 96, 128`
- Disallowed: `5, 7, 10, 13, 15, 18, 22` — these are improvised.
- Component internal padding: 8 / 12 (4×3) / 16 / 24.
- Section vertical rhythm: 64 / 80 / 96 / 128.
- If using Tailwind, restrict to `p-1, p-2, p-3, p-4, p-6, p-8, p-10, p-12, p-16, p-20, p-24, p-32` (and matching m/gap/space-y).

## Color tokens

Define and use named tokens — never hardcode hex codes in components.

- **Primary**: brand color + 9 shades (`50` → `900`). Used for primary actions, links, focus rings.
- **Neutral**: a single neutral ramp (`50` → `950`) for text, surfaces, borders. Pick warm OR cool — don't mix.
- **Accent**: one accent color for highlights, badges, illustrations. Use sparingly.
- **Semantic**: `success`, `warning`, `danger`, `info` — each with `bg`, `border`, `text` variants.
- Define tokens once (CSS variables or Tailwind theme). Reference them everywhere.
- Forbidden in components: `#f5f5f5`, `#ccc`, `rgba(0,0,0,0.5)`, ad-hoc gradients. Always go through a token.

## Component patterns

### Button states
Every button must define all five states:
- `default` — token bg, token text, 1px border (or none, consistent)
- `hover` — bg one shade darker (or lighter on dark themes)
- `active` / `pressed` — bg two shades darker, no transform jitter
- `focus-visible` — 2px outline offset by 2px, using primary-500 with sufficient contrast
- `disabled` — 40% opacity, `cursor: not-allowed`, no hover state

Sizes: `sm` (h-8, px-3, text-sm), `md` (h-10, px-4, text-base), `lg` (h-12, px-6, text-lg). No other sizes.

### Card structure
- Outer container: `bg-surface`, `border` or `shadow-sm` (pick one, not both), `rounded-lg` or `rounded-xl` consistently.
- Internal padding: `24` (or `16` for dense cards). Same on all sides unless there is a media element flush to the edge.
- Header / body / footer slots separated by spacing tokens, not borders, unless the card is a data table.
- Title uses heading scale, body uses body scale — never bump arbitrarily.

### Form layouts
- Label above input. Label `text-sm font-medium`, 8px gap to input.
- Input height matches button `md` (40px). Padding `12px` horizontal.
- Help text below input, `text-xs text-neutral-500`, 4px gap.
- Error state: red border + red help text, never just red border.
- Field group spacing: `24px` between fields, `32px` between sections.
- Required indicator: `*` next to label, not as placeholder text.

## Avoid generic AI aesthetic

Do not produce the default "ChatGPT landing page" look. Specifically avoid:

- Purple-to-blue gradients on every hero / button / icon.
- Gradient text headings as the default — reserve for one moment per page max.
- Glassmorphism (`backdrop-blur` + translucent white) used everywhere.
- Centered hero with `max-w-3xl` paragraph + two buttons + tiny "trusted by" row. This is a template, not a design.
- Generic Lucide icon in a soft-color rounded square next to every feature card.
- Soft neumorphism shadows on cards (`shadow-2xl` on a `bg-white` card).
- "Floating" 3D-looking elements with rotate-y transforms for no reason.
- Random emoji as section markers.
- Stock "AI-generated" hero illustrations of abstract waves / particles.
- Three-column "feature grid" with icon + heading + 2 lines of body, identical structure repeated.
- Pill-shaped tags with rainbow colors signaling nothing.

Instead:
- Commit to a point of view: editorial, technical, brutalist, playful — pick one.
- Use real content and let it dictate layout. If a section only has 2 features, do not pad to 3.
- Asymmetry is allowed and often better than perfect grids.
- One accent moment per screen, not five.
- Type and spacing do most of the work. Color and effects are seasoning.
