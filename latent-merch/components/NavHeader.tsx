"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useCart } from "@/lib/cart";
import { expoOut } from "@/lib/motion";

export function NavHeader() {
  const { count, toggle } = useCart();
  const { scrollY } = useScroll();
  // background becomes opaque as you scroll
  const bgOpacity = useTransform(scrollY, [0, 200], [0, 0.85]);
  const blurPx = useTransform(scrollY, [0, 200], [0, 14]);
  const borderOpacity = useTransform(scrollY, [0, 200], [0, 0.08]);
  const bgColor = useTransform(bgOpacity, (o) => `rgba(10, 11, 13, ${o})`);
  const backdrop = useTransform(blurPx, (b) => `blur(${b}px)`);
  const borderColor = useTransform(borderOpacity, (o) => `rgba(243, 239, 230, ${o})`);

  return (
    <motion.header
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.2, ease: expoOut, delay: 0.2 }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <motion.div
        style={{
          backgroundColor: bgColor,
          backdropFilter: backdrop,
          borderBottomColor: borderColor,
        }}
        className="border-b border-transparent"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-12">
          {/* Wordmark */}
          <a href="#" className="group flex items-center gap-2">
            <SchwaMark />
            <span className="font-mono text-[11px] uppercase tracking-[0.34em] text-paper transition-colors group-hover:text-metalLit">
              latent merch
            </span>
          </a>

          {/* Nav links */}
          <nav className="hidden gap-9 md:flex">
            {[
              ["shop", "#shop"],
              ["manifesto", "#manifesto"],
              ["lookbook", "#lookbook"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="font-mono text-[11px] uppercase tracking-[0.3em] text-paper/70 transition-colors duration-500 hover:text-metalLit"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Cart */}
          <button
            onClick={toggle}
            aria-label={`Open cart, ${count} items`}
            className="group relative flex items-center gap-2.5 rounded-full border border-paper/15 px-4 py-2 transition-colors duration-500 hover:border-metalLit/60"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-paper/80 transition-colors group-hover:text-metalLit">
              cart
            </span>
            <motion.span
              key={count}
              initial={{ scale: 1.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: expoOut }}
              className="flex h-5 min-w-5 items-center justify-center rounded-full bg-metalLit px-1.5 text-[10px] font-medium text-ink"
            >
              {count}
            </motion.span>
          </button>
        </div>
      </motion.div>
    </motion.header>
  );
}

function SchwaMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-metalLit" aria-hidden>
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <rect x="3" y="11" width="18" height="2.2" fill="currentColor" />
    </svg>
  );
}
