"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";
import BackLink from "../../BackLink";
import useReducedMotionPreference from "../../useReducedMotionPreference";
import { github, tools, toolsIntro, updatedLabel, type Tool } from "@/lib/tools";
import Cover from "./Cover";
import styles from "./board.module.css";

/**
 * CONCEPT 5 — "Board".
 *
 * A wall of names that never quite settles. Three rows drift at
 * different speeds and in opposite directions; putting the pointer
 * anywhere on the wall stops all three at once, so reading it is a
 * deliberate act. The name you pick rises into a sheet from the bottom
 * edge with everything about it.
 */

/* Four names a row, three rows, each row set out three times so the
   loop has something to repeat. */
const ROWS = [tools.slice(0, 4), tools.slice(4, 8), tools.slice(8, 12)];
const REPEATS = 3;
const SPEEDS = [42, 34, 48]; // seconds for one full pass
const DRIFT = ["normal", "reverse", "normal"] as const;

export default function Board() {
  const reduced = useReducedMotionPreference();
  const [picked, setPicked] = useState<Tool | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);

  /* The modal opens the moment a name is picked, but it must stay open
     for the sheet to slide back down — closing it would cut the exit
     off. AnimatePresence says when the sheet has actually gone. */
  useEffect(() => {
    if (!picked) return;
    dialog.current?.showModal();
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previous;
    };
  }, [picked]);

  return (
    <main className={styles.stage} data-open={picked ? "" : undefined}>
      <BackLink />

      <div className={styles.wallWrap}>
        <header className={styles.head}>
          <h1 className={`${styles.title} rise`} style={{ "--rise-delay": "0.1s" } as CSSProperties}>
            Tools
          </h1>
          <p className={`${styles.intro} rise`} style={{ "--rise-delay": "0.16s" } as CSSProperties}>
            {toolsIntro}{" "}
            <a className={styles.introLink} href={github} target="_blank" rel="noopener noreferrer">
              GitHub ↗
            </a>
            . Hold the pointer anywhere to stop the wall.
          </p>
        </header>

        <div className={styles.wall}>
          {ROWS.map((row, r) => (
            <div
              key={r}
              className={styles.rowIn}
              style={{ "--in": `${0.24 + r * 0.12}s` } as CSSProperties}
            >
              <div
                className={styles.track}
                style={
                  {
                    "--speed": `${SPEEDS[r]}s`,
                    "--direction": DRIFT[r],
                  } as CSSProperties
                }
              >
                {/* Two identical halves so the loop can hand off at
                    -50%, each half laid out a few times over so a wide
                    window is never short of names. Only the very first
                    set is the real one — the rest are scenery, and are
                    hidden from the keyboard and from screen readers. */}
                {[0, 1].map((copy) =>
                  Array.from({ length: REPEATS }).flatMap((_, pass) =>
                    row.map((tool) => {
                      const scenery = copy > 0 || pass > 0;
                      return (
                        <button
                          key={`${copy}-${pass}-${tool.name}`}
                          type="button"
                          className={styles.name}
                          {...(scenery ? { "aria-hidden": true, tabIndex: -1, "data-scenery": "" } : {})}
                          onClick={(event) => {
                            opener.current = event.currentTarget;
                            setPicked(tool);
                          }}
                        >
                          {tool.name}
                          <span className={styles.dot} aria-hidden="true" />
                        </button>
                      );
                    }),
                  ),
                )}
              </div>
            </div>
          ))}
        </div>

        <p className={styles.foot}>
          {tools.length} of them · free · <span className={styles.footDim}>click a name</span>
        </p>
      </div>

      <dialog
        ref={dialog}
        className={styles.sheetLayer}
        aria-label={picked?.name ?? "Tool"}
        onCancel={(event) => {
          event.preventDefault();
          setPicked(null);
        }}
        onClick={() => setPicked(null)}
      >
        <AnimatePresence
          onExitComplete={() => {
            dialog.current?.close();
            opener.current?.focus({ preventScroll: true });
          }}
        >
          {picked && (
            <motion.div
              className={styles.sheet}
              initial={reduced ? { opacity: 0 } : { y: "100%" }}
              animate={reduced ? { opacity: 1 } : { y: 0 }}
              exit={reduced ? { opacity: 0 } : { y: "100%" }}
              transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 32, mass: 0.9 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className={styles.sheetArt}>
                <Cover art={picked.art} active />
              </div>

              <div className={styles.sheetBody}>
                <p className={styles.sheetMeta} style={{ "--in": "0.06s" } as CSSProperties}>
                  {picked.lang} · updated {updatedLabel(picked.updated)} · {picked.tags.join(" · ")}
                </p>
                <h2 className={styles.sheetName} style={{ "--in": "0.1s" } as CSSProperties}>
                  {picked.name}
                </h2>
                <p className={styles.sheetTagline} style={{ "--in": "0.14s" } as CSSProperties}>
                  {picked.tagline}
                </p>
                <p className={styles.sheetNote} style={{ "--in": "0.18s" } as CSSProperties}>
                  {picked.note}
                </p>
                <div className={styles.sheetLinks} style={{ "--in": "0.22s" } as CSSProperties}>
                  <a className={styles.action} href={picked.repo} target="_blank" rel="noopener noreferrer">
                    Source on GitHub <span aria-hidden="true">↗</span>
                  </a>
                  {picked.demo && (
                    <a
                      className={`${styles.action} ${styles.actionPrimary}`}
                      href={picked.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Try it <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </div>
              </div>

              <button
                type="button"
                className={styles.close}
                onClick={() => setPicked(null)}
                aria-label="Close"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="m6 6 12 12M6 18 18 6" />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </dialog>
    </main>
  );
}
