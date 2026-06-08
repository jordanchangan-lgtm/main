"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { fadeUp, stagger, expoOut, silk } from "@/lib/motion";

// Editorial magazine-style lookbook.
// Each spread is its own scroll target with its own parallax curve.
export function Lookbook() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const intro = useTransform(scrollYProgress, [0, 0.15], [60, 0]);

  return (
    <section
      ref={ref}
      id="lookbook"
      className="relative overflow-hidden bg-ink py-32 md:py-44"
    >
      <motion.div
        style={{ y: intro }}
        variants={stagger(0.05, 0.12)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-15%" }}
        className="mx-auto mb-24 max-w-7xl px-6 md:mb-32 md:px-12"
      >
        <motion.div
          variants={fadeUp}
          className="mb-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.34em] text-jadeLit"
        >
          <span className="h-px w-10 bg-jadeLit/60" />
          ə · lookbook · ss·26
        </motion.div>
        <motion.h2
          variants={fadeUp}
          className="text-[clamp(40px,7vw,96px)] font-extrabold leading-[0.9] tracking-[-0.04em] lowercase text-paper"
        >
          drop one. <span className="text-metalLit">caught in motion.</span>
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="mt-5 max-w-md text-base leading-relaxed text-paper/55"
        >
          A four-piece editorial. Shot in latent space, finished in Amman.
        </motion.p>
      </motion.div>

      <SpreadOne />
      <SpreadTwo />
      <SpreadThree />
      <SpreadFour />
    </section>
  );
}

/* -------------------------------------------------------------
   Spread 01 — full-bleed model, big number, side caption
   ------------------------------------------------------------- */
