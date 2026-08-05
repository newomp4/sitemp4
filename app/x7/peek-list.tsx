"use client";

import { useEffect, useRef, useState } from "react";
import type { FocusEvent, MouseEvent as ReactMouseEvent } from "react";
import type { LinkItem } from "@/lib/content";
import Placeholder from "./placeholder";
import Row from "./row";
import styles from "./styles.module.css";

const CARD_W = 240;
const CARD_H = 160;
const FOLLOW = 0.12; // lerp factor per frame
const TILT_MAX = 3; // deg, clamped

/**
 * Work list whose rows reveal a floating 240×160 preview card.
 *
 * Pointer (hover + fine): the card follows the cursor — target coords are
 * written to refs on mousemove, a rAF loop lerps toward them and writes
 * transform directly to the DOM. Zero React state per mousemove (the m4
 * pattern). The loop starts on first row-enter and stops when hidden.
 * Tilt is derived from horizontal velocity of the lerped position, clamped.
 *
 * Keyboard (:focus-visible) and prefers-reduced-motion: the card renders
 * statically anchored right of the row instead — same content, no follow.
 * Touch (no hover / coarse pointer): no card at all.
 */
export default function PeekList({ items }: { items: LinkItem[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [anchored, setAnchored] = useState(false);

  const listRef = useRef<HTMLUListElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const tilt = useRef(0);
  const raf = useRef<number | null>(null);
  const canFloat = useRef(false);
  const reduced = useRef(false);

  useEffect(() => {
    canFloat.current = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    reduced.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    return () => {
      if (raf.current !== null) cancelAnimationFrame(raf.current);
      raf.current = null;
    };
  }, []);

  const paint = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) rotate(${tilt.current.toFixed(2)}deg)`;
  };

  const step = () => {
    const p = pos.current;
    const t = target.current;
    const prevX = p.x;
    p.x += (t.x - p.x) * FOLLOW;
    p.y += (t.y - p.y) * FOLLOW;
    const goal = Math.max(-TILT_MAX, Math.min(TILT_MAX, (p.x - prevX) * 0.35));
    tilt.current += (goal - tilt.current) * 0.15;
    paint();
    raf.current = requestAnimationFrame(step);
  };

  const startLoop = () => {
    if (raf.current === null) raf.current = requestAnimationFrame(step);
  };

  const stopLoop = () => {
    if (raf.current !== null) {
      cancelAnimationFrame(raf.current);
      raf.current = null;
    }
  };

  // 20px right of the cursor, vertically centered on it, kept on-screen
  const aim = (e: ReactMouseEvent) => {
    target.current = {
      x: Math.min(e.clientX + 20, window.innerWidth - CARD_W - 16),
      y: Math.min(
        Math.max(e.clientY - CARD_H / 2, 16),
        window.innerHeight - CARD_H - 16,
      ),
    };
  };

  const enterRow = (i: number, e: ReactMouseEvent) => {
    if (!canFloat.current) return; // touch: no floating card at all
    if (reduced.current) {
      setActive(i);
      setAnchored(true); // static beside the row, no follow, no tilt
      return;
    }
    aim(e);
    if (raf.current === null) {
      // card was hidden — snap to the cursor so it doesn't glide in from stale coords
      pos.current = { ...target.current };
      tilt.current = 0;
      paint();
    }
    setActive(i);
    setAnchored(false);
    startLoop();
  };

  const moveList = (e: ReactMouseEvent) => {
    if (!canFloat.current || reduced.current) return;
    aim(e);
  };

  const leaveList = () => {
    // keep a keyboard-opened card if focus is still inside the list
    if (anchored && listRef.current?.contains(document.activeElement)) return;
    setActive(null);
    stopLoop();
  };

  const focusRow = (i: number, e: FocusEvent<HTMLLIElement>) => {
    // keyboard only — mouse clicks shouldn't yank the card out of float mode
    if (!(e.target instanceof HTMLElement)) return;
    if (!e.target.matches(":focus-visible")) return;
    stopLoop();
    setActive(i);
    setAnchored(true);
  };

  const blurRow = () => {
    if (anchored) setActive(null);
  };

  return (
    <>
      <ul
        ref={listRef}
        className="space-y-7"
        onMouseMove={moveList}
        onMouseLeave={leaveList}
      >
        {items.map((item, i) => (
          <li
            key={item.title}
            className="relative"
            onMouseEnter={(e) => enterRow(i, e)}
            onFocus={(e) => focusRow(i, e)}
            onBlur={blurRow}
          >
            <Row item={item} />
            {anchored && active === i && (
              <div className={styles.anchorCard} aria-hidden="true">
                <div className={styles.frame}>
                  <Placeholder index={i} />
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* floating preview — transform written by the rAF loop, never React */}
      <div
        ref={cardRef}
        className={styles.floatCard}
        data-show={active !== null && !anchored}
        aria-hidden="true"
      >
        <div className={styles.frame}>
          {items.map((item, i) => (
            <div
              key={item.title}
              className={styles.artLayer}
              data-active={active === i && !anchored}
            >
              <Placeholder index={i} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
