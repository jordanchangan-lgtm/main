"use client";

// Drag-to-confirm swipe button, ported from swipe-button.tsx to JSX and styled
// as a glass track that fits the brand hero. Drag the handle to the end to fire
// onSwipeComplete. Inline SVG icons (no lucide dependency).
import React, { useEffect, useRef, useState } from "react";

const Chevron = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg>
);
const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
);

export function SwipeButton({ onSwipeComplete, text = "Swipe to enter", accent = "#12A5F4", gap = 4, style }) {
  const [swiped, setSwiped] = useState(false);
  const [validated, setValidated] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const swipedRef = useRef(false);

  const HANDLE = 52;

  const start = (clientX) => { if (validated) return; setStartX(clientX); setDragging(true); };
  const move = (clientX) => {
    if (!buttonRef.current || !dragging || validated) return;
    const cw = containerRef.current?.offsetWidth || 0;
    const maxSwipe = cw - HANDLE - gap * 2;
    let nx = clientX - startX;
    nx = Math.max(0, Math.min(nx, maxSwipe));
    setCurrentX(nx);
    const done = nx >= maxSwipe - 8;
    setSwiped(done); swipedRef.current = done;
  };
  const end = () => {
    if (validated) return;
    if (swipedRef.current) {
      setValidated(true);
      setCurrentX(0);
      onSwipeComplete && onSwipeComplete();
    } else {
      setCurrentX(0);
      setSwiped(false);
    }
    setDragging(false);
  };

  useEffect(() => {
    const onUp = () => end();
    window.addEventListener("mouseup", onUp);
    return () => window.removeEventListener("mouseup", onUp);
  });

  return (
    <div
      ref={containerRef}
      role="button"
      aria-label={text}
      onTouchStart={(e) => start(e.touches[0].clientX)}
      onTouchMove={(e) => move(e.touches[0].clientX)}
      onTouchEnd={end}
      onMouseDown={(e) => start(e.clientX)}
      onMouseMove={(e) => move(e.clientX)}
      style={{
        position: "relative",
        height: 60,
        width: "min(90vw, 380px)",
        borderRadius: 999,
        overflow: "hidden",
        userSelect: "none",
        WebkitUserSelect: "none",
        touchAction: "none",
        background: "rgba(255,255,255,0.07)",
        backdropFilter: "blur(8px) saturate(150%)",
        WebkitBackdropFilter: "blur(8px) saturate(150%)",
        border: "1px solid rgba(255,255,255,0.28)",
        boxShadow: "inset 0 1px 1px rgba(255,255,255,0.4), 0 14px 34px rgba(0,0,0,0.35)",
        ...style,
      }}
    >
      {/* progress fill */}
      <div style={{ position: "absolute", inset: 0, borderRadius: 999, background: `linear-gradient(90deg, ${accent}55, ${accent}22)`, opacity: validated ? 1 : Math.min(currentX / 200, 0.9), transition: dragging ? "none" : "opacity .3s" }} />

      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
        <span style={{ fontSize: "clamp(0.82rem, 2.4vw, 1rem)", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: validated ? "#fff" : "rgba(255,255,255,0.82)", whiteSpace: "nowrap", padding: "0 56px", textAlign: "center" }}>
          {validated ? "Welcome" : text}
        </span>
      </div>

      <button
        ref={buttonRef}
        disabled={validated}
        aria-label={validated ? "Entered" : text}
        style={{
          position: "absolute",
          top: gap,
          left: gap,
          height: `calc(100% - ${gap * 2}px)`,
          width: validated ? `calc(100% - ${gap * 2}px)` : HANDLE,
          borderRadius: 999,
          border: "none",
          cursor: validated ? "default" : "grab",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          background: validated ? "#10b981" : accent,
          boxShadow: `0 4px 14px ${accent}66, inset 0 1px 1px rgba(255,255,255,0.4)`,
          transform: validated ? "none" : `translateX(${currentX}px)`,
          transition: dragging ? "none" : "all .35s ease",
        }}
      >
        {validated ? <CheckIcon /> : <Chevron />}
      </button>
    </div>
  );
}
