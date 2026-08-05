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
      className="cursor-pointer text-[15px] text-[#A3A3A3] underline decoration-[#3F3F3F] underline-offset-2 transition-colors duration-200 hover:text-[#F5F5F5] hover:decoration-[#F5F5F5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5F5F5]"
    >
      {label}{" "}
      {/* Orange appearance 3 of 3: the copied checkmark */}
      <span
        key={copied ? "check" : "arrow"}
        aria-hidden="true"
        className={`${styles.glyphIn}${copied ? " text-[#EC9D5D]" : ""}`}
      >
        {copied ? "✓" : "↗"}
      </span>
      <span aria-live="polite" className="sr-only">
        {copied ? "Copied" : ""}
      </span>
    </button>
  );
}
