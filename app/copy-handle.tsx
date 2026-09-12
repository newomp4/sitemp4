"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

type Props = {
  label: string;
  handle: string;
};

export default function CopyHandle({ label, handle }: Props) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  async function copy() {
    let next: "copied" | "failed";
    try {
      await navigator.clipboard.writeText(handle);
      next = "copied";
    } catch {
      next = "failed";
    }
    setStatus(next);
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(
      () => setStatus("idle"),
      next === "copied" ? 1500 : 3000,
    );
  }

  return (
    <span className="inline-flex items-baseline gap-2">
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${label} handle ${handle} to clipboard`}
        className={`${styles.social} cursor-pointer`}
        data-copied={status === "copied"}
      >
        <span className={styles.copyLabel}>
          <span aria-hidden={status === "copied"}>{label}</span>
          <span aria-hidden={status !== "copied"}>Copied</span>
        </span>{" "}
        {/* Both glyphs stay mounted in one grid cell — no layout shift. */}
        <span
          aria-hidden="true"
          className={styles.copyIcon}
        >
          <span
            className={`col-start-1 row-start-1 transition-opacity duration-150 motion-reduce:transition-none ${
              status === "copied" ? "opacity-0" : "opacity-100"
            }`}
          >
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.2">
              <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
              <path d="M10.5 3V2.5A1 1 0 0 0 9.5 1.5h-7a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1H3" />
            </svg>
          </span>
          <span
            className={`col-start-1 row-start-1 text-[#F5F5F5] transition-opacity duration-150 motion-reduce:transition-none ${
              status === "copied" ? `opacity-100 ${styles.glyphIn}` : "opacity-0"
            }`}
          >
            ✓
          </span>
        </span>
      </button>
      {/* If the clipboard is unavailable, say the handle instead of failing silently */}
      {status === "failed" && (
        <span className={`${styles.glyphIn} text-meta text-[#8A8A8A]`}>
          Copy this: {handle}
        </span>
      )}
      <span aria-live="polite" className="sr-only">
        {status === "copied" && "Copied"}
        {status === "failed" && `Couldn't copy. The handle is ${handle}`}
      </span>
    </span>
  );
}
