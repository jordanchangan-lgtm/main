"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { TextEffect } from "../ui/TextEffect";
import { CHANGAN } from "./theme";
import UNI_K from "../assets/changan-models/uni-k.jpg";
import UNI_T from "../assets/changan-models/uni-t.jpg";
import UNI_V from "../assets/changan-models/uni-v.jpg";
import CS75 from "../assets/changan-models/cs75plus.jpg";

// Flagship Changan (V-logo) line-up. Specs are indicative marketing copy —
// swap for the exact Jordan-market trims/figures when available.
const MODELS = [
  {
    key: "uni-k",
    name: "UNI-K",
    cat: "Flagship SUV",
    blurb: "Commanding stance, lounge-grade cabin and a 2.0T heart.",
    img: UNI_K,
  },
  {
    key: "uni-t",
    name: "UNI-T",
    cat: "Coupe SUV",
    blurb: "The design manifesto — sculpted, connected, unmistakably new.",
    img: UNI_T,
  },
  {
    key: "uni-v",
    name: "UNI-V",
    cat: "Fastback Sedan",
    blurb: "A driver's sedan with a fastback silhouette and real punch.",
    img: UNI_V,
  },
  {
    key: "cs75",
    name: "CS75 PLUS",
    cat: "Best-selling SUV",
    blurb: "The everyday flagship — space, tech and confidence for the family.",
    img: CS75,
  },
];

function ModelCard({ model, index }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        flex: "0 0 auto",
        width: "min(60vw, 840px)",
        height: "62vh",
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: hover
          ? `0 30px 80px rgba(0,0,0,0.55), 0 0 0 1px ${CHANGAN.blueBright}66`
          : "0 20px 60px rgba(0,0,0,0.45)",
        transition: "box-shadow 0.4s ease",
      }}
    >
      <motion.div
        animate={{ scale: hover ? 1.06 : 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${model.img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Changan-blue gradient so the busy street backdrop recedes and the
          car reads as the hero */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(to top, ${CHANGAN.blueDeep} 2%, ${CHANGAN.blueDeep}cc 22%, ${CHANGAN.blueDeep}22 55%, ${CHANGAN.blueDeep}55 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: hover ? 0.5 : 0.25,
          transition: "opacity 0.4s ease",
          background: `radial-gradient(90% 60% at 20% 100%, ${CHANGAN.blue}88 0%, transparent 60%)`,
          mixBlendMode: "screen",
        }}
      />

      {/* big index number */}
      <span
        style={{
          position: "absolute",
          top: 18,
          right: 26,
          fontFamily: '"Arial Black", sans-serif',
          fontWeight: 900,
          fontSize: "clamp(2.4rem, 6vw, 5rem)",
          lineHeight: 1,
          color: "#ffffff",
          opacity: 0.14,
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          padding: "clamp(24px, 4vw, 48px)",
          color: CHANGAN.white,
        }}
      >
        <div
          style={{
            fontSize: 12,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: CHANGAN.blueGlow,
            marginBottom: 12,
          }}
        >
          {model.cat}
        </div>
        <div
          style={{
            fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
            fontWeight: 900,
            letterSpacing: "0.02em",
            fontSize: "clamp(2rem, 4.5vw, 3.6rem)",
            lineHeight: 1,
          }}
        >
          {model.name}
        </div>
        <motion.p
          animate={{
            opacity: hover ? 1 : 0.72,
            y: hover ? 0 : 6,
          }}
          style={{
            margin: "14px 0 0",
            maxWidth: 440,
            fontWeight: 300,
            fontSize: "clamp(0.95rem, 1.2vw, 1.1rem)",
            lineHeight: 1.6,
            color: CHANGAN.mist,
          }}
        >
          {model.blurb}
        </motion.p>
        <motion.div
          animate={{ opacity: hover ? 1 : 0, x: hover ? 0 : -8 }}
          transition={{ duration: 0.3 }}
          style={{
            marginTop: 20,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            fontSize: 13,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: CHANGAN.white,
          }}
        >
          Explore
          <span style={{ fontSize: 16 }}>→</span>
        </motion.div>
      </div>
    </div>
  );
}

export function ChanganModels() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // horizontal travel of the card row
  const x = useTransform(scrollYProgress, [0.06, 0.94], ["4vw", "-172vw"]);
  const progressWidth = useTransform(
    scrollYProgress,
    [0.06, 0.94],
    ["0%", "100%"]
  );

  const [headIn, setHeadIn] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setHeadIn(v > 0.02);
  });

  return (
    <section
      ref={ref}
      style={{ height: "360vh", position: "relative", background: CHANGAN.blueDeep }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {/* header */}
        <div
          style={{
            position: "absolute",
            top: "9vh",
            left: "clamp(24px, 7vw, 110px)",
            zIndex: 3,
            color: CHANGAN.white,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              fontSize: 12,
              letterSpacing: "0.34em",
              textTransform: "uppercase",
              color: CHANGAN.blueGlow,
              marginBottom: 14,
            }}
          >
            <span
              style={{ width: 34, height: 1, background: CHANGAN.blueBright }}
            />
            The Range
          </div>
          <TextEffect
            key={headIn ? "models-in" : "models-out"}
            per="word"
            as="h2"
            trigger={headIn}
            preset="slide"
            style={{
              margin: 0,
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              fontWeight: 600,
              fontSize: "clamp(1.7rem, 3.6vw, 3rem)",
              letterSpacing: "-0.015em",
            }}
          >
            A Changan for every road.
          </TextEffect>
        </div>

        {/* card row */}
        <motion.div
          style={{
            display: "flex",
            gap: "3vw",
            marginTop: "9vh",
            paddingLeft: "clamp(24px, 7vw, 110px)",
            paddingRight: "10vw",
            x,
            willChange: "transform",
          }}
        >
          {MODELS.map((m, i) => (
            <ModelCard key={m.key} model={m} index={i} />
          ))}
        </motion.div>

        {/* scroll progress bar */}
        <div
          style={{
            position: "absolute",
            bottom: "7vh",
            left: "clamp(24px, 7vw, 110px)",
            right: "clamp(24px, 7vw, 110px)",
            height: 3,
            borderRadius: 3,
            background: "rgba(255,255,255,0.12)",
            overflow: "hidden",
            zIndex: 3,
          }}
        >
          <motion.div
            style={{
              height: "100%",
              width: progressWidth,
              background: `linear-gradient(90deg, ${CHANGAN.blue}, ${CHANGAN.blueBright}, ${CHANGAN.blueGlow})`,
            }}
          />
        </div>
      </div>
    </section>
  );
}
