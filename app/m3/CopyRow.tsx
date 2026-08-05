"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

type Props = {
  label: string;
  handle: string;
};

export default function CopyRow({ label, handle }: Props) {
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
    } catch {
      // Clipboard unavailable — do not claim success.
      return;
    }
    setCopied(true);
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`copy ${label.toLowerCase()} handle ${handle} to clipboard`}
      className={`${styles.row} flex w-full cursor-pointer items-baseline gap-3 py-2.5 text-left`}
    >
      <span className={styles.dot} aria-hidden="true" />
      <span className="text-[13px] lowercase text-[#EDEDED]">{label}</span>
      <span className={styles.leader} aria-hidden="true" />
      <span className="grid shrink-0 text-right text-xs">
        <span
          className={`${styles.year} col-start-1 row-start-1 whitespace-nowrap transition-opacity duration-150 ease-out ${
            copied ? "opacity-0" : "opacity-100"
          }`}
        >
          {handle}
        </span>
        <span
          aria-hidden={!copied}
          className={`col-start-1 row-start-1 whitespace-nowrap text-[#ec9d5d] transition-opacity duration-150 ease-out ${
            copied ? "opacity-100" : "opacity-0"
          }`}
        >
          copied
        </span>
      </span>
      <span aria-live="polite" className="sr-only">
        {copied ? "copied" : ""}
      </span>
    </button>
  );
}
