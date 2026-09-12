"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useSpring } from "motion/react";
import { useEffect, useState, type PointerEvent } from "react";
import useReducedMotionPreference from "./useReducedMotionPreference";
import styles from "./styles.module.css";

const spring = { type: "spring" as const, stiffness: 280, damping: 24, mass: 0.7 };
const previews = [
  { src: "/photos/gallery/paris-eiffel.jpg", x: 8, y: 8, rotate: -12 },
  { src: "/photos/gallery/chinatown.jpg", x: 55, y: 0, rotate: -4 },
  { src: "/photos/owen-nyc.jpg", x: 102, y: 0, rotate: 4 },
  { src: "/photos/gallery/film-16b.jpg", x: 149, y: 8, rotate: 12 },
];

/** A tiny contact sheet unfolds above the link without moving the page. */
export default function GalleryLink() {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotionPreference();
  const drift = useSpring(0, spring);

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", dismiss);
    return () => document.removeEventListener("keydown", dismiss);
  }, [open]);

  function move(event: PointerEvent<HTMLAnchorElement>) {
    if (reduced || event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    const position = Math.max(-0.5, Math.min(0.5, (event.clientX - box.left) / box.width - 0.5));
    drift.set(position * 10);
  }

  return (
    <Link
      href="/photos"
      className={styles.footerLink}
      data-open={open}
      onPointerEnter={(event) => { if (event.pointerType === "mouse") setOpen(true); }}
      onPointerMove={move}
      onPointerLeave={() => { setOpen(false); drift.set(0); }}
      onFocus={(event) => { if (event.currentTarget.matches(":focus-visible")) setOpen(true); }}
      onBlur={() => { setOpen(false); drift.set(0); }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="18" height="18" aria-hidden="true">
        <path d="M14.5 7C13.1193 7 12 8.11929 12 9.5C12 10.8807 13.1193 12 14.5 12C15.8807 12 17 10.8807 17 9.5C17 8.11929 15.8807 7 14.5 7Z" fill="currentColor" />
        <path fillRule="evenodd" clipRule="evenodd" d="M3 5.75C3 4.23122 4.23122 3 5.75 3H18.25C19.7688 3 21 4.23122 21 5.75V18.25C21 19.7688 19.7688 21 18.25 21H5.75C4.23122 21 3 19.7688 3 18.25V5.75ZM4.5 14.4393L6.05546 12.8839C7.1294 11.8099 8.8706 11.8099 9.94454 12.8839L16.5607 19.5H18.25C18.9404 19.5 19.5 18.9404 19.5 18.25V5.75C19.5 5.05964 18.9404 4.5 18.25 4.5H5.75C5.05964 4.5 4.5 5.05964 4.5 5.75V14.4393Z" fill="currentColor" />
      </svg>
      <span>Gallery</span>
      <span className={styles.galleryPreview} aria-hidden="true">
        <motion.span className={styles.galleryFan} style={{ x: reduced ? 0 : drift }}>
          {previews.map((photo, index) => (
            <motion.span
              key={photo.src}
              className={styles.galleryPrint}
              initial={false}
              animate={{
                opacity: open ? 1 : 0,
                x: reduced || open ? photo.x : 28,
                y: reduced || open ? photo.y : 24,
                rotate: reduced ? 0 : open ? photo.rotate : 0,
                scale: reduced || open ? 1 : 0.85,
              }}
              transition={reduced ? { duration: 0 } : {
                ...spring,
                delay: open ? index * 0.035 : 0,
                opacity: { duration: open ? 0.18 : 0.12 },
              }}
            >
              <Image src={photo.src} alt="" fill sizes="78px" loading="eager" className="object-cover" />
            </motion.span>
          ))}
        </motion.span>
      </span>
    </Link>
  );
}