function SpreadOne() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const numY = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <div ref={ref} className="relative mx-auto mb-32 grid max-w-7xl grid-cols-12 gap-6 px-6 md:mb-44 md:px-12">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 1.6, ease: expoOut }}
        className="relative col-span-12 aspect-[4/5] overflow-hidden rounded-[28px] border border-paper/8 bg-gradient-to-b from-jadeDeep/40 via-ink to-ink md:col-span-8"
      >
        <motion.div style={{ y: imgY }} className="absolute inset-0">
          <Image
            src="/model-fall.png"
            alt="ə-01 — falling silhouette in the void hoodie"
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-contain object-bottom"
            priority={false}
          />
        </motion.div>
        {/* Atmospheric vignette */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
      </motion.div>

      <motion.div
        variants={stagger(0.1, 0.14)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-15%" }}
        className="relative col-span-12 flex flex-col justify-between md:col-span-4 md:py-4"
      >
        <motion.div style={{ y: numY }} aria-hidden>
          <span className="font-mono text-[clamp(80px,12vw,160px)] font-extrabold leading-none tracking-[-0.04em] text-metalLit/15">
            01
          </span>
        </motion.div>

        <div className="mt-6">
          <motion.p
            variants={fadeUp}
            className="font-mono text-[10px] uppercase tracking-[0.32em] text-jadeLit"
          >
            ə–01 · still
          </motion.p>
          <motion.h3
            variants={fadeUp}
            className="mt-4 text-3xl font-light leading-tight tracking-tight text-paper lowercase"
          >
            falling, slowly.
          </motion.h3>
          <motion.p
            variants={fadeUp}
            className="mt-3 max-w-xs text-sm leading-relaxed text-paper/55"
          >
            The void hoodie in motion. Fleece weighted enough to hold its own shape mid-air.
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="mt-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-paper/40"
          >
            <span>shot · 31°57′N 35°56′E</span>
            <span className="h-px flex-1 bg-paper/15" />
            <span>02:14</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------
   Spread 02 — tee, rotating, caption on the left
   ------------------------------------------------------------- */
function SpreadTwo() {
  return (
    <SpinSpread
      number="02"
      tag="ə–02 · object"
      title="weightless,"
      titleAccent="wearable."
      copy="Heavyweight cotton in bone, hand-pulled copper schwa. Cut wide. Hangs straight."
      video="/product-tee.webm"
      poster="/product-tee.png"
      alt="The latent tee — rotating"
      align="right"
    />
  );
}

/* -------------------------------------------------------------
   Spread 03 — hoodie, rotating, caption on the right
   ------------------------------------------------------------- */
function SpreadThree() {
  return (
    <SpinSpread
      number="03"
      tag="ə–03 · object"
      title="brushed,"
      titleAccent="weightless."
      copy="Jade fleece, brushed-back interior, drop shoulder. Hood holds its shape."
      video="/product-hoodie.webm"
      poster="/product-hoodie.png"
      alt="The void hoodie — rotating"
      align="left"
    />
  );
}

function SpinSpread({
  number,
  tag,
  title,
  titleAccent,
  copy,
  video,
  poster,
  alt,
  align,
}: {
  number: string;
  tag: string;
  title: string;
  titleAccent: string;
  copy: string;
  video: string;
  poster: string;
  alt: string;
  align: "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const videoY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const numY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  const captionOrder = align === "left" ? "md:order-2" : "md:order-1";
  const videoOrder = align === "left" ? "md:order-1" : "md:order-2";

  return (
    <div
      ref={ref}
      className="relative mx-auto mb-32 grid max-w-7xl grid-cols-12 gap-6 px-6 md:mb-44 md:px-12"
    >
      {/* Caption column */}
      <motion.div
        variants={stagger(0.1, 0.14)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-15%" }}
        className={`relative col-span-12 flex flex-col justify-between md:col-span-5 md:py-4 ${captionOrder}`}
      >
        <motion.div style={{ y: numY }} aria-hidden>
          <span className="font-mono text-[clamp(80px,12vw,160px)] font-extrabold leading-none tracking-[-0.04em] text-metalLit/15">
            {number}
          </span>
        </motion.div>

        <div className="mt-6">
          <motion.p
            variants={fadeUp}
            className="font-mono text-[10px] uppercase tracking-[0.32em] text-jadeLit"
          >
            {tag}
          </motion.p>
          <motion.h3
            variants={fadeUp}
            className="mt-4 text-4xl font-light leading-tight tracking-tight text-paper lowercase md:text-5xl"
          >
            {title} <span className="text-metalLit">{titleAccent}</span>
          </motion.h3>
          <motion.p
            variants={fadeUp}
            className="mt-3 max-w-xs text-sm leading-relaxed text-paper/55"
          >
            {copy}
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="mt-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-paper/40"
          >
            <span>360° · loop</span>
            <span className="h-px flex-1 bg-paper/15" />
            <span>00:05</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Video column */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 1.4, ease: expoOut }}
        className={`relative col-span-12 aspect-square overflow-hidden rounded-[28px] border border-paper/8 bg-gradient-to-b from-jadeDeep/40 via-ink to-ink md:col-span-7 ${videoOrder}`}
      >
        <motion.div style={{ y: videoY }} className="absolute inset-0 p-8 md:p-14">
          <video
            src={video}
            poster={poster}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-label={alt}
            className="h-full w-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
          />
        </motion.div>
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0 opacity-50 blur-3xl">
          <div className="absolute left-1/2 top-1/3 h-2/3 w-2/3 -translate-x-1/2 rounded-full bg-jadeLit/20" />
        </div>
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------
   Spread 04 — atmospheric closer, no garment, just void + type
   ------------------------------------------------------------- */
function SpreadFour() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.6], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.4, 1], [0, 1, 0.8]);

  return (
    <div ref={ref} className="relative mx-auto max-w-7xl px-6 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 1.4, ease: expoOut }}
        className="relative aspect-[16/8] w-full overflow-hidden rounded-[28px] border border-paper/8 bg-jadeDeep"
      >
        {/* Cosmic interior — borrows the hero space styles */}
        <div className="jspace-base absolute inset-0" />
        <div className="jspace-neb jspace-neb-a" />
        <div className="jspace-neb jspace-neb-b" />
        <div className="jspace-stars" />

        <motion.div
          style={{ scale, opacity }}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-metalLit md:text-[11px]">
            ə–04 · interlude
          </p>
          <h3 className="mt-6 text-[clamp(32px,6vw,72px)] font-extrabold leading-[0.95] tracking-[-0.04em] lowercase text-paper">
            no logos. no noise. <span className="text-metalLit">no artifice.</span>
          </h3>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-paper/55 md:text-base">
            What's left is the garment, the body, the void between them.
          </p>

          <motion.a
            href="#shop"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.6, ease: silk }}
            className="mt-10 inline-flex items-center gap-3 rounded-full border border-paper/30 px-7 py-3 font-mono text-[11px] uppercase tracking-[0.32em] text-paper transition-colors duration-500 hover:border-metalLit hover:text-metalLit"
          >
            shop the drop
            <span aria-hidden>→</span>
          </motion.a>
        </motion.div>
      </motion.div>
    </div>
  );
}
