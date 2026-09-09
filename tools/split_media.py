#!/usr/bin/env python3
"""Turn a single-file site into index.html + media/.

    python3 tools/split_media.py build/index.html deploy/

Every image or video carried as a large data: URI (src, poster, <source>, CSS url()) becomes a hashed file
under media/, references are rewritten, images below the fold get lazy/low-priority hints, films get
preload="none", and a _headers file is written for Cloudflare Pages (HTML no-cache, media immutable).
Site-specific load-order work (hero cut selection, arming films when near) stays in the site's own build.
"""
import base64, hashlib, os, re, shutil, sys

EXT = {'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'video/mp4': 'mp4', 'video/webm': 'webm'}
MIN = 20000  # bytes of base64 below which a data URI stays inline

def main(src, out):
    s = open(src, encoding='utf-8').read()
    os.makedirs(os.path.join(out, 'media'), exist_ok=True)
    files, n = {}, [0]
    def store(mime, b64):
        raw = base64.b64decode(b64); h = hashlib.md5(raw).hexdigest()[:10]
        if h not in files:
            n[0] += 1; fn = 'media/%02d-%s.%s' % (n[0], h, EXT.get(mime, 'bin'))
            open(os.path.join(out, fn), 'wb').write(raw); files[h] = fn
        return files[h]
    big = r'data:(image/[a-z]+|video/[a-z0-9]+);base64,([A-Za-z0-9+/=]{%d,})' % MIN
    s = re.sub(r'\b(src|poster|data-src|data-poster-m)="' + big + '"', lambda m: '%s="%s"' % (m.group(1), store(m.group(2), m.group(3))), s)
    s = re.sub(r'url\("' + big + r'"\)', lambda m: 'url("%s")' % store(m.group(1), m.group(2)), s)
    s = re.sub(r'url\(' + big + r'\)', lambda m: 'url(%s)' % store(m.group(1), m.group(2)), s)
    # hints: films wait, images below the fold are lazy and low priority
    s = re.sub(r'<video(?![^>]*preload=)', '<video preload="none"', s)
    s = re.sub(r'<img(?![^>]*loading=)', '<img loading="lazy" decoding="async" fetchpriority="low"', s)
    open(os.path.join(out, 'index.html'), 'w', encoding='utf-8').write(s)
    open(os.path.join(out, '_headers'), 'w').write('/*\n  Cache-Control: public, max-age=0, must-revalidate\n  X-Content-Type-Options: nosniff\n/media/*\n  Cache-Control: public, max-age=31536000, immutable\n')
    left = len(re.findall(big, s)); tot = sum(os.path.getsize(os.path.join(out, f)) for f in files.values())
    print('index.html %.0f KB, %d media files %.1f MB, large data URIs left: %d' % (len(s.encode()) / 1024, len(files), tot / 1048576, left))

if __name__ == '__main__':
    if len(sys.argv) != 3: sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
