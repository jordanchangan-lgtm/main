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

// Empty wide liquid-glass tile — no image; the newer liquid-glass
// (#glass-distortion refraction) simply refracts the deep-blue ethereal field
// behind it. Just the brand name on the glass, with a smooth springy hover.
const SPRING = "cubic-bezier(0.175, 0.885, 0.32, 2.2)";

function HubBrandPanel({ brand, isMobile }) {
  const t = brand.theme;
  const [hover, setHover] = useState(false);
  const go = () => { window.location.hash = `#/${brand.slug}`; };
  const R = 22;

  return (
    <a
      href={`#/${brand.slug}`}
      onClick={(e) => { e.preventDefault(); go(); }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        display: "block",
        textDecoration: "none",
        flex: isMobile ? "0 0 auto" : "1 1 0",
        width: isMobile ? "min(78vw, 340px)" : undefined,
        maxWidth: isMobile ? undefined : 300,
        height: isMobile ? 116 : 150,
        borderRadius: R,
        overflow: "hidden",
        boxShadow: hover
          ? `0 22px 50px ${t.accent}55, 0 6px 6px rgba(0,0,0,0.2)`
          : "0 6px 6px rgba(0,0,0,0.2), 0 0 20px rgba(0,0,0,0.14)",
        transform: hover ? "translateY(-7px) scale(1.05)" : "none",
        transition: `transform .7s ${SPRING}, box-shadow .7s ${SPRING}`,
        cursor: "pointer",
      }}
    >
      {/* liquid-glass layers refracting the ethereal background behind */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, borderRadius: R, backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)", filter: "url(#glass-distortion)", isolation: "isolate" }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 1, borderRadius: R, background: hover ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.18)", transition: `background .7s ${SPRING}` }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 2, borderRadius: R, boxShadow: "inset 2px 2px 1px 0 rgba(255,255,255,0.5), inset -1px -1px 1px 1px rgba(255,255,255,0.35)" }} />

      {/* brand name on the glass */}
      <div style={{ position: "absolute", inset: 0, zIndex: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Wordmark
          text={brand.wordmark.text}
          transform={brand.wordmark.transform}
          color="#ffffff"
          style={{
            fontSize: isMobile ? "clamp(1.6rem, 6vw, 2rem)" : "clamp(1.6rem, 1.9vw, 2.1rem)",
            textShadow: `0 2px 22px ${t.accent}`,
            transform: hover ? "scale(1.06)" : "none",
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

  const cueOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  const headOpacity = useTransform(scrollYProgress, [0.05, 0.26], [0, 1]);
  const headY = useTransform(scrollYProgress, [0.05, 0.26], [46, 0]);
  const headBlur = useTransform(scrollYProgress, [0.05, 0.26], [14, 0]);
  const headFilter = useTransform(headBlur, (b) => `blur(${b}px)`);

  const brands = Object.values(BRANDS);
  const cardO = [
    useTransform(scrollYProgress, [0.30, 0.44], [0, 1]),
    useTransform(scrollYProgress, [0.37, 0.51], [0, 1]),
    useTransform(scrollYProgress, [0.44, 0.58], [0, 1]),
  ];
  const cardY = [
    useTransform(scrollYProgress, [0.30, 0.48], [70, 0]),
    useTransform(scrollYProgress, [0.37, 0.55], [70, 0]),
    useTransform(scrollYProgress, [0.44, 0.62], [70, 0]),
  ];

  const triGradient = `linear-gradient(90deg, ${BRANDS.changan.theme.accentBright}, ${BRANDS.deepal.theme.accentBright}, ${BRANDS.nevo.theme.accentBright})`;

  return (
    <div style={{ background: HUB_DEEP, position: "relative" }}>
      <GlassFilter />

      <section ref={stageRef} style={{ height: isMobile ? "300vh" : "220vh", position: "relative" }}>
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: isMobile ? "5vh" : "7vh",
            padding: "0 5vw",
          }}
        >
          {/* deep-blue ethereal-shadow background */}
          <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <EtherealShadow
              color={HUB_SHADOW}
              animation={{ scale: 100, speed: 90 }}
              noise={{ opacity: 0.5, scale: 1.3 }}
              sizing="fill"
              style={{ background: HUB_DEEP }}
            />
          </div>

          {/* headline */}
          <motion.div style={{ opacity: headOpacity, y: headY, filter: headFilter, textAlign: "center", position: "relative", zIndex: 2 }}>
            <div style={{ fontSize: 12, letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 18, fontWeight: 600 }}>
              Changan Jordan
            </div>
            <h1
              style={{
                margin: 0,
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                fontWeight: 300,
                fontSize: "clamp(2rem, 7vw, 5rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                color: "#ffffff",
              }}
            >
              dive into the{" "}
              <span
                style={{
                  fontWeight: 700,
                  backgroundImage: triGradient,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  WebkitTextFillColor: "transparent",
                }}
              >
                future
              </span>
            </h1>
          </motion.div>

          {/* wide brand panels */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? 18 : "clamp(16px, 2vw, 28px)",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: isMobile ? "nowrap" : "nowrap",
              width: "100%",
              maxWidth: 1240,
            }}
          >
            {brands.map((b, i) => (
              <motion.div key={b.slug} style={{ opacity: cardO[i], y: cardY[i], flex: isMobile ? "0 0 auto" : "1 1 0", display: "flex", justifyContent: "center", minWidth: 0, width: isMobile ? "auto" : "100%" }}>
                <HubBrandPanel brand={b} isMobile={isMobile} />
              </motion.div>
            ))}
          </div>

          {/* scroll cue */}
          <motion.div
            style={{
              position: "absolute",
              bottom: 30,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 2,
              opacity: cueOpacity,
              color: "rgba(255,255,255,0.6)",
              fontSize: 11,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            Scroll
            <motion.span animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }} style={{ fontSize: 16, lineHeight: 1 }}>
              ↓
            </motion.span>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
