"use client";

// The brand "story" section — replaces the old zoom-parallax intro + image
// gallery + models with the 3D infinite photography gallery: the brand's images
// fly toward the camera through a dark space as you scroll, the description
// headline floating over them. Pinned tall section so it drives off page scroll
// (no wheel-hijack) and then flows on to the globe.
import React, { useRef, useMemo } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import InfiniteGallery from "./ui/InfiniteGallery";
import { useViewport } from "./useViewport";

export function Brand3DGallery({ brand }) {
  const t = brand.theme;
  const { isMobile } = useViewport();
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  const progressRef = useRef(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => { progressRef.current = v; });

  // Dedicated per-brand gallery images (falls back to brand imagery).
  const images = useMemo(() => {
    if (brand.galleryImages?.length) return brand.galleryImages;
    const desc = (brand.description?.images || []).map((i) => i.src);
    const models = (brand.modelsGallery?.items || []).map((i) => i.img);
    return [...desc, ...models].filter(Boolean);
  }, [brand]);

  const textOpacity = useTransform(scrollYProgress, [0, 0.12, 0.78, 0.94], [0, 1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.12], [24, 0]);

  return (
    <section ref={sectionRef} style={{ height: isMobile ? "280vh" : "340vh", position: "relative", background: t.deep }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
        {/* dark base behind the transparent canvas — images read on near-black */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, background: `radial-gradient(120% 100% at 50% 0%, ${t.accent}14 0%, ${t.deep} 42%, #04040b 100%)` }} />

        {/* the flying gallery */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
          <InfiniteGallery images={images} progressRef={progressRef} visibleCount={isMobile ? 9 : 12} style={{ width: "100%", height: "100%" }} />
        </div>

        {/* legibility vignette */}
        <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "radial-gradient(65% 55% at 50% 50%, rgba(0,6,26,0.55) 0%, rgba(0,6,26,0.2) 45%, transparent 75%)" }} />

        {/* brand intro / description headline floating over the gallery */}
        <motion.div style={{ position: "absolute", inset: 0, zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 8vw", opacity: textOpacity, y: textY, pointerEvents: "none" }}>
          <div style={{ fontSize: 12, letterSpacing: "0.4em", textTransform: "uppercase", color: t.accentBright, marginBottom: 18, fontWeight: 600, textShadow: "0 2px 20px rgba(0,0,0,0.6)" }}>
            {brand.description?.eyebrow}
          </div>
          <h2 style={{ margin: 0, fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 300, fontSize: "clamp(1.9rem, 5vw, 4rem)", lineHeight: 1.08, letterSpacing: "-0.02em", color: "#ffffff", maxWidth: "16ch", textShadow: "0 2px 30px rgba(0,0,0,0.65)" }}>
            {brand.description?.headline}
          </h2>
          {brand.description?.body && (
            <p style={{ margin: "22px 0 0", maxWidth: "48ch", fontSize: "clamp(0.95rem, 1.5vw, 1.15rem)", lineHeight: 1.65, fontWeight: 300, color: "rgba(255,255,255,0.82)", textShadow: "0 1px 16px rgba(0,0,0,0.7)" }}>
              {brand.description.body}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
