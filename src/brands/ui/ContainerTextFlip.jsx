"use client";

// Port of container-text-flip.tsx to JSX + inline styles — WITHOUT the panel
// (no gradient box / shadow), just the effect: the word cycles on an interval
// and each letter reveals with a blur→clear fade, staggered left-to-right, while
// the word's width morphs smoothly.
import React, { useState, useEffect, useId, useRef } from "react";
import { motion } from "framer-motion";

export function ContainerTextFlip({
  words = ["better", "modern", "beautiful", "awesome"],
  interval = 3000,
  index, // when provided, the word is CONTROLLED externally (no auto-cycle)
  animationDuration = 700,
  style,
  textStyle,
}) {
  const id = useId();
  const controlled = index != null;
  const [autoIndex, setAutoIndex] = useState(0);
  const currentWordIndex = controlled ? index % words.length : autoIndex;
  const [width, setWidth] = useState(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) setWidth(textRef.current.scrollWidth + 6);
  }, [currentWordIndex]);

  useEffect(() => {
    if (controlled) return;
    const intervalId = setInterval(() => {
      setAutoIndex((p) => (p + 1) % words.length);
    }, interval);
    return () => clearInterval(intervalId);
  }, [controlled, words, interval]);

  const word = words[currentWordIndex];

  return (
    <motion.span
      layout
      layoutId={`words-here-${id}`}
      animate={width != null ? { width } : undefined}
      transition={{ duration: animationDuration / 2000 }}
      key={word}
      style={{ position: "relative", display: "inline-block", textAlign: "center", ...style }}
    >
      <motion.span
        ref={textRef}
        transition={{ duration: animationDuration / 1000, ease: "easeInOut" }}
        style={{ display: "inline-block", whiteSpace: "nowrap", ...textStyle }}
        layoutId={`word-div-${word}-${id}`}
      >
        {word.split("").map((letter, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ delay: index * 0.02 }}
            style={{ display: "inline-block", whiteSpace: "pre" }}
          >
            {letter === " " ? " " : letter}
          </motion.span>
        ))}
      </motion.span>
    </motion.span>
  );
}
