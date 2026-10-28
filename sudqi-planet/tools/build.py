#!/usr/bin/env python3
"""Build the Cloudflare Pages bundle for Sudqi Planet.

    python3 tools/build.py            # from the sudqi-planet folder

Produces dist/ and sudqi-planet-cloudflare.zip:
  * every .jpg/.png image is re-encoded as WebP (smaller, same look);
  * every asset gets a content hash in its file name (sun.3f9a2c1d.webp), and
    all references in the HTML, CSS and JS are rewritten to match;
  * a _headers file tells Cloudflare to cache assets for a year (immutable)
    and to always revalidate the HTML, so a new deploy shows at once while
    images are never downloaded twice;
  * the hero images are preloaded so they start loading first.
"""
import hashlib
import os
import re
import shutil
import zipfile

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(ROOT, "dist")
ZIP = os.path.join(ROOT, "sudqi-planet-cloudflare.zip")
PAGES = ["index.html", "shop.html"]
WEBP_QUALITY = 80


def short_hash(data):
    return hashlib.sha256(data).hexdigest()[:8]


def main():
    if os.path.exists(DIST):
        shutil.rmtree(DIST)
    shutil.copytree(os.path.join(ROOT, "assets"), os.path.join(DIST, "assets"))
    for page in PAGES:
        shutil.copy(os.path.join(ROOT, page), DIST)

    texts = {}  # relative path -> text, for files whose references we rewrite
    for dirpath, _, files in os.walk(DIST):
        for f in files:
            if f.endswith((".html", ".css", ".js")):
                rel = os.path.relpath(os.path.join(dirpath, f), DIST)
                texts[rel] = open(os.path.join(dirpath, f), encoding="utf-8").read()

    renames = {}  # old path (relative to dist, "assets/...") -> new path

    # 1. Images: re-encode raster images as WebP, then fingerprint every image.
    img_root = os.path.join(DIST, "assets", "img")
    for dirpath, _, files in os.walk(img_root):
        for f in sorted(files):
            src = os.path.join(dirpath, f)
            rel = os.path.relpath(src, DIST).replace(os.sep, "/")
            base, ext = os.path.splitext(f)
            if ext.lower() in (".jpg", ".jpeg", ".png"):
                im = Image.open(src)
                im = im.convert("RGBA" if im.mode in ("RGBA", "LA", "P") else "RGB")
                tmp = os.path.join(dirpath, base + ".webp")
                im.save(tmp, "WEBP", quality=WEBP_QUALITY, method=6)
                os.remove(src)
                src, ext = tmp, ".webp"
            data = open(src, "rb").read()
            new_name = "%s.%s%s" % (base, short_hash(data), ext)
            os.rename(src, os.path.join(dirpath, new_name))
            renames[rel] = os.path.relpath(os.path.join(dirpath, new_name), DIST).replace(os.sep, "/")

    def rewrite(text):
        # longest paths first so "a/b.jpg" never clips "a/bb.jpg"
        for old in sorted(renames, key=len, reverse=True):
            new = renames[old]
            text = text.replace(old, new)
            # CSS refers to images relative to assets/css/: "../img/..."
            if old.startswith("assets/"):
                text = text.replace("../" + old[len("assets/"):], "../" + new[len("assets/"):])
        return text

    # 2. CSS and JS: rewrite their image references, then fingerprint them.
    for rel in sorted(texts):
        if not rel.endswith((".css", ".js")):
            continue
        text = rewrite(texts[rel])
        data = text.encode("utf-8")
        base, ext = os.path.splitext(rel)
        new_rel = "%s.%s%s" % (base, short_hash(data), ext)
        open(os.path.join(DIST, new_rel), "wb").write(data)
        os.remove(os.path.join(DIST, rel))
        renames[rel.replace(os.sep, "/")] = new_rel.replace(os.sep, "/")

    # 3. Pages: rewrite every reference, preload the hero on the home page.
    for page in PAGES:
        html = rewrite(texts[page])
        if page == "index.html":
            hero = renames.get("assets/img/ai/hero.jpg")
            hero_m = renames.get("assets/img/ai/hero-m.jpg")
            if hero and hero_m:
                preload = (
                    '<link rel="preload" as="image" href="%s" media="(min-width: 761px)" fetchpriority="high" />\n'
                    '  <link rel="preload" as="image" href="%s" media="(max-width: 760px)" fetchpriority="high" />\n  '
                    % (hero, hero_m)
                )
                html = html.replace('<link rel="preconnect" href="https://fonts.googleapis.com" />', preload + '<link rel="preconnect" href="https://fonts.googleapis.com" />', 1)
        open(os.path.join(DIST, page), "w", encoding="utf-8").write(html)

    # 4. Cloudflare Pages headers.
    open(os.path.join(DIST, "_headers"), "w").write(
        "# Fingerprinted files never change: cache for a year, never re-check.\n"
        "/assets/*\n"
        "  Cache-Control: public, max-age=31536000, immutable\n"
        "\n"
        "# Pages always revalidate, so a new deploy (with new file names) shows at once.\n"
        "/\n"
        "  Cache-Control: public, max-age=0, must-revalidate\n"
        "/*.html\n"
        "  Cache-Control: public, max-age=0, must-revalidate\n"
        "/shop\n"
        "  Cache-Control: public, max-age=0, must-revalidate\n"
        "\n"
        "/*\n"
        "  X-Content-Type-Options: nosniff\n"
        "  Referrer-Policy: strict-origin-when-cross-origin\n"
    )

    # 5. Check nothing still points at an old (pre-build) file name.
    missing = []
    for dirpath, _, files in os.walk(DIST):
        for f in files:
            if f.endswith((".html", ".css", ".js")):
                text = open(os.path.join(dirpath, f), encoding="utf-8").read()
                for ref in re.findall(r'(?:assets/|\.\./)(?:img|css|js|video)/[A-Za-z0-9_./-]+', text):
                    path = ref if ref.startswith("assets/") else "assets/" + ref[3:]
                    if not os.path.exists(os.path.join(DIST, path)):
                        missing.append((f, ref))
    if missing:
        raise SystemExit("Broken references after build: %r" % missing[:10])

    # 6. Zip for Cloudflare Pages "Upload assets".
    if os.path.exists(ZIP):
        os.remove(ZIP)
    with zipfile.ZipFile(ZIP, "w", zipfile.ZIP_DEFLATED) as z:
        for dirpath, _, files in os.walk(DIST):
            for f in sorted(files):
                full = os.path.join(dirpath, f)
                z.write(full, os.path.relpath(full, DIST))

    size = sum(os.path.getsize(os.path.join(d, f)) for d, _, fs in os.walk(DIST) for f in fs)
    print("dist/ ready: %d files, %.1f MB" % (sum(len(fs) for _, _, fs in os.walk(DIST)), size / 1e6))
    print("zip:", ZIP, "%.1f MB" % (os.path.getsize(ZIP) / 1e6))


if __name__ == "__main__":
    main()
