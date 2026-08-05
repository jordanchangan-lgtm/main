"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Wordmark } from "./ui/Wordmark";
import { BrandIntroScene } from "./BrandIntroScene";
import { BrandLocation } from "./BrandLocation";
import { BrandSwitcher } from "./BrandSwitcher";
import { FocusRail } from "./ui/FocusRail";
import { GlassFilter } from "./ui/LiquidGlass";
import { useViewport } from "./useViewport";
import { useMobilePanelGate } from "./useMobilePanelGate";

/* ======================================================================
   Generic brand landing page — renders from a brand config (see brands.js).
   1. BrandIntroScene — grey+dots hero → block-wipe description (scroll-locked)
   2. Models — FocusRail 3D carousel of the line-up
   3. Location — the globe
   4. CTA — big liquid-glass "Dive into <brand> world" button
   ====================================================================== */

const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";
const GREY = "#26292f"; // shared page grey (matches the brand hero background)

// Plain clickable CTA — no glass. The words are the link. href is a placeholder.
function DiveButton({ brand, isMobile }) {
  const t = brand.theme;
  const [h, setH] = useState(false);
  return (
    <a
      href={brand.worldUrl || "#"}
      onClick={(e) => { if (!brand.worldUrl) e.preventDefault(); }}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        justifyContent: "center",
        gap: "0.4em",
        textDecoration: "none",
        cursor: "pointer",
        color: "#ffffff",
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        fontWeight: 300,
        fontSize: isMobile ? "clamp(1.35rem, 6.4vw, 1.9rem)" : "clamp(1.9rem, 3.2vw, 2.8rem)",
        letterSpacing: "-0.01em",
        whiteSpace: "nowrap",
        transform: h ? "translateY(-3px) scale(1.04)" : "none",
        textShadow: h ? `0 0 30px ${t.accentBright}88, 0 2px 8px rgba(0,0,0,0.5)` : "0 2px 8px rgba(0,0,0,0.45)",
        transition: `transform .45s ${SPRING}, text-shadow .45s ease`,
      }}
    >
      Dive into
      <Wordmark text={brand.wordmark.text} transform={brand.wordmark.transform} color="#ffffff" style={{ fontSize: "1.1em" }} />
      world
    </a>
  );
}

export default function BrandLanding({ brand }) {
  const t = brand.theme;
  const { isMobile } = useViewport();
  const models = brand.modelsGallery?.items || [];
  useMobilePanelGate();
  return (
    <div style={{ background: GREY, position: "relative" }}>
      <GlassFilter />
      <BrandSwitcher current={brand.slug} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* 1 — grey+dots hero → block-wipe description (scroll-locked) */}
        <BrandIntroScene brand={brand} />

        {/* 2 — the model line-up as a 3D focus rail */}
        <section id="brand-world" data-panel-gate style={{ position: "relative", background: GREY, padding: isMobile ? "10vh 0 4vh" : "12vh 0 6vh" }}>
          <div style={{ textAlign: "center", marginBottom: isMobile ? 8 : 14, padding: "0 6vw", fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
            <div style={{ fontSize: 12, letterSpacing: "0.4em", textTransform: "uppercase", color: t.accentBright, fontWeight: 600, marginBottom: 12 }}>
              {brand.modelsGallery?.eyebrow || "The Range"}
            </div>
            <h2 style={{ margin: 0, fontWeight: 300, fontSize: "clamp(1.7rem, 4vw, 3rem)", letterSpacing: "-0.02em", color: "#ffffff" }}>
              {brand.modelsGallery?.headline || "The line-up."}
            </h2>
          </div>
          <FocusRail items={models} accent={t.accentBright} loop autoPlay interval={4200} />
        </section>

        {/* 3 — location globe */}
        <BrandLocation brand={brand} />

        {/* 4 — big glass CTA */}
        <section data-panel-gate style={{ position: "relative", background: GREY, padding: isMobile ? "14vh 6vw" : "16vh 6vw", display: "flex", flexDirection: "column", alignItems: "center", gap: 26, overflow: "hidden" }}>
          <div className="cta-dots" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}
          >
            <div style={{ fontSize: 12, letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", fontWeight: 600, fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
              Ready for more?
            </div>
            <DiveButton brand={brand} isMobile={isMobile} />
          </motion.div>
          <style>{`
            .cta-dots {
              background-image: radial-gradient(circle, rgba(255,255,255,0.11) 1.1px, transparent 1.7px);
              background-size: 26px 26px;
              -webkit-mask-image: radial-gradient(ellipse 62% 60% at 50% 50%, transparent 40%, #000 85%);
              mask-image: radial-gradient(ellipse 62% 60% at 50% 50%, transparent 40%, #000 85%);
              animation: ctaDotsDrift 7s linear infinite;
            }
            @keyframes ctaDotsDrift { from { background-position: 0 0; } to { background-position: 26px 52px; } }
          `}</style>
        </section>
      </div>
    </div>
  );
}
