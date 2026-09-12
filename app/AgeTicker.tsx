"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ageAt } from "@/lib/age";
import useReducedMotionPreference from "./useReducedMotionPreference";

export default function AgeTicker({ birthday, children }: { birthday: string; children: ReactNode }) {
  const [live, setLive] = useState(false);
  const [now, setNow] = useState<number | null>(null);
  const reduced = useReducedMotionPreference();
  const pointerType = useRef("mouse");

  useEffect(() => {
    const ticking = live && !reduced;
    let frame = 0;
    const update = () => {
      setNow(Date.now());
      if (ticking) frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    // Keep the resting whole-number age current across birthdays and long-lived tabs.
    const timer = ticking ? undefined : window.setInterval(update, 60_000);
    return () => {
      cancelAnimationFrame(frame);
      if (timer !== undefined) window.clearInterval(timer);
    };
  }, [live, reduced]);

  const age = now === null ? NaN : ageAt(birthday, now);
  const valid = Number.isFinite(age);

  return (
    <button
      type="button"
      aria-label={valid ? `Age ${Math.floor(age)}. ${live ? "Hide" : "Show"} precise age` : "Show precise age"}
      aria-pressed={live}
      onPointerEnter={(event) => { if (event.pointerType === "mouse") setLive(true); }}
      onPointerLeave={(event) => { if (event.pointerType === "mouse") setLive(false); }}
      onFocus={(event) => { if (event.currentTarget.matches(":focus-visible")) setLive(true); }}
      onBlur={() => setLive(false)}
      onPointerDown={(event) => { pointerType.current = event.pointerType; }}
      onClick={(event) => {
        if (event.detail === 0 || pointerType.current !== "mouse") setLive((value) => !value);
      }}
      className="cursor-default text-[#D4D4D4] tabular-nums"
    >
      {valid ? (live ? age.toFixed(reduced ? 2 : 9) : Math.floor(age)) : children}
    </button>
  );
}
