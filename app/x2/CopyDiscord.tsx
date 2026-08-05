"use client";

import { useEffect, useRef, useState } from "react";

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
      setCopied(true);
      if (timer.current !== null) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // clipboard unavailable — stay quiet rather than claim success
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`copy ${label.toLowerCase()} handle ${handle}`}
      className="group inline-grid cursor-pointer text-left text-sm lowercase"
    >
      {/* Both states share one grid cell so the swap never shifts layout */}
      <span
        className={`col-start-1 row-start-1 text-[#a3a3a3] decoration-[#3f3f3f] underline-offset-[3px] transition-[color,opacity] duration-150 ease-in-out group-hover:text-[#ededed] group-hover:underline motion-reduce:transition-none ${
          copied ? "opacity-0" : "opacity-100"
        }`}
      >
        {label}
      </span>
      <span
        aria-hidden={!copied}
        className={`col-start-1 row-start-1 text-[#ededed] transition-opacity duration-150 ease-in-out motion-reduce:transition-none ${
          copied ? "opacity-100" : "opacity-0"
        }`}
      >
        copied
      </span>
      <span aria-live="polite" className="sr-only">
        {copied ? "copied" : ""}
      </span>
    </button>
  );
}
