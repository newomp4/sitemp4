"use client";

import { useEffect, useRef, useState } from "react";
import type { Social } from "@/lib/content";
import styles from "./styles.module.css";

type Copied = { handle: string; id: number };

export default function SocialsRow({ socials }: { socials: Social[] }) {
  const [copied, setCopied] = useState<Copied | null>(null);
  const timer = useRef<number | null>(null);
  const copyCount = useRef(0); // re-keys the feedback line so its animation restarts

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  async function copy(handle: string) {
    try {
      await navigator.clipboard.writeText(handle);
    } catch {
      // Clipboard unavailable — print nothing rather than claim success.
      return;
    }
    copyCount.current += 1;
    setCopied({ handle, id: copyCount.current });
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div>
      <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[13px]">
        {socials.map((s) => (
          <li key={s.label}>
            {s.href ? (
              <a
                href={s.href}
                {...(s.href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                aria-label={`${s.label.toLowerCase()} — ${s.handle}`}
                className="text-[#a3a3a3] transition-colors duration-150 ease-in-out hover:text-[#ededed] focus-visible:text-[#ededed] motion-reduce:transition-none"
              >
                {s.label.toLowerCase()}
              </a>
            ) : (
              <button
                type="button"
                onClick={() => copy(s.handle)}
                aria-label={`copy ${s.label.toLowerCase()} handle ${s.handle} to clipboard`}
                className="cursor-pointer text-[#a3a3a3] transition-colors duration-150 ease-in-out hover:text-[#ededed] focus-visible:text-[#ededed] motion-reduce:transition-none"
              >
                {s.label.toLowerCase()}
              </button>
            )}
          </li>
        ))}
      </ul>
      {/* Reserved 18px line — the printed feedback never shifts layout. */}
      <p
        role="status"
        className="mt-3 h-[18px] font-mono text-[12px] leading-[18px]"
      >
        {copied && (
          /* orange 3/3: the copied print */
          <span key={copied.id} className={`${styles.copyLine} text-[#ec9d5d]`}>
            copied {copied.handle}
          </span>
        )}
      </p>
    </div>
  );
}
