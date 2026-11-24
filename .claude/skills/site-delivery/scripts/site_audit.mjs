// The one test every site runs before delivery and after deploy.
//   node site_audit.mjs <url> [--live] [--budget 1500000]
// <url>   a local server (http://127.0.0.1:8095/) or the live site (https://example.com/ar/)
// --live  also checks the things only a deployed site has: https redirect, www, security headers, media cache,
//         sitemap.xml, robots.txt, llms.txt
// Prints PASS / FAIL / INFO lines and exits 1 on any FAIL. Playwright with the pre-installed Chromium, no H.264:
// films show posters, that is expected.
let pw; try { pw = await import('/opt/node22/lib/node_modules/playwright/index.mjs'); } catch { pw = await import('playwright'); }
const { chromium, devices } = pw;
const args = process.argv.slice(2); const url = args.find(a => !a.startsWith('--')); if (!url) { console.error('usage: node site_audit.mjs <url> [--live]'); process.exit(2); }
const live = args.includes('--live'); const budget = +(args[args.indexOf('--budget') + 1] || 1500000) || 1500000;
const out = []; let fails = 0;
const ok = (name, cond, note = '') => { out.push((cond ? 'PASS ' : 'FAIL ') + name + (note ? '  ' + note : '')); if (!cond) fails++; };
const info = (name, note) => out.push('INFO ' + name + '  ' + note);
const u = new URL(url); const origin = u.origin;

const b = await chromium.launch();
async function visit(opts, label, extra = {}) {
  const ctx = await b.newContext({ ...opts, ...extra }); await ctx.addInitScript(() => { try { localStorage.setItem('ls-lang', 'x'); } catch (e) {} });
  const pg = await ctx.newPage(); const errs = [], bad = [], reqs = []; const t0 = Date.now();
  pg.on('pageerror', e => errs.push(e.message.slice(0, 120)));
  pg.on('response', async r => { const st = r.status(); const ru = r.url(); if (st >= 400) bad.push(st + ' ' + ru.slice(-70)); let n = 0; try { const h = r.headers()['content-length']; n = h ? +h : (await r.body()).length; } catch (e) {} reqs.push({ url: ru, bytes: n, t: Date.now() - t0, type: r.request().resourceType() }); });
  await pg.goto(url, { waitUntil: 'load' }); await pg.waitForTimeout(3200);
  return { ctx, pg, errs, bad, reqs, label };
}

