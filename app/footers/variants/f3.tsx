import styles from "./f3.module.css";

/**
 * f3 — "Hue drift". Pure CSS: seven overlapping bottom-anchored bars,
 * hue-spread indigo → electric → cyan → azure, each blurred 46px and
 * swaying/breathing on its own staggered clock — while the whole bar
 * wrapper rides one slow hue-rotate(-10° ↔ 12°) 21s pendulum, so the
 * entire pool drifts through color like weather. Radially-masked film
 * grain dithers everything.
 */
export default function F3() {
  const bars = [
    styles.b1,
    styles.b2,
    styles.b3,
    styles.b4,
    styles.b5,
    styles.b6,
    styles.b7,
  ];
  return (
    <div className={styles.layer} aria-hidden="true">
      <div className={styles.wrap}>
        {bars.map((b) => (
          <div key={b} className={`${styles.bar} ${b}`} />
        ))}
      </div>
      <div className={styles.grain} />
    </div>
  );
}
