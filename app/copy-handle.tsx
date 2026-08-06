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
      >
        {label}{" "}
        {/* Both glyphs stay mounted in one grid cell — no layout shift. */}
        <span
          aria-hidden="true"
          className={`${styles.socialArrow} inline-grid justify-items-start`}
        >
          <span
            className={`col-start-1 row-start-1 transition-opacity duration-150 motion-reduce:transition-none ${
              status === "copied" ? "opacity-0" : "opacity-100"
            }`}
          >
            ↗
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
        <span className={`${styles.glyphIn} text-[13px] text-[#8A8A8A]`}>
          couldn&rsquo;t copy, it&rsquo;s {handle}
        </span>
      )}
      <span aria-live="polite" className="sr-only">
        {status === "copied" && "Copied"}
        {status === "failed" && `Couldn't copy. The handle is ${handle}`}
      </span>
    </span>
  );
}
