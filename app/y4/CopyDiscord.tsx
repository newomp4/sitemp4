"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

export default function CopyDiscord({
  label,
  handle,
}: {
  label: string;
  handle: string;
}) {
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
      className={`${styles.trigger} ${styles.social} cursor-pointer text-[15px]`}
    >
      {label}
      <span className={styles.reveal} aria-hidden="true">
        <span className={`${styles.revealInner} font-mono text-[12px]`}>
          {/* Grid stack: width is the wider of the two strings, so the
              handle → "copied ✓" swap never moves layout. */}
          <span className="inline-grid">
            <span
              className={`col-start-1 row-start-1 text-[#6E6E6E] transition-opacity duration-150 ease-in-out motion-reduce:transition-none ${
                copied ? "opacity-0" : "opacity-100"
              }`}
            >
              {` ${handle}`}
            </span>
            {/* Orange 3 of 3 — the copied flash */}
            <span
              className={`col-start-1 row-start-1 text-[#ec9d5d] transition-opacity duration-150 ease-in-out motion-reduce:transition-none ${
                copied ? "opacity-100" : "opacity-0"
              }`}
            >
              {" copied ✓"}
            </span>
          </span>
        </span>
      </span>
      <span aria-live="polite" className="sr-only">
        {copied ? "Copied" : ""}
      </span>
    </button>
  );
}
