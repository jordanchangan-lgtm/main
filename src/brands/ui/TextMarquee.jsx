"use client";

// Port of text-marquee.tsx to JSX + inline styles (no Tailwind/cn). A vertical
// marquee: the children scroll upward continuously in a seamless loop, with a
// top/bottom fade mask so one line reads clearly at a time. Used for the hub
// headline word (future · technology · perfection) sliding slowly on a loop.
import React from "react";

export function TextMarquee({
  children,
  speed = 1,       // higher = slower (duration = speed * count seconds)
  prefix,
  height = 200,    // px height of the masked window
  itemHeight = 40, // px height of each word slot
  className = "",
  style,
}) {
  const items = React.Children.toArray(children);
  const count = items.length;

  return (
    <>
      <style>{`
        @keyframes slide-vertical-marquee {
          to { translate: 0 var(--destination); }
        }
      `}</style>
      <div className={className} style={{ display: "flex", position: "relative", ...style }}>
        <div style={{ display: "flex", position: "relative", overflow: "hidden", flexDirection: "row", gap: 4, alignItems: "center", width: "min-content", height: "min-content" }}>
          {prefix && <div style={{ whiteSpace: "pre", position: "relative" }}>{prefix}</div>}
          <div
            style={{
              position: "relative",
              width: "auto",
              overflow: "hidden",
              height: `${height}px`,
              WebkitMaskImage: "linear-gradient(rgba(0,0,0,0) 0%, rgb(0,0,0) 43.6902%, rgba(0,0,0,0) 100%)",
              maskImage: "linear-gradient(rgba(0,0,0,0) 0%, rgb(0,0,0) 43.6902%, rgba(0,0,0,0) 100%)",
            }}
          >
            <div style={{ position: "relative", height: "100%", "--count": count, "--speed": speed }}>
              {items.map((child, index) => (
                <div
                  key={index}
                  style={{
                    height: `${itemHeight}px`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "--index": index,
                    "--origin": "calc((var(--count) - var(--index)) * 100%)",
                    "--destination": "calc((var(--index) + 1) * -100%)",
                    "--duration": `calc(var(--speed) * ${count}s)`,
                    "--delay": "calc((var(--duration) / var(--count)) * var(--index) - var(--duration))",
                    translate: "0 var(--origin)",
                    animation: "slide-vertical-marquee var(--duration) var(--delay) infinite linear",
                  }}
                >
                  {child}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
