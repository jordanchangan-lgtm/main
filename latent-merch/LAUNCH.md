# Latent Merch — Launch Runbook

Step-by-step to take the site from local code to a live storefront accepting real payments.
Reads top-to-bottom. Each step has an exit criterion you can verify before moving on.

---

## 0 · Pre-launch decisions (5 min)

Make these calls first — they're the only things that can force a rework later.

- **Currency.** The frontend prices in **JOD** (Jordanian dinar). Stripe accepts JOD, but only if your Stripe account country is set to a region permitted to charge it. If your Stripe account is registered in a country that can't transact JOD, switch to USD or EUR before going further. To change: edit `supabase/seed.sql` (`currency 'jod'` → `'usd'`) and the priceLabel strings in `components/ProductShowcase.tsx` + `lib/cart.tsx` (`formatMoney` will still render the new code correctly).
- **Domain.** Decide your production domain now (e.g. `latent.studio` or `merch.latent.studio`). You'll wire it into Vercel + Stripe webhook + Supabase.
- **Stripe mode.** Run everything in **test mode** first. Only flip the keys to live after the test purchase round-trips successfully.

---

## 1 · Supabase project (10 min)

### 1.1 Create the project
1. Go to <https://supabase.com> → New project.
2. Region: pick one near your customers (eu-central-1 for MENA traffic).
3. Save the **Project URL**, **anon public key**, and **service role key** somewhere private (you'll paste them into `.env.local` in step 4).

### 1.2 Apply the schema
In the Supabase dashboard → **SQL Editor** → New query:

1. Paste the entire contents of `supabase/schema.sql` and run.
2. Paste `supabase/seed.sql` and run.

**Exit criterion:** in **Table editor**, you should see `products` (2 rows: tee + hoodie) and `product_variants` (10 rows: 5 sizes × 2 products).

### 1.3 RLS sanity check
Open the SQL editor as **anon** (toggle role in the editor) and run:
```sql
select id, name from products;
```
You should get 2 rows back. Then:
```sql
insert into orders (stripe_session, amount_minor, currency) values ('test', 1, 'jod');
```
This should **fail** with a permissions error — that's correct. Only the service role can write orders.

---

## 2 · Stripe (10 min)

### 2.1 Account + keys (test mode)
1. Sign up at <https://stripe.com>.
2. Confirm in dashboard that **test mode** is on (toggle top-right).
3. **Developers → API keys** → copy the **Publishable key** (not used here, but keep) and the **Secret key** (`sk_test_...`).

### 2.2 Webhook endpoint
This is the only way an order becomes real, so don't skip it.

For **local dev** (using Stripe CLI):
1. Install: <https://docs.stripe.com/stripe-cli>.
2. Login: `stripe login`.
3. Forward events to your local API route:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
4. The command prints `Ready! Your webhook signing secret is whsec_...` — save it as `STRIPE_WEBHOOK_SECRET` for local dev.

For **production**:
1. **Developers → Webhooks → Add endpoint**.
2. URL: `https://YOUR_DOMAIN/api/webhooks/stripe`.
3. Events to listen for: **checkout.session.completed** (that's all `app/api/webhooks/stripe/route.ts` handles right now).
4. After creating, click into the endpoint → **Signing secret** → reveal → that's `STRIPE_WEBHOOK_SECRET` for prod (different from the local one).

---

## 3 · Environment variables (2 min)

```bash
cd latent-merch
cp .env.example .env.local
```

Open `.env.local` and fill in:

```bash
# Public — safe in the browser
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...           # anon public key
NEXT_PUBLIC_SITE_URL=http://localhost:3000            # change to https://your-domain in prod

# Server-only — NEVER prefix with NEXT_PUBLIC_, NEVER import client-side
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...               # service_role secret
STRIPE_SECRET_KEY=sk_test_...                          # use sk_live_... only after the test round-trip
STRIPE_WEBHOOK_SECRET=whsec_...                        # from stripe listen output (or prod endpoint)
```

**Exit criterion:** `.env.local` exists and is **not** in git (verified by `git status` — it should be ignored).

---

## 4 · Local round-trip (5 min)

Open three terminals.

**Terminal A** — dev server:
```bash
cd latent-merch
npm run dev
```

**Terminal B** — Stripe webhook forwarder:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

**Terminal C** — used in step 4.3 to verify the DB.

### 4.1 Visual smoke test
Open <http://localhost:3000>. Walk the page:
- Hero loads with cosmic jade and staggered entrance
- Falling model panel works on scroll
- X-ray reveal follows the cursor
- Product cards spin (rotating webms)
- Lookbook spreads parallax cleanly
- Manifesto + Footer render

### 4.2 Checkout round-trip
1. Click **shop the drop**.
2. On a product, select a size, click **add to cart**.
3. Cart drawer opens — verify subtotal looks right.
4. Click **checkout** → should redirect to Stripe-hosted Checkout.
5. Use Stripe's test card: `4242 4242 4242 4242`, any future date, any CVC, any postcode.
6. Submit → you should land on `/order/success` with a `ref · ` code.

### 4.3 Verify the order landed
In Terminal C, open a Supabase SQL editor or run:
```sql
select * from orders order by created_at desc limit 1;
select * from order_items order by id desc limit 5;
select id, sku, stock from product_variants where id in (
  '1a000000-0000-4000-8000-000000000003',
  '2b000000-0000-4000-8000-000000000003'
);
```
You should see:
- A new row in `orders` with `status = 'paid'` and the `stripe_session` populated
- One row per cart line in `order_items`
- Stock decremented on the variants you purchased

**Exit criterion:** all three queries return what you expect. If the order didn't write, check Terminal B for the webhook event — `stripe listen` will show `[200]` for success or `[4xx/5xx]` with the error.

---

## 5 · Vercel deploy (10 min)

### 5.1 Push your branch and import
1. Make sure the repo is pushed: `git push -u origin <your-branch>`.
2. <https://vercel.com/new> → import the repo.
3. **Root directory**: `latent-merch` (this monorepo has the Vite project at the root too — point Vercel at the subfolder).
4. **Build command**: `next build` (default). **Output**: `.next` (default).

### 5.2 Environment variables
In Vercel → Project → **Settings → Environment Variables**, add the same five keys from `.env.local`, with two changes:
- `NEXT_PUBLIC_SITE_URL` → `https://your-vercel-domain.vercel.app` (or your custom domain)
- `STRIPE_WEBHOOK_SECRET` → the **production** signing secret from step 2.2, not the `stripe listen` one

Apply to **Production**, **Preview**, and **Development** as appropriate.

### 5.3 Deploy
Trigger a deploy. After it goes green, open the site and walk it once.

### 5.4 Update the Stripe webhook
Back in Stripe → **Developers → Webhooks** → your endpoint:
- Confirm the URL is `https://YOUR_DOMAIN/api/webhooks/stripe`
- Send a **test event** (`checkout.session.completed`) — Stripe will dispatch a synthetic event and show you the response. Should be `200`.

### 5.5 Live checkout round-trip
Repeat **step 4.2** but against the production URL. Use a test card. Confirm the row lands in Supabase.

---

## 6 · Flip to live (after successful test round-trip)

1. In Stripe dashboard, switch **test mode → live**. Note: live keys differ from test keys.
2. In Vercel env vars, swap:
   - `STRIPE_SECRET_KEY` → `sk_live_...`
   - `STRIPE_WEBHOOK_SECRET` → the live endpoint's signing secret (you may need to add a new endpoint in live mode and grab its secret)
3. Redeploy.
4. Place one real order yourself with a real card. Refund yourself afterwards from the Stripe dashboard.

**You're live.** 🟢

---

## 7 · Operations cheatsheet

### Add a new product
1. Add the row to `supabase/seed.sql` (or just insert directly via the SQL editor).
2. Add a new card object to `components/ProductShowcase.tsx`'s `PRODUCTS` array — including the variant UUIDs you used.
3. Drop the product media in `public/`.
4. Commit, push, redeploy.

### Adjust stock
```sql
update product_variants set stock = 100 where sku = 'TEE-BONE-M';
```

### Pause a product (hide from the shop)
```sql
update products set active = false where handle = 'hoodie';
```
RLS will stop the public-read query from returning it. The frontend currently hard-codes products, so also remove or guard the card in `ProductShowcase.tsx`. (Future: switch the showcase to a server-side fetch of `active = true` products.)

### Refund / cancel
Refund from the Stripe dashboard. The order row stays as `status = 'paid'`. If you want a clean state, also update:
```sql
update orders set status = 'refunded' where stripe_session = 'cs_test_...';
```
(No DB column triggers further behaviour off this — it's audit only.)

### Inspect orders
```sql
select o.created_at, o.email, o.amount_minor, o.currency, count(oi.id) as items
from orders o
left join order_items oi on oi.order_id = o.id
group by o.id
order by o.created_at desc
limit 20;
```

---

## 8 · Known follow-ups (won't block launch)

- **Stock UI** — schema has `stock` per variant but the cards don't show "sold out" / "low stock" yet.
- **Order detail on success** — `/order/success` only shows the session ref. Fetch the order + items from Supabase and render a real receipt.
- **Product detail pages** — currently the homepage is the only product surface. Deep links / shares require routes like `/p/[handle]`.
- **SEO** — `app/layout.tsx` has basic metadata. Add Open Graph image (`/opengraph-image.png`), `sitemap.ts`, `robots.ts`.
- **Email confirmation** — Stripe sends a default receipt. A branded one needs a webhook → email service (Resend/Postmark) integration.
- **X-ray "under" layer** — currently a CSS recolor of the same image; replacing with a real second photo (same model in just the tee) tightens the story.

These are improvements, not blockers. The site can ship now.
