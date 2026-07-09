"use client";

import React from "react";
import { BRANDS } from "./brands";
import { useViewport } from "./useViewport";
import { GlassEffect } from "./ui/LiquidGlass";

// Fixed vertical nav on the RIGHT edge — labels rotated 90° (perpendicular).
// Hash links work in-app and inside a static/iframe preview.
export function BrandSwitcher({ current }) {
  const { isSmall } = useViewport();
  return (
    <div style={{ position: "fixed", right: isSmall ? 8 : 18, top: "50%", transform: "translateY(-50%)", zIndex: 60 }}>
      <GlassEffect radius={999} style={{ padding: 4 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
          <a
            href="#/home"
            aria-label="All brands"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: isSmall ? 30 : 34,
              height: isSmall ? 30 : 34,
              borderRadius: 999,
              color: "#1c2740",
              fontSize: isSmall ? 14 : 16,
            }}
          >
            ⌂
          </a>
          {Object.values(BRANDS).map((b) => {
            const active = b.slug === current;
            return (
              <a
                key={b.slug}
                href={`#/${b.slug}`}
                style={{
                  textDecoration: "none",
                  padding: isSmall ? "12px 6px" : "16px 7px",
                  borderRadius: 999,
                  fontSize: isSmall ? 12 : 13,
                  fontWeight: 700,
                  letterSpacing: "0.02em",
                  textTransform: b.wordmark.transform === "lowercase" ? "lowercase" : "none",
                  color: active ? "#ffffff" : "#1c2740",
                  background: active ? b.theme.accent : "transparent",
                  transition: "background 0.25s, color 0.25s",
                  writingMode: "vertical-rl",
                }}
              >
                {b.name}
              </a>
            );
          })}
        </div>
      </GlassEffect>
    </div>
  );
}
