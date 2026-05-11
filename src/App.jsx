import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from "framer-motion";
import * as THREE from "three";

/* ======================================================================
   ASSET IMPORTS — mapped from existing PNGs where a semantic match exists.
   Missing hero assets (sky/plane/clouds/window/globe/portrait/horizon) are
   declared as null so the AssetSlot placeholder renders in their slot
   until production imagery is supplied.
   ====================================================================== */

// Existing assets — mapped from previous static build PNGs
import CHANGAN_JORDAN_DATA    from "./assets/AUTOMOTIV_CHANGAN_JORDAN.PNG";
import FACTORY_INTERIOR_DATA  from "./assets/FACTORY_ASSEMBLY_LINE .PNG";
import FUTURE_FLYSYRIA_DATA   from "./assets/FUTURE_FLYSYRIA_AVIATION.PNG";
import FUTURE_LEVANT_DATA     from "./assets/FUTURE_LEVANT_UNIVERSITY.PNG";
import FUTURE_SPECTRUM_DATA   from "./assets/FUTURE_SPECTRUM_RECONSTRUCTION.PNG";
import GEELY_VISIT_1_DATA     from "./assets/GEELY_VISIT_CEO_AN_CONGHUI.jpeg";
import GEELY_VISIT_2_DATA     from "./assets/GEELY_VISIT_CHAIRMAN_LI_SHUFU.jpeg";
import IND_FINANCE_DATA       from "./assets/INDUSTRIES_FINANCE.PNG";
import IND_MEDICAL_DATA       from "./assets/INDUSTRIES_MEDICAL.PNG";
import IND_MOTORCYCLE_DATA    from "./assets/INDUSTRIES_MOTORCYCLE.PNG";
import IND_PAPER_DATA         from "./assets/INDUSTRIES_PAPER.PNG";
import IND_REALESTATE_DATA    from "./assets/INDUSTRIES_REALESTATE.PNG";
import INDUSTRIES_SOLAR       from "./assets/INDUSTRIES_SOLAR.PNG";
import INDUSTRIES_TAXIPHONE   from "./assets/INDUSTRIES_TAXIPHONE.PNG";
import BLUEPRINT_DATA         from "./assets/BLUEPRINT_FLOOR_PLANT.PNG";

// Missing assets — pending production imagery. Null sources fall through to
// the labeled placeholder slot inside AssetSlot below.
const HERO_WINDOW_CLOSED_DATA = null;
const HERO_WINDOW_OPEN_DATA   = null;
const HERO_SKY_DATA           = null;
const HERO_CLOUDS_PASS_DATA   = null;
const HERO_PLANE_DATA         = null;
const CLOUDS_FLOAT_DATA       = null;
const GLOBE_DATA              = null;
const PROLOGUE_PORTRAIT_DATA  = null;
const HORIZON_DATA            = null;

/* ======================================================================
   MALLOUK GROUP — Final Build v3
   - NEW HERO: Airplane window opens + plane moves up on scroll (Jesko-style)
   - Semantic asset naming (HERO_SKY, HERO_PLANE, etc.)
   - All wording updates from WORDING.docx
   - Timeline horizontal scroll bug fixed
   - 7th industry: Mallouk-made Motorcycles
   - Shanghai office updated, Levant investment removed
   ====================================================================== */

const COLOR = {
  bg:       "#f3eee5",
  bgDeep:   "#e9e2d4",
  ink:      "#14140f",
  inkSoft:  "#2a2a22",
  muted:    "#6b6960",
  line:     "rgba(20,20,15,0.12)",
  accent:   "#8a2a0c",
  gold:     "#b8924a"
};


const ASSETS = {
  // === HERO LAYERS — proper Jesko multi-phase scroll narrative ===
  // Phase 1: closed window  →  Phase 2: window opens  →  Phase 3: zoom into window
  // Phase 4: clouds passage  →  Phase 5: plane appears + moves up  →  Phase 6: blueprint
  HERO_WINDOW_CLOSED: { src: HERO_WINDOW_CLOSED_DATA, label: "hero_window_closed",  ratio: "16:9" },
  HERO_WINDOW_OPEN:   { src: HERO_WINDOW_OPEN_DATA, label: "hero_window_open",    ratio: "16:9" },
  HERO_SKY:           { src: HERO_SKY_DATA, label: "hero_sky",            ratio: "16:9" },
  HERO_CLOUDS_PASS:   { src: HERO_CLOUDS_PASS_DATA, label: "hero_clouds_pass",    ratio: "9:16" },
  HERO_PLANE:         { src: HERO_PLANE_DATA, label: "hero_plane",          ratio: "16:9", transparent: true },
  HERO_BLUEPRINT:     { src: null,        label: "hero_blueprint",      ratio: "16:9", transparent: true },

  // === PROLOGUE ===
  PROLOGUE_PORTRAIT: { src: PROLOGUE_PORTRAIT_DATA, label: "prologue_heritage_portrait", ratio: "4:5" },

  // === CLOUD STRIP DIVIDER ===
  CLOUDS_FLOAT: { src: CLOUDS_FLOAT_DATA, label: "clouds_floating_element", ratio: "16:9", transparent: true },
  HORIZON:      { src: HORIZON_DATA, label: "horizon_damascus_dawn",   ratio: "2:1" },

  // === MANUFACTURING ===
  FACTORY_EXTERIOR: { src: null, label: "factory_hisya_exterior",  ratio: "3:2" },
  FACTORY_INTERIOR: { src: FACTORY_INTERIOR_DATA, label: "factory_assembly_line",   ratio: "16:9" },
  BLUEPRINT:        { src: BLUEPRINT_DATA, label: "blueprint_floor_plan",    ratio: "16:9", transparent: true },

  // === AUTOMOTIVE FLAGSHIP — image-scale moment ===
  CHANGAN_JORDAN: { src: CHANGAN_JORDAN_DATA, label: "automotive_changan_jordan", ratio: "16:10" },

  // === DIVERSIFICATION (7 cards) ===
  IND_TAXIPHONE:  { src: INDUSTRIES_TAXIPHONE, label: "industries_taxiphone",  ratio: "16:10" },
  IND_FINANCE:    { src: IND_FINANCE_DATA, label: "industries_finance",    ratio: "16:10" },
  IND_REALESTATE: { src: IND_REALESTATE_DATA, label: "industries_realestate", ratio: "16:10" },
  IND_MEDICAL:    { src: IND_MEDICAL_DATA, label: "industries_medical",    ratio: "16:10" },
  IND_PAPER:      { src: IND_PAPER_DATA, label: "industries_paper",      ratio: "16:10" },
  IND_SOLAR:      { src: INDUSTRIES_SOLAR, label: "industries_solar",      ratio: "16:10" },
  IND_MOTORCYCLE: { src: IND_MOTORCYCLE_DATA, label: "industries_motorcycle", ratio: "16:10" },

  // === GLOBAL ===
  GLOBE: { src: GLOBE_DATA, label: "global_brass_globe", ratio: "1:1" },

  // === GEELY VISIT (two wide photos) ===
  GEELY_VISIT_1: { src: GEELY_VISIT_1_DATA, label: "geely_visit_chairman_li_shufu",  ratio: "16:9" },
  GEELY_VISIT_2: { src: GEELY_VISIT_2_DATA, label: "geely_visit_ceo_an_conghui",     ratio: "16:9" },

  // === FUTURE (3 cards) ===
  FUTURE_SPECTRUM: { src: FUTURE_SPECTRUM_DATA, label: "future_spectrum_reconstruction", ratio: "4:3" },
  FUTURE_LEVANT:   { src: FUTURE_LEVANT_DATA, label: "future_levant_university",       ratio: "4:3" },
  FUTURE_FLYSYRIA: { src: FUTURE_FLYSYRIA_DATA, label: "future_flysyria_aviation",       ratio: "4:3" },

  // === CONTACT ===
  CONTACT_LANDSCAPE: { src: null, label: "contact_mountain_landscape", ratio: "2:1" },

  // === VIDEOS ===
  VID_HERO_LOOP:    { src: null, label: "vid_hero_ambient_loop",     ratio: "16:9" },
  VID_FACTORY_LOOP: { src: null, label: "vid_factory_assembly_loop", ratio: "16:9" },
  VID_GLOBE_LOOP:   { src: null, label: "vid_globe_rotation_loop",   ratio: "1:1" }
};

function AssetSlot({ id, style = {}, fit = "cover", motionProps = {} }) {
  const asset = ASSETS[id];
  const baseStyle = {
    width: "100%", height: "100%",
    background: asset && asset.transparent
      ? "transparent"
      : `linear-gradient(135deg, ${COLOR.bgDeep} 0%, ${COLOR.muted} 50%, ${COLOR.ink} 100%)`,
    display: "flex", alignItems: "center", justifyContent: "center",
    overflow: "hidden",
    ...style
  };

  if (asset && asset.src) {
    if (id.startsWith("VID_")) {
      return (
        <motion.video
          autoPlay muted loop playsInline
          style={{ ...baseStyle, objectFit: fit }}
          {...motionProps}
        >
          <source src={asset.src} type="video/mp4" />
        </motion.video>
      );
    }
    return (
      <motion.div
        style={{
          ...baseStyle,
          backgroundImage: `url(${asset.src})`,
          backgroundSize: fit, backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
        {...motionProps}
      />
    );
  }

  // Placeholder — for transparent assets show a dotted outline so they don't disappear visually
  return (
    <motion.div
      style={{
        ...baseStyle,
        border: asset && asset.transparent ? `1px dashed ${COLOR.muted}` : "none"
      }}
      {...motionProps}
    >
      <div style={{
        textAlign: "center", color: asset && asset.transparent ? COLOR.muted : "rgba(243,238,229,0.55)",
        fontFamily: "'Inter Tight', sans-serif", letterSpacing: "0.2em"
      }}>
        <div style={{ fontSize: 11, marginBottom: 6, opacity: 0.7 }}>
          {asset ? asset.label.toUpperCase() : id}
        </div>
        {asset && (
          <div style={{ fontSize: 9, opacity: 0.5, fontFamily: "'Fraunces', serif", fontStyle: "italic" }}>
            {asset.ratio}{asset.transparent ? " · transparent" : ""}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ====== LOADER ====== */
function Loader({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress(p => {
        const next = Math.min(100, p + Math.random() * 6 + 3);
        if (next >= 100) {
          clearInterval(id);
          setTimeout(() => {
            setHidden(true);
            setTimeout(onDone, 1200);
          }, 400);
        }
        return next;
      });
    }, 60);
    return () => clearInterval(id);
  }, [onDone]);

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0, ease: [0.7, 0, 0.3, 1] }}
          style={{
            position: "fixed", inset: 0, background: COLOR.ink, zIndex: 200,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
          }}
        >
          <div style={{ overflow: "hidden", height: "1.1em" }}>
            <motion.div
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.5, 0, 0.1, 1] }}
              style={{
                fontFamily: "'Fraunces', serif", fontWeight: 300, fontStyle: "italic",
                fontSize: "clamp(40px, 7vw, 88px)", color: COLOR.bg,
                letterSpacing: "-0.02em", lineHeight: 1
              }}
            >Mallouk</motion.div>
          </div>
          <div style={{
            width: 220, height: 1, background: "rgba(243,238,229,0.15)",
            marginTop: 36, position: "relative", overflow: "hidden"
          }}>
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: [0.5, 0, 0.2, 1] }}
              style={{ position: "absolute", left: 0, top: 0, height: "100%", background: COLOR.bg }}
            />
          </div>
          <div style={{
            fontFamily: "'Inter Tight', sans-serif", fontSize: 11,
            letterSpacing: "0.4em", color: "rgba(243,238,229,0.5)",
            marginTop: 16, minWidth: 80, textAlign: "center"
          }}>{Math.floor(progress)}%</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ====== NAV ====== */
