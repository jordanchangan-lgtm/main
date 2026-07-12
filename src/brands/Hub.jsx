"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { VideoBackground } from "./ui/VideoBackground";
import { GlassFilter } from "./ui/LiquidGlass";
import { SpecialText } from "./ui/SpecialText";
import { Wordmark } from "./ui/Wordmark";
import { BRANDS } from "./brands";
import { useViewport } from "./useViewport";

const HUB_DEEP = "#000e2e";
const WORDS = ["future", "technology", "perfection"];
const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";

// A clear liquid-glass panel carrying a brand wordmark; routes to the brand page.
function BrandGlassPanel({ brand, isMobile }) {
  const t = brand.theme;
  const [h, setH] = useState(false);
  return (
    <a
      href={`#/${brand.slug}`}
      onClick={(e) => { e.preventDefault(); window.location.hash = `#/${brand.slug}`; }}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textDecoration: "none",
        width: isMobile ? "min(64vw, 250px)" : 210,
        height: isMobile ? 66 : 76,
        borderRadius: 20,
        overflow: "hidden",
        cursor: "pointer",
        transform: h ? "translateY(-5px) scale(1.05)" : "none",
        boxShadow: h
          ? "0 18px 40px rgba(0,0,0,0.45), 0 0 30px rgba(255,255,255,0.16)"
          : "0 8px 22px rgba(0,0,0,0.3)",
        transition: `transform .5s ${SPRING}, box-shadow .5s ${SPRING}`,
      }}
    >
      {/* clear refracting glass — DESATURATED so it reads as neutral/silver
          glass (no blue tint) even over the blue field, brightened so the dots
          shine through */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, borderRadius: 20, backdropFilter: "blur(1px) saturate(55%) brightness(1.04)", WebkitBackdropFilter: "blur(1px) saturate(55%) brightness(1.04)", filter: "url(#glass-distortion)", isolation: "isolate" }} />
      {/* see-through — no milky wash, only a faint lift on hover */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, borderRadius: 20, background: h ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0)", transition: `background .5s ${SPRING}` }} />
      {/* crisp shining edge */}
      <div style={{ position: "absolute", inset: 0, zIndex: 2, borderRadius: 20, padding: 1.2, background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.2) 26%, rgba(255,255,255,0) 46%, rgba(255,255,255,0.26) 68%, rgba(255,255,255,0.9) 100%)", WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude", pointerEvents: "none" }} />
      {/* inner rim highlight */}
      <div style={{ position: "absolute", inset: 0, zIndex: 2, borderRadius: 20, boxShadow: "inset 0 1px 1px rgba(255,255,255,0.55), inset 0 -1px 1.5px rgba(255,255,255,0.22)", pointerEvents: "none" }} />
      {/* thin top sheen */}
      <div style={{ position: "absolute", top: 0, left: "9%", right: "9%", height: "40%", zIndex: 2, borderRadius: 20, background: "linear-gradient(180deg, rgba(255,255,255,0.28), transparent)", pointerEvents: "none" }} />
      {/* specular streak on hover */}
      <div style={{ position: "absolute", inset: 0, zIndex: 2, borderRadius: 20, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "-40%", left: h ? "115%" : "-45%", width: "45%", height: "180%", transform: "rotate(18deg)", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)", filter: "blur(5px)", transition: "left .8s ease" }} />
      </div>

      <div style={{ position: "relative", zIndex: 3 }}>
        <Wordmark
          text={brand.wordmark.text}
          transform={brand.wordmark.transform}
          color="#ffffff"
          style={{
            fontSize: isMobile ? "clamp(1.1rem, 4.6vw, 1.35rem)" : "clamp(1.15rem, 1.4vw, 1.45rem)",
            textShadow: "0 1px 3px rgba(0,0,0,0.4)",
            transform: h ? "scale(1.05)" : "none",
            transition: `transform .5s ${SPRING}`,
          }}
        />
      </div>
    </a>
  );
}

