"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useCart } from "@/lib/cart";
import { COMMERCE_ENABLED } from "@/lib/config";
import { expoOut, silk, fadeUp, stagger } from "@/lib/motion";
import { useEffect, useState } from "react";

const LINKS: [label: string, href: string][] = [
  ["shop", "#shop"],
  ["manifesto", "#manifesto"],
  ["lookbook", "#lookbook"],
];

export function NavHeader() {
  const { count, toggle } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 200], [0, 0.85]);
  const blurPx = useTransform(scrollY, [0, 200], [0, 14]);
  const borderOpacity = useTransform(scrollY, [0, 200], [0, 0.08]);
  const bgColor = useTransform(bgOpacity, (o) => `rgba(10, 11, 13, ${o})`);
  const backdrop = useTransform(blurPx, (b) => `blur(${b}px)`);
  const borderColor = useTransform(borderOpacity, (o) => `rgba(243, 239, 230, ${o})`);

  // Scroll-lock + Esc when mobile menu is open
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  return (
    <>
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
            {/* Wordmark — prototype's actual "latent" wordmark */}
            <a href="#" className="group flex items-center gap-3">
              <Image
                src="/wordmark-latent.png"
                alt="Latent"
                width={120}
                height={32}
                priority
                className="h-6 w-auto transition-opacity duration-500 group-hover:opacity-80"
              />
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.34em] text-paper/60 sm:inline-block">
                merch
              </span>
            </a>

            {/* Desktop nav */}
            <nav className="hidden gap-9 md:flex">
              {LINKS.map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  className="font-mono text-[11px] uppercase tracking-[0.3em] text-paper/70 transition-colors duration-500 hover:text-metalLit"
                >
                  {label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2.5">
              {/* Cart — only in commerce mode */}
              {COMMERCE_ENABLED ? (
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
              ) : (
                <span className="hidden rounded-full border border-metalLit/40 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.32em] text-metalLit md:inline-block">
                  drop · soon
                </span>
              )}

              {/* Mobile menu trigger */}
              <button
                onClick={() => setMobileOpen((o) => !o)}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-paper/15 transition-colors duration-500 hover:border-metalLit/60 md:hidden"
              >
                <BurgerMark open={mobileOpen} />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.header>

      {/* Mobile drawer — slides from top, takes ~75vh */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: expoOut }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-ink/70 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.8, ease: expoOut }}
              className="fixed inset-x-0 top-0 z-40 border-b border-paper/8 bg-jadeDeep/95 backdrop-blur-xl md:hidden"
            >
              {/* Ambient nebula glow inside the drawer */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -left-20 -top-10 h-72 w-72 rounded-full bg-jadeLit/15 blur-[80px]" />
                <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-metal/10 blur-[100px]" />
              </div>

              <motion.div
                variants={stagger(0.35, 0.09)}
                initial="hidden"
                animate="show"
                exit="hidden"
                className="relative px-6 pb-12 pt-28"
              >
                <motion.p
                  variants={fadeUp}
                  className="mb-8 font-mono text-[10px] uppercase tracking-[0.34em] text-metalLit"
                >
                  ə · the drop
                </motion.p>
                <nav className="flex flex-col gap-1">
                  {LINKS.map(([label, href]) => (
                    <motion.a
                      key={label}
                      variants={fadeUp}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className="group flex items-baseline justify-between border-b border-paper/8 py-5 text-[clamp(36px,9vw,56px)] font-extrabold leading-none tracking-tight lowercase text-paper transition-colors duration-500 hover:text-metalLit"
                    >
                      <span>{label}</span>
                      <motion.span
                        whileHover={{ x: 6 }}
                        transition={{ duration: 0.6, ease: silk }}
                        className="font-mono text-[11px] tracking-[0.32em] text-paper/40 group-hover:text-metalLit"
                      >
                        →
                      </motion.span>
                    </motion.a>
                  ))}
                </nav>

                <motion.div
                  variants={fadeUp}
                  className="mt-10 flex items-center justify-between border-t border-paper/8 pt-6"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-paper/40">
                    latent studio · amman
                  </p>
                  <div className="flex gap-4">
                    {["IG", "TT", "X"].map((s) => (
                      <a
                        key={s}
                        href="#"
                        className="font-mono text-[10px] uppercase tracking-[0.32em] text-paper/50 transition-colors duration-500 hover:text-metalLit"
                      >
                        {s}
                      </a>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function BurgerMark({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-paper" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      {/* Top bar -> upper diagonal of X */}
      <motion.line
        x1="4"
        x2="20"
        y1="9"
        y2="9"
        animate={open ? { rotate: 45, y: 3 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.5, ease: expoOut }}
        style={{ originX: "12px", originY: "9px" }}
      />
      {/* Middle bar -> fades */}
      <motion.line
        x1="4"
        x2="20"
        y1="12"
        y2="12"
        animate={open ? { opacity: 0, x: -8 } : { opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: expoOut }}
      />
      {/* Bottom bar -> lower diagonal of X */}
      <motion.line
        x1="4"
        x2="20"
        y1="15"
        y2="15"
        animate={open ? { rotate: -45, y: -3 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.5, ease: expoOut }}
        style={{ originX: "12px", originY: "15px" }}
      />
    </svg>
  );
}
