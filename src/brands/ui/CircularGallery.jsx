"use client";

// Ported from the provided shadcn/Tailwind/TS `circular-gallery.tsx` to plain
// JSX with inline styles (no Tailwind). Presentational only: the parent passes
// the current `rotation` (deg); auto-rotate + scroll-driven rotation live in
// the BrandGallery wrapper so the ring can be scoped to its own section.
import React from "react";

export function CircularGallery({
  items,
  rotation = 0,
  radius = 560,
  cardW = 300,
  cardH = 400,
  theme,
}) {
  const anglePerItem = 360 / items.length;
  const t = theme || {};

  return (
    <div
      role="region"
      aria-label="Circular 3D Gallery"
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: "2000px",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transform: `rotateY(${rotation}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {items.map((item, i) => {
          const itemAngle = i * anglePerItem;
          const totalRotation = rotation % 360;
          const relativeAngle = (itemAngle + totalRotation + 360) % 360;
          const normalizedAngle = Math.abs(relativeAngle > 180 ? 360 - relativeAngle : relativeAngle);
          const opacity = Math.max(0.3, 1 - normalizedAngle / 180);

          return (
            <div
              key={`${item.img}-${i}`}
              role="group"
              aria-label={item.title}
              style={{
                position: "absolute",
                width: cardW,
                height: cardH,
                left: "50%",
                top: "50%",
                marginLeft: -cardW / 2,
                marginTop: -cardH / 2,
                transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                opacity,
                transition: "opacity 0.3s linear",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  borderRadius: 14,
                  overflow: "hidden",
                  boxShadow: "0 25px 55px -12px rgba(0,0,0,0.7)",
                  border: `1px solid ${(t.accentBright || "#ffffff") + "40"}`,
                  background: (t.deep || "#000") + "55",
                  backdropFilter: "blur(8px)",
                }}
              >
                <img
                  src={item.img}
                  alt={item.title}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: item.pos || "center",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    padding: 16,
                    background: "linear-gradient(to top, rgba(0,0,0,0.82), transparent)",
                    color: "#ffffff",
                  }}
                >
                  <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, letterSpacing: "0.01em" }}>
                    {item.title}
                  </h2>
                  {item.sub && (
                    <em style={{ fontSize: 12.5, fontStyle: "italic", opacity: 0.82, letterSpacing: "0.06em" }}>
                      {item.sub}
                    </em>
                  )}
                  {item.note && (
                    <p style={{ margin: "8px 0 0", fontSize: 12, opacity: 0.72, lineHeight: 1.4 }}>
                      {item.note}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