function Nav() {
  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.6, duration: 1 }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "28px 48px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        mixBlendMode: "difference", color: COLOR.bg
      }}
    >
      <a href="#hero" style={{
        fontFamily: "'Fraunces', serif", fontWeight: 500, fontStyle: "italic",
        fontSize: 22, letterSpacing: "-0.02em", color: "inherit", textDecoration: "none"
      }}>
        Mallouk<sup style={{ fontSize: "0.45em", verticalAlign: "super", fontStyle: "normal", fontWeight: 400 }}>®</sup>
      </a>
      <div style={{ display: "flex", gap: 36 }}>
        {["Heritage", "Automotive", "Industries", "Global", "Contact"].map(item => (
          <NavLink key={item} label={item} />
        ))}
      </div>
      <a href="" style={{
        fontFamily: "'Inter Tight', sans-serif", fontSize: 12, color: "inherit", textDecoration: "none"
      }}></a>
    </motion.nav>
  );
}

function NavLink({ label }) {
  const id = "#" + label.toLowerCase();
  const [hover, setHover] = useState(false);
  return (
    <a
      href={id}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontFamily: "'Inter Tight', sans-serif", fontWeight: 400, fontSize: 12,
        letterSpacing: "0.18em", color: "inherit", textTransform: "uppercase",
        textDecoration: "none", position: "relative", paddingBottom: 6
      }}
    >
      {label}
      <motion.span
        animate={{ width: hover ? "100%" : 0 }}
        transition={{ duration: 0.4, ease: [0.5, 0, 0.2, 1] }}
        style={{ position: "absolute", left: 0, bottom: 0, height: 1, background: "currentColor" }}
      />
    </a>
  );
}

/* ====== SCROLL PROGRESS ====== */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <motion.div
      style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 2,
        background: COLOR.accent, transformOrigin: "0%", scaleX, zIndex: 150
      }}
    />
  );
}

/* ======================================================================
   HERO SEQUENCE v7 — GSAP + ScrollTrigger + Lenis
   Same six-phase narrative as v6 but driven by GSAP timeline with scrub.
   This is the exact stack Jesko Jets uses.
   ====================================================================== */
