"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

type Props = {
  label: string;
  handle: string;
};

export default function CopyHandle({ label, handle }: Props) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(handle);
      setCopied(true);
      if (timer.current !== null) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable — stay quiet rather than claim success.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${label} handle ${handle} to clipboard`}
      className={`${styles.social} cursor-pointer`}
    >
      {label}{" "}
      {/* Both glyphs stay mounted in one grid cell — no layout shift. */}
      <span
        aria-hidden="true"
        className={`${styles.socialArrow} inline-grid justify-items-start`}
      >
        <span
          className={`col-start-1 row-start-1 transition-opacity duration-150 motion-reduce:transition-none ${
            copied ? "opacity-0" : "opacity-100"
          }`}
        >
          ↗
        </span>
        <span
          className={`col-start-1 row-start-1 text-[#F5F5F5] transition-opacity duration-150 motion-reduce:transition-none ${
            copied ? `opacity-100 ${styles.glyphIn}` : "opacity-0"
          }`}
        >
          ✓
        </span>
      </span>
      <span aria-live="polite" className="sr-only">
        {copied ? "Copied" : ""}
      </span>
    </button>
  );
}
