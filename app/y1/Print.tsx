"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

/**
 * The portrait print — resting at a slight tilt above the headline;
 * hover picks it up. Clicking opens the full film photo in a lightbox
 * with the story of where it was taken. The lightbox image is served
 * unoptimized: it's the original scan, grain and all.
 */
export default function Print() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
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

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="The full photo — Williamsburg, New York"
          className={`${styles.lightbox} fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8`}
          onClick={() => setOpen(false)}
        >
          <figure
            className={`${styles.lightboxCard} w-full max-w-[880px]`}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src="/photos/owen-nyc-full.jpg"
              alt="Owen, Galileo, and Ariel on a rooftop in front of the Williamsburg Bridge at dusk"
              width={1818}
              height={1228}
              unoptimized
              className="h-auto w-full rounded-lg border border-[#2A2A2A]"
            />
            <figcaption className="mt-4 text-[14px] leading-relaxed text-[#A3A3A3]">
              Williamsburg, NYC — on the roof at{" "}
              <a
                href="https://whop.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.captionLink}
              >
                whop.com
              </a>
              &rsquo;s office. Next to me:{" "}
              <a
                href="https://x.com/galileowilson"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.captionLink}
              >
                @galileowilson
              </a>{" "}
              in the middle, and{" "}
              <a
                href="https://instagram.com/arielbrowerr"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.captionLink}
              >
                @arielbrowerr
              </a>{" "}
              on the far right. Shot on film.
            </figcaption>
          </figure>
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close photo"
            className="absolute top-4 right-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#3F3F3F] bg-[#161616]/80 text-[18px] leading-none text-[#A3A3A3] transition-colors duration-150 hover:text-[#F5F5F5] motion-reduce:transition-none"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
