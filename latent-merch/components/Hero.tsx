"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { expoOut, fadeUp, stagger } from "@/lib/motion";
import { COMMERCE_ENABLED } from "@/lib/config";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // hero content drifts up + fades as you scroll away
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  // background parallax — slower than content
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <section ref={ref} className="relative h-screen overflow-hidden bg-jadeDeep">
      {/* Living jade space — cosmic gradient, ambient nebulae */}
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <div className="jspace-base absolute inset-0" />
        <div className="jspace-neb jspace-neb-a" />
        <div className="jspace-neb jspace-neb-b" />
        <div className="jspace-neb jspace-neb-c" />
        <div className="jspace-pulse" />
        <div className="jspace-stars" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        variants={stagger(0.4, 0.16)}
        initial="hidden"
        animate="show"
        className="relative z-10 flex h-full flex-col justify-end px-8 pb-24 md:px-20 md:pb-32"
      >
        <motion.p
          variants={fadeUp}
          className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.34em] text-metalLit"
        >
          <span className="h-px w-10 bg-metal" />
          ə · drop 01 · {COMMERCE_ENABLED ? "live" : "coming soon"}
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="text-[clamp(52px,11vw,168px)] font-extrabold leading-[0.86] tracking-[-0.045em] lowercase text-paper"
        >
          latent <span className="text-metalLit">merch</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-8 max-w-md text-[17px] leading-[1.5] text-paper/80"
        >
          Garments generated, not sampled. Every layer of the drop —
          cut from the void, finished by hand.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-3">
          <a
            href="#shop"
            className="rounded-full bg-paper px-7 py-3 text-sm font-medium tracking-wide text-ink transition-colors duration-500 hover:bg-metalLit"
          >
            {COMMERCE_ENABLED ? "shop the drop" : "see the drop"}
          </a>
          <a
            href="#manifesto"
            className="rounded-full border border-paper/40 px-7 py-3 text-sm font-medium tracking-wide text-paper transition-colors duration-500 hover:border-metalLit hover:text-metalLit"
          >
            the manifesto
          </a>
        </motion.div>
      </motion.div>

      {/* Soft scrim — pulls focus to text */}
      <div className="pointer-events-none absolute inset-0 z-[5] bg-gradient-to-b from-transparent via-transparent to-jadeDeep/55" />

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 0.7, y: 0 }}
        transition={{ delay: 1.6, duration: 1.2, ease: expoOut }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.4em] text-paper/60"
      >
        scroll
      </motion.div>
    </section>
  );
}
