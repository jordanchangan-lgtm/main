"use client";

import React from "react";
import { ZoomParallax } from "./ui/ZoomParallax";

/* The brand "description" section: a zoom-parallax reveal of real, brand-related
   imagery. The zoom settles on the hero image and, a beat later, the brand
   description fades in on top of it. */
export function BrandZoom({ brand }) {
  const t = brand.theme;
  const d = brand.description;
  return (
    <div style={{ background: "transparent" }}>
      <ZoomParallax
        images={d.images}
        heightVh={360}
        overlay={{ eyebrow: d.eyebrow, headline: d.headline, body: d.body, theme: t }}
      />
    </div>
  );
}