export default function Hub() {
  const { isMobile } = useViewport();
  const brands = Object.values(BRANDS);

  // headline word loops on its own; page scrolls normally
  const [wi, setWi] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setWi((v) => (v + 1) % WORDS.length), 1900);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ position: "relative", background: HUB_DEEP }}>
      <GlassFilter />

      {/* ===== Panel 1 — ocean hero, all-white Helvetica headline ===== */}
      <section style={{ position: "relative", height: "100vh", overflow: "hidden", background: HUB_DEEP }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <VideoBackground />
        </div>

        <div style={{ position: "absolute", inset: 0, zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 5vw", textAlign: "center", pointerEvents: "none", fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
          <div style={{ fontSize: 12, letterSpacing: "0.4em", textTransform: "uppercase", color: "#ffffff", marginBottom: 18, fontWeight: 600 }}>
            Changan Jordan
          </div>
          <h1 style={{ margin: 0, fontWeight: 300, fontSize: "clamp(2.2rem, 7vw, 5rem)", lineHeight: 1.05, letterSpacing: "-0.02em", color: "#ffffff", display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "baseline", gap: "0.28em" }}>
            <span>dive into</span>
            <SpecialText text={WORDS[wi]} speed={18} style={{ fontFamily: "inherit", fontWeight: 300, color: "#ffffff" }} />
          </h1>
        </div>

        <div style={{ position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)", zIndex: 4, color: "rgba(255,255,255,0.65)", fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
          Scroll
          <motion.span animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }} style={{ fontSize: 16, lineHeight: 1 }}>↓</motion.span>
        </div>
      </section>

      {/* ===== Panel 2 — darkest blue + moving dots, three glass brand panels ===== */}
      <section style={{ position: "relative", minHeight: "100vh", background: HUB_DEEP, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="hub2-dots" style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }} />
        {/* soft ambient light behind the panels so the glass has something to refract */}
        <div style={{ position: "absolute", left: "50%", top: "58%", transform: "translate(-50%, -50%)", width: "min(900px, 90vw)", height: 300, zIndex: 0, pointerEvents: "none", background: "radial-gradient(50% 55% at 50% 50%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) 55%, transparent 78%)", filter: "blur(6px)" }} />

        <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 1200, margin: "0 auto", padding: "14vh 6vw", display: "flex", flexDirection: "column", alignItems: "center", gap: isMobile ? 40 : 56 }}>
          <div style={{ textAlign: "center", color: "#ffffff", fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
            <div style={{ fontSize: 12, letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", fontWeight: 600, marginBottom: 14 }}>
              Choose your brand
            </div>
            <h2 style={{ margin: 0, fontWeight: 300, fontSize: "clamp(1.7rem, 4.4vw, 3.2rem)", letterSpacing: "-0.02em" }}>
              Three brands, one destination.
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 20 : "clamp(20px, 3vw, 44px)", alignItems: "center", justifyContent: "center", width: "100%" }}>
            {brands.map((b, i) => (
              <motion.div
                key={b.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 }}
              >
                <BrandGlassPanel brand={b} isMobile={isMobile} />
              </motion.div>
            ))}
          </div>
        </div>

        <style>{`
          .hub2-dots {
            background-image: radial-gradient(circle, rgba(255,255,255,0.13) 1.1px, transparent 1.7px);
            background-size: 26px 26px;
            -webkit-mask-image: radial-gradient(ellipse 62% 60% at 50% 50%, transparent 40%, #000 85%);
            mask-image: radial-gradient(ellipse 62% 60% at 50% 50%, transparent 40%, #000 85%);
            animation: hub2DotsDrift 7s linear infinite;
          }
          @keyframes hub2DotsDrift { from { background-position: 0 0; } to { background-position: 26px 52px; } }
        `}</style>
      </section>
    </div>
  );
}
