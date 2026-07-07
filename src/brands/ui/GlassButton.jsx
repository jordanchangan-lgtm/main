"use client";

// A genuinely transparent liquid-glass pill (iOS style): the body has almost no
// fill and no colour — it just blurs/refracts whatever is behind it (the ocean)
// via backdrop-filter + the #glass-distortion filter. Identity comes from the
// bright shining edge, a thin top sheen and the label — NOT a coloured fill.
import React, { useState } from "react";

const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";

export function GlassButton({ children, accent = "#12A5F4", href, onClick, style }) {
  const [h, setH] = useState(false);

  const inner = (
    <div
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        position: "relative",
        isolation: "isolate",
        borderRadius: 999,
        overflow: "hidden",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: h ? "translateY(-4px) scale(1.04)" : "none",
        // neutral depth shadow only — no coloured blob bleeding through the glass
        boxShadow: h
          ? `0 20px 44px rgba(0,0,0,0.4), 0 0 34px ${accent}33`
          : "0 12px 30px rgba(0,0,0,0.34)",
        transition: `transform .5s ${SPRING}, box-shadow .5s ${SPRING}`,
        ...style,
      }}
    >
      {/* CLEAR refracting glass — moderate blur so the ocean still reads through */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, borderRadius: 999, backdropFilter: "blur(5px) saturate(115%)", WebkitBackdropFilter: "blur(5px) saturate(115%)", filter: "url(#glass-distortion)", isolation: "isolate" }} />
      {/* whisper-thin neutral wash so it reads as glass, not a hole */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, borderRadius: 999, background: h ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)", transition: `background .5s ${SPRING}` }} />

      {/* SHINING EDGE — white gradient border ring */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          borderRadius: 999,
          padding: 1.5,
          background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.18) 28%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.24) 70%, rgba(255,255,255,0.9) 100%)",
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          pointerEvents: "none",
        }}
      />
      {/* thin top sheen */}
      <div style={{ position: "absolute", top: 0, left: "8%", right: "8%", height: "42%", zIndex: 2, borderRadius: 999, background: "linear-gradient(180deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.05) 70%, transparent)", pointerEvents: "none" }} />
      {/* neutral inner rim highlight */}
      <div style={{ position: "absolute", inset: 0, zIndex: 2, borderRadius: 999, boxShadow: "inset 0 1px 1.5px rgba(255,255,255,0.75), inset 0 -1px 2px rgba(255,255,255,0.28)", pointerEvents: "none" }} />

      {/* specular streak — sweeps across on hover */}
      <div style={{ position: "absolute", inset: 0, zIndex: 2, borderRadius: 999, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "-40%", left: h ? "115%" : "-45%", width: "45%", height: "180%", transform: "rotate(18deg)", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)", filter: "blur(5px)", transition: "left .85s ease" }} />
      </div>

      <span style={{ position: "relative", zIndex: 3, display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", padding: "0 26px", color: "#fff", fontWeight: 600, letterSpacing: "-0.01em", textAlign: "center", whiteSpace: "nowrap" }}>
        {children}
      </span>
    </div>
  );

  return href ? (
    <a href={href} style={{ display: "inline-block", textDecoration: "none" }}>{inner}</a>
  ) : inner;
}
