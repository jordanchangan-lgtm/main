#!/bin/bash
# The E build chain, in order. Rebuilds latent-v3e/index.html from the base commit, then /ar/.
set -e
cd /home/user/main
K=${K:-/tmp/claude-0/-home-user-main/ebce930a-c60e-53f2-9cc9-6aaf1c614988/scratchpad/krea}
git show 0849d1e:latent-v3e/index.html > latent-v3e/index.html
for p in e_patch_fly e_patch_ledger e_patch_wall e_patch_imgs e_patch_td e_patch_phone; do /usr/bin/python3 -I latent-v3-src/$p.py >/dev/null; done
/usr/bin/python3 -I latent-v3-src/e_swap_hero.py $K/egg_d.mp4 $K/egg_d.jpg $K/egg_m.mp4 $K/egg_m.jpg >/dev/null
for p in e_patch_seo e_patch_faq e_patch_prices e_patch_lang e_extract e_webp e_prune e_build_ar; do /usr/bin/python3 -I latent-v3-src/$p.py >/dev/null; done
echo "chain ok: $(du -k latent-v3e/index.html | cut -f1) KB en, $(du -k latent-v3e/ar/index.html | cut -f1) KB ar"
