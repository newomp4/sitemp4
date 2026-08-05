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
      timer.current = window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // Clipboard unavailable — stay quiet rather than claim success.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`copy ${label.toLowerCase()} handle ${handle}`}
      className={`${styles.social} inline-grid cursor-pointer text-left text-sm lowercase`}
    >
      {/* Overlaid grid cells keep the width stable while the text swaps. */}
      <span
        className={`col-start-1 row-start-1 transition-opacity duration-150 ease-in-out motion-reduce:transition-none ${
          copied ? "opacity-0" : "opacity-100"
        }`}
      >
        {label}
      </span>
      <span
        aria-hidden={!copied}
        className={`col-start-1 row-start-1 text-[#f5f5f5] transition-opacity duration-150 ease-in-out motion-reduce:transition-none ${
          copied ? "opacity-100" : "opacity-0"
        }`}
      >
        copied
      </span>
      <span aria-live="polite" className="sr-only">
        {copied ? "copied" : ""}
      </span>
    </button>
  );
}
