"use client";

// A liquid-glass pill button in the spirit of the provided glass-button.tsx
// (the reference relied on external .glass-button CSS). Rounded-full glass with
// bright rim, top sheen and the #glass-distortion refraction of whatever is
// behind it; springy morph on hover.
import React, { useState } from "react";

const SPRING = "cubic-bezier(0.175, 0.885, 0.32, 2.2)";

export function GlassButton({ children, accent = "#12A5F4", href, onClick, minWidth, style }) {
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
        minWidth,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: h
          ? `0 16px 32px rgba(0,0,0,0.3), 0 0 40px ${accent}66`
          : "0 8px 20px rgba(0,0,0,0.25)",
        transform: h ? "translateY(-4px) scale(1.06)" : "none",
        transition: `transform .6s ${SPRING}, box-shadow .6s ${SPRING}`,
        ...style,
      }}
    >
      {/* refracting glass */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, borderRadius: 999, backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)", filter: "url(#glass-distortion)", isolation: "isolate" }} />
      {/* light wash */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, borderRadius: 999, background: h ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)", transition: `background .6s ${SPRING}` }} />
      {/* bright rim */}
      <div style={{ position: "absolute", inset: 0, zIndex: 2, borderRadius: 999, boxShadow: "inset 0 1.5px 1px 0 rgba(255,255,255,0.85), inset 0 -1.5px 2px 1px rgba(255,255,255,0.4)" }} />
      {/* top sheen */}
      <div style={{ position: "absolute", top: 0, left: "6%", right: "6%", height: "52%", zIndex: 2, borderRadius: 999, background: "linear-gradient(180deg, rgba(255,255,255,0.5), rgba(255,255,255,0.05) 70%, transparent)", pointerEvents: "none" }} />

      <span style={{ position: "relative", zIndex: 3, display: "block", padding: "18px 34px", color: "#fff", fontWeight: 600, letterSpacing: "-0.01em", textAlign: "center", whiteSpace: "nowrap" }}>
        {children}
      </span>
    </div>
  );

  return href ? (
    <a href={href} style={{ display: "inline-block", textDecoration: "none" }}>{inner}</a>
  ) : inner;
}
