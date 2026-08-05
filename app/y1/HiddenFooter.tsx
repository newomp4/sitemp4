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
        {/* Live aurora: nine blurred curtains, each swaying on its own
            slow clock so the color is always gently moving */}
        <svg
          className="h-full w-full"
          viewBox="0 0 1280 600"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="aurora-deep" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="#1750c2" />
              <stop offset="0.2" stopColor="#1447ad" stopOpacity="0.96" />
              <stop offset="0.38" stopColor="#10388f" stopOpacity="0.8" />
              <stop offset="0.55" stopColor="#0d2c74" stopOpacity="0.58" />
              <stop offset="0.7" stopColor="#0c2563" stopOpacity="0.36" />
              <stop offset="0.84" stopColor="#0c2054" stopOpacity="0.17" />
              <stop offset="0.94" stopColor="#0c1d4b" stopOpacity="0.05" />
              <stop offset="1" stopColor="#0c1c46" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="aurora-electric" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="#0e75ff" />
              <stop offset="0.18" stopColor="#0d6bf8" stopOpacity="0.96" />
              <stop offset="0.36" stopColor="#0d5ce4" stopOpacity="0.8" />
              <stop offset="0.54" stopColor="#1150d0" stopOpacity="0.58" />
              <stop offset="0.7" stopColor="#124bbc" stopOpacity="0.36" />
              <stop offset="0.84" stopColor="#1244aa" stopOpacity="0.17" />
              <stop offset="0.94" stopColor="#12409f" stopOpacity="0.05" />
              <stop offset="1" stopColor="#123f9e" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="aurora-cyan" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="#2ad4ff" />
              <stop offset="0.2" stopColor="#1cb6fc" stopOpacity="0.94" />
              <stop offset="0.38" stopColor="#0f97f9" stopOpacity="0.76" />
              <stop offset="0.55" stopColor="#0c8df9" stopOpacity="0.55" />
              <stop offset="0.7" stopColor="#0d7ff4" stopOpacity="0.34" />
              <stop offset="0.84" stopColor="#0e6fe9" stopOpacity="0.16" />
              <stop offset="0.94" stopColor="#0d66e4" stopOpacity="0.05" />
              <stop offset="1" stopColor="#0d61f0" stopOpacity="0" />
            </linearGradient>
            <filter id="aurora-blur" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="30" />
            </filter>
          </defs>
          <g filter="url(#aurora-blur)">
            <rect className={styles.curtainA} x="-40" y="277" width="200" height="380" fill="url(#aurora-deep)" />
            <rect className={styles.curtainB} x="101" y="210" width="200" height="450" fill="url(#aurora-electric)" />
            <rect className={styles.curtainC} x="242" y="140" width="200" height="520" fill="url(#aurora-deep)" />
            <rect className={styles.curtainA} x="383" y="60" width="200" height="600" fill="url(#aurora-cyan)" />
            <rect className={styles.curtainB} x="524" y="16" width="200" height="644" fill="url(#aurora-electric)" />
            <rect className={styles.curtainC} x="665" y="60" width="200" height="600" fill="url(#aurora-cyan)" />
            <rect className={styles.curtainA} x="806" y="140" width="200" height="520" fill="url(#aurora-deep)" />
            <rect className={styles.curtainB} x="947" y="210" width="200" height="450" fill="url(#aurora-electric)" />
            <rect className={styles.curtainC} x="1088" y="277" width="232" height="380" fill="url(#aurora-deep)" />
          </g>
        </svg>
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
