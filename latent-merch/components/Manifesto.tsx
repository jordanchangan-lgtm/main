"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { fadeUp, stagger, expoOut } from "@/lib/motion";

const LINES = [
  "We don't sample — we generate.",
  "No logos. No noise. No artifice.",
  "Each piece a primitive: form, weight, void.",
  "Worn like a thought.",
];

export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const veilOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const driftY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section
      ref={ref}
      id="manifesto"
      className="relative overflow-hidden bg-jadeDeep py-40 md:py-56"
    >
      {/* Ambient nebula veil */}
      <motion.div
        aria-hidden
        style={{ opacity: veilOpacity }}
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -left-20 top-10 h-[70vh] w-[70vh] rounded-full bg-jadeLit/15 blur-[120px]" />
        <div className="absolute -right-32 bottom-0 h-[60vh] w-[60vh] rounded-full bg-metal/10 blur-[140px]" />
      </motion.div>

      <motion.div
        style={{ y: driftY }}
        variants={stagger(0.1, 0.18)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-20%" }}
        className="relative mx-auto max-w-4xl px-6 md:px-12"
      >
        <motion.p
          variants={fadeUp}
          className="mb-10 font-mono text-[11px] uppercase tracking-[0.34em] text-metalLit"
        >
          ə · the manifesto
        </motion.p>

        {LINES.map((line, i) => (
          <motion.p
            key={i}
            variants={fadeUp}
            className="text-[clamp(28px,5vw,56px)] font-light leading-[1.15] tracking-tight text-paper/90"
          >
            {line}
          </motion.p>
        ))}

        <motion.div variants={fadeUp} className="mt-16 flex items-center gap-5">
          <span className="h-px flex-1 max-w-24 bg-paper/20" />
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-paper/40">
            latent studio · amman
          </p>
          <span className="h-px flex-1 max-w-24 bg-paper/20" />
        </motion.div>
      </motion.div>
    </section>
  );
}
