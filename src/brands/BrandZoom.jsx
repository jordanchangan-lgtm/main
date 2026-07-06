"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ZoomParallax } from "./ui/ZoomParallax";
import { TextEffect } from "./ui/TextEffect";

/* The brand "description" section: a lead-in with the brand copy, followed by
   the zoom-parallax reveal of real, brand-related imagery. */
export function BrandZoom({ brand }) {
  const t = brand.theme;
  const d = brand.description;
  const introRef = useRef(null);
  const inView = useInView(introRef, { amount: 0.5, once: false });

  return (
    <div style={{ background: "transparent" }}>
      {/* lead-in copy */}
      <section
        ref={introRef}
        style={{
          position: "relative",
          minHeight: "82vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(55% 50% at 50% 45%, ${t.accent}12 0%, transparent 62%)` }} />
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", width: "min(720px, 88vw)", color: t.ink, padding: "0 6vw" }}>
          <div style={{ fontSize: 12, letterSpacing: "0.34em", textTransform: "uppercase", color: t.accent, marginBottom: 18, fontWeight: 600 }}>
            {d.eyebrow}
          </div>
          <TextEffect
            key={inView ? "zoom-head-in" : "zoom-head-out"}
            per="word"
            as="h2"
            trigger={inView}
            preset="slide"
            style={{
              margin: 0,
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              fontWeight: 600,
              fontSize: "clamp(1.9rem, 4.2vw, 3.4rem)",
              letterSpacing: "-0.015em",
              lineHeight: 1.08,
              justifyContent: "center",
              color: t.ink,
            }}
          >
            {d.headline}
          </TextEffect>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              margin: "24px auto 0",
              maxWidth: 560,
              fontWeight: 300,
              fontSize: "clamp(1rem, 1.4vw, 1.2rem)",
              lineHeight: 1.75,
              color: t.muted,
            }}
          >
            {d.body}
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            style={{ marginTop: 30, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: t.accent, fontWeight: 600 }}
          >
            Scroll ↓
          </motion.div>
        </div>
      </section>

      {/* zoom-parallax reveal of brand imagery */}
      <ZoomParallax images={d.images} />
    </div>
  );
}
