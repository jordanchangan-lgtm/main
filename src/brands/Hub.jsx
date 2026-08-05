"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { VideoBackground } from "./ui/VideoBackground";
import { GlassFilter } from "./ui/LiquidGlass";
import { ContainerTextFlip } from "./ui/ContainerTextFlip";
import { BRANDS } from "./brands";
import { useViewport } from "./useViewport";
import { useMobilePanelGate } from "./useMobilePanelGate";
import CHANGAN_LOGO from "./assets/changan-logo-white.png";
import DEEPAL_LOGO from "./assets/deepal-logo-white.png";
import NEVO_LOGO from "./assets/nevo-logo-white.png";

const HUB_DEEP = "#000e2e";
const HUB_BLACK = "#000000";
const WORDS = ["future", "technology", "perfection"];
const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";
const BRAND_LOGOS = { changan: CHANGAN_LOGO, deepal: DEEPAL_LOGO, nevo: NEVO_LOGO };
// each brand's emblem is a different shape — size by height so they read evenly
// (deepal = tall triangle, nevo = wider bracket, sized up so it reads as large)
const LOGO_H = { changan: 1.0, deepal: 1.12, nevo: 0.98 };
// left→right display order: Changan · Nevo · Deepal
const HUB_ORDER = ["changan", "nevo", "deepal"];

// Plain clickable brand emblem (white logo) — no glass panel; the logo is the link.
function BrandGlassPanel({ brand, isMobile }) {
  const [h, setH] = useState(false);
  const base = isMobile ? 52 : 62;
  return (
    <a
      href={`#/${brand.slug}`}
      onClick={(e) => { e.preventDefault(); window.location.hash = `#/${brand.slug}`; }}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        textDecoration: "none",
        padding: isMobile ? "10px 16px" : "14px 22px",
        cursor: "pointer",
        transform: h ? "translateY(-3px) scale(1.08)" : "none",
        transition: `transform .45s ${SPRING}`,
      }}
      aria-label={brand.name}
    >
      <img
        src={BRAND_LOGOS[brand.slug]}
        alt={brand.name}
        style={{
          height: Math.round(base * (LOGO_H[brand.slug] || 1)),
          width: "auto",
          display: "block",
          opacity: h ? 1 : 0.82,
          filter: h ? "drop-shadow(0 4px 14px rgba(0,0,0,0.5))" : "none",
          transition: "opacity .45s ease, filter .45s ease",
        }}
      />
    </a>
  );
}

