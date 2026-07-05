"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { ShaderAnimation } from "../ui/ShaderAnimation";
import { TextEffect } from "../ui/TextEffect";
import { ChanganWordmark } from "./ChanganWordmark";
import { ChanganModels } from "./ChanganModels";
import { ChanganLocation } from "./ChanganLocation";
import { CHANGAN } from "./theme";
import CHANGAN_FACTORY from "../assets/changan-factory.jpg";

/* ======================================================================
   CHANGAN — brand landing page
   Panel 1 (hero): Changan-blue shader field + "drive the world with changan"
   Panel 2 (brand): factory image + description, revealed by a vertical
   screen-split of the hero. The hero "lives" (stays on screen splitting
   apart) until roughly a quarter into panel 2's scroll, per the brief.
   ====================================================================== */

// Screen-split blur/slide text variants (from the reference text-effect demo).
const blurSlideVariants = {
  container: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
    exit: { transition: { staggerChildren: 0.01, staggerDirection: 1 } },
  },
  item: {
    hidden: { opacity: 0, filter: "blur(10px) brightness(0%)", y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px) brightness(100%)",
      transition: { duration: 0.5 },
    },
  },
};

function HeroText() {
  return (
    <div
      style={{
        textAlign: "center",
        color: CHANGAN.white,
        padding: "min(7vh, 60px) 6vw",
        userSelect: "none",
        borderRadius: "50%",
        background:
          "radial-gradient(60% 55% at 50% 50%, rgba(0,10,40,0.55) 0%, rgba(0,10,40,0.28) 45%, transparent 72%)",
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
        drive the world with
      </TextEffect>

      <motion.div
        initial={{ opacity: 0, filter: "blur(14px)", y: 18 }}
        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        transition={{ delay: 0.55, duration: 0.7, ease: "easeOut" }}
        style={{ marginTop: "0.15em" }}
      >
        <ChanganWordmark
          color={CHANGAN.white}
          style={{
            fontSize: "clamp(3rem, 11vw, 9rem)",
            lineHeight: 1,
            textShadow: `0 0 40px ${CHANGAN.blueBright}66`,
          }}
        />
      </motion.div>
    </div>
  );
}

function BrandPanel({ inView }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: CHANGAN.blueDeep,
      }}
    >
      {/* factory image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${CHANGAN_FACTORY})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* legibility + brand-blue wash */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(90deg, ${CHANGAN.blueDeep}f2 0%, ${CHANGAN.blueDeep}cc 42%, ${CHANGAN.blueDeep}33 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(120% 80% at 15% 50%, ${CHANGAN.blue}55 0%, transparent 60%)`,
          mixBlendMode: "screen",
        }}
      />

      {/* copy */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "min(640px, 82vw)",
          padding: "0 clamp(24px, 7vw, 110px)",
          color: CHANGAN.white,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            fontSize: 12,
            letterSpacing: "0.34em",
            textTransform: "uppercase",
            color: CHANGAN.blueGlow,
            marginBottom: 22,
          }}
        >
          <span
            style={{
              width: 34,
              height: 1,
              background: CHANGAN.blueBright,
              display: "inline-block",
            }}
          />
          The Brand
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
          Engineered in China, driven across the world.
        </TextEffect>

        <TextEffect
          key={inView ? "brand-body-in" : "brand-body-out"}
          per="line"
          as="p"
          trigger={inView}
          delay={0.35}
          segmentWrapperClassName="ce-line"
          variants={{
            container: {
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.18 } },
            },
            item: {
              hidden: { opacity: 0, y: 26 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.55 },
              },
            },
          }}
          style={{
            marginTop: 26,
            maxWidth: 520,
            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
            fontWeight: 300,
            fontSize: "clamp(0.98rem, 1.35vw, 1.18rem)",
            lineHeight: 1.7,
            color: CHANGAN.mist,
          }}
        >
          {
            "Founded in 1862, Changan is one of China's\noldest and largest automakers — today a\nglobal new-energy brand trusted by more than\n28 million drivers across 60+ markets.\nEvery vehicle is built in fully digital,\nlow-carbon plants — design and craft at scale."
          }
        </TextEffect>
      </div>
    </div>
  );
}

export default function ChanganLanding() {
  const stageRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start start", "end end"],
  });

  // Split choreography ------------------------------------------------------
  // 0.00–0.30  hero holds, wordmark settled
  // 0.30–0.62  halves slide apart, brand panel revealed through the seam
  //            (hero fully clears at ~0.62 ≈ a quarter into the panel-2 span)
  // 0.62–1.00  brand panel holds
  const topY = useTransform(scrollYProgress, [0.3, 0.62], ["0vh", "-51vh"]);
  const bottomY = useTransform(scrollYProgress, [0.3, 0.62], ["0vh", "51vh"]);
  const heroTextOpacity = useTransform(
    scrollYProgress,
    [0.16, 0.32],
    [1, 0]
  );
  const heroTextY = useTransform(scrollYProgress, [0.16, 0.32], [0, -60]);
  const panelScale = useTransform(scrollYProgress, [0.3, 0.62], [1.12, 1]);
  const seamOpacity = useTransform(
    scrollYProgress,
    [0.3, 0.42, 0.6],
    [0, 1, 0]
  );

  const [brandIn, setBrandIn] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setBrandIn(v > 0.46);
  });

  return (
    <div style={{ background: CHANGAN.blueDeep }}>
      {/* fixed brand mark */}
      <div
        style={{
          position: "fixed",
          top: 26,
          left: 34,
          zIndex: 50,
          mixBlendMode: "difference",
        }}
      >
        <ChanganWordmark color="#ffffff" style={{ fontSize: 22 }} />
      </div>

      {/* ============ STAGE: hero + split reveal of brand panel ============ */}
      <section ref={stageRef} style={{ height: "320vh", position: "relative" }}>
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "hidden",
          }}
        >
          {/* z0 — brand panel, revealed by the split */}
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              scale: panelScale,
            }}
          >
            <BrandPanel inView={brandIn} />
          </motion.div>

          {/* z2 — top half of the hero */}
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
              <ShaderAnimation />
            </div>
          </motion.div>

          {/* z2 — bottom half of the hero */}
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
              <ShaderAnimation />
            </div>
          </motion.div>

          {/* glowing seam that flashes as the panels part */}
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
              background: `linear-gradient(90deg, transparent, ${CHANGAN.blueGlow}, ${CHANGAN.white}, ${CHANGAN.blueGlow}, transparent)`,
              boxShadow: `0 0 24px 4px ${CHANGAN.blueBright}`,
            }}
          />

          {/* z4 — hero headline overlay */}
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
            <HeroText />
          </motion.div>

          {/* scroll cue */}
          <motion.div
            style={{
              position: "absolute",
              bottom: 30,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 4,
              color: CHANGAN.blueGlow,
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
            <motion.span
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              style={{ fontSize: 16, lineHeight: 1 }}
            >
              ↓
            </motion.span>
          </motion.div>
        </div>
      </section>

      {/* ============ PANEL 3 — car models (horizontal scroll) ============ */}
      <ChanganModels />

      {/* ============ PANEL 4 — location ============ */}
      <ChanganLocation />
    </div>
  );
}
