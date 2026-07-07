"use client";

import React from "react";
import { Wordmark } from "./ui/Wordmark";
import { BrandIntroScene } from "./BrandIntroScene";
import { BrandLocation } from "./BrandLocation";
import { BrandSwitcher } from "./BrandSwitcher";
import { PageBackdrop } from "./PageBackdrop";
import { GlassFilter } from "./ui/LiquidGlass";
import { useViewport } from "./useViewport";

/* ======================================================================
   Generic brand landing page — renders from a brand config (see brands.js).
   Panel 1 (hero): re-tinted shader field + "<pre> <mark>" wordmark line.
   Panel 2 (brand): 3D circular gallery of brand imagery + description.
   Panel 3 (models): 3D circular gallery of the model line-up.
   Panel 4 (location): interactive radar map. Plain vertical scrolling —
   no split transition.
   ====================================================================== */

export default function BrandLanding({ brand }) {
  const t = brand.theme;
  const { isMobile } = useViewport();
  return (
    <div style={{ background: "transparent", position: "relative" }}>
      <GlassFilter />
      <PageBackdrop paper={t.paper} />
      <BrandSwitcher current={brand.slug} />

      {!isMobile && (
        <div style={{ position: "fixed", top: 26, left: 34, zIndex: 50, mixBlendMode: "difference" }}>
          <Wordmark text={brand.wordmark.text} transform={brand.wordmark.transform} color="#ffffff" style={{ fontSize: 22 }} />
        </div>
      )}

      <div style={{ position: "relative", zIndex: 1 }}>
      {/* Scroll-locked intro: hero → 3D description carousel → swipe to enter */}
      <BrandIntroScene brand={brand} />

      {/* "The world" — revealed after the swipe */}
      <div id="brand-world">
        <BrandLocation brand={brand} />
      </div>
      </div>
    </div>
  );
}
