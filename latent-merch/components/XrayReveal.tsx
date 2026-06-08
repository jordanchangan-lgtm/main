"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { fadeUp, stagger, expoOut } from "@/lib/motion";

// X-ray reveal — direct spiritual port of the prototype's hero hover.
// Hovering reveals a gold/metal-tinted "X-ray" of the same figure through a
// soft-edged radial mask. The lens ring tracks the cursor.
export function XrayReveal() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  // Direct DOM writes for cursor coords (avoid React rerenders at 60fps).
  // --mx/--my drive the mask center; --r drives the radius, CSS-transitioned for smoothness.
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
    setPos(e.clientX - rect.left, e.clientY - rect.top, 160);
    setActive(true);
  };

  const onPointerLeave = () => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    setPos(rect.width / 2, rect.height / 2, 0);
    setActive(false);
  };

  // Default lens position at center on mount
  useEffect(() => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    setPos(rect.width / 2, rect.height / 2, 0);
  }, []);

  return (
    <section className="relative overflow-hidden bg-ink py-32 md:py-44">
      <motion.div
        variants={stagger(0.05, 0.12)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-15%" }}
        className="mx-auto max-w-7xl px-6 md:px-12"
      >
        <motion.p
          variants={fadeUp}
          className="mb-4 font-mono text-[11px] uppercase tracking-[0.34em] text-jadeLit"
        >
          ə · x-ray
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="text-[clamp(40px,7vw,96px)] font-extrabold leading-[0.9] tracking-[-0.04em] lowercase text-paper"
        >
          every layer <span className="text-metalLit">of the drop.</span>
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="mt-5 max-w-md text-base leading-relaxed text-paper/55"
        >
          Move your cursor across the figure. Underneath the void, the same shape — in gold.
        </motion.p>

        <motion.div
          variants={fadeUp}
          ref={stageRef}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          onPointerEnter={onPointerMove}
          onTouchMove={(e) => {
            if (!stageRef.current) return;
            const t = e.touches[0];
            const rect = stageRef.current.getBoundingClientRect();
            setPos(t.clientX - rect.left, t.clientY - rect.top, 200);
            setActive(true);
          }}
          onTouchEnd={onPointerLeave}
          className="xray-stage relative mt-14 aspect-[16/9] w-full overflow-hidden rounded-[32px] border border-paper/8 bg-gradient-to-b from-jadeDeep/40 via-ink to-ink"
          style={
            {
              cursor: "crosshair",
              ["--mx" as string]: "50%",
              ["--my" as string]: "50%",
              ["--r" as string]: "0px",
            } as React.CSSProperties
          }
        >
          {/* Ambient inner glow */}
          <div className="pointer-events-none absolute inset-0 opacity-50 blur-3xl">
            <div className="absolute left-1/2 top-1/3 h-2/3 w-2/3 -translate-x-1/2 rounded-full bg-jadeLit/20" />
          </div>

          {/* UNDER layer — gold X-ray version of the same figure */}
          <div className="xray-under absolute inset-0">
            <FigureImage variant="under" />
          </div>

          {/* TOP layer — clothed figure, masked by cursor radius */}
          <div className="xray-top absolute inset-0">
            <FigureImage variant="top" />
          </div>

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
              boxShadow: "0 0 30px rgba(217,181,123,0.35)",
            }}
          />

          {/* Hint chip */}
          <div className="pointer-events-none absolute left-6 top-6 z-10 rounded-md border border-paper/15 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-paper/65 backdrop-blur-sm">
            hover · the void hoodie
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function FigureImage({ variant }: { variant: "top" | "under" }) {
  return (
    <div className="relative h-full w-full">
      <Image
        src="/model-fall.png"
        alt={variant === "top" ? "Model in the void hoodie" : "X-ray view of the model in gold"}
        fill
        sizes="(max-width: 1280px) 90vw, 1100px"
        className={
          variant === "top"
            ? "object-contain"
            : "object-contain xray-under-filter"
        }
        priority={variant === "top"}
      />
    </div>
  );
}
