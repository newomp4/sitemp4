import styles from "./f6.module.css";

/**
 * f6 — "Counterspin". Two enormous conic-gradient discs, centers sunk
 * ~30vh below the layer's bottom edge so only their upper arcs show,
 * hues cycling indigo → electric → cyan → transparent and smoothly back
 * to indigo. They rotate in opposite directions on very slow linear
 * clocks (72s / 50s), so their hue boundaries are forever crossing —
 * constant slow color weather. A small cyan glow breathes at bottom
 * center. Blur 64px + a top dissolve mask + masked film grain keep it
 * band-free. Reveal: translateY.
 */
export default function F6() {
  return (
    <div className={styles.layer} aria-hidden="true">
      <div className={styles.fade}>
        <div className={`${styles.disc} ${styles.discA}`} />
        <div className={`${styles.disc} ${styles.discB}`} />
        <div className={styles.ember} />
      </div>
      <div className={styles.grain} />
    </div>
  );
}
