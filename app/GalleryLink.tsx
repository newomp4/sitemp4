"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import useReducedMotionPreference from "./useReducedMotionPreference";
import styles from "./styles.module.css";

/* Critically damped: the prints glide out and stop, no wobble on arrival. */
const spring = { type: "spring" as const, stiffness: 190, damping: 26, mass: 0.9 };

/* Where each print lands, dealt left to right. A narrow spread and small
   angles — it should read as a peek at the gallery, not a card trick. */
const previews = [
  { src: "/photos/gallery/paris-eiffel.jpg", x: 20, y: 7, rotate: -7 },
  { src: "/photos/gallery/chinatown.jpg", x: 54, y: 0, rotate: -2.5 },
  { src: "/photos/owen-nyc.jpg", x: 88, y: 0, rotate: 2.5 },
  { src: "/photos/gallery/film-16b.jpg", x: 122, y: 7, rotate: 7 },
];

/* Closed, they sit in one square stack at the middle of that spread, so
   opening fans them apart from a single point instead of sliding in. */
const stack = { x: 71, y: 18, scale: 0.92 };

/** A tiny contact sheet unfolds above the link without moving the page. */
export default function GalleryLink() {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotionPreference();

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", dismiss);
    return () => document.removeEventListener("keydown", dismiss);
  }, [open]);

  return (
    <Link
      href="/photos"
      className={styles.footerLink}
      data-open={open}
      onPointerEnter={(event) => { if (event.pointerType === "mouse") setOpen(true); }}
      onPointerLeave={() => setOpen(false)}
      onFocus={(event) => { if (event.currentTarget.matches(":focus-visible")) setOpen(true); }}
      onBlur={() => setOpen(false)}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="18" height="18" aria-hidden="true">
        <path d="M14.5 7C13.1193 7 12 8.11929 12 9.5C12 10.8807 13.1193 12 14.5 12C15.8807 12 17 10.8807 17 9.5C17 8.11929 15.8807 7 14.5 7Z" fill="currentColor" />
        <path fillRule="evenodd" clipRule="evenodd" d="M3 5.75C3 4.23122 4.23122 3 5.75 3H18.25C19.7688 3 21 4.23122 21 5.75V18.25C21 19.7688 19.7688 21 18.25 21H5.75C4.23122 21 3 19.7688 3 18.25V5.75ZM4.5 14.4393L6.05546 12.8839C7.1294 11.8099 8.8706 11.8099 9.94454 12.8839L16.5607 19.5H18.25C18.9404 19.5 19.5 18.9404 19.5 18.25V5.75C19.5 5.05964 18.9404 4.5 18.25 4.5H5.75C5.05964 4.5 4.5 5.05964 4.5 5.75V14.4393Z" fill="currentColor" />
      </svg>
      <span>Gallery</span>
      <span className={styles.galleryPreview} aria-hidden="true">
        <span className={styles.galleryFan}>
          {previews.map((photo, index) => {
            /* Dealt outward on the way open, gathered from the outside in
               on the way back. The fade carries the same delay as the
               travel, so each print appears while it is already moving. */
            const delay = open ? index * 0.045 : (previews.length - 1 - index) * 0.02;
            return (
              <motion.span
                key={photo.src}
                className={styles.galleryPrint}
                initial={false}
                animate={{
                  opacity: open ? 1 : 0,
                  x: reduced || open ? photo.x : stack.x,
                  y: reduced || open ? photo.y : stack.y,
                  rotate: reduced ? 0 : open ? photo.rotate : 0,
                  scale: reduced || open ? 1 : stack.scale,
                }}
                transition={reduced ? { duration: 0 } : {
                  ...spring,
                  delay,
                  opacity: { duration: open ? 0.22 : 0.14, delay },
                }}
              >
                <Image src={photo.src} alt="" fill sizes="78px" loading="eager" className="object-cover" />
              </motion.span>
            );
          })}
        </span>
      </span>
    </Link>
  );
}
