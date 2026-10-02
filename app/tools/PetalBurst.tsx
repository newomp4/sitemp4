"use client";

import { useEffect, useRef } from "react";
import styles from "./tools.module.css";

// The same two-layer petals as petal.bar, including the translucent rim.
const capacity = "M399.49 773.15 L153.42 434.47 C117.02 384.36 128.13 314.24 178.23 277.84 C185.69 272.42 193.78 267.94 202.34 264.51 C401.05 184.67 622.93 184.67 821.64 264.51 C879.11 287.60 906.97 352.90 883.89 410.36 C880.45 418.91 875.97 427.01 870.56 434.47 L624.49 773.15 C603.19 802.46 569.04 819.68 532.81 819.37 C518.93 819.25 505.05 819.25 491.17 819.37 C454.93 819.68 420.79 802.46 399.49 773.15 Z";
const remaining = "M690.04 427.98 C749.47 445.40 783.52 507.70 766.09 567.13 C762.47 579.46 756.76 591.09 749.21 601.49 L624.49 773.15 C603.19 802.46 569.04 819.68 532.81 819.37 C518.93 819.25 505.05 819.25 491.16 819.37 C454.93 819.68 420.79 802.46 399.49 773.15 L274.77 601.49 C238.37 551.39 249.48 481.26 299.58 444.86 C308.68 438.25 318.72 433.05 329.35 429.43 L333.94 427.98 C435.66 398.15 543.00 394.42 646.13 416.79 Z";

const petals = [
  { color: "#e51c35", vx: -128, vy: -166, spin: -115, tilt: -20, size: 13, duration: 950, delay: 0 },
  { color: "#ff6a00", vx: -82, vy: -236, spin: 90, tilt: 20, size: 17, duration: 1150, delay: 12 },
  { color: "#ff9f00", vx: -18, vy: -259, spin: -70, tilt: -10, size: 14, duration: 1250, delay: 24 },
  { color: "#009e68", vx: 57, vy: -224, spin: 85, tilt: -25, size: 16, duration: 1120, delay: 8 },
  { color: "#1279de", vx: 133, vy: -191, spin: -120, tilt: 18, size: 14, duration: 1040, delay: 20 },
  { color: "#8050df", vx: 96, vy: -141, spin: 125, tilt: 40, size: 12, duration: 900, delay: 4 },
];

// Sample gravity and air resistance once. The browser interpolates the
// transforms; no animation loop or React updates run during a flight.
const flights = petals.map((petal, index) => ({
  ...petal,
  frames: Array.from({ length: 49 }, (_, step): Keyframe => {
    const progress = step / 48;
    const t = progress * petal.duration / 1000;
    const x = petal.vx * (1 - Math.exp(-2.4 * t)) / 2.4;
    const y = petal.vy * t + 240 * t * t;
    const flutter = Math.sin(t * 9 + index) * 5 * (1 - Math.exp(-4 * t));
    const angle = petal.tilt + petal.spin * (1 - Math.exp(-1.6 * t)) / 1.6 + flutter;
    const reveal = Math.min(1, t / .065);
    const fade = Math.max(0, (progress - .68) / .32);
    const scale = .72 + .28 * (1 - (1 - reveal) ** 3) - .1 * fade;
    return {
      offset: progress,
      opacity: Math.min(1, t / .025) * (1 - fade) ** 1.3,
      transform: `translate(calc(-50% + ${x.toFixed(3)}px * var(--petal-spread)), calc(-50% + ${y.toFixed(3)}px)) rotate(${angle.toFixed(2)}deg) scale(${scale.toFixed(3)})`,
    };
  }),
}));

export const PETAL_BURST_DURATION = Math.max(...petals.map(({ duration, delay }) => duration + delay)) + 60;

export default function PetalBurst() {
  const elements = useRef<(SVGSVGElement | null)[]>([]);

  useEffect(() => {
    const animations = flights.map(({ frames, duration, delay }, i) =>
      elements.current[i]?.animate(frames, { duration, delay, easing: "linear", fill: "both" })
    );
    return () => animations.forEach((animation) => animation?.cancel());
  }, []);

  return (
    <span className={styles.petalBurst} aria-hidden="true">
      {petals.map(({ color, size }, i) => (
        <svg
          key={color}
          ref={(element) => { elements.current[i] = element; }}
          className={styles.burstPetal}
          viewBox="130 204.6 764 615.1"
          focusable="false"
          style={{ color, width: size }}
        >
          <path d={capacity} fill="currentColor" opacity=".28" />
          <path d={remaining} fill="currentColor" />
        </svg>
      ))}
    </span>
  );
}
