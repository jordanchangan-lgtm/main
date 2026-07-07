"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { VideoBackground } from "./ui/VideoBackground";
import { GlassFilter } from "./ui/LiquidGlass";
import { SpecialText } from "./ui/SpecialText";
import { HyperBrandParagraph } from "./ui/HyperBrandLine";
import { BRANDS } from "./brands";
import { useViewport } from "./useViewport";

const HUB_DEEP = "#000e2e";
const WORDS = ["future", "technology", "perfection"];
const EASE = [0.22, 1, 0.36, 1];

export default function Hub() {
  const { isMobile } = useViewport();
  const triGradient = `linear-gradient(90deg, ${BRANDS.changan.theme.accentBright}, ${BRANDS.deepal.theme.accentBright}, ${BRANDS.nevo.theme.accentBright})`;

  // Panel 1 headline word auto-cycles: future → technology → perfection.
  const [wi, setWi] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setWi((v) => (v + 1) % WORDS.length), 1900);
    return () => clearInterval(id);
  }, []);

  // Panel 2 — the bio text fades in as you reach the middle of the panel.
  const panel2Ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: panel2Ref, offset: ["start start", "end end"] });
  const bioOpacity = useTransform(scrollYProgress, [0.24, 0.48], [0, 1]);
  const bioY = useTransform(scrollYProgress, [0.24, 0.48], [30, 0]);

  return (
    <div style={{ position: "relative", background: "#ffffff" }}>
      <GlassFilter />

      {/* ===== Panel 1 — ocean hero with the decoding headline ===== */}
      <section style={{ position: "relative", height: "100vh", overflow: "hidden", background: HUB_DEEP }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <VideoBackground />
        </div>

        <div style={{ position: "absolute", inset: 0, zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 5vw", textAlign: "center", pointerEvents: "none" }}>
          <div style={{ fontSize: 12, letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.65)", marginBottom: 18, fontWeight: 600 }}>
            Changan Jordan
          </div>
          <h1
            style={{
              margin: 0,
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              fontWeight: 300,
              fontSize: "clamp(2.2rem, 7vw, 5rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "#ffffff",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "baseline",
              gap: "0.28em",
            }}
          >
            <span>dive into</span>
            <SpecialText
              text={WORDS[wi]}
              speed={18}
              style={{
                fontWeight: 700,
                backgroundImage: triGradient,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                WebkitTextFillColor: "transparent",
              }}
            />
          </h1>
        </div>

        <motion.div
          style={{ position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)", zIndex: 4, color: "rgba(255,255,255,0.65)", fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
        >
          Scroll
          <motion.span animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }} style={{ fontSize: 16, lineHeight: 1 }}>↓</motion.span>
        </motion.div>
      </section>

      {/* ===== Panel 2 — clean white with moving edge dots + the bio ===== */}
      <section ref={panel2Ref} style={{ position: "relative", height: "150vh", background: "#ffffff" }}>
        <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, zIndex: 0, background: "#ffffff" }} />
          <div className="hub-edge-dots" style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }} />

          <div style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center", padding: isMobile ? "0 7vw" : "0 8vw" }}>
            <motion.div style={{ opacity: bioOpacity, y: bioY }}>
              <HyperBrandParagraph />
            </motion.div>
          </div>
        </div>

        <style>{`
          .hub-edge-dots {
            background-image: radial-gradient(circle, rgba(20,28,45,0.16) 1.1px, transparent 1.7px);
            background-size: 26px 26px;
            -webkit-mask-image: radial-gradient(ellipse 60% 58% at 50% 50%, transparent 42%, #000 84%);
            mask-image: radial-gradient(ellipse 60% 58% at 50% 50%, transparent 42%, #000 84%);
            animation: hubDotsDrift 7s linear infinite;
          }
          @keyframes hubDotsDrift { from { background-position: 0 0; } to { background-position: 26px 52px; } }
        `}</style>
      </section>
    </div>
  );
}
