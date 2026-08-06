"use client";

import type { ReactNode } from "react";

/**
 * An in-page link that travels rather than jumps: a long, gentle
 * ease-in-out glide (~1.1s) down to its target, which lands upper-middle
 * with its folded note opened. Any scroll input from the user cancels
 * the glide immediately. Reduced motion jumps straight there.
 */
export default function AnchorLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = document.getElementById(href.slice(1));
    if (!el) return; // fall back to default navigation
    e.preventDefault();
    el.setAttribute("data-unfold", "");

    const targetY = Math.max(
      0,
      el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.32,
    );
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.scrollTo(0, targetY);
      return;
    }

    const startY = window.scrollY;
    const dist = targetY - startY;
    if (Math.abs(dist) < 2) return;
    const DURATION = 1100;
    const t0 = performance.now();
    const ease = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    let raf = 0;
    const cancel = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / DURATION);
      window.scrollTo(0, startY + dist * ease(t));
      raf = t < 1 ? requestAnimationFrame(step) : 0;
      if (!raf) {
        window.removeEventListener("wheel", cancel);
        window.removeEventListener("touchstart", cancel);
      }
    };
    // The user's own scrolling always wins over the glide
    window.addEventListener("wheel", cancel, { passive: true, once: true });
    window.addEventListener("touchstart", cancel, { passive: true, once: true });
    raf = requestAnimationFrame(step);
  };

  return (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  );
}
