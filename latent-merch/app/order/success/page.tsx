import Link from "next/link";
import { OrderSuccessAnim } from "./OrderSuccessAnim";

// Stripe redirects here with ?session_id=... after Checkout.
// We do NOT mark the order paid here — only the verified webhook does that.
// This page is purely a thank-you / receipt confirmation.
export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  return (
    <main className="relative min-h-screen overflow-hidden bg-jadeDeep">
      <div className="jspace-base absolute inset-0" />
      <div className="jspace-neb jspace-neb-a" />
      <div className="jspace-neb jspace-neb-b" />
      <div className="jspace-stars" />

      <OrderSuccessAnim />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center md:px-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-metalLit">
          ə · received
        </p>
        <h1 className="mt-6 text-[clamp(48px,9vw,128px)] font-extrabold leading-[0.88] tracking-[-0.045em] lowercase text-paper">
          thank you.
        </h1>
        <p className="mt-8 max-w-md text-base leading-relaxed text-paper/65">
          Your order is in the void. A confirmation will land in your inbox shortly. Each piece is
          cut from raw cotton and finished by hand — allow up to seven days before it ships.
        </p>

        {session_id && (
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.28em] text-paper/35">
            ref · {session_id.slice(-12)}
          </p>
        )}

        <Link
          href="/"
          className="mt-12 rounded-full border border-paper/30 px-7 py-3 font-mono text-[11px] uppercase tracking-[0.32em] text-paper transition-colors duration-500 hover:border-metalLit hover:text-metalLit"
        >
          back to the drop
        </Link>
      </div>
    </main>
  );
}
