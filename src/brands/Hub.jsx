"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { EtherealShadow } from "./ui/EtherealShadow";
import { GlassFilter } from "./ui/LiquidGlass";
import { GlassButton } from "./ui/GlassButton";
import { FlipWord } from "./ui/FlipWords";
import { Wordmark } from "./ui/Wordmark";
import { BRANDS } from "./brands";
import { useViewport } from "./useViewport";

const HUB_DEEP = "#000e2e";
const HUB_SHADOW = "#1e63c8";

const WORDS = ["future", "technology", "perfection"];
const FLIP_MS = 450;  // fast flip: the word disappears + reappears quickly
const HOLD_MS = 2000; // then the whole sentence is locked/held for 2s AFTER it
const LOCK_MS = FLIP_MS + HOLD_MS;
const EASE = [0.22, 1, 0.36, 1];

// step 0 = "future", 1 = "technology", 2 = "perfection", 3 = brand pills revealed
const MAX_STEP = 3;

export default function Hub() {
  const { isMobile } = useViewport();
  const brands = useMemo(() => Object.values(BRANDS), []);
  const triGradient = `linear-gradient(90deg, ${BRANDS.changan.theme.accentBright}, ${BRANDS.deepal.theme.accentBright}, ${BRANDS.nevo.theme.accentBright})`;

  const [step, setStep] = useState(0);
  const [ready, setReady] = useState(false); // end section unlocked (2s after reveal)
  const stepRef = useRef(0);
  const lockedRef = useRef(false);
  const lockTimer = useRef(null);

  // Scroll is hijacked: each scroll gesture advances one step, then locks for
  // 2 seconds before another change is allowed. Reaching the pills (step 3)
  // also honours the 2s lock — "the entire end section" stays locked for 2s.
  useEffect(() => {
    const advance = (dir) => {
      if (lockedRef.current) return;
      const next = Math.min(MAX_STEP, Math.max(0, stepRef.current + dir));
      if (next === stepRef.current) return;
      stepRef.current = next;
      setStep(next);
      lockedRef.current = true;
      lockTimer.current = setTimeout(() => { lockedRef.current = false; }, LOCK_MS);
    };

    const onWheel = (e) => { e.preventDefault(); advance(e.deltaY > 0 ? 1 : -1); };
    const onKey = (e) => {
      if (["ArrowDown", "PageDown", " ", "Spacebar"].includes(e.key)) { e.preventDefault(); advance(1); }
      else if (["ArrowUp", "PageUp"].includes(e.key)) { e.preventDefault(); advance(-1); }
    };
    let touchY = null;
    const onTouchStart = (e) => { touchY = e.touches[0].clientY; };
    const onTouchMove = (e) => {
      if (touchY == null) return;
      const dy = touchY - e.touches[0].clientY;
      if (Math.abs(dy) > 24) { e.preventDefault(); advance(dy > 0 ? 1 : -1); touchY = e.touches[0].clientY; }
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
      if (lockTimer.current) clearTimeout(lockTimer.current);
    };
  }, []);

  // When the end section is revealed, keep EVERYTHING locked for 2 seconds
  // before the pills become interactive.
  useEffect(() => {
    if (step >= MAX_STEP) {
      const t = setTimeout(() => setReady(true), HOLD_MS);
      return () => clearTimeout(t);
    }
    setReady(false);
  }, [step]);

  const reveal = step >= MAX_STEP;
  const wordIndex = Math.min(step, WORDS.length - 1);

  // Equal, identical pill dimensions.
  const PILL_W = isMobile ? "min(80vw, 340px)" : 280;
  const PILL_H = isMobile ? 78 : 88;

  return (
    <div style={{ background: HUB_DEEP, position: "relative", height: "100vh", overflow: "hidden" }}>
      <GlassFilter />
      <div style={{ position: "absolute", inset: 0, height: "100vh", overflow: "hidden" }}>
        {/* deep-blue ethereal-shadow background */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <EtherealShadow color={HUB_SHADOW} animation={{ scale: 100, speed: 90 }} noise={{ opacity: 0.5, scale: 1.3 }} sizing="fill" style={{ background: HUB_DEEP }} />
        </div>

        {/* headline — big & centred while the word flips, then it rises */}
        <motion.div
          animate={{ y: reveal ? (isMobile ? -150 : -185) : 0, scale: reveal ? 0.92 : 1.12 }}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 5vw", zIndex: 3, textAlign: "center", pointerEvents: "none" }}
        >
          <div style={{ fontSize: 12, letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 18, fontWeight: 600 }}>
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
            <FlipWord word={WORDS[wordIndex]} gradient={triGradient} />
          </h1>
        </motion.div>

        {/* pills — identical size, horizontal, revealed at the end */}
        <motion.div
          animate={{ opacity: reveal ? 1 : 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5vw", zIndex: 2, pointerEvents: ready ? "auto" : "none" }}
        >
          <div
            style={{
              width: "min(1100px, 94vw)",
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? 16 : "clamp(18px, 2.4vw, 34px)",
              alignItems: "center",
              justifyContent: "center",
              marginTop: isMobile ? "18vh" : 96,
            }}
          >
            {brands.map((b, i) => (
              <motion.div
                key={b.slug}
                animate={{ opacity: reveal ? 1 : 0, y: reveal ? 0 : 70 }}
                transition={{ duration: 0.6, ease: EASE, delay: reveal ? 0.15 + i * 0.12 : 0 }}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <GlassButton
                  href={`#/${b.slug}`}
                  accent={b.theme.accent}
                  onClick={(e) => { e.preventDefault(); window.location.hash = `#/${b.slug}`; }}
                  style={{ width: PILL_W, height: PILL_H }}
                >
                  <Wordmark
                    text={b.wordmark.text}
                    transform={b.wordmark.transform}
                    color="#ffffff"
                    style={{
                      fontSize: isMobile ? "clamp(1.5rem, 5.5vw, 1.9rem)" : "clamp(1.5rem, 1.8vw, 2rem)",
                      textShadow: `0 2px 22px ${b.theme.accent}, 0 1px 2px rgba(0,0,0,0.3)`,
                    }}
                  />
                </GlassButton>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* scroll cue — hidden once the pills are revealed */}
        <motion.div
          animate={{ opacity: reveal ? 0 : 1 }}
          transition={{ duration: 0.4 }}
          style={{ position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)", zIndex: 4, color: "rgba(255,255,255,0.6)", fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
        >
          Scroll
          <motion.span animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }} style={{ fontSize: 16, lineHeight: 1 }}>↓</motion.span>
        </motion.div>
      </div>
    </div>
  );
}
