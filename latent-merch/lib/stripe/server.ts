import Stripe from "stripe";

// Server-only. STRIPE_SECRET_KEY must never reach the client.
// Lazy so the app can build without keys (pre-launch / marketing-only mode).
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Either fill .env.local, or set NEXT_PUBLIC_COMMERCE_ENABLED=false to run in marketing-only mode."
    );
  }
  _stripe = new Stripe(key);
  return _stripe;
}

// Back-compat: existing imports use { stripe }. Proxy so the call resolves lazily.
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    const s = getStripe();
    const value = (s as unknown as Record<string | symbol, unknown>)[prop];
    return typeof value === "function" ? (value as Function).bind(s) : value;
  },
});
