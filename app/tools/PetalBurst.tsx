import type { CSSProperties } from "react";
import styles from "./tools.module.css";

// The same paths as petal.bar, with solid pastel outer fills that stay
// legible on the dark tools page. Mirrored pairs keep the burst centered.
const capacity = "M399.49 773.15 L153.42 434.47 C117.02 384.36 128.13 314.24 178.23 277.84 C185.69 272.42 193.78 267.94 202.34 264.51 C401.05 184.67 622.93 184.67 821.64 264.51 C879.11 287.60 906.97 352.90 883.89 410.36 C880.45 418.91 875.97 427.01 870.56 434.47 L624.49 773.15 C603.19 802.46 569.04 819.68 532.81 819.37 C518.93 819.25 505.05 819.25 491.17 819.37 C454.93 819.68 420.79 802.46 399.49 773.15 Z";
const remaining = "M690.04 427.98 C749.47 445.40 783.52 507.70 766.09 567.13 C762.47 579.46 756.76 591.09 749.21 601.49 L624.49 773.15 C603.19 802.46 569.04 819.68 532.81 819.37 C518.93 819.25 505.05 819.25 491.16 819.37 C454.93 819.68 420.79 802.46 399.49 773.15 L274.77 601.49 C238.37 551.39 249.48 481.26 299.58 444.86 C308.68 438.25 318.72 433.05 329.35 429.43 L333.94 427.98 C435.66 398.15 543.00 394.42 646.13 416.79 Z";

const petals = [
  { color: "#e51c35", rind: "#f8bfc6", x: -90, y: -56, turn: -48, size: 16, delay: 0 },
  { color: "#ff6a00", rind: "#ffd5b8", x: -56, y: -80, turn: 32, size: 20, delay: 24 },
  { color: "#ff9f00", rind: "#ffe4b8", x: -20, y: -96, turn: -25, size: 17, delay: 48 },
  { color: "#009e68", rind: "#b8e4d5", x: 20, y: -96, turn: 25, size: 17, delay: 48 },
  { color: "#1279de", rind: "#bdd9f6", x: 56, y: -80, turn: -32, size: 20, delay: 24 },
  { color: "#8050df", rind: "#dbcef6", x: 90, y: -56, turn: 48, size: 16, delay: 0 },
];

export default function PetalBurst() {
  return (
    <span className={styles.petalBurst} aria-hidden="true">
      {petals.map(({ color, rind, x, y, turn, size, delay }) => (
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
            "--petal-delay": `${delay}ms`,
          } as CSSProperties}
        >
          <path d={capacity} fill={rind} />
          <path d={remaining} fill="currentColor" />
        </svg>
      ))}
    </span>
  );
}
