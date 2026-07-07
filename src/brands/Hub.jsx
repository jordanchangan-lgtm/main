"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { VideoBackground } from "./ui/VideoBackground";
import { GlassFilter } from "./ui/LiquidGlass";
import { GlassButton } from "./ui/GlassButton";
import { SpecialText } from "./ui/SpecialText";
import { Wordmark } from "./ui/Wordmark";
import { BRANDS } from "./brands";
import { useViewport } from "./useViewport";

const HUB_DEEP = "#000e2e";

const WORDS = ["future", "technology", "perfection"];
const WORD_HOLD = 1100;  // long enough for the decode scramble to finish + hold
const REVEAL_LOCK = 500; // pills become clickable shortly after they appear
const EASE = [0.22, 1, 0.36, 1];

// Two scrolls only: 1st scroll plays the word sequence (future → technology →
// perfection) automatically, 2nd scroll reveals the brand pills.
export default function Hub() {
  const { isMobile } = useViewport();
  const brands = useMemo(() => Object.values(BRANDS), []);
  const triGradient = `linear-gradient(90deg, ${BRANDS.changan.theme.accentBright}, ${BRANDS.deepal.theme.accentBright}, ${BRANDS.nevo.theme.accentBright})`;

  const [wi, setWi] = useState(0);
  const [stage, setStage] = useState("idle"); // idle → words → wordsDone → reveal
  const [ready, setReady] = useState(false);
  const stageRef = useRef("idle");
  const lockedRef = useRef(false);

  // Scroll hijack — only two forward gestures matter.
  useEffect(() => {
    const go = () => {
      if (lockedRef.current) return;
      if (stageRef.current === "idle") {
        stageRef.current = "words";
        setStage("words");
        lockedRef.current = true; // released when the word sequence finishes
      } else if (stageRef.current === "wordsDone") {
        stageRef.current = "reveal";
        setStage("reveal");
        lockedRef.current = true;
      }
    };
    const onWheel = (e) => { e.preventDefault(); if (e.deltaY > 0) go(); };
    const onKey = (e) => { if (["ArrowDown", "PageDown", " ", "Spacebar"].includes(e.key)) { e.preventDefault(); go(); } };
    let ty = null;
    const onTouchStart = (e) => { ty = e.touches[0].clientY; };
    const onTouchMove = (e) => {
      if (ty == null) return;
      const dy = ty - e.touches[0].clientY;
      if (dy > 24) { e.preventDefault(); go(); ty = e.touches[0].clientY; }
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

  // Auto-advance the word while in the "words" stage; when the last word has
  // held, unlock so the 2nd scroll can reveal the pills.
  useEffect(() => {
    if (stage !== "words") return;
    if (wi < WORDS.length - 1) {
      const t = setTimeout(() => setWi((v) => v + 1), WORD_HOLD);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => { stageRef.current = "wordsDone"; setStage("wordsDone"); lockedRef.current = false; }, WORD_HOLD);
    return () => clearTimeout(t);
  }, [stage, wi]);

  // Pills clickable shortly after the reveal.
  useEffect(() => {
    if (stage !== "reveal") return;
    const t = setTimeout(() => { setReady(true); lockedRef.current = false; }, REVEAL_LOCK);
    return () => clearTimeout(t);
  }, [stage]);

  const reveal = stage === "reveal";
  const showCue = stage === "idle" || stage === "wordsDone";

  const PILL_W = isMobile ? "min(80vw, 340px)" : 280;
  const PILL_H = isMobile ? 78 : 88;

  return (
    <div style={{ background: HUB_DEEP, position: "relative", height: "100vh", overflow: "hidden" }}>
      <GlassFilter />
      <div style={{ position: "absolute", inset: 0, height: "100vh", overflow: "hidden" }}>
        {/* seamless looping ocean video background (desktop / phone cut) */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <VideoBackground />
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
        </motion.div>

        {/* pills — identical size, horizontal, revealed on the 2nd scroll */}
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

        {/* scroll cue — shown when a scroll is expected */}
        <motion.div
          animate={{ opacity: showCue ? 1 : 0 }}
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
