"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion } from "motion/react";
import BackLink from "../../BackLink";
import useReducedMotionPreference from "../../useReducedMotionPreference";
import { github, tools, toolsIntro, updatedLabel } from "@/lib/tools";
import Cover from "./Cover";
import styles from "./sheet.module.css";

/**
 * CONCEPT 2 — "Contact sheet".
 *
 * The gallery's grammar, applied to tools: squares in a grid, and a
 * click grows one out of its own slot into the middle of the screen
 * while the rest step back. Same spring, same hand. The covers are
 * drawn rather than photographed — each one behaves like the tool it
 * stands for.
 */

type Box = { top: number; left: number; width: number; height: number };

type Viewer = {
  index: number;
  from: Box; // the tile it grew out of
  to: Box; // the card, centred
  phase: "open" | "closing";
  snap?: boolean; // a resize must not fly across the screen
};

/* The gallery's spring, to the number: it arrives and stops. */
const spring = { type: "spring" as const, stiffness: 320, damping: 34, mass: 1 };
const RADIUS = 10;

/* The opened card. Wide on a desktop, stacked on a phone — and never
   taller than the window it has to sit inside. */
function fitCard(): Box {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const stacked = vw < 760;
  const width = stacked ? Math.min(vw - 32, 440) : Math.min(vw - 96, 760);
  const height = stacked
    ? Math.min(vh - 96, 560)
    : Math.min(vh - 96, 400);
  return { width, height, left: (vw - width) / 2, top: (vh - height) / 2 };
}

const rect = (element: Element): Box => {
  const { top, left, width, height } = element.getBoundingClientRect();
  return { top, left, width, height };
};

export default function Sheet() {
  const reduced = useReducedMotionPreference();
  const [viewer, setViewer] = useState<Viewer | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const tiles = useRef<(HTMLButtonElement | null)[]>([]);
  const dialog = useRef<HTMLDialogElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const viewing = viewer !== null;
  const open = viewer?.phase === "open";
  const transition = reduced ? { duration: 0 } : spring;

  function show(index: number, button: HTMLButtonElement) {
    if (viewer) return;
    setViewer({ index, from: rect(button), to: fitCard(), phase: "open" });
  }

  function close() {
    setViewer((current) =>
      current?.phase === "open" ? { ...current, phase: "closing", snap: false } : current,
    );
  }

  /* The slot never moves while a card is open — the grid only dims and
     recedes — so folding back is simply a trip to the tile's own rect. */
  function finish() {
    if (viewer?.phase !== "closing") return;
    tiles.current[viewer.index]?.focus({ preventScroll: true });
    setViewer(null);
  }

  useEffect(() => {
    if (!viewing) return;
    const modal = dialog.current;
    if (!modal) return;
    modal.showModal();
    card.current?.focus({ preventScroll: true });
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      modal.close();
      document.documentElement.style.overflow = previous;
    };
  }, [viewing]);

  useEffect(() => {
    if (!viewing) return;
    const resize = () =>
      setViewer((current) => {
        if (!current) return current;
        const tile = tiles.current[current.index];
        return {
          ...current,
          snap: true,
          to: fitCard(),
          from: tile ? rect(tile) : current.from,
        };
      });
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [viewing]);

  const tool = viewer ? tools[viewer.index] : null;

  return (
    <main className={styles.stage}>
      <BackLink />

      <div className={styles.column}>
        <header className={styles.head}>
          <h1 className={`${styles.title} rise`} style={{ "--rise-delay": "0.1s" } as CSSProperties}>
            Tools
          </h1>
          <p className={`${styles.intro} rise`} style={{ "--rise-delay": "0.16s" } as CSSProperties}>
            {toolsIntro}{" "}
            <a className={styles.introLink} href={github} target="_blank" rel="noopener noreferrer">
              GitHub ↗
            </a>
            .
          </p>
        </header>

        <ul className={styles.grid}>
          {tools.map((item, index) => {
            const lifted = viewer?.index === index;
            return (
              <li
                key={item.name}
                className={styles.cell}
                style={{ "--arrival-delay": `${0.22 + index * 0.05}s` } as CSSProperties}
              >
                <button
                  ref={(element) => {
                    tiles.current[index] = element;
                  }}
                  type="button"
                  className={styles.tile}
                  style={{ borderRadius: RADIUS }}
                  data-lifted={lifted || undefined}
                  data-dimmed={(open && !lifted) || undefined}
                  onClick={(event) => show(index, event.currentTarget)}
                  onPointerEnter={(event) => {
                    if (event.pointerType === "mouse") setActive(index);
                  }}
                  onPointerLeave={() => setActive((current) => (current === index ? null : current))}
                  onFocus={() => setActive(index)}
                  onBlur={() => setActive((current) => (current === index ? null : current))}
                  aria-label={`${item.name} — ${item.tagline}`}
                  tabIndex={viewing ? -1 : 0}
                >
                  {/* A cover only runs for the tile being regarded, and
                      never behind an open card. */}
                  <Cover art={item.art} active={!viewing && active === index} />
                  <span className={styles.tileLabel}>
                    <span className={styles.tileName}>{item.name}</span>
                    <span className={styles.tileTag}>
                      <span>{item.tagline}</span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {viewer && tool && (
        <dialog
          ref={dialog}
          className={styles.viewer}
          aria-label={tool.name}
          onCancel={(event) => {
            event.preventDefault();
            close();
          }}
          onClick={close}
        >
          <motion.div
            ref={card}
            className={styles.card}
            style={{ borderRadius: RADIUS }}
            initial={viewer.from}
            animate={viewer.phase === "open" ? viewer.to : viewer.from}
            transition={viewer.snap ? { duration: 0 } : transition}
            onAnimationComplete={finish}
            onClick={(event) => event.stopPropagation()}
            tabIndex={-1}
          >
            <div className={styles.cardArt}>
              <Cover art={tool.art} active />
            </div>

            {/* The box lands first; the words arrive into it after. */}
            <div className={styles.cardBody} data-open={viewer.phase === "open" || undefined}>
              <p className={styles.cardLang} style={{ "--in": "0.02s" } as CSSProperties}>
                {tool.lang} · updated {updatedLabel(tool.updated)}
              </p>
              <h2 className={styles.cardName} style={{ "--in": "0.06s" } as CSSProperties}>
                {tool.name}
              </h2>
              <p className={styles.cardTagline} style={{ "--in": "0.1s" } as CSSProperties}>
                {tool.tagline}
              </p>
              <p className={styles.cardNote} style={{ "--in": "0.14s" } as CSSProperties}>
                {tool.note}
              </p>
              <div className={styles.cardLinks} style={{ "--in": "0.18s" } as CSSProperties}>
                <a className={styles.action} href={tool.repo} target="_blank" rel="noopener noreferrer">
                  Source on GitHub <span aria-hidden="true">↗</span>
                </a>
                {tool.demo && (
                  <a
                    className={`${styles.action} ${styles.actionPrimary}`}
                    href={tool.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Try it <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            </div>
          </motion.div>

          <button type="button" className={styles.close} onClick={close} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="m6 6 12 12M6 18 18 6" />
            </svg>
          </button>
        </dialog>
      )}
    </main>
  );
}
