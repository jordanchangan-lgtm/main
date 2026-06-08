"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCart, formatMoney } from "@/lib/cart";
import { expoOut, silk } from "@/lib/motion";
import { useEffect } from "react";

export function CartDrawer() {
  const { isOpen, close, lines, subtotalMinor, currency, remove, setQty, checkout, count } =
    useCart();

  // Esc to close + scroll lock while open
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: expoOut }}
            onClick={close}
            className="fixed inset-0 z-[60] bg-ink/70 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.8, ease: expoOut }}
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col border-l border-paper/10 bg-ink shadow-2xl"
            role="dialog"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-paper/8 px-7 py-6">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-metalLit">
                  ə · cart
                </p>
                <h2 className="mt-1 text-2xl font-medium lowercase text-paper">
                  {count === 0 ? "empty" : `${count} ${count === 1 ? "piece" : "pieces"}`}
                </h2>
              </div>
              <button
                onClick={close}
                aria-label="Close cart"
                className="rounded-full border border-paper/15 p-2 text-paper/80 transition-colors duration-500 hover:border-metalLit hover:text-metalLit"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M5 5l14 14M19 5L5 19" />
                </svg>
              </button>
            </div>

            {/* Lines */}
            <div className="flex-1 overflow-y-auto px-7 py-6">
              {lines.length === 0 ? (
                <EmptyState onClose={close} />
              ) : (
                <ul className="space-y-6">
                  <AnimatePresence initial={false}>
                    {lines.map((line) => (
                      <motion.li
                        key={line.variantId}
                        layout
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40, height: 0 }}
                        transition={{ duration: 0.6, ease: silk }}
                        className="flex gap-4"
                      >
                        <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-jadeDeep/40">
                          <Image
                            src={line.image}
                            alt={line.name}
                            fill
                            sizes="80px"
                            className="object-contain p-2"
                          />
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-medium lowercase text-paper">
                                {line.name}
                              </p>
                              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.24em] text-paper/45">
                                size · {line.size}
                              </p>
                            </div>
                            <button
                              onClick={() => remove(line.variantId)}
                              aria-label={`Remove ${line.name}`}
                              className="text-paper/40 transition-colors hover:text-metalLit"
                            >
                              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
                                <path d="M5 5l14 14M19 5L5 19" />
                              </svg>
                            </button>
                          </div>
                          <div className="flex items-end justify-between">
                            <QtyStepper
                              value={line.quantity}
                              onChange={(q) => setQty(line.variantId, q)}
                            />
                            <p className="font-mono text-sm text-paper">
                              {formatMoney(line.priceMinor * line.quantity, line.currency)}
                            </p>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer / checkout */}
            {lines.length > 0 && (
              <motion.div
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: expoOut, delay: 0.2 }}
                className="border-t border-paper/8 px-7 py-7"
              >
                <div className="mb-5 flex items-end justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-paper/50">
                    subtotal
                  </span>
                  <span className="text-xl font-medium text-paper">
                    {formatMoney(subtotalMinor, currency)}
                  </span>
                </div>
                <button
                  onClick={checkout}
                  className="group flex w-full items-center justify-between rounded-full bg-paper px-7 py-4 text-sm font-medium tracking-wide text-ink transition-colors duration-500 hover:bg-metalLit"
                >
                  <span>checkout</span>
                  <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
                <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.28em] text-paper/35">
                  shipping calculated at checkout
                </p>
              </motion.div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function QtyStepper({ value, onChange }: { value: number; onChange: (q: number) => void }) {
  return (
    <div className="flex items-center gap-3 rounded-full border border-paper/15 px-3 py-1">
      <button
        aria-label="Decrease"
        onClick={() => onChange(value - 1)}
        className="text-paper/60 transition-colors hover:text-metalLit"
      >
        −
      </button>
      <span className="font-mono text-xs text-paper">{value}</span>
      <button
        aria-label="Increase"
        onClick={() => onChange(value + 1)}
        className="text-paper/60 transition-colors hover:text-metalLit"
      >
        +
      </button>
    </div>
  );
}

function EmptyState({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: expoOut, delay: 0.2 }}
      className="flex h-full flex-col items-center justify-center pt-12 text-center"
    >
      <div className="mb-6 h-16 w-16 rounded-full border border-paper/15" />
      <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-paper/50">
        nothing yet
      </p>
      <p className="mt-3 max-w-[260px] text-sm leading-relaxed text-paper/40">
        Your cart waits in the void. Pick a piece to begin.
      </p>
      <button
        onClick={onClose}
        className="mt-7 rounded-full border border-paper/20 px-6 py-2.5 font-mono text-[10px] uppercase tracking-[0.3em] text-paper/80 transition-colors duration-500 hover:border-metalLit hover:text-metalLit"
      >
        back to the drop
      </button>
    </motion.div>
  );
}
