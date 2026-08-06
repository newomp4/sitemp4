"use client";

import { useEffect, useRef } from "react";
import styles from "./styles.module.css";

/**
 * The hidden footer — the "Glow stack" winner from the bake-off. Three
 * depth layers of bottom-anchored radial glows in the avatar's blues:
 * indigo wash at the back, electric cores in the middle, cyan highlights
 * in front, film grain riding the front layer.
 *
 * Motion: scrolling only sets a TARGET; two underdamped springs chase it
 * (a tense one for mid/front + text, a lazy one for the back wash), so
 * the reveal opens with weight, the planes stretch apart, and everything
 * settles with a slight overshoot when you stop. The dead zone is a
 * short tug: at the page's natural bottom you see almost nothing, one
 * small extra pull and the gradient sweeps in, and it still rests a
 * little low even fully open.
 *
 * Dropped entirely under prefers-reduced-motion.
 */

const REVEAL_MAX = 0.9; // even fully tugged, it stays a touch down

export default function HiddenFooter() {
  const rootRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = rootRef.current;
    const spacer = spacerRef.current;
    if (!root || !spacer) return;

    let raf = 0;
    let running = false;
    let lastT = 0;
    let target = 0;
    const s1 = { x: 0, v: 0, k: 170, c: 18 }; // tense, ~5% overshoot
    const s2 = { x: 0, v: 0, k: 80, c: 13 }; // soft, lags behind

    const measure = () => {
      // Progress comes from actual scrolling into the spacer, never from
      // the spacer merely being visible — on a tall monitor where the
      // whole page fits, the footer stays shut.
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const spacerH = spacer.getBoundingClientRect().height;
      if (maxScroll <= 2 || spacerH <= 0) {
        target = 0;
        return;
      }
      const start = Math.max(0, maxScroll - spacerH);
      const raw = Math.min(
        1,
        Math.max(0, (window.scrollY - start) / spacerH),
      );
      target = raw * REVEAL_MAX;
    };
    const apply = () => {
      root.style.setProperty("--reveal", s1.x.toFixed(4));
      root.style.setProperty("--revealSoft", s2.x.toFixed(4));
      root.dataset.open = Math.max(target, s1.x) > 0.02 ? "true" : "false";
    };
    const stepSpring = (
      s: { x: number; v: number; k: number; c: number },
      dt: number,
    ) => {
      const a = s.k * (target - s.x) - s.c * s.v;
      s.v += a * dt;
      s.x += s.v * dt;
    };
    const settled = (s: { x: number; v: number }) =>
      Math.abs(s.x - target) < 0.0004 && Math.abs(s.v) < 0.002;
    const tick = (now: number) => {
      const dt = Math.min(0.032, (now - lastT) / 1000 || 0.016);
      lastT = now;
      stepSpring(s1, dt);
      stepSpring(s2, dt);
      apply();
      if (settled(s1) && settled(s2)) {
        s1.x = target;
        s2.x = target;
        s1.v = 0;
        s2.v = 0;
        apply();
        running = false;
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      measure();
      if (!running) {
        running = true;
        lastT = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    kick();
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick, { passive: true });
    return () => {
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={styles.reveal}
      data-open="false"
      aria-hidden="true"
    >
      {/* Deep dead space at the document's very bottom — the reveal costs
          real scrolling on purpose */}
      <div ref={spacerRef} className={styles.revealSpacer} />

      {/* The glow stack */}
      <div className={styles.revealLayer}>
        <div className={styles.gsLiftSoft}>
          <div className={`${styles.gsGlow} ${styles.gsBack}`} />
        </div>
        <div className={styles.gsLiftTense}>
          <div className={`${styles.gsGlow} ${styles.gsMid}`} />
        </div>
        <div className={styles.gsLiftTense}>
          <div className={`${styles.gsGlow} ${styles.gsFront}`} />
          <div className={styles.revealGrain} />
        </div>
      </div>

      {/* The quote, centered, attribution beneath */}
      <div className={styles.revealText}>
        <div className={styles.revealRow}>
          <p className={styles.revealQuote}>
            &ldquo;It won&rsquo;t fail because of me&rdquo;
          </p>
          <p className={styles.revealBy}>tom sachs</p>
        </div>
      </div>
    </div>
  );
}
