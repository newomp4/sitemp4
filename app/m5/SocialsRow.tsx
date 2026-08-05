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
      <ul className="flex flex-wrap items-center gap-4 font-mono text-[13px]">
        {socials.map((s) => (
          <li key={s.label}>
            {s.href ? (
              <a
                href={s.href}
                {...(s.href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="text-[#A3A3A3] transition-colors duration-150 hover:text-[#EDEDED]"
              >
                {s.label.toLowerCase()}
              </a>
            ) : (
              <button
                type="button"
                onClick={() => copy(s.handle)}
                aria-label={`copy ${s.label.toLowerCase()} handle ${s.handle} to clipboard`}
                className="cursor-pointer text-[#A3A3A3] transition-colors duration-150 hover:text-[#EDEDED]"
              >
                {s.label.toLowerCase()}
              </button>
            )}
          </li>
        ))}
      </ul>
      {/* Reserved line so the printed feedback never shifts the layout. */}
      <p
        role="status"
        className="mt-3 h-[18px] font-mono text-[12px] leading-[18px]"
      >
        {copied && (
          <span key={copied.id} className={`${styles.copyLine} text-[#ec9d5d]`}>
            copied {copied.handle} to clipboard
          </span>
        )}
      </p>
    </div>
  );
}