function HeroSequence({ libsReady }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!libsReady || !window.gsap || !window.ScrollTrigger) return;
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    // Use GSAP context for safe cleanup
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: "+=900%",     // 900vh of scroll runway — matches section height to fix pinSpacer overflow
          scrub: 1,           // smooth scrub tied to scroll
          pin: ".hero-pin",
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
        defaults: { ease: "none" }
      });

      // Phase 1 → 2 (0.00–0.20): headline & closed pane fade out
      tl.to(".hero-content", { opacity: 0, duration: 0.10 }, 0.00)
        .to(".hero-closed",  { opacity: 0, duration: 0.10 }, 0.10);

      // Phase 3 (0.20–0.45): zoom INTO the open window
      tl.to(".hero-frame", { scale: 5,   duration: 0.25 }, 0.20)
        .to(".hero-frame", { opacity: 0, duration: 0.07 }, 0.35)
        .to(".hero-sky",   { scale: 1.3, duration: 0.25 }, 0.20);

      // Phase 4 (0.38–0.65): clouds passage — tall vertical cloud column scrolls UP
      tl.fromTo(".hero-clouds",
            { y: "0%",   opacity: 0 },
            { opacity: 1, duration: 0.07 }, 0.38)
        .to(".hero-clouds", { y: "-60%", duration: 0.25 }, 0.40);

      // Phase 4a: FLOATING TEXT — "Built on heritage. Defined by innovation." rises through the clouds
      // Drifts upward through center of viewport: y from 30vh → 0 → -30vh, opacity 0 → 1 → 0
      tl.fromTo(".hero-cloud-text-1",
            { y: "30vh",  opacity: 0 },
            { y: "0vh",   opacity: 1, duration: 0.05 }, 0.42)
        .to(".hero-cloud-text-1",
            { y: "-30vh", opacity: 0, duration: 0.05 }, 0.47);

      // Phase 4b: FLOATING TEXT — "Welcome to the story of Mallouk" rises through later in the same passage
      tl.fromTo(".hero-cloud-text-2",
            { y: "30vh",  opacity: 0 },
            { y: "0vh",   opacity: 1, duration: 0.05 }, 0.54)
        .to(".hero-cloud-text-2",
            { y: "-30vh", opacity: 0, duration: 0.05 }, 0.59);

      // Phase 4b (0.65): INSTANT CUT — sky/clouds OUT, cream website bg IN
      // No fade. One frame it's the sky narrative, the next it's the website palette.
      tl.set(".hero-sky",       { opacity: 0 },     0.65)
        .set(".hero-clouds",    { opacity: 0 },     0.65)
        .set(".hero-cream-bg",  { opacity: 1 },     0.65);

      // Phase 5 (0.65–0.85): plane appears on cream background, moves UP on scroll
      tl.fromTo(".hero-plane",
            { y: "40vh", opacity: 0 },
            { opacity: 1, duration: 0.05 }, 0.65)
        .to(".hero-plane", { y: "-50vh", duration: 0.18 }, 0.65)
        .to(".hero-plane", { opacity: 0, duration: 0.05 }, 0.80);

      // Phase 5b (0.62–0.78): SIDE TEXT PANELS flanking the jet
      // Left panel slides IN from the left edge, right panel from the right edge.
      // Both fade out as the origins slide takes over at 0.78.
      tl.fromTo(".hero-side-left",
            { x: -80, opacity: 0 },
            { x: 0,  opacity: 1, duration: 0.10 }, 0.62)
        .to(".hero-side-left", { opacity: 0, x: -80, duration: 0.04 }, 0.74);
      tl.fromTo(".hero-side-right",
            { x: 80, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.10 }, 0.62)
        .to(".hero-side-right", { opacity: 0, x: 80, duration: 0.04 }, 0.74);

      // Phase 5c: ORIGINS slide — rises from below, then HOLDS at y:0 to the end of pin.
      //   0.78–0.88  RISE   y:100vh → y:0
      //   0.88–1.20  HOLD   y:0 steady (long rest — ~3 viewports of stillness)
      // No exit tween — sticky CloudStrip below covers origins as user scrolls past hero.
      tl.fromTo(".hero-text-slide",
            { y: "100vh" },
            { y: "0vh", duration: 0.10 }, 0.78)
        .to(".hero-text-slide",
            { y: "0vh", duration: 0.32 }, 0.88);
    }, ref);

    return () => ctx.revert();
  }, [libsReady]);

  const headlineWords = [
    { text: "The" }, { text: "story" }, { text: "of" }, { text: "Mallouk" },
    { text: "begins" }, { text: "with", br: true },
    { text: "vision", italic: true }, { text: "beyond", italic: true }, { text: "limits.", italic: true }
  ];

  return (
    <section ref={ref} id="hero" style={{
      height: "900vh", position: "relative", background: COLOR.bg
    }}>
      <div className="hero-pin" style={{
        position: "relative", width: "100%", height: "100vh", overflow: "hidden",
        background: COLOR.ink
      }}>
        {/* Z=1: SKY (revealed after zoom) */}
        <div className="hero-sky" style={{
          position: "absolute", inset: 0, zIndex: 1,
          transformOrigin: "center center", willChange: "transform"
        }}>
          <AssetSlot id="HERO_SKY" />
        </div>

        {/* Z=2: CLOUDS PASSAGE (tall vertical column) */}
        <div className="hero-clouds" style={{
          position: "absolute", left: 0, right: 0, top: 0, height: "300vh",
          opacity: 0, zIndex: 2, willChange: "transform, opacity"
        }}>
          <AssetSlot id="HERO_CLOUDS_PASS" />
        </div>

        {/* Z=8a: FLOATING "Built on heritage. Defined by innovation." — drifts up through clouds */}
        <div className="hero-cloud-text-1" style={{
          position: "absolute", inset: 0, zIndex: 8, opacity: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "0 8vw", pointerEvents: "none",
          willChange: "transform, opacity"
        }}>
          <h2 style={{
            fontFamily: "'Fraunces', serif", fontWeight: 300, fontStyle: "italic",
            fontSize: "clamp(32px, 5.2vw, 88px)", lineHeight: 1.15, letterSpacing: "-0.02em",
            color: COLOR.bg, textAlign: "center", margin: 0, maxWidth: "1100px",
            textShadow: "0 4px 40px rgba(0,0,0,0.55)"
          }}>
            Built on <em style={{ color: COLOR.gold, fontStyle: "italic" }}>heritage</em>. Defined by <em style={{ color: COLOR.gold, fontStyle: "italic" }}>innovation</em>.
          </h2>
        </div>

        {/* Z=8b: FLOATING "Welcome to the story of Mallouk" — drifts up through later clouds */}
        <div className="hero-cloud-text-2" style={{
          position: "absolute", inset: 0, zIndex: 8, opacity: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "0 8vw", pointerEvents: "none",
          willChange: "transform, opacity"
        }}>
          <h2 style={{
            fontFamily: "'Fraunces', serif", fontWeight: 300, fontStyle: "italic",
            fontSize: "clamp(48px, 8vw, 128px)", lineHeight: 1.1, letterSpacing: "-0.02em",
            color: COLOR.bg, textAlign: "center", margin: 0,
            textShadow: "0 4px 40px rgba(0,0,0,0.55)"
          }}>
            Welcome to the story of <em style={{ color: COLOR.gold, fontStyle: "italic" }}>Mallouk</em>
          </h2>
        </div>

        {/* Z=2.5: CREAM BACKDROP — bridges sky → website palette
            Fades in as the cloud passage ends. Sits above sky/clouds (z=1,2)
            but below plane/blueprint/text-slide so they stand on cream. */}
        <div className="hero-cream-bg" style={{
          position: "absolute", inset: 0, opacity: 0, zIndex: 2,
          background: COLOR.bg, pointerEvents: "none", willChange: "opacity"
        }} />

        {/* Z=3: PLANE — appears on the cream background after the sky has resolved */}
        <div className="hero-plane" style={{
          position: "absolute", inset: 0, opacity: 0, zIndex: 3,
          display: "flex", alignItems: "center", justifyContent: "center",
          pointerEvents: "none", willChange: "transform, opacity"
        }}>
          <div style={{ width: "100%", height: "1000px" }}>
            <AssetSlot id="HERO_PLANE" fit="contain" />
          </div>
        </div>

        {/* Z=10a: PLANE PHASE — LEFT TEXT PANEL — old headline, slides in from the left */}
        <div className="hero-side-left" style={{
          position: "absolute", left: "5vw", top: "50%", transform: "translateY(-50%)",
          maxWidth: "26vw", zIndex: 10, opacity: 0,
          pointerEvents: "none", willChange: "transform, opacity"
        }}>
          <div style={{
            fontFamily: "'Inter Tight', sans-serif", fontSize: 10, fontWeight: 500,
            letterSpacing: "0.4em", textTransform: "uppercase",
            color: COLOR.muted,
            display: "flex", alignItems: "center", gap: 10, marginBottom: 24
          }}>
            <span style={{ width: 24, height: 1, background: COLOR.muted, display: "inline-block" }} />
            The Promise
          </div>
          <h3 style={{
            fontFamily: "'Fraunces', serif", fontWeight: 300,
            fontSize: "clamp(28px, 3vw, 48px)", lineHeight: 1.05, letterSpacing: "-0.02em",
            color: COLOR.ink, margin: 0
          }}>
            The house that brought<br />
            <em style={{ color: COLOR.accent, fontStyle: "italic" }}>Chinese excellence</em><br />
            to the Middle East.
          </h3>
        </div>

        {/* Z=10b: PLANE PHASE — RIGHT TEXT PANEL — old lede, slides in from the right */}
        <div className="hero-side-right" style={{
          position: "absolute", right: "5vw", top: "50%", transform: "translateY(-50%)",
          maxWidth: "26vw", zIndex: 10, opacity: 0,
          pointerEvents: "none", willChange: "transform, opacity"
        }}>
          <div style={{
            fontFamily: "'Inter Tight', sans-serif", fontSize: 10, fontWeight: 500,
            letterSpacing: "0.4em", textTransform: "uppercase",
            color: COLOR.muted,
            display: "flex", alignItems: "center", gap: 10, marginBottom: 24
          }}>
            <span style={{ width: 24, height: 1, background: COLOR.muted, display: "inline-block" }} />
            The Footprint
          </div>
          <p style={{
            fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 300,
            fontSize: "clamp(15px, 1.2vw, 19px)", lineHeight: 1.6,
            color: COLOR.inkSoft, margin: 0
          }}>
            Across <em style={{ color: COLOR.accent, fontStyle: "italic" }}>forty years</em> and six nations,
            one family-owned group has quietly built the bridge between two of the world's greatest civilizations
            — vehicle by vehicle, factory by factory, idea by idea.
          </p>
        </div>

        {/* Z=10: MALLOUK / SYRIA narrative slide — TWO-COLUMN layout
            Left:  PROLOGUE_PORTRAIT image (placeholder until you upload it)
            Right: origins text (eyebrow, headline, body, signature) */}
        <div className="hero-text-slide" style={{
          position: "absolute", inset: 0, zIndex: 15,
          transform: "translateY(100vh)",
          display: "flex", alignItems: "center",
          padding: "0 8vw", pointerEvents: "none", willChange: "transform",
          background: COLOR.bg
        }}>
          <div style={{
            width: "100%", display: "grid",
            gridTemplateColumns: "1fr 1.1fr", gap: "5vw", alignItems: "center"
          }}>
            {/* LEFT COLUMN: heritage portrait */}
            <div style={{
              width: "100%", aspectRatio: "4 / 5",
              borderRadius: 2, overflow: "hidden", maxHeight: "170vh"
            }}>
              <AssetSlot id="PROLOGUE_PORTRAIT" />
            </div>

            {/* RIGHT COLUMN: origins text */}
            <div>
              {/* Eyebrow */}
              <div style={{
                fontFamily: "'Inter Tight', sans-serif", fontSize: 11, fontWeight: 400,
                letterSpacing: "0.4em", textTransform: "uppercase",
                color: COLOR.muted,
                display: "flex", alignItems: "center", gap: 12, marginBottom: 28
              }}>
                <span style={{ width: 28, height: 1, background: COLOR.muted, display: "inline-block" }} />
                01 / Origins
              </div>

              {/* Display headline */}
              <h2 style={{
                fontFamily: "'Fraunces', serif", fontWeight: 300,
                fontSize: "clamp(36px, 4.5vw, 72px)", lineHeight: 1, letterSpacing: "-0.03em",
                color: COLOR.ink, marginBottom: 28
              }}>
                A family <em style={{ color: COLOR.accent, fontStyle: "italic" }}>chose</em><br />
                to build.
              </h2>

              {/* Body */}
              <p style={{
                fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 300,
                fontSize: "clamp(15px, 1.3vw, 19px)", lineHeight: 1.65,
                color: COLOR.inkSoft, marginBottom: 12
              }}>
                In 1981, when Syria was suffering from blockade, the Mallouks did what merchants
                have done for centuries on this land. They observed and waited. And when the door
                cracked open, they walked through it carrying a vision no one in the region had
                ever carried before.
              </p>

              {/* Hairline + signature */}
              <div style={{
                marginTop: 24, paddingTop: 18, borderTop: `1px solid ${COLOR.line}`,
                fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 300,
                fontSize: 16, color: COLOR.ink
              }}>
                Mallouk Group
                <small style={{
                  display: "block", fontFamily: "'Inter Tight', sans-serif", fontStyle: "normal",
                  fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase",
                  color: COLOR.muted, marginTop: 6
                }}>Damascus  ·  Amman  ·  Beirut  ·  Erbil  ·  Cairo  ·  Shanghai</small>
              </div>
            </div>
          </div>
        </div>

        {/* Z=5: WINDOW OPEN — scales up to zoom INTO it */}
        <div className="hero-frame" style={{
          position: "absolute", inset: 0, zIndex: 5,
          transformOrigin: "center center", pointerEvents: "none", willChange: "transform, opacity"
        }}>
          <AssetSlot id="HERO_WINDOW_OPEN" />
        </div>

        {/* Z=6: WINDOW CLOSED — covers the open one initially, fades out as window "opens" */}
        <div className="hero-closed" style={{
          position: "absolute", inset: 0, zIndex: 6,
          transformOrigin: "center center", pointerEvents: "none", willChange: "opacity"
        }}>
          <AssetSlot id="HERO_WINDOW_CLOSED" />
        </div>

        {/* Atmospheric tint */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 7, pointerEvents: "none",
          background: "radial-gradient(ellipse at 50% 100%, rgba(184,146,74,0.10), transparent 60%)"
        }} />

        {/* Z=10: Headline content */}
        <div className="hero-content" style={{
          position: "absolute", inset: 0, zIndex: 10,
          padding: "0 8vw",
          display: "flex", flexDirection: "column", justifyContent: "center",
          pointerEvents: "none"
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            style={{
              fontFamily: "'Inter Tight', sans-serif", fontWeight: 400, fontSize: 12,
              letterSpacing: "0.32em", color: COLOR.gold, textTransform: "uppercase",
              marginBottom: 28, display: "flex", alignItems: "center", gap: 14
            }}
          >
            <span style={{ width: 32, height: 1, background: COLOR.gold, display: "inline-block" }} />
            Mallouk Group&nbsp;&nbsp;/&nbsp;&nbsp;Since 1981
          </motion.div>

          <h1 style={{
            fontFamily: "'Fraunces', serif", fontWeight: 300,
            fontSize: "clamp(56px, 9.5vw, 168px)",
            lineHeight: 0.92, letterSpacing: "-0.04em", color: COLOR.bg,
            marginBottom: 32, maxWidth: 1100,
            textShadow: "0 2px 40px rgba(0,0,0,0.5)"
          }}>
            {headlineWords.map((w, i) => (
              <React.Fragment key={i}>
                <span style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}>
                  <motion.span
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1.1, delay: 1.3 + i * 0.08, ease: [0.3, 0, 0.2, 1] }}
                    style={{
                      display: "inline-block",
                      fontStyle: w.italic ? "italic" : "normal",
                      color: w.italic ? COLOR.gold : "inherit"
                    }}
                  >{w.text}&nbsp;</motion.span>
                </span>
                {w.br && <br />}
              </React.Fragment>
            ))}
          </h1>

        </div>

        {/* Scroll cue */}
        <div className="hero-content" style={{
          position: "absolute", bottom: 40, left: "8vw", zIndex: 10,
          fontFamily: "'Inter Tight', sans-serif", fontSize: 10,
          letterSpacing: "0.4em", color: "rgba(243,238,229,0.7)", textTransform: "uppercase",
          display: "flex", alignItems: "center", gap: 16
        }}>
          <motion.span
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: 6, height: 6, borderRadius: "50%", background: COLOR.gold, display: "inline-block" }}
          />
          Scroll · the window opens
        </div>
      </div>
    </section>
  );
}

/* ======================================================================
   THREE-GLOBE — real 3D rotating globe with city pins (replaces 2D image)
   ====================================================================== */
