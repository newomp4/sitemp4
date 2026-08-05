"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

/**
 * Discord has no profile page, so this is a button styled exactly like
 * the inline links. On copy, a small italic "(copied)" slides in for 1.2s.
 */
export default function DiscordCopy({
  handle,
  label,
}: {
  handle: string;
  label: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(handle);
    } catch {
      const area = document.createElement("textarea");
      area.value = handle;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      document.body.removeChild(area);
    }
    setCopied(true);
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <>
      <button
        type="button"
        onClick={copy}
        className={`${styles.link} ${styles.copyButton}`}
        aria-label={`Copy ${label} handle ${handle}`}
      >
        {label}
      </button>
      {copied && (
        <span className={styles.copied} role="status">
          (copied)
        </span>
      )}
    </>
  );
}
