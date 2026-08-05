"use client";

// Ported from the provided shadcn/Tailwind/TS `zoom-parallax.tsx` to plain JSX
// with inline styles (no Tailwind). Seven images scale up from a shared centre
// as the container scrolls. The zoom finishes a little before the end of the
// scroll and holds on the centre image; an optional `overlay` (the brand
// description) then fades in on top of that held photo.
import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";

const LAYOUTS = [
  { height: "25vh", width: "25vw" },
  { top: "-30vh", left: "5vw", height: "30vh", width: "35vw" },
  { top: "-10vh", left: "-25vw", height: "45vh", width: "20vw" },
  { left: "27.5vw", height: "25vh", width: "25vw" },
  { top: "27.5vh", left: "5vw", height: "25vh", width: "20vw" },
  { top: "27.5vh", left: "-22.5vw", height: "25vh", width: "30vw" },
  { top: "22.5vh", left: "25vw", height: "15vh", width: "15vw" },
];

// zoom completes at ZOOM_END of the scroll, then holds while the overlay reveals
const ZOOM_END = 0.8;

export function ZoomParallax({ images, overlay, heightVh = 340 }) {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const scale4 = useTransform(scrollYProgress, [0, ZOOM_END], [1, 4]);
  const scale5 = useTransform(scrollYProgress, [0, ZOOM_END], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, ZOOM_END], [1, 6]);
  const scale8 = useTransform(scrollYProgress, [0, ZOOM_END], [1, 8]);
  const scale9 = useTransform(scrollYProgress, [0, ZOOM_END], [1, 9]);
  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

  // overlay reveal — starts a beat after the zoom settles
  const scrimOpacity = useTransform(scrollYProgress, [ZOOM_END, 0.9], [0, 1]);
  const textOpacity = useTransform(scrollYProgress, [0.86, 0.96], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.86, 1], [46, 0]);

  const t = overlay?.theme || {};

  return (
    <div ref={container} style={{ position: "relative", height: `${heightVh}vh` }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
        {images.map(({ src, alt }, index) => {
          const scale = scales[index % scales.length];
          const layout = LAYOUTS[index % LAYOUTS.length];
          return (
            <motion.div
              key={index}
              style={{
                scale, position: "absolute", top: 0, left: 0,
                display: "flex", height: "100%", width: "100%",
                alignItems: "center", justifyContent: "center",
              }}
            >
              <div
                style={{
                  position: "relative",
                  top: layout.top || 0, left: layout.left || 0,
                  height: layout.height || "25vh", width: layout.width || "25vw",
                }}
              >
                <img src={src} alt={alt || `Parallax image ${index + 1}`} style={{ height: "100%", width: "100%", objectFit: "cover" }} />
              </div>
            </motion.div>
          );
        })}

        {overlay && (
          <>
            {/* legibility scrim over the held photo */}
            <motion.div
              style={{
                position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
                opacity: scrimOpacity,
                background:
                  "linear-gradient(to top, rgba(4,10,22,0.86) 0%, rgba(4,10,22,0.5) 32%, rgba(4,10,22,0.12) 60%, transparent 80%)",
              }}
            />
            {/* description, revealed on top of the final image */}
            <motion.div
              style={{
                position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
                display: "flex", flexDirection: "column", justifyContent: "flex-end",
                padding: "clamp(24px, 7vw, 96px)",
                paddingBottom: "clamp(56px, 12vh, 130px)",
                opacity: textOpacity, y: textY,
              }}
            >
              <div style={{ maxWidth: 720 }}>
                <div style={{ fontSize: 12, letterSpacing: "0.34em", textTransform: "uppercase", color: t.glow || "#8ecbff", marginBottom: 16, fontWeight: 600 }}>
                  {overlay.eyebrow}
                </div>
                <h2
                  style={{
                    margin: 0,
                    fontFamily: '"AVATR", "Helvetica Neue", Helvetica, Arial, sans-serif',
                    fontWeight: 600,
                    fontSize: "clamp(1.7rem, 4vw, 3.2rem)",
                    lineHeight: 1.08,
                    letterSpacing: "-0.015em",
                    color: "#ffffff",
                  }}
                >
                  {overlay.headline}
                </h2>
                <p
                  style={{
                    margin: "18px 0 0",
                    maxWidth: 560,
                    fontWeight: 300,
                    fontSize: "clamp(0.98rem, 1.4vw, 1.18rem)",
                    lineHeight: 1.7,
                    color: "rgba(255,255,255,0.86)",
                  }}
                >
                  {overlay.body}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
