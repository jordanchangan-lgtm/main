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

// Wide brand "slider" panel, built on the newer liquid-glass (the
// #glass-distortion refraction): the brand image shows through the frosted,
// refracting glass; wordmark + explore sit crisp on top. Click routes in.
function HubBrandPanel({ brand, image, isMobile }) {
  const t = brand.theme;
  const [hover, setHover] = useState(false);
  const go = () => { window.location.hash = `#/${brand.slug}`; };
  const R = 26;

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
        width: isMobile ? "min(90vw, 460px)" : undefined,
        maxWidth: isMobile ? undefined : 440,
        height: isMobile ? 190 : 320,
        borderRadius: R,
        overflow: "hidden",
        boxShadow: hover ? `0 34px 74px ${t.accent}55` : "0 18px 44px rgba(0,0,0,0.4)",
        transform: hover ? "translateY(-8px) scale(1.02)" : "none",
        transition: "transform .5s cubic-bezier(.22,1,.36,1), box-shadow .5s",
        cursor: "pointer",
      }}
    >
      {/* brand image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: hover ? "scale(1.07)" : "scale(1.0)",
          transition: "transform .7s ease",
        }}
      />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${t.deep}22 0%, ${t.deep}55 55%, ${t.deep}dd 100%)` }} />

      {/* newer liquid-glass layers refracting the image */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)", filter: "url(#glass-distortion)", isolation: "isolate" }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 2, background: "rgba(255,255,255,0.16)" }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 3, boxShadow: "inset 2px 2px 1px 0 rgba(255,255,255,0.5), inset -1px -1px 1px 1px rgba(255,255,255,0.35)" }} />

      {/* content */}
      <div style={{ position: "absolute", inset: 0, zIndex: 4, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: isMobile ? 20 : 26 }}>
        <Wordmark
          text={brand.wordmark.text}
          transform={brand.wordmark.transform}
          color="#ffffff"
          style={{ fontSize: isMobile ? "clamp(1.7rem, 6vw, 2.1rem)" : "clamp(1.7rem, 2vw, 2.2rem)", textShadow: `0 2px 20px ${t.accent}` }}
        />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: "#fff" }}>Explore</span>
          <span
            style={{
              display: "grid",
              placeContent: "center",
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "#fff",
              color: t.accent,
              fontSize: 17,
              boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
              transform: hover ? "translateX(4px)" : "none",
              transition: "transform .4s",
            }}
          >
            →
          </span>
        </div>
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
                <HubBrandPanel brand={b} image={b.description.images[0].src} isMobile={isMobile} />
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
