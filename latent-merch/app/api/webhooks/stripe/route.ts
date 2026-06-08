import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { createServiceClient } from "@/lib/supabase/server";
import type Stripe from "stripe";

// The ONLY place an order becomes real. Verify signature before trusting anything.
export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Bad signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const supabase = createServiceClient();
    const cart = JSON.parse((session.metadata?.cart as string) || "[]");

    // Insert the order + items and decrement stock.
    // Wrap in a Postgres function/transaction for atomicity (see schema.sql: place_order RPC).
    await supabase.rpc("place_order", {
      p_stripe_session: session.id,
      p_email: session.customer_details?.email ?? null,
      p_amount_minor: session.amount_total ?? 0,
      p_currency: session.currency ?? "usd",
      p_items: cart,
    });
  }

  return NextResponse.json({ received: true });
}
