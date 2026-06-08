import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { createServiceClient } from "@/lib/supabase/server";

// POST { items: [{ variantId, quantity }] }
// Server re-reads prices from DB. Client-supplied prices are ignored.
export async function POST(req: Request) {
  try {
    const { items } = await req.json();
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Empty cart" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const variantIds = items.map((i: { variantId: string }) => i.variantId);

    const { data: variants, error } = await supabase
      .from("product_variants")
      .select("id, sku, price_minor, currency, stock, product:products(name)")
      .in("id", variantIds);

    if (error || !variants) {
      return NextResponse.json({ error: "Catalog lookup failed" }, { status: 500 });
    }

    const line_items = items.map((i: { variantId: string; quantity: number }) => {
      const v = variants.find((x) => x.id === i.variantId);
      if (!v) throw new Error("Unknown variant");
      if (v.stock < i.quantity) throw new Error("Out of stock");
      return {
        quantity: i.quantity,
        price_data: {
          currency: v.currency,
          unit_amount: v.price_minor, // trusted, from DB
          product_data: { name: `${(v.product as any)?.name ?? "Item"} — ${v.sku}` },
        },
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
      metadata: { cart: JSON.stringify(items) },
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
