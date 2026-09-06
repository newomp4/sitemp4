"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import useReducedMotionPreference from "../useReducedMotionPreference";
import styles from "./photos.module.css";

export type Photo = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: ReactNode;
  blur: string;
};

const ease = [0.22, 1, 0.36, 1] as const;

export default function PhotoGallery({ photos }: { photos: Photo[] }) {
  const reduced = useReducedMotionPreference();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const caption = useRef<HTMLParagraphElement>(null);
  const previousButton = useRef<HTMLButtonElement>(null);
  const nextButton = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState(0);
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const [{ index, direction }, setPosition] = useState({ index: 0, direction: 0 });
  const photo = photos[index];
  const displayedPhoto = photos[displayedIndex];
  const latestIndex = useRef(index);
  useLayoutEffect(() => { latestIndex.current = index; }, [index]);

  function showPhoto(next: number, button: HTMLButtonElement) {
    trigger.current = button;
    setPosition({ index: next, direction: 0 });
    setDisplayedIndex(next);
    setSession((value) => value + 1);
    setOpen(true);
    dialog.current?.showModal();
  }

  function finishClose() {
    if (open || !dialog.current?.open) return;
    dialog.current.close();
    trigger.current?.focus({ preventScroll: true });
  }

  function preserveCaptionFocus(amount: number) {
    // The caption is replaced during a turn; move its focused link to a stable control.
    if (caption.current?.contains(document.activeElement)) {
      (amount > 0 ? nextButton : previousButton).current?.focus({ preventScroll: true });
    }
  }

  function turn(amount: number) {
    preserveCaptionFocus(amount);
    setPosition((current) => {
      const next = Math.max(0, Math.min(photos.length - 1, current.index + amount));
      return next === current.index ? current : { index: next, direction: amount };
    });
  }

  return (
    <>
      <ul className={styles.photoRoll}>
        {photos.map((item, i) => (
          <li key={item.src} className="scroll-reveal">
            <figure className={styles.photoFigure}>
              <button
                type="button"
                className={`${styles.photoButton} ${item.height > item.width ? styles.portrait : ""}`}
                onClick={(event) => showPhoto(i, event.currentTarget)}
                aria-label={`Open photo ${i + 1}: ${item.alt}`}
                aria-haspopup="dialog"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  unoptimized
                  preload={i === 0}
                  loading={i === 0 ? "eager" : "lazy"}
                  placeholder="blur"
                  blurDataURL={item.blur}
                  className={styles.scan}
                />
                <span className={styles.expandHint} aria-hidden="true">↗</span>
              </button>
              <figcaption className={styles.caption}>
                <span className={styles.photoNumber}>{String(i + 1).padStart(2, "0")}</span>
                <span>{item.caption}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        className={styles.viewer}
        aria-label="Photo book"
        aria-describedby="photo-book-instructions"
        onCancel={(event) => { event.preventDefault(); setOpen(false); }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") { event.preventDefault(); turn(1); }
          if (event.key === "ArrowLeft") { event.preventDefault(); turn(-1); }
        }}
      >
        <motion.div
          className={styles.viewerShell}
          initial={false}
          animate={{ opacity: open ? 1 : 0 }}
          transition={{ duration: reduced ? 0 : 0.22 }}
          onAnimationComplete={finishClose}
        >
          <div className={styles.viewerBar}>
            <span className={styles.counter} aria-live="polite" aria-atomic="true">
              <motion.span key={`${session}-${displayedPhoto.src}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : 0.2 }}>
                {String(displayedIndex + 1).padStart(2, "0")} <span className={styles.counterTotal}>/ {String(photos.length).padStart(2, "0")}</span>
              </motion.span>
            </span>
            <button type="button" className={styles.closeButton} onClick={() => setOpen(false)}>
              Close <span aria-hidden="true">×</span>
            </button>
          </div>
          <p id="photo-book-instructions" className="sr-only">Use the left and right arrow keys to browse. Press Escape to close.</p>
          <div className={styles.viewerStage} onClick={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
            <AnimatePresence key={session} initial={false} mode="wait" custom={direction} onExitComplete={() => {
              preserveCaptionFocus(latestIndex.current - displayedIndex);
              setDisplayedIndex(latestIndex.current);
            }}>
              <motion.div
                key={photo.src}
                className={styles.viewerPrint}
                custom={direction}
                variants={{
                  enter: (step: number) => ({ opacity: 0, x: reduced ? 0 : step * 32, rotate: reduced ? 0 : step * 0.8, scale: reduced ? 1 : 0.985 }),
                  present: { opacity: 1, x: 0, rotate: 0, scale: 1 },
                  exit: (step: number) => ({ opacity: 0, x: reduced ? 0 : step * -24, rotate: reduced ? 0 : step * -0.5, scale: reduced ? 1 : 0.99 }),
                }}
                initial="enter"
                animate="present"
                exit="exit"
                transition={{ duration: reduced ? 0 : 0.28, ease }}
                drag={reduced ? false : "x"}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.18}
                dragSnapToOrigin
                dragMomentum={false}
                onPointerDown={(event) => {
                  if (!reduced) return;
                  swipeStart.current = { x: event.clientX, y: event.clientY };
                  event.currentTarget.setPointerCapture(event.pointerId);
                }}
                onPointerUp={(event) => {
                  if (!reduced || !swipeStart.current) return;
                  const dx = event.clientX - swipeStart.current.x;
                  const dy = event.clientY - swipeStart.current.y;
                  swipeStart.current = null;
                  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) turn(dx < 0 ? 1 : -1);
                }}
                onPointerCancel={() => { swipeStart.current = null; }}
                onDragEnd={(_, info) => {
                  if (Math.abs(info.offset.x) > 45) turn(info.offset.x < 0 ? 1 : -1);
                }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  unoptimized
                  loading="eager"
                  placeholder="blur"
                  blurDataURL={photo.blur}
                  draggable={false}
                  className={styles.viewerScan}
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className={styles.viewerFooter}>
            <motion.p
              key={`${session}-${displayedPhoto.src}`}
              ref={caption}
              className={styles.viewerCaption}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: reduced ? 0 : 0.28, ease }}
            >{displayedPhoto.caption}</motion.p>
            <nav className={styles.turnControls} aria-label="Browse photos">
              <button type="button" ref={previousButton} aria-label="Previous photo" aria-disabled={index === 0} onClick={() => turn(-1)}>←</button>
              <button type="button" ref={nextButton} aria-label="Next photo" aria-disabled={index === photos.length - 1} onClick={() => turn(1)}>→</button>
            </nav>
          </div>
        </motion.div>
      </dialog>
    </>
  );
}
