"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function ScrollModel() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const modelY = useTransform(scrollYProgress, [0, 0.5, 1], ["-55%", "0%", "12%"]);
  const modelOpacity = useTransform(scrollYProgress, [0, 0.18, 0.85, 1], [0, 1, 1, 0.55]);
  const modelScale = useTransform(scrollYProgress, [0, 0.5], [0.92, 1]);

  const leftOpacity = useTransform(scrollYProgress, [0.12, 0.38], [0, 1]);
  const leftX = useTransform(scrollYProgress, [0.12, 0.38], [-48, 0]);

  const rightOpacity = useTransform(scrollYProgress, [0.28, 0.55], [0, 1]);
  const rightX = useTransform(scrollYProgress, [0.28, 0.55], [48, 0]);

  return (
    <section ref={ref} className="relative h-[220vh] bg-ink">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="relative h-full mx-auto max-w-7xl px-8 grid grid-cols-12 items-center gap-6">
          <motion.div
            style={{ opacity: leftOpacity, x: leftX }}
            className="col-span-3 space-y-6"
          >
            <p className="text-xs tracking-[0.32em] uppercase text-jade">Form</p>
            <h3 className="text-3xl font-light leading-tight text-bone">
              Stillness, woven.
            </h3>
            <p className="text-sm leading-relaxed text-bone/55">
              No logos. No noise. Each piece a primitive — cut from the void, finished by hand.
            </p>
          </motion.div>

          <motion.div
            style={{ y: modelY, opacity: modelOpacity, scale: modelScale }}
            className="col-span-6 flex items-end justify-center h-full pb-12"
          >
            {/* Drop a transparent PNG at /public/model.png and swap the placeholder below. */}
            <div className="relative h-[88%] w-[58%]">
              <div className="absolute inset-0 rounded-[42%] bg-gradient-to-b from-jade/25 via-bone/8 to-ink blur-3xl" />
              <div className="absolute inset-x-10 inset-y-6 rounded-[36%] bg-gradient-to-b from-bone/18 via-bone/8 to-jade/15 backdrop-blur-sm" />
              <div className="absolute inset-x-20 top-4 h-20 rounded-full bg-bone/12 blur-md" />
            </div>
          </motion.div>

          <motion.div
            style={{ opacity: rightOpacity, x: rightX }}
            className="col-span-3 space-y-6 text-right"
          >
            <p className="text-xs tracking-[0.32em] uppercase text-sand">Feel</p>
            <h3 className="text-3xl font-light leading-tight text-bone">
              Worn like a thought.
            </h3>
            <p className="text-sm leading-relaxed text-bone/55">
              Heavy cotton. Soft weight. The fit forgets itself the moment you move.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
