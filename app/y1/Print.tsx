"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

/**
 * The portrait print — and the photo gallery behind it. Clicking the
 * print morphs the Williamsburg photo out of it into a full-screen
 * scrollable gallery of film photos, each with its caption. Closing
 * morphs back into the print (or simply fades if you've scrolled).
 * Every image is served unoptimized — original scans, grain intact.
 */

const MORPH_MS = 560;
const MORPH_EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

function Cap({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.captionLink}
    >
      {children}
    </a>
  );
}

type Photo = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: ReactNode;
};

const GALLERY: Photo[] = [
  {
    src: "/photos/gallery/paris-eiffel.jpg",
    width: 1818,
    height: 1228,
    alt: "Three friends in front of the Eiffel Tower",
    caption: (
      <>
        Paris, France with{" "}
        <Cap href="https://x.com/yanalgrowth">@yanalgrowth</Cap> and{" "}
        <Cap href="https://x.com/danvsI">@danvsI</Cap>
      </>
    ),
  },
  {
    src: "/photos/gallery/soho-asspizza.jpg",
    width: 945,
    height: 1227,
    alt: "Owen and Austin Babbitt in front of a graffiti-covered wall",
    caption: (
      <>
        SoHo, NYC with Austin Babbitt —{" "}
        <Cap href="https://x.com/asspizza">@asspizza</Cap>
      </>
    ),
  },
  {
    src: "/photos/gallery/chinatown.jpg",
    width: 1818,
    height: 1228,
    alt: "A graffiti-covered van parked on a Chinatown street",
    caption: <>Chinatown, NYC</>,
  },
  {
    src: "/photos/gallery/paris-team-dinner.jpg",
    width: 1818,
    height: 1228,
    alt: "The Content Rewards team at dinner in Paris",
    caption: (
      <>
        <Cap href="https://x.com/contentrewards">@contentrewards</Cap> team
        dinner — Paris, France
      </>
    ),
  },
  {
    src: "/photos/gallery/team-danvsl.jpg",
    width: 1818,
    height: 1228,
    alt: "Dan and the Content Rewards team in a hotel room",
    caption: (
      <>
        <Cap href="https://x.com/danvsI">@danvsI</Cap> and the{" "}
        <Cap href="https://x.com/contentrewards">@contentrewards</Cap> team
      </>
    ),
  },
];