function ThreeGlobe() {
  const mountRef = useRef(null);
  const cleanupRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    try {
      const SIZE = 460;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
      camera.position.z = 3.2;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(SIZE, SIZE);
      renderer.setPixelRatio(window.devicePixelRatio || 1);
      mount.appendChild(renderer.domElement);

      // Inner solid sphere (subtle dark base)
      const baseGeo = new THREE.SphereGeometry(0.99, 64, 64);
      const baseMat = new THREE.MeshBasicMaterial({
        color: 0x14140f, transparent: true, opacity: 0.55
      });
      const base = new THREE.Mesh(baseGeo, baseMat);
      scene.add(base);

      // Wireframe globe (the visible structure — gold)
      const wireGeo = new THREE.SphereGeometry(1.0, 28, 18);
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0xb8924a, wireframe: true, transparent: true, opacity: 0.55
      });
      const wire = new THREE.Mesh(wireGeo, wireMat);
      scene.add(wire);

      // Equator + meridian rings (slightly brighter)
      const equatorGeo = new THREE.TorusGeometry(1.005, 0.003, 8, 96);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xb8924a, transparent: true, opacity: 0.85
      });
      const equator = new THREE.Mesh(equatorGeo, ringMat);
      equator.rotation.x = Math.PI / 2;
      scene.add(equator);

      const meridian = new THREE.Mesh(equatorGeo, ringMat);
      scene.add(meridian);

      // City pin markers — Mallouk's 8 locations
      const cities = [
        [33.5138,  36.2765],  // Damascus
        [31.9539,  35.9106],  // Amman
        [33.8938,  35.5018],  // Beirut
        [36.1911,  44.0094],  // Erbil
        [30.0444,  31.2357],  // Cairo
        [31.2304, 121.4737],  // Shanghai
        [22.3193, 114.1694],  // Hong Kong
        [32.0617, 118.7778],  // Jiangsu
      ];

      const pinGroup = new THREE.Group();
      cities.forEach(([lat, lng]) => {
        const phi = (90 - lat) * Math.PI / 180;
        const theta = (lng + 180) * Math.PI / 180;
        const x = -Math.sin(phi) * Math.cos(theta);
        const y =  Math.cos(phi);
        const z =  Math.sin(phi) * Math.sin(theta);

        // Brick-red pin
        const pinGeo = new THREE.SphereGeometry(0.025, 12, 12);
        const pinMat = new THREE.MeshBasicMaterial({ color: 0x8a2a0c });
        const pin = new THREE.Mesh(pinGeo, pinMat);
        pin.position.set(x * 1.015, y * 1.015, z * 1.015);
        pinGroup.add(pin);

        // Faint glow ring around pin
        const glowGeo = new THREE.RingGeometry(0.035, 0.05, 16);
        const glowMat = new THREE.MeshBasicMaterial({
          color: 0xb8924a, transparent: true, opacity: 0.4, side: THREE.DoubleSide
        });
        const glow = new THREE.Mesh(glowGeo, glowMat);
        glow.position.set(x * 1.015, y * 1.015, z * 1.015);
        glow.lookAt(0, 0, 0);
        pinGroup.add(glow);
      });
      scene.add(pinGroup);

      // Tilt the globe slightly for a more dynamic look
      base.rotation.x = wire.rotation.x = pinGroup.rotation.x = equator.rotation.x = 0.25;
      meridian.rotation.x = 0.25;

      let animationId;
      function animate() {
        animationId = requestAnimationFrame(animate);
        const r = 0.0018;
        base.rotation.y     += r;
        wire.rotation.y     += r;
        pinGroup.rotation.y += r;
        equator.rotation.z  += r;  // around the tilt axis
        renderer.render(scene, camera);
      }
      animate();

      cleanupRef.current = () => {
        if (animationId) cancelAnimationFrame(animationId);
        if (renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
        renderer.dispose();
        baseGeo.dispose(); baseMat.dispose();
        wireGeo.dispose(); wireMat.dispose();
        equatorGeo.dispose(); ringMat.dispose();
      };
    } catch (err) {
      console.error("ThreeGlobe failed to initialize:", err);
    }

    return () => {
      if (cleanupRef.current) cleanupRef.current();
    };
  }, []);

  return <div ref={mountRef} style={{ width: 460, height: 460 }} />;
}

/* ======================================================================
   THREE-GLOBE-IMAGE — procedurally-drawn dark earth as a real 3D sphere.
   Continent silhouettes are painted on a 2048×1024 canvas in equirectangular
   projection, then mapped to a Three.js sphere. Phong material + directional
   light produces a real day/night terminator. Brick-red pins mark the eight
   Mallouk locations.
   ====================================================================== */
function ThreeGlobeImage() {
  const mountRef = useRef(null);
  const cleanupRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount) return;

    let animationIdRef = null;

    try {
      // ============================================================
      // Scene
      // ============================================================
      const SIZE = 520;

      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(
        40,
        1,
        0.1,
        100
      );

      camera.position.z = 3;

      // ============================================================
      // Renderer
      // ============================================================
      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
      });

      renderer.setSize(SIZE, SIZE);

      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
      );

      mount.appendChild(renderer.domElement);

      // ============================================================
      // Textures
      // ============================================================
      // ضع الصور داخل:
      // public/images/

      const textureLoader = new THREE.TextureLoader();

      // صورة الأرض
      const texture = textureLoader.load(
        GLOBE_DATA
      );

      texture.colorSpace =
        THREE.SRGBColorSpace;

      texture.anisotropy =
        renderer.capabilities.getMaxAnisotropy();

      // Normal map للتضاريس
      const normalMap =
        textureLoader.load(
          "https://threejs.org/examples/textures/planets/earth_normal_2048.jpg"
        );

      // ============================================================
      // Globe
      // ============================================================
      const geometry =
        new THREE.SphereGeometry(
          1,
          256,
          256
        );

      const material =
        new THREE.MeshPhongMaterial({
          map: texture,

          normalMap: normalMap,

          normalScale:
            new THREE.Vector2(
              0.6,
              0.6
            ),

          shininess: 12,

          specular:
            new THREE.Color(
              0x444444
            )
        });

      const sphere =
        new THREE.Mesh(
          geometry,
          material
        );

      scene.add(sphere);

      // ============================================================
      // Lighting
      // ============================================================
      const ambient =
        new THREE.AmbientLight(
          0xffffff,
          0.9
        );

      scene.add(ambient);

      const sun =
        new THREE.DirectionalLight(
          0xffffff,
          2
        );

      sun.position.set(
        5,
        2,
        5
      );

      scene.add(sun);

      // ============================================================
      // Gold Rings
      // ============================================================
      const ringGeo =
        new THREE.TorusGeometry(
          1.005,
          0.0025,
          16,
          200
        );

      const ringMat =
        new THREE.MeshBasicMaterial({
          color: 0xb8924a,
          transparent: true,
          opacity: 0.35
        });

      const equator =
        new THREE.Mesh(
          ringGeo,
          ringMat
        );

      equator.rotation.x =
        Math.PI / 2;

      scene.add(equator);

      const meridian =
        new THREE.Mesh(
          ringGeo,
          ringMat
        );

      scene.add(meridian);

      // ============================================================
      // Tilt
      // ============================================================
      const tilt = 0.20;

      sphere.rotation.x = tilt;

      equator.rotation.z = tilt;

      meridian.rotation.z = tilt;

      // ============================================================
      // Animation
      // ============================================================
      function animate() {
        animationIdRef =
          requestAnimationFrame(
            animate
          );

        const r = 0.003;

        sphere.rotation.y += r;

        equator.rotation.y += r;

        meridian.rotation.y += r;

        renderer.render(
          scene,
          camera
        );
      }

      animate();

      // ============================================================
      // Cleanup
      // ============================================================
      cleanupRef.current = () => {
        if (animationIdRef) {
          cancelAnimationFrame(
            animationIdRef
          );
        }

        if (
          renderer.domElement
            .parentNode
        ) {
          renderer.domElement.parentNode.removeChild(
            renderer.domElement
          );
        }

        renderer.dispose();

        geometry.dispose();

        material.dispose();

        texture.dispose();

        normalMap.dispose();

        ringGeo.dispose();

        ringMat.dispose();
      };
    } catch (err) {
      console.error(
        "ThreeGlobeImage failed:",
        err
      );

      mount.innerHTML = `
        <div style="
          width:100%;
          height:100%;
          display:flex;
          align-items:center;
          justify-content:center;
          color:#b8924a;
          font-family:monospace;
          font-size:12px;
        ">
          Globe load failed
        </div>
      `;
    }

    return () => {
      if (
        cleanupRef.current
      ) {
        cleanupRef.current();
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: 520,
        height: 520
      }}
    />
  );
}
/* ====== CLOUD STRIP ====== */
function CloudStrip() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const xC1 = useTransform(scrollYProgress, [0, 1], ["-30%", "30%"]);
  const xC2 = useTransform(scrollYProgress, [0, 1], ["30%", "-30%"]);
  const yHorizon = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <section ref={ref} style={{
      height: "200vh", position: "relative",
      background: `linear-gradient(180deg, ${COLOR.bg} 0%, ${COLOR.bgDeep} 100%)`
    }}>
      {/* Sticky cover: locks to viewport top for 100vh of scroll within this 200vh section.
          When hero pin releases, this sticky takes over, covering the viewport instantly. */}
      <div style={{
        position: "sticky", top: 0, height: "180vh", overflow: "hidden",
        background: `linear-gradient(180deg, ${COLOR.bg} 0%, ${COLOR.bgDeep} 100%)`
      }}>
        <motion.div style={{ position: "absolute", inset: 0, y: yHorizon, opacity: 0.85 }}>
          <AssetSlot id="HORIZON" />
        </motion.div>
        <motion.div style={{
          position: "absolute", top: "10%", width: "50%", height: "55%", x: xC1, opacity: 0.6
        }}>
          <AssetSlot id="CLOUDS_FLOAT" fit="contain" />
        </motion.div>
        <motion.div style={{
          position: "absolute", top: "45%", right: 0, width: "60%", height: "50%", x: xC2, opacity: 0.45
        }}>
          <AssetSlot id="CLOUDS_FLOAT" fit="contain" />
        </motion.div>
      </div>
    </section>
  );
}

