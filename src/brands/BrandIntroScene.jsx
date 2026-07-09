"use client";

// Scroll-locked brand intro on the brand's own ethereal background:
//   step 0 — hero (wordmark + tagline)
//   scroll → step 1 — hero leaves; the description reveals on the LEFT with the
//            block-wipe effect, and an interactive 3D brand emblem sits beside it
//   scroll → unlocks the page and glides down to the globe.
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Wordmark } from "./ui/Wordmark";
import TextBlockAnimation from "./ui/TextBlockAnimation";
import { useViewport } from "./useViewport";

const EASE = [0.22, 1, 0.36, 1];

export function BrandIntroScene({ brand }) {
  const t = brand.theme;
  const { isMobile } = useViewport();
  const [step, setStep] = useState(0); // 0 hero · 1 description
  const [entered, setEntered] = useState(false);
  const stepRef = useRef(0);
  const enteredRef = useRef(false);
  const cooldownRef = useRef(false);

  const enter = () => {
    enteredRef.current = true;
    setEntered(true);
    setTimeout(() => {
      const target = document.getElementById("brand-world");
      if (target) target.scrollIntoView({ behavior: "smooth" });
    }, 400);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const cool = () => { cooldownRef.current = true; setTimeout(() => { cooldownRef.current = false; }, 750); };
    const forward = () => {
      if (cooldownRef.current || enteredRef.current) return;
      if (stepRef.current < 1) { stepRef.current = 1; setStep(1); cool(); }
      else { enter(); }
    };
    const onWheel = (e) => {
      if (enteredRef.current) return;
      e.preventDefault();
      window.scrollTo(0, 0);
      if (e.deltaY > 0) forward();
    };
    const onKey = (e) => {
      if (enteredRef.current) return;
      if (["ArrowDown", "PageDown", " ", "Spacebar"].includes(e.key)) { e.preventDefault(); forward(); }
    };
    let ty = null;
    const onTouchStart = (e) => { ty = e.touches[0].clientY; };
    const onTouchMove = (e) => {
      if (enteredRef.current || ty == null) return;
      const dy = ty - e.touches[0].clientY;
      if (Math.abs(dy) > 24) { e.preventDefault(); window.scrollTo(0, 0); if (dy > 0) forward(); ty = e.touches[0].clientY; }
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

  const showCue = !entered;

  return (
    <section style={{ position: "relative", height: "100vh", overflow: "hidden", background: "#26292f" }}>
      {/* grey backdrop with the moving dots */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, background: "#26292f" }} />
      <div className="intro-grey-dots" style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }} />
      <style>{`
        .intro-grey-dots {
          background-image: radial-gradient(circle, rgba(255,255,255,0.13) 1.1px, transparent 1.7px);
          background-size: 26px 26px;
          -webkit-mask-image: radial-gradient(ellipse 62% 60% at 50% 50%, transparent 40%, #000 85%);
          mask-image: radial-gradient(ellipse 62% 60% at 50% 50%, transparent 40%, #000 85%);
          animation: introDotsDrift 7s linear infinite;
        }
        @keyframes introDotsDrift { from { background-position: 0 0; } to { background-position: 26px 52px; } }
      `}</style>

      {/* Step 0 — hero */}
      <motion.div
        animate={{ opacity: step >= 1 ? 0 : 1, x: step >= 1 ? -70 : 0, filter: step >= 1 ? "blur(6px)" : "blur(0px)" }}
        transition={{ duration: 0.6, ease: EASE }}
        style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", pointerEvents: "none", padding: "0 6vw" }}
      >
        <div style={{ color: "#ffffff", borderRadius: "50%", padding: "min(7vh, 60px) 6vw", background: "radial-gradient(60% 55% at 50% 50%, rgba(10,12,16,0.5) 0%, rgba(10,12,16,0.24) 45%, transparent 72%)" }}>
          <div style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 300, fontSize: "clamp(1.4rem, 5.5vw, 4.5rem)", letterSpacing: "-0.01em" }}>
            {brand.hero.pre}
          </div>
          <div style={{ marginTop: "0.12em" }}>
            <Wordmark text={brand.hero.mark} transform={brand.wordmark.transform} color={t.white} style={{ fontSize: "clamp(3rem, 11vw, 9rem)", lineHeight: 1, textShadow: `0 0 40px ${t.accentBright}66` }} />
          </div>
        </div>
      </motion.div>

      {/* Step 1 — description on the LEFT, revealed with the block-wipe effect */}
      {step >= 1 && (
        <div style={{ position: "absolute", inset: 0, zIndex: 3, display: "flex", alignItems: "center", justifyContent: isMobile ? "center" : "flex-start", padding: isMobile ? "0 8vw" : "0 clamp(48px, 8vw, 140px)", pointerEvents: "none" }}>
          <TextBlockAnimation
            animateOnScroll={false}
            blockColor={t.accentBright}
            duration={0.7}
            stagger={0.08}
            style={{ maxWidth: isMobile ? "100%" : "min(620px, 52vw)", textAlign: isMobile ? "center" : "left", color: "#fff" }}
          >
            <div style={{ fontSize: 12, letterSpacing: "0.4em", textTransform: "uppercase", color: t.accentBright, fontWeight: 600, marginBottom: 18 }}>
              {brand.description?.eyebrow}
            </div>
            <h2 style={{ margin: 0, fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 300, fontSize: "clamp(1.7rem, 4.2vw, 3.2rem)", lineHeight: 1.08, letterSpacing: "-0.02em" }}>
              {brand.description?.headline}
            </h2>
            <p style={{ margin: "22px 0 0", fontSize: "clamp(0.95rem, 1.5vw, 1.15rem)", lineHeight: 1.7, fontWeight: 300, color: "rgba(255,255,255,0.85)" }}>
              {brand.description?.body}
            </p>
          </TextBlockAnimation>
        </div>
      )}

      {/* scroll cue */}
      <motion.div animate={{ opacity: showCue ? 1 : 0 }} transition={{ duration: 0.4 }} style={{ position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)", zIndex: 5, color: t.glow, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        Scroll
        <motion.span animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }} style={{ fontSize: 16, lineHeight: 1 }}>↓</motion.span>
      </motion.div>
    </section>
  );
}
