"use client";

import { useRef, useState } from "react";
import styles from "./styles.module.css";

export default function DiscordCopy({
  label,
  handle,
}: {
  label: string;
  handle: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1200);
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy Discord handle ${handle}`}
      className={`group -mx-2 flex w-[calc(100%+16px)] cursor-pointer items-start gap-2 px-2 py-1 text-left text-[14px] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#37352F] ${styles.block}`}
    >
      <span className="w-24 shrink-0 text-[#787774]">{label}</span>
      <span className="relative min-w-0">
        <span className="break-all text-[#37352F] underline decoration-[rgba(55,53,47,0.3)] underline-offset-2 group-hover:decoration-[rgba(55,53,47,0.6)]">
          {handle}
        </span>
        <span
          aria-hidden="true"
          className={`absolute -top-8 left-1/2 z-10 whitespace-nowrap rounded-[4px] bg-[#37352F] px-2 py-1 text-[12px] leading-none text-white ${styles.tooltip} ${copied ? styles.tooltipVisible : ""}`}
        >
          Copied
        </span>
      </span>
      <span
        aria-hidden="true"
        className="mt-px hidden text-[12px] text-[#9B9A97] opacity-0 transition-opacity duration-150 group-hover:opacity-100 sm:inline"
      >
        click to copy
      </span>
      <span className="sr-only" role="status">
        {copied ? "Copied" : ""}
      </span>
    </button>
  );
}
