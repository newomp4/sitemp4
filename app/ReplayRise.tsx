"use client";

import { useEffect } from "react";

/**
 * Mobile Safari restores pages from the back-forward cache with CSS
 * animations already finished, so returning to the site skips the
 * entrance. When a restore happens, rewind every .rise element and let
 * it play again.
 */
export default function ReplayRise() {
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => {
      if (!e.persisted) return;
      document.querySelectorAll<HTMLElement>(".rise").forEach((el) => {
        el.style.animation = "none";
        void el.offsetWidth; // commit the reset before restarting
        el.style.animation = "";
      });
    };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);
  return null;
}
