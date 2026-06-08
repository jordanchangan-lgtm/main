"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { expoOut, silk } from "@/lib/motion";

// Paired text reveals that cycle through as you scroll the panel.
// Each pair occupies ~12.5% of the scroll progress.
type Pair = { left: string; right: string };

const PAIRS: Pair[] = [
  { left: "Stillness, woven.", right: "Worn like a thought." },
  { left: "Cut from the void.", right: "Heavy cotton, soft weight." },
  { left: "Form follows feeling.", right: "Brushed back, soft drape." },
  { left: "No logos. No noise.", right: "Cream on jade." },
  { left: "Each piece a primitive.", right: "Hand-pulled schwa." },
  { left: "Generated, not sampled.", right: "The fit forgets itself." },
  { left: "Wear the latent space.", right: "Built to hang." },
  { left: "Every layer of the drop.", right: "Stillness in motion." },
];

export function ScrollModel() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Final video opacity — crossfades in over the last 12% of scroll
  const videoOpacity = useTransform(scrollYProgress, [0.86, 0.96], [0, 1]);
  const stillOpacity = useTransform(scrollYProgress, [0.84, 0.94], [1, 0]);

  // Subtle drift on the still — keeps the figure alive even before the video kicks in
  const modelY = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const modelRotate = useTransform(scrollYProgress, [0, 1], [-2, 2]);

  // Ambient halo
  const haloScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.7, 1, 1.15]);
  const haloOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.2, 0.55, 0.55, 0.3]);

  return (
    <section ref={ref} className="relative h-[420vh] bg-ink">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Falling effect — vertical light streaks moving upward (suggesting descent) */}
        <FallingStreaks />

        {/* Ambient ink halo behind the model */}
        <motion.div
          aria-hidden
          style={{ scale: haloScale, opacity: haloOpacity }}
          className="absolute left-1/2 top-1/2 z-[1] h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-jade/25 blur-[140px]"
        />

        <div className="relative z-[2] mx-auto grid h-full max-w-7xl grid-cols-12 items-center gap-6 px-6 md:px-12">
          {/* Left text column — 8 cycling reveals */}
          <div className="col-span-3 relative h-72 md:h-80">
            {PAIRS.map((pair, i) => (
              <CyclingLine
                key={`l-${i}`}
                text={pair.left}
                tag={`ə · ${String(i + 1).padStart(2, "0")}`}
                tagColor="text-jadeLit"
                index={i}
                total={PAIRS.length}
                scrollYProgress={scrollYProgress}
                side="left"
              />
            ))}
          </div>

          {/* Center model — still that crossfades to looping video */}
          <motion.div
            style={{ y: modelY, rotate: modelRotate }}
            className="relative col-span-6 flex h-full items-center justify-center"
          >
            <div className="relative h-[88%] w-full">
              {/* Static image */}
              <motion.div style={{ opacity: stillOpacity }} className="absolute inset-0">
                <Image
                  src="/model-fall.png"
                  alt="Falling model in the void hoodie"
                  fill
                  priority
                  sizes="(max-width: 1280px) 50vw, 640px"
                  className="object-contain"
                />
              </motion.div>
              {/* Looping video — fades in at the end of the scroll */}
              <motion.video
                style={{ opacity: videoOpacity }}
                src="/model-fall-loop.webm"
                poster="/model-fall.png"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                aria-label="Looping falling model"
                className="absolute inset-0 h-full w-full object-contain"
              />
            </div>
          </motion.div>

          {/* Right text column — 8 cycling reveals */}
          <div className="col-span-3 relative h-72 md:h-80 text-right">
            {PAIRS.map((pair, i) => (
              <CyclingLine
                key={`r-${i}`}
                text={pair.right}
                tag={`ə · ${String(i + 1).padStart(2, "0")}`}
                tagColor="text-metalLit"
                index={i}
                total={PAIRS.length}
                scrollYProgress={scrollYProgress}
                side="right"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CyclingLine({
  text,
  tag,
  tagColor,
  index,
  total,
  scrollYProgress,
  side,
}: {
  text: string;
  tag: string;
  tagColor: string;
  index: number;
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  side: "left" | "right";
}) {
  const window = 1 / total; // 0.125
  const start = window * index;
  const fadeIn = start + 0.01;
  const peakStart = start + window * 0.25;
  const peakEnd = start + window * 0.75;
  const fadeOut = start + window;

  // Bound to [0, 1]
  const a = Math.max(0, start);
  const b = Math.min(1, fadeIn);
  const c = Math.min(1, peakStart);
  const d = Math.min(1, peakEnd);
  const e = Math.min(1, fadeOut);

  const opacity = useTransform(scrollYProgress, [a, c, d, e], [0, 1, 1, 0]);
  const x = useTransform(
    scrollYProgress,
    [a, c, d, e],
    side === "left" ? [-32, 0, 0, 24] : [32, 0, 0, -24]
  );
  const blurRaw = useTransform(scrollYProgress, [a, c, d, e], [8, 0, 0, 6]);
  const filter = useTransform(blurRaw, (v) => `blur(${v}px)`);

  void b; // start animation slightly after window start; kept for clarity

  return (
    <motion.div
      style={{ opacity, x, filter }}
      className="absolute inset-0 flex flex-col justify-center"
    >
      <p
        className={`font-mono text-[11px] uppercase tracking-[0.34em] ${tagColor}`}
      >
        {tag}
      </p>
      <h3 className="mt-4 text-3xl font-light leading-tight text-paper md:text-4xl">
        {text}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-paper/55">
        {side === "left"
          ? "No logos. No noise. Cut from the void, finished by hand."
          : "Heavy cotton. Soft weight. The fit forgets itself."}
      </p>
    </motion.div>
  );
}

function FallingStreaks() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* Diagonal/vertical light streaks moving upward to suggest descent */}
      <div className="falling-streaks absolute inset-0" />
      {/* Subtle atmospheric gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-jadeDeep/8 to-ink" />
    </div>
  );
}
