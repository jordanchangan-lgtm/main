"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { TextEffect } from "./ui/TextEffect";

function ModelCard({ model, index, t }) {
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
          ? `0 30px 80px rgba(0,0,0,0.55), 0 0 0 1px ${t.accentBright}66`
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
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(to top, ${t.deep} 2%, ${t.deep}cc 22%, ${t.deep}22 55%, ${t.deep}55 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: hover ? 0.5 : 0.25,
          transition: "opacity 0.4s ease",
          background: `radial-gradient(90% 60% at 20% 100%, ${t.accent}88 0%, transparent 60%)`,
          mixBlendMode: "screen",
        }}
      />
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
          color: t.white,
        }}
      >
        <div style={{ fontSize: 12, letterSpacing: "0.3em", textTransform: "uppercase", color: t.glow, marginBottom: 12 }}>
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
          animate={{ opacity: hover ? 1 : 0.72, y: hover ? 0 : 6 }}
          style={{
            margin: "14px 0 0",
            maxWidth: 440,
            fontWeight: 300,
            fontSize: "clamp(0.95rem, 1.2vw, 1.1rem)",
            lineHeight: 1.6,
            color: t.mist,
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
            color: t.white,
          }}
        >
          Explore <span style={{ fontSize: 16 }}>→</span>
        </motion.div>
      </div>
    </div>
  );
}

export function BrandModels({ brand }) {
  const t = brand.theme;
  const items = brand.models.items;
  const N = items.length;

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // Horizontal travel derived from card count (60vw card + 3vw gap stride).
  const endVw = -((N * 60 + (N - 1) * 3) - 86);
  const x = useTransform(scrollYProgress, [0.06, 0.94], ["4vw", `${endVw}vw`]);
  const progressWidth = useTransform(scrollYProgress, [0.06, 0.94], ["0%", "100%"]);

  const [headIn, setHeadIn] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (v) => setHeadIn(v > 0.02));

  return (
    <section ref={ref} style={{ height: `${N * 90}vh`, position: "relative", background: t.deep }}>
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
        <div style={{ position: "absolute", top: "9vh", left: "clamp(24px, 7vw, 110px)", zIndex: 3, color: t.white }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              fontSize: 12,
              letterSpacing: "0.34em",
              textTransform: "uppercase",
              color: t.glow,
              marginBottom: 14,
            }}
          >
            <span style={{ width: 34, height: 1, background: t.accentBright }} />
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
            {brand.models.headline}
          </TextEffect>
        </div>

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
          {items.map((m, i) => (
            <ModelCard key={m.key} model={m} index={i} t={t} />
          ))}
        </motion.div>

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
              background: `linear-gradient(90deg, ${t.accent}, ${t.accentBright}, ${t.glow})`,
            }}
          />
        </div>
      </div>
    </section>
  );
}
