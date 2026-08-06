import styles from "./f4.module.css";

/**
 * f4 — "Glow stack". Three depth layers of enormous bottom-anchored
 * radial glows: an indigo/navy wash at the back, an electric-blue core
 * in the middle, cyan highlights in front. Each drifts sideways and
 * breathes on its own clock (25s / 17s / 11s). The back layer rises with
 * linear --reveal while mid and front ride eased --revealE — the phase
 * difference while opening reads as depth parallax. Grain pooled over
 * the color dithers the ramps.
 */
export default function F4() {
  return (
    <div className={styles.layer} aria-hidden="true">
      <div className={styles.liftLin}>
        <div className={`${styles.glow} ${styles.back}`} />
      </div>
      <div className={styles.liftEase}>
        <div className={`${styles.glow} ${styles.mid}`} />
      </div>
      <div className={styles.liftEase}>
        <div className={`${styles.glow} ${styles.front}`} />
        <div className={styles.grain} />
      </div>
    </div>
  );
}
