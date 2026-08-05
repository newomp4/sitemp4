"use client";

import { useEffect, useRef } from "react";
import { profile } from "@/lib/content";
import styles from "./styles.module.css";

/**
 * The hidden footer. An empty spacer sits at the document's very bottom;
 * a fixed, bottom-anchored aurora rises from the bottom edge in step with
 * scrolling into that space (translated, never squashed), in the electric
 * blues sampled from the actual Twitter avatar (#0c1c46 → #0d61f0 →
 * #0c8df9 → #2ad4ff), grain fading out with the color so the top edge
 * dissolves into the page. A quote and the @ drift up with it.
 * Dropped entirely under prefers-reduced-motion.
 */
export default function HiddenFooter() {
  const rootRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = rootRef.current;
    const spacer = spacerRef.current;
    if (!root || !spacer) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = spacer.getBoundingClientRect();
      const progress = Math.min(
        1,
        Math.max(0, (window.innerHeight - rect.top) / rect.height),
      );
      root.style.setProperty("--reveal", progress.toFixed(4));
      root.dataset.open = progress > 0.02 ? "true" : "false";
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
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
              <stop offset="0" stopColor="#1749b6" />
              <stop offset="0.5" stopColor="#0c2a6e" />
              <stop offset="1" stopColor="#0c1c46" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="aurora-electric" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="#0e75ff" />
              <stop offset="0.55" stopColor="#0d61f0" />
              <stop offset="1" stopColor="#1749b6" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="aurora-cyan" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="#2ad4ff" />
              <stop offset="0.45" stopColor="#0c8df9" />
              <stop offset="1" stopColor="#0e75ff" stopOpacity="0" />
            </linearGradient>
            <filter id="aurora-blur" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="26" />
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
        {/* Film grain, fading out with the color */}
        <div className={styles.revealGrain} />
      </div>

      {/* The words, drifting up as the color rises */}
      <div className={styles.revealText}>
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
  );
}
