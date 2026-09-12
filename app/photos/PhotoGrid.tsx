"use client";

import Image from "next/image";
import {
  Fragment,
  cloneElement,
  isValidElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { motion } from "motion/react";
import useReducedMotionPreference from "../useReducedMotionPreference";
import styles from "./photos.module.css";

export type Photo = {
  src: string;
  alt: string;
  caption?: ReactNode; // a quiet line under the open print
};

type Box = { top: number; left: number; width: number; height: number };

type Viewer = {
  index: number;
  from: Box; // the square tile it grew out of
  to: Box; // centred, at the photo's native aspect ratio
  phase: "open" | "closing";
  back?: Box; // where the grid slot is once the gap has settled
};

/* One spring drives everything: the trip to the centre, the grid spreading
   apart, and the trip back. Damped hard so it settles without a bounce. */
const spring = { type: "spring" as const, stiffness: 320, damping: 34, mass: 1 };
const RADIUS = 10;

/* The largest centred box at the photo's own ratio that fits comfortably. */
function fit(ratio: number): Box {
  const maxWidth = Math.min(window.innerWidth * 0.86, 760);
  const maxHeight = Math.min(window.innerHeight * 0.66, 680);
  const scale = Math.min(maxWidth / ratio, maxHeight);
  const width = ratio * scale;
  const height = scale;
  return {
    width,
    height,
    left: (window.innerWidth - width) / 2,
    // Sit a touch above centre so the caption beneath reads as part of it.
    top: (window.innerHeight - height) / 2 - 12,
  };
}

/* Wrap every word of a caption (links included) in a span that fades and
   lifts in on its own, staggered left to right. Whitespace passes through
   untouched so the line still wraps naturally. */
function Word({ index, reduced, children }: { index: number; reduced: boolean; children: ReactNode }) {
  return (
    <motion.span
      className={styles.word}
      initial={reduced ? false : { opacity: 0, y: 4, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.28 + index * 0.09 }}
    >
      {children}
    </motion.span>
  );
}

function splitWords(node: ReactNode, next: () => number, reduced: boolean): ReactNode {
  if (typeof node === "string") {
    return node.split(/(\s+)/).map((part, i) =>
      part.trim() === "" ? (
        part
      ) : (
        <Word key={i} index={next()} reduced={reduced}>
          {part}
        </Word>
      ),
    );
  }
  if (Array.isArray(node)) {
    return node.map((child, i) => <Fragment key={i}>{splitWords(child, next, reduced)}</Fragment>);
  }
  if (isValidElement(node)) {
    const element = node as ReactElement<{ children?: ReactNode }>;
    return cloneElement(element, undefined, splitWords(element.props.children, next, reduced));
  }
  return node;
}

const counter = () => {
  let n = 0;
  return () => n++;
};

const rect = (element: Element): Box => {
  const { top, left, width, height } = element.getBoundingClientRect();
  return { top, left, width, height };
};

/* A cell's laid-out slot, ignoring any transform it is mid-way through
   (the entrance lift), so the closing print always lands on the grid. */
const slot = (cell: HTMLElement): Box => {
  const parent = cell.offsetParent as HTMLElement | null;
  const base = parent ? parent.getBoundingClientRect() : { top: 0, left: 0 };
  const inset = parent ? { top: parent.clientTop, left: parent.clientLeft } : { top: 0, left: 0 };
  return {
    top: base.top + inset.top + cell.offsetTop,
    left: base.left + inset.left + cell.offsetLeft,
    width: cell.offsetWidth,
    height: cell.offsetHeight,
  };
};

/* The first look: prints surface one after another, softly, top-left to
   bottom-right. Nothing showy — like a contact sheet developing. */
const arrive = (index: number) => ({
  duration: 1.1,
  ease: [0.16, 1, 0.3, 1] as const,
  delay: 0.1 + index * 0.05,
});

/**
 * A grid of square prints. Click one and it grows out of its slot to the
 * middle of the screen, opening up to the photo's real proportions, while
 * the rest dim and drift outward. Click anywhere (or press Escape) and it
 * folds back into its square.
 */
export default function PhotoGrid({ photos }: { photos: Photo[] }) {
  const reduced = useReducedMotionPreference();
  const [viewer, setViewer] = useState<Viewer | null>(null);
  const cells = useRef<(HTMLLIElement | null)[]>([]);
  const tiles = useRef<(HTMLButtonElement | null)[]>([]);
  const card = useRef<HTMLDivElement>(null);
  const open = viewer?.phase === "open";
  const transition = reduced ? { duration: 0 } : spring;

  function show(index: number, button: HTMLButtonElement) {
    const image = button.querySelector("img");
    const ratio =
      image && image.naturalWidth > 0 ? image.naturalWidth / image.naturalHeight : 1;
    setViewer({ index, from: rect(button), to: fit(ratio), phase: "open" });
  }

  function close() {
    setViewer((current) =>
      current && current.phase === "open" ? { ...current, phase: "closing" } : current,
    );
  }

  /* The gap snaps back on the same render that starts the close, so the
     slot's settled position can be read from the (untransformed) cell. */
  useLayoutEffect(() => {
    if (viewer?.phase !== "closing" || viewer.back) return;
    const cell = cells.current[viewer.index];
    if (!cell) return;
    const back = slot(cell);
    setViewer((current) => (current ? { ...current, back } : current));
  }, [viewer]);

  useEffect(() => {
    if (!open) return;
    card.current?.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function finish() {
    if (viewer?.phase !== "closing" || !viewer.back) return;
    tiles.current[viewer.index]?.focus({ preventScroll: true });
    setViewer(null);
  }

  const photo = viewer ? photos[viewer.index] : null;

  return (
    <>
      <ul className={styles.grid} style={{ gap: open ? 22 : 10 }}>
        {photos.map((item, index) => {
          const lifted = viewer?.index === index;
          const dimmed = open && !lifted;
          return (
            <motion.li
              key={item.src}
              ref={(element) => {
                cells.current[index] = element;
              }}
              className={styles.cell}
              initial={reduced ? false : { opacity: 0, y: 10, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={arrive(index)}
            >
              <motion.button
                ref={(element) => {
                  tiles.current[index] = element;
                }}
                type="button"
                layout={!reduced}
                className={styles.tile}
                style={{ borderRadius: RADIUS }}
                animate={{
                  opacity: lifted ? 0 : dimmed ? 0.28 : 1,
                  filter: dimmed ? "blur(2px)" : "blur(0px)",
                }}
                transition={{
                  ...transition,
                  opacity: { duration: lifted || !viewer ? 0 : 0.35 },
                  filter: { duration: 0.35 },
                }}
                onClick={(event) => show(index, event.currentTarget)}
                aria-label={`Open photo ${index + 1}: ${item.alt}`}
                tabIndex={open ? -1 : 0}
              >
                <Image
                  src={item.src}
                  alt=""
                  fill
                  sizes="(max-width: 520px) 46vw, (max-width: 860px) 30vw, 176px"
                  unoptimized
                  preload={index < 4}
                  draggable={false}
                  className={styles.img}
                />
              </motion.button>
            </motion.li>
          );
        })}
      </ul>

      {viewer && photo && (
        <div
          className={styles.viewer}
          role="dialog"
          aria-modal="true"
          aria-label={photo.alt}
          onClick={close}
        >
          <motion.div
            ref={card}
            className={styles.card}
            style={{ borderRadius: RADIUS }}
            initial={viewer.from}
            animate={viewer.phase === "open" ? viewer.to : (viewer.back ?? viewer.to)}
            transition={transition}
            onAnimationComplete={finish}
            tabIndex={-1}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 520px) 86vw, 760px"
              unoptimized
              draggable={false}
              className={styles.img}
            />
            <motion.span
              className={styles.grain}
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: viewer.phase === "open" ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
          {photo.caption && (
            <motion.p
              key={photo.src}
              className={styles.caption}
              style={{ top: viewer.to.top + viewer.to.height + 14, left: viewer.to.left, width: viewer.to.width }}
              animate={{ opacity: viewer.phase === "open" ? 1 : 0 }}
              transition={{ duration: reduced ? 0 : 0.12 }}
              onClick={(event) => event.stopPropagation()}
            >
              {splitWords(photo.caption, counter(), reduced)}
            </motion.p>
          )}
          <button type="button" className="sr-only" onClick={close}>
            Close photo
          </button>
        </div>
      )}
    </>
  );
}
