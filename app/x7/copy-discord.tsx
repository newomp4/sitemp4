"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Discord has no href — click copies the handle. The label and the
 * "copied" confirmation share one grid cell so nothing shifts.
 */
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
    } catch {
      const ta = document.createElement("textarea");
      ta.value = handle;
      ta.setAttribute("readonly", "");
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`copy ${label.toLowerCase()} handle ${handle}`}
      className="cursor-pointer text-sm lowercase text-[#a3a3a3] transition-colors duration-150 ease-in-out hover:text-[#ededed] motion-reduce:transition-none"
    >
      <span className="grid text-left">
        <span
          className={`col-start-1 row-start-1 transition-opacity duration-150 ease-in-out motion-reduce:transition-none ${
            copied ? "opacity-0" : "opacity-100"
          }`}
        >
          {label}
        </span>
        {/* orange 3 of 3: the copied confirmation */}
        <span
          aria-hidden={!copied}
          className={`col-start-1 row-start-1 text-[#ec9d5d] transition-opacity duration-150 ease-in-out motion-reduce:transition-none ${
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
