"use client";

import { motion } from "framer-motion";
import { expoOut } from "@/lib/motion";
import { useEffect } from "react";
import { useCart } from "@/lib/cart";

export function OrderSuccessAnim() {
  const { clear } = useCart();

  // Clear cart on success render — the order is already in the webhook pipeline.
  useEffect(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 0.18, scale: 1 }}
      transition={{ duration: 2.4, ease: expoOut }}
      className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[80vh] w-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-jadeLit/40 blur-[120px]"
    />
  );
}
