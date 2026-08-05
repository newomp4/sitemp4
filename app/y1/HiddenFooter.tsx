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
    let retracting = false;
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
      root.dataset.open = p > 0.02 ? "true" : "false";
      if (retracting && p < 0.01) retracting = false;
    };

    /* The peek: stopped scrolling with the reveal open → glide back shut. */
    const snapBack = () => {
      if (retracting || progressRef.current <= 0.03) return;
      const rect = spacer.getBoundingClientRect();
      const targetY = window.scrollY + rect.top - window.innerHeight;
      retracting = true;
      window.scrollTo({ top: targetY, behavior: "smooth" });
      window.setTimeout(() => {
        retracting = false;
      }, 1200);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
      if (canSnap && !retracting) {
        window.clearTimeout(idleTimer);
        idleTimer = window.setTimeout(snapBack, 190);
      }
    };
    const cancelRetract = () => {
      retracting = false;
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.addEventListener("wheel", cancelRetract, { passive: true });
    window.addEventListener("touchstart", cancelRetract, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("wheel", cancelRetract);
      window.removeEventListener("touchstart", cancelRetract);
      window.clearTimeout(idleTimer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.reveal} aria-hidden="true">
      {/* Dead space at the document's very bottom — scrolling into it drives the reveal */}
      <div ref={spacerRef} className={styles.revealSpacer} />

      {/* The color, rising from the bottom edge */}
      <div className={styles.revealLayer}>
        <svg
          className="h-full w-full"
          viewBox="0 0 1280 600"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="aurora-deep" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="#1750c2" />
              <stop offset="0.35" stopColor="#123f9e" stopOpacity="0.9" />
              <stop offset="0.6" stopColor="#0d2c74" stopOpacity="0.55" />
              <stop offset="0.82" stopColor="#0c2158" stopOpacity="0.22" />
              <stop offset="1" stopColor="#0c1c46" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="aurora-electric" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="#0e75ff" />
              <stop offset="0.3" stopColor="#0d61f0" stopOpacity="0.92" />
              <stop offset="0.58" stopColor="#1150d0" stopOpacity="0.6" />
              <stop offset="0.8" stopColor="#1246a8" stopOpacity="0.25" />
              <stop offset="1" stopColor="#123f9e" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="aurora-cyan" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="#2ad4ff" />
              <stop offset="0.35" stopColor="#0c8df9" stopOpacity="0.85" />
              <stop offset="0.6" stopColor="#0e75ff" stopOpacity="0.5" />
              <stop offset="0.82" stopColor="#0e63e0" stopOpacity="0.2" />
              <stop offset="1" stopColor="#0d61f0" stopOpacity="0" />
            </linearGradient>
            <filter id="aurora-blur" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="28" />
            </filter>
          </defs>
          <g filter="url(#aurora-blur)">
            <rect x="-40" y="277" width="200" height="323" fill="url(#aurora-deep)" />
            <rect x="101" y="210" width="200" height="390" fill="url(#aurora-electric)" />
            <rect x="242" y="140" width="200" height="460" fill="url(#aurora-deep)" />
            <rect x="383" y="60" width="200" height="540" fill="url(#aurora-cyan)" />
            <rect x="524" y="16" width="200" height="584" fill="url(#aurora-electric)" />
            <rect x="665" y="60" width="200" height="540" fill="url(#aurora-cyan)" />
            <rect x="806" y="140" width="200" height="460" fill="url(#aurora-deep)" />
            <rect x="947" y="210" width="200" height="390" fill="url(#aurora-electric)" />
            <rect x="1088" y="277" width="232" height="323" fill="url(#aurora-deep)" />
          </g>
        </svg>
        {/* Film grain — animated, dithering the gradients so they never band */}
        <div className={styles.revealGrain} />
      </div>

      {/* One small footer line: quote left, the @ right */}
      <div className={styles.revealText}>
        <div className={styles.revealRow}>
          <p className={styles.revealQuote}>
            &ldquo;It won&rsquo;t fail because of me&rdquo;
            <span className={styles.revealBy}> — tom sachs</span>
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
