"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { silk, expoOut } from "@/lib/motion";

export function ScrollModel() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Falling + drift — long easing range for smoothness
  const modelY = useTransform(scrollYProgress, [0, 0.5, 1], ["-55%", "0%", "14%"]);
  const modelOpacity = useTransform(scrollYProgress, [0, 0.18, 0.85, 1], [0, 1, 1, 0.5]);
  const modelScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 1.04]);
  const modelRotate = useTransform(scrollYProgress, [0, 1], [-3, 3]);

  // Text reveals
  const leftOpacity = useTransform(scrollYProgress, [0.12, 0.4], [0, 1]);
  const leftX = useTransform(scrollYProgress, [0.12, 0.4], [-56, 0]);
  const leftBlurRaw = useTransform(scrollYProgress, [0.12, 0.4], [8, 0]);
  const leftFilter = useTransform(leftBlurRaw, (b) => `blur(${b}px)`);

  const rightOpacity = useTransform(scrollYProgress, [0.28, 0.58], [0, 1]);
  const rightX = useTransform(scrollYProgress, [0.28, 0.58], [56, 0]);
  const rightBlurRaw = useTransform(scrollYProgress, [0.28, 0.58], [8, 0]);
  const rightFilter = useTransform(rightBlurRaw, (b) => `blur(${b}px)`);

  // Ambient halo behind the model
  const haloScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 1, 1.2]);
  const haloOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.6, 0.6, 0.2]);

  return (
    <section ref={ref} className="relative h-[240vh] bg-ink">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Ambient ink halo — gives the void a center of gravity */}
        <motion.div
          aria-hidden
          style={{ scale: haloScale, opacity: haloOpacity }}
          className="absolute left-1/2 top-1/2 -z-0 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-jade/20 blur-[120px]"
        />

        <div className="relative mx-auto grid h-full max-w-7xl grid-cols-12 items-center gap-6 px-8">
          {/* Left text */}
          <motion.div
            style={{
              opacity: leftOpacity,
              x: leftX,
              filter: leftFilter,
            }}
            className="col-span-3 space-y-6"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-jadeLit">
              ə · form
            </p>
            <h3 className="text-3xl font-light leading-tight text-paper">
              Stillness, woven.
            </h3>
            <p className="text-sm leading-relaxed text-paper/55">
              No logos. No noise. Each piece a primitive — cut from the void, finished by hand.
            </p>
          </motion.div>

          {/* Falling model */}
          <motion.div
            style={{
              y: modelY,
              opacity: modelOpacity,
              scale: modelScale,
              rotate: modelRotate,
            }}
            className="relative col-span-6 flex h-full items-center justify-center"
          >
            <div className="relative h-[92%] w-full">
              <Image
                src="/model-fall.png"
                alt="Latent Merch model falling, wearing the void hoodie in jade"
                fill
                priority
                sizes="(max-width: 1280px) 50vw, 640px"
                className="object-contain"
              />
            </div>
          </motion.div>

          {/* Right text */}
          <motion.div
            style={{
              opacity: rightOpacity,
              x: rightX,
              filter: rightFilter,
            }}
            className="col-span-3 space-y-6 text-right"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-metalLit">
              ə · feel
            </p>
            <h3 className="text-3xl font-light leading-tight text-paper">
              Worn like a thought.
            </h3>
            <p className="text-sm leading-relaxed text-paper/55">
              Heavy cotton. Soft weight. The fit forgets itself the moment you move.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Re-exports kept for parity if other files import them later
export { silk, expoOut };
