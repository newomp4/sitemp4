"use client";

import { useEffect, useRef } from "react";
import { profile } from "@/lib/content";
import styles from "./styles.module.css";

/**
 * The hidden footer, Dia-style. An empty spacer sits at the document's
 * very bottom; a fixed aurora in the avatar's electric blues rises from
 * the bottom edge in step with scrolling into it. It is deliberately a
 * peek, not a resting state: on desktop, once you stop scrolling with
 * the reveal open, the page smooth-scrolls back and the color retracts —
 * the elastic behavior. Gradients carry many easing stops and animated
 * film grain dithers them so nothing bands. Dropped under
 * prefers-reduced-motion.
 */
export default function HiddenFooter() {
  const rootRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = rootRef.current;
    const spacer = spacerRef.current;
    if (!root || !spacer) return;

    const progressRef = { current: 0 };
    let raf = 0;
    let idleTimer = 0;
    let retractRaf = 0;
    const canSnap = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const update = () => {
      raf = 0;
      const rect = spacer.getBoundingClientRect();
      const p = Math.min(
        1,
        Math.max(0, (window.innerHeight - rect.top) / rect.height),
      );
      progressRef.current = p;
      root.style.setProperty("--reveal", p.toFixed(4));
      // The color rises on an eased curve while the text tracks linearly:
      // the slight lag between them reads as depth.
      root.style.setProperty("--revealE", (1 - Math.pow(1 - p, 2)).toFixed(4));
      root.dataset.open = p > 0.02 ? "true" : "false";
    };

    const cancelRetract = () => {
      if (retractRaf) {
        cancelAnimationFrame(retractRaf);
        retractRaf = 0;
      }
    };

    /* The elastic: a half-open peek slowly eases itself shut (a long,
       gentle glide, not a snap). Commit past ~70% or ride to the very
       bottom and it stays — a resting state you chose on purpose. */
    const retract = () => {
      const p = progressRef.current;
      if (p <= 0.03 || p >= 0.7) return;
      const rect = spacer.getBoundingClientRect();
      const targetY = window.scrollY + rect.top - window.innerHeight;
      const startY = window.scrollY;
      const dist = targetY - startY;
      if (Math.abs(dist) < 2) return;
      const t0 = performance.now();
      const DURATION = 950;
      const ease = (t: number) => 1 - Math.pow(1 - t, 3);
      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / DURATION);
        window.scrollTo(0, startY + dist * ease(t));
        retractRaf = t < 1 ? requestAnimationFrame(step) : 0;
      };
      retractRaf = requestAnimationFrame(step);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
      if (canSnap && !retractRaf) {
        window.clearTimeout(idleTimer);
        idleTimer = window.setTimeout(retract, 450);
      }
    };
    const onUserInput = () => {
      cancelRetract();
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.addEventListener("wheel", onUserInput, { passive: true });
    window.addEventListener("touchstart", onUserInput, { passive: true });
    window.addEventListener("keydown", onUserInput);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("wheel", onUserInput);
      window.removeEventListener("touchstart", onUserInput);
      window.removeEventListener("keydown", onUserInput);
      window.clearTimeout(idleTimer);
      cancelRetract();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.reveal} aria-hidden="true">
      {/* Dead space at the document's very bottom — scrolling into it drives the reveal */}
      <div ref={spacerRef} className={styles.revealSpacer} />

      {/* The color, rising from the bottom edge. Pre-rendered with noise
          baked in (scratchpad aurora.js → sharp) so it cannot band, opaque
          on the page's own #111 so its top edge is invisible. */}
      <div className={styles.revealLayer}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/footer-aurora.png" alt="" className={styles.auroraImg} />
        {/* A mirrored copy drifting slowly across the first: the color
            breathes instead of standing still */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/footer-aurora.png"
          alt=""
          className={`${styles.auroraImg} ${styles.auroraDrift}`}
        />
        {/* Film grain, animated, pooled over the blue */}
        <div className={styles.revealGrain} />
      </div>

      {/* One small footer line: quote left, the @ right */}
      <div className={styles.revealText}>
        <div className={styles.revealRow}>
          <p className={styles.revealQuote}>
            &ldquo;It won&rsquo;t fail because of me&rdquo;
            <span className={styles.revealBy}> - tom sachs</span>
          </p>
          <a
            href={profile.handleHref}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={-1}
            className={styles.revealLink}
          >
            @{profile.handle}
          </a>
        </div>
      </div>
    </div>
  );
}
