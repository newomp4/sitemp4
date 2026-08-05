"use client";

import { useEffect, useRef } from "react";
import { profile } from "@/lib/content";
import styles from "./styles.module.css";

/**
 * The hidden footer — Dia-style. An empty spacer sits at the very bottom
 * of the document; a fixed, bottom-anchored aurora layer scales up out of
 * the bottom edge exactly in step with scrolling into that dead space,
 * while the wordmark drifts up on the same progress. Blues sampled from
 * the profile photo's dusk sky and river, film grain on top.
 *
 * Decorative only (aria-hidden, pointer-events: none); under
 * prefers-reduced-motion the whole block is dropped via CSS.
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

      {/* The color, growing up out of the bottom edge */}
      <div className={styles.revealLayer}>
        <svg
          className="h-full w-full"
          viewBox="0 0 1280 600"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="aurora-a" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="#9FC2E8" />
              <stop offset="0.45" stopColor="#5B84B8" />
              <stop offset="1" stopColor="#22405F" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="aurora-b" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="#C9DCF2" />
              <stop offset="0.5" stopColor="#7FA6D4" />
              <stop offset="1" stopColor="#2E5077" stopOpacity="0" />
            </linearGradient>
            <filter id="aurora-blur" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="26" />
            </filter>
          </defs>
          <g filter="url(#aurora-blur)">
            <rect x="-40" y="277" width="200" height="323" fill="url(#aurora-a)" />
            <rect x="101" y="210" width="200" height="390" fill="url(#aurora-b)" />
            <rect x="242" y="140" width="200" height="460" fill="url(#aurora-a)" />
            <rect x="383" y="60" width="200" height="540" fill="url(#aurora-b)" />
            <rect x="524" y="16" width="200" height="584" fill="url(#aurora-a)" />
            <rect x="665" y="60" width="200" height="540" fill="url(#aurora-b)" />
            <rect x="806" y="140" width="200" height="460" fill="url(#aurora-a)" />
            <rect x="947" y="210" width="200" height="390" fill="url(#aurora-b)" />
            <rect x="1088" y="277" width="232" height="323" fill="url(#aurora-a)" />
          </g>
        </svg>
        {/* Film grain over the color */}
        <div className={styles.revealGrain} />
      </div>

      {/* The wordmark, drifting up as the color rises */}
      <div className={styles.revealText}>
        <p className={styles.revealMark}>@{profile.handle}</p>
        <p className={styles.revealSub}>see you on the internet</p>
      </div>
    </div>
  );
}
