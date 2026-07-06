"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { TextEffect } from "./ui/TextEffect";
import { Wordmark } from "./ui/Wordmark";
import { GlobeLive } from "./ui/GlobeLive";

export function BrandLocation({ brand }) {
  const t = brand.theme;
  const loc = brand.location;
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3, once: false });

  const labelStyle = { fontSize: 11, letterSpacing: "0.24em", textTransform: "uppercase", color: t.glow, marginBottom: 6 };

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        minHeight: "100vh",
        background: `linear-gradient(180deg, ${t.deep} 0%, ${t.ink} 100%)`,
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(70% 60% at 75% 45%, ${t.accent}44 0%, transparent 60%)` }} />

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
        {/* left — copy + showroom list */}
        <div style={{ flex: "1 1 400px", color: t.white, maxWidth: 540 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 12, letterSpacing: "0.34em", textTransform: "uppercase", color: t.glow, marginBottom: 18 }}>
            <span style={{ width: 34, height: 1, background: t.accentBright }} />
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
            {loc.headline}
          </TextEffect>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ marginTop: 28 }}
          >
            {/* showroom list */}
            <div style={{ display: "grid", gap: 16, marginBottom: 26 }}>
              {loc.showrooms.map((s) => (
                <div key={s.address} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <span
                    style={{
                      marginTop: 6,
                      flex: "0 0 auto",
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                      background: t.accentBright,
                      boxShadow: `0 0 10px ${t.accentBright}`,
                    }}
                  />
                  <div>
                    <div style={{ fontSize: "clamp(1rem, 1.35vw, 1.15rem)", fontWeight: 500, color: t.white }}>{s.name}</div>
                    <div style={{ fontSize: 13.5, fontWeight: 300, color: t.mist }}>{s.address}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 48, flexWrap: "wrap", marginBottom: 26 }}>
              <div>
                <div style={labelStyle}>Call</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 300, color: t.white }}>{loc.phone}</div>
              </div>
              <div>
                <div style={labelStyle}>Hours</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 300, color: t.white }}>{loc.hours}</div>
              </div>
            </div>

            <a
              href="#book"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                padding: "15px 30px",
                borderRadius: 999,
                background: t.accentBright,
                color: t.ink,
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: "0.06em",
                textDecoration: "none",
                boxShadow: `0 12px 34px ${t.accentBright}55`,
              }}
            >
              Book a test drive <span style={{ fontSize: 16 }}>→</span>
            </a>
          </motion.div>
        </div>

        {/* right — interactive globe */}
        <div style={{ flex: "1 1 380px", display: "flex", justifyContent: "center" }}>
          <div style={{ width: "min(46vw, 460px)", maxWidth: "86vw" }}>
            <GlobeLive
              markers={loc.showrooms}
              baseColor={loc.globe.base}
              markerColor={loc.globe.marker}
              glowColor={loc.globe.glow}
              phiStart={3.85}
              thetaStart={0.42}
              speed={0.003}
            />
            <div style={{ marginTop: 12, textAlign: "center", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: `${t.mist}99` }}>
              Drag to explore · Jordan
            </div>
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 26, left: "50%", transform: "translateX(-50%)", zIndex: 2, opacity: 0.5 }}>
        <Wordmark text={brand.wordmark.text} transform={brand.wordmark.transform} color={t.mist} style={{ fontSize: 16 }} />
      </div>
    </section>
  );
}
