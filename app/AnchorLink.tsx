"use client";

import type { ReactNode } from "react";

/**
 * An in-page link that travels rather than jumps: a long, gentle
 * ease-in-out glide (~1.1s) down to its target, which lands upper-middle
 * with its folded note opened. Any user input (wheel, touch, keys, a
 * second click) cancels the glide immediately. On arrival the URL hash
 * and keyboard focus move to the target. Reduced motion jumps straight
 * there.
 */

let cancelActive: (() => void) | null = null;

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
    cancelActive?.();
    el.setAttribute("data-unfold", "");

    const arrive = () => {
      window.history.pushState(null, "", href);
      el.focus({ preventScroll: true });
    };

    const targetY = Math.max(
      0,
      el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.32,
    );
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.scrollTo(0, targetY);
      arrive();
      return;
    }

    const startY = window.scrollY;
    const dist = targetY - startY;
    if (Math.abs(dist) < 2) {
      arrive();
      return;
    }
    const DURATION = 1100;
    const t0 = performance.now();
    const ease = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    let raf = 0;
    const cancel = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchstart", cancel);
      window.removeEventListener("keydown", cancel);
      cancelActive = null;
    };
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / DURATION);
      window.scrollTo(0, startY + dist * ease(t));
      if (t < 1) {
        raf = requestAnimationFrame(step);
      } else {
        cancel();
        arrive();
      }
    };
    // The user's own input always wins over the glide
    window.addEventListener("wheel", cancel, { passive: true });
    window.addEventListener("touchstart", cancel, { passive: true });
    window.addEventListener("keydown", cancel);
    cancelActive = cancel;
    raf = requestAnimationFrame(step);
  };

  return (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  );
}
