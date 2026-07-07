"use client";

// Scroll-locked brand intro on the brand's own ethereal background:
//   step 0 — hero (wordmark + tagline)
//   scroll → step 1 — hero leaves, the description slides in from the right as a
//            3D horizontal carousel
//   scroll → step 2 — a swipe button appears: "enter the world of <brand>"
//   swipe complete → unlocks the page so you can scroll on to the globe.
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { EtherealShadow } from "./ui/EtherealShadow";
import { Wordmark } from "./ui/Wordmark";
import { Brand3DCarousel } from "./ui/Brand3DCarousel";
import { SwipeButton } from "./ui/SwipeButton";
import { useViewport } from "./useViewport";

const EASE = [0.22, 1, 0.36, 1];

export function BrandIntroScene({ brand }) {
  const t = brand.theme;
  const { isMobile } = useViewport();
  const [step, setStep] = useState(0); // 0 hero · 1 carousel · 2 swipe
  const [entered, setEntered] = useState(false);
  const stepRef = useRef(0);
  const enteredRef = useRef(false);
  const cooldownRef = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const advance = () => {
      if (cooldownRef.current || stepRef.current >= 2) return;
      stepRef.current += 1;
      setStep(stepRef.current);
      cooldownRef.current = true;
      setTimeout(() => { cooldownRef.current = false; }, 750);
    };
    const onWheel = (e) => {
      if (enteredRef.current) return; // unlocked → scroll on to the globe
      e.preventDefault();
      window.scrollTo(0, 0);
      if (e.deltaY > 0) advance();
    };
    const onKey = (e) => {
      if (enteredRef.current) return;
      if (["ArrowDown", "PageDown", " ", "Spacebar"].includes(e.key)) { e.preventDefault(); advance(); }
    };
    let ty = null;
    const onTouchStart = (e) => { ty = e.touches[0].clientY; };
    const onTouchMove = (e) => {
      if (enteredRef.current || ty == null) return;
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

  const enter = () => {
    enteredRef.current = true;
    setEntered(true);
    // reveal + glide down to the globe / "the world" of the brand
    setTimeout(() => {
      const target = document.getElementById("brand-world");
      if (target) target.scrollIntoView({ behavior: "smooth" });
    }, 500);
  };

  const showCue = step < 2 && !entered;

  return (
    <section style={{ position: "relative", height: "100vh", overflow: "hidden", background: t.deep }}>
      {/* same ethereal background throughout */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <EtherealShadow color={brand.heroShadow || t.accent} animation={{ scale: 100, speed: 90 }} noise={{ opacity: 0.5, scale: 1.3 }} sizing="fill" style={{ background: t.deep }} />
      </div>

      {/* Step 0 — hero */}
      <motion.div
        animate={{ opacity: step >= 1 ? 0 : 1, x: step >= 1 ? -70 : 0, filter: step >= 1 ? "blur(6px)" : "blur(0px)" }}
        transition={{ duration: 0.6, ease: EASE }}
        style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", pointerEvents: "none", padding: "0 6vw" }}
      >
        <div style={{ color: t.white, borderRadius: "50%", padding: "min(7vh, 60px) 6vw", background: "radial-gradient(60% 55% at 50% 50%, rgba(0,10,40,0.5) 0%, rgba(0,10,40,0.24) 45%, transparent 72%)" }}>
          <div style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 300, fontSize: "clamp(1.4rem, 5.5vw, 4.5rem)", letterSpacing: "-0.01em" }}>
            {brand.hero.pre}
          </div>
          <div style={{ marginTop: "0.12em" }}>
            <Wordmark text={brand.hero.mark} transform={brand.wordmark.transform} color={t.white} style={{ fontSize: "clamp(3rem, 11vw, 9rem)", lineHeight: 1, textShadow: `0 0 40px ${t.accentBright}66` }} />
          </div>
        </div>
      </motion.div>

      {/* Step 1 — description as a 3D horizontal carousel sliding in from the right */}
      <motion.div
        animate={{ opacity: step >= 1 ? 1 : 0, x: step >= 1 ? "0%" : "60%", y: step >= 2 ? (isMobile ? -60 : -70) : 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        style={{ position: "absolute", inset: 0, zIndex: 3, display: "flex", alignItems: "center", justifyContent: "center", padding: isMobile ? "0 6vw" : "0 7vw", pointerEvents: step >= 1 ? "auto" : "none" }}
      >
        <Brand3DCarousel brand={brand} active={step >= 1} />
      </motion.div>

      {/* Step 2 — swipe to enter */}
      <motion.div
        animate={{ opacity: step >= 2 ? 1 : 0, y: step >= 2 ? 0 : 40 }}
        transition={{ duration: 0.55, ease: EASE, delay: step >= 2 ? 0.15 : 0 }}
        style={{ position: "absolute", left: 0, right: 0, bottom: isMobile ? "12vh" : "14vh", zIndex: 4, display: "flex", justifyContent: "center", padding: "0 6vw", pointerEvents: step >= 2 ? "auto" : "none" }}
      >
        <SwipeButton text={`Enter the world of ${brand.name}`} accent={brand.theme.accent} onSwipeComplete={enter} />
      </motion.div>

      {/* scroll cue */}
      <motion.div animate={{ opacity: showCue ? 1 : 0 }} transition={{ duration: 0.4 }} style={{ position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)", zIndex: 5, color: t.glow, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        Scroll
        <motion.span animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }} style={{ fontSize: 16, lineHeight: 1 }}>↓</motion.span>
      </motion.div>
    </section>
  );
}
