"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShaderAnimation } from "./ui/ShaderAnimation";
import { TextEffect } from "./ui/TextEffect";
import { Wordmark } from "./ui/Wordmark";
import { BrandZoom } from "./BrandZoom";
import { BrandGallery } from "./BrandGallery";
import { BrandLocation } from "./BrandLocation";
import { BrandSwitcher } from "./BrandSwitcher";

/* ======================================================================
   Generic brand landing page — renders from a brand config (see brands.js).
   Panel 1 (hero): re-tinted shader field + "<pre> <mark>" wordmark line.
   Panel 2 (brand): 3D circular gallery of brand imagery + description.
   Panel 3 (models): 3D circular gallery of the model line-up.
   Panel 4 (location): interactive radar map. Plain vertical scrolling —
   no split transition.
   ====================================================================== */

function Hero({ brand }) {
  const t = brand.theme;
  return (
    <section style={{ position: "relative", height: "100vh", overflow: "hidden", background: t.deep }}>
      <div style={{ position: "absolute", inset: 0 }}>
        <ShaderAnimation colors={brand.shaderColors} background={t.deep} />
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            textAlign: "center",
            color: t.white,
            padding: "min(7vh, 60px) 6vw",
            userSelect: "none",
            borderRadius: "50%",
            background: "radial-gradient(60% 55% at 50% 50%, rgba(0,10,40,0.55) 0%, rgba(0,10,40,0.28) 45%, transparent 72%)",
          }}
        >
          <TextEffect
            per="word"
            as="h1"
            preset="blur"
            style={{
              margin: 0,
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              fontWeight: 300,
              fontSize: "clamp(2rem, 6vw, 5.25rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "0.28em",
            }}
          >
            {brand.hero.pre}
          </TextEffect>

          <motion.div
            initial={{ opacity: 0, filter: "blur(14px)", y: 18 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ delay: 0.55, duration: 0.7, ease: "easeOut" }}
            style={{ marginTop: "0.15em" }}
          >
            <Wordmark
              text={brand.hero.mark}
              transform={brand.wordmark.transform}
              color={t.white}
              style={{ fontSize: "clamp(3rem, 11vw, 9rem)", lineHeight: 1, textShadow: `0 0 40px ${t.accentBright}66` }}
            />
          </motion.div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 30,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
          color: t.glow,
          fontSize: 11,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        Scroll
        <motion.span animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }} style={{ fontSize: 16, lineHeight: 1 }}>
          ↓
        </motion.span>
      </div>
    </section>
  );
}

/* Fixed clean-white backdrop with a slow-moving dotted pattern masked to the
   edges. Sits behind every post-hero section (which are transparent); the hero
   paints its own opaque shader on top so the first scene stays dark. */
function PageBackdrop({ t }) {
  return (
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 0, background: t.paper || "#ffffff", pointerEvents: "none" }} />
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

export default function BrandLanding({ brand }) {
  const t = brand.theme;
  return (
    <div style={{ background: "transparent", position: "relative" }}>
      <PageBackdrop t={t} />
      <BrandSwitcher current={brand.slug} />

      <div style={{ position: "fixed", top: 26, left: 34, zIndex: 50, mixBlendMode: "difference" }}>
        <Wordmark text={brand.wordmark.text} transform={brand.wordmark.transform} color="#ffffff" style={{ fontSize: 22 }} />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
      <Hero brand={brand} />

      {/* Panel 2 — brand description (zoom-parallax of brand imagery) */}
      <BrandZoom brand={brand} />

      {/* Panel 3 — the range (circular gallery of the models) */}
      <BrandGallery
        brand={brand}
        gallery={brand.modelsGallery}
        radius={540}
        cardW={330}
        cardH={440}
        turns={1}
        heightVh={340}
      />

      {/* Panel 4 — location */}
      <BrandLocation brand={brand} />
      </div>
    </div>
  );
}
