"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

const LINKS = [
  { href: "#work", label: "work" },
  { href: "#links", label: "links" },
  { href: "#contact", label: "contact" },
] as const;

/**
 * One shared 3px dot below the link row. It scales in where the pointer
 * first lands, travels (with overshoot) between links, and scales out when
 * the pointer or keyboard focus leaves the nav.
 */
export default function Nav() {
  const trackRef = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const activeRef = useRef<number | null>(null);
  const shownRef = useRef(false);
  const [shown, setShown] = useState(false);

  const place = useCallback((index: number, snap: boolean) => {
    const link = linkRefs.current[index];
    const track = trackRef.current;
    if (!link || !track) return;
    const x = link.offsetLeft + link.offsetWidth / 2;
    if (snap) {
      // Dot is hidden (or the layout changed): position without travel,
      // then hand the transition back to the stylesheet.
      track.style.transition = "none";
      track.style.transform = `translateX(${x}px)`;
      void track.offsetWidth; // flush so the snap isn't batched away
      track.style.transition = "";
    } else {
      track.style.transform = `translateX(${x}px)`;
    }
    activeRef.current = index;
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (activeRef.current !== null) place(activeRef.current, true);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [place]);

  const enter = (index: number) => {
    place(index, !shownRef.current);
    shownRef.current = true;
    setShown(true);
  };

  const leave = () => {
    shownRef.current = false;
    setShown(false);
  };

  const onBlur = (event: React.FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      leave();
    }
  };

  return (
    <nav
      aria-label="site"
      className="relative flex items-center gap-3"
      onPointerLeave={leave}
      onBlur={onBlur}
    >
      {LINKS.map((link, i) => (
        <Fragment key={link.href}>
          {i > 0 && (
            <span aria-hidden="true" className="text-[13px] text-[#3f3f3f]">
              /
            </span>
          )}
          <a
            ref={(el) => {
              linkRefs.current[i] = el;
            }}
            href={link.href}
            className={styles.navLink}
            onPointerEnter={() => enter(i)}
            onFocus={() => enter(i)}
          >
            {link.label}
          </a>
        </Fragment>
      ))}
      <span ref={trackRef} aria-hidden="true" className={styles.dotTrack}>
        <span className={styles.dot} data-shown={shown || undefined} />
      </span>
    </nav>
  );
}
