"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { TextEffect } from "./ui/TextEffect";
import { Wordmark } from "./ui/Wordmark";
import { GlobeLive } from "./ui/GlobeLive";
import { useViewport } from "./useViewport";

export function BrandLocation({ brand }) {
  const t = brand.theme;
  const loc = brand.location;
  const { isMobile } = useViewport();
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3, once: false });

  const labelStyle = { fontSize: 11, letterSpacing: "0.24em", textTransform: "uppercase", color: t.accentBright, marginBottom: 6, fontWeight: 600 };

  return (
    <section
      ref={ref}
      data-panel-gate
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "transparent",
        display: "flex",
        alignItems: isMobile ? "flex-start" : "center",
        overflow: "hidden",
      }}
    >
      {/* dark base (from the page gradient) + soft accent glow behind the globe */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, background: "transparent" }} />
      <div className="loc-edge-dots" style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 0, background: `radial-gradient(60% 55% at 74% 46%, ${t.accentBright}22 0%, transparent 62%)` }} />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: 1280,
          margin: "0 auto",
          padding: isMobile ? "15vh clamp(24px, 7vw, 110px) 8vh" : "12vh clamp(24px, 7vw, 110px)",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "5vh",
        }}
      >
        {/* left — copy + showroom list */}
        <div style={{ flex: "1 1 400px", color: "#ffffff", maxWidth: 540 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 12, letterSpacing: "0.34em", textTransform: "uppercase", color: t.accentBright, marginBottom: 18, fontWeight: 600 }}>
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
              fontFamily: '"AVATR", "Helvetica Neue", Helvetica, Arial, sans-serif',
              fontWeight: 600,
              fontSize: "clamp(1.8rem, 3.8vw, 3.2rem)",
              lineHeight: 1.08,
              letterSpacing: "-0.015em",
              color: "#ffffff",
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
                    <div style={{ fontSize: "clamp(1rem, 1.35vw, 1.15rem)", fontWeight: 600, color: "#ffffff" }}>{s.name}</div>
                    <div style={{ fontSize: 13.5, fontWeight: 400, color: "rgba(255,255,255,0.6)" }}>{s.address}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 48, flexWrap: "wrap", marginBottom: 26 }}>
              <div>
                <div style={labelStyle}>Call</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 400, color: "#ffffff" }}>{loc.phone}</div>
              </div>
              <div>
                <div style={labelStyle}>Hours</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 400, color: "#ffffff" }}>{loc.hours}</div>
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
                color: "#14181d",
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: "0.06em",
                textDecoration: "none",
                boxShadow: `0 12px 30px ${t.accentBright}55`,
              }}
            >
              Book a test drive <span style={{ fontSize: 16 }}>→</span>
            </a>
          </motion.div>
        </div>

        {/* right — interactive globe */}
        <div style={{ flex: "1 1 320px", display: "flex", justifyContent: "center", width: "100%" }}>
          <div style={{ width: isMobile ? "min(84vw, 380px)" : "min(44vw, 460px)", minWidth: 0 }}>
            <GlobeLive
              markers={loc.showrooms}
              baseColor={loc.globe.base}
              markerColor={loc.globe.marker}
              glowColor={loc.globe.glow}
              accent={t.accentBright}
              inView={inView}
            />
            <div style={{ marginTop: 12, textAlign: "center", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
              Drag to explore · Jordan
            </div>
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 26, left: "50%", transform: "translateX(-50%)", zIndex: 2, opacity: 0.4 }}>
        <Wordmark text={brand.wordmark.text} transform={brand.wordmark.transform} color="#ffffff" style={{ fontSize: 16 }} />
      </div>

      <style>{`
        .loc-edge-dots {
          background-image: radial-gradient(circle, rgba(255,255,255,0.11) 1.1px, transparent 1.7px);
          background-size: 26px 26px;
          -webkit-mask-image: radial-gradient(ellipse 62% 60% at 50% 50%, transparent 44%, #000 86%);
          mask-image: radial-gradient(ellipse 62% 60% at 50% 50%, transparent 44%, #000 86%);
          animation: locDotsDrift 7s linear infinite;
        }
        @keyframes locDotsDrift { from { background-position: 0 0; } to { background-position: 26px 52px; } }
      `}</style>
    </section>
  );
}
