"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { EtherealShadow } from "./ui/EtherealShadow";
import { GlassFilter } from "./ui/LiquidGlass";
import { Wordmark } from "./ui/Wordmark";
import { BRANDS } from "./brands";
import { useViewport } from "./useViewport";

const HUB_DEEP = "#000e2e";
const HUB_SHADOW = "#1e63c8";
const SPRING = "cubic-bezier(0.175, 0.885, 0.32, 2.2)";

// A real liquid-glass tile: no fill — bright refractive edges + a thin glass
// wash let the deep-blue ethereal field show and bend through it. Springy,
// morphing hover. Horizontal.
function HubBrandPanel({ brand, isMobile }) {
  const t = brand.theme;
  const [h, setH] = useState(false);
  const go = () => { window.location.hash = `#/${brand.slug}`; };
  const R = 30;

  return (
    <a
      href={`#/${brand.slug}`}
      onClick={(e) => { e.preventDefault(); go(); }}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textDecoration: "none",
        flex: isMobile ? "0 0 auto" : "1 1 0",
        width: isMobile ? "min(78vw, 340px)" : undefined,
        maxWidth: isMobile ? undefined : 300,
        height: isMobile ? 94 : 112,
        borderRadius: R,
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: h
          ? `0 12px 30px rgba(0,0,0,0.28), 0 0 40px ${t.accent}66`
          : "0 6px 6px rgba(0,0,0,0.2), 0 0 20px rgba(0,0,0,0.12)",
        transform: h ? "translateY(-6px) scale(1.06)" : "none",
        transition: `transform .7s ${SPRING}, box-shadow .7s ${SPRING}`,
      }}
    >
      {/* refracting glass — blurs/bends the ethereal behind it */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, borderRadius: R, backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)", filter: "url(#glass-distortion)", isolation: "isolate" }} />
      {/* very light wash */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, borderRadius: R, background: h ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.08)", transition: `background .7s ${SPRING}` }} />
      {/* bright glass edges */}
      <div style={{ position: "absolute", inset: 0, zIndex: 2, borderRadius: R, boxShadow: "inset 2px 2px 1px 0 rgba(255,255,255,0.65), inset -1.5px -1.5px 1px 1px rgba(255,255,255,0.45)" }} />
      {/* top sheen */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "58%", zIndex: 2, borderRadius: `${R}px ${R}px 40% 40%`, background: "linear-gradient(150deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.05) 45%, transparent 65%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 3 }}>
        <Wordmark
          text={brand.wordmark.text}
          transform={brand.wordmark.transform}
          color="#ffffff"
          style={{
            fontSize: isMobile ? "clamp(1.5rem, 5.5vw, 1.9rem)" : "clamp(1.45rem, 1.7vw, 1.95rem)",
            textShadow: `0 2px 22px ${t.accent}, 0 1px 2px rgba(0,0,0,0.3)`,
            transform: h ? "scale(1.06)" : "none",
            transition: `transform .7s ${SPRING}`,
          }}
        />
      </div>
    </a>
  );
}

export default function Hub() {
  const { isMobile } = useViewport();
  const stageRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ["start start", "end end"] });

  // Choreography: the sentence appears big + centered, then moves up so the
  // panels slide into the middle.
  const headOpacity = useTransform(scrollYProgress, [0, 0.06], [0, 1]);
  const headY = useTransform(scrollYProgress, [0.06, 0.44], [0, isMobile ? -150 : -185]);
  const headScale = useTransform(scrollYProgress, [0.06, 0.44], [1.12, 0.9]);

  const panelsOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);
  const brands = Object.values(BRANDS);
  const cardY = [
    useTransform(scrollYProgress, [0.30, 0.52], [70, 0]),
    useTransform(scrollYProgress, [0.36, 0.58], [70, 0]),
    useTransform(scrollYProgress, [0.42, 0.64], [70, 0]),
  ];
  const cardO = [
    useTransform(scrollYProgress, [0.30, 0.46], [0, 1]),
    useTransform(scrollYProgress, [0.36, 0.52], [0, 1]),
    useTransform(scrollYProgress, [0.42, 0.58], [0, 1]),
  ];

  const cueOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  const triGradient = `linear-gradient(90deg, ${BRANDS.changan.theme.accentBright}, ${BRANDS.deepal.theme.accentBright}, ${BRANDS.nevo.theme.accentBright})`;

  return (
    <div style={{ background: HUB_DEEP, position: "relative" }}>
      <GlassFilter />
      <section ref={stageRef} style={{ height: isMobile ? "300vh" : "240vh", position: "relative" }}>
        <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
          {/* deep-blue ethereal-shadow background */}
          <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <EtherealShadow color={HUB_SHADOW} animation={{ scale: 100, speed: 90 }} noise={{ opacity: 0.5, scale: 1.3 }} sizing="fill" style={{ background: HUB_DEEP }} />
          </div>

          {/* headline — starts big & centred, then rises */}
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
              }}
            >
              dive into the{" "}
              <span style={{ fontWeight: 700, backgroundImage: triGradient, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", WebkitTextFillColor: "transparent" }}>
                future
              </span>
            </h1>
          </motion.div>

          {/* panels — settle into the middle */}
          <motion.div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5vw", opacity: panelsOpacity, zIndex: 2 }}>
            <div
              style={{
                width: "min(1200px, 94vw)",
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? 16 : "clamp(16px, 2vw, 28px)",
                alignItems: "center",
                justifyContent: "center",
                marginTop: isMobile ? "18vh" : 90,
              }}
            >
              {brands.map((b, i) => (
                <motion.div key={b.slug} style={{ opacity: cardO[i], y: cardY[i], flex: isMobile ? "0 0 auto" : "1 1 0", display: "flex", justifyContent: "center", minWidth: 0, width: isMobile ? "auto" : "100%" }}>
                  <HubBrandPanel brand={b} isMobile={isMobile} />
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
