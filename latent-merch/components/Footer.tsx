"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/lib/motion";

const COLS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "shop",
    links: [
      { label: "the latent tee", href: "#shop" },
      { label: "the void hoodie", href: "#shop" },
      { label: "lookbook", href: "#lookbook" },
    ],
  },
  {
    title: "studio",
    links: [
      { label: "manifesto", href: "#manifesto" },
      { label: "process", href: "#" },
      { label: "contact", href: "mailto:hello@latent.studio" },
    ],
  },
  {
    title: "policy",
    links: [
      { label: "shipping", href: "#" },
      { label: "returns", href: "#" },
      { label: "terms", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-paper/8 bg-ink">
      <motion.div
        variants={stagger(0.05, 0.1)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-10%" }}
        className="mx-auto max-w-7xl px-6 py-20 md:px-12 md:py-28"
      >
        <motion.div variants={fadeUp} className="mb-20 flex items-baseline gap-4">
          <h2 className="text-[clamp(56px,12vw,160px)] font-extrabold leading-[0.85] tracking-[-0.045em] lowercase text-paper">
            ə <span className="text-metalLit">latent</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-12 md:grid-cols-4">
          <motion.div variants={fadeUp} className="col-span-2 md:col-span-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-paper/40">
              the brand
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/55">
              Latent Merch is the apparel arm of Latent Studio — an AI-native house from Amman.
              Garments generated, not sampled.
            </p>
          </motion.div>

          {COLS.map((col) => (
            <motion.div key={col.title} variants={fadeUp}>
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-paper/40">
                {col.title}
              </p>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-sm text-paper/75 transition-colors duration-500 hover:text-metalLit"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={fadeUp}
          className="mt-20 flex flex-col items-start justify-between gap-6 border-t border-paper/8 pt-8 md:flex-row md:items-center"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-paper/40">
            © {new Date().getFullYear()} latent studio · amman
          </p>
          <div className="flex gap-5">
            {["instagram", "tiktok", "twitter"].map((s) => (
              <a
                key={s}
                href="#"
                className="font-mono text-[10px] uppercase tracking-[0.32em] text-paper/40 transition-colors duration-500 hover:text-metalLit"
              >
                {s}
              </a>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}
