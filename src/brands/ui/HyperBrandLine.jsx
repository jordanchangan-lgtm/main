"use client";

// Three-line monospace bio. Non-brand text is dark grey; the three brand names
// are highlighted in the same blue at different spots. On hover a liquid-glass
// square fades in behind the name, the letters run the decrypt scramble, the
// name lifts and the rest dims. Each line animates in smoothly when `show`
// flips true. Click routes to the brand's landing page.
//
// NOTE: helper elements are plain factory functions / stable motion components —
// never components defined inside render — so hovering a word does not remount
// (and reset) the interactive BrandWord state.
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { BRANDS } from "../brands";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+";
const SCRAMBLE_SPEED = 12;
const CYCLES = 3;
const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";
const EASE = [0.22, 1, 0.36, 1];
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
          inset: "-6px -16px",
          borderRadius: 14,
          zIndex: 0,
          overflow: "hidden",
          opacity: hover ? 1 : 0,
          transform: hover ? "scale(1)" : "scale(0.85)",
          transition: "opacity .28s ease, transform .28s ease",
          pointerEvents: "none",
          boxShadow: hover ? "0 18px 40px rgba(37,99,235,0.32), 0 6px 16px rgba(0,0,0,0.2)" : "none",
        }}
      >
        <span style={{ position: "absolute", inset: 0, borderRadius: 14, backdropFilter: "blur(9px) saturate(150%)", WebkitBackdropFilter: "blur(9px) saturate(150%)" }} />
        <span style={{ position: "absolute", inset: 0, borderRadius: 14, background: "linear-gradient(180deg, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.55) 100%)" }} />
        <span style={{ position: "absolute", inset: 0, borderRadius: 14, padding: 1.5, background: "linear-gradient(135deg, #ffffff 0%, rgba(37,99,235,0.55) 42%, rgba(255,255,255,0.1) 60%, #ffffff 100%)", WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} />
        <span style={{ position: "absolute", top: 0, left: "7%", right: "7%", height: "48%", borderRadius: 14, background: "linear-gradient(180deg, rgba(255,255,255,0.9), transparent)" }} />
      </span>

      <span style={{ position: "relative", zIndex: 1, color: BLUE, fontWeight: 600, whiteSpace: "nowrap" }}>
        {display}
      </span>
    </a>
  );
}

export function HyperBrandParagraph({ show = true, style }) {
  const B = BRANDS;
  const [hovered, setHovered] = useState(false);
  const on = () => setHovered(true);
  const off = () => setHovered(false);
  const dim = hovered;

  // plain factories (NOT components) — no remounting on hover re-render
  const txt = (s, key) => (
    <span key={key} style={{ opacity: dim ? 0.32 : 1, transition: "opacity .35s ease" }}>{s}</span>
  );
  const chip = (slug) => <BrandWord key={slug} brand={B[slug]} dimmed={dim} onHoverStart={on} onHoverEnd={off} />;

  const lineAnim = (i) => ({
    initial: false,
    animate: show ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 16, filter: "blur(6px)" },
    transition: { duration: 0.6, ease: EASE, delay: show ? 0.08 + i * 0.14 : 0 },
    style: { whiteSpace: "pre-wrap" },
  });

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
      <motion.div {...lineAnim(0)}>{chip("changan")}{txt(" drives innovation forward,", "a")}</motion.div>
      <motion.div {...lineAnim(1)}>{txt("with intelligence from ", "b")}{chip("deepal")}{txt(",", "c")}</motion.div>
      <motion.div {...lineAnim(2)}>{chip("nevo")}{txt(" opens the new-energy era.", "d")}</motion.div>

      <motion.div
        initial={false}
        animate={show ? { opacity: dim ? 0.25 : 0.55, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.6, ease: EASE, delay: show ? 0.55 : 0 }}
        style={{ marginTop: "1.6em", fontSize: "clamp(0.72rem, 1.3vw, 0.9rem)", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "#5b6472" }}
      >
        Hover a name to decrypt it · click to enter
      </motion.div>
    </div>
  );
}
