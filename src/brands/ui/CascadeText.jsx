"use client";

// Port of cascade-text.tsx to JSX + inline styles. Each character sits in a
// 1em overflow-hidden slot; when the `text` changes, the outgoing word's
// letters roll up and out while the incoming word's letters roll up into place,
// staggered left-to-right — a "cascade" flip. Original triggered on hover; here
// it triggers on every word change so the headline word flips on its own.
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
  style,
}) {
  const chars = React.useMemo(() => split(text), [text]);
  const sign = direction === "up" ? 1 : -1;

  return (
    <span
      aria-label={text}
      style={{
        position: "relative",
        display: "inline-flex",
        color,
        fontSize,
        lineHeight: 1,
        whiteSpace: "pre",
        ...style,
      }}
    >
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
