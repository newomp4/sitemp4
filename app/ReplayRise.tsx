"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** One observer per page; content is visible without JavaScript or with reduced motion. */
export default function ReplayRise() {
  const pathname = usePathname();

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".scroll-reveal"));
    let observer: IntersectionObserver | undefined;

    const reveal = (element: HTMLElement) => {
      if (element.dataset.reveal === "visible" || element.dataset.reveal === "entering") return;
      element.dataset.reveal = motion.matches ? "visible" : "entering";
      observer?.unobserve(element);
    };

    const setup = () => {
      observer?.disconnect();
      if (motion.matches || !("IntersectionObserver" in window)) {
        elements.forEach((element) => element.removeAttribute("data-reveal"));
        return;
      }
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) reveal(entry.target as HTMLElement);
        });
      }, { threshold: 0, rootMargin: "0px 0px -24px 0px" });

      elements.forEach((element) => {
        // Preserve content already read, including back/forward cache restores.
        if (element.dataset.reveal === "visible" || element.dataset.reveal === "entering") return;
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight - 24) {
          reveal(element);
        } else {
          element.dataset.reveal = "pending";
          observer?.observe(element);
        }
      });
    };

    const onFocus = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      const element = event.target.closest<HTMLElement>(".scroll-reveal");
      if (element) {
        element.dataset.reveal = "visible";
        observer?.unobserve(element);
      }
    };

    const onAnimationEnd = (event: AnimationEvent) => {
      if (event.animationName !== "scroll-reveal" || !(event.target instanceof HTMLElement)) return;
      if (event.target.matches(".scroll-reveal")) event.target.dataset.reveal = "visible";
    };

    const onShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      setup();
      if (!motion.matches) {
        document.querySelectorAll<HTMLElement>(".rise").forEach((element) => {
          element.getAnimations().forEach((animation) => {
            animation.currentTime = 0;
            animation.play();
          });
        });
      }
    };

    setup();
    motion.addEventListener("change", setup);
    document.addEventListener("focusin", onFocus);
    document.addEventListener("animationend", onAnimationEnd);
    window.addEventListener("pageshow", onShow);
    return () => {
      observer?.disconnect();
      elements.forEach((element) => element.removeAttribute("data-reveal"));
      motion.removeEventListener("change", setup);
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("animationend", onAnimationEnd);
      window.removeEventListener("pageshow", onShow);
    };
  }, [pathname]);

  return null;
}
