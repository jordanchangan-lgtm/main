"use client";

// Ported from the provided shadcn/Tailwind/TS `card-fan-carousel.tsx` to plain
// JSX with self-contained CSS (the reference relied on external .fan-card /
// .fan-layout styles). gsap drives the fan/entry/hover animation. Cards can
// carry an optional label (e.g. the model name).
import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

const MAX_VISIBLE = 7;
const HALF = 3;

const FAN_POSITIONS = [
  { rot: -21, scale: 0.7756, x: -30, y: 7.3, zIndex: 1 },
  { rot: -14, scale: 0.8498, x: -22, y: 4.0, zIndex: 2 },
  { rot: -7, scale: 0.9346, x: -11, y: 1.3, zIndex: 3 },
  { rot: 0, scale: 1.0, x: 0, y: 0.0, zIndex: 10 },
  { rot: 7, scale: 0.9346, x: 11, y: 1.3, zIndex: 3 },
  { rot: 14, scale: 0.8498, x: 22, y: 4.0, zIndex: 2 },
  { rot: 21, scale: 0.7756, x: 30, y: 7.3, zIndex: 1 },
];

function getResponsiveMultiplier(width) {
  if (width < 480) return 0.34;
  if (width < 640) return 0.44;
  if (width < 768) return 0.56;
  if (width < 1024) return 0.78;
  return 1.0;
}
function getHeightMultiplier() {
  return 1;
}
function getSlotConfig(totalCards, slot) {
  if (totalCards >= MAX_VISIBLE) return FAN_POSITIONS[slot];
  const center = totalCards >> 1;
  const distance = totalCards > 1 ? (slot - center) / center : 0;
  const absDistance = Math.abs(distance);
  return {
    rot: distance * 21,
    scale: 1.0 - 0.2244 * absDistance * absDistance,
    x: distance * 30,
    y: absDistance * absDistance * 7.3,
    zIndex: 10 - Math.abs(slot - center),
  };
}

