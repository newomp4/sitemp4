"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

type Props = {
  label: string;
  handle: string;
};

/** Click-to-copy rendered inline in a sentence, styled like the prose links. */
export default function CopyDiscord({ label, handle }: Props) {
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
      className={`${styles.proseLink} ${copied ? styles.copied : ""} cursor-pointer`}
    >
      {label}
      {/* Both glyphs stay mounted in one grid cell — no layout shift. */}
      <span aria-hidden="true" className={styles.glyphCell}>
        <span className={`${styles.miniArrow} col-start-1 row-start-1`}>↗</span>
        <span className={`${styles.check} col-start-1 row-start-1`}>✓</span>
      </span>
      <span aria-live="polite" className="sr-only">
        {copied ? "Copied" : ""}
      </span>
    </button>
  );
}