/* ====== TIMELINE — dynamic horizontal scroll measurement ====== */
function Timeline() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [travel, setTravel] = useState(2500);
  const [sectionHeight, setSectionHeight] = useState("400vh");

  const milestones = [
    {
      year: "1981", italic: true, title: "Founded",
      body: "The Mallouk family established the group in Syria by commencing its motorcycle SKD factory business with HONDA, YAMAHA and SUZUKI while importation was prohibited during economic blockade in the country."
    },
    {
      year: "1991", title: "The Door Opens",
      body: "Mallouk Trading Company (Mallouk & Co) was established in 1991 in Syria as the Syrian government alleviated part of the importation restriction. Mallouk & Co soon acquired distributorship of the VW Group from Germany (AUDI, SKODA & VOLKSWAGEN) and the business rapidly covered the entire territory of Syria."
    },
    {
      year: "1990s", title: "Pioneering China",
      body: "With the chairman's strategic vision, Mallouk & Co became one of the first companies in the world importing various kinds of vehicles from the industrial production of China in the 1990s. Mallouk & Co is also the very first overseas buyer and distributor of multiple Chinese automotive brands and the very first company to import Chinese vehicles into the Middle East regions."
    },
    {
      year: "1995", title: "Financing Arm",
      body: "Automotive financing services begin — over 100,000 cars financed and $1.5 billion deployed in the three decades that follow."
    },
    {
      year: "2009", title: "Public Transport",
      body: "Sole licensed private operator of public transportation in Damascus. Taxi Phone — 240 drivers, citywide coverage."
    },
    {
      year: "2014", title: "Healthcare",
      body: "Phoenix Advanced Systems launches in Jordan — exclusive distributor for Atlas Copco, serving the Middle East's leading medical-tourism market."
    },
    {
      year: "2023", italic: true, title: "The Historic First",
      body: "May 2023 — Changan, in partnership with Mallouk Group, becomes the first Chinese automotive brand ever to lead a foreign market. Jordan, #1."
    },
    {
      year: "Today", title: "Forty-four Years",
      body: "Six nations. Eight industries. One family. The work continues."
    }
  ];

  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      const trackWidth = trackRef.current.scrollWidth;
      const vw = window.innerWidth;
      const t = Math.max(0, trackWidth - vw + 200);
      setTravel(t);
      setSectionHeight(`${window.innerHeight + t}px`);
    };
    measure();
    window.addEventListener("resize", measure);
    document.fonts && document.fonts.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -travel]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={sectionRef} id="heritage" style={{
      background: COLOR.ink, color: COLOR.bg, height: sectionHeight, position: "relative"
    }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "14vh", left: "8vw", zIndex: 5 }}>
          <SectionTag dark>02 / Heritage</SectionTag>
          <h2 style={{
            fontFamily: "'Fraunces', serif", fontWeight: 300,
            fontSize: "clamp(36px, 5vw, 64px)", lineHeight: 1, letterSpacing: "-0.03em",
              color: "white"
          }}>
            A timeline<br />of <em style={{ color: COLOR.gold, fontStyle: "italic" }}>firsts</em>.
          </h2>
        </div>

        <motion.div ref={trackRef} style={{
          display: "flex", gap: "8vw", padding: "0 8vw",
          height: "100%", alignItems: "center", x, willChange: "transform",
          marginTop:"200px"
        }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 1, background: "rgba(243,238,229,0.15)" }} />
          {milestones.map((m, i) => <Milestone key={i} {...m} />)}
        </motion.div>

        <div style={{
          position: "absolute", bottom: "6vh", left: "8vw", right: "8vw",
          height: 1, background: "rgba(243,238,229,0.15)"
        }}>
          <motion.div style={{ height: "100%", background: COLOR.gold, width: progressWidth, transformOrigin: "0%" }} />
        </div>
        <div style={{
          position: "absolute", bottom: "8vh", right: "8vw",
          fontFamily: "'Inter Tight', sans-serif", fontSize: 10, letterSpacing: "0.3em",
          color: "rgba(243,238,229,0.5)", textTransform: "uppercase"
        }}>→ scroll to advance</div>
      </div>
    </section>
  );
}

function Milestone({ year, italic, title, body }) {
  return (
    <div style={{ flex: "0 0 auto", width: 380, position: "relative", padding: "80px 0" }}>
      <div style={{
        fontFamily: "'Fraunces', serif", fontWeight: 200,
        fontSize: 88, lineHeight: 0.9, letterSpacing: "-0.04em",
        color: COLOR.bg, marginBottom: 16,
        fontStyle: italic ? "italic" : "normal"
      }}>
        <span style={italic ? { color: COLOR.gold } : {}}>{year}</span>
      </div>
      <h3 style={{
        fontFamily: "'Inter Tight', sans-serif", fontWeight: 500, fontSize: 14,
        letterSpacing: "0.2em", textTransform: "uppercase", color: COLOR.gold, marginBottom: 16
      }}>{title}</h3>
      <p style={{ fontSize: 14, lineHeight: 1.65, color: "rgba(243,238,229,0.75)", fontWeight: 300 }}>{body}</p>
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        width: 12, height: 12, borderRadius: "50%", background: COLOR.gold,
        boxShadow: "0 0 0 8px rgba(184,146,74,0.15)"
      }} />
    </div>
  );
}

/* ====== AUTOMOTIVE ====== */
function Automotive() {
  return (
    <>
      <section id="automotive" style={{ background: COLOR.bg, padding: "16vh 8vw" }}>
        <FadeUp>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8vw",
            alignItems: "end", marginBottom: "8vh"
          }}>
            <h2 style={{
              fontFamily: "'Fraunces', serif", fontWeight: 300,
              fontSize: "clamp(48px, 7vw, 104px)", lineHeight: 0.95, letterSpacing: "-0.04em"
            }}>
              The <em style={{ color: COLOR.accent, fontStyle: "italic" }}>flagship</em><br />that started it all.
            </h2>
            <p style={{
              fontSize: 16, lineHeight: 1.7, color: COLOR.inkSoft, fontWeight: 300, maxWidth: 520
            }}>
              With over 40 years' experience of automotive manufacturing & distributorship in the Middle East
              market, records of more than 200,000 units sold in global market, and holding awards of top-10
              importers for a consecutive of years, Mallouk & Co stays the market leader in the Middle East in terms of automobile manufacturing, trading, branding, marketing, sales and after-sales.
            </p>
          </div>
          <div style={{
            fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 300,
            fontSize: "clamp(20px, 2.2vw, 30px)", color: COLOR.accent,
            letterSpacing: "-0.01em", marginTop: 8
          }}>
            The legend of Mallouk Group is to be continued.
          </div>
        </FadeUp>
      </section>

      <ImageScaleBlock />

      <section style={{ background: COLOR.bg, padding: "8vh 8vw 16vh" }}>
        <FadeUp><Flagship /></FadeUp>
        <StatGrid />
        <h3 style={{
          fontFamily: "'Fraunces', serif", fontWeight: 300, fontSize: 32,
          fontStyle: "italic", marginBottom: 32, color: COLOR.inkSoft
        }}>The network.</h3>
        <NetworkGrid />
      </section>
    </>
  );
}

function ImageScaleBlock() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.5, 1.4]);
  const textOpacity = useTransform(scrollYProgress, [0.4, 0.6], [0, 1]);

  return (
    <div ref={ref} style={{ height: "200vh", position: "relative" }}>
      <div style={{
        position: "sticky", top: 0, height: "100vh", overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <motion.div style={{ width: "47vw", aspectRatio: "16 / 10", scale, borderRadius: 2, overflow: "hidden" }}>
          <AssetSlot id="CHANGAN_JORDAN" />
        </motion.div>
        <motion.div style={{
          position: "absolute", inset: 0, display: "flex",
          alignItems: "center", justifyContent: "center", pointerEvents: "none",
          opacity: textOpacity
        }}>
          <div style={{
            fontFamily: "'Fraunces', serif", fontWeight: 200, fontStyle: "italic",
            fontSize: "clamp(40px, 7vw, 120px)", color: COLOR.bg,
            textAlign: "center", letterSpacing: "-0.03em", lineHeight: 1,
            mixBlendMode: "unset",
            marginTop:"333px"
          }}>Jordan, May 2023</div>
        </motion.div>
      </div>
    </div>
  );
}

function Flagship() {
  return (
    <div style={{
      background: COLOR.ink, color: COLOR.bg,
      padding: "6vw", margin: "8vh 0",
      display: "grid", gridTemplateColumns: "0.8fr 1fr", gap: "4vw",
      borderRadius: 2, position: "relative", overflow: "hidden"
    }}>
      <div style={{
        position: "absolute", top: 24, right: 32,
        fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 200,
        fontSize: 64, color: "rgba(243,238,229,0.08)", lineHeight: 1
      }}>01</div>
      <div style={{
        fontFamily: "'Fraunces', serif", fontWeight: 200,
        fontSize: "clamp(80px, 12vw, 200px)", lineHeight: 0.85, letterSpacing: "-0.05em",
        color: COLOR.gold
      }}>
        1<sup style={{ fontSize: "0.4em" }}>st</sup>
        <small style={{
          display: "block", fontSize: "0.16em", fontFamily: "'Inter Tight', sans-serif", fontWeight: 400,
          letterSpacing: "0.4em", color: "rgba(243,238,229,0.5)", textTransform: "uppercase",
          marginTop: 20
        }}>Jordan, May 2023</small>
      </div>
      <div style={{ alignSelf: "end" }}>
        <div style={{
          fontFamily: "'Inter Tight', sans-serif", fontSize: 11, letterSpacing: "0.4em",
          textTransform: "uppercase", color: COLOR.gold, marginBottom: 20
        }}>A Historic Moment</div>
        <h3 style={{
          fontFamily: "'Fraunces', serif", fontWeight: 300, fontStyle: "italic",
          fontSize: "clamp(24px, 2.6vw, 38px)", lineHeight: 1.2, marginBottom: 24
        }}>
          A first for the family. A first for an industry.
        </h3>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(243,238,229,0.75)", fontWeight: 300 }}>
          In May 2023, Changan — distributed by Mallouk Group — became the #1 brand by monthly sales and
          market share in Jordan. Not just a Mallouk milestone. A milestone for an entire industry.
          Changan held the Top 1 position in the entire year of 2023, and remained top-three throughout
          2024 and 2025.
        </p>
      </div>
    </div>
  );
}

function StatGrid() {
  const stats = [
    { value: 200000, suffix: "+", label: "Units Sold Globally" },
    { value: 30, suffix: "+", label: "4S Facilities Worldwide" },
    { value: 44, suffix: "", label: "Years of Operation", italic: true },
    { value: 6, suffix: "", label: "Countries" }
  ];
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0,
      borderTop: `1px solid ${COLOR.line}`, borderBottom: `1px solid ${COLOR.line}`,
      margin: "8vh 0"
    }}>
      {stats.map((s, i) => <Stat key={i} {...s} delay={i * 0.12} isLast={i === stats.length - 1} />)}
    </div>
  );
}

function Stat({ value, suffix, label, italic, delay, isLast }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const duration = 2000;
    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.floor(value * eased));
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }, [inView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.3, 0, 0.2, 1] }}
      style={{
        padding: "48px 32px",
        borderRight: isLast ? "none" : `1px solid ${COLOR.line}`
      }}
    >
      <div style={{
        fontFamily: "'Fraunces', serif", fontWeight: 200,
        fontSize: "clamp(48px, 5.5vw, 84px)", lineHeight: 1, letterSpacing: "-0.03em",
        color: italic ? COLOR.accent : COLOR.ink, fontStyle: italic ? "italic" : "normal",
        marginBottom: 12
      }}>
        {display.toLocaleString()}{suffix}
      </div>
      <div style={{
        fontFamily: "'Inter Tight', sans-serif", fontSize: 11, letterSpacing: "0.25em",
        textTransform: "uppercase", color: COLOR.muted
      }}>{label}</div>
    </motion.div>
  );
}

