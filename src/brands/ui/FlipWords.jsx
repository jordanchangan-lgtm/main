"use client";

// Controlled port of Aceternity UI's flip-words.tsx (JSX + inline styles, no
// tailwind/cn). The original auto-cycled on an internal timer; here the parent
// drives which word is shown via the `word` prop, so the flip can be locked to
// scroll steps. The signature animation is kept: each letter blurs in with a
// stagger on enter, and the whole word lifts up-right with a blur+scale on exit.
import React from "react";
import { AnimatePresence, motion } from "framer-motion";

export function FlipWord({ word, gradient, color = "#ffffff", className, style }) {
  const letterStyle = gradient
    ? {
        display: "inline-block",
        backgroundImage: gradient,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        WebkitTextFillColor: "transparent",
      }
    : { display: "inline-block", color };

  return (
    <span style={{ position: "relative", display: "inline-block", ...style }} className={className}>
      <AnimatePresence mode="wait">
        <motion.span
          key={word}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 10 }}
          exit={{ opacity: 0, y: -40, x: 40, filter: "blur(8px)", scale: 2, position: "absolute" }}
          style={{ display: "inline-block", whiteSpace: "nowrap", fontWeight: 700 }}
        >
          {word.split("").map((letter, letterIndex) => (
            <motion.span
              key={word + letterIndex}
              initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: letterIndex * 0.05, duration: 0.25 }}
              style={letterStyle}
            >
              {letter}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
