"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import styles from "./styles.module.css";
import { RowCells } from "./RowCells";

/**
 * The Discord row. No profile page exists, so this is a <button> styled
 * identically to the anchor rows — on copy, the arrow cell briefly reads
 * COPIED in red (1.5s), announced politely to screen readers.
 */
export function CopyRow({
  number,
  label,
  handle,
  delay,
}: {
  number: string;
  label: string;
  handle: string;
  delay: string;
}) {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeout.current !== null) window.clearTimeout(timeout.current);
    };
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(handle);
      setCopied(true);
      if (timeout.current !== null) window.clearTimeout(timeout.current);
      timeout.current = window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable — fail silently, keep the row inert.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy Discord handle ${handle}`}
      className={`${styles.row} rise grid w-full cursor-pointer grid-cols-12 items-baseline gap-x-4 border-t border-[#E5E5E5] py-5 text-left`}
      style={{ "--rise-delay": delay } as CSSProperties}
    >
      <RowCells number={number} title={label} middle={handle} copied={copied} />
      <span role="status" className="sr-only">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </button>
  );
}