export default function Hub() {
  const { isMobile } = useViewport();
  const brands = HUB_ORDER.map((slug) => BRANDS[slug]);
  useMobilePanelGate();

  // Hero is scroll-LOCKED: each scroll advances the headline word (blur flip).
  // The page stays pinned until the final word has fully appeared (3 scrolls),
  // then the lock releases and normal scrolling resumes.
  const [wi, setWi] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const wiRef = useRef(0);
  const unlockedRef = useRef(false);
  const cooldownRef = useRef(false);
  const FLIP_MS = 720; // let the blur reveal finish before the next scroll counts

  useEffect(() => {
    window.scrollTo(0, 0);

    const forward = () => {
      if (unlockedRef.current || cooldownRef.current) return;
      if (wiRef.current < WORDS.length - 1) {
        wiRef.current += 1;
        setWi(wiRef.current);
        cooldownRef.current = true;
        setTimeout(() => { cooldownRef.current = false; }, FLIP_MS);
      } else {
        // final word revealed → release the lock; the word keeps cycling on its own
        unlockedRef.current = true;
        setUnlocked(true);
      }
    };

    const onWheel = (e) => {
      if (unlockedRef.current) return;
      e.preventDefault();
      window.scrollTo(0, 0);
      if (e.deltaY > 0) forward();
    };
    const onKey = (e) => {
      if (unlockedRef.current) return;
      if (["ArrowDown", "PageDown", " ", "Spacebar"].includes(e.key)) { e.preventDefault(); forward(); }
    };
    let ty = null;
    const onTouchStart = (e) => { ty = e.touches[0].clientY; };
    const onTouchMove = (e) => {
      if (unlockedRef.current || ty == null) return;
      const dy = ty - e.touches[0].clientY;
      if (Math.abs(dy) > 24) { e.preventDefault(); window.scrollTo(0, 0); if (dy > 0) forward(); ty = e.touches[0].clientY; }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  // once the scroll-lock is done, the headline word keeps cycling on its own
  useEffect(() => {
    if (!unlocked) return;
    const id = setInterval(() => {
      wiRef.current = (wiRef.current + 1) % WORDS.length;
      setWi(wiRef.current);
    }, 2600);
    return () => clearInterval(id);
  }, [unlocked]);

  return (
    <div style={{ position: "relative", background: HUB_DEEP }}>
      <GlassFilter />

      {/* ===== Panel 1 — ocean hero, all-white Helvetica headline ===== */}
      <section style={{ position: "relative", height: "100vh", overflow: "hidden", background: HUB_DEEP }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <VideoBackground />
        </div>
        {/* blend the video hero into the deep-blue panel below — no hard seam */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "42vh", zIndex: 1, pointerEvents: "none", background: `linear-gradient(to bottom, rgba(0,14,46,0) 0%, ${HUB_DEEP} 88%)` }} />

        <div style={{ position: "absolute", inset: 0, zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 5vw", textAlign: "center", pointerEvents: "none", fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
          <div style={{ fontSize: 12, letterSpacing: "0.4em", textTransform: "uppercase", color: "#ffffff", marginBottom: 18, fontWeight: 600 }}>
            Changan Jordan
          </div>
          <h1 style={{ margin: 0, fontWeight: 300, fontSize: "clamp(2.2rem, 7vw, 5rem)", lineHeight: 1.05, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#ffffff", display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "0.28em" }}>
            <span>dive into</span>
            <ContainerTextFlip
              words={WORDS}
              index={wi}
              style={{ fontFamily: "inherit", fontWeight: 300, color: "#ffffff", textShadow: "0 2px 16px rgba(0,0,0,0.35)" }}
            />
          </h1>
        </div>

        <div style={{ position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)", zIndex: 4, color: "rgba(255,255,255,0.65)", fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
          Scroll
          <motion.span animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }} style={{ fontSize: 16, lineHeight: 1 }}>↓</motion.span>
        </div>
      </section>

      {/* ===== Panel 2 — dark-blue → black gradient + moving dots, brand links ===== */}
      <section data-panel-gate style={{ position: "relative", minHeight: "100vh", background: `linear-gradient(180deg, ${HUB_DEEP} 0%, ${HUB_BLACK} 100%)`, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="hub2-dots" style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 1200, margin: "0 auto", padding: "14vh 6vw", display: "flex", flexDirection: "column", alignItems: "center", gap: isMobile ? 40 : 56 }}>
          <div style={{ textAlign: "center", color: "#ffffff", fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
            <div style={{ fontSize: 12, letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", fontWeight: 600, marginBottom: 14 }}>
              Choose your brand
            </div>
            <h2 style={{ margin: 0, fontWeight: 300, fontSize: "clamp(1.7rem, 4.4vw, 3.2rem)", letterSpacing: "-0.02em" }}>
              Three brands, one destination.
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 40 : "clamp(40px, 6vw, 88px)", alignItems: "center", justifyContent: "center", width: "100%" }}>
            {brands.map((b, i) => (
              <motion.div
                key={b.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 }}
              >
                <BrandGlassPanel brand={b} isMobile={isMobile} />
              </motion.div>
            ))}
          </div>
        </div>

        <style>{`
          .hub2-dots {
            background-image: radial-gradient(circle, rgba(255,255,255,0.13) 1.1px, transparent 1.7px);
            background-size: 26px 26px;
            /* grid starts lower — dotless across the top (below the seam), fading
               in around the mid of the panel and holding to the bottom */
            -webkit-mask-image: linear-gradient(to bottom, transparent 0%, transparent 30%, #000 46%, #000 100%);
            mask-image: linear-gradient(to bottom, transparent 0%, transparent 30%, #000 46%, #000 100%);
            animation: hub2DotsDrift 7s linear infinite;
          }
          @keyframes hub2DotsDrift { from { background-position: 0 0; } to { background-position: 26px 52px; } }
        `}</style>
      </section>
    </div>
  );
}