function NetworkGrid() {
  const items = [
    { country: "Syria", count: "Six Cities", cities: "Aleppo  ·  Homs  ·  Damascus  ·  Lattakia  ·  Tartous  ·  Hama" },
    { country: "Jordan", count: "Three Cities", cities: "Amman  ·  Irbid  ·  Aqaba" },
    { country: "Iraq", count: "Three Cities", cities: "Dohuk  ·  Sulaymaniyah  ·  Erbil" },
    { country: "Lebanon  ·  Egypt", count: "Capital Hubs", cities: "Beirut  ·  Cairo" }
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "4vw 8vw", marginTop: "6vh" }}>
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, delay: i * 0.12, ease: [0.3, 0, 0.2, 1] }}
          style={{ borderTop: `1px solid ${COLOR.line}`, paddingTop: 28 }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
            <h4 style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, fontStyle: "italic", fontSize: 28, letterSpacing: "-0.01em" }}>{item.country}</h4>
            <span style={{
              fontFamily: "'Inter Tight', sans-serif", fontSize: 12, letterSpacing: "0.2em",
              color: COLOR.muted, textTransform: "uppercase"
            }}>{item.count}</span>
          </div>
          <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 14, color: COLOR.inkSoft }}>{item.cities}</div>
        </motion.div>
      ))}
    </div>
  );
}

/* ====== MANUFACTURING ====== */
function Manufacturing() {
  return (
    <section style={{ background: COLOR.bgDeep, padding: "16vh 8vw" }}>
      <FadeUp>
        <div style={{
          position: "relative", height: "80vh", marginBottom: "8vh",
          overflow: "hidden", borderRadius: 2
        }}>
          {ASSETS.VID_FACTORY_LOOP.src ? <AssetSlot id="VID_FACTORY_LOOP" /> : <AssetSlot id="FACTORY_INTERIOR" />}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "linear-gradient(180deg, rgba(20,20,15,0.2) 0%, transparent 35%, transparent 65%, rgba(20,20,15,0.7) 100%)"
          }} />
          <div style={{ position: "absolute", bottom: 40, left: 40, color: COLOR.bg }}>
            <div style={{
              fontFamily: "'Inter Tight', sans-serif", fontSize: 11, letterSpacing: "0.4em",
              textTransform: "uppercase", color: COLOR.gold, marginBottom: 8
            }}>Hisya Industrial City  /  Homs, Syria</div>
            <div style={{
              fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 300,
              fontSize: "clamp(24px, 3vw, 40px)", letterSpacing: "-0.01em"
            }}>Where the future is assembled.</div>
          </div>
        </div>
      </FadeUp>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "6vw", alignItems: "start" }}>
        <FadeUp>
          <SectionTag>03 / Manufacturing</SectionTag>
          <h2 style={{
            fontFamily: "'Fraunces', serif", fontWeight: 300,
            fontSize: "clamp(40px, 6vw, 88px)", lineHeight: 0.98, letterSpacing: "-0.03em",
            marginBottom: 32
          }}>
            From distribution<br />to <em style={{ color: COLOR.accent, fontStyle: "italic" }}>industry</em>.
          </h2>
          <Para>Mallouk Industries operates Syria's largest and most advanced KD assembly plant — one of the few companies in the country licensed for full CKD production. Welding lines, paint lines, and quality systems built to international standards.</Para>
          <Para>Located in Hisya Industrial City, the plant sits at the crossroads of three continents — and a road network that connects Syria to all its neighbors.</Para>
        </FadeUp>

        <FadeUp delay={0.15}><PlantCard /></FadeUp>
      </div>

      <ProcessSteps />
    </section>
  );
}

function PlantCard() {
  const rows = [
    ["Location", "Hisya, Homs, Syria"],
    ["Total Area", "40,000 m²"],
    ["Passenger Line", "30 work stations"],
    ["Pick-up Line", "22 work stations"],
    ["License", "Full CKD Production"],
    ["To Damascus", "110 km"],
    ["To Tartous Port", "100 km"],
    ["To Lebanon Border", "45 km"]
  ];
  return (
    <div style={{ background: COLOR.bg, padding: 48, border: `1px solid ${COLOR.line}` }}>
      <div style={{ width: "100%", aspectRatio: "16 / 9", marginBottom: 24, overflow: "hidden" }}>
        <AssetSlot id="BLUEPRINT" fit="contain" />
      </div>
      <div style={{
        fontFamily: "'Inter Tight', sans-serif", fontSize: 11, letterSpacing: "0.4em",
        textTransform: "uppercase", color: COLOR.accent, marginBottom: 16
      }}>Hisya Plant  /  Specifications</div>
      <h3 style={{
        fontFamily: "'Fraunces', serif", fontWeight: 300, fontStyle: "italic",
        fontSize: 28, lineHeight: 1.2, marginBottom: 32, letterSpacing: "-0.01em"
      }}>Syria's largest automotive assembly facility.</h3>
      {rows.map(([k, v], i) => (
        <div key={i} style={{
          display: "flex", justifyContent: "space-between", padding: "14px 0",
          borderTop: `1px solid ${COLOR.line}`,
          fontFamily: "'Inter Tight', sans-serif", fontSize: 13,
          ...(i === rows.length - 1 ? { borderBottom: `1px solid ${COLOR.line}` } : {})
        }}>
          <span style={{ color: COLOR.muted, letterSpacing: "0.1em", textTransform: "uppercase", fontSize: 11 }}>{k}</span>
          <span style={{ color: COLOR.ink, fontWeight: 500 }}>{v}</span>
        </div>
      ))}
    </div>
  );
}

function ProcessSteps() {
  const steps = [
    ["i.", "Planning", "Detailed scheduling and resource allocation, line by line."],
    ["ii.", "Sourcing", "Procurement of high-quality parts from trusted suppliers."],
    ["iii.", "Assembly", "Precision manufacturing with skilled technicians."],
    ["iv.", "Quality", "Rigorous testing and inspection at every checkpoint."],
    ["v.", "Distribution", "Efficient delivery to the dealership network."]
  ];
  return (
    <div style={{ marginTop: "8vh", display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 0 }}>
      {steps.map(([num, h, p], i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: i * 0.1 }}
          style={{ padding: "32px 24px", borderRight: i === steps.length - 1 ? "none" : `1px solid ${COLOR.line}` }}
        >
          <div style={{
            fontFamily: "'Fraunces', serif", fontWeight: 300, fontStyle: "italic",
            fontSize: 14, color: COLOR.accent, marginBottom: 12
          }}>{num}</div>
          <h4 style={{ fontFamily: "'Fraunces', serif", fontWeight: 400, fontSize: 18, marginBottom: 8 }}>{h}</h4>
          <p style={{ fontSize: 13, color: COLOR.muted, lineHeight: 1.55, fontWeight: 300 }}>{p}</p>
        </motion.div>
      ))}
    </div>
  );
}

/* ====== DIVERSIFICATION — 7 cards including Mallouk-made motorcycles ====== */
function Diversification() {
  const paths = [
    { num: "i.",  name: "Public",     em: "Transport",  body: "Sole licensed private operator in Damascus. Taxi Phone — 240 drivers and a citywide red-and-white fleet. SHAMUNA — 1,200 city buses replacing aging microbuses.", meta: "Since 2009", slot: "IND_TAXIPHONE" },
    { num: "ii.", name: "Automotive", em: "Finance",    body: "Over 100,000 vehicles financed. $1.5 billion deployed across three decades. Seven regional offices, each with dedicated legal, credit, and collection teams.", meta: "Since 1995", slot: "IND_FINANCE" },
    { num: "iii.",name: "Real",       em: "Estate",     body: "IN ARCHITECTS — 15+ years of development across Syria, Iraq, Jordan, Lebanon. Over 300,000 m² commercial and 90,000 m² residential delivered.", meta: "Multiple Markets", slot: "IND_REALESTATE" },
    { num: "iv.", name: "Medical",    em: "Equipment",  body: "Phoenix Advanced Systems — exclusive Jordan distributor for Atlas Copco. Medical equipment, gas generators, oxygen and nitrogen PSA systems.", meta: "Since 2014  ·  Amman", slot: "IND_MEDICAL" },
    { num: "v.",  name: "Hygienic",   em: "Paper",      body: "Al Ghad Al Moshreq — acquired one of Jordan's largest hygienic paper factories. Manufacturing and packaging at international standards.", meta: "Since 2020  ·  Jordan", slot: "IND_PAPER" },
    { num: "vi.", name: "Renewable",  em: "Energy",     body: "100 MW solar storage facility in Homs Industrial Zone — phase one already operational. A direct stake in Syria's sustainable future.", meta: "Homs  ·  100 MW", slot: "IND_SOLAR" },
    {
      num: "vii.", name: "Mallouk-Made", em: "Motorcycles",
      body: "CG-MALLOUK & BT MALLOUK — Mallouk Group's own series of motorcycles, taken from R&D and design through to manufacturing. Perfected in every detail of stamping, welding, painting, and assembly.",
      meta: "Designed & Built In-House",
      slot: "IND_MOTORCYCLE",
      featured: true
    }
  ];

  return (
    <section id="industries" style={{ background: COLOR.bg, padding: "16vh 8vw" }}>
      <FadeUp>
        <div style={{ marginBottom: "8vh", maxWidth: 760 }}>
          <SectionTag>04 / Industries</SectionTag>
          <h2 style={{
            fontFamily: "'Fraunces', serif", fontWeight: 300,
            fontSize: "clamp(40px, 6.5vw, 96px)", lineHeight: 0.95, letterSpacing: "-0.04em",
            marginBottom: 28
          }}>
            One family.<br /><em style={{ color: COLOR.accent, fontStyle: "italic" }}>Eight industries.</em>
          </h2>
          <p style={{
            fontSize: 17, lineHeight: 1.65, color: COLOR.inkSoft, fontWeight: 300,
            fontFamily: "'Fraunces', serif", fontStyle: "italic"
          }}>
            Automotive took the lead and everything else followed — due to the same conviction
            that applied just as well to the field of medicine, energy, real estate, and the
            aviation above the cities we build.
          </p>
        </div>
      </FadeUp>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0,
        borderTop: `1px solid ${COLOR.line}`
      }}>
        {paths.map((p, i) => <PathCard key={i} {...p} index={i} total={paths.length} />)}
      </div>
    </section>
  );
}

