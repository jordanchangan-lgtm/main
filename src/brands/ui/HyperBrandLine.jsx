"use client";

// A longer paragraph about the group. The three brand names each sit alone on
// their own line at a different horizontal position. By default they are simply
// highlighted in their brand accent colour; on hover a liquid-glass square fades
// in behind the name, the letters run the hyper-text decrypt scramble, and the
// rest of the paragraph dims. Clicking a name routes to its landing page.
import React, { useEffect, useRef, useState } from "react";
import { BRANDS } from "../brands";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+";
const SCRAMBLE_SPEED = 12;
const CYCLES = 3;
const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";

function BrandWord({ brand, dimmed, onHoverStart, onHoverEnd }) {
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
        opacity: dimmed && !hover ? 0.32 : 1,
        filter: dimmed && !hover ? "blur(1.5px)" : "none",
        transform: hover ? "translateY(-3px) scale(1.06)" : "none",
        transition: `transform .4s ${SPRING}, opacity .35s ease, filter .35s ease`,
      }}
    >
      {/* liquid-glass square — only fades in on hover */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: "-6px -16px",
          borderRadius: 14,
          zIndex: 0,
          overflow: "hidden",
          opacity: hover ? 1 : 0,
          transform: hover ? "scale(1)" : "scale(0.86)",
          transition: "opacity .3s ease, transform .3s ease",
          pointerEvents: "none",
          boxShadow: hover ? `0 12px 30px rgba(0,0,0,0.42), 0 0 30px ${t.accent}66` : "none",
        }}
      >
        <span style={{ position: "absolute", inset: 0, borderRadius: 14, backdropFilter: "blur(6px) saturate(160%)", WebkitBackdropFilter: "blur(6px) saturate(160%)", filter: "url(#glass-distortion)" }} />
        <span style={{ position: "absolute", inset: 0, borderRadius: 14, background: "rgba(255,255,255,0.10)" }} />
        <span style={{ position: "absolute", inset: 0, borderRadius: 14, padding: 1.2, background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.15) 40%, rgba(255,255,255,0) 55%, rgba(255,255,255,0.7) 100%)", WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} />
        <span style={{ position: "absolute", top: 0, left: "8%", right: "8%", height: "46%", borderRadius: 14, background: "linear-gradient(180deg, rgba(255,255,255,0.42), transparent)" }} />
      </span>

      <span style={{ position: "relative", zIndex: 1, fontFamily: "'SF Mono', ui-monospace, Menlo, Consolas, monospace", fontWeight: 700, fontSize: "clamp(1.7rem, 3.6vw, 3rem)", letterSpacing: "0.02em", color: hover ? "#ffffff" : t.accentBright, textTransform: brand.wordmark.transform === "lowercase" ? "lowercase" : "uppercase", textShadow: hover ? `0 2px 20px ${t.accent}` : `0 1px 16px ${t.accent}88`, whiteSpace: "nowrap", transition: "color .3s ease" }}>
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

  const P = ({ children }) => (
    <div style={{ textAlign: "center", opacity: dim ? 0.3 : 0.9, filter: dim ? "blur(1px)" : "none", transition: "opacity .35s ease, filter .35s ease", fontSize: "clamp(1rem, 1.9vw, 1.5rem)", fontWeight: 300, color: "#ffffff", lineHeight: 1.5, letterSpacing: "0.01em" }}>
      {children}
    </div>
  );
  const BrandLine = ({ brand, justify }) => (
    <div style={{ display: "flex", justifyContent: justify, padding: "0.12em 2vw" }}>
      <BrandWord brand={brand} dimmed={dim} onHoverStart={on} onHoverEnd={off} />
    </div>
  );

  return (
    <div style={{ maxWidth: "min(880px, 92vw)", margin: "0 auto", display: "flex", flexDirection: "column", gap: "0.55em", fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', textShadow: "0 2px 26px rgba(0,0,0,0.6)", ...style }}>
      <P>Driving innovation and the future of mobility across Jordan —</P>
      <P>one group, three bold visions for how the Kingdom moves.</P>
      <BrandLine brand={B.changan} justify="flex-start" />
      <P>a storied automaker reborn as intelligent, new-energy engineering.</P>
      <BrandLine brand={B.deepal} justify="center" />
      <P>pure-electric design where advanced technology feels effortless.</P>
      <BrandLine brand={B.nevo} justify="flex-end" />
      <P>the new-energy era — connected, refined and made for everyone.</P>
    </div>
  );
}
