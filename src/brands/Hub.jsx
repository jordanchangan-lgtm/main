"use client";

import React, { useRef, useState, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { EtherealShadow } from "./ui/EtherealShadow";
import InfiniteGallery from "./ui/InfiniteGallery";
import { Wordmark } from "./ui/Wordmark";
import { BRANDS } from "./brands";
import { useViewport } from "./useViewport";

const HUB_DEEP = "#000e2e";
const HUB_SHADOW = "#1e63c8";
const SPRING = "cubic-bezier(0.175, 0.885, 0.32, 2.2)";

const WORDS = ["future", "technology", "perfection"];

// A brand choice — a photograph that resolves out of the flying gallery (same
// blur→sharp, floating-in-the-blue look) and takes you to that landing page.
function ChoiceCard({ brand, isMobile }) {
  const t = brand.theme;
  const [h, setH] = useState(false);
  const go = () => { window.location.hash = `#/${brand.slug}`; };
  return (
    <a
      href={`#/${brand.slug}`}
      onClick={(e) => { e.preventDefault(); go(); }}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        position: "relative",
        display: "block",
        textDecoration: "none",
        width: isMobile ? "min(80vw, 360px)" : "min(30vw, 340px)",
        aspectRatio: "4 / 3",
        borderRadius: 14,
        overflow: "hidden",
        cursor: "pointer",
        border: "1px solid rgba(255,255,255,0.18)",
        boxShadow: h
          ? `0 26px 60px rgba(0,0,0,0.5), 0 0 46px ${t.accent}66`
          : "0 18px 44px rgba(0,0,0,0.42)",
        transform: h ? "translateY(-8px) scale(1.035)" : "none",
        transition: `transform .6s ${SPRING}, box-shadow .6s ${SPRING}`,
      }}
    >
      <img
        src={brand.description.images[0].src}
        alt={brand.name}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: h ? "scale(1.08)" : "scale(1.02)",
          transition: "transform .8s ease",
        }}
      />
      {/* legibility + brand tint */}
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, rgba(0,10,40,0.05) 0%, rgba(0,10,40,0.15) 45%, rgba(0,8,30,0.82) 100%)` }} />
      <div style={{ position: "absolute", inset: 0, background: t.accent, opacity: h ? 0.14 : 0, mixBlendMode: "overlay", transition: "opacity .5s ease" }} />
      {/* wordmark */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 16, display: "flex", justifyContent: "center" }}>
        <Wordmark
          text={brand.wordmark.text}
          transform={brand.wordmark.transform}
          color="#ffffff"
          style={{
            fontSize: isMobile ? "clamp(1.5rem, 6vw, 2rem)" : "clamp(1.5rem, 2vw, 2.1rem)",
            textShadow: `0 2px 20px ${t.accent}, 0 1px 3px rgba(0,0,0,0.5)`,
          }}
        />
      </div>
      {/* thin top sheen so it reads as part of the glassy field */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "34%", background: "linear-gradient(180deg, rgba(255,255,255,0.22), transparent)", pointerEvents: "none" }} />
    </a>
  );
}

export default function Hub() {
  const { isMobile } = useViewport();
  const stageRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ["start start", "end end"] });

  // Feed page-scroll progress into the 3D gallery so flying through the space
  // stays in sync with the sentence + the final choice.
  const progressRef = useRef(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => { progressRef.current = v; });

  const brands = useMemo(() => Object.values(BRANDS), []);

  // Brand-related images to fly through — interleaved across the three brands.
  const galleryImages = useMemo(() => {
    const per = brands.map((b) => b.description.images.map((im) => im.src));
    const max = Math.max(...per.map((a) => a.length));
    const out = [];
    for (let i = 0; i < max; i++) for (const arr of per) if (arr[i]) out.push(arr[i]);
    return out;
  }, [brands]);

  // The word flips as you travel deeper: future → technology → perfection.
  const [wi, setWi] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = v < 0.24 ? 0 : v < 0.46 ? 1 : 2;
    setWi((prev) => (prev === next ? prev : next));
  });

  // Choreography: sentence centred while flying + word cycling, then it lifts
  // and the three brand photographs resolve at the end of the journey.
  const headOpacity = useTransform(scrollYProgress, [0, 0.05, 0.55, 0.7], [0, 1, 1, 1]);
  const headY = useTransform(scrollYProgress, [0.55, 0.74], [0, isMobile ? -160 : -210]);
  const headScale = useTransform(scrollYProgress, [0.55, 0.74], [1.12, 0.86]);

  const galleryOpacity = useTransform(scrollYProgress, [0, 0.04, 0.62, 0.9], [0, 1, 1, 0.22]);

  const choicesOpacity = useTransform(scrollYProgress, [0.62, 0.8], [0, 1]);
  const cardY = [
    useTransform(scrollYProgress, [0.62, 0.84], [90, 0]),
    useTransform(scrollYProgress, [0.66, 0.88], [90, 0]),
    useTransform(scrollYProgress, [0.70, 0.92], [90, 0]),
  ];
  const cardO = [
    useTransform(scrollYProgress, [0.62, 0.78], [0, 1]),
    useTransform(scrollYProgress, [0.66, 0.82], [0, 1]),
    useTransform(scrollYProgress, [0.70, 0.86], [0, 1]),
  ];
  const cardFilter = [
    useTransform(scrollYProgress, [0.62, 0.78], ["blur(16px)", "blur(0px)"]),
    useTransform(scrollYProgress, [0.66, 0.82], ["blur(16px)", "blur(0px)"]),
    useTransform(scrollYProgress, [0.70, 0.86], ["blur(16px)", "blur(0px)"]),
  ];

  const cueOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  const triGradient = `linear-gradient(90deg, ${BRANDS.changan.theme.accentBright}, ${BRANDS.deepal.theme.accentBright}, ${BRANDS.nevo.theme.accentBright})`;

  return (
    <div style={{ background: HUB_DEEP, position: "relative" }}>
      <section ref={stageRef} style={{ height: isMobile ? "380vh" : "360vh", position: "relative" }}>
        <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
          {/* deep-blue ethereal-shadow field — the space you enter */}
          <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <EtherealShadow color={HUB_SHADOW} animation={{ scale: 100, speed: 90 }} noise={{ opacity: 0.5, scale: 1.3 }} sizing="fill" style={{ background: HUB_DEEP }} />
          </div>

          {/* 3D gallery of brand images flying toward you */}
          <motion.div style={{ position: "absolute", inset: 0, zIndex: 1, opacity: galleryOpacity, pointerEvents: "none" }}>
            <InfiniteGallery images={galleryImages} progressRef={progressRef} visibleCount={isMobile ? 9 : 12} className="" style={{ width: "100%", height: "100%" }} />
          </motion.div>

          {/* soft vignette to keep the centre legible */}
          <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "radial-gradient(60% 55% at 50% 46%, rgba(0,9,34,0.62) 0%, rgba(0,9,34,0.22) 45%, transparent 75%)" }} />

          {/* headline — flies with you, word flips, then lifts */}
          <motion.div
            style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 5vw", y: headY, scale: headScale, opacity: headOpacity, zIndex: 4, textAlign: "center", pointerEvents: "none" }}
          >
            <div style={{ fontSize: 12, letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", marginBottom: 18, fontWeight: 600 }}>
              Changan Jordan
            </div>
            <h1
              style={{
                margin: 0,
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                fontWeight: 300,
                fontSize: "clamp(2.2rem, 7vw, 5rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                color: "#ffffff",
                textShadow: "0 2px 30px rgba(0,0,0,0.55)",
                perspective: 800,
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "baseline",
                gap: "0.28em",
              }}
            >
              <span>dive into the</span>
              <span style={{ position: "relative", display: "inline-flex", justifyContent: "center", transformStyle: "preserve-3d" }}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={WORDS[wi]}
                    initial={{ rotateX: -90, opacity: 0, y: "0.1em" }}
                    animate={{ rotateX: 0, opacity: 1, y: 0 }}
                    exit={{ rotateX: 90, opacity: 0, y: "-0.1em" }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    style={{ display: "inline-block", transformOrigin: "center", fontWeight: 700, backgroundImage: triGradient, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", WebkitTextFillColor: "transparent" }}
                  >
                    {WORDS[wi]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>
          </motion.div>

          {/* the three brand photographs resolve at the end */}
          <motion.div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5vw", opacity: choicesOpacity, zIndex: 5 }}>
            <div style={{ width: "min(1180px, 96vw)", display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 18 : "clamp(18px, 2.4vw, 34px)", alignItems: "center", justifyContent: "center", marginTop: isMobile ? "16vh" : 118 }}>
              {brands.map((b, i) => (
                <motion.div key={b.slug} style={{ opacity: cardO[i], y: cardY[i], filter: cardFilter[i], display: "flex", justifyContent: "center" }}>
                  <ChoiceCard brand={b} isMobile={isMobile} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* scroll cue */}
          <motion.div style={{ position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)", zIndex: 6, opacity: cueOpacity, color: "rgba(255,255,255,0.7)", fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            Scroll to enter
            <motion.span animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }} style={{ fontSize: 16, lineHeight: 1 }}>↓</motion.span>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