function PathCard({ num, name, em, body, meta, slot, featured, index, total }) {
  const isLastInRow = ((index + 1) % 3 === 0);
  const isLonely = (index === total - 1) && (total % 3 === 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, delay: (index % 3) * 0.1, ease: [0.3, 0, 0.2, 1] }}
      whileHover="hover"
      style={{
        position: "relative", overflow: "hidden",
        borderBottom: `1px solid ${COLOR.line}`,
        borderRight: isLastInRow ? "none" : `1px solid ${COLOR.line}`,
        minHeight: 480, display: "flex", flexDirection: featured && isLonely ? "row" : "column",
        gridColumn: isLonely ? "1 / -1" : "auto",
        background: featured ? COLOR.bgDeep : "transparent"
      }}
    >
      <div style={{
        overflow: "hidden",
        width: featured && isLonely ? "55%" : "100%",
        aspectRatio: featured && isLonely ? "auto" : "16 / 10",
        flexShrink: 0
      }}>
        <motion.div
          variants={{ hover: { scale: 1.05 } }}
          transition={{ duration: 1.2, ease: [0.3, 0, 0.2, 1] }}
          style={{ width: "100%", height: "100%" }}
        >
          <AssetSlot id={slot} />
        </motion.div>
      </div>
      <div style={{
        padding: featured && isLonely ? "60px 56px" : "32px 28px",
        flex: 1, display: "flex", flexDirection: "column",
        justifyContent: featured && isLonely ? "center" : "flex-start"
      }}>
        <div style={{
          fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 300,
          fontSize: 14, color: COLOR.accent, marginBottom: 14
        }}>{num}</div>
        <div style={{
          fontFamily: "'Fraunces', serif", fontWeight: 300,
          fontSize: featured && isLonely ? 48 : 28,
          lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: 16
        }}>
          {name} <em style={{ fontStyle: "italic" }}>{em}</em>
        </div>
        <p style={{
          fontSize: featured && isLonely ? 16 : 14,
          lineHeight: 1.7, color: COLOR.inkSoft,
          fontWeight: 300, marginBottom: 16, flex: featured && isLonely ? "0 0 auto" : 1,
          maxWidth: featured && isLonely ? 560 : "none"
        }}>{body}</p>
        <div style={{
          fontFamily: "'Inter Tight', sans-serif", fontSize: 11, letterSpacing: "0.25em",
          textTransform: "uppercase", color: COLOR.accent, marginTop: featured && isLonely ? 0 : "auto"
        }}>{meta}</div>
      </div>
    </motion.div>
  );
}

/* ====== GLOBAL ====== */
function Global() {
  const cities = [
    { city: "Damascus", country: "Syria  ·  HQ" },
    { city: "Amman", country: "Jordan  ·  HQ" },
    { city: "Beirut", country: "Lebanon" },
    { city: "Erbil", country: "Iraq" },
    { city: "Cairo", country: "Egypt" },
    { city: "Shanghai", country: "China  ·  Regional" },
    { city: "Hong Kong", country: "China  ·  Subsidiary" },
    { city: "Jiangsu", country: "China  ·  Subsidiary" }
  ];

  return (
    <section id="global" style={{
      background: COLOR.ink, color: COLOR.bg, padding: "16vh 8vw",
      position: "relative", overflow: "hidden"
    }}>
      <div style={{ maxWidth: 600, marginBottom: "8vh", position: "relative", zIndex: 2 }}>
        <SectionTag dark>05 / Global</SectionTag>
        <h2 style={{
          fontFamily: "'Fraunces', serif", fontWeight: 300,
          fontSize: "clamp(40px, 6vw, 88px)", lineHeight: 0.98, letterSpacing: "-0.03em",
          marginBottom: 24,
              color: "white"
        }}>
          Six countries.<br />One <em style={{ color: COLOR.gold, fontStyle: "italic" }}>house</em>.
        </h2>
        <p style={{ fontSize: 16, lineHeight: 1.65, color: "rgba(243,238,229,0.7)", fontWeight: 300 }}>
          From a Damascus office in 1981 to a presence at the top of the Shanghai Tower today —
          Mallouk Group operates where the market needs us, and only where we can excel.
        </p>
      </div>

      <div style={{
        position: "relative", width: "100%", height: "60vh", minHeight: 500,
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        {ASSETS.VID_GLOBE_LOOP.src ? (
          <div style={{ width: 460, height: 460, borderRadius: "50%", overflow: "hidden" }}>
            <AssetSlot id="VID_GLOBE_LOOP" />
          </div>
        ) : (
          // Real 3D sphere with the globe image wrapped as its surface texture
          <ThreeGlobeImage />
        )}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 140, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute", width: 740, height: 740,
            borderRadius: "50%", border: "1px dotted rgba(243,238,229,0.08)", pointerEvents: "none"
          }}
        />
      </div>

      <div style={{
        position: "relative", zIndex: 2, columns: 4, columnGap: "4vw",
        marginTop: "6vh", paddingTop: "6vh", borderTop: "1px solid rgba(243,238,229,0.12)"
      }}>
        {cities.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            whileHover={{ color: COLOR.gold }}
            style={{
              fontFamily: "'Fraunces', serif", fontWeight: 300, fontSize: 22,
              letterSpacing: "-0.01em", marginBottom: 16, breakInside: "avoid",
              color: "rgba(243,238,229,0.75)", cursor: "default"
            }}
          >
            {c.city}
            <span style={{
              display: "block", fontFamily: "'Inter Tight', sans-serif", fontSize: 10,
              letterSpacing: "0.3em", textTransform: "uppercase",
              color: "rgba(243,238,229,0.4)", marginTop: 4
            }}>{c.country}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ====== FUTURE ====== */
/* ====== GEELY VISIT — honored chairman/CEO visit moment ====== */
function GeelyVisit() {
  return (
    <section style={{ background: COLOR.bg, padding: "16vh 8vw" }}>
      <FadeUp>
        <div style={{ maxWidth: 880, marginBottom: "8vh" }}>
          <SectionTag>06 / The Visit</SectionTag>
          <h2 style={{
            fontFamily: "'Fraunces', serif", fontWeight: 300,
            fontSize: "clamp(48px, 7vw, 112px)", lineHeight: 0.95, letterSpacing: "-0.04em",
            marginBottom: 28
          }}>
            An honored<br /><em style={{ color: COLOR.accent, fontStyle: "italic" }}>visit</em>.
          </h2>
          <p style={{
            fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 300,
            fontSize: 22, lineHeight: 1.55, color: COLOR.inkSoft, maxWidth: 780
          }}>
            Mallouk Group was honored by the unique and special visit of the Chairman
            <span style={{ color: COLOR.ink, fontStyle: "normal", fontWeight: 400 }}> Mr. Li Shufu </span>
            and the CEO
            <span style={{ color: COLOR.ink, fontStyle: "normal", fontWeight: 400 }}> Mr. An Conghui </span>
            from GEELY Holding Group to our network and establishment in Syria.
          </p>
        </div>
      </FadeUp>

      {/* Two wide image containers, side by side */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5vw",
        marginTop: "4vh"
      }}>
        <FadeUp delay={0.05}>
          <div style={{
            position: "relative", aspectRatio: "16/9",
            border: `1px solid ${COLOR.line}`, overflow: "hidden",
            background: COLOR.bgDeep
          }}>
            <AssetSlot id="GEELY_VISIT_1" />
          </div>
          <div style={{
            fontFamily: "'Inter Tight', sans-serif", fontSize: 11,
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: COLOR.muted, marginTop: 16
          }}>
            <span style={{ width: 24, height: 1, background: COLOR.muted, display: "inline-block",
                           verticalAlign: "middle", marginRight: 12 }} />
           Mr. Li Shufu · Chairman, GEELY Holding

          </div>
        </FadeUp>

        <FadeUp delay={0.18}>
          <div style={{
            position: "relative", aspectRatio: "16/9",
            border: `1px solid ${COLOR.line}`, overflow: "hidden",
            background: COLOR.bgDeep
          }}>
            <AssetSlot id="GEELY_VISIT_2" />
          </div>
          <div style={{
            fontFamily: "'Inter Tight', sans-serif", fontSize: 11,
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: COLOR.muted, marginTop: 16
          }}>
            <span style={{ width: 24, height: 1, background: COLOR.muted, display: "inline-block",
                           verticalAlign: "middle", marginRight: 12 }} />
            MR. AN CONGHUI • CEO GEELY HOLDING (SECOND FROM LEFT)
            MR. LI SHUFU • CHAIRMAN GEELY HOLDING (THIRD FROM LEFT)

          </div>
        </FadeUp>
      </div>
    </section>
  );
}

function Future() {
  const cards = [
    {
      label: "Reconstruction", name: "Spectrum", em: "Trading",
      body: "Founded as one of the first companies dedicated to participating in Syria's reconstruction. The general manager of Mallouk Group serves as Vice Chairman of the Syria-China Business Council — a strategic position at the center of rebuilding partnerships.",
      stats: [["Focus", "Infrastructure  ·  Development"], ["Status", "Active"]],
      slot: "FUTURE_SPECTRUM"
    },
    {
      label: "Education", name: "Levant", em: "University",
      body: "Mallouk's first educational venture — a private university in Damascus offering a wide range of specialized and professional training programs. The largest single educational venture in the group's history.",
      stats: [["Location", "Damascus, Syria"], ["Campus", "20,000 m²"]],
      slot: "FUTURE_LEVANT"
    },
    {
      label: "Aviation", name: "Fly", em: "Syria",
      body: "The group's aviation arm, headquartered in Damascus. Phase one launches with five aircraft serving Middle East routes within 3.5 flying hours. Phase three: ten destinations, regional connectivity restored.",
      stats: [["HQ", "Damascus"], ["Phase One Fleet", "5 Aircraft"], ["Year-3 Target", "10 Destinations"]],
      slot: "FUTURE_FLYSYRIA"
    }
  ];
  return (
    <section style={{ background: COLOR.bg, padding: "16vh 8vw" }}>
      <FadeUp>
        <div style={{ maxWidth: 720, marginBottom: "8vh" }}>
          <SectionTag>07 / What's Next</SectionTag>
          <h2 style={{
            fontFamily: "'Fraunces', serif", fontWeight: 300,
            fontSize: "clamp(48px, 7vw, 112px)", lineHeight: 0.95, letterSpacing: "-0.04em",
            marginBottom: 24
          }}>
            Building the<br /><em style={{ color: COLOR.accent, fontStyle: "italic" }}>next chapter</em>.
          </h2>
          <p style={{
            fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 300,
            fontSize: 20, lineHeight: 1.5, color: COLOR.inkSoft
          }}>
            Three new ventures are emerging. Each one a continuation of the same belief — to arrive
            before the prospect is visible, and to build something durable before the world is acknowledging.
          </p>
        </div>
      </FadeUp>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "4vw" }}>
        {cards.map((c, i) => <FutureCard key={i} {...c} delay={i * 0.15} />)}
      </div>
    </section>
  );
}

