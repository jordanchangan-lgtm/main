"use client";

// Port of special-text.tsx (JSX, no tailwind / motion). A "decode" scramble:
// phase 1 fills the word with random glyphs, phase 2 resolves it left-to-right
// into the real text. Controlled by `text` — it re-runs the scramble whenever
// the word changes. Monospace keeps the glyph width stable during the churn.
import React, { useEffect, useRef, useState } from "react";

const RANDOM_CHARS = "_!X$0-+*#";
function getRandomChar(prev) {
  let c;
  do {
    c = RANDOM_CHARS[Math.floor(Math.random() * RANDOM_CHARS.length)];
  } while (c === prev);
  return c;
}

export function SpecialText({ text, speed = 18, className = "", style }) {
  const [display, setDisplay] = useState(text);
  const intervalRef = useRef(null);

  useEffect(() => {
    let phase = "phase1";
    let step = 0;
    const len = text.length;
    setDisplay(" ".repeat(len));

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (phase === "phase1") {
        const maxSteps = len * 2;
        const currentLength = Math.min(step + 1, len);
        const chars = [];
        for (let i = 0; i < currentLength; i++) chars.push(getRandomChar(i > 0 ? chars[i - 1] : undefined));
        for (let i = currentLength; i < len; i++) chars.push(" ");
        setDisplay(chars.join(""));
        if (step < maxSteps - 1) step++;
        else { phase = "phase2"; step = 0; }
      } else {
        const revealed = Math.floor(step / 2);
        const chars = [];
        for (let i = 0; i < revealed && i < len; i++) chars.push(text[i]);
        if (revealed < len) chars.push(step % 2 === 0 ? "_" : getRandomChar());
        for (let i = chars.length; i < len; i++) chars.push(getRandomChar());
        setDisplay(chars.join(""));
        if (step < len * 2 - 1) step++;
        else {
          setDisplay(text);
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, speed);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [text, speed]);

  return (
    <span
      className={className}
      style={{ fontFamily: "'SF Mono', ui-monospace, 'Menlo', 'Consolas', monospace", display: "inline-block", whiteSpace: "pre", ...style }}
    >
      {display}
    </span>
  );
}
