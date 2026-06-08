# Latent Merch — Build Guide for Claude Code

## What this is
Production storefront for **Latent Merch**, an AI-native apparel sub-brand of Latent Studio (Amman).
Custom commerce — NOT Shopify. We own catalog, cart, checkout, orders, and payments.

## Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS
- framer-motion — port the motion work from the HTML prototype (see MIGRATION.md)
- Supabase — Postgres (catalog + orders) + Storage (garment media) + Auth (later)
- Stripe — payments via Checkout Sessions + webhooks for order fulfillment
- Deploy: Vercel

## First moves
1. `npm install`
2. Copy `.env.example` -> `.env.local` and fill in keys (see SECURITY below)
3. Apply `supabase/schema.sql` to your Supabase project (SQL editor or `supabase db push`)
4. `npm run dev`
5. Then start the port from the HTML prototype — read MIGRATION.md.

## Commerce architecture
- **Catalog**: `products` + `product_variants` in Postgres. Variant = size/color SKU with price + stock.
- **Read path**: storefront pages fetch catalog with the Supabase anon client (RLS: public read on
  active products only).
- **Checkout**: client POSTs cart to `/api/checkout`. Server re-reads prices from DB (NEVER trust
  client prices), creates a Stripe Checkout Session, returns the URL, redirect.
- **Fulfillment**: Stripe webhook -> `/api/webhooks/stripe` verifies signature, writes the `orders`
  row, decrements stock. This is the ONLY place an order becomes real.
- **Stock**: decrement in the webhook inside a transaction; treat the DB as source of truth.

## SECURITY — do not get this wrong
- `SUPABASE_SERVICE_ROLE_KEY` and `STRIPE_SECRET_KEY` are server-only. Never import them into a
  client component, never prefix with NEXT_PUBLIC_. Use them only in /app/api routes and lib/*/server.
- Only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` may reach the browser.
- Enable RLS on every table. Public gets SELECT on active products/variants only. Writes go through
  server routes using the service role.
- The Stripe webhook MUST verify the signature with STRIPE_WEBHOOK_SECRET before trusting anything.
- Compute order totals server-side from DB prices. The client cart is a suggestion, not a source of truth.

## Conventions
- Server Components by default; `"use client"` only for cart UI and motion.
- Money in integer minor units (fils/cents), never floats.
- One Stripe client (lib/stripe), two Supabase clients (lib/supabase: browser anon, server service-role).

## Don't
- Don't store card data — Stripe Checkout handles PCI scope.
- Don't mark orders paid from the client or the success redirect — only the verified webhook does that.
- Don't hardcode prices in the frontend.
