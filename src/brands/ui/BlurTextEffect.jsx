"use client";

// Port of blur-text-effect.tsx to JSX. Splits the string into characters and
// GSAP-staggers each one from blurred/below into place. Re-runs when the text
// changes. Styling (font, colour, tracking) comes from the parent via `style`.
import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export function BlurTextEffect({ children, className = "", style, delay = 0 }) {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const chars = containerRef.current.querySelectorAll("span.char");
    gsap.set(chars, { opacity: 0, y: 10, filter: "blur(8px)" });
    gsap.to(chars, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.3,
      ease: "power2.out",
      stagger: 0.015,
      delay,
      clearProps: "filter",
    });
  }, [children, delay]);

  return (
    <span className={className} ref={containerRef} style={{ display: "inline-block", ...style }}>
      {String(children).split("").map((char, i) => (
        <span key={`${char}-${i}`} className="char" style={{ display: "inline-block", whiteSpace: "pre" }}>
          {char === " " ? " " : char}
        </span>
      ))}
    </span>
  );
}
