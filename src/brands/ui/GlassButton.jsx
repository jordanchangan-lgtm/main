"use client";

// A modern liquid-glass pill. The reference glass-button.tsx relied on external
// .glass-button CSS (not shipped); this recreates that look in JSX + inline
// styles and keeps the same signature detail — a bright **shining edge** — plus
// a smoother glass body: backdrop blur+saturate, the #glass-distortion
// refraction, a soft top sheen, a specular streak that sweeps on hover, and a
// blurred coloured shadow beneath.
import React, { useState } from "react";

const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";

export function GlassButton({ children, accent = "#12A5F4", href, onClick, style }) {
  const [h, setH] = useState(false);

  const inner = (
    <div style={{ position: "relative", display: "inline-block", ...style }}>
      {/* blurred coloured shadow / glow beneath (the .glass-button-shadow) */}
      <div
        style={{
          position: "absolute",
          left: "8%",
          right: "8%",
          bottom: h ? -14 : -8,
          height: "70%",
          borderRadius: 999,
          background: accent,
          opacity: h ? 0.5 : 0.28,
          filter: "blur(22px)",
          transform: h ? "scale(1.04)" : "scale(0.96)",
          transition: `all .55s ${SPRING}`,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <div
        onClick={onClick}
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        style={{
          position: "relative",
          zIndex: 1,
          isolation: "isolate",
          borderRadius: 999,
          overflow: "hidden",
          cursor: "pointer",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: h ? "translateY(-4px) scale(1.045)" : "none",
          boxShadow: h
            ? `0 18px 42px rgba(0,0,0,0.4), 0 0 46px ${accent}44`
            : "0 10px 26px rgba(0,0,0,0.3)",
          transition: `transform .55s ${SPRING}, box-shadow .55s ${SPRING}`,
        }}
      >
        {/* clear refracting glass base — blurs, brightens & bends whatever is
            behind it (the ocean), iOS liquid-glass style. Almost no fill. */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, borderRadius: 999, backdropFilter: "blur(9px) saturate(200%) brightness(1.12)", WebkitBackdropFilter: "blur(9px) saturate(200%) brightness(1.12)", filter: "url(#glass-distortion)", isolation: "isolate" }} />
        {/* whisper-thin wash so it reads as glass, not a hole */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1, borderRadius: 999, background: h ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.05)", transition: `background .5s ${SPRING}` }} />

        {/* SHINING EDGE — a gradient border ring, bright where light catches it */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            borderRadius: 999,
            padding: 1.5,
            background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.2) 26%, rgba(255,255,255,0) 48%, rgba(255,255,255,0.28) 68%, rgba(255,255,255,0.9) 100%)",
            WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            pointerEvents: "none",
          }}
        />
        {/* top sheen */}
        <div style={{ position: "absolute", top: 0, left: "7%", right: "7%", height: "48%", zIndex: 2, borderRadius: 999, background: "linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.08) 65%, transparent)", pointerEvents: "none" }} />
        {/* inner rim + faint accent underglow (kept light so glass stays clear) */}
        <div style={{ position: "absolute", inset: 0, zIndex: 2, borderRadius: 999, boxShadow: `inset 0 1px 1.5px rgba(255,255,255,0.75), inset 0 -8px 18px ${accent}14`, pointerEvents: "none" }} />

        {/* specular streak — sweeps across on hover */}
        <div style={{ position: "absolute", inset: 0, zIndex: 2, borderRadius: 999, overflow: "hidden", pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "-40%", left: h ? "115%" : "-45%", width: "45%", height: "180%", transform: "rotate(18deg)", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)", filter: "blur(5px)", transition: "left .85s ease" }} />
        </div>

        <span style={{ position: "relative", zIndex: 3, display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", padding: "0 26px", color: "#fff", fontWeight: 600, letterSpacing: "-0.01em", textAlign: "center", whiteSpace: "nowrap" }}>
          {children}
        </span>
      </div>
    </div>
  );

  return href ? (
    <a href={href} style={{ display: "inline-block", textDecoration: "none" }}>{inner}</a>
  ) : inner;
}
