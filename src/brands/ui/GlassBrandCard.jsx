"use client";

// Liquid-glass brand card — adapted from the provided shadcn/Tailwind/TS
// `glass-card.tsx` to plain JSX. Keeps the 3D-tilt-on-hover, frosted inner
// panel and floating depth circles, themed per brand with the brand image
// showing through the glass. Clicking routes to the brand page.
import React, { useState } from "react";
import { Wordmark } from "./Wordmark";

export function GlassBrandCard({ brand, image, isMobile }) {
  const t = brand.theme;
  const [hover, setHover] = useState(false);
  const go = () => { window.location.hash = `#/${brand.slug}`; };

  const W = isMobile ? "min(86vw, 360px)" : "clamp(240px, 24vw, 300px)";
  const H = isMobile ? 240 : 380;

  return (
    <a
      href={`#/${brand.slug}`}
      onClick={(e) => { e.preventDefault(); go(); }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ display: "block", textDecoration: "none", width: W, height: H, perspective: 1000, flex: "0 0 auto" }}
    >
      <div
        style={{
          position: "relative",
          height: "100%",
          borderRadius: 42,
          transformStyle: "preserve-3d",
          transform: hover ? "rotate3d(1,1,0,22deg)" : "none",
          transition: "transform .55s ease, box-shadow .55s ease",
          boxShadow: hover
            ? `${t.accent}33 24px 40px 22px -34px, rgba(20,30,60,0.18) 0 22px 28px 0`
            : "rgba(20,30,60,0.14) 0 18px 40px -12px",
          background: `linear-gradient(160deg, ${t.accent}22, ${t.deep}22)`,
        }}
      >
        {/* brand image showing through the glass */}
        <div style={{ position: "absolute", inset: 8, borderRadius: 36, overflow: "hidden", transform: "translate3d(0,0,4px)" }}>
          <img src={image} alt={brand.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: hover ? 0.9 : 0.75, transition: "opacity .5s" }} />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${t.deep}55 0%, ${t.deep}22 40%, ${t.deep}cc 100%)` }} />
        </div>

        {/* frosted glass panel */}
        <div
          style={{
            position: "absolute",
            inset: 8,
            borderRadius: 40,
            borderBottom: "1px solid rgba(255,255,255,0.28)",
            borderLeft: "1px solid rgba(255,255,255,0.28)",
            background: "linear-gradient(to bottom, rgba(255,255,255,0.22), rgba(255,255,255,0.06))",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            transform: "translate3d(0,0,25px)",
          }}
        />

        {/* wordmark */}
        <div style={{ position: "absolute", left: 24, right: 62, top: 30, transform: "translate3d(0,0,50px)", textAlign: "left" }}>
          <Wordmark text={brand.wordmark.text} transform={brand.wordmark.transform} color="#ffffff" style={{ fontSize: "clamp(1.35rem, 1.7vw, 1.75rem)", textShadow: `0 2px 18px ${t.accent}` }} />
        </div>

        {/* explore */}
        <div style={{ position: "absolute", bottom: 26, left: 26, right: 26, display: "flex", alignItems: "center", justifyContent: "space-between", transform: "translate3d(0,0,52px)" }}>
          <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#fff" }}>Explore</span>
          <span
            style={{
              display: "grid",
              placeContent: "center",
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "#fff",
              color: t.accent,
              fontSize: 16,
              boxShadow: "rgba(0,0,0,0.3) 0 7px 12px -5px",
              transform: hover ? "translate3d(0,0,14px)" : "none",
              transition: "transform .4s",
            }}
          >
            →
          </span>
        </div>

        {/* floating depth circles */}
        <div style={{ position: "absolute", top: 0, right: 0, transformStyle: "preserve-3d" }}>
          {[
            { size: 150, pos: 10, z: 20 },
            { size: 120, pos: 12, z: 40 },
            { size: 90, pos: 18, z: 60 },
            { size: 60, pos: 24, z: 80 },
          ].map((c, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: c.size,
                height: c.size,
                top: c.pos,
                right: c.pos,
                borderRadius: "50%",
                background: `${t.accentBright}1f`,
                boxShadow: "rgba(100,110,130,0.2) -10px 10px 20px 0px",
                transform: `translate3d(0,0,${c.z}px)`,
                transition: "transform .5s",
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              top: 28,
              right: 28,
              display: "grid",
              placeContent: "center",
              width: 46,
              height: 46,
              borderRadius: "50%",
              background: "#fff",
              boxShadow: "rgba(100,110,130,0.2) -10px 10px 20px 0px",
              transform: hover ? "translate3d(0,0,120px)" : "translate3d(0,0,100px)",
              transition: "transform .5s",
              color: t.accent,
              fontWeight: 900,
              fontSize: 18,
            }}
          >
            {brand.name[0]}
          </div>
        </div>
      </div>
    </a>
  );
}
