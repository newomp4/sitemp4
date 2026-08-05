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
      className="cursor-pointer text-[15px] text-[#6B6B6B] underline underline-offset-2 transition-colors duration-150 hover:text-[#1A1A1A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A1A1A]"
    >
      {label}{" "}
      <span
        key={copied ? "check" : "arrow"}
        aria-hidden="true"
        className={styles.glyphIn}
      >
        {copied ? "✓" : "↗"}
      </span>
      <span aria-live="polite" className="sr-only">
        {copied ? "Copied" : ""}
      </span>
    </button>
  );
}
