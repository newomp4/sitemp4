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
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";
import { motion } from "motion/react";
import { fitPhoto, type PhotoBox } from "@/lib/photo-layout";
import useReducedMotionPreference from "../useReducedMotionPreference";
import styles from "./photos.module.css";

export type Photo = {
  src: string;
  alt: string;
  caption?: ReactNode; // a quiet line under the open print
};

type Box = PhotoBox;

type Viewer = {
  index: number;
  ratio: number;
  from: Box; // the square tile it grew out of
  to: Box; // centred, at the photo's native aspect ratio
  phase: "open" | "closing";
  snap?: boolean; // resize/orientation changes must not fly in from offscreen
  back?: Box; // where the grid slot is once the gap has settled
};

/* One spring drives everything: the trip to the centre, the grid spreading
   apart, and the trip back. Damped hard so it settles without a bounce. */
const spring = { type: "spring" as const, stiffness: 320, damping: 34, mass: 1 };
const RADIUS = 10;

/* The largest centred box at the photo's own ratio that fits comfortably. */
function fit(ratio: number, hasCaption: boolean): Box {
  return fitPhoto(ratio, window.innerWidth, window.innerHeight, hasCaption);
}

/* Wrap every word of a caption (links included) in a span that fades and
   lifts in on its own, staggered left to right. Whitespace passes through
   untouched so the line still wraps naturally. */
function Word({ index, children }: { index: number; children: ReactNode }) {
  return (
    <span
      className={styles.word}
      style={{ "--word-delay": `${0.28 + index * 0.09}s` } as CSSProperties}
    >
      {children}
    </span>
  );
}

function splitWords(node: ReactNode, next: () => number): ReactNode {
  if (typeof node === "string") {
    return node.split(/(\s+)/).map((part, i) =>
      part.trim() === "" ? (
        part
      ) : (
        <Word key={i} index={next()}>
          {part}
        </Word>
      ),
    );
  }
  if (Array.isArray(node)) {
    return node.map((child, i) => <Fragment key={i}>{splitWords(child, next)}</Fragment>);
  }
  if (isValidElement(node)) {
    const element = node as ReactElement<{ children?: ReactNode }>;
    return cloneElement(element, undefined, splitWords(element.props.children, next));
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
  const dialog = useRef<HTMLDialogElement>(null);
  const open = viewer?.phase === "open";
  const viewing = viewer !== null;
  const transition = reduced ? { duration: 0 } : spring;

  function show(index: number, button: HTMLButtonElement) {
    const image = button.querySelector("img");
    const ratio =
      image && image.naturalWidth > 0 ? image.naturalWidth / image.naturalHeight : 1;
    if (viewer) return;
    setViewer({ index, ratio, from: rect(button), to: fit(ratio, Boolean(photos[index].caption)), phase: "open" });
  }

  function close() {
    setViewer((current) =>
      current && current.phase === "open" ? { ...current, phase: "closing", snap: false } : current,
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
    if (!viewing) return;
    const modal = dialog.current;
    if (!modal) return;
    modal.showModal();
    card.current?.focus({ preventScroll: true });
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      modal.close();
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [viewing]);

  useEffect(() => {
    if (!viewing) return;
    const resize = () => setViewer((current) => {
      if (!current) return current;
      const cell = cells.current[current.index];
      return {
        ...current,
        snap: true,
        to: fit(current.ratio, Boolean(photos[current.index].caption)),
        back: current.phase === "closing" && cell ? slot(cell) : undefined,
      };
    });
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [viewing, photos]);

  function finish() {
    if (viewer?.phase !== "closing" || !viewer.back) return;
    dialog.current?.close();
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
            <li
              key={item.src}
              ref={(element) => {
                cells.current[index] = element;
              }}
              className={styles.cell}
              style={{ "--arrival-delay": `${0.1 + index * 0.05}s` } as CSSProperties}
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
                  opacity: { duration: reduced || lifted || !viewer ? 0 : 0.35 },
                  filter: { duration: reduced ? 0 : 0.35 },
                }}
                onClick={(event) => show(index, event.currentTarget)}
                aria-label={`Open photo ${index + 1}: ${item.alt}`}
                tabIndex={viewing ? -1 : 0}
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
            </li>
          );
        })}
      </ul>

      {viewer && photo && (
        <dialog
          ref={dialog}
          className={styles.viewer}
          aria-label={photo.alt}
          onCancel={(event) => { event.preventDefault(); close(); }}
          onKeyDown={(event) => {
            if (event.key !== "Tab") return;
            const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(
              'a[href], button:not([disabled]), [tabindex="0"]',
            ));
            const first = controls[0];
            const last = controls[controls.length - 1];
            if (event.shiftKey && (document.activeElement === first || document.activeElement === card.current)) {
              event.preventDefault();
              last?.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first?.focus();
            }
          }}
          onClick={close}
        >
          <motion.div
            ref={card}
            className={styles.card}
            style={{ borderRadius: RADIUS }}
            initial={viewer.from}
            animate={viewer.phase === "open" ? viewer.to : (viewer.back ?? viewer.to)}
            transition={viewer.snap ? { duration: 0 } : transition}
            onAnimationComplete={finish}
            tabIndex={-1}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 520px) 86vw, 760px"
              unoptimized
              loading="eager"
              draggable={false}
              className={styles.img}
              onLoad={(event) => {
                const image = event.currentTarget;
                if (!image.naturalWidth || !image.naturalHeight) return;
                const ratio = image.naturalWidth / image.naturalHeight;
                setViewer((current) => current && current.ratio !== ratio
                  ? { ...current, ratio, to: fit(ratio, Boolean(photo.caption)) }
                  : current);
              }}
            />
            <motion.span
              className={styles.grain}
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: viewer.phase === "open" ? 1 : 0 }}
              transition={{ duration: reduced ? 0 : 0.3 }}
            />
          </motion.div>
          {photo.caption && (
            <motion.p
              key={photo.src}
              className={styles.caption}
              style={{ top: viewer.to.top + viewer.to.height + 14, width: viewer.to.width }}
              animate={{ opacity: viewer.phase === "open" ? 1 : 0 }}
              transition={{ duration: reduced ? 0 : 0.12 }}
              onClick={(event) => event.stopPropagation()}
            >
              {splitWords(photo.caption, counter())}
            </motion.p>
          )}
          <button type="button" className={styles.close} onClick={close} aria-label="Close photo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="m6 6 12 12M6 18 18 6" />
            </svg>
          </button>
        </dialog>
      )}
    </>
  );
}
