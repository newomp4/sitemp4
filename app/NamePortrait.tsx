"use client";

import Image from "next/image";
import { motion, useSpring } from "motion/react";
import { useEffect, useId, useRef, useState, type PointerEvent, type ReactNode } from "react";
import useReducedMotionPreference from "./useReducedMotionPreference";
import styles from "./styles.module.css";

const spring = { type: "spring" as const, stiffness: 300, damping: 23, mass: 0.7 };

/** The name stays still while its portrait follows the pointer on a soft spring. */
export default function NamePortrait({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const anchor = useRef<HTMLSpanElement>(null);
  const id = useId();
  const reduced = useReducedMotionPreference();
  const pointerType = useRef("mouse");
  const x = useSpring(0, spring);
  const rotateX = useSpring(0, spring);
  const rotateY = useSpring(0, spring);

  useEffect(() => {
    if (!open) return;

    const dismissOutside = (event: globalThis.PointerEvent) => {
      if (event.target instanceof Node && !anchor.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    const dismissEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", dismissOutside);
    document.addEventListener("keydown", dismissEscape);
    return () => {
      document.removeEventListener("pointerdown", dismissOutside);
      document.removeEventListener("keydown", dismissEscape);
    };
  }, [open]);

  function resetTilt() {
    x.set(0);
    rotateX.set(0);
    rotateY.set(0);
  }

  function move(event: PointerEvent<HTMLSpanElement>) {
    if (reduced || event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    const horizontal = Math.max(-0.5, Math.min(0.5, (event.clientX - box.left) / box.width - 0.5));
    const vertical = Math.max(-0.5, Math.min(0.5, (event.clientY - box.top) / box.height - 0.5));
    x.set(horizontal * 12);
    rotateX.set(-vertical * 8);
    rotateY.set(horizontal * 12);
  }

  return (
    <span
      ref={anchor}
      className={styles.portraitAnchor}
      data-open={open}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setOpen(true);
      }}
      onPointerMove={move}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") setOpen(false);
        resetTilt();
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setOpen(false);
          resetTilt();
        }
      }}
    >
      <button
        type="button"
        className={styles.portraitName}
        aria-expanded={open}
        aria-controls={id}
        onFocus={(event) => {
          if (event.currentTarget.matches(":focus-visible")) setOpen(true);
        }}
        onPointerDown={(event) => { pointerType.current = event.pointerType; }}
        onClick={(event) => {
          if (event.detail === 0 || pointerType.current !== "mouse") setOpen((value) => !value);
          else setOpen(true);
        }}
      >
        {children}
      </button>
      <span id={id} className={styles.portraitPopup} aria-hidden={!open}>
        <motion.span
          className={styles.portraitCard}
          initial={false}
          animate={{
            opacity: open ? 1 : 0,
            scale: reduced || open ? 1 : 0.86,
            y: reduced || open ? 0 : -10,
            rotate: reduced ? 0 : open ? -2 : -8,
          }}
          transition={reduced ? { duration: 0 } : {
            ...spring,
            opacity: { duration: open ? 0.16 : 0.12 },
          }}
          style={{
            x: reduced ? 0 : x,
            rotateX: reduced ? 0 : rotateX,
            rotateY: reduced ? 0 : rotateY,
          }}
        >
          <Image
            src="/photos/owen-nyc.jpg"
            alt="Owen in front of the Williamsburg Bridge"
            fill
            sizes="136px"
            quality={90}
            loading="eager"
            className="object-cover"
          />
        </motion.span>
      </span>
    </span>
  );
}
