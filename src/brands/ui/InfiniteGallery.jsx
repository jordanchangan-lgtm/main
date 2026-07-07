"use client";

// Ported from 3d-gallery-photography.tsx (react-three-fiber) to plain JSX +
// inline usage. Two adaptations for this project:
//   1. It is driven by *page scroll* (a progressRef 0..1 the Hub feeds) rather
//      than hijacking the wheel — so the overlaid sentence word-cycle and the
//      final brand choice stay perfectly in sync, and touch-scroll works.
//   2. Plane transforms are updated imperatively in useFrame (no per-frame
//      React re-render), which keeps it smooth with many textures.
// The cloth-fold / depth-blur / fade shaders are kept as-is.

import React, { useRef, useMemo, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

const DEPTH_RANGE = 50;
const MAX_HORIZONTAL_OFFSET = 8;
const MAX_VERTICAL_OFFSET = 8;

function createClothMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      map: { value: null },
      opacity: { value: 1.0 },
      blurAmount: { value: 0.0 },
      scrollForce: { value: 0.0 },
      time: { value: 0.0 },
    },
    vertexShader: `
      uniform float scrollForce;
      uniform float time;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec3 pos = position;
        // continuous "pump" + strong scroll curve so the planes visibly STRETCH
        // and warp as they are pulled toward the camera (weird, like the ref).
        float pump = sin(time * 1.6) * 0.18;
        float curveIntensity = scrollForce * 0.55 + pump;
        float distanceFromCenter = length(pos.xy);
        float curve = distanceFromCenter * distanceFromCenter * curveIntensity;
        float ripple1 = sin(pos.x * 2.0 + time * 1.2 + scrollForce * 3.0) * 0.03;
        float ripple2 = sin(pos.y * 2.5 + time * 0.9 + scrollForce * 2.0) * 0.025;
        float clothEffect = ripple1 + ripple2;
        pos.z -= (curve + clothEffect);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D map;
      uniform float opacity;
      uniform float blurAmount;
      uniform float scrollForce;
      varying vec2 vUv;
      void main() {
        vec4 color = texture2D(map, vUv);
        if (blurAmount > 0.0) {
          vec2 texelSize = 1.0 / vec2(textureSize(map, 0));
          vec4 blurred = vec4(0.0);
          float total = 0.0;
          for (float x = -2.0; x <= 2.0; x += 1.0) {
            for (float y = -2.0; y <= 2.0; y += 1.0) {
              vec2 offset = vec2(x, y) * texelSize * blurAmount;
              float weight = 1.0 / (1.0 + length(vec2(x, y)));
              blurred += texture2D(map, vUv + offset) * weight;
              total += weight;
            }
          }
          color = blurred / total;
        }
        float curveHighlight = abs(scrollForce) * 0.05;
        color.rgb += vec3(curveHighlight * 0.1);
        gl_FragColor = vec4(color.rgb, color.a * opacity);
      }
    `,
  });
}

function fadeAt(np, s) {
  if (np >= s.fadeIn.start && np <= s.fadeIn.end)
    return (np - s.fadeIn.start) / (s.fadeIn.end - s.fadeIn.start);
  if (np < s.fadeIn.start) return 0;
  if (np >= s.fadeOut.start && np <= s.fadeOut.end)
    return 1 - (np - s.fadeOut.start) / (s.fadeOut.end - s.fadeOut.start);
  if (np > s.fadeOut.end) return 0;
  return 1;
}

function blurAt(np, s) {
  if (np >= s.blurIn.start && np <= s.blurIn.end)
    return s.maxBlur * (1 - (np - s.blurIn.start) / (s.blurIn.end - s.blurIn.start));
  if (np < s.blurIn.start) return s.maxBlur;
  if (np >= s.blurOut.start && np <= s.blurOut.end)
    return s.maxBlur * ((np - s.blurOut.start) / (s.blurOut.end - s.blurOut.start));
  if (np > s.blurOut.end) return s.maxBlur;
  return 0;
}

