"use client";

// Port of text-block-animation.tsx to JSX (useEffect instead of @gsap/react).
// SplitText breaks the content into lines; a coloured block wipes across each
// line (left→right), the line fades in behind it, then the block wipes out to
// the right — staggered per line. SplitText + ScrollTrigger ship with GSAP 3.13+.
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

export default function TextBlockAnimation({
  children,
  animateOnScroll = true,
  delay = 0,
  blockColor = "#000",
  stagger = 0.1,
  duration = 0.6,
  style,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let split;
    const ctx = gsap.context(() => {
      split = new SplitText(el, { type: "lines", linesClass: "block-line-parent" });
      const blocks = [];
      split.lines.forEach((line) => {
        const wrapper = document.createElement("div");
        wrapper.style.position = "relative";
        wrapper.style.display = "block";
        wrapper.style.overflow = "hidden";
        const block = document.createElement("div");
        Object.assign(block.style, {
          position: "absolute", top: "0", left: "0", width: "100%", height: "100%",
          backgroundColor: blockColor, zIndex: "2", transform: "scaleX(0)", transformOrigin: "left center",
        });
        line.parentNode.insertBefore(wrapper, line);
        wrapper.appendChild(line);
        wrapper.appendChild(block);
        gsap.set(line, { opacity: 0 });
        blocks.push(block);
      });

      const tl = gsap.timeline({
        defaults: { ease: "expo.inOut" },
        scrollTrigger: animateOnScroll ? { trigger: el, start: "top 85%", toggleActions: "play none none reverse" } : null,
        delay,
      });
      tl.to(blocks, { scaleX: 1, duration, stagger, transformOrigin: "left center" })
        .set(split.lines, { opacity: 1, stagger }, `<${duration / 2}`)
        .to(blocks, { scaleX: 0, duration, stagger, transformOrigin: "right center" }, `<${duration * 0.4}`);
    }, el);

    return () => { ctx.revert(); };
  }, [animateOnScroll, delay, blockColor, stagger, duration]);

  return (
    <div ref={containerRef} style={{ position: "relative", ...style }}>
      {children}
    </div>
  );
}
