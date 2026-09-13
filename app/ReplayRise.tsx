"use client";

import { useEffect } from "react";

/**
 * The entrance is pure CSS, so it needs no help on a normal load. The one
 * case it cannot cover is a back/forward-cache restore: the page comes
 * back with its animations already finished, fully settled, with no
 * arrival at all. This replays them.
 */
export default function ReplayRise() {
  useEffect(() => {
    const onShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      document.querySelectorAll<HTMLElement>(".rise").forEach((element) => {
        element.getAnimations().forEach((animation) => {
          animation.currentTime = 0;
          animation.play();
        });
      });
    };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  return null;
}