export default function Print() {
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false); // gallery items rise in after the morph
  const triggerRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const closingRef = useRef(false);

  const reducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* From the hero card's resting place, the transform that lands it
     exactly over the print. */
  const transformToPrint = () => {
    const trigger = triggerRef.current;
    const card = cardRef.current;
    if (!trigger || !card) return null;
    const from = trigger.getBoundingClientRect();
    const to = card.getBoundingClientRect();
    const scale = from.width / to.width;
    const dx = from.left + from.width / 2 - (to.left + to.width / 2);
    const dy = from.top + from.height / 2 - (to.top + to.height / 2);
    return `translate(${dx}px, ${dy}px) scale(${scale})`;
  };

  const open = () => {
    closingRef.current = false;
    setMounted(true);
  };

  const close = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    const overlay = overlayRef.current;
    const card = cardRef.current;
    const caption = captionRef.current;
    const trigger = triggerRef.current;
    const finish = () => {
      closingRef.current = false;
      if (trigger) trigger.style.opacity = "";
      setMounted(false);
      setReady(false);
      trigger?.focus();
    };
    if (!overlay || !card || reducedMotion()) {
      finish();
      return;
    }
    const scrolled = overlay.scrollTop > 40;
    if (scrolled) {
      // The print is long gone off-screen — a clean fade reads better
      overlay.style.transition = "opacity 260ms ease";
      overlay.style.opacity = "0";
      window.setTimeout(finish, 280);
      return;
    }
    const target = transformToPrint();
    if (caption) {
      caption.style.transition = "opacity 120ms ease";
      caption.style.opacity = "0";
    }
    setReady(false); // gallery items sink away while the hero returns
    card.style.transition = `transform ${MORPH_MS}ms ${MORPH_EASE}, opacity ${MORPH_MS}ms ease`;
    overlay.style.transition = `opacity ${MORPH_MS - 120}ms ease 80ms`;
    if (target) card.style.transform = target;
    card.style.opacity = "0.25";
    overlay.style.opacity = "0";
    window.setTimeout(finish, MORPH_MS + 40);
  };

  /* Entrance morph — runs once the overlay is in the DOM. */
  useLayoutEffect(() => {
    if (!mounted) return;
    const overlay = overlayRef.current;
    const card = cardRef.current;
    const caption = captionRef.current;
    const trigger = triggerRef.current;
    if (!overlay || !card) return;

    if (reducedMotion()) {
      overlay.style.opacity = "1";
      card.style.opacity = "1";
      if (caption) caption.style.opacity = "1";
      const t = window.setTimeout(() => setReady(true), 0);
      return () => window.clearTimeout(t);
    }

    const start = transformToPrint();
    card.style.transition = "none";
    if (start) card.style.transform = start;
    card.style.opacity = "0.25";
    overlay.style.transition = "none";
    overlay.style.opacity = "0";
    if (caption) {
      caption.style.transition = "none";
      caption.style.opacity = "0";
    }
    if (trigger) trigger.style.opacity = "0"; // the print "becomes" the photo

    void card.offsetWidth; // commit start state before animating

    card.style.transition = `transform ${MORPH_MS}ms ${MORPH_EASE}, opacity 300ms ease`;
    overlay.style.transition = "opacity 380ms ease";
    card.style.transform = "translate(0, 0) scale(1)";
    card.style.opacity = "1";
    overlay.style.opacity = "1";
    if (caption) {
      caption.style.transition = `opacity 320ms ease ${MORPH_MS - 180}ms`;
      caption.style.opacity = "1";
    }
    const t = window.setTimeout(() => setReady(true), MORPH_MS - 140);
    return () => window.clearTimeout(t);
  }, [mounted]);

  /* Escape, scroll lock, focus while open. */
  useEffect(() => {
    if (!mounted) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={open}
        aria-label="See the photo gallery"
        aria-haspopup="dialog"
        className={`${styles.print} block cursor-pointer`}
      >
        <Image
          src="/photos/owen-nyc.jpg"
          alt="Owen in front of the Williamsburg Bridge"
          fill
          sizes="128px"
          quality={90}
          priority
          className={`${styles.printImg} object-cover`}
        />
      </button>

      {mounted && (
        <div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="Photo gallery"
          data-ready={ready || undefined}
          className={`${styles.lightbox} fixed inset-0 z-[60] overflow-y-auto overscroll-contain`}
          onClick={close}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Close gallery"
            className="fixed top-4 right-4 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#3F3F3F] bg-[#161616]/85 text-[17px] leading-none text-[#A3A3A3] backdrop-blur-sm transition-colors duration-150 hover:border-[#6E6E6E] hover:text-[#F5F5F5] motion-reduce:transition-none"
          >
            ×
          </button>

          <div
            className="mx-auto w-full max-w-[860px] px-5 py-14 sm:py-16"
            onClick={(e) => e.stopPropagation()}
          >
            {/* The hero — morphs out of the print */}
            <div ref={cardRef}>
              <Image
                src="/photos/owen-nyc-full.jpg"
                alt="Owen, Galileo, and Ariel on a rooftop in front of the Williamsburg Bridge at dusk"
                width={1818}
                height={1228}
                unoptimized
                className="h-auto w-full rounded-lg"
              />
              <p
                ref={captionRef}
                className="mt-3 text-[14px] leading-relaxed text-[#A3A3A3]"
              >
                Williamsburg, NYC @{" "}
                <Cap href="https://whop.com">whop.com</Cap>&rsquo;s office with{" "}
                <Cap href="https://x.com/galileowilson">@galileowilson</Cap> and{" "}
                <Cap href="https://instagram.com/arielbrowerr">
                  @arielbrowerr
                </Cap>
              </p>
            </div>

            {/* The rest of the roll — rises in after the morph lands */}
            <ul className="mt-14 space-y-14">
              {GALLERY.map((photo, i) => (
                <li
                  key={photo.src}
                  className={styles.galleryItem}
                  style={{ transitionDelay: ready ? `${i * 90}ms` : "0ms" }}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    unoptimized
                    className={`h-auto rounded-lg ${
                      photo.height > photo.width
                        ? "mx-auto w-full max-w-[560px]"
                        : "w-full"
                    }`}
                  />
                  <p className="mt-3 text-[14px] leading-relaxed text-[#A3A3A3]">
                    {photo.caption}
                  </p>
                </li>
              ))}
            </ul>

            <p className="mt-14 pb-4 text-center text-[12px] text-[#5A5A5A]">
              all shot on film
            </p>
          </div>
        </div>
      )}
    </>
  );
}
