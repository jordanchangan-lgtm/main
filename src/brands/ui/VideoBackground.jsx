"use client";

// Seamless looping video background. Two source cuts — a 16:9 desktop version
// and a 9:16 phone version — chosen by viewport. Muted + autoplay + loop +
// playsInline so it plays everywhere (incl. iOS) and loops with no controls.
// A poster paints instantly before the video is ready, and a centre vignette
// keeps overlaid text legible against the bright horizon.
import React, { useEffect, useRef } from "react";
import { useViewport } from "../useViewport";
import DESKTOP_MP4 from "../assets/hub-bg-desktop.mp4";
import MOBILE_MP4 from "../assets/hub-bg-mobile.mp4";
import DESKTOP_POSTER from "../assets/hub-bg-desktop.jpg";
import MOBILE_POSTER from "../assets/hub-bg-mobile.jpg";

export function VideoBackground({ vignette = true, tint = 0.22, style }) {
  const { isMobile } = useViewport();
  const src = isMobile ? MOBILE_MP4 : DESKTOP_MP4;
  const poster = isMobile ? MOBILE_POSTER : DESKTOP_POSTER;
  const ref = useRef(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true; // ensure autoplay is allowed
    const play = () => v.play().catch(() => {});
    play();
  }, [src]);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#000e2e", ...style }}>
      <video
        ref={ref}
        key={src}
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
      {tint > 0 && <div style={{ position: "absolute", inset: 0, background: `rgba(0,8,30,${tint})`, pointerEvents: "none" }} />}
      {vignette && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(78% 62% at 50% 46%, rgba(0,8,30,0.6) 0%, rgba(0,8,30,0.18) 55%, transparent 82%)" }} />
      )}
    </div>
  );
}
