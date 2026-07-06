"use client";

// Ported from the provided shadcn/Tailwind/TS `cobe-globe-live.tsx` to plain
// JSX, reworked for a light globe framed on Jordan that spins on its own in a
// continuous loop. Each showroom marker sits on its real lat/long; a
// liquid-glass label tracks its marker every frame, blooming in as Jordan
// rotates to the front and fading out as it turns to the back. Drag to spin;
// the auto-rotation resumes from wherever you leave it.
import { useEffect, useRef, useState, useCallback } from "react";
import createGlobe from "cobe";

const CENTER = { lat: 31.52, lng: 35.67 };   // centroid of the Jordan showrooms
const PHI_START = 4.06;                        // cobe phi that faces CENTER
const THETA = 0.5;                             // fixed tilt
const FILL = 0.9;                              // globe radius as fraction of half-canvas
const SPEED = 0.0022;                          // auto-rotation speed (rad/frame)
const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;
const LNG_SIGN = 1;                            // calibrated rotation direction

function project(lat, lng, lat0, lng0, R) {
  const la = lat * DEG, lo = lng * DEG, la0 = lat0 * DEG, lo0 = lng0 * DEG;
  const cosc = Math.sin(la0) * Math.sin(la) + Math.cos(la0) * Math.cos(la) * Math.cos(lo - lo0);
  const x = R * Math.cos(la) * Math.sin(lo - lo0);
  const y = -R * (Math.cos(la0) * Math.sin(la) - Math.sin(la0) * Math.cos(la) * Math.cos(lo - lo0));
  return { x, y, cosc };
}
const clamp01 = (v) => Math.max(0, Math.min(1, v));

