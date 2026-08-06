import styles from "./f7.module.css";

/**
 * f7 — "Spotlight". The minimal one: a single huge radial glow rising
 * from bottom center — electric core through royal into navy across
 * seven eased stops — plus three barely-there blurred shafts at 30/50/70%
 * of the width. The whole scene breathes on a 12s clock (scale 1↔1.045
 * from the bottom, opacity 0.85↔1) with the shafts drifting on their own
 * offset clocks. Strong film grain carries the texture and dithers the
 * ramp. Reveal: scaleY from the bottom, Dia-style.
 */
export default function F7() {
  return (
    <div className={styles.layer} aria-hidden="true">
      <div className={styles.scene}>
        <div className={styles.glow} />
        <div className={`${styles.shaft} ${styles.shaftA}`} />
        <div className={`${styles.shaft} ${styles.shaftB}`} />
        <div className={`${styles.shaft} ${styles.shaftC}`} />
      </div>
      <div className={styles.grain} />
    </div>
  );
}
