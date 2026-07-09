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

/* ======================================================================
   Generic brand landing page — renders from a brand config (see brands.js).
   1. BrandIntroScene — grey+dots hero → block-wipe description (scroll-locked)
   2. Models — FocusRail 3D carousel of the line-up
   3. Location — the globe
   4. CTA — big liquid-glass "Dive into <brand> world" button
   ====================================================================== */

const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";

// Big liquid-glass CTA. href is a placeholder — external links to come.
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
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textDecoration: "none",
        width: isMobile ? "min(90vw, 420px)" : "min(80vw, 620px)",
        height: isMobile ? 84 : 104,
        borderRadius: 999,
        overflow: "hidden",
        cursor: "pointer",
        transform: h ? "translateY(-5px) scale(1.03)" : "none",
        boxShadow: h
          ? `0 26px 56px rgba(0,0,0,0.5), 0 0 44px ${t.accent}55`
          : "0 14px 36px rgba(0,0,0,0.4)",
        transition: `transform .5s ${SPRING}, box-shadow .5s ${SPRING}`,
      }}
    >
      <div style={{ position: "absolute", inset: 0, zIndex: 0, borderRadius: 999, backdropFilter: "blur(7px) saturate(150%) brightness(1.15)", WebkitBackdropFilter: "blur(7px) saturate(150%) brightness(1.15)", filter: "url(#glass-distortion)", isolation: "isolate" }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 1, borderRadius: 999, background: h ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.045)", transition: `background .5s ${SPRING}` }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 2, borderRadius: 999, padding: 1.5, background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.16) 30%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.22) 70%, rgba(255,255,255,0.85) 100%)", WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 0, left: "7%", right: "7%", height: "46%", zIndex: 2, borderRadius: 999, background: "linear-gradient(180deg, rgba(255,255,255,0.34), transparent)", pointerEvents: "none" }} />
      <span style={{ position: "relative", zIndex: 3, display: "flex", alignItems: "baseline", gap: "0.45em", color: "#ffffff", fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 300, fontSize: isMobile ? "clamp(1.05rem, 4.6vw, 1.4rem)" : "clamp(1.3rem, 2.2vw, 1.9rem)", letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>
        Dive into
        <Wordmark text={brand.wordmark.text} transform={brand.wordmark.transform} color="#ffffff" style={{ fontSize: "1.15em", textShadow: `0 2px 20px ${t.accent}` }} />
        world
      </span>
    </a>
  );
}

export default function BrandLanding({ brand }) {
  const t = brand.theme;
  const { isMobile } = useViewport();
  const models = brand.modelsGallery?.items || [];
  return (
    <div style={{ background: "#0a0c10", position: "relative" }}>
      <GlassFilter />
      <BrandSwitcher current={brand.slug} />

      {!isMobile && (
        <div style={{ position: "fixed", top: 26, left: 34, zIndex: 50, mixBlendMode: "difference" }}>
          <Wordmark text={brand.wordmark.text} transform={brand.wordmark.transform} color="#ffffff" style={{ fontSize: 22 }} />
        </div>
      )}

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* 1 — grey+dots hero → block-wipe description (scroll-locked) */}
        <BrandIntroScene brand={brand} />

        {/* 2 — the model line-up as a 3D focus rail */}
        <section id="brand-world" style={{ position: "relative", background: "#0a0c10", padding: isMobile ? "10vh 0 4vh" : "12vh 0 6vh" }}>
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
        <section style={{ position: "relative", background: t.deep, padding: isMobile ? "14vh 6vw" : "16vh 6vw", display: "flex", flexDirection: "column", alignItems: "center", gap: 26, overflow: "hidden" }}>
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
