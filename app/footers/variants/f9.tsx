import styles from "./f9.module.css";

/**
 * f9 — "Waves". Three layered SVG bands of gentle rolling hills, each
 * path spanning exactly twice the 1440-unit viewBox width with a whole
 * number of sine periods per width — so translating a band by -50% of
 * its own width (-1440 units) lands on an identical silhouette and the
 * roll is seamless. Back band deep indigo (42s), mid electric (30s),
 * front azure/cyan (19s), each behind feGaussianBlur 20, the whole sea
 * breathing a whisper of scaleY. Reveal: translateY. Grain pooled at
 * the bottom.
 */

const W = 1440; // one tile; the path spans 2 * W
const FLOOR = 700; // below the 600-unit viewBox so blur never lifts the base

/** Cosine hills emitted as cubic Béziers with true tangents (Hermite →
 * Bézier), sampled every 60 units. Integer `periods` per tile keeps the
 * -50% translate seamless. */
function wavePath(
  mid: number,
  amp: number,
  periods: number,
  phase: number,
): string {
  const period = W / periods;
  const k = (2 * Math.PI) / period;
  const y = (x: number) => mid + amp * Math.sin(k * x + phase);
  const dy = (x: number) => amp * k * Math.cos(k * x + phase);
  const step = 60;
  let d = `M0 ${y(0).toFixed(1)}`;
  for (let x0 = 0; x0 < 2 * W; x0 += step) {
    const x1 = x0 + step;
    d += ` C${(x0 + step / 3).toFixed(1)} ${(y(x0) + (dy(x0) * step) / 3).toFixed(1)} ${(x1 - step / 3).toFixed(1)} ${(y(x1) - (dy(x1) * step) / 3).toFixed(1)} ${x1} ${y(x1).toFixed(1)}`;
  }
  return `${d} L${2 * W} ${FLOOR} L0 ${FLOOR} Z`;
}

const BACK = wavePath(172, 30, 2, 0.6);
const MID = wavePath(294, 40, 3, 2.7);
const FRONT = wavePath(408, 34, 2, 4.5);

export default function F9() {
  return (
    <div className={styles.layer} aria-hidden="true">
      <div className={styles.sea}>
        <svg
          className={styles.svg}
          viewBox="0 0 1440 600"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Each band lit at its crest, settling darker below — hue
                shifts between bands (indigo → electric → azure/cyan) so
                adjacent layers never share a luminance ramp */}
            <linearGradient id="f9-back" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#33509e" stopOpacity="0.7" />
              <stop offset="0.15" stopColor="#22397f" stopOpacity="0.66" />
              <stop offset="0.35" stopColor="#172a63" stopOpacity="0.6" />
              <stop offset="0.6" stopColor="#101f4e" stopOpacity="0.52" />
              <stop offset="0.8" stopColor="#0d1c48" stopOpacity="0.48" />
              <stop offset="1" stopColor="#0c1c46" stopOpacity="0.45" />
            </linearGradient>
            <linearGradient id="f9-mid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#4d84f7" stopOpacity="0.85" />
              <stop offset="0.15" stopColor="#1f63e8" stopOpacity="0.8" />
              <stop offset="0.35" stopColor="#1350cf" stopOpacity="0.72" />
              <stop offset="0.6" stopColor="#123f9e" stopOpacity="0.62" />
              <stop offset="0.8" stopColor="#103a94" stopOpacity="0.58" />
              <stop offset="1" stopColor="#0f3488" stopOpacity="0.55" />
            </linearGradient>
            <linearGradient id="f9-front" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2ad4ff" stopOpacity="0.95" />
              <stop offset="0.12" stopColor="#18b6fb" stopOpacity="0.9" />
              <stop offset="0.3" stopColor="#0c8df9" stopOpacity="0.85" />
              <stop offset="0.55" stopColor="#0d6bee" stopOpacity="0.8" />
              <stop offset="0.8" stopColor="#0d61f0" stopOpacity="0.78" />
              <stop offset="1" stopColor="#0d5ce0" stopOpacity="0.75" />
            </linearGradient>
            <filter id="f9-blur" x="-10%" y="-40%" width="120%" height="180%">
              <feGaussianBlur stdDeviation="20" />
            </filter>
          </defs>
          <path
            className={styles.rollBack}
            d={BACK}
            fill="url(#f9-back)"
            filter="url(#f9-blur)"
          />
          <path
            className={styles.rollMid}
            d={MID}
            fill="url(#f9-mid)"
            filter="url(#f9-blur)"
          />
          <path
            className={styles.rollFront}
            d={FRONT}
            fill="url(#f9-front)"
            filter="url(#f9-blur)"
          />
        </svg>
      </div>
      <div className={styles.grain} />
    </div>
  );
}
