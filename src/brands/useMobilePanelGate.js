import { useEffect } from "react";
import { useViewport } from "./useViewport";

// Mobile-only: when a panel marked [data-panel-gate] scrolls into view, briefly
// lock scrolling so its entrance animations can play, then release. Each panel
// gates once (scrolling back up won't re-lock). Tall panels still scroll freely
// inside — the gate only holds for the animation, it doesn't snap.
export function useMobilePanelGate(lockMs = 1100) {
  const { isMobile } = useViewport();
  useEffect(() => {
    if (!isMobile) return;

    let lockUntil = 0;
    const gated = new WeakSet();

    const block = (e) => {
      if (Date.now() < lockUntil) e.preventDefault();
    };
    window.addEventListener("wheel", block, { passive: false });
    window.addEventListener("touchmove", block, { passive: false });

    let io;
    const arm = () => {
      const panels = document.querySelectorAll("[data-panel-gate]");
      if (!panels.length) return;
      io = new IntersectionObserver(
        (entries) => {
          for (const en of entries) {
            if (en.isIntersecting && en.intersectionRatio >= 0.4 && !gated.has(en.target)) {
              gated.add(en.target);
              en.target.scrollIntoView({ behavior: "smooth", block: "start" });
              lockUntil = Date.now() + lockMs;
            }
          }
        },
        { threshold: [0.4] }
      );
      panels.forEach((p) => io.observe(p));
    };
    // panels exist after the first paint; arm on the next frame to be safe
    const raf = requestAnimationFrame(arm);

    return () => {
      cancelAnimationFrame(raf);
      if (io) io.disconnect();
      window.removeEventListener("wheel", block);
      window.removeEventListener("touchmove", block);
    };
  }, [isMobile, lockMs]);
}
