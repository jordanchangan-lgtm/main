# Latent Merch — Cloudflare Subdomain Setup

Pointing your Cloudflare-managed subdomain at the live site. Assumes
`LAUNCH.md` is already done (Supabase provisioned, Stripe wired) and the
site is ready to deploy.

**Architecture (Plan A — recommended):**

```
user → cloudflare DNS → vercel (Next.js host) → supabase + stripe
```

Cloudflare manages the domain and DNS; Vercel hosts the Next.js app
(including the API routes that touch Supabase and Stripe). This is the
fastest, lowest-risk path and what the rest of this doc walks through.

Plan B (full Cloudflare Pages hosting) is summarised at the bottom — use
it only if you have a specific reason to avoid Vercel.

---

## Prerequisites

- Cloudflare account already owns the root domain (e.g. `latent.studio`).
- You've decided the subdomain (e.g. `merch.latent.studio` or
  `shop.latent.studio`). The doc uses `merch.latent.studio` as the
  placeholder — substitute yours throughout.
- `LAUNCH.md` sections 1–4 complete (Supabase up, Stripe test keys, local
  round-trip green).

---

## 1 · Deploy to Vercel (3 min)

If you haven't already:

1. Push the branch: `git push -u origin <your-branch>`.
2. <https://vercel.com/new> → import the repo.
3. **Root directory** → set to `latent-merch` (this monorepo has the
   Vite project at the root; Vercel needs the Next.js subfolder).
4. Build command and output: leave defaults (`next build` / `.next`).
5. **Environment variables** — paste in the same 5 keys you used in
   `.env.local`. For now, set:
   - `NEXT_PUBLIC_SITE_URL=https://YOUR-PROJECT.vercel.app`
   - `STRIPE_WEBHOOK_SECRET` = the live (not test) webhook secret if
     you've already created the production Stripe endpoint;
     otherwise leave it for now and come back after step 4.

Deploy. Visit the `*.vercel.app` URL and confirm the site renders.

**Exit criterion:** the Vercel default URL works end-to-end (hero
animates, lookbook scrolls, add to cart opens the drawer).

---

## 2 · Add the custom domain in Vercel (2 min)

1. Vercel → your project → **Settings → Domains**.
2. Add domain → type `merch.latent.studio` → **Add**.
3. Vercel will show one of two DNS options:
   - **CNAME** (for subdomains — this is your case) → target is
     `cname.vercel-dns.com`.
   - **A record** (only for apex/root domains, e.g. `latent.studio`).
4. Leave this tab open — Vercel keeps polling until the DNS record is
   found.

---

## 3 · Add the DNS record in Cloudflare (3 min)

1. Cloudflare dashboard → select `latent.studio` → **DNS → Records**.
2. **Add record**:
   - **Type**: `CNAME`
   - **Name**: `merch` (just the subdomain part — Cloudflare appends the
     root automatically)
   - **Target**: `cname.vercel-dns.com`
   - **Proxy status**: **DNS only** (grey cloud) ← important for the
     first activation, see step 5 if you want to enable the proxy later
   - **TTL**: Auto
3. Save.

Within 30–60 seconds Vercel's tab from step 2 will flip to ✅ and start
provisioning an SSL certificate for `merch.latent.studio`. Wait until
both the domain and the certificate show green.

**Exit criterion:** `https://merch.latent.studio` loads the site over
HTTPS without warnings.

---

## 4 · Update env vars and Stripe webhook to the new domain (5 min)

### 4.1 Site URL
Vercel → Settings → Environment Variables:
- Change `NEXT_PUBLIC_SITE_URL` to `https://merch.latent.studio`.
- Apply to **Production** (also Preview if you want preview deploys to
  use a per-branch URL — usually leave Preview alone).
- **Redeploy** (Deployments → ⋯ → Redeploy) so the new env value bakes
  into the build.

### 4.2 Stripe webhook
In Stripe → **Developers → Webhooks**:
- Edit (or add) the endpoint URL → `https://merch.latent.studio/api/webhooks/stripe`.
- Confirm event types include **checkout.session.completed**.
- Reveal the signing secret and update `STRIPE_WEBHOOK_SECRET` in
  Vercel env vars.
