"use client";

// A line of copy where the three brand names are interactive liquid-glass chips
// (the same clear glass as our buttons). Hovering a name runs the hyper-text
// "decryption" scramble; clicking it routes to that brand's landing page. The
// rest of the line dims while a name is hovered. Replaces the three pill panels.
import React, { useEffect, useRef, useState } from "react";
import { BRANDS } from "../brands";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+";
const SCRAMBLE_SPEED = 12;
const CYCLES = 3;
const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";

function BrandChip({ brand, dimmed, onHoverStart, onHoverEnd }) {
  const t = brand.theme;
  const target = brand.name;
  const [display, setDisplay] = useState(target);
  const [hover, setHover] = useState(false);
  const ref = useRef(null);

  useEffect(() => () => { if (ref.current) clearInterval(ref.current); }, []);

  const scramble = () => {
    let pos = 0;
    if (ref.current) clearInterval(ref.current);
    ref.current = setInterval(() => {
      const s = target
        .split("")
        .map((ch, i) => (pos / CYCLES > i ? ch : CHARS[Math.floor(Math.random() * CHARS.length)]))
        .join("");
      setDisplay(s);
      pos++;
      if (pos >= target.length * CYCLES) { clearInterval(ref.current); ref.current = null; setDisplay(target); }
    }, SCRAMBLE_SPEED);
  };
  const stop = () => { if (ref.current) clearInterval(ref.current); ref.current = null; setDisplay(target); };

  const go = () => { window.location.hash = `#/${brand.slug}`; };

  return (
    <a
      href={`#/${brand.slug}`}
      onClick={(e) => { e.preventDefault(); go(); }}
      onMouseEnter={() => { setHover(true); onHoverStart(); scramble(); }}
      onMouseLeave={() => { setHover(false); onHoverEnd(); stop(); }}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        overflow: "hidden",
        padding: "4px 15px",
        margin: "0 7px",
        textDecoration: "none",
        cursor: "pointer",
        verticalAlign: "middle",
        transform: hover ? "translateY(-3px) scale(1.08)" : "none",
        opacity: dimmed && !hover ? 0.4 : 1,
        filter: dimmed && !hover ? "blur(1.5px)" : "none",
        boxShadow: hover ? `0 12px 26px rgba(0,0,0,0.4), 0 0 28px ${t.accent}66` : "0 6px 16px rgba(0,0,0,0.3)",
        transition: `transform .4s ${SPRING}, box-shadow .4s ${SPRING}, opacity .35s ease, filter .35s ease`,
      }}
    >
      {/* clear refracting glass base */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, borderRadius: 12, backdropFilter: "blur(6px) saturate(160%)", WebkitBackdropFilter: "blur(6px) saturate(160%)", filter: "url(#glass-distortion)", isolation: "isolate" }} />
      {/* whisper wash */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, borderRadius: 12, background: hover ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)", transition: "background .4s" }} />
      {/* shining edge */}
      <div style={{ position: "absolute", inset: 0, zIndex: 2, borderRadius: 12, padding: 1.2, background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.15) 40%, rgba(255,255,255,0) 55%, rgba(255,255,255,0.7) 100%)", WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude", pointerEvents: "none" }} />
      {/* top sheen */}
      <div style={{ position: "absolute", top: 0, left: "8%", right: "8%", height: "46%", zIndex: 2, borderRadius: 12, background: "linear-gradient(180deg, rgba(255,255,255,0.42), transparent)", pointerEvents: "none" }} />

      <span style={{ position: "relative", zIndex: 3, fontFamily: "'SF Mono', ui-monospace, Menlo, Consolas, monospace", fontWeight: 700, fontSize: "0.92em", letterSpacing: "0.02em", color: hover ? "#ffffff" : t.accentBright, textTransform: brand.wordmark.transform === "lowercase" ? "lowercase" : "uppercase", textShadow: `0 1px 14px ${t.accent}`, whiteSpace: "nowrap", transition: "color .3s" }}>
        {display}
      </span>
    </a>
  );
}

export function HyperBrandLine({ style }) {
  const B = BRANDS;
  const [hovered, setHovered] = useState(false);
  const on = () => setHovered(true);
  const off = () => setHovered(false);
  const dim = hovered;
  const norm = (txt, key) => (
    <span key={key} style={{ opacity: dim ? 0.4 : 0.92, filter: dim ? "blur(1px)" : "none", transition: "opacity .35s ease, filter .35s ease" }}>{txt}</span>
  );

  return (
    <div style={{ textAlign: "center", maxWidth: "min(920px, 92vw)", margin: "0 auto", color: "#ffffff", fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 300, lineHeight: 2, fontSize: "clamp(1.35rem, 3vw, 2.5rem)", letterSpacing: "-0.01em", textShadow: "0 2px 24px rgba(0,0,0,0.5)", ...style }}>
      {norm("Driving innovation and future with ", "a")}
      <BrandChip brand={B.changan} dimmed={dim} onHoverStart={on} onHoverEnd={off} />
      {norm(", ", "b")}
      <BrandChip brand={B.deepal} dimmed={dim} onHoverStart={on} onHoverEnd={off} />
      {norm(" and ", "c")}
      <BrandChip brand={B.nevo} dimmed={dim} onHoverStart={on} onHoverEnd={off} />
      {norm(".", "d")}
    </div>
  );
}
