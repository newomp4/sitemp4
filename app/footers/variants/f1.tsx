import styles from "./f1.module.css";

/**
 * f1 — "Dia, in blues". The faithful Dia homepage build: nine overlapping
 * vertical rects on a 141px pitch, EACH wrapped in its own feGaussianBlur
 * stdDeviation 15 filter, filled with 7-stop gradients whose alpha eases
 * to 0 at the top (hue drifts within each ramp so nothing bands). Heights
 * arc 323 → 584 → 323 from the edges to center; hue arcs indigo → royal →
 * electric → azure → cyan and back. Revealed by scaleY(--revealE) from
 * transform-origin bottom — Dia's exact move.
 */

type GradStop = readonly [number, string, number];

const GRADS: { id: string; stops: GradStop[] }[] = [
  {
    id: "f1-indigo",
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
    id: "f1-royal",
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
    id: "f1-electric",
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
  {
    id: "f1-azure",
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
    id: "f1-cyan",
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
];

/* Nine bars: x on a 141 pitch (200 wide, so 59px of overlap), heights
   symmetric edges → center, hue arcing indigo → cyan → indigo, and three
   interleaved sway clocks so neighbors never move together. */
const BARS: { x: number; h: number; fill: string; clock: 0 | 1 | 2 }[] = [
  { x: -24, h: 323, fill: "f1-indigo", clock: 0 },
  { x: 117, h: 388, fill: "f1-royal", clock: 1 },
  { x: 258, h: 453, fill: "f1-electric", clock: 2 },
  { x: 399, h: 519, fill: "f1-azure", clock: 0 },
  { x: 540, h: 584, fill: "f1-cyan", clock: 1 },
  { x: 681, h: 519, fill: "f1-azure", clock: 2 },
  { x: 822, h: 453, fill: "f1-electric", clock: 0 },
  { x: 963, h: 388, fill: "f1-royal", clock: 1 },
  { x: 1104, h: 323, fill: "f1-indigo", clock: 2 },
];

export default function F1() {
  const clocks = [styles.swayA, styles.swayB, styles.swayC];
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
          {/* One blur per rect, like Dia */}
          {BARS.map((_, i) => (
            <filter
              key={i}
              id={`f1-blur-${i}`}
              x="-40%"
              y="-25%"
              width="180%"
              height="150%"
            >
              <feGaussianBlur stdDeviation="15" />
            </filter>
          ))}
        </defs>
        {BARS.map((b, i) => (
          <rect
            key={i}
            className={clocks[b.clock]}
            x={b.x}
            y={600 - b.h}
            width={200}
            height={b.h + 60}
            fill={`url(#${b.fill})`}
            filter={`url(#f1-blur-${i})`}
          />
        ))}
      </svg>
      {/* Film grain, pooled over the blue, doubling as dither */}
      <div className={styles.grain} />
    </div>
  );
}
