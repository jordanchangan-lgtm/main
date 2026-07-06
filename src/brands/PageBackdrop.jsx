"use client";

import React from "react";

/* Fixed clean-white backdrop with a slow-moving dotted pattern masked to the
   edges. Shared by the hub and the brand pages (post-hero sections are
   transparent so this shows through). */
export function PageBackdrop({ paper = "#ffffff" }) {
  return (
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 0, background: paper, pointerEvents: "none" }} />
      <div className="edge-dots" style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />
      <style>{`
        .edge-dots {
          background-image: radial-gradient(circle, rgba(20,28,45,0.16) 1.1px, transparent 1.7px);
          background-size: 26px 26px;
          -webkit-mask-image: radial-gradient(ellipse 60% 58% at 50% 50%, transparent 45%, #000 85%);
          mask-image: radial-gradient(ellipse 60% 58% at 50% 50%, transparent 45%, #000 85%);
          animation: edgeDotsDrift 7s linear infinite;
        }
        @keyframes edgeDotsDrift {
          from { background-position: 0 0; }
          to   { background-position: 26px 52px; }
        }
      `}</style>
    </>
  );
}
