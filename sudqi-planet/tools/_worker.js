/* Sudqi Planet — Cloudflare Pages worker (copied to dist/_worker.js by build.py).
 *
 * It answers /api/*; every other request is passed to the static files
 * (env.ASSETS) with the long-cache headers kept.
 *
 *   GET  /api/offer            → { code, percent, limit, used, remaining, live }
 *   POST /api/shopify/orders   ← Shopify "Order creation" webhook. Every order
 *                                that used the code counts once (by order id).
 *
 * Cloudflare settings for the Pages project (Settings → Variables and Secrets / Bindings):
 *   OFFER                   KV namespace binding (the counter is stored there)
 *   SHOPIFY_WEBHOOK_SECRET  secret: the key shown under Shopify admin →
 *                           Settings → Notifications → Webhooks
 *   OFFER_CODE / OFFER_LIMIT / OFFER_PERCENT   optional, default PLANET20 / 20 / 20
 *   OFFER_USED              optional: orders that used the code before the counter existed
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/offer") return offer(env);
    if (url.pathname === "/api/shopify/orders" && request.method === "POST") return orderHook(request, env);
    return withCache(url, await env.ASSETS.fetch(request));
  },
};

// Same rules as _headers, set here too so they hold whichever way the site is deployed:
// fingerprinted files cache for a year, pages always revalidate.
function withCache(url, res) {
  if (res.status !== 200) return res;
  const r = new Response(res.body, res);
  if (url.pathname.startsWith("/assets/")) r.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  else if ((r.headers.get("content-type") || "").includes("text/html")) r.headers.set("Cache-Control", "public, max-age=0, must-revalidate");
  return r;
}

function settings(env) {
  return {
    code: String(env.OFFER_CODE || "PLANET20").toUpperCase(),
    limit: parseInt(env.OFFER_LIMIT || "20", 10),
    percent: parseInt(env.OFFER_PERCENT || "20", 10),
    base: parseInt(env.OFFER_USED || "0", 10) || 0,
  };
}

function json(data, status = 200, maxAge = 0) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": maxAge ? `public, max-age=${maxAge}` : "no-store",
    },
  });
}

async function offer(env) {
  const s = settings(env);
  if (!env.OFFER) return json({ code: s.code, percent: s.percent, limit: s.limit, live: false }, 200);
  const counted = parseInt((await env.OFFER.get("used:" + s.code)) || "0", 10) || 0;
  const used = Math.min(s.limit, s.base + counted);
  return json({ code: s.code, percent: s.percent, limit: s.limit, used, remaining: s.limit - used, live: true }, 200, 20);
}

async function orderHook(request, env) {
  const body = await request.text();
  if (!env.SHOPIFY_WEBHOOK_SECRET || !(await validHmac(body, request.headers.get("x-shopify-hmac-sha256"), env.SHOPIFY_WEBHOOK_SECRET))) {
    return new Response("unauthorized", { status: 401 });
  }
  if (!env.OFFER) return new Response("no counter", { status: 200 });

  let order;
  try { order = JSON.parse(body); } catch (e) { return new Response("bad json", { status: 400 }); }
  const s = settings(env);
  const used = (order.discount_codes || []).some((d) => String(d.code || "").toUpperCase() === s.code);
  if (!used || !order.id) return new Response("ok", { status: 200 });

  // Shopify can deliver the same webhook more than once: count each order once.
  const seenKey = "order:" + s.code + ":" + order.id;
  if (await env.OFFER.get(seenKey)) return new Response("ok", { status: 200 });
  await env.OFFER.put(seenKey, new Date().toISOString());
  const key = "used:" + s.code;
  const n = (parseInt((await env.OFFER.get(key)) || "0", 10) || 0) + 1;
  await env.OFFER.put(key, String(n));
  return new Response("ok", { status: 200 });
}

async function validHmac(body, header, secret) {
  if (!header) return false;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(body)));
  let given;
  try { given = Uint8Array.from(atob(header), (c) => c.charCodeAt(0)); } catch (e) { return false; }
  if (given.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= sig[i] ^ given[i];
  return diff === 0;
}
