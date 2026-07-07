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
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.14, ease: "easeOut" }}
          exit={{ opacity: 0, y: -22, x: 22, filter: "blur(6px)", scale: 1.4, position: "absolute", transition: { duration: 0.14, ease: "easeIn" } }}
          style={{ display: "inline-block", whiteSpace: "nowrap", fontWeight: 700 }}
        >
          {word.split("").map((letter, letterIndex) => (
            <motion.span
              key={word + letterIndex}
              initial={{ opacity: 0, y: 6, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: letterIndex * 0.015, duration: 0.12 }}
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
