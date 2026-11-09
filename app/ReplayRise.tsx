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
      // A finished entrance no longer shows up in getAnimations(), so there
      // is nothing to rewind. Taking the animation off and putting it back,
      // with one forced layout in between, starts each one over from its
      // own delay, so the stagger runs again exactly as on a first load.
      const elements = document.querySelectorAll<HTMLElement>(".rise");
      elements.forEach((element) => {
        element.style.animation = "none";
      });
      void document.documentElement.offsetWidth;
      elements.forEach((element) => {
        element.style.animation = "";
      });
    };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  return null;
}
