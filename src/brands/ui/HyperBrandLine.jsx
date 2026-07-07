"use client";

// Three-line monospace bio (in the spirit of the hyper-text demo). Non-brand
// text is dark grey; the three brand names are highlighted in the same blue and
// placed at different spots across the three lines. By default they are only
// coloured — on hover a liquid-glass square fades in behind the name, the
// letters run the decrypt scramble, the name lifts and the rest dims. Click
// routes to the brand's landing page.
import React, { useEffect, useRef, useState } from "react";
import { BRANDS } from "../brands";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+";
const SCRAMBLE_SPEED = 12;
const CYCLES = 3;
const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";
const BLUE = "#2563eb";
const INK = "#1f2937";

function BrandWord({ brand, dimmed, onHoverStart, onHoverEnd }) {
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

  return (
    <a
      href={`#/${brand.slug}`}
      onClick={(e) => { e.preventDefault(); window.location.hash = `#/${brand.slug}`; }}
      onMouseEnter={() => { setHover(true); onHoverStart(); scramble(); }}
      onMouseLeave={() => { setHover(false); onHoverEnd(); stop(); }}
      style={{
        position: "relative",
        display: "inline-block",
        textDecoration: "none",
        cursor: "pointer",
        opacity: dimmed && !hover ? 0.3 : 1,
        filter: dimmed && !hover ? "blur(1.4px)" : "none",
        transform: hover ? "translateY(-3px) scale(1.05)" : "none",
        transition: `transform .4s ${SPRING}, opacity .35s ease, filter .35s ease`,
      }}
    >
      {/* liquid-glass square — fades in on hover only */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: "-4px -14px",
          borderRadius: 12,
          zIndex: 0,
          overflow: "hidden",
          opacity: hover ? 1 : 0,
          transform: hover ? "scale(1)" : "scale(0.86)",
          transition: "opacity .28s ease, transform .28s ease",
          pointerEvents: "none",
          boxShadow: hover ? "0 12px 30px rgba(37,99,235,0.22), 0 4px 10px rgba(0,0,0,0.12)" : "none",
        }}
      >
        <span style={{ position: "absolute", inset: 0, borderRadius: 12, backdropFilter: "blur(7px) saturate(140%)", WebkitBackdropFilter: "blur(7px) saturate(140%)", filter: "url(#glass-distortion)" }} />
        <span style={{ position: "absolute", inset: 0, borderRadius: 12, background: "rgba(255,255,255,0.35)" }} />
        <span style={{ position: "absolute", inset: 0, borderRadius: 12, padding: 1.2, background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(37,99,235,0.25) 45%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.85) 100%)", WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} />
        <span style={{ position: "absolute", top: 0, left: "8%", right: "8%", height: "46%", borderRadius: 12, background: "linear-gradient(180deg, rgba(255,255,255,0.7), transparent)" }} />
      </span>

      <span style={{ position: "relative", zIndex: 1, color: BLUE, fontWeight: 600, whiteSpace: "nowrap" }}>
        {display}
      </span>
    </a>
  );
}

export function HyperBrandParagraph({ style }) {
  const B = BRANDS;
  const [hovered, setHovered] = useState(false);
  const on = () => setHovered(true);
  const off = () => setHovered(false);
  const dim = hovered;

  const txt = (s, key) => (
    <span key={key} style={{ opacity: dim ? 0.32 : 1, transition: "opacity .35s ease" }}>{s}</span>
  );
  const chip = (slug) => <BrandWord key={slug} brand={B[slug]} dimmed={dim} onHoverStart={on} onHoverEnd={off} />;

  const Line = ({ children }) => (
    <div style={{ whiteSpace: "pre-wrap" }}>{children}</div>
  );

  return (
    <div
      style={{
        maxWidth: "min(900px, 92vw)",
        margin: "0 auto",
        textAlign: "left",
        fontFamily: "'SF Mono', ui-monospace, Menlo, Consolas, monospace",
        fontWeight: 500,
        color: INK,
        fontSize: "clamp(1.25rem, 3.2vw, 2.35rem)",
        lineHeight: 1.75,
        letterSpacing: "-0.01em",
        ...style,
      }}
    >
      <Line>{chip("changan")}{txt(" drives innovation forward,", "a")}</Line>
      <Line>{txt("with intelligence from ", "b")}{chip("deepal")}{txt(",", "c")}</Line>
      <Line>{chip("nevo")}{txt(" opens the new-energy era.", "d")}</Line>
    </div>
  );
}
