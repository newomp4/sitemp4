"use client";

import { useRef } from "react";
import type { MouseEvent as ReactMouseEvent, ReactNode } from "react";
import styles from "./styles.module.css";

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * Card surface whose ::before paints a small radial light at --x/--y.
 * The coordinates are written straight to the element's style on
 * mousemove — no React state, no re-renders per pixel. The CSS side
 * only enables the spotlight on (hover: hover) and (pointer: fine),
 * so on touch this handler is inert and the card just brightens.
 */
export default function SpotlightCard({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(event: ReactMouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--x", `${event.clientX - rect.left}px`);
    el.style.setProperty("--y", `${event.clientY - rect.top}px`);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={`${styles.card} ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
