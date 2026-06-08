import Stripe from "stripe";

// Server-only. STRIPE_SECRET_KEY must never reach the client.
// apiVersion intentionally omitted -> uses the account default pinned in Stripe dashboard.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
