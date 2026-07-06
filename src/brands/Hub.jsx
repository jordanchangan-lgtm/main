"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { EtherealShadow } from "./ui/EtherealShadow";
import { GlassFilter } from "./ui/LiquidGlass";
import { GlassButton } from "./ui/GlassButton";
import { Wordmark } from "./ui/Wordmark";
import { BRANDS } from "./brands";
import { useViewport } from "./useViewport";

const HUB_DEEP = "#000e2e";
const HUB_SHADOW = "#1e63c8";

const WORDS = ["future", "technology", "perfection"];

export default function Hub() {
  const { isMobile } = useViewport();
  const stageRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ["start start", "end end"] });

  // The word "future" flips 3 times as you scroll: future → technology →
  // perfection. Only once all three have shown does the sentence rise and the
  // brand pills appear.
  const [wi, setWi] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = v < 0.18 ? 0 : v < 0.34 ? 1 : 2;
    setWi((prev) => (prev === next ? prev : next));
  });

  // Choreography: sentence big + centred while the word cycles, then it moves
  // up so the horizontal pills slide into the middle.
  const headOpacity = useTransform(scrollYProgress, [0, 0.06], [0, 1]);
  const headY = useTransform(scrollYProgress, [0.42, 0.62], [0, isMobile ? -150 : -185]);
  const headScale = useTransform(scrollYProgress, [0.42, 0.62], [1.12, 0.92]);

  const panelsOpacity = useTransform(scrollYProgress, [0.5, 0.66], [0, 1]);
  const brands = Object.values(BRANDS);
  const cardY = [
    useTransform(scrollYProgress, [0.50, 0.70], [70, 0]),
    useTransform(scrollYProgress, [0.55, 0.75], [70, 0]),
    useTransform(scrollYProgress, [0.60, 0.80], [70, 0]),
  ];
  const cardO = [
    useTransform(scrollYProgress, [0.50, 0.64], [0, 1]),
    useTransform(scrollYProgress, [0.55, 0.69], [0, 1]),
    useTransform(scrollYProgress, [0.60, 0.74], [0, 1]),
  ];

  const cueOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  const triGradient = `linear-gradient(90deg, ${BRANDS.changan.theme.accentBright}, ${BRANDS.deepal.theme.accentBright}, ${BRANDS.nevo.theme.accentBright})`;

  return (
    <div style={{ background: HUB_DEEP, position: "relative" }}>
      <GlassFilter />
      <section ref={stageRef} style={{ height: isMobile ? "320vh" : "280vh", position: "relative" }}>
        <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
          {/* deep-blue ethereal-shadow background */}
          <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <EtherealShadow color={HUB_SHADOW} animation={{ scale: 100, speed: 90 }} noise={{ opacity: 0.5, scale: 1.3 }} sizing="fill" style={{ background: HUB_DEEP }} />
          </div>

          {/* headline — starts big & centred, the word flips, then it rises */}
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 5vw",
              y: headY,
              scale: headScale,
              opacity: headOpacity,
              zIndex: 3,
              textAlign: "center",
              pointerEvents: "none",
            }}
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
                perspective: 800,
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "baseline",
                gap: "0.28em",
              }}
            >
              <span>dive into the</span>
              <span style={{ position: "relative", display: "inline-flex", justifyContent: "center", transformStyle: "preserve-3d" }}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={WORDS[wi]}
                    initial={{ rotateX: -90, opacity: 0, y: "0.1em" }}
                    animate={{ rotateX: 0, opacity: 1, y: 0 }}
                    exit={{ rotateX: 90, opacity: 0, y: "-0.1em" }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      display: "inline-block",
                      transformOrigin: "center",
                      fontWeight: 700,
                      backgroundImage: triGradient,
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {WORDS[wi]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>
          </motion.div>

          {/* pills — horizontal, side by side, settle into the middle */}
          <motion.div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5vw", opacity: panelsOpacity, zIndex: 2 }}>
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
                <motion.div key={b.slug} style={{ opacity: cardO[i], y: cardY[i], flex: isMobile ? "0 0 auto" : "1 1 0", display: "flex", justifyContent: "center", minWidth: 0, width: isMobile ? "auto" : "100%" }}>
                  <GlassButton
                    href={`#/${b.slug}`}
                    accent={b.theme.accent}
                    onClick={(e) => { e.preventDefault(); window.location.hash = `#/${b.slug}`; }}
                    minWidth={isMobile ? "min(78vw, 340px)" : "100%"}
                    style={{ width: isMobile ? "min(78vw, 340px)" : "100%" }}
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

          {/* scroll cue */}
          <motion.div
            style={{ position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)", zIndex: 3, opacity: cueOpacity, color: "rgba(255,255,255,0.6)", fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
          >
            Scroll
            <motion.span animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }} style={{ fontSize: 16, lineHeight: 1 }}>↓</motion.span>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
