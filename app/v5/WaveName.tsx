"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

const LIFT_MS = 300;
const STAGGER_MS = 70;

/**
 * The word lifts letter by letter on hover, once per hover enter.
 * Pointer-fine devices only; respects prefers-reduced-motion.
 */
export default function WaveName({ text }: { text: string }) {
  const [waving, setWaving] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  const startWave = () => {
    if (waving) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setWaving(true);
    const total = LIFT_MS + STAGGER_MS * Math.max(text.length - 1, 0);
    timer.current = window.setTimeout(() => setWaving(false), total + 60);
  };

  const letters = Array.from(text);

  return (
    <span className={styles.waveWrap} onMouseEnter={startWave}>
      <span aria-hidden="true">
        {letters.map((letter, i) => (
          <span
            key={`${letter}-${i}`}
            className={waving ? styles.waveLetterOn : styles.waveLetter}
            style={waving ? { animationDelay: `${i * STAGGER_MS}ms` } : undefined}
          >
            {letter === " " ? " " : letter}
          </span>
        ))}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
