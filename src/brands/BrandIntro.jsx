"use client";

// Per-brand intro splash — the pill on the hub now lands here first, then the
// visitor enters the full brand landing page. Cinematic wordmark reveal over
// the brand's coloured ethereal field, the brand tagline, a glass "Enter"
// button, and a timed auto-advance (skippable by clicking / scrolling / Enter).
// Scaffold: extend with a brand film, stat reel, model teaser, etc.
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { EtherealShadow } from "./ui/EtherealShadow";
import { GlassFilter } from "./ui/LiquidGlass";
import { GlassButton } from "./ui/GlassButton";
import { Wordmark } from "./ui/Wordmark";

const EASE = [0.22, 1, 0.36, 1];
const INTRO_MS = 6500;

export default function BrandIntro({ brand }) {
  const t = brand.theme;
  const [entering, setEntering] = useState(false);
  const doneRef = useRef(false);

  const enter = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setEntering(true);
    setTimeout(() => { window.location.hash = `#/${brand.slug}`; }, 520);
  };

  useEffect(() => {
    const id = setTimeout(enter, INTRO_MS);
    const onKey = (e) => { if (["Enter", " ", "ArrowDown", "PageDown"].includes(e.key)) enter(); };
    const onWheel = () => enter();
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchmove", onWheel, { passive: true });
    return () => {
      clearTimeout(id);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchmove", onWheel);
    };
  }, [brand.slug]);

  return (
    <motion.div
      onClick={enter}
      initial={{ opacity: 0 }}
      animate={{ opacity: entering ? 0 : 1 }}
      transition={{ duration: 0.5, ease: EASE }}
      style={{ position: "fixed", inset: 0, background: t.deep, overflow: "hidden", cursor: "pointer" }}
    >
      <GlassFilter />
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <EtherealShadow color={brand.heroShadow || t.accent} animation={{ scale: 100, speed: 90 }} noise={{ opacity: 0.4, scale: 1.2 }} sizing="fill" style={{ background: t.deep }} />
      </div>
      <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "radial-gradient(72% 60% at 50% 45%, rgba(0,6,26,0.5) 0%, rgba(0,6,26,0.12) 55%, transparent 78%)" }} />

      <div style={{ position: "relative", zIndex: 3, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 6vw" }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }} style={{ fontSize: 12, letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.65)", fontWeight: 600, marginBottom: 24 }}>
          Changan Jordan
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 1.28, filter: "blur(16px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} transition={{ duration: 1.0, ease: EASE, delay: 0.2 }}>
          <Wordmark text={brand.hero.mark} transform={brand.wordmark.transform} color="#ffffff" style={{ fontSize: "clamp(3.2rem, 13vw, 10rem)", lineHeight: 1, textShadow: `0 0 55px ${t.accentBright}66` }} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.9 }} style={{ marginTop: 20, fontSize: "clamp(1rem, 2.4vw, 1.5rem)", fontWeight: 300, letterSpacing: "0.02em", color: "rgba(255,255,255,0.85)" }}>
          {brand.hero.pre} {brand.name}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 1.5 }} style={{ marginTop: 46 }}>
          <GlassButton accent={t.accent} onClick={(e) => { e.stopPropagation(); enter(); }} style={{ width: 220, height: 64 }}>
            <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" }}>Enter</span>
          </GlassButton>
        </motion.div>
      </div>

      {/* timed auto-advance progress */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 2, background: "rgba(255,255,255,0.12)", zIndex: 4 }}>
        <motion.div initial={{ width: "0%" }} animate={{ width: entering ? "100%" : "100%" }} transition={{ duration: INTRO_MS / 1000, ease: "linear" }} style={{ height: "100%", background: t.accentBright, boxShadow: `0 0 12px ${t.accentBright}` }} />
      </div>
    </motion.div>
  );
}
