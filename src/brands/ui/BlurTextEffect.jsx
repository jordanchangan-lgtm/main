"use client";

// Port of blur-text-effect.tsx to JSX. GSAP-staggers each character from
// blurred/below into place. Characters are grouped per word (word = inline-block
// nowrap) so long paragraphs still wrap normally without breaking words apart.
// Re-runs when the text changes. Styling comes from the parent via `style`.
import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export function BlurTextEffect({ children, className = "", style, delay = 0 }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const chars = ref.current.querySelectorAll("span.char");
    gsap.set(chars, { opacity: 0, y: 10, filter: "blur(8px)" });
    const anim = gsap.to(chars, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.3,
      ease: "power2.out",
      stagger: 0.015,
      delay,
      clearProps: "filter",
    });
    return () => anim.kill();
  }, [children, delay]);

  const words = String(children).split(" ");

  return (
    <span className={className} ref={ref} style={{ display: "inline", ...style }}>
      {words.map((word, wi) => (
        <React.Fragment key={wi}>
          <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
            {word.split("").map((ch, ci) => (
              <span key={ci} className="char" style={{ display: "inline-block" }}>{ch}</span>
            ))}
          </span>
          {wi < words.length - 1 ? " " : null}
        </React.Fragment>
      ))}
    </span>
  );
}
