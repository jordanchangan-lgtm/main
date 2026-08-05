"use client";

// Port of focus-rail.tsx to JSX + inline styles. A 3D "focus" rail: the active
// card faces the viewer, neighbours recede/rotate/blur. Drag or swipe, arrow
// keys, horizontal wheel, prev/next buttons; blurred active image as ambience.
// Vertical page scrolling is left alone (only horizontal wheel is captured).
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useViewport } from "../useViewport";

function wrap(min, max, v) {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
}

const BASE_SPRING = { type: "spring", stiffness: 300, damping: 30, mass: 1 };

const ChevronL = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
);
const ChevronR = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg>
);

export function FocusRail({ items, initialIndex = 0, loop = true, autoPlay = false, interval = 4000, accent = "#12A5F4" }) {
  const { isMobile } = useViewport();
  const [active, setActive] = React.useState(initialIndex);
  const [hovering, setHovering] = React.useState(false);
  const lastWheel = React.useRef(0);

  const count = items.length;
  const activeIndex = wrap(0, count, active);
  const activeItem = items[activeIndex];

  const handlePrev = React.useCallback(() => { if (!loop && active === 0) return; setActive((p) => p - 1); }, [loop, active]);
  const handleNext = React.useCallback(() => { if (!loop && active === count - 1) return; setActive((p) => p + 1); }, [loop, active, count]);

  // horizontal wheel/trackpad only — vertical page scroll passes through
  const onWheel = React.useCallback((e) => {
    const now = Date.now();
    if (now - lastWheel.current < 400) return;
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    if (Math.abs(e.deltaX) > 20) { e.deltaX > 0 ? handleNext() : handlePrev(); lastWheel.current = now; }
  }, [handleNext, handlePrev]);

  React.useEffect(() => {
    if (!autoPlay || hovering) return;
    const t = setInterval(() => handleNext(), interval);
    return () => clearInterval(t);
  }, [autoPlay, hovering, handleNext, interval]);

  const onKeyDown = (e) => {
    if (e.key === "ArrowLeft") handlePrev();
    if (e.key === "ArrowRight") handleNext();
  };

  const swipeThreshold = 10000;
  const onDragEnd = (e, { offset, velocity }) => {
    const power = Math.abs(offset.x) * velocity.x;
    if (power < -swipeThreshold) handleNext();
    else if (power > swipeThreshold) handlePrev();
  };

  const CARD_W = isMobile ? 230 : 320;
  const CARD_H = Math.round(CARD_W * 0.72); // landscape cards for cars
  const X_STEP = Math.round(CARD_W * 1.06);
  const visible = [-2, -1, 0, 1, 2];

  return (
    <div
      tabIndex={0}
      onKeyDown={onKeyDown}
      onWheel={onWheel}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      style={{ position: "relative", width: "100%", overflow: "hidden", outline: "none", userSelect: "none", color: "#fff" }}
    >
      {/* background ambience — blurred active image */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <AnimatePresence mode="popLayout">
          <motion.div key={`bg-${activeIndex}`} initial={{ opacity: 0 }} animate={{ opacity: 0.35 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} style={{ position: "absolute", inset: 0 }}>
            <img src={activeItem.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(60px) saturate(190%)", transform: "scale(1.2)" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, #26292f 0%, rgba(38,41,47,0.5) 45%, transparent 100%)" }} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* rail */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: isMobile ? "34px 12px 26px" : "48px 32px 34px" }}>
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={onDragEnd}
          style={{ position: "relative", margin: "0 auto", height: CARD_H + 40, width: "100%", maxWidth: 1150, display: "flex", alignItems: "center", justifyContent: "center", perspective: 1200, cursor: "grab" }}
          whileTap={{ cursor: "grabbing" }}
        >
          {visible.map((offset) => {
            const absIndex = active + offset;
            const index = wrap(0, count, absIndex);
            const item = items[index];
            if (!loop && (absIndex < 0 || absIndex >= count)) return null;

            const isCenter = offset === 0;
            const dist = Math.abs(offset);

            return (
              <motion.div
                key={absIndex}
                initial={false}
                animate={{
                  x: offset * X_STEP,
                  z: -dist * 180,
                  scale: isCenter ? 1 : 0.85,
                  rotateY: offset * -20,
                  opacity: isCenter ? 1 : Math.max(0.1, 1 - dist * 0.5),
                  filter: `blur(${isCenter ? 0 : dist * 6}px) brightness(${isCenter ? 1 : 0.5})`,
                }}
                transition={BASE_SPRING}
                onClick={() => { if (offset !== 0) setActive((p) => p + offset); }}
                style={{
                  position: "absolute",
                  width: CARD_W,
                  height: CARD_H,
                  borderRadius: 18,
                  background: "#101318",
                  borderTop: "1px solid rgba(255,255,255,0.2)",
                  boxShadow: isCenter ? "0 30px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06)" : "0 18px 40px rgba(0,0,0,0.45)",
                  zIndex: 20 - dist,
                  transformStyle: "preserve-3d",
                  overflow: "hidden",
                }}
              >
                <img src={item.img} alt={item.title} draggable={false} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 18, pointerEvents: "none" }} />
                <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: "linear-gradient(180deg, rgba(255,255,255,0.1), transparent)", pointerEvents: "none" }} />
              </motion.div>
            );
          })}
        </motion.div>

        {/* info + controls */}
        <div style={{ margin: "0 auto", marginTop: isMobile ? 22 : 34, width: "100%", maxWidth: 900, display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: "center", justifyContent: "space-between", gap: 18 }}>
          <div style={{ flex: 1, minHeight: 96, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: isMobile ? "center" : "flex-start", textAlign: isMobile ? "center" : "left" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                transition={{ duration: 0.3 }}
              >
                {activeItem.sub && (
                  <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.18em", color: accent, marginBottom: 6 }}>{activeItem.sub}</div>
                )}
                <h3 style={{ margin: 0, fontFamily: '"AVATR", "Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 700, fontSize: "clamp(1.5rem, 3vw, 2.2rem)", letterSpacing: "-0.02em", color: "#fff" }}>{activeItem.title}</h3>
                {activeItem.note && (
                  <p style={{ margin: "8px 0 0", maxWidth: 430, fontSize: 14.5, lineHeight: 1.55, color: "rgba(255,255,255,0.6)", fontWeight: 300 }}>{activeItem.note}</p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 4, borderRadius: 999, background: "rgba(16,18,24,0.8)", padding: 4, boxShadow: "0 0 0 1px rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}>
            <button onClick={handlePrev} aria-label="Previous" style={{ border: "none", background: "transparent", color: "rgba(255,255,255,0.65)", borderRadius: 999, padding: 12, cursor: "pointer", display: "flex" }}>
              <ChevronL />
            </button>
            <span style={{ minWidth: 44, textAlign: "center", fontSize: 12, fontFamily: "ui-monospace, Menlo, monospace", color: "rgba(255,255,255,0.5)" }}>
              {activeIndex + 1} / {count}
            </span>
            <button onClick={handleNext} aria-label="Next" style={{ border: "none", background: "transparent", color: "rgba(255,255,255,0.65)", borderRadius: 999, padding: 12, cursor: "pointer", display: "flex" }}>
              <ChevronR />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
