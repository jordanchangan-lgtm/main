"use client";

// Ported from the provided shadcn/Tailwind/TS `zoom-parallax.tsx` to plain JSX
// with inline styles (no Tailwind). As the 300vh container scrolls, seven
// images scale up from a shared centre, the middle one filling the frame while
// the others fan out — a zoom-parallax reveal. `framer-motion` is already a
// project dependency.
import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";

// Per-index placement of the inner image box (mirrors the reference's
// arbitrary Tailwind variants). Index 0 is the centred hero image.
const LAYOUTS = [
  { height: "25vh", width: "25vw" },
  { top: "-30vh", left: "5vw", height: "30vh", width: "35vw" },
  { top: "-10vh", left: "-25vw", height: "45vh", width: "20vw" },
  { left: "27.5vw", height: "25vh", width: "25vw" },
  { top: "27.5vh", left: "5vw", height: "25vh", width: "20vw" },
  { top: "27.5vh", left: "-22.5vw", height: "25vh", width: "30vw" },
  { top: "22.5vh", left: "25vw", height: "15vh", width: "15vw" },
];

export function ZoomParallax({ images }) {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);
  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

  return (
    <div ref={container} style={{ position: "relative", height: "300vh" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
        {images.map(({ src, alt }, index) => {
          const scale = scales[index % scales.length];
          const layout = LAYOUTS[index % LAYOUTS.length];

          return (
            <motion.div
              key={index}
              style={{
                scale,
                position: "absolute",
                top: 0,
                left: 0,
                display: "flex",
                height: "100%",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  position: "relative",
                  top: layout.top || 0,
                  left: layout.left || 0,
                  height: layout.height || "25vh",
                  width: layout.width || "25vw",
                }}
              >
                <img
                  src={src}
                  alt={alt || `Parallax image ${index + 1}`}
                  style={{ height: "100%", width: "100%", objectFit: "cover" }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
