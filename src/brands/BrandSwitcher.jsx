"use client";

import React from "react";
import { BRANDS } from "./brands";
import { useViewport } from "./useViewport";
import { GlassEffect } from "./ui/LiquidGlass";

// Desktop: fixed vertical nav on the RIGHT edge, labels rotated 90°.
// Mobile:  a compact horizontal pill row docked at the BOTTOM, so it never
//          overlaps the globe labels / model copy on narrow screens.
export function BrandSwitcher({ current }) {
  const { isMobile, isSmall } = useViewport();
  const brands = Object.values(BRANDS);

  if (isMobile) {
    return (
      <div style={{ position: "fixed", left: "50%", bottom: 14, transform: "translateX(-50%)", zIndex: 60, maxWidth: "94vw" }}>
        <GlassEffect radius={999} style={{ padding: 4 }}>
          <div style={{ display: "flex", flexDirection: "row", gap: 4, alignItems: "center" }}>
            <a
              href="#/home"
              aria-label="All brands"
              style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 999, color: "#1c2740", fontSize: 16, flex: "0 0 auto" }}
            >
              ⌂
            </a>
            {brands.map((b) => {
              const active = b.slug === current;
              return (
                <a
                  key={b.slug}
                  href={`#/${b.slug}`}
                  style={{
                    textDecoration: "none",
                    padding: "8px 12px",
                    borderRadius: 999,
                    fontSize: 12.5,
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                    whiteSpace: "nowrap",
                    textTransform: b.wordmark.transform === "lowercase" ? "lowercase" : "none",
                    color: active ? "#ffffff" : "#1c2740",
                    background: active ? b.theme.accent : "transparent",
                    transition: "background 0.25s, color 0.25s",
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

  return (
    <div style={{ position: "fixed", right: 18, top: "50%", transform: "translateY(-50%)", zIndex: 60 }}>
      <GlassEffect radius={999} style={{ padding: 4 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
          <a
            href="#/home"
            aria-label="All brands"
            style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 999, color: "#1c2740", fontSize: 16 }}
          >
            ⌂
          </a>
          {brands.map((b) => {
            const active = b.slug === current;
            return (
              <a
                key={b.slug}
                href={`#/${b.slug}`}
                style={{
                  textDecoration: "none",
                  padding: "16px 7px",
                  borderRadius: 999,
                  fontSize: 13,
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
