"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * The "19" in the intro. Hover it (tap on touch) and it unfolds into the
 * real age with live-ticking decimals, counting every frame. Leave and
 * it settles back to being just a number.
 */
export default function AgeTicker({
  birthday,
  children,
}: {
  birthday: string;
  children: ReactNode;
}) {
  const [live, setLive] = useState(false);
  const [text, setText] = useState<string | null>(null);
  const raf = useRef(0);

  useEffect(() => {
    if (!live) return;
    const born = new Date(birthday).getTime();
    const YEAR = 365.2425 * 24 * 60 * 60 * 1000;
    const tick = () => {
      setText(((Date.now() - born) / YEAR).toFixed(9));
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf.current);
      raf.current = 0;
    };
  }, [live, birthday]);

  const showTicker = live && text !== null;

  return (
    <span
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") setLive(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") setLive(false);
      }}
      onClick={(e) => {
        if (window.matchMedia("(hover: none)").matches) {
          e.preventDefault();
          setLive((v) => !v);
        }
      }}
      className="cursor-default text-[#D4D4D4] tabular-nums"
    >
      {showTicker ? text : children}
    </span>
  );
}
