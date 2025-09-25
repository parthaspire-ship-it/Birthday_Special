"use client";

import { useEffect, useMemo, useState } from "react";

export default function HeartsBackgroundClientOnly() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <HeartsBackground />;
}

function HeartsBackground() {
  // stable RNG so the server never renders a random layout
  const hearts = useMemo(() => {
    const rng = (seed: number) => () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    const r = rng(20250925);
    return Array.from({ length: 64 }).map((_, i) => {
      const left = (r() * 100).toFixed(2);
      const size = 14 + Math.floor(r() * 16);
      const delay = (r() * 5).toFixed(2);
      const dur = (12 + r() * 10).toFixed(2);
      const sway = (6 + r() * 12).toFixed(1);
      const opacity = (0.18 + r() * 0.28).toFixed(2);
      return { left, size, delay, dur, sway, opacity, key: i };
    });
  }, []);

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        background: "linear-gradient(#f8e8ef 0%, #f2d7e2 100%)",
      }}
    >
      {hearts.map((h) => (
        <svg
          key={h.key}
          width={h.size}
          height={h.size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ec8ab4"
          strokeWidth="2"
          style={{
            position: "absolute",
            left: `${h.left}%`,
            top: "110%",
            opacity: Number(h.opacity),
            animation: `rise-heart-${h.key} ${h.dur}s linear ${h.delay}s infinite`,
          }}
        >
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
          <style>{`
            @keyframes rise-heart-${h.key} {
              0%   { transform: translate3d(0, 0, 0); }
              25%  { transform: translate3d(${h.sway}px, -35vh, 0); }
              50%  { transform: translate3d(${-h.sway}px, -70vh, 0); }
              75%  { transform: translate3d(${h.sway}px, -105vh, 0); }
              100% { transform: translate3d(0, -140vh, 0); }
            }
          `}</style>
        </svg>
      ))}
    </div>
  );
}
