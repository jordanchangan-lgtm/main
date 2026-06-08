// Centralised feature flags.
// COMMERCE_ENABLED gates cart / checkout UI. Default false so a fresh
// deploy without Supabase/Stripe keys renders in pre-launch mode.
export const COMMERCE_ENABLED =
  process.env.NEXT_PUBLIC_COMMERCE_ENABLED === "true";

// Where the "notify me" CTAs send their mail.
export const WAITLIST_EMAIL =
  process.env.NEXT_PUBLIC_WAITLIST_EMAIL || "hello@latent.studio";
