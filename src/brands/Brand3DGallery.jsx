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
    <section ref={sectionRef} style={{ height: isMobile ? "280vh" : "340vh", position: "relative", background: "#000000" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: "#000000" }}>
        {/* pure black void behind the transparent canvas */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, background: "#000000" }} />

        {/* the flying gallery */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
          <InfiniteGallery images={images} progressRef={progressRef} visibleCount={isMobile ? 9 : 12} style={{ width: "100%", height: "100%" }} />
        </div>

        {/* description — mix-blend "difference" so it inverts over any image it
            crosses, and stays plain white over the black void */}
        <motion.div style={{ position: "absolute", inset: 0, zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 8vw", opacity: textOpacity, y: textY, pointerEvents: "none", mixBlendMode: "difference" }}>
          <div style={{ fontSize: 12, letterSpacing: "0.4em", textTransform: "uppercase", color: "#ffffff", marginBottom: 18, fontWeight: 600 }}>
            {brand.description?.eyebrow}
          </div>
          <h2 style={{ margin: 0, fontFamily: '"AVATR", "Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 300, fontSize: "clamp(1.9rem, 5vw, 4rem)", lineHeight: 1.08, letterSpacing: "-0.02em", color: "#ffffff", maxWidth: "16ch" }}>
            {brand.description?.headline}
          </h2>
          {brand.description?.body && (
            <p style={{ margin: "22px 0 0", maxWidth: "48ch", fontSize: "clamp(0.95rem, 1.5vw, 1.15rem)", lineHeight: 1.65, fontWeight: 300, color: "#ffffff" }}>
              {brand.description.body}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
