"use client";

import React, { useRef, useState, useEffect } from "react";
import { useScroll, useMotionValueEvent, motion, useInView } from "framer-motion";
import { CircularGallery } from "./ui/CircularGallery";
import { TextEffect } from "./ui/TextEffect";
import { useViewport } from "./useViewport";

/* Scroll-driven wrapper around CircularGallery. Rotation is scoped to this
   section's own scroll progress (one+ full turn as it passes), and the ring
   idles with a slow auto-rotate when the user isn't scrolling — matching the
   reference demo, but composable inside a multi-section page. */
export function BrandGallery({
  brand,
  gallery,
  radius = 560,
  cardW = 300,
  cardH = 400,
  turns = 1,
  heightVh = 400,
}) {
  const t = brand.theme;
  const { w, isMobile } = useViewport();
  // On phones the ring/cards are pixel-sized off-screen at desktop values —
  // scale them to the viewport so the front card fills nicely and neighbours peek.
  if (isMobile) {
    cardW = Math.min(cardW, Math.round(w * 0.66));
    cardH = Math.round(cardW * 1.34);
    radius = Math.round(cardW * 1.5);
  }
  const ref = useRef(null);
  const stickyRef = useRef(null);
  // Anchor "in view" to the pinned 100vh stage — a 400vh section can never
  // meet a fractional-visibility threshold, so the header would never trigger.
  const inView = useInView(stickyRef, { amount: 0.5, once: false });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const [rotation, setRotation] = useState(0);
  const scrollRotRef = useRef(0);
  const autoRef = useRef(0);
  const scrollingRef = useRef(false);
  const timeoutRef = useRef(null);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    scrollRotRef.current = v * 360 * turns;
    scrollingRef.current = true;
    setRotation(scrollRotRef.current + autoRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => { scrollingRef.current = false; }, 150);
  });

  useEffect(() => {
    let raf;
    const tick = () => {
      if (!scrollingRef.current) {
        autoRef.current += 0.05;
        setRotation(scrollRotRef.current + autoRef.current);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section ref={ref} style={{ height: `${heightVh}vh`, position: "relative", background: "transparent" }}>
      <div ref={stickyRef} style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* ambient brand glow */}
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(55% 45% at 50% 45%, ${t.accent}12 0%, transparent 62%)` }} />

        {/* title / description pinned at top (demo layout — keeps the ring's
            centre clear, since the front-facing card sweeps through it) */}
        <div
          style={{
            position: "absolute",
            top: "6.5vh",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 5,
            textAlign: "center",
            width: "min(620px, 88vw)",
            pointerEvents: "none",
            color: t.ink,
          }}
        >
          <div style={{ fontSize: 12, letterSpacing: "0.34em", textTransform: "uppercase", color: t.accent, marginBottom: 14, fontWeight: 600 }}>
            {gallery.eyebrow}
          </div>
          <TextEffect
            key={inView ? "g-head-in" : "g-head-out"}
            per="word"
            as="h2"
            trigger={inView}
            preset="slide"
            style={{
              margin: 0,
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              fontWeight: 600,
              fontSize: "clamp(1.7rem, 3.6vw, 3rem)",
              letterSpacing: "-0.015em",
              lineHeight: 1.08,
              justifyContent: "center",
              color: t.ink,
            }}
          >
            {gallery.headline}
          </TextEffect>
          {gallery.description && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{
                margin: "18px auto 0",
                maxWidth: 460,
                fontWeight: 300,
                fontSize: "clamp(0.95rem, 1.25vw, 1.1rem)",
                lineHeight: 1.7,
                color: t.mist,
              }}
            >
              {gallery.description}
            </motion.p>
          )}
        </div>

        {/* the 3D ring */}
        <div style={{ position: "absolute", inset: 0, zIndex: 2 }}>
          <CircularGallery items={gallery.items} rotation={rotation} radius={radius} cardW={cardW} cardH={cardH} theme={t} />
        </div>

        {/* scroll hint */}
        <div
          style={{
            position: "absolute",
            bottom: 26,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 6,
            fontSize: 11,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: t.accent,
            fontWeight: 600,
          }}
        >
          Scroll to rotate
        </div>
      </div>
    </section>
  );
}
