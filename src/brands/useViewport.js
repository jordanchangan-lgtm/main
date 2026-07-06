import { useState, useEffect } from "react";

// Small viewport hook — returns width/height and an isMobile flag so the
// pixel-based 3D pieces (circular gallery, globe) can size themselves for
// phones instead of overflowing.
export function useViewport() {
  const [vp, setVp] = useState(() => ({
    w: typeof window !== "undefined" ? window.innerWidth : 1200,
    h: typeof window !== "undefined" ? window.innerHeight : 800,
  }));
  useEffect(() => {
    const onResize = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);
  return { w: vp.w, h: vp.h, isMobile: vp.w < 768, isSmall: vp.w < 480 };
}
