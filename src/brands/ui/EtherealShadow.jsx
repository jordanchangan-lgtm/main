"use client";

// Ported from the provided shadcn/Tailwind/TS `etheral-shadow.tsx` to plain JSX
// (background-only — the demo's headline is dropped so a hero can overlay its
// own text). An animated smoke/shadow field: a colour masked by a cloud PNG,
// displaced by an animated SVG turbulence filter. framer-motion drives the hue
// rotation. Mask + noise are bundled locally so it works offline / in the CSP
// sandbox.
import React, { useRef, useId, useEffect } from "react";
import { animate, useMotionValue } from "framer-motion";
import MASK_URL from "../assets/ethereal-mask.png";
import NOISE_URL from "../assets/ethereal-noise.png";

function mapRange(value, fromLow, fromHigh, toLow, toHigh) {
  if (fromLow === fromHigh) return toLow;
  const p = (value - fromLow) / (fromHigh - fromLow);
  return toLow + p * (toHigh - toLow);
}

const useInstanceId = () => {
  const id = useId();
  return `shadowoverlay-${id.replace(/:/g, "")}`;
};

export function EtherealShadow({
  sizing = "fill",
  color = "rgba(128, 128, 128, 1)",
  animation,
  noise,
  style,
  className,
}) {
  const id = useInstanceId();
  const animationEnabled = animation && animation.scale > 0;
  const feColorMatrixRef = useRef(null);
  const hueRotateMotionValue = useMotionValue(180);
  const hueRotateAnimation = useRef(null);

  const displacementScale = animation ? mapRange(animation.scale, 1, 100, 20, 100) : 0;
  const animationDuration = animation ? mapRange(animation.speed, 1, 100, 1000, 50) : 1;

  useEffect(() => {
    if (feColorMatrixRef.current && animationEnabled) {
      if (hueRotateAnimation.current) hueRotateAnimation.current.stop();
      hueRotateMotionValue.set(0);
      hueRotateAnimation.current = animate(hueRotateMotionValue, 360, {
        duration: animationDuration / 25,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        onUpdate: (value) => {
          if (feColorMatrixRef.current) feColorMatrixRef.current.setAttribute("values", String(value));
        },
      });
      return () => { if (hueRotateAnimation.current) hueRotateAnimation.current.stop(); };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationEnabled, animationDuration]);

  return (
    <div className={className} style={{ overflow: "hidden", position: "relative", width: "100%", height: "100%", ...style }}>
      <div style={{ position: "absolute", inset: -displacementScale, filter: animationEnabled ? `url(#${id}) blur(4px)` : "none" }}>
        {animationEnabled && (
          <svg style={{ position: "absolute" }}>
            <defs>
              <filter id={id}>
                <feTurbulence
                  result="undulation"
                  numOctaves="2"
                  baseFrequency={`${mapRange(animation.scale, 0, 100, 0.001, 0.0005)},${mapRange(animation.scale, 0, 100, 0.004, 0.002)}`}
                  seed="0"
                  type="turbulence"
                />
                <feColorMatrix ref={feColorMatrixRef} in="undulation" type="hueRotate" values="180" />
                <feColorMatrix in="dist" result="circulation" type="matrix" values="4 0 0 0 1  4 0 0 0 1  4 0 0 0 1  1 0 0 0 0" />
                <feDisplacementMap in="SourceGraphic" in2="circulation" scale={displacementScale} result="dist" />
                <feDisplacementMap in="dist" in2="undulation" scale={displacementScale} result="output" />
              </filter>
            </defs>
          </svg>
        )}
        <div
          style={{
            backgroundColor: color,
            maskImage: `url(${MASK_URL})`,
            WebkitMaskImage: `url(${MASK_URL})`,
            maskSize: sizing === "stretch" ? "100% 100%" : "cover",
            WebkitMaskSize: sizing === "stretch" ? "100% 100%" : "cover",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskPosition: "center",
            width: "100%",
            height: "100%",
          }}
        />
      </div>

      {noise && noise.opacity > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${NOISE_URL})`,
            backgroundSize: noise.scale * 200,
            backgroundRepeat: "repeat",
            opacity: noise.opacity / 2,
          }}
        />
      )}
    </div>
  );
}
