import type { CSSProperties } from "react";
import styles from "./tools.module.css";

// The same two paths and palette used by petal.bar's floating footer petals.
const capacity = "M399.49 773.15 L153.42 434.47 C117.02 384.36 128.13 314.24 178.23 277.84 C185.69 272.42 193.78 267.94 202.34 264.51 C401.05 184.67 622.93 184.67 821.64 264.51 C879.11 287.60 906.97 352.90 883.89 410.36 C880.45 418.91 875.97 427.01 870.56 434.47 L624.49 773.15 C603.19 802.46 569.04 819.68 532.81 819.37 C518.93 819.25 505.05 819.25 491.17 819.37 C454.93 819.68 420.79 802.46 399.49 773.15 Z";
const remaining = "M690.04 427.98 C749.47 445.40 783.52 507.70 766.09 567.13 C762.47 579.46 756.76 591.09 749.21 601.49 L624.49 773.15 C603.19 802.46 569.04 819.68 532.81 819.37 C518.93 819.25 505.05 819.25 491.16 819.37 C454.93 819.68 420.79 802.46 399.49 773.15 L274.77 601.49 C238.37 551.39 249.48 481.26 299.58 444.86 C308.68 438.25 318.72 433.05 329.35 429.43 L333.94 427.98 C435.66 398.15 543.00 394.42 646.13 416.79 Z";

const petals = [
  { color: "#e51c35", x: -25, y: -34, turn: -48, size: 15 },
  { color: "#ff6a00", x: -9, y: -63, turn: 32, size: 19 },
  { color: "#ff9f00", x: 23, y: -76, turn: -25, size: 14 },
  { color: "#009e68", x: 56, y: -68, turn: 46, size: 17 },
  { color: "#1279de", x: 85, y: -43, turn: -38, size: 20 },
  { color: "#8050df", x: 100, y: -16, turn: 62, size: 14 },
];

export default function PetalBurst() {
  return (
    <span className={styles.petalBurst} aria-hidden="true">
      {petals.map(({ color, x, y, turn, size }, i) => (
        <svg
          key={color}
          className={styles.burstPetal}
          viewBox="130 204.6 764 615.1"
          focusable="false"
          style={{
            color,
            width: size,
            "--petal-x": `${x}px`,
            "--petal-y": `${y}px`,
            "--petal-turn": `${turn}deg`,
            "--petal-delay": `${i * 24}ms`,
          } as CSSProperties}
        >
          <path d={capacity} fill="currentColor" opacity=".28" />
          <path d={remaining} fill="currentColor" />
        </svg>
      ))}
    </span>
  );
}
