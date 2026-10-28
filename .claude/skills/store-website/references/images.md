# Store imagery with Krea: one studio, every angle

The goal is one consistent photoshoot for the whole store. Every product, every angle, the hero and the package shots sit in the same set, in the brand's colours, with the real packaging intact. A hover or gallery image on a different background (a wooden table, a dark room) breaks the store, so it never ships.

Load the `writing-prompts-and-generating` skill before generating. Its product lock and 60/30/10 rules are mandatory.

## Setup
1. **Fill the set from the brand's palette, by the 60/30/10 rule.**
   - **Ground (60%):** the brand's lightest neutral, as a seamless background and floor.
   - **Subject holder (30%):** a plinth or surface in the secondary colour.
   - **Accent (10%):** small accents in the brand's accent colour.
   - **Prop shapes:** take them from the logo or brand elements. For Sudqi Planet's planet-and-orbit logo, that meant a half-dome "planet" plinth, a thin champagne orbit ring and a small "moon" sphere.
2. **Upload the client's real product photos to Krea.** Use `get_upload_url`, then `curl -F file=@…` once per file. Pick the sharpest photo of each product. Tools: `generate_image`, model `google/nano-banana-pro`, `resolution: "2K"` for products and `"4K"` for the 16:9 hero.
3. **Generate ONE product first and check it** before running the batch. The label, cap and text must match the real product (Gate 5: lock).

## Prompt skeleton: main product shot (4:5)
```
Minimalist editorial [category] still life, shot for a luxury [category] store.

Use the uploaded product exactly as provided: [precise description: container, cap,
colour, logo, label text]. Do not change its shape, cap, label, logo, text, colour,
proportions, or reflections. Do not restyle, redesign, or reinterpret the product.
Remove any stickers and the background from the reference; keep only [product + its box].

Scene (60/30/10 colour rule): 60% — seamless matte [ground name] background and floor
[#hex]. 30% — the product stands on [plinth shape from the brand] in [secondary #hex].
10% — [accent props in accent #hex].

Light: soft directional morning window light from the upper [left/right], one long crisp
diagonal shadow. Camera: straight-on, tabletop height, very slight high angle, 85mm,
slightly off-centre, generous negative space. Real photograph, subtle film grain,
no CGI gloss, no extra props, no added text.
```

## Extra angles: same set, every product (4:5)
Pass two references: `[real product photo, the generated main shot]`. Open the prompt with:
`"Second angle from the same photoshoot as the second reference image: identical studio set, identical colours and identical light."`
Add `No wood, no dark background, no sticker.` and the full product-lock sentence.
- **Angle 2, close-up with texture:** a tight three-quarter close-up with a 100mm macro lens and shallow depth of field. Show a swipe, foam, spray or swirl of the formula on the plinth. This image doubles as the hover image.
- **Angle 3, top-down flat lay:** the product and its box lie flat on a large disc in the secondary colour, with the accent ring and sphere.

Gallery per product: `[main, close-up, flat lay]`. Look at every result's edges: models sometimes leak the reference background (a strip of wood at the bottom). Crop it off.

## Hero
- **Desktop:** 16:9 at 4K. **Phone:** 9:16 at 2K.
- Put the key products together as one cluster on the plinth in the upper-middle of the frame.
- Leave the lower third (desktop) or lower 45% (phone) as empty ground for the headline.
- Sample the hero's floor colour and set the hero section's background to it, so the image fades into the page.

## Packages and bundles
- Pass every included product as a reference.
- Tie them together with an accent-colour ribbon looped like an orbit, or an open gift box in the secondary colour.
- **Known drift:** with three or more products in one frame, the model may simplify small label text. Compare with the real labels and tell the user about any drift; never hide it.

## Downloading
- Results live at `https://app-uploads.krea.ai/public/<job_id>-image.<png|jpeg>`. The extension varies, and the URL can return 404 for a short while after the job completes.
- Poll with `get_job` or a retry loop that tries both extensions.
- Re-encode to the web size: 1000px wide for products, 2560px for the desktop hero, 1080px for the phone hero.
- The Cloudflare build converts everything to WebP.
