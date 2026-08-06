import styles from "./f8.module.css";

/**
 * f8 — "Dia rainbow". The literal Dia footer: nine overlapping vertical
 * rects in a 1280x600 viewBox (width 200 on a 141px pitch, symmetric
 * heights 323 → 584 → 323), each rect run through its own
 * feGaussianBlur stdDeviation 15 so the bars composite as soft light,
 * not one merged smear. Across the nine bars the fills sweep a full
 * dusk-muted rainbow — rose → orange → amber → lime → teal → cyan →
 * azure → violet → rose — every gradient easing to stop-opacity 0 at
 * the top across seven stops. Bars sway ±10px and breathe on three
 * staggered clocks. Reveal: scaleY from the bottom. Film grain over
 * everything.
 */

/* Dusk-muted sweep, one hue per bar (ends meet: rose → … → rose) */
const HUES = [
  "#c9707f", // dusk rose
  "#cd8a60", // ember orange
  "#c9a95f", // amber
  "#9fbc6a", // lime
  "#5fbda5", // teal
  "#55bdd8", // cyan
  "#5f8fd6", // azure
  "#8d7bd0", // violet
  "#c4708f", // back to rose
];

/* Symmetric 323 → 584 → 323; y anchors every bar to a bottom overshoot
   at 660 so the blur never lifts the floor */
const HEIGHTS = [323, 388, 454, 519, 584, 519, 454, 388, 323];

/* Eased alpha falloff, full color at the base → nothing at the top */
const STOPS: ReadonlyArray<readonly [number, number]> = [
  [0, 1],
  [0.2, 0.92],
  [0.4, 0.72],
  [0.58, 0.48],
  [0.74, 0.27],
  [0.88, 0.1],
  [1, 0],
];

export default function F8() {
  const sway = [styles.swayA, styles.swayB, styles.swayC];
  return (
    <div className={styles.layer} aria-hidden="true">
      <svg
        className={styles.sky}
        viewBox="0 0 1280 600"
        preserveAspectRatio="none"
      >
        <defs>
          {HUES.map((c, i) => (
            <linearGradient
              key={c + i}
              id={`f8-c${i + 1}`}
              x1="0"
              y1="1"
              x2="0"
              y2="0"
            >
              {STOPS.map(([offset, alpha]) => (
                <stop
                  key={offset}
                  offset={offset}
                  stopColor={c}
                  stopOpacity={alpha}
                />
              ))}
            </linearGradient>
          ))}
          {/* One blur definition, applied per-rect below — each bar gets
              its own feGaussianBlur pass before compositing, the Dia way */}
          <filter id="f8-soft" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="15" />
          </filter>
        </defs>
        {HEIGHTS.map((h, i) => (
          <rect
            key={i}
            className={sway[i % 3]}
            x={-24 + i * 141}
            y={660 - h}
            width={200}
            height={h}
            fill={`url(#f8-c${i + 1})`}
            filter="url(#f8-soft)"
          />
        ))}
      </svg>
      <div className={styles.grain} />
    </div>
  );
}
