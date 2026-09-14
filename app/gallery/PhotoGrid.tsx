"use client";

import Image, { type StaticImageData } from "next/image";
import {
  Fragment,
  useCallback,
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
import styles from "./gallery.module.css";

export type Photo = {
  src: StaticImageData; // imported, so its dimensions are known up front
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
/* The print and the warmer must agree, or warming fetches the wrong
   candidate and the open still waits on a download. */
const TILE_SIZES = "(max-width: 520px) 46vw, (max-width: 860px) 30vw, 176px";
const PRINT_SIZES = "(max-width: 520px) 86vw, 760px";
const PRINT_QUALITY = 90;

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

/* Photos already decoded once at a given size. Re-opening a print should
   show it outright rather than replaying the blur — the bytes are in the
   browser cache, only the component remounted. Lives in a ref so it
   survives the viewer unmounting. */
type Seen = { current: Set<string> };

/* The real photo fades in on top of its own blur placeholder, which stays
   fully opaque underneath — so the two never cross-dissolve through to
   the background. Next's built-in placeholder is dropped in one frame,
   which is the hard cut this replaces. */
function SoftPhoto({
  photo,
  role,
  sizes,
  quality,
  preload,
  eager,
  seen,
}: {
  photo: Photo;
  role: "tile" | "print";
  sizes: string;
  quality?: number;
  preload?: boolean;
  eager?: boolean;
  seen: Seen;
}) {
  const key = `${photo.src.src}@${role}`;
  const [ready, setReady] = useState(() => seen.current.has(key));
  const img = useRef<HTMLImageElement>(null);

  /* A cached image can finish decoding before React attaches onLoad —
     on a warm reload that is the common case — and the event is simply
     never delivered. Without this the photo would stay at opacity 0. */
  useEffect(() => {
    if (!ready && img.current?.complete) {
      seen.current.add(key);
      setReady(true);
    }
  }, [ready, key, seen]);

  return (
    <>
      {photo.src.blurDataURL && (
        <span
          aria-hidden="true"
          className={styles.blurLayer}
          style={{ backgroundImage: `url("${photo.src.blurDataURL}")` }}
        />
      )}
      <Image
        ref={img}
        src={photo.src}
        alt={role === "print" ? photo.alt : ""}
        fill
        sizes={sizes}
        quality={quality}
        preload={preload}
        loading={eager ? "eager" : undefined}
        draggable={false}
        className={styles.img}
        data-ready={ready || undefined}
        onLoad={() => {
          seen.current.add(key);
          setReady(true);
        }}
      />
    </>
  );
}

/* A full-size print is ~600KB at retina, so pulling all sixteen down on
   spec would cost several megabytes to save a wait the reader may never
   have. Instead the queue is small and earned: the first few once the
   browser goes idle, and any frame the pointer or keyboard lands on,
   which is the best possible guess at the next click. Skipped outright
   on metered or very slow connections. */
const IDLE_WARM = 4;

function useWarmQueue(total: number) {
  const [queue, setQueue] = useState<number[]>([]);

  const warm = useCallback((...indexes: number[]) => {
    setQueue((current) => {
      const next = indexes.filter((i) => i < total && !current.includes(i));
      return next.length ? [...current, ...next] : current;
    });
  }, [total]);

  useEffect(() => {
    type Conn = { saveData?: boolean; effectiveType?: string };
    const link = (navigator as Navigator & { connection?: Conn }).connection;
    if (link?.saveData || (link?.effectiveType && /2g$/.test(link.effectiveType))) return;

    let cancelled = false;
    const start = () => {
      if (!cancelled) warm(...Array.from({ length: IDLE_WARM }, (_, i) => i));
    };
    const canIdle = typeof window.requestIdleCallback === "function";
    const handle = canIdle
      ? window.requestIdleCallback(start, { timeout: 2500 })
      : window.setTimeout(start, 1200);
    return () => {
      cancelled = true;
      if (canIdle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, [warm]);

  return { queue, warm };
}

/* Present to the network, invisible to everyone else. `sizes` decides
   which candidate is fetched, so a 1px box still warms the right one. */
function Warm({
  photos,
  queue,
  sizes,
  quality,
  seen,
}: {
  photos: Photo[];
  queue: number[];
  sizes: string;
  quality: number;
  seen: Seen;
}) {
  return (
    <span aria-hidden="true" className={styles.warm}>
      {queue.map((index) => {
        const photo = photos[index];
        return photo ? (
          <Image
            key={photo.src.src}
            src={photo.src}
            alt=""
            fill
            sizes={sizes}
            quality={quality}
            loading="eager"
            /* Warming fetches the same variant the print asks for, so a
               photo that arrived this way is already seen: opening it
               should show the photo outright, not replay the blur. */
            onLoad={() => seen.current.add(`${photo.src.src}@print`)}
          />
        ) : null;
      })}
    </span>
  );
}

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
  const seen = useRef<Set<string>>(new Set());
  const { queue, warm } = useWarmQueue(photos.length);
  const open = viewer?.phase === "open";
  const viewing = viewer !== null;
  const transition = reduced ? { duration: 0 } : spring;

  function show(index: number, button: HTMLButtonElement) {
    if (viewer) return;
    const photo = photos[index];
    const ratio = photo.src.width / photo.src.height;
    setViewer({
      index,
      ratio,
      from: rect(button),
      to: fit(ratio, Boolean(photo.caption)),
      phase: "open",
    });
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
    tiles.current[viewer.index]?.focus({ preventScroll: true });
    setViewer(null);
  }

  const photo = viewer ? photos[viewer.index] : null;

  return (
    <>
      <ul className={styles.grid} style={{ gap: open ? 24 : 8 }}>
        {photos.map((item, index) => {
          const lifted = viewer?.index === index;
          const dimmed = open && !lifted;
          return (
            <li
              key={item.src.src}
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
                data-lifted={lifted || undefined}
                data-dimmed={dimmed || undefined}
                transition={transition}
                onClick={(event) => show(index, event.currentTarget)}
                onPointerEnter={() => warm(index)}
                onFocus={() => warm(index)}
                aria-label={`Open photo ${index + 1}: ${item.alt}`}
                tabIndex={viewing ? -1 : 0}
              >
                <SoftPhoto
                  photo={item}
                  role="tile"
                  sizes={TILE_SIZES}
                  preload={index < 4}
                  seen={seen}
                />
              </motion.button>
            </li>
          );
        })}
      </ul>

      <Warm
        photos={photos}
        queue={queue}
        sizes={PRINT_SIZES}
        quality={PRINT_QUALITY}
        seen={seen}
      />

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
            <SoftPhoto
              photo={photo}
              role="print"
              sizes={PRINT_SIZES}
              quality={PRINT_QUALITY}
              eager
              seen={seen}
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
              key={photo.src.src}
              className={styles.caption}
              style={{ top: viewer.to.top + viewer.to.height + 16, width: viewer.to.width }}
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
