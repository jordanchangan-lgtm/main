"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { PageBackdrop } from "./PageBackdrop";
import { GlassBrandCard } from "./ui/GlassBrandCard";
import { BRANDS } from "./brands";
import { useViewport } from "./useViewport";

const INK = "#0d1626";
const MUTED = "#5b6675";

export default function Hub() {
  const { isMobile } = useViewport();
  const stageRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ["start start", "end end"] });

  const cueOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  const headOpacity = useTransform(scrollYProgress, [0.05, 0.26], [0, 1]);
  const headY = useTransform(scrollYProgress, [0.05, 0.26], [46, 0]);
  const headBlur = useTransform(scrollYProgress, [0.05, 0.26], [14, 0]);
  const headFilter = useTransform(headBlur, (b) => `blur(${b}px)`);

  // staggered card reveal driven by scroll (exactly three brands)
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

  const triGradient = `linear-gradient(90deg, ${BRANDS.changan.theme.accent}, ${BRANDS.deepal.theme.accent}, ${BRANDS.nevo.theme.accent})`;

  return (
    <div style={{ background: "transparent", position: "relative" }}>
      <PageBackdrop />

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
          {/* headline */}
          <motion.div style={{ opacity: headOpacity, y: headY, filter: headFilter, textAlign: "center" }}>
            <div style={{ fontSize: 12, letterSpacing: "0.4em", textTransform: "uppercase", color: MUTED, marginBottom: 18, fontWeight: 600 }}>
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
                color: INK,
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

          {/* brand cards */}
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? 20 : "clamp(20px, 3vw, 44px)",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              perspective: 1400,
            }}
          >
            {brands.map((b, i) => (
              <motion.div key={b.slug} style={{ opacity: cardO[i], y: cardY[i] }}>
                <GlassBrandCard brand={b} image={b.description.images[0].src} isMobile={isMobile} />
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
              opacity: cueOpacity,
              color: MUTED,
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
