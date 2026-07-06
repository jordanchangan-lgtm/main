"use client";

// Ported from the provided shadcn/Tailwind/TS `liquid-glass.tsx` to plain JSX.
// GlassFilter renders the shared #glass-distortion SVG filter once; GlassEffect
// wraps content in the refractive liquid-glass panel (distorted backdrop blur +
// white wash + inset highlight). Displacement is toned down from the demo's 200
// so it reads well on small UI panels.
import React from "react";

export function GlassFilter() {
  return (
    <svg style={{ display: "none" }} aria-hidden="true">
      <filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
        <feTurbulence type="fractalNoise" baseFrequency="0.001 0.005" numOctaves="1" seed="17" result="turbulence" />
        <feComponentTransfer in="turbulence" result="mapped">
          <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
          <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
          <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
        </feComponentTransfer>
        <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
        <feSpecularLighting in="softMap" surfaceScale="5" specularConstant="1" specularExponent="100" lightingColor="white" result="specLight">
          <fePointLight x="-200" y="-200" z="300" />
        </feSpecularLighting>
        <feComposite in="specLight" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litImage" />
        <feDisplacementMap in="SourceGraphic" in2="softMap" scale="70" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
}

export function GlassEffect({ children, radius = 24, className, style, href, onClick, tint = "rgba(255,255,255,0.25)" }) {
  const content = (
    <div
      className={className}
      onClick={onClick}
      style={{
        position: "relative",
        display: "flex",
        overflow: "hidden",
        cursor: onClick || href ? "pointer" : "default",
        borderRadius: radius,
        boxShadow: "0 6px 6px rgba(0,0,0,0.16), 0 0 20px rgba(0,0,0,0.08)",
        transition: "all .7s cubic-bezier(0.175,0.885,0.32,2.2)",
        ...style,
      }}
    >
      <div style={{ position: "absolute", inset: 0, zIndex: 0, borderRadius: radius, backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)", filter: "url(#glass-distortion)", isolation: "isolate" }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 1, borderRadius: radius, background: tint }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 2, borderRadius: radius, boxShadow: "inset 2px 2px 1px 0 rgba(255,255,255,0.5), inset -1px -1px 1px 1px rgba(255,255,255,0.5)" }} />
      <div style={{ position: "relative", zIndex: 3, width: "100%", display: "flex" }}>{children}</div>
    </div>
  );
  return href ? (
    <a href={href} style={{ display: "block", textDecoration: "none" }}>{content}</a>
  ) : content;
}
