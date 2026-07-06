"use client";

import React from "react";
import { BRANDS } from "./brands";

// Small fixed nav across the three connected brand sites. Uses hash links so
// it works both in the app and inside a static/iframe preview.
export function BrandSwitcher({ current }) {
  const t = BRANDS[current]?.theme;
  return (
    <div
      style={{
        position: "fixed",
        top: 22,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 60,
        display: "flex",
        gap: 4,
        padding: 4,
        borderRadius: 999,
        background: "rgba(255,255,255,0.55)",
        backdropFilter: "blur(12px) saturate(160%)",
        WebkitBackdropFilter: "blur(12px) saturate(160%)",
        border: "1px solid rgba(255,255,255,0.7)",
        boxShadow: "0 8px 24px rgba(20,30,60,0.16)",
      }}
    >
      {Object.values(BRANDS).map((b) => {
        const active = b.slug === current;
        return (
          <a
            key={b.slug}
            href={`#/${b.slug}`}
            style={{
              textDecoration: "none",
              padding: "7px 16px",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.02em",
              textTransform: b.wordmark.transform === "lowercase" ? "lowercase" : "none",
              color: active ? "#ffffff" : "#33404f",
              background: active ? b.theme.accent : "transparent",
              transition: "background 0.25s, color 0.25s",
            }}
          >
            {b.name}
          </a>
        );
      })}
    </div>
  );
}
