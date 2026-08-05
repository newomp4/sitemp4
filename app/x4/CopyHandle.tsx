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
      // Clipboard unavailable — do nothing rather than claim success.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${label} handle ${handle} to clipboard`}
      className="cursor-pointer text-[15px] text-[#A3A3A3] transition-colors duration-150 hover:text-[#F5F5F5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5F5F5] motion-reduce:transition-none"
    >
      {label}{" "}
      {/* Fixed-width glyph cell keeps the swap layout-stable */}
      <span
        aria-hidden="true"
        className="inline-grid w-[1.1em] text-left align-baseline"
      >
        <span
          key={copied ? "check" : "arrow"}
          className={`col-start-1 row-start-1 ${styles.glyphIn}`}
        >
          {copied ? "✓" : "↗"}
        </span>
      </span>
      <span aria-live="polite" className="sr-only">
        {copied ? "Copied" : ""}
      </span>
    </button>
  );
}
