"use client";

import { useEffect, useState } from "react";
import styles from "./f5.module.css";

/**
 * f5 — "Northern". Five broad hue-spread gradient bands pushed through
 * fractalNoise → feDisplacementMap (scale 70) → feGaussianBlur 16, so
 * the straight bands become genuinely undulating aurora curtains. The
 * wobble itself is animated with SMIL: the turbulence baseFrequency
 * morphs on a 16s clock while the displacement scale swells 60 → 85 → 60
 * on an 11s clock — two incommensurate periods, so the curtains never
 * repeat. SMIL can't be stopped by CSS, so reduced-motion drops the
 * <animate> nodes via matchMedia. Revealed by scaleY from the bottom.
 */

type GradStop = readonly [number, string, number];

const GRADS: { id: string; stops: GradStop[] }[] = [
  {
    id: "f5-indigo",
    stops: [
      [0, "#1553c6", 1],
      [0.14, "#134aae", 0.94],
      [0.3, "#123f9e", 0.78],
      [0.48, "#10357e", 0.55],
      [0.66, "#0e2a67", 0.3],
      [0.84, "#0d2354", 0.12],
      [1, "#0c1c46", 0],
    ],
  },
  {
    id: "f5-royal",
    stops: [
      [0, "#1b63e0", 1],
      [0.14, "#1857cb", 0.94],
      [0.3, "#1749b6", 0.78],
      [0.48, "#14409f", 0.55],
      [0.66, "#123a8d", 0.3],
      [0.84, "#12357e", 0.12],
      [1, "#123f9e", 0],
    ],
  },
  {
    id: "f5-cyan",
    stops: [
      [0, "#2ad4ff", 1],
      [0.14, "#24c4fe", 0.94],
      [0.3, "#1cb0fc", 0.78],
      [0.48, "#14a0fa", 0.55],
      [0.66, "#0e92f7", 0.3],
      [0.84, "#0d86ef", 0.12],
      [1, "#0c8df9", 0],
    ],
  },
  {
    id: "f5-azure",
    stops: [
      [0, "#35a5ff", 1],
      [0.14, "#1b97fb", 0.94],
      [0.3, "#0c8df9", 0.78],
      [0.48, "#0c7ef7", 0.55],
      [0.66, "#0d6ff0", 0.3],
      [0.84, "#0e66e0", 0.12],
      [1, "#0d61f0", 0],
    ],
  },
  {
    id: "f5-electric",
    stops: [
      [0, "#2a7bff", 1],
      [0.14, "#156cfa", 0.94],
      [0.3, "#0d61f0", 0.78],
      [0.48, "#0d55d6", 0.55],
      [0.66, "#0f4bb9", 0.3],
      [0.84, "#10419f", 0.12],
      [1, "#123f9e", 0],
    ],
  },
];

/* Five broad curtains, overlapping, bleeding past both side edges so the
   ±35px displacement never uncovers a gap at the viewport sides. */
const BANDS: { x: number; w: number; h: number; fill: string; clock: 0 | 1 | 2 }[] = [
  { x: -60, w: 360, h: 430, fill: "f5-indigo", clock: 0 },
  { x: 220, w: 340, h: 560, fill: "f5-royal", clock: 1 },
  { x: 480, w: 360, h: 640, fill: "f5-cyan", clock: 2 },
  { x: 760, w: 340, h: 560, fill: "f5-azure", clock: 0 },
  { x: 1020, w: 380, h: 460, fill: "f5-electric", clock: 1 },
];

export default function F5() {
  const [animated, setAnimated] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setAnimated(!mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const clocks = [styles.bandA, styles.bandB, styles.bandC];
  return (
    <div className={styles.layer} aria-hidden="true">
      <svg
        className={styles.sky}
        viewBox="0 0 1280 600"
        preserveAspectRatio="none"
      >
        <defs>
          {GRADS.map((g) => (
            <linearGradient key={g.id} id={g.id} x1="0" y1="1" x2="0" y2="0">
              {g.stops.map(([offset, color, alpha]) => (
                <stop
                  key={offset}
                  offset={offset}
                  stopColor={color}
                  stopOpacity={alpha}
                />
              ))}
            </linearGradient>
          ))}
          {/* Generous filter region so displaced + blurred bands never clip */}
          <filter
            id="f5-warp"
            x="-20%"
            y="-25%"
            width="140%"
            height="150%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.004 0.02"
              numOctaves="2"
              seed="7"
              result="w"
            >
              {animated && (
                <animate
                  attributeName="baseFrequency"
                  values="0.004 0.02;0.007 0.026;0.004 0.02"
                  dur="16s"
                  repeatCount="indefinite"
                />
              )}
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="w"
              scale="70"
              xChannelSelector="R"
              yChannelSelector="G"
            >
              {animated && (
                <animate
                  attributeName="scale"
                  values="60;85;60"
                  dur="11s"
                  repeatCount="indefinite"
                />
              )}
            </feDisplacementMap>
            <feGaussianBlur stdDeviation="16" />
          </filter>
        </defs>
        <g filter="url(#f5-warp)">
          {BANDS.map((b, i) => (
            <rect
              key={i}
              className={clocks[b.clock]}
              x={b.x}
              y={600 - b.h}
              width={b.w}
              height={b.h + 90}
              fill={`url(#${b.fill})`}
            />
          ))}
        </g>
      </svg>
      {/* Film grain, pooled over the aurora */}
      <div className={styles.grain} />
    </div>
  );
}
