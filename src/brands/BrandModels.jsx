"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CardFanCarousel } from "./ui/CardFanCarousel";
import { TextEffect } from "./ui/TextEffect";
import { useViewport } from "./useViewport";

/* Models section — the line-up shown as a gsap "fan" of cards. */
export function BrandModels({ brand }) {
  const t = brand.theme;
  const g = brand.modelsGallery;
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3, once: false });
  const { isMobile, isSmall } = useViewport();

  const cards = g.items.map((m) => ({ imgUrl: m.img, alt: m.title, label: m.title, sub: m.sub }));
  const cardW = isSmall ? 11 : isMobile ? 12.5 : 15;
  const cardH = isSmall ? 15 : isMobile ? 17 : 20;

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "transparent",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(55% 45% at 50% 45%, ${t.accent}12 0%, transparent 62%)`, pointerEvents: "none" }} />

      <div style={{ textAlign: "center", color: t.ink, zIndex: 3, padding: "0 6vw", marginBottom: "clamp(20px, 4vh, 48px)" }}>
        <div style={{ fontSize: 12, letterSpacing: "0.34em", textTransform: "uppercase", color: t.accent, marginBottom: 14, fontWeight: 600 }}>
          The Range
        </div>
        <TextEffect
          key={inView ? "m-in" : "m-out"}
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
          {g.headline}
        </TextEffect>
      </div>

      <div style={{ width: "100%", zIndex: 2 }}>
        <CardFanCarousel cards={cards} accent={t.accentBright} cardW={cardW} cardH={cardH} />
      </div>
    </section>
  );
}
