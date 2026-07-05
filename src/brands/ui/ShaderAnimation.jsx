"use client";

// Ported from the provided shadcn/Tailwind/TS `shader-animation.tsx` to plain
// JSX. `three` is already a project dependency. The fragment shader's original
// RGB "plexus" output is retinted to the Changan brand blue palette
// (deep #00204a base → bright #12A5F4 filaments).
import { useEffect, useRef } from "react";
import * as THREE from "three";

export function ShaderAnimation({ className, style }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const vertexShader = `
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `;

    // Same line-field math as the source, but the three accumulated channels
    // are folded into a single intensity and mapped onto a Changan-blue ramp
    // so the whole field reads as brand blue instead of rainbow.
    const fragmentShader = `
      #define TWO_PI 6.2831853072
      #define PI 3.14159265359

      precision highp float;
      uniform vec2 resolution;
      uniform float time;

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        float t = time*0.05;
        float lineWidth = 0.002;

        float intensity = 0.0;
        for(int j = 0; j < 3; j++){
          for(int i=0; i < 5; i++){
            intensity += lineWidth*float(i*i) / abs(fract(t - 0.01*float(j)+float(i)*0.01)*5.0 - length(uv) + mod(uv.x+uv.y, 0.2));
          }
        }

        // Changan-blue ramp: deep navy base, cyan-blue mid, near-white cores.
        vec3 base   = vec3(0.000, 0.055, 0.180); // #000e2e-ish deep navy
        vec3 blue   = vec3(0.070, 0.647, 0.957); // #12A5F4 brand blue
        vec3 bright  = vec3(0.75, 0.92, 1.0);     // hot filament core

        vec3 color = base;
        color += blue * intensity;
        color += bright * pow(intensity, 3.0) * 0.35;

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const camera = new THREE.Camera();
    camera.position.z = 1;

    const scene = new THREE.Scene();
    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      time: { type: "f", value: 1.0 },
      resolution: { type: "v2", value: new THREE.Vector2() },
    };

    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);

    container.appendChild(renderer.domElement);

    const onWindowResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      uniforms.resolution.value.x = renderer.domElement.width;
      uniforms.resolution.value.y = renderer.domElement.height;
    };

    onWindowResize();
    window.addEventListener("resize", onWindowResize, false);

    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      uniforms.time.value += 0.05;
      renderer.render(scene, camera);

      if (sceneRef.current) {
        sceneRef.current.animationId = animationId;
      }
    };

    sceneRef.current = {
      camera,
      scene,
      renderer,
      uniforms,
      animationId: 0,
    };

    animate();

    return () => {
      window.removeEventListener("resize", onWindowResize);

      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);

        if (container && sceneRef.current.renderer.domElement) {
          container.removeChild(sceneRef.current.renderer.domElement);
        }

        sceneRef.current.renderer.dispose();
        geometry.dispose();
        material.dispose();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: "100%",
        height: "100%",
        background: "#000e2e",
        overflow: "hidden",
        ...style,
      }}
    />
  );
}