// ---- phone pass: errors, media, text size, overflow, budget ----
const m = await visit({ ...devices['iPhone 13'] }, 'phone');
ok('phone: zero console errors', m.errs.length === 0, m.errs.join(' | '));
ok('phone: zero failed requests', m.bad.length === 0, m.bad.slice(0, 3).join(' | '));
const first3 = m.reqs.filter(r => r.t <= 3000).reduce((a, r) => a + r.bytes, 0);
ok('phone: first 3 s under budget', first3 <= budget, Math.round(first3 / 1024) + ' KB of ' + Math.round(budget / 1024) + ' KB');
const armed = await m.pg.evaluate(() => [...document.querySelectorAll('video')].filter(v => v.getAttribute('src') || v.querySelector('source[src]')).length);
ok('phone: at most one film armed at load', armed <= 1, armed + ' armed');
const broken = await m.pg.evaluate(() => [...document.images].filter(i => i.complete && i.naturalWidth === 0 && !i.loading).map(i => i.src.slice(-60)));
ok('phone: zero broken images', broken.length === 0, broken.slice(0, 3).join(' | '));
const small = await m.pg.evaluate(() => { const out = []; const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n; while (n = w.nextNode()) { const t = n.textContent.trim(); if (!t) continue; const el = n.parentElement; const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden' || el.closest('[aria-hidden="true"],.sr,script,style,noscript')) continue; const fs = parseFloat(cs.fontSize); if (fs < 11 && el.getBoundingClientRect().width > 0) out.push(fs.toFixed(1) + 'px ' + t.slice(0, 18)); } return [...new Set(out)].slice(0, 6); });
ok('phone: no text under 11 px', small.length === 0, small.join(' | '));
const ovf = await m.pg.evaluate(() => ({ docW: document.documentElement.scrollWidth, vw: innerWidth }));
ok('phone: no horizontal scroll', ovf.docW <= ovf.vw + 1, ovf.docW + ' vs ' + ovf.vw);
const H = await m.pg.evaluate(() => document.documentElement.scrollHeight); const vh = 664; let overlaps = [];
for (let y = 0; y < H; y += vh * 0.8) { await m.pg.evaluate(y => scrollTo(0, y), y); await m.pg.waitForTimeout(250);
  const o = await m.pg.evaluate(() => { const vis = [...document.querySelectorAll('img,video,figure')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 40 && r.height > 40 && r.bottom > 0 && r.top < innerHeight && getComputedStyle(e).visibility !== 'hidden' && +getComputedStyle(e).opacity > .5; });
    const txt = [...document.querySelectorAll('p,h1,h2,h3,li,dt,dd')].filter(e => { const r = e.getBoundingClientRect(); return e.textContent.trim().length > 12 && r.width > 20 && r.bottom > 0 && r.top < innerHeight && !e.closest('figure,a.card,[aria-hidden="true"]') && getComputedStyle(e).position !== 'fixed'; });
    const hits = []; for (const t of txt) { const a = t.getBoundingClientRect(); for (const v of vis) { if (v.contains(t) || t.contains(v)) continue; const bb = v.getBoundingClientRect(); const ix = Math.min(a.right, bb.right) - Math.max(a.left, bb.left), iy = Math.min(a.bottom, bb.bottom) - Math.max(a.top, bb.top); const blended = (el => { for (let e = el; e && e !== document.body; e = e.parentElement) { const c = getComputedStyle(e); if (c.mixBlendMode !== 'normal' || /absolute|sticky|fixed/.test(c.position)) return true; } return false; })(t); if (ix > 12 && iy > 12 && !blended && !t.closest('.hero,.stage,[class*="hero"]') && !v.closest('[class*="bg"],[class*="poster"],.method-v')) hits.push(t.textContent.trim().slice(0, 24) + ' x ' + (v.getAttribute('src') || v.className || v.tagName).toString().slice(-30)); } } return hits; });
  overlaps.push(...o); }
overlaps = [...new Set(overlaps)];
ok('phone: no picture over text', overlaps.length === 0, overlaps.slice(0, 4).join(' | '));
await m.ctx.close();

// ---- reduced motion must not throw ----
const rm = await visit({ ...devices['iPhone 13'], reducedMotion: 'reduce' }, 'reduced'); await rm.pg.evaluate(() => scrollTo(0, 3000)); await rm.pg.waitForTimeout(400);
ok('reduced motion: zero console errors', rm.errs.length === 0, rm.errs.join(' | ')); await rm.ctx.close();

// ---- desktop pass + the page's search and trust facts ----
const d = await visit({ viewport: { width: 1440, height: 900 } }, 'desktop');
ok('desktop: zero console errors', d.errs.length === 0, d.errs.join(' | '));
ok('desktop: zero failed requests', d.bad.length === 0, d.bad.slice(0, 3).join(' | '));
const f = await d.pg.evaluate(() => {
  const q = s => document.querySelector(s); const attr = (s, a) => (q(s) || {}).getAttribute ? q(s).getAttribute(a) : null;
  const lds = [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => { try { return JSON.parse(s.textContent); } catch (e) { return 'BAD'; } });
  const types = []; const walk = o => { if (!o || typeof o !== 'object') return; if (o['@type']) types.push(String(o['@type'])); Object.values(o).forEach(walk); }; lds.forEach(walk);
  const imgs = [...document.images].filter(i => !i.closest('[aria-hidden="true"]') && i.getBoundingClientRect().width > 24);
  const noAlt = imgs.filter(i => !(i.getAttribute('alt') || '').trim()).length;
  const text = document.body.innerText;
  const hasPrice = /(\b(JD|JOD|SAR|AED|USD|CAD|EUR|GBP)\b\s*\d|\d[\d,]*\s*(JD|JOD|SAR|AED|USD|CAD|د\.أ|ر\.س|د\.إ|دولار|\$))/.test(text);
  const inlineBytes = [...document.querySelectorAll('style,script:not([src])')].reduce((a, s) => a + s.textContent.length, 0);
  const lang = document.documentElement.lang, dir = document.documentElement.dir;
  const h1 = [...document.querySelectorAll('h1')].map(h => h.textContent.trim());
  return { title: document.title, desc: attr('meta[name="description"]', 'content') || '', canonical: attr('link[rel="canonical"]', 'href'), hreflang: [...document.querySelectorAll('link[rel="alternate"][hreflang]')].map(l => l.getAttribute('hreflang')),
    og: { image: attr('meta[property="og:image"]', 'content'), title: attr('meta[property="og:title"]', 'content'), locale: attr('meta[property="og:locale"]', 'content'), tw: attr('meta[name="twitter:card"]', 'content') },
    ldBad: lds.includes('BAD'), types: [...new Set(types)], noAlt, imgs: imgs.length, hasPrice, wa: !!q('a[href*="wa.me"],a[href*="whatsapp"]'), tel: !!q('a[href^="tel:"]'), mail: !!q('a[href^="mailto:"]'), inlineBytes, htmlBytes: document.documentElement.outerHTML.length, lang, dir, h1,
    gfonts: !![...document.querySelectorAll('link[href]')].find(l => /fonts\.(googleapis|gstatic)/.test(l.href)), faq: !!q('dl,[class*="faq"],[class*="fq"]') };
});
ok('title 30–65 chars', f.title.length >= 30 && f.title.length <= 65, f.title.length + ': ' + f.title);
ok('meta description 70–160 chars', f.desc.length >= 70 && f.desc.length <= 160, f.desc.length + ' chars');
ok('one H1 that says what and where (not only a slogan)', f.h1.length === 1 && f.h1[0].split(/\s+/).length >= 5, f.h1.join(' | '));
ok('canonical present', !!f.canonical, f.canonical || '');
ok('hreflang en, ar and x-default', ['en', 'ar', 'x-default'].every(h => f.hreflang.includes(h)), f.hreflang.join(','));
ok('og:image, og:title, twitter:card', !!(f.og.image && f.og.title && f.og.tw), JSON.stringify(f.og));
ok('og:locale matches the page language', !!f.og.locale && f.og.locale.toLowerCase().startsWith((f.lang || '').slice(0, 2).toLowerCase()), f.lang + ' / ' + f.og.locale);
ok('html lang set, dir=rtl on Arabic', !!f.lang && (f.lang.slice(0, 2) !== 'ar' || f.dir === 'rtl'), f.lang + ' ' + f.dir);
ok('JSON-LD parses and names the business', !f.ldBad && f.types.some(t => /ProfessionalService|Organization|LocalBusiness/.test(t)), f.types.join(','));
ok('JSON-LD has offers or services', f.types.some(t => /Offer|Service/.test(t)), '');
ok('FAQ has FAQPage schema', !f.faq || f.types.includes('FAQPage'), f.faq ? 'faq block found' : 'no faq block');
ok('prices in plain HTML with a currency', f.hasPrice, '');
ok('WhatsApp link', f.wa, ''); ok('phone and email links', f.tel && f.mail, 'tel ' + f.tel + ' mail ' + f.mail);
ok('every visible image has alt text', f.noAlt === 0, f.noAlt + ' of ' + f.imgs + ' empty');
ok('fonts self-hosted (no Google Fonts)', !f.gfonts, '');
ok('HTML under 500 KB, inline CSS+JS under 80 KB', f.htmlBytes < 500000 && f.inlineBytes < 80000, Math.round(f.htmlBytes / 1024) + ' KB html, ' + Math.round(f.inlineBytes / 1024) + ' KB inline');
const raster = d.reqs.filter(r => /\.(jpe?g|png)(\?|$)/i.test(r.url) && !/og\.jpg/.test(r.url)).length;
ok('images are WebP or AVIF (jpg/png only for the share image)', raster === 0, raster + ' jpg/png requests');
ok('no http:// resources (mixed content)', !d.reqs.some(r => r.url.startsWith('http://') && !r.url.startsWith(origin)), '');
// Arabic marks: a masked box must be tall enough for the text's real ascent and descent
if ((f.lang || '').startsWith('ar')) {
  const clip = await d.pg.evaluate(() => { const c = document.createElement('canvas').getContext('2d'); const out = []; document.querySelectorAll('body *').forEach(e => { const cs = getComputedStyle(e); if (cs.overflow !== 'hidden' && cs.overflowY !== 'hidden') return; const rb = e.getBoundingClientRect(); if (rb.width <= 2 || rb.height <= 2 || cs.clip !== 'auto' || cs.clipPath !== 'none') return; const t = e.textContent.trim(); if (!/[؀-ۿ]/.test(t) || e.children.length > 3 || t.length > 40) return; c.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`; const mm = c.measureText(t); const need = mm.actualBoundingBoxAscent + mm.actualBoundingBoxDescent; const h = e.getBoundingClientRect().height; if (h > 0 && h < need - 1) out.push(t.slice(0, 14) + ' box ' + Math.round(h) + ' < ink ' + Math.round(need)); }); return [...new Set(out)].slice(0, 6); });
  ok('arabic: no mask shorter than its letters and marks', clip.length === 0, clip.join(' | '));
}
await d.ctx.close(); await b.close();

// ---- live only ----
if (live) {
  const get = async (p, opts = {}) => { try { const r = await fetch(p, { redirect: 'manual', headers: { 'User-Agent': 'Mozilla/5.0 (site-audit)' }, ...opts }); return r; } catch (e) { return null; } };
  const http = await get(origin.replace('https://', 'http://') + '/');
  ok('live: http redirects to https', !!http && [301, 302, 308].includes(http.status) && (http.headers.get('location') || '').startsWith('https://'), http ? http.status + ' ' + http.headers.get('location') : 'no answer');
  const www = await get(origin.replace('https://', 'https://www.') + '/');
  ok('live: www redirects to the main domain', !!www && [301, 302, 308].includes(www.status), www ? String(www.status) : 'no DNS');
  const home = await get(url); const h = home ? home.headers : new Map();
  ok('live: HSTS', !!h.get && !!h.get('strict-transport-security'), '');
  ok('live: Content-Security-Policy', !!h.get && !!h.get('content-security-policy'), '');
  ok('live: X-Content-Type-Options and X-Frame-Options', !!h.get && !!h.get('x-content-type-options') && !!h.get('x-frame-options'), '');
  ok('live: HTML not cached long', !!h.get && /max-age=0|no-cache|must-revalidate/.test(h.get('cache-control') || ''), h.get ? h.get('cache-control') : '');
  const html = home ? await home.text() : ''; const mm = html.match(/(media\/[^"' )]+\.(css|webp|js))/); 
  if (mm) { const mr = await get(origin + '/' + mm[1]); const cc = mr ? mr.headers.get('cache-control') || '' : ''; ok('live: media immutable, one Cache-Control', /immutable/.test(cc) && !/,\s*public,/.test(cc.replace(/^public,/, '')), cc); }
  const sm = await get(origin + '/sitemap.xml'); const smt = sm && sm.status === 200 ? await sm.text() : '';
  ok('live: sitemap.xml lists this page', smt.includes('<loc>' + url.replace(/\/?$/, '/') + '</loc>') || smt.includes('<loc>' + url + '</loc>'), sm ? String(sm.status) : 'none');
  const rb = await get(origin + '/robots.txt'); const rbt = rb && rb.status === 200 ? await rb.text() : '';
  ok('live: robots.txt names the sitemap', /Sitemap:/i.test(rbt), '');
  const ll = await get(origin + '/llms.txt'); ok('live: llms.txt present', !!ll && ll.status === 200, '');
}
console.log(out.join('\n')); console.log(fails ? `\n${fails} FAIL` : '\nALL PASS'); process.exit(fails ? 1 : 0);
