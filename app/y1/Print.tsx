"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

/**
 * The portrait print — and its lightbox. Opening is a shared-element
 * morph: the full photo grows out of the print's exact position and
 * settles into the center; closing returns it the same way. The full
 * image is the untouched film scan (unoptimized — grain intact).
 */

const MORPH_MS = 560;
const MORPH_EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

export default function Print() {
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const closingRef = useRef(false);

  const reducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* From the card's centered resting place, the transform that lands it
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
    const card = cardRef.current;
    const backdrop = backdropRef.current;
    const caption = captionRef.current;
    const trigger = triggerRef.current;
    const finish = () => {
      closingRef.current = false;
      if (trigger) trigger.style.opacity = "";
      setMounted(false);
      trigger?.focus();
    };
    if (!card || !backdrop || reducedMotion()) {
      finish();
      return;
    }
    const target = transformToPrint();
    if (caption) {
      caption.style.transition = "opacity 120ms ease";
      caption.style.opacity = "0";
    }
    card.style.transition = `transform ${MORPH_MS}ms ${MORPH_EASE}, opacity ${MORPH_MS}ms ease`;
    backdrop.style.transition = `opacity ${MORPH_MS - 120}ms ease`;
    if (target) card.style.transform = target;
    card.style.opacity = "0.25";
    backdrop.style.opacity = "0";
    window.setTimeout(finish, MORPH_MS + 40);
  };

  /* Entrance morph — runs once the dialog is in the DOM. */
  useLayoutEffect(() => {
    if (!mounted) return;
    const card = cardRef.current;
    const backdrop = backdropRef.current;
    const caption = captionRef.current;
    const trigger = triggerRef.current;
    if (!card || !backdrop) return;

    if (reducedMotion()) {
      backdrop.style.opacity = "1";
      card.style.opacity = "1";
      if (caption) caption.style.opacity = "1";
      return;
    }

    const start = transformToPrint();
    card.style.transition = "none";
    if (start) card.style.transform = start;
    card.style.opacity = "0.25";
    backdrop.style.transition = "none";
    backdrop.style.opacity = "0";
    if (caption) {
      caption.style.transition = "none";
      caption.style.opacity = "0";
    }
    if (trigger) trigger.style.opacity = "0"; // the print "becomes" the photo

    void card.offsetWidth; // commit start state before animating

    card.style.transition = `transform ${MORPH_MS}ms ${MORPH_EASE}, opacity 300ms ease`;
    backdrop.style.transition = "opacity 380ms ease";
    card.style.transform = "translate(0, 0) scale(1)";
    card.style.opacity = "1";
    backdrop.style.opacity = "1";
    if (caption) {
      caption.style.transition = `opacity 320ms ease ${MORPH_MS - 180}ms`;
      caption.style.opacity = "1";
    }
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
        aria-label="See the full photo"
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
          ref={backdropRef}
          role="dialog"
          aria-modal="true"
          aria-label="The full photo — Williamsburg, New York"
          className={`${styles.lightbox} fixed inset-0 z-[60] flex items-center justify-center p-5 sm:p-10`}
          onClick={close}
        >
          <div
            ref={cardRef}
            className="w-full max-w-[860px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex justify-end">
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Close photo"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#3F3F3F] text-[16px] leading-none text-[#A3A3A3] transition-colors duration-150 hover:border-[#6E6E6E] hover:text-[#F5F5F5] motion-reduce:transition-none"
              >
                ×
              </button>
            </div>
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
              className="mt-4 text-[14px] leading-relaxed text-[#A3A3A3]"
            >
              Williamsburg, NYC @{" "}
              <a
                href="https://whop.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.captionLink}
              >
                whop.com
              </a>
              &rsquo;s office with{" "}
              <a
                href="https://x.com/galileowilson"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.captionLink}
              >
                @galileowilson
              </a>{" "}
              and{" "}
              <a
                href="https://instagram.com/arielbrowerr"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.captionLink}
              >
                @arielbrowerr
              </a>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
