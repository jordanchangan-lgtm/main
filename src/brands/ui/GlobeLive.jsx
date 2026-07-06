"use client";

// Ported from the provided shadcn/Tailwind/TS `cobe-globe-live.tsx` to plain
// JSX, reworked for a light globe framed on Jordan. The four showroom markers
// sit on their real lat/long; a liquid-glass label with each location name
// animates in above its marker. Drag to spin — the globe eases back to Jordan
// on release so the labels stay aligned (the reference's CSS-anchor "live
// viewers" overlay is replaced by this).
import { useEffect, useRef, useState, useCallback } from "react";
import createGlobe from "cobe";

// Orthographic centre — the centroid of the four Jordan showrooms.
const CENTER = { lat: 31.52, lng: 35.67 };
// cobe orientation that puts CENTER at the front of the globe (calibrated).
const PHI_START = 4.06;
const THETA_START = 0.5;
const FILL = 0.9; // globe radius as a fraction of half the canvas

function project(lat, lng, R) {
  const toR = (d) => (d * Math.PI) / 180;
  const la = toR(lat), lo = toR(lng), la0 = toR(CENTER.lat), lo0 = toR(CENTER.lng);
  const cosc = Math.sin(la0) * Math.sin(la) + Math.cos(la0) * Math.cos(la) * Math.cos(lo - lo0);
  const x = R * Math.cos(la) * Math.sin(lo - lo0);
  const y = -R * (Math.cos(la0) * Math.sin(la) - Math.sin(la0) * Math.cos(la) * Math.cos(lo - lo0));
  return { x, y, visible: cosc > 0 };
}

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
  const pointerInteracting = useRef(null);
  const dragOffset = useRef({ phi: 0, theta: 0 });
  const phiOffsetRef = useRef(0);
  const thetaOffsetRef = useRef(0);
  const draggingRef = useRef(false);
  const showRef = useRef(true);
  const [showLabels, setShowLabels] = useState(true);
  const [size, setSize] = useState(0);

  useEffect(() => {
    const measure = () => wrapRef.current && setSize(wrapRef.current.offsetWidth);
    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const handlePointerDown = useCallback((e) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY };
    draggingRef.current = true;
    showRef.current = false;
    setShowLabels(false);
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
  }, []);

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi;
      thetaOffsetRef.current += dragOffset.current.theta;
      dragOffset.current = { phi: 0, theta: 0 };
    }
    pointerInteracting.current = null;
    draggingRef.current = false;
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
  }, []);

  useEffect(() => {
    const move = (e) => {
      if (pointerInteracting.current !== null) {
        dragOffset.current = {
          phi: (e.clientX - pointerInteracting.current.x) / 250,
          theta: (e.clientY - pointerInteracting.current.y) / 900,
        };
      }
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [handlePointerUp]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    let globe = null;
    let raf;

    function init() {
      const width = canvas.offsetWidth;
      if (width === 0 || globe) return;
      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width,
        height: width,
        phi: 0,
        theta: THETA_START,
        dark: 0,
        diffuse: 1.1,
        mapSamples: 16000,
        mapBrightness: 7,
        baseColor,
        markerColor,
        glowColor,
        markerElevation: 0.01,
        markers: markers.map((m) => ({ location: m.location, size: 0.045 })),
        opacity: 0.9,
      });

      function animate() {
        if (!draggingRef.current) {
          phiOffsetRef.current *= 0.9;
          thetaOffsetRef.current *= 0.9;
          if (Math.abs(phiOffsetRef.current) < 0.0004) phiOffsetRef.current = 0;
          if (Math.abs(thetaOffsetRef.current) < 0.0004) thetaOffsetRef.current = 0;
        }
        globe.update({
          phi: PHI_START + phiOffsetRef.current + dragOffset.current.phi,
          theta: THETA_START + thetaOffsetRef.current + dragOffset.current.theta,
        });
        const settled =
          !draggingRef.current &&
          phiOffsetRef.current === 0 &&
          thetaOffsetRef.current === 0 &&
          dragOffset.current.phi === 0;
        if (settled !== showRef.current) {
          showRef.current = settled;
          setShowLabels(settled);
        }
        raf = requestAnimationFrame(animate);
      }
      animate();
      setTimeout(() => canvas && (canvas.style.opacity = "1"));
    }

    if (canvas.offsetWidth > 0) init();
    else {
      const ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) { ro.disconnect(); init(); }
      });
      ro.observe(canvas);
    }
    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (globe) globe.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers]);

  // Label geometry (static — valid when the globe is settled on Jordan).
  const R = (size / 2) * FILL;
  const cx = size / 2;
  const cy = size / 2;
  // fan the labels out in a wide arc around the cluster so they don't collide
  const fanAngles = [-80, -40, 40, 80];
  const fanRx = size * 0.52;
  const fanRy = size * 0.46;
  const labels = markers.map((m, i) => {
    const p = project(m.location[0], m.location[1], R);
    const a = (fanAngles[i % fanAngles.length] * Math.PI) / 180;
    return {
      marker: { x: cx + p.x, y: cy + p.y, visible: p.visible },
      label: { x: cx + Math.sin(a) * fanRx, y: cy - Math.cos(a) * fanRy },
      name: m.name,
      address: m.address,
    };
  });

  return (
    <div ref={wrapRef} style={{ position: "relative", aspectRatio: "1 / 1", userSelect: "none" }}>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          width: "100%", height: "100%", cursor: "grab", opacity: 0,
          transition: "opacity 1.2s ease", borderRadius: "50%", touchAction: "none",
        }}
      />

      {/* connector lines from each marker to its glass label */}
      {size > 0 && (
        <svg width={size} height={size} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {labels.map((l, i) => (
            <g
              key={i}
              style={{
                opacity: showLabels && inView && l.marker.visible ? 0.9 : 0,
                transition: `opacity 0.5s ease ${i * 0.09}s`,
              }}
            >
              <line x1={l.marker.x} y1={l.marker.y} x2={l.label.x} y2={l.label.y} stroke={accent} strokeWidth="1" strokeOpacity="0.55" />
              <circle cx={l.marker.x} cy={l.marker.y} r="3.2" fill={accent} />
              <circle cx={l.marker.x} cy={l.marker.y} r="6" fill="none" stroke={accent} strokeWidth="1" strokeOpacity="0.5" />
            </g>
          ))}
        </svg>
      )}

      {/* liquid-glass labels */}
      {size > 0 &&
        labels.map((l, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: l.label.x,
              top: l.label.y,
              transform: `translate(-50%, -50%) scale(${showLabels && inView && l.marker.visible ? 1 : 0.82})`,
              opacity: showLabels && inView && l.marker.visible ? 1 : 0,
              transition: `opacity 0.55s ease ${i * 0.09}s, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${i * 0.09}s`,
              pointerEvents: "none",
              whiteSpace: "nowrap",
              padding: "8px 13px",
              borderRadius: 13,
              background: "linear-gradient(135deg, rgba(255,255,255,0.62), rgba(255,255,255,0.28))",
              backdropFilter: "blur(11px) saturate(160%)",
              WebkitBackdropFilter: "blur(11px) saturate(160%)",
              border: "1px solid rgba(255,255,255,0.7)",
              boxShadow: "0 10px 28px rgba(20,30,60,0.16), inset 0 1px 0 rgba(255,255,255,0.85)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: accent, boxShadow: `0 0 8px ${accent}` }} />
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "#141c2e", letterSpacing: "0.01em" }}>{l.name}</span>
            </div>
            {l.address && (
              <div style={{ marginTop: 2, fontSize: 10.5, color: "rgba(20,28,46,0.62)", paddingLeft: 15 }}>{l.address}</div>
            )}
          </div>
        ))}
    </div>
  );
}