- Redeploy.
- Click **Send test webhook** in Stripe → expect a `200` response.

### 4.3 Verify
Run the live round-trip from `LAUNCH.md` section 5.5 against
`https://merch.latent.studio`. Buy with test card `4242 4242 4242 4242`,
confirm the order row lands in Supabase, the success page renders, and
the cart clears.

**Exit criterion:** test purchase round-trips end-to-end through the
custom domain. You're live.

---

## 5 · Cloudflare proxy (orange cloud) — optional

The DNS-only setup from step 3 works perfectly, but you may want
Cloudflare's CDN / WAF / analytics on top. To enable:

1. Cloudflare → SSL/TLS → **Overview**.
2. Set encryption mode to **Full (strict)**. Anything less and Cloudflare
   will either refuse Vercel's cert or downgrade to an insecure mode.
3. DNS → Records → flip the `merch` CNAME proxy status to **Proxied**
   (orange cloud).
4. Wait 1–2 minutes. Reload the site, hard-refresh. Should still work.

Notes if you turn proxy on:
- **WebSockets** are fine on default plans for proxied subdomains, so
  Next.js HMR + Stripe checkout work.
- **Cache rules**: Cloudflare won't cache the HTML by default (it
  respects Vercel's headers). If you start seeing stale pages, check
  Cloudflare → Caching → Configuration.
- **Country blocking**: if you set Cloudflare WAF rules, make sure
  Stripe webhook IPs aren't blocked. Webhooks come from Stripe's IP
  ranges → Cloudflare Security → WAF → allowlist them if needed.

If anything weird happens, flip back to DNS-only (grey cloud) — that
isolates the issue to your Cloudflare config and not the app.

---

## 6 · Common gotchas

- **`NEXT_PUBLIC_SITE_URL` mismatch.** If this still points to
  `*.vercel.app`, the Stripe checkout `success_url` and `cancel_url`
  will redirect users back to the wrong host after payment. Update and
  redeploy.
- **Webhook signature mismatch (`Bad signature` 400).** You're using
  the test webhook secret in prod, or vice versa. Each Stripe endpoint
  (test, live, local stripe-cli) has its own signing secret — they
  aren't interchangeable.
- **Mixed-content warnings.** Make sure every URL in env vars is
  `https://`, not `http://`.
- **Cloudflare "host error" 522/523.** Almost always a misconfigured
  proxy: SSL/TLS mode set to anything below Full (strict) while proxy
  is on. Fix in section 5.
- **Cert not provisioning.** Vercel's cert can take up to ~30 minutes
  to provision the first time. If it's been more than an hour, delete
  the domain from Vercel and re-add — usually fixes it.

---

## Plan B — Cloudflare Pages (full Cloudflare hosting)

If you specifically want everything on Cloudflare:

1. Install the adapter: `npm install -D @cloudflare/next-on-pages`.
2. Add `pages-build` script in `package.json`:
   `"pages-build": "npx @cloudflare/next-on-pages"`.
3. In Cloudflare dashboard → **Workers & Pages → Create application →
   Pages → Connect to Git**.
4. Build command: `npm run pages-build`. Build output: `.vercel/output/static`.
5. **Compatibility flag**: `nodejs_compat` (required for the Supabase
   and Stripe Node SDKs).
6. Set the same 5 environment variables.
7. **Custom domain** in Pages → add `merch.latent.studio`. Cloudflare
   will create the DNS record automatically since it's the same account.

Caveats for Plan B:
- API routes run on Cloudflare's edge runtime, not Node.js — the Stripe
  SDK works but watch the cold-start size budget (1 MB on free tier).
- Video files (`product-*.webm`, ~1.1 MB each) push the asset budget;
  consider moving them to R2 or Cloudflare Stream.
- Image optimization differs from Vercel's. May need to add
  `images.unoptimized: true` in `next.config.mjs` or wire up Cloudflare
  Images.
- `useScroll` + framer-motion all run fine since they're client-side.

For a $3k production storefront where reliability matters more than
keeping it all on one vendor, **Plan A is the right call**. Use Plan B
only if you have a hard requirement to consolidate.