export function GlobeLive({
  markers = [],
  baseColor = [0.9, 0.92, 0.96],
  markerColor = [0.1, 0.4, 0.9],
  glowColor = [0.9, 0.93, 1.0],
  accent = "#12A5F4",
  inView = true,
}) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const boxRefs = useRef([]);
  const lineRefs = useRef([]);
  const dotRefs = useRef([]);
  const ringRefs = useRef([]);

  const phiRef = useRef(PHI_START);
  const draggingRef = useRef(false);
  const pointer = useRef(null);
  const dragPhi = useRef(0);
  const inViewRef = useRef(inView);
  const [size, setSize] = useState(0);

  useEffect(() => { inViewRef.current = inView; }, [inView]);

  useEffect(() => {
    const measure = () => wrapRef.current && setSize(wrapRef.current.offsetWidth);
    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const onDown = useCallback((e) => {
    pointer.current = e.clientX;
    draggingRef.current = true;
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
  }, []);

  useEffect(() => {
    const move = (e) => {
      if (pointer.current !== null) dragPhi.current = (e.clientX - pointer.current) / 250;
    };
    const up = () => {
      if (pointer.current !== null) { phiRef.current += dragPhi.current; dragPhi.current = 0; }
      pointer.current = null;
      draggingRef.current = false;
      if (canvasRef.current) canvasRef.current.style.cursor = "grab";
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    let globe = null, raf;

    function updateLabels() {
      const w = canvas.offsetWidth;
      if (!w) return;
      const R = (w / 2) * FILL, cx = w / 2, cy = w / 2;
      const effPhi = phiRef.current + dragPhi.current;
      const lng0 = CENTER.lng + (PHI_START - effPhi) * RAD * LNG_SIGN;
      const c = project(CENTER.lat, CENTER.lng, CENTER.lat, lng0, R);
      const centroidVis = clamp01((c.cosc - 0.12) / 0.5);
      const compact = w < 400;
      const stackDX = compact ? w * 0.17 : w * 0.3;
      const stackGap = compact ? w * 0.16 : w * 0.12;
      for (let i = 0; i < markers.length; i++) {
        const p = project(markers[i].location[0], markers[i].location[1], CENTER.lat, lng0, R);
        const mx = cx + p.x, my = cy + p.y;
        const lx = cx + c.x + stackDX, ly = cy + c.y + (i - (markers.length - 1) / 2) * stackGap;
        const op = inViewRef.current ? centroidVis * (p.cosc > 0 ? 1 : 0) : 0;
        const box = boxRefs.current[i];
        if (box) {
          box.style.left = lx + "px";
          box.style.top = ly + "px";
          box.style.opacity = op;
          box.style.transform = `translate(-50%, -50%) scale(${0.9 + 0.1 * op})`;
        }
        const ln = lineRefs.current[i];
        if (ln) { ln.setAttribute("x1", mx); ln.setAttribute("y1", my); ln.setAttribute("x2", lx); ln.setAttribute("y2", ly); ln.style.opacity = op * 0.6; }
        const dot = dotRefs.current[i];
        if (dot) { dot.setAttribute("cx", mx); dot.setAttribute("cy", my); dot.style.opacity = op; }
        const ring = ringRefs.current[i];
        if (ring) { ring.setAttribute("cx", mx); ring.setAttribute("cy", my); ring.style.opacity = op * 0.6; }
      }
    }

    function init() {
      const width = canvas.offsetWidth;
      if (width === 0 || globe) return;
      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width, height: width,
        phi: 0, theta: THETA, dark: 0, diffuse: 1.1,
        mapSamples: 16000, mapBrightness: 7,
        baseColor, markerColor, glowColor,
        markerElevation: 0.01,
        markers: markers.map((m) => ({ location: m.location, size: 0.045 })),
        opacity: 0.9,
      });
      function animate() {
        if (!draggingRef.current) phiRef.current += SPEED;
        globe.update({ phi: phiRef.current + dragPhi.current, theta: THETA });
        updateLabels();
        raf = requestAnimationFrame(animate);
      }
      animate();
      setTimeout(() => canvas && (canvas.style.opacity = "1"));
    }

    if (canvas.offsetWidth > 0) init();
    else {
      const ro = new ResizeObserver((entries) => { if (entries[0]?.contentRect.width > 0) { ro.disconnect(); init(); } });
      ro.observe(canvas);
    }
    return () => { if (raf) cancelAnimationFrame(raf); if (globe) globe.destroy(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers]);

  return (
    <div ref={wrapRef} style={{ position: "relative", aspectRatio: "1 / 1", userSelect: "none" }}>
      <canvas
        ref={canvasRef}
        onPointerDown={onDown}
        style={{ width: "100%", height: "100%", cursor: "grab", opacity: 0, transition: "opacity 1.2s ease", borderRadius: "50%", touchAction: "pan-y" }}
      />

      {size > 0 && (
        <svg width={size} height={size} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {markers.map((_, i) => (
            <g key={i}>
              <line ref={(el) => (lineRefs.current[i] = el)} stroke={accent} strokeWidth="1" style={{ opacity: 0 }} />
              <circle ref={(el) => (ringRefs.current[i] = el)} r="6" fill="none" stroke={accent} strokeWidth="1" style={{ opacity: 0 }} />
              <circle ref={(el) => (dotRefs.current[i] = el)} r="3.2" fill={accent} style={{ opacity: 0 }} />
            </g>
          ))}
        </svg>
      )}

      {size > 0 &&
        markers.map((m, i) => (
          <div
            key={i}
            ref={(el) => (boxRefs.current[i] = el)}
            style={{
              position: "absolute", left: 0, top: 0, opacity: 0,
              transform: "translate(-50%, -50%)", pointerEvents: "none", whiteSpace: "nowrap",
              padding: size < 400 ? "5px 9px" : "8px 13px", borderRadius: 11,
              background: "linear-gradient(135deg, rgba(255,255,255,0.62), rgba(255,255,255,0.28))",
              backdropFilter: "blur(11px) saturate(160%)", WebkitBackdropFilter: "blur(11px) saturate(160%)",
              border: "1px solid rgba(255,255,255,0.7)",
              boxShadow: "0 10px 28px rgba(20,30,60,0.16), inset 0 1px 0 rgba(255,255,255,0.85)",
              willChange: "left, top, opacity, transform",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: accent, boxShadow: `0 0 8px ${accent}`, flex: "0 0 auto" }} />
              <span style={{ fontSize: size < 400 ? 10.5 : 12.5, fontWeight: 700, color: "#141c2e", letterSpacing: "0.01em" }}>{m.name}</span>
            </div>
            {m.address && size >= 400 && <div style={{ marginTop: 2, fontSize: 10.5, color: "rgba(20,28,46,0.62)", paddingLeft: 15 }}>{m.address}</div>}
          </div>
        ))}
    </div>
  );
}