export function CardFanCarousel({ cards, accent = "#12A5F4", cardW = 15, cardH = 20 }) {
  const containerRef = useRef(null);
  const isAnimating = useRef(false);
  const hasEntered = useRef(false);
  const directionRef = useRef(null);
  const prevVisible = useRef(new Set());

  const totalCards = cards.length;
  const needsPagination = totalCards > MAX_VISIBLE;
  const [centerIndex, setCenterIndex] = useState(needsPagination ? HALF : totalCards >> 1);

  const getVisibleMap = useCallback(
    (center) => {
      const map = new Map();
      if (!needsPagination) {
        cards.forEach((_, i) => map.set(i, i));
        return map;
      }
      for (let slot = 0; slot < MAX_VISIBLE; slot++) {
        map.set((((center + slot - HALF) % totalCards) + totalCards) % totalCards, slot);
      }
      return map;
    },
    [totalCards, needsPagination, cards]
  );

  const cycle = useCallback(
    (direction) => {
      if (isAnimating.current || !needsPagination) return;
      isAnimating.current = true;
      directionRef.current = direction;
      setCenterIndex((prev) => (direction === "right" ? (prev + 1) % totalCards : (prev - 1 + totalCards) % totalCards));
    },
    [totalCards, needsPagination]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !totalCards) return;
    const cardElements = Array.from(container.querySelectorAll(".fan-card"));
    if (!cardElements.length) return;

    const visibleMap = getVisibleMap(centerIndex);
    const previouslyVisible = prevVisible.current;
    const direction = directionRef.current;
    const isFirstMount = !hasEntered.current;
    const multiplier = getResponsiveMultiplier(window.innerWidth);
    const hMult = getHeightMultiplier();
    const slotCount = needsPagination ? MAX_VISIBLE : totalCards;
    const config = (slot) => getSlotConfig(slotCount, slot);

    if (isFirstMount) isAnimating.current = true;
    let completedCount = 0;
    const visibleCount = visibleMap.size;
    const onCardDone = () => {
      if (++completedCount >= visibleCount) {
        isAnimating.current = false;
        if (isFirstMount) hasEntered.current = true;
      }
    };

    cardElements.forEach((card, cardIndex) => {
      const slot = visibleMap.get(cardIndex);
      const wasVisible = previouslyVisible.has(cardIndex);
      if (slot !== undefined) {
        const { x, y, rot, scale, zIndex } = config(slot);
        const target = { x: `${x * multiplier}rem`, y: `${y * hMult}rem`, rotation: rot, scale, opacity: 1, zIndex };
        if (isFirstMount) {
          gsap.set(card, { x: 0, y: `${12 * hMult}rem`, rotation: 0, scale: 0.5, opacity: 0 });
          gsap.to(card, { ...target, duration: 1.2, ease: "elastic.out(1.05,.78)", delay: 0.2 + slot * 0.06, onComplete: onCardDone });
        } else if (!wasVisible) {
          const enterX = direction === "right" ? 40 : -40;
          gsap.set(card, { x: `${enterX}rem`, y: `${y * hMult}rem`, rotation: direction === "right" ? 30 : -30, scale: 0.5, opacity: 0 });
          gsap.to(card, { ...target, duration: 0.6, ease: "power2.out", onComplete: onCardDone });
        } else {
          gsap.to(card, { ...target, duration: 0.5, ease: "power2.out", onComplete: onCardDone });
        }
      } else if (wasVisible) {
        const exitX = direction === "right" ? -40 : 40;
        gsap.to(card, { x: `${exitX}rem`, opacity: 0, scale: 0.5, rotation: direction === "right" ? -30 : 30, duration: 0.4, ease: "power2.in", zIndex: 0 });
      } else if (isFirstMount) {
        gsap.set(card, { opacity: 0, scale: 0.3, x: 0, y: 0, zIndex: 0 });
      }
    });

    prevVisible.current = new Set(visibleMap.keys());

    const visibleEntries = [];
    cardElements.forEach((el, i) => {
      const slot = visibleMap.get(i);
      if (slot !== undefined) visibleEntries.push({ el, slot });
    });
    visibleEntries.sort((a, b) => a.slot - b.slot);

    let activeSlot = null;
    let leaveTimer = null;
    const centerSlot = visibleEntries.length >> 1;

    const updateHoverLayout = (hoveredSlot) => {
      const mult = getResponsiveMultiplier(window.innerWidth);
      const hM = getHeightMultiplier();
      visibleEntries.forEach(({ el, slot }) => {
        const base = config(slot);
        let targetX = base.x * mult;
        let targetY = base.y * hM;
        let targetRot = base.rot;
        let targetScale = base.scale;
        let delay = 0;
        if (hoveredSlot !== null) {
          const distance = Math.abs(slot - hoveredSlot);
          delay = distance * 0.02;
          if (slot === hoveredSlot) {
            targetY -= 2.5 * hM;
            targetScale *= 1.08;
          } else {
            const normalized = centerSlot > 0 ? (slot - centerSlot) / centerSlot : 0;
            const pushStrength = 8 * (1 - Math.abs(normalized)) * (1 + 0.2 * Math.max(0, 3 - distance));
            if (slot < hoveredSlot) {
              targetX -= pushStrength * mult;
              targetRot -= 3 / (distance + 1);
            } else {
              targetX += pushStrength * mult;
              targetRot += 3 / (distance + 1);
            }
            if (slot === visibleEntries.length - 1 && hoveredSlot < centerSlot) targetY -= 1 * hM;
            if (slot === 0 && hoveredSlot > centerSlot) targetY -= 1 * hM;
          }
        } else {
          delay = Math.abs(slot - centerSlot) * 0.02;
        }
        gsap.to(el, { x: `${targetX}rem`, y: `${targetY}rem`, rotation: targetRot, scale: targetScale, duration: 0.5, delay, ease: "elastic.out(1,.75)", overwrite: "auto" });
        gsap.set(el, { zIndex: base.zIndex });
      });
    };

    const enterHandlers = visibleEntries.map(({ el, slot }) => {
      const handler = () => {
        if (isAnimating.current) return;
        if (leaveTimer) { clearTimeout(leaveTimer); leaveTimer = null; }
        if (activeSlot !== slot) { activeSlot = slot; updateHoverLayout(slot); }
      };
      el.addEventListener("mouseenter", handler);
      return { el, handler };
    });
    const onMouseLeave = () => {
      if (isAnimating.current) return;
      if (leaveTimer) clearTimeout(leaveTimer);
      leaveTimer = setTimeout(() => { activeSlot = null; updateHoverLayout(null); }, 50);
    };
    container.addEventListener("mouseleave", onMouseLeave);
    const onResize = () => { if (!isAnimating.current) updateHoverLayout(activeSlot); };
    window.addEventListener("resize", onResize);

    return () => {
      enterHandlers.forEach(({ el, handler }) => el.removeEventListener("mouseenter", handler));
      container.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", onResize);
      if (leaveTimer) clearTimeout(leaveTimer);
    };
  }, [centerIndex, totalCards, getVisibleMap, needsPagination]);

  if (!totalCards) return null;

  const chevron = (direction) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points={direction === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
    </svg>
  );

  const fanH = cardH + 9;

  return (
    <section style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", position: "relative", zIndex: 2 }}>
      <style>{`
        .fan-layout { position: relative; width: 100%; }
        .fan-card {
          position: absolute; left: 50%; top: 50%;
          margin-left: calc(var(--fcw) / -2); margin-top: calc(var(--fch) / -2);
          width: var(--fcw); height: var(--fch);
          border-radius: 1.35rem; overflow: hidden;
          box-shadow: 0 26px 60px rgba(15,25,50,0.28), 0 0 0 1px rgba(255,255,255,0.5);
          will-change: transform; background: #0b1220; cursor: pointer;
        }
        .fan-card img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
      `}</style>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
        <div
          ref={containerRef}
          className="fan-layout"
          style={{ height: `${fanH}rem`, maxWidth: "80rem", ["--fcw"]: `${cardW}rem`, ["--fch"]: `${cardH}rem` }}
        >
          {cards.map((card, index) => (
            <div key={index} className="fan-card">
              <img src={card.imgUrl} loading="lazy" alt={card.alt || `Card ${index}`} />
              {card.label && (
                <div
                  style={{
                    position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 2,
                    padding: "14px 16px",
                    background: "linear-gradient(to top, rgba(4,10,22,0.86), transparent)",
                    color: "#fff",
                  }}
                >
                  {card.sub && (
                    <div style={{ fontSize: 10.5, letterSpacing: "0.24em", textTransform: "uppercase", color: accent, marginBottom: 4, fontWeight: 700 }}>
                      {card.sub}
                    </div>
                  )}
                  <div style={{ fontFamily: '"Arial Black", sans-serif', fontWeight: 900, fontSize: "1.15rem", lineHeight: 1 }}>{card.label}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {needsPagination && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 24, zIndex: 3 }}>
          <button onClick={() => cycle("left")} aria-label="Previous" style={arrowStyle}>{chevron("left")}</button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {cards.map((_, i) => (
              <span key={i} style={{ width: 8, height: 8, borderRadius: "50%", transition: "all .3s", background: i === centerIndex ? accent : "rgba(20,30,60,0.18)", transform: i === centerIndex ? "scale(1.3)" : "none" }} />
            ))}
          </div>
          <button onClick={() => cycle("right")} aria-label="Next" style={arrowStyle}>{chevron("right")}</button>
        </div>
      )}
    </section>
  );
}

const arrowStyle = {
  display: "flex", alignItems: "center", justifyContent: "center",
  width: 46, height: 46, borderRadius: "50%",
  border: "1.5px solid rgba(20,30,60,0.12)",
  background: "rgba(255,255,255,0.5)", backdropFilter: "blur(16px)",
  color: "rgba(20,30,60,0.5)", cursor: "pointer",
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
};
