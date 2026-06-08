"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { expoOut, fadeUp, stagger } from "@/lib/motion";
import { COMMERCE_ENABLED } from "@/lib/config";

// Hero — direct port of the prototype: living jade space + two-layer model
// X-ray reveal driven by cursor. Default visible layer is the model in the
// tee (asset_02); the mask cuts a feathered hole over the cursor to reveal
// the model in the void hoodie (asset_01) underneath.
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const modelY = useTransform(scrollYProgress, [0, 1], [0, 50]);

  const setPos = (x: number, y: number, r: number) => {
    const el = stageRef.current;
    if (!el) return;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
    el.style.setProperty("--r", `${r}px`);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    // Clamp to upper portion (where the model lives) so the hole stays useful
    const ym = Math.max(e.clientY - rect.top, rect.height * 0.35);
    setPos(e.clientX - rect.left, ym, 170);
    setActive(true);
  };

  const onPointerLeave = () => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    setPos(rect.width / 2, rect.height * 0.42, 0);
    setActive(false);
  };

  useEffect(() => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    setPos(rect.width / 2, rect.height * 0.42, 0);
  }, []);

  return (
    <section ref={ref} className="relative h-screen overflow-hidden bg-jadeDeep">
      {/* Cosmic jade space background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <div className="jspace-base absolute inset-0" />
        <div className="jspace-neb jspace-neb-a" />
        <div className="jspace-neb jspace-neb-b" />
        <div className="jspace-neb jspace-neb-c" />
        <div className="jspace-pulse" />
        <div className="jspace-stars" />
      </motion.div>

      {/* X-ray stage — two stacked model photos with the cursor mask */}
      <motion.div
        ref={stageRef}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerEnter={onPointerMove}
        onTouchMove={(e) => {
          if (!stageRef.current) return;
          const t = e.touches[0];
          const rect = stageRef.current.getBoundingClientRect();
          const ym = Math.max(t.clientY - rect.top, rect.height * 0.35);
          setPos(t.clientX - rect.left, ym, 210);
          setActive(true);
        }}
        onTouchEnd={onPointerLeave}
        style={{ y: modelY, cursor: "crosshair" }}
        className="xray-stage absolute inset-0 z-[1]"
      >
        {/* Under layer — model wearing the void hoodie */}
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.2, ease: expoOut, delay: 0.3 }}
          className="absolute inset-0 flex items-end justify-center"
        >
          <Image
            src="/hero-hoodie.webp"
            alt="Latent Merch — model in the void hoodie"
            width={960}
            height={1200}
            priority
            className="h-[110%] w-auto -translate-y-[6%] object-contain object-bottom"
          />
        </motion.div>

        {/* Top layer — model wearing the tee, masked at cursor */}
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.2, ease: expoOut, delay: 0.5 }}
          className="xray-top absolute inset-0 flex items-end justify-center"
        >
          <Image
            src="/hero-tee.webp"
            alt="Latent Merch — model in the latent tee"
            width={960}
            height={1200}
            priority
            className="h-[110%] w-auto -translate-y-[6%] object-contain object-bottom"
          />
        </motion.div>

        {/* Lens ring */}
        <div
          aria-hidden
          className={`xray-lens pointer-events-none absolute rounded-full border border-metalLit transition-opacity duration-300 ${active ? "opacity-90" : "opacity-0"}`}
          style={{
            left: "var(--mx)",
            top: "var(--my)",
            width: "calc(var(--r) * 2)",
            height: "calc(var(--r) * 2)",
            transform: "translate(-50%, -50%)",
            boxShadow: "0 0 40px rgba(217,181,123,0.4)",
          }}
        />
      </motion.div>

      {/* X-ray hint chip (top-left) */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 0.85, y: 0 }}
        transition={{ delay: 1.4, duration: 1.0, ease: expoOut }}
        className="absolute left-6 top-24 z-10 rounded-md border border-paper/30 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-paper/75 backdrop-blur-sm md:left-12"
      >
        x-ray · hover the body to reveal underneath
      </motion.div>

      {/* Content overlay */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        variants={stagger(0.4, 0.16)}
        initial="hidden"
        animate="show"
        className="pointer-events-none relative z-10 flex h-full flex-col justify-end px-6 pb-20 md:px-12 md:pb-28"
      >
        <motion.p
          variants={fadeUp}
          className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.34em] text-metalLit"
        >
          <span className="h-px w-10 bg-metal" />
          drop 001 · ai-native apparel · {COMMERCE_ENABLED ? "live" : "coming soon"}
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="text-[clamp(52px,11vw,168px)] font-extrabold leading-[0.86] tracking-[-0.045em] lowercase text-paper"
        >
          wear the <br className="hidden md:block" />
          <span className="text-metalLit">latent</span> space.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-8 max-w-md text-[17px] leading-[1.5] text-paper/85"
        >
          Garments generated, not sampled. Hover the model to see what&apos;s underneath —
          every layer of the drop.
        </motion.p>

        <motion.div variants={fadeUp} className="pointer-events-auto mt-10 flex flex-wrap gap-3">
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

      {/* Bottom scrim for text legibility */}
      <div className="pointer-events-none absolute inset-0 z-[5] bg-gradient-to-t from-jadeDeep/85 via-jadeDeep/15 to-transparent" />

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 0.7, y: 0 }}
        transition={{ delay: 1.6, duration: 1.2, ease: expoOut }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.4em] text-paper/60"
      >
        scroll
      </motion.div>
    </section>
  );
}
