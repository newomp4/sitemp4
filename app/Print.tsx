"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type PointerEvent } from "react";
import { motion, useSpring } from "motion/react";
import useReducedMotionPreference from "./useReducedMotionPreference";
import styles from "./styles.module.css";

const spring = { type: "spring" as const, stiffness: 230, damping: 26, mass: 0.8 };

/** The link stays still; the prints move inside it so the pointer never chases them. */
export default function Print() {
  const reduced = useReducedMotionPreference();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pressed, setPressed] = useState(false);
  const rotateX = useSpring(0, spring);
  const rotateY = useSpring(0, spring);
  const active = !reduced && (hovered || focused);

  function move(event: PointerEvent<HTMLAnchorElement>) {
    if (reduced || event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = Math.max(-0.5, Math.min(0.5, (event.clientX - box.left) / box.width - 0.5));
    const y = Math.max(-0.5, Math.min(0.5, (event.clientY - box.top) / box.height - 0.5));
    rotateX.set(-y * 7);
    rotateY.set(x * 7);
  }

  return (
    <Link
      href="/photos"
      aria-label="Open the photo book"
      className={styles.printStack}
      onPointerEnter={(event) => { if (event.pointerType === "mouse") setHovered(true); }}
      onPointerMove={move}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      onPointerLeave={() => { setHovered(false); setPressed(false); rotateX.set(0); rotateY.set(0); }}
      onFocus={() => setFocused(true)}
      onBlur={() => { setFocused(false); setPressed(false); }}
    >
      <motion.span
        className={styles.printLayers}
        style={{ rotateX: reduced ? 0 : rotateX, rotateY: reduced ? 0 : rotateY }}
      >
        <motion.span
          aria-hidden="true"
          className={`${styles.stackPrint} ${styles.stackBack}`}
          initial={false}
          animate={{ x: active ? 48 : 12, y: active ? 0 : 3, rotate: active ? 15 : 7 }}
          transition={reduced ? { duration: 0 } : spring}
        >
          <Image src="/photos/gallery/paris-eiffel.jpg" alt="" fill sizes="128px" className="object-cover" />
        </motion.span>
        <motion.span
          aria-hidden="true"
          className={`${styles.stackPrint} ${styles.stackMiddle}`}
          initial={false}
          animate={{ x: active ? 24 : 6, y: active ? -3 : 1, rotate: active ? 6 : 2 }}
          transition={reduced ? { duration: 0 } : spring}
        >
          <Image src="/photos/gallery/chinatown.jpg" alt="" fill sizes="128px" className="object-cover" />
        </motion.span>
        <motion.span
          className={`${styles.stackPrint} ${styles.stackFront}`}
          initial={false}
          animate={{ x: active ? -5 : 0, y: active ? -7 : 0, rotate: active ? -5 : -2, scale: !reduced && pressed ? 0.98 : 1 }}
          transition={reduced ? { duration: 0 } : spring}
        >
          <Image
            src="/photos/owen-nyc.jpg"
            alt="Owen in front of the Williamsburg Bridge"
            fill
            sizes="128px"
            quality={90}
            preload
            className="object-cover"
          />
        </motion.span>
      </motion.span>
      <span className={styles.printHint} aria-hidden="true">View photos <span>↗</span></span>
    </Link>
  );
}
