"use client";

// Interactive 3D brand emblem (react-three-fiber). A beveled, metallic extruded
// mark that slowly auto-rotates and — on hover — tilts to follow the cursor and
// scales up. The outlines are ORIGINAL stylised marks (chevron / triangle /
// hexagon), not the trademarked logos; swap the shape for the official logo
// (SVG path → THREE.Shape, or a GLB) when available.
import React, { useMemo, useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function makeShape(slug) {
  const s = new THREE.Shape();
  if (slug === "changan") {
    // bold chevron "V"
    s.moveTo(-0.92, 0.82); s.lineTo(-0.4, 0.82); s.lineTo(0, -0.12);
    s.lineTo(0.4, 0.82); s.lineTo(0.92, 0.82); s.lineTo(0.3, -0.9);
    s.lineTo(-0.3, -0.9); s.closePath();
  } else if (slug === "deepal") {
    // upward triangle
    s.moveTo(0, 0.95); s.lineTo(0.86, -0.7); s.lineTo(-0.86, -0.7); s.closePath();
  } else {
    // hexagon
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i - Math.PI / 2;
      const x = Math.cos(a) * 0.92, y = Math.sin(a) * 0.92;
      if (i === 0) s.moveTo(x, y); else s.lineTo(x, y);
    }
    s.closePath();
  }
  return s;
}

function Emblem({ slug, color }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);
  const geo = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(makeShape(slug), { depth: 0.4, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.07, bevelSegments: 4, curveSegments: 24 });
    g.center();
    return g;
  }, [slug]);

  useFrame((state, dt) => {
    const m = ref.current;
    if (!m) return;
    if (hovered) {
      const tx = -state.pointer.y * 0.55;
      const ty = state.pointer.x * 0.75;
      m.rotation.x += (tx - m.rotation.x) * 0.12;
      m.rotation.y += (ty - m.rotation.y) * 0.12;
      m.scale.setScalar(THREE.MathUtils.lerp(m.scale.x, 1.16, 0.12));
    } else {
      m.rotation.y += dt * 0.55;
      m.rotation.x += (0 - m.rotation.x) * 0.06;
      m.scale.setScalar(THREE.MathUtils.lerp(m.scale.x, 1, 0.1));
    }
  });

  return (
    <mesh ref={ref} geometry={geo} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <meshStandardMaterial color={color} metalness={0.9} roughness={0.28} />
    </mesh>
  );
}

export function BrandLogo3D({ brand, size = 300 }) {
  const t = brand.theme;
  return (
    <div style={{ width: size, height: size, pointerEvents: "auto" }}>
      <Canvas camera={{ position: [0, 0, 4.2], fov: 42 }} gl={{ alpha: true, antialias: true }} dpr={[1, 1.8]}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.55} />
          <directionalLight position={[3, 4, 5]} intensity={2.4} />
          <directionalLight position={[-4, -2, 2]} intensity={1.1} color={t.accentBright} />
          <pointLight position={[0, 0, 3]} intensity={6} color={t.accentBright} />
          <Emblem slug={brand.slug} color={t.accent} />
        </Suspense>
      </Canvas>
    </div>
  );
}
