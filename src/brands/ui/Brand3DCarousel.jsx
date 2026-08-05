"use client";

// A 3D horizontal coverflow of the brand's images with the description text.
// Auto-advances through the images; the centre card faces the viewer while the
// neighbours rotate back in 3D. Meant to slide in from the right.
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useViewport } from "../useViewport";

export function Brand3DCarousel({ brand, active }) {
  const t = brand.theme;
  const { isMobile } = useViewport();
  const imgs = useMemo(() => (brand.description?.images || []).map((i) => i.src), [brand]);
  const n = imgs.length;
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!active || n === 0) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % n), 2600);
    return () => clearInterval(id);
  }, [active, n]);

  const cardW = isMobile ? 240 : 380;
  const cardH = isMobile ? 160 : 250;
  const spacing = isMobile ? 62 : 46; // percent of card width per step

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: isMobile ? 24 : 36 }}>
      <div style={{ position: "relative", width: cardW, height: cardH, perspective: 1500 }}>
        <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
          {imgs.map((src, i) => {
            let off = i - idx;
            if (off > n / 2) off -= n;
            if (off < -n / 2) off += n;
            const abs = Math.abs(off);
            const hidden = abs > 2;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 16,
                  overflow: "hidden",
                  transformStyle: "preserve-3d",
                  transform: `translateX(${off * spacing}%) translateZ(${-abs * 210}px) rotateY(${-off * 40}deg)`,
                  opacity: hidden ? 0 : 1 - abs * 0.22,
                  zIndex: 20 - abs,
                  boxShadow: abs === 0 ? `0 30px 60px rgba(0,0,0,0.5), 0 0 44px ${t.accent}44` : "0 16px 34px rgba(0,0,0,0.4)",
                  border: "1px solid rgba(255,255,255,0.16)",
                  transition: "transform .8s cubic-bezier(0.22,1,0.36,1), opacity .8s ease, box-shadow .8s ease",
                  pointerEvents: hidden ? "none" : "auto",
                }}
              >
                <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: abs === 0 ? "none" : "brightness(0.62)", transition: "filter .8s ease" }} />
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ maxWidth: "min(680px, 90vw)", textAlign: "center", color: "#fff" }}>
        <div style={{ fontSize: 12, letterSpacing: "0.4em", textTransform: "uppercase", color: t.accentBright, fontWeight: 600, marginBottom: 12 }}>
          {brand.description?.eyebrow}
        </div>
        <h2 style={{ margin: 0, fontFamily: '"AVATR", "Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 300, fontSize: "clamp(1.5rem, 3.6vw, 2.6rem)", lineHeight: 1.1, letterSpacing: "-0.02em", textShadow: "0 2px 24px rgba(0,0,0,0.55)" }}>
          {brand.description?.headline}
        </h2>
        {!isMobile && brand.description?.body && (
          <p style={{ margin: "16px auto 0", maxWidth: "52ch", fontSize: "1rem", lineHeight: 1.6, fontWeight: 300, color: "rgba(255,255,255,0.8)" }}>
            {brand.description.body}
          </p>
        )}
      </div>
    </div>
  );
}
