"use client";

import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { TextEffect } from "../ui/TextEffect";
import { ChanganWordmark } from "./ChanganWordmark";
import { CHANGAN } from "./theme";

// Secondary Jordan showrooms shown as faint pins around Amman on the radar.
// Positions are decorative (percentage offsets), not geographic.
const SATELLITES = [
  { name: "Irbid", x: 62, y: 24 },
  { name: "Zarqa", x: 66, y: 45 },
  { name: "Aqaba", x: 40, y: 84 },
];

function RadarMap({ inView }) {
  const [active, setActive] = useState(null);
  return (
    <div
      style={{
        position: "relative",
        width: "min(46vw, 520px)",
        aspectRatio: "1 / 1",
        maxWidth: "86vw",
      }}
    >
      {/* faint coordinate grid */}
      <svg
        viewBox="0 0 100 100"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        {Array.from({ length: 9 }).map((_, i) => (
          <g key={i} stroke={`${CHANGAN.blueBright}22`} strokeWidth="0.2">
            <line x1={(i + 1) * 10} y1="0" x2={(i + 1) * 10} y2="100" />
            <line x1="0" y1={(i + 1) * 10} x2="100" y2={(i + 1) * 10} />
          </g>
        ))}
        {/* concentric range rings around Amman (centre ~ 50,55) */}
        {[14, 26, 38].map((r, i) => (
          <circle
            key={i}
            cx="50"
            cy="55"
            r={r}
            fill="none"
            stroke={`${CHANGAN.blueBright}33`}
            strokeWidth="0.25"
          />
        ))}
      </svg>

      {/* pulsing radar rings */}
      {inView &&
        [0, 1, 2].map((i) => (
          <motion.span
            key={i}
            initial={{ scale: 0.2, opacity: 0.6 }}
            animate={{ scale: 1.9, opacity: 0 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 1,
              ease: "easeOut",
            }}
            style={{
              position: "absolute",
              left: "50%",
              top: "55%",
              width: "34%",
              height: "34%",
              marginLeft: "-17%",
              marginTop: "-17%",
              borderRadius: "50%",
              border: `1px solid ${CHANGAN.blueBright}`,
            }}
          />
        ))}

      {/* satellite showrooms */}
      {SATELLITES.map((s) => (
        <div
          key={s.name}
          onMouseEnter={() => setActive(s.name)}
          onMouseLeave={() => setActive(null)}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            transform: "translate(-50%, -50%)",
            cursor: "pointer",
          }}
        >
          <span
            style={{
              display: "block",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: CHANGAN.blueGlow,
              opacity: 0.7,
              boxShadow: `0 0 10px ${CHANGAN.blueBright}`,
            }}
          />
          {active === s.name && (
            <span
              style={{
                position: "absolute",
                left: "50%",
                bottom: "150%",
                transform: "translateX(-50%)",
                whiteSpace: "nowrap",
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: CHANGAN.white,
                background: `${CHANGAN.blue}dd`,
                padding: "4px 8px",
                borderRadius: 4,
              }}
            >
              {s.name}
            </span>
          )}
        </div>
      ))}

      {/* Amman — flagship pin */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "55%",
          transform: "translate(-50%, -100%)",
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ y: -14, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: CHANGAN.white,
              marginBottom: 6,
              fontWeight: 600,
            }}
          >
            Amman
          </div>
          <svg width="26" height="34" viewBox="0 0 26 34" style={{ overflow: "visible" }}>
            <path
              d="M13 0C6 0 0.5 5.4 0.5 12.2 0.5 21 13 34 13 34S25.5 21 25.5 12.2C25.5 5.4 20 0 13 0Z"
              fill={CHANGAN.blueBright}
              stroke="#fff"
              strokeWidth="1.2"
            />
            <circle cx="13" cy="12" r="4.4" fill="#fff" />
          </svg>
        </motion.div>
      </div>

      {/* coordinate readout */}
      <div
        style={{
          position: "absolute",
          bottom: -4,
          left: 0,
          fontSize: 11,
          letterSpacing: "0.18em",
          color: `${CHANGAN.mist}aa`,
          fontFamily: "monospace",
        }}
      >
        31.9539° N &nbsp; 35.9106° E
      </div>
    </div>
  );
}

export function ChanganLocation() {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.35, once: false });

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        minHeight: "100vh",
        background: `linear-gradient(180deg, ${CHANGAN.blueDeep} 0%, #00081f 100%)`,
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* ambient glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(70% 60% at 75% 45%, ${CHANGAN.blue}44 0%, transparent 60%)`,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: 1280,
          margin: "0 auto",
          padding: "12vh clamp(24px, 7vw, 110px)",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "6vh",
        }}
      >
        {/* left — details */}
        <div style={{ flex: "1 1 380px", color: CHANGAN.white, maxWidth: 520 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              fontSize: 12,
              letterSpacing: "0.34em",
              textTransform: "uppercase",
              color: CHANGAN.blueGlow,
              marginBottom: 18,
            }}
          >
            <span style={{ width: 34, height: 1, background: CHANGAN.blueBright }} />
            Visit us
          </div>

          <TextEffect
            key={inView ? "loc-head-in" : "loc-head-out"}
            per="word"
            as="h2"
            trigger={inView}
            preset="slide"
            style={{
              margin: 0,
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              fontWeight: 600,
              fontSize: "clamp(1.8rem, 3.8vw, 3.2rem)",
              lineHeight: 1.08,
              letterSpacing: "-0.015em",
            }}
          >
            Experience Changan in Jordan.
          </TextEffect>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ marginTop: 30, display: "grid", gap: 22 }}
          >
            <div>
              <div style={labelStyle}>Flagship Showroom</div>
              <div style={valueStyle}>
                Mecca Street, Amman, Jordan
              </div>
            </div>
            <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
              <div>
                <div style={labelStyle}>Call</div>
                <div style={valueStyle}>+962 6 000 0000</div>
              </div>
              <div>
                <div style={labelStyle}>Hours</div>
                <div style={valueStyle}>Sat–Thu · 9:00–19:00</div>
              </div>
            </div>

            <a
              href="#book"
              style={{
                marginTop: 8,
                alignSelf: "start",
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                padding: "15px 30px",
                borderRadius: 999,
                background: CHANGAN.blueBright,
                color: "#00122b",
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: "0.06em",
                textDecoration: "none",
                boxShadow: `0 12px 34px ${CHANGAN.blueBright}55`,
              }}
            >
              Book a test drive <span style={{ fontSize: 16 }}>→</span>
            </a>
          </motion.div>
        </div>

        {/* right — radar map */}
        <div style={{ flex: "1 1 420px", display: "flex", justifyContent: "center" }}>
          <RadarMap inView={inView} />
        </div>
      </div>

      {/* footer wordmark */}
      <div
        style={{
          position: "absolute",
          bottom: 26,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
          opacity: 0.5,
        }}
      >
        <ChanganWordmark color={CHANGAN.mist} style={{ fontSize: 16 }} />
      </div>
    </section>
  );
}

const labelStyle = {
  fontSize: 11,
  letterSpacing: "0.24em",
  textTransform: "uppercase",
  color: CHANGAN.blueGlow,
  marginBottom: 8,
};
const valueStyle = {
  fontSize: "clamp(1.05rem, 1.4vw, 1.25rem)",
  fontWeight: 300,
  color: CHANGAN.white,
};