function FutureCard({ label, name, em, body, stats, slot, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, delay, ease: [0.3, 0, 0.2, 1] }}
      whileHover="hover"
      style={{ borderTop: `1px solid ${COLOR.ink}`, paddingTop: 0, overflow: "hidden" }}
    >
      <div style={{ overflow: "hidden", width: "100%", aspectRatio: "4 / 3", marginBottom: 28 }}>
        <motion.div
          variants={{ hover: { scale: 1.04 } }}
          transition={{ duration: 1, ease: [0.3, 0, 0.2, 1] }}
          style={{ width: "100%", height: "100%" }}
        >
          <AssetSlot id={slot} />
        </motion.div>
      </div>
      <div style={{
        fontFamily: "'Inter Tight', sans-serif", fontSize: 11, letterSpacing: "0.3em",
        textTransform: "uppercase", color: COLOR.accent, marginBottom: 16
      }}>{label}</div>
      <h3 style={{
        fontFamily: "'Fraunces', serif", fontWeight: 300,
        fontSize: 32, lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: 20
      }}>
        {name} <em style={{ fontStyle: "italic" }}>{em}</em>
      </h3>
      <p style={{ fontSize: 14, lineHeight: 1.7, color: COLOR.inkSoft, fontWeight: 300, marginBottom: 16 }}>{body}</p>
      <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${COLOR.line}`, display: "flex", flexDirection: "column", gap: 8 }}>
        {stats.map(([k, v], i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Inter Tight', sans-serif", fontSize: 12 }}>
            <span style={{ color: COLOR.muted, letterSpacing: "0.05em" }}>{k}</span>
            <span style={{ color: COLOR.ink, fontWeight: 500 }}>{v}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ====== CONTACT ====== */
function Contact() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yLandscape = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  const offices = [
    { city: "Damascus", country: "Syria  ·  HQ", lines: ["Tel  ·  +963 11 221 7173", "Fax  ·  +962 11 221 1167"], email: "syria@mallouk-co.com" },
    { city: "Amman", country: "Jordan  ·  Regional", lines: ["Tel  ·  +962 6 505 3939", "Fax  ·  +962 6 505 6565"], email: "jordan@mallouk-co.com" },
    { city: "Erbil", country: "Iraq", lines: ["Tel  ·  +964 7734 404099", "Fax  ·  +964 7734 404099"], email: "erbil@mallouk-co.com" },
    { city: "Shanghai", country: "China  ·  Regional", lines: ["Tel  ·  +86 21 5086 6628", "10F, Tower 1", "No.56 Boyu Rd, Pudong"], email: "shoffice@mallouk.cn" }
  ];

  return (
    <section ref={ref} id="contact" style={{
      background: COLOR.ink, color: COLOR.bg, padding: "16vh 8vw 8vh",
      position: "relative", overflow: "hidden"
    }}>
      <motion.div style={{
        position: "absolute", inset: 0, y: yLandscape,
        opacity: 0.15, mixBlendMode: "luminosity"
      }}>
        <AssetSlot id="CONTACT_LANDSCAPE" />
      </motion.div>

      <div style={{ textAlign: "center", maxWidth: 900, margin: "0 auto 12vh", position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <SectionTag dark>08 / Contact</SectionTag>
        </div>
        <h2 style={{
          fontFamily: "'Fraunces', serif", fontWeight: 300,
          fontSize: "clamp(56px, 9vw, 144px)", lineHeight: 0.95, letterSpacing: "-0.04em",
          marginBottom: 32,
              color: "white"
        }}>
          Begin a<br /><em style={{ color: COLOR.gold, fontStyle: "italic" }}>conversation</em>.
        </h2>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0,
        borderTop: "1px solid rgba(243,238,229,0.15)", position: "relative", zIndex: 2
      }}>
        {offices.map((o, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: i * 0.1 }}
            style={{
              padding: "40px 32px",
              borderRight: i === offices.length - 1 ? "none" : "1px solid rgba(243,238,229,0.15)"
            }}
          >
            <div style={{
              fontFamily: "'Fraunces', serif", fontWeight: 300, fontStyle: "italic",
              fontSize: 28, letterSpacing: "-0.01em", marginBottom: 4
            }}>{o.city}</div>
            <div style={{
              fontFamily: "'Inter Tight', sans-serif", fontSize: 11, letterSpacing: "0.3em",
              textTransform: "uppercase", color: COLOR.gold, marginBottom: 24
            }}>{o.country}</div>
            {o.lines.map((line, j) => (
              <div key={j} style={{
                fontFamily: "'Inter Tight', sans-serif", fontSize: 12, lineHeight: 1.6,
                color: "rgba(243,238,229,0.7)", marginBottom: 8, letterSpacing: "0.02em"
              }}>{line}</div>
            ))}
            <a href={`mailto:${o.email}`} style={{
              fontFamily: "'Inter Tight', sans-serif", fontSize: 12,
              color: "rgba(243,238,229,0.7)", textDecoration: "none"
            }}>{o.email}</a>
          </motion.div>
        ))}
      </div>

      {/* <div style={{ margin: "14vh 0 6vh", textAlign: "center", position: "relative", zIndex: 2 }}>
        <CtaButton>Open a dialogue</CtaButton>
      </div> */}

      <footer style={{
        marginTop: "8vh", paddingTop: 32,
        borderTop: "1px solid rgba(243,238,229,0.15)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        fontFamily: "'Inter Tight', sans-serif", fontSize: 11, letterSpacing: "0.2em",
        color: "rgba(243,238,229,0.5)", textTransform: "uppercase",
        position: "relative", zIndex: 2, flexWrap: "wrap", gap: 16
      }}>
        <span>© Mallouk Group</span>
        <span>Forty-four years of pioneering</span>
        <span>Damascus  /  Amman  /  Shanghai</span>
      </footer>
    </section>
  );
}

function CtaButton({ children }) {
  return (
    <motion.button
      whileHover="hover"
      style={{
        background: "transparent", border: `1px solid ${COLOR.bg}`, color: COLOR.bg,
        padding: "22px 48px",
        fontFamily: "'Inter Tight', sans-serif", fontWeight: 500, fontSize: 12,
        letterSpacing: "0.32em", textTransform: "uppercase",
        cursor: "pointer", position: "relative", overflow: "hidden"
      }}
    >
      <motion.span
        variants={{ hover: { y: "0%" } }}
        initial={{ y: "101%" }}
        transition={{ duration: 0.6, ease: [0.7, 0, 0.2, 1] }}
        style={{ position: "absolute", inset: 0, background: COLOR.gold, zIndex: 1 }}
      />
      <motion.span
        variants={{ hover: { color: COLOR.ink } }}
        transition={{ duration: 0.5, ease: [0.5, 0, 0.2, 1] }}
        style={{ position: "relative", zIndex: 2, display: "inline-block" }}
      >{children}</motion.span>
    </motion.button>
  );
}

/* ====== SHARED ====== */
function SectionTag({ children, dark }) {
  return (
    <div style={{
      fontFamily: "'Inter Tight', sans-serif", fontWeight: 400, fontSize: 11,
      letterSpacing: "0.4em", color: dark ? "rgba(243,238,229,0.5)" : COLOR.muted,
      textTransform: "uppercase",
      display: "flex", alignItems: "center", gap: 12, marginBottom: 24
    }}>
      <span style={{
        width: 28, height: 1, background: dark ? "rgba(243,238,229,0.5)" : COLOR.muted,
        display: "inline-block"
      }} />
      {children}
    </div>
  );
}

function Para({ children }) {
  return (
    <p style={{ fontSize: 16, lineHeight: 1.75, color: COLOR.inkSoft, marginBottom: 20, fontWeight: 300 }}>
      {children}
    </p>
  );
}

function FadeUp({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1, delay, ease: [0.3, 0, 0.2, 1] }}
    >{children}</motion.div>
  );
}

/* ====== ROOT ======
   Loads GSAP + ScrollTrigger + Lenis from cdnjs at app init.
   Three.js is imported directly (it's in the runtime).
   Lenis is hooked up to ScrollTrigger so all scroll-driven animations stay in sync.
*/
function loadScript(src) {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
    const s = document.createElement("script");
    s.src = src;
    s.crossOrigin = "anonymous";
    s.onload = () => resolve(true);
    s.onerror = () => { console.warn("Failed to load:", src); resolve(false); };
    document.head.appendChild(s);
  });
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [libsReady, setLibsReady] = useState(false);
  const lenisRef = useRef(null);

  useEffect(() => {
    // === Fonts ===
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,200..900;1,9..144,200..900&family=Inter+Tight:wght@300;400;500;600&display=swap";
    document.head.appendChild(link);

    document.body.style.background = COLOR.bg;
    document.body.style.color = COLOR.ink;
    document.body.style.fontFamily = "'Inter Tight', sans-serif";
    document.body.style.margin = 0;
    document.body.style.overflowX = "hidden";

    // === Smooth scroll to anchors (override default — Lenis handles wheel) ===
    const handler = (e) => {
      const a = e.target.closest("a[href^='#']");
      if (!a) return;
      const id = a.getAttribute("href");
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        if (lenisRef.current) {
          lenisRef.current.scrollTo(target, { offset: 0, duration: 1.4 });
        } else {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };
    document.addEventListener("click", handler);

    // === Load CDN libraries: GSAP, ScrollTrigger, Lenis ===
    let rafId;
    (async () => {
      // Load GSAP and Lenis in parallel, then ScrollTrigger (depends on GSAP)
      await Promise.all([
        loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"),
        loadScript("https://cdnjs.cloudflare.com/ajax/libs/lenis/1.0.42/lenis.min.js"),
      ]);
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js");

      // Register GSAP plugin
      if (window.gsap && window.ScrollTrigger) {
        window.gsap.registerPlugin(window.ScrollTrigger);
      }

      // Initialise Lenis smooth scroll
      if (window.Lenis) {
        const lenis = new window.Lenis({
          lerp: 0.1,
          smoothWheel: true,
          wheelMultiplier: 1.0,
        });
        lenisRef.current = lenis;

        function raf(time) {
          lenis.raf(time);
          rafId = requestAnimationFrame(raf);
        }
        rafId = requestAnimationFrame(raf);

        // Sync Lenis with ScrollTrigger so pinned/scrubbed sections stay accurate
        if (window.ScrollTrigger) {
          lenis.on("scroll", window.ScrollTrigger.update);
          window.gsap.ticker.add((time) => lenis.raf(time * 1000));
          window.gsap.ticker.lagSmoothing(0);
        }
      }

      setLibsReady(true);
    })();

    return () => {
      document.removeEventListener("click", handler);
      if (rafId) cancelAnimationFrame(rafId);
      if (lenisRef.current) lenisRef.current.destroy();
    };
  }, []);

  return (
    <>
      {loading && <Loader onDone={() => setLoading(false)} />}
      <ScrollProgress />
      <Nav />
      <HeroSequence libsReady={libsReady} />
      <CloudStrip />
      <Timeline />
      <Automotive />
      <Manufacturing />
      <Diversification />
      <Global />
      <GeelyVisit />
      <Future />
      <Contact />
    </>
  );
}
