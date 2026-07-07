"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { VideoBackground } from "./ui/VideoBackground";
import { GlassFilter } from "./ui/LiquidGlass";
import { SpecialText } from "./ui/SpecialText";
import { HyperBrandParagraph } from "./ui/HyperBrandLine";
import { BRANDS } from "./brands";
import { useViewport } from "./useViewport";

const HUB_DEEP = "#000e2e";
const PAPER = "#e4e7ee";
const WORDS = ["future", "technology", "perfection"];

export default function Hub() {
  const { isMobile } = useViewport();
  const triGradient = `linear-gradient(90deg, ${BRANDS.changan.theme.accentBright}, ${BRANDS.deepal.theme.accentBright}, ${BRANDS.nevo.theme.accentBright})`;

  // Panel 1 scroll-lock: future shown, each scroll advances one word
  // (technology, perfection); the last word is held one more locked scroll,
  // then the page unlocks and the arc curtain reveal drives panel 2.
  const [step, setStep] = useState(0); // 0 future · 1 technology · 2 perfection · 3 unlocked
  const stepRef = useRef(0);
  const cooldownRef = useRef(false);
  useEffect(() => {
    window.scrollTo(0, 0);
    const advance = () => {
      if (cooldownRef.current || stepRef.current >= 3) return;
      const next = stepRef.current + 1;
      stepRef.current = next;
      setStep(next);
      cooldownRef.current = true;
      setTimeout(() => { cooldownRef.current = false; }, 700);
    };
    const onWheel = (e) => {
      if (stepRef.current >= 3) return; // unlocked → normal scroll drives the reveal
      e.preventDefault();
      window.scrollTo(0, 0);
      if (e.deltaY > 0) advance();
    };
    const onKey = (e) => {
      if (stepRef.current >= 3) return;
      if (["ArrowDown", "PageDown", " ", "Spacebar"].includes(e.key)) { e.preventDefault(); advance(); }
    };
    let ty = null;
    const onTouchStart = (e) => { ty = e.touches[0].clientY; };
    const onTouchMove = (e) => {
      if (stepRef.current >= 3) return;
      if (ty == null) return;
      const dy = ty - e.touches[0].clientY;
      if (Math.abs(dy) > 24) { e.preventDefault(); window.scrollTo(0, 0); if (dy > 0) advance(); ty = e.touches[0].clientY; }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, []);
  const wi = Math.min(step, WORDS.length - 1);
  const showCue = step < 3;

  // Arc curtain reveal — driven by page scroll after the words unlock.
  const rootRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: rootRef, offset: ["start start", "end end"] });
  const arcP = useTransform(scrollYProgress, [0, 0.42], [0, 1]);
  const arcPath = useTransform(arcP, (p) => {
    const edge = 1.1 - p * 1.4;      // top edge rises from below (1.1) to above (-0.3)
    const control = edge + 0.22;      // concave valley (centre dips below the sides)
    return `M0 ${edge} Q0.5 ${control} 1 ${edge} L1 1.1 L0 1.1 Z`;
  });
  // The bio's lines animate in (smooth stagger) once the curtain has revealed it.
  const [showBio, setShowBio] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (v) => setShowBio(v >= 0.46));

  return (
    <div ref={rootRef} style={{ position: "relative", height: "260vh", background: PAPER }}>
      <GlassFilter />

      {/* animated arc clip for panel 2 */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <defs>
          <clipPath id="hubArcClip" clipPathUnits="objectBoundingBox">
            <motion.path d={arcPath} />
          </clipPath>
        </defs>
      </svg>

      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
        {/* ===== Panel 1 — ocean hero with the decoding, scroll-locked words ===== */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden", background: HUB_DEEP }}>
          <VideoBackground />
          <div style={{ position: "absolute", inset: 0, zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 5vw", textAlign: "center", pointerEvents: "none" }}>
            <div style={{ fontSize: 12, letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.65)", marginBottom: 18, fontWeight: 600 }}>
              Changan Jordan
            </div>
            <h1 style={{ margin: 0, fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 300, fontSize: "clamp(2.2rem, 7vw, 5rem)", lineHeight: 1.05, letterSpacing: "-0.02em", color: "#ffffff", display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "baseline", gap: "0.28em" }}>
              <span>dive into</span>
              <SpecialText text={WORDS[wi]} speed={18} style={{ fontWeight: 700, backgroundImage: triGradient, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", WebkitTextFillColor: "transparent" }} />
            </h1>
          </div>
          <motion.div animate={{ opacity: showCue ? 1 : 0 }} transition={{ duration: 0.4 }} style={{ position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)", zIndex: 4, color: "rgba(255,255,255,0.65)", fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            Scroll
            <motion.span animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }} style={{ fontSize: 16, lineHeight: 1 }}>↓</motion.span>
          </motion.div>
        </div>

        {/* ===== Panel 2 — rises over panel 1 behind the curved arc curtain ===== */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1, clipPath: "url(#hubArcClip)", WebkitClipPath: "url(#hubArcClip)" }}>
          <div style={{ position: "absolute", inset: 0, background: PAPER }} />
          <div className="hub-edge-dots" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: isMobile ? "0 7vw" : "0 8vw" }}>
            <HyperBrandParagraph show={showBio} />
          </div>
        </div>
      </div>

      <style>{`
        .hub-edge-dots {
          background-image: radial-gradient(circle, rgba(20,28,45,0.22) 1.1px, transparent 1.7px);
          background-size: 26px 26px;
          -webkit-mask-image: radial-gradient(ellipse 60% 58% at 50% 50%, transparent 42%, #000 84%);
          mask-image: radial-gradient(ellipse 60% 58% at 50% 50%, transparent 42%, #000 84%);
          animation: hubDotsDrift 7s linear infinite;
        }
        @keyframes hubDotsDrift { from { background-position: 0 0; } to { background-position: 26px 52px; } }
      `}</style>
    </div>
  );
}
