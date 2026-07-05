"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { ShaderAnimation } from "./ui/ShaderAnimation";
import { TextEffect } from "./ui/TextEffect";
import { Wordmark } from "./ui/Wordmark";
import { BrandModels } from "./BrandModels";
import { BrandLocation } from "./BrandLocation";

/* ======================================================================
   Generic brand landing page — renders from a brand config (see brands.js).
   Panel 1 (hero): re-tinted shader field + "<pre> <mark>" wordmark line.
   Panel 2 (brand): brand image + description, revealed by a vertical
   screen-split of the hero that persists until ~a quarter into panel 2.
   Panel 3 (models) + Panel 4 (location) follow.
   ====================================================================== */

const blurSlideVariants = {
  container: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
    exit: { transition: { staggerChildren: 0.01, staggerDirection: 1 } },
  },
  item: {
    hidden: { opacity: 0, filter: "blur(10px) brightness(0%)", y: 12 },
    visible: { opacity: 1, y: 0, filter: "blur(0px) brightness(100%)", transition: { duration: 0.5 } },
  },
};

function HeroText({ brand }) {
  const t = brand.theme;
  return (
    <div
      style={{
        textAlign: "center",
        color: t.white,
        padding: "min(7vh, 60px) 6vw",
        userSelect: "none",
        borderRadius: "50%",
        background: "radial-gradient(60% 55% at 50% 50%, rgba(0,10,40,0.55) 0%, rgba(0,10,40,0.28) 45%, transparent 72%)",
      }}
    >
      <TextEffect
        per="word"
        as="h1"
        preset="blur"
        style={{
          margin: 0,
          fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
          fontWeight: 300,
          fontSize: "clamp(2rem, 6vw, 5.25rem)",
          lineHeight: 1.05,
          letterSpacing: "-0.01em",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0.28em",
        }}
      >
        {brand.hero.pre}
      </TextEffect>

      <motion.div
        initial={{ opacity: 0, filter: "blur(14px)", y: 18 }}
        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        transition={{ delay: 0.55, duration: 0.7, ease: "easeOut" }}
        style={{ marginTop: "0.15em" }}
      >
        <Wordmark
          text={brand.hero.mark}
          transform={brand.wordmark.transform}
          color={t.white}
          style={{ fontSize: "clamp(3rem, 11vw, 9rem)", lineHeight: 1, textShadow: `0 0 40px ${t.accentBright}66` }}
        />
      </motion.div>
    </div>
  );
}

function BrandPanel({ brand, inView }) {
  const t = brand.theme;
  const b = brand.brand;
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", overflow: "hidden", background: t.deep }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${b.image})`, backgroundSize: "cover", backgroundPosition: "center" }} />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${t.deep}f2 0%, ${t.deep}cc 42%, ${t.deep}33 100%)` }} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(120% 80% at 15% 50%, ${t.accent}55 0%, transparent 60%)`, mixBlendMode: "screen" }} />

      <div style={{ position: "relative", zIndex: 2, maxWidth: "min(640px, 82vw)", padding: "0 clamp(24px, 7vw, 110px)", color: t.white }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5 }}
          style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 12, letterSpacing: "0.34em", textTransform: "uppercase", color: t.glow, marginBottom: 22 }}
        >
          <span style={{ width: 34, height: 1, background: t.accentBright, display: "inline-block" }} />
          {b.eyebrow}
        </motion.div>

        <TextEffect
          key={inView ? "brand-head-in" : "brand-head-out"}
          per="word"
          as="h2"
          trigger={inView}
          variants={blurSlideVariants}
          style={{
            margin: 0,
            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
            fontWeight: 600,
            fontSize: "clamp(1.7rem, 3.6vw, 3.1rem)",
            lineHeight: 1.08,
            letterSpacing: "-0.015em",
          }}
        >
          {b.headline}
        </TextEffect>

        <TextEffect
          key={inView ? "brand-body-in" : "brand-body-out"}
          per="line"
          as="p"
          trigger={inView}
          delay={0.35}
          segmentWrapperClassName="ce-line"
          variants={{
            container: { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.18 } } },
            item: { hidden: { opacity: 0, y: 26 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55 } } },
          }}
          style={{
            marginTop: 26,
            maxWidth: 520,
            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
            fontWeight: 300,
            fontSize: "clamp(0.98rem, 1.35vw, 1.18rem)",
            lineHeight: 1.7,
            color: t.mist,
          }}
        >
          {b.body}
        </TextEffect>
      </div>
    </div>
  );
}

export default function BrandLanding({ brand }) {
  const t = brand.theme;
  const stageRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ["start start", "end end"] });

  const topY = useTransform(scrollYProgress, [0.3, 0.62], ["0vh", "-51vh"]);
  const bottomY = useTransform(scrollYProgress, [0.3, 0.62], ["0vh", "51vh"]);
  const heroTextOpacity = useTransform(scrollYProgress, [0.16, 0.32], [1, 0]);
  const heroTextY = useTransform(scrollYProgress, [0.16, 0.32], [0, -60]);
  const panelScale = useTransform(scrollYProgress, [0.3, 0.62], [1.12, 1]);
  const seamOpacity = useTransform(scrollYProgress, [0.3, 0.42, 0.6], [0, 1, 0]);

  const [brandIn, setBrandIn] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (v) => setBrandIn(v > 0.46));

  return (
    <div style={{ background: t.deep }}>
      <div style={{ position: "fixed", top: 26, left: 34, zIndex: 50, mixBlendMode: "difference" }}>
        <Wordmark text={brand.wordmark.text} transform={brand.wordmark.transform} color="#ffffff" style={{ fontSize: 22 }} />
      </div>

      {/* ============ STAGE: hero + split reveal of brand panel ============ */}
      <section ref={stageRef} style={{ height: "320vh", position: "relative" }}>
        <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
          <motion.div style={{ position: "absolute", inset: 0, zIndex: 0, scale: panelScale }}>
            <BrandPanel brand={brand} inView={brandIn} />
          </motion.div>

          <motion.div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "50vh",
              overflow: "hidden",
              zIndex: 2,
              y: topY,
              willChange: "transform",
              boxShadow: "0 22px 60px rgba(0,0,0,0.45)",
            }}
          >
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100vh" }}>
              <ShaderAnimation colors={brand.shaderColors} background={t.deep} />
            </div>
          </motion.div>

          <motion.div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "50vh",
              overflow: "hidden",
              zIndex: 2,
              y: bottomY,
              willChange: "transform",
              boxShadow: "0 -22px 60px rgba(0,0,0,0.45)",
            }}
          >
            <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "100vh" }}>
              <ShaderAnimation colors={brand.shaderColors} background={t.deep} />
            </div>
          </motion.div>

          <motion.div
            style={{
              position: "absolute",
              top: "50vh",
              left: 0,
              width: "100%",
              height: 2,
              transform: "translateY(-1px)",
              zIndex: 3,
              opacity: seamOpacity,
              background: `linear-gradient(90deg, transparent, ${t.glow}, ${t.white}, ${t.glow}, transparent)`,
              boxShadow: `0 0 24px 4px ${t.accentBright}`,
            }}
          />

          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              opacity: heroTextOpacity,
              y: heroTextY,
            }}
          >
            <HeroText brand={brand} />
          </motion.div>

          <motion.div
            style={{
              position: "absolute",
              bottom: 30,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 4,
              color: t.glow,
              fontSize: 11,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              opacity: heroTextOpacity,
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

      {/* ============ PANEL 3 — models · PANEL 4 — location ============ */}
      <BrandModels brand={brand} />
      <BrandLocation brand={brand} />
    </div>
  );
}