function GalleryScene({
  images,
  visibleCount = 12,
  progressRef,
  travel = 62,
  driftSpeed = 0.32,
  fadeSettings = { fadeIn: { start: 0.05, end: 0.25 }, fadeOut: { start: 0.4, end: 0.46 } },
  blurSettings = { blurIn: { start: 0.0, end: 0.1 }, blurOut: { start: 0.38, end: 0.46 }, maxBlur: 8.0 },
}) {
  const srcs = useMemo(
    () => images.map((i) => (typeof i === "string" ? i : i.src)),
    [images]
  );
  const textures = useTexture(srcs);
  const total = srcs.length;

  useEffect(() => {
    textures.forEach((t) => {
      t.minFilter = THREE.LinearFilter;
      t.generateMipmaps = false;
    });
  }, [textures]);

  const materials = useMemo(
    () => Array.from({ length: visibleCount }, () => createClothMaterial()),
    [visibleCount]
  );

  const spatial = useMemo(() => {
    const out = [];
    for (let i = 0; i < visibleCount; i++) {
      const ha = (i * 2.618) % (Math.PI * 2);
      const va = (i * 1.618 + Math.PI / 3) % (Math.PI * 2);
      const hr = (i % 3) * 1.2;
      const vr = ((i + 1) % 4) * 0.8;
      out.push({
        x: (Math.sin(ha) * hr * MAX_HORIZONTAL_OFFSET) / 3,
        y: (Math.cos(va) * vr * MAX_VERTICAL_OFFSET) / 4,
      });
    }
    return out;
  }, [visibleCount]);

  const baseZ = useMemo(
    () => Array.from({ length: visibleCount }, (_, i) => ((DEPTH_RANGE / visibleCount) * i) % DEPTH_RANGE),
    [visibleCount]
  );

  const meshRefs = useRef([]);
  const driftRef = useRef(0);
  const lastP = useRef(0);
  const velRef = useRef(0);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    driftRef.current += delta * driftSpeed;
    const p = progressRef ? progressRef.current || 0 : 0;
    const dp = p - lastP.current;
    lastP.current = p;
    // smoothed scroll velocity → subtle cloth bend
    velRef.current += (dp / Math.max(delta, 0.0001) - velRef.current) * 0.2;
    const bend = Math.max(-1.2, Math.min(1.2, velRef.current * 0.6));

    const travelDist = p * travel + driftRef.current;

    for (let i = 0; i < visibleCount; i++) {
      const mesh = meshRefs.current[i];
      const mat = materials[i];
      if (!mesh || !mat) continue;

      const raw = baseZ[i] + travelDist;
      const wraps = Math.floor(raw / DEPTH_RANGE);
      const z = raw - wraps * DEPTH_RANGE; // 0..DEPTH_RANGE
      const imageIndex = total > 0 ? (((i + wraps * visibleCount) % total) + total) % total : 0;
      const tex = textures[imageIndex];

      if (tex && mat.uniforms.map.value !== tex) {
        mat.uniforms.map.value = tex;
        const aspect = tex.image ? tex.image.width / tex.image.height : 1;
        if (aspect > 1) mesh.scale.set(2 * aspect, 2, 1);
        else mesh.scale.set(2, 2 / aspect, 1);
      }

      mesh.position.set(spatial[i].x, spatial[i].y, z - DEPTH_RANGE / 2);

      const np = z / DEPTH_RANGE;
      mat.uniforms.opacity.value = Math.max(0, Math.min(1, fadeAt(np, fadeSettings)));
      mat.uniforms.blurAmount.value = Math.max(0, Math.min(blurSettings.maxBlur, blurAt(np, blurSettings)));
      mat.uniforms.time.value = t;
      mat.uniforms.scrollForce.value = bend;
    }
  });

  if (total === 0) return null;

  return (
    <>
      {Array.from({ length: visibleCount }, (_, i) => (
        <mesh key={i} ref={(el) => (meshRefs.current[i] = el)} material={materials[i]}>
          <planeGeometry args={[1, 1, 24, 24]} />
        </mesh>
      ))}
    </>
  );
}

export default function InfiniteGallery({ images, progressRef, visibleCount = 12, className, style }) {
  return (
    <div className={className} style={style}>
      <Canvas camera={{ position: [0, 0, 0], fov: 55 }} gl={{ antialias: true, alpha: true }} dpr={[1, 1.6]}>
        <Suspense fallback={null}>
          <GalleryScene images={images} progressRef={progressRef} visibleCount={visibleCount} />
        </Suspense>
      </Canvas>
    </div>
  );
}
