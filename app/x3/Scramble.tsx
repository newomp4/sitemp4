"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

const GLYPHS = "#/\\·:+×";
const DURATION = 350; // full left→right resolve
const FAST = 110; // remaining resolve after the pointer leaves mid-run

type Props = {
  text: string;
  href: string;
  external?: boolean;
  description?: string;
};

/**
 * Link whose title decodes on hover/focus: every unresolved character
 * cycles through a small glyph set each frame and resolves to the real
 * character left→right. String length is preserved 1:1 (spaces stay
 * spaces) and the title is mono, so layout never shifts.
 */
export default function Scramble({ text, href, external, description }: Props) {
  const [display, setDisplay] = useState(text);
  const raf = useRef<number | null>(null);
  const last = useRef(0);
  const progress = useRef(0);
  const fast = useRef(false);
  const active = useRef(false);
  const enabled = useRef(false); // fine pointer + motion OK

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => {
      enabled.current = !motion.matches && pointer.matches;
    };
    update();
    motion.addEventListener("change", update);
    pointer.addEventListener("change", update);
    return () => {
      motion.removeEventListener("change", update);
      pointer.removeEventListener("change", update);
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    };
  }, []);

  function frame(now: number) {
    const dt = Math.min(now - last.current, 64);
    last.current = now;
    progress.current += dt / (fast.current ? FAST : DURATION);
    if (progress.current >= 1) {
      setDisplay(text);
      active.current = false;
      raf.current = null;
      return;
    }
    const resolved = Math.floor(progress.current * text.length);
    let out = "";
    for (let i = 0; i < text.length; i += 1) {
      const ch = text[i];
      if (i < resolved || ch === " ") {
        out += ch;
      } else {
        out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
    }
    setDisplay(out);
    raf.current = requestAnimationFrame(frame);
  }

  // Once per hover-in; re-entering a fast finish resumes normal pace.
  function start() {
    if (!enabled.current) return;
    if (active.current) {
      fast.current = false;
      return;
    }
    active.current = true;
    fast.current = false;
    progress.current = 0;
    last.current = performance.now();
    raf.current = requestAnimationFrame(frame);
  }

  function settle() {
    if (active.current) fast.current = true;
  }

  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      aria-label={text}
      onMouseEnter={start}
      onMouseLeave={settle}
      onFocus={start}
      onBlur={settle}
      className={styles.row}
    >
      <span aria-hidden="true" className={`${styles.title} font-mono`}>
        {display}
      </span>
      {external && (
        <span
          aria-hidden="true"
          className="ml-1.5 font-mono text-[12px] text-[#525252]"
        >
          ↗
        </span>
      )}
      {description && (
        <span className={`${styles.desc} mt-1 block text-[13px] leading-relaxed`}>
          {description}
        </span>
      )}
    </a>
  );
}
