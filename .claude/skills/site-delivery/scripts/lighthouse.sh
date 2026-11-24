#!/bin/bash
# Mobile Lighthouse on a URL, printing the four scores and the LCP. Targets: performance 90+, SEO 100,
# accessibility 95+, best practices 90+, LCP under 2.5 s on a phone.
#   bash lighthouse.sh https://example.com/ [out.json]
U="$1"; O="${2:-/tmp/lh.json}"
CHROME_PATH=${CHROME_PATH:-/opt/pw-browsers/chromium} npx -y lighthouse@12 "$U" --preset=perf --form-factor=mobile --screenEmulation.mobile --throttling-method=simulate --only-categories=performance,best-practices,accessibility,seo --output=json --output-path="$O" --chrome-flags="--headless --no-sandbox --disable-gpu" --quiet >/dev/null 2>&1
python3 - "$O" <<'PY'
import json,sys; d=json.load(open(sys.argv[1])); c=d['categories']; a=d['audits']
print({k:round(v['score']*100) for k,v in c.items()})
for k in ['largest-contentful-paint','first-contentful-paint','total-blocking-time','cumulative-layout-shift']: print(k, a[k]['displayValue'])
for cat in ['best-practices','accessibility','seo']:
    for ref in d['categories'][cat]['auditRefs']:
        au=a[ref['id']]
        if au.get('score') is not None and au['score']<1: print('below 1:', cat, ref['id'], au['title'][:80])
PY
