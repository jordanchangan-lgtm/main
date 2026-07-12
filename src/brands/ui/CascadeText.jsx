"use client";

// Word-swap headline effect. Two variants:
//   "cascade" — each character rolls up/out while the next rolls up into place,
//               staggered left-to-right (port of cascade-text.tsx).
//   "fade"    — the whole word crossfades to the next one.
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

function split(text) {
  if (typeof Intl !== "undefined" && Intl.Segmenter) {
    const seg = new Intl.Segmenter("en", { granularity: "grapheme" });
    return Array.from(seg.segment(text), (s) => s.segment);
  }
  return [...text];
}

export function CascadeText({
  text,
  color = "inherit",
  fontSize = "inherit",
  staggerDelay = 0.035,
  duration = 0.42,
  direction = "up",
  variant = "cascade", // "cascade" (per-char roll) | "fade" (crossfade)
  style,
}) {
  const chars = React.useMemo(() => split(text), [text]);
  const sign = direction === "up" ? 1 : -1;

  const base = {
    position: "relative",
    display: "inline-flex",
    color,
    fontSize,
    lineHeight: 1,
    whiteSpace: "pre",
    ...style,
  };

  // Simple crossfade: the old word fades out while the new fades in.
  if (variant === "fade") {
    return (
      <span aria-label={text} style={base}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={text}
            style={{ display: "inline-flex" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
          >
            {text}
          </motion.span>
        </AnimatePresence>
      </span>
    );
  }

  return (
    <span aria-label={text} style={base}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={text} style={{ display: "inline-flex" }} aria-hidden="true">
          {chars.map((c, i) => (
            <span
              key={i}
              style={{ display: "inline-block", overflow: "hidden", height: "1em", lineHeight: 1 }}
            >
              <motion.span
                style={{ display: "inline-block", willChange: "transform" }}
                initial={{ y: `${sign * 105}%` }}
                animate={{ y: "0%" }}
                exit={{ y: `${-sign * 105}%` }}
                transition={{ duration, ease: EASE, delay: i * staggerDelay }}
              >
                {c === " " ? " " : c}
              </motion.span>
            </span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
