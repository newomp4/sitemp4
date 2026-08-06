import type { CSSProperties } from "react";
import styles from "./f10.module.css";

/**
 * f10 — "Beams". Underwater city lights: fourteen thin vertical beams
 * (2-6px wide, 30-95% tall, irregular gaps, cyan/azure/electric/near-
 * white) rendered three times from the same markup — a sharp pass at
 * opacity 0.4, a bloom pass through blur(26px) saturate(1.35), and a
 * haze pass through blur(80px) at opacity 0.8. Every beam breathes
 * height and brightness on staggered 4-9s clocks via nth-child delays —
 * slow and dreamy, never a strobe. Reveal: translateY. Grain masked to
 * the glow.
 */

const CYAN = "#2ad4ff";
const AZURE = "#0c8df9";
const ELECTRIC = "#0d61f0";
const ICE = "#cfe6ff";

type Beam = { left: number; w: number; h: number; c: string };

const BEAMS: Beam[] = [
  { left: 3, w: 3, h: 58, c: AZURE },
  { left: 7.5, w: 2, h: 34, c: CYAN },
  { left: 13, w: 5, h: 76, c: ELECTRIC },
  { left: 21, w: 2, h: 45, c: ICE },
  { left: 26, w: 4, h: 88, c: AZURE },
  { left: 34, w: 3, h: 52, c: CYAN },
  { left: 43, w: 6, h: 95, c: ELECTRIC },
  { left: 49, w: 2, h: 40, c: ICE },
  { left: 56, w: 4, h: 70, c: CYAN },
  { left: 63, w: 3, h: 84, c: AZURE },
  { left: 72, w: 5, h: 62, c: ELECTRIC },
  { left: 79, w: 2, h: 30, c: CYAN },
  { left: 86, w: 4, h: 78, c: AZURE },
  { left: 93, w: 3, h: 48, c: ICE },
];

/** One rendering of the fourteen beams; the pass class decides whether
 * this copy is the sharp core, the bloom, or the haze. */
function BeamSet({ pass }: { pass: string }) {
  return (
    <div className={`${styles.set} ${pass}`}>
      {BEAMS.map((b, i) => (
        <span
          key={i}
          className={styles.beam}
          style={
            {
              left: `${b.left}%`,
              width: `${b.w}px`,
              height: `${b.h}%`,
              "--c": b.c,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

export default function F10() {
  return (
    <div className={styles.layer} aria-hidden="true">
      <BeamSet pass={styles.haze} />
      <BeamSet pass={styles.bloom} />
      <BeamSet pass={styles.sharp} />
      <div className={styles.grain} />
    </div>
  );
}
