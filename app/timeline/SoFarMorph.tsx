"use client";

/**
 * TEST — "So far" with hand-rolled shared-element flight.
 * On toggle: source rects are measured at click time, target rects the
 * moment the destination layer mounts, and visual clones of each chip +
 * title fly point-to-point on a single tween while the layers crossfade
 * and the container height glides. The real elements swap in the frame
 * the clones land.
 *
 * Hardened after adversarial review: flights are cancellable (a
 * breakpoint flip mid-flight settles cleanly), height retargets when the
 * orientation changes at rest, the list height is measured off the list
 * layer itself, labels never fade underneath a landing ghost, rows keep
 * production's tap/keyboard fold behavior, the hidden layer is inert,
 * and prefers-reduced-motion swaps every animation for instant states.
 */

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import Image from "next/image";
import {
  animate,
  AnimatePresence,
  motion,
  MotionConfig,
  type AnimationPlaybackControls,
} from "motion/react";
import { path } from "@/lib/content";
import styles from "../styles.module.css";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const FLY_S = 0.62;
const LINE_H = 210;

/* Real spans per chapter (index-aligned with `path`, newest first) */
const AXIS_START = 2021.5;
const AXIS_END = 2026.65;
const META: { start: number; level: 0 | 1 | 2; anchor?: "right" }[] = [
  { start: 2026.2, level: 0, anchor: "right" },
  { start: 2025.7, level: 2, anchor: "right" },
  { start: 2025.4, level: 1, anchor: "right" },
  { start: 2024.0, level: 0 },
  { start: 2023.0, level: 0 },
  { start: 2021.5, level: 0 },
];
const pos = (t: number) => ((t - AXIS_START) / (AXIS_END - AXIS_START)) * 100;
/* Dots and leaders clamp off the hard left edge so the first dot,
   sitting exactly at the axis origin, isn't cut in half */
const dotPos = (t: number) => Math.max(pos(t), 0.6);
const LABEL_TOP = [44, 100, 156];

/* Vertical (mobile) layout: proportional years down a left rail, with a
   minimum gap so the 2025-26 cluster stays readable. Precomputed. */
const V_SPAN = 380;
const V_GAP = 50;
const V_Y = (() => {
  const raw = META.map(
    (m) => ((AXIS_END - m.start) / (AXIS_END - AXIS_START)) * V_SPAN,
  );
  for (let i = 1; i < raw.length; i++) raw[i] = Math.max(raw[i], raw[i - 1] + V_GAP);
  return raw;
})();
const V_H = V_Y[V_Y.length - 1] + 56;

const mq = (query: string) => ({
  subscribe: (cb: () => void) => {
    const m = window.matchMedia(query);
    m.addEventListener("change", cb);
    return () => m.removeEventListener("change", cb);
  },
  get: () => window.matchMedia(query).matches,
});
const narrowMq = mq("(max-width: 639px)");
const reduceMq = mq("(prefers-reduced-motion: reduce)");

const shortYears = (y: string) =>
  y.replace(" – present", " – now").replace("– 2023", "til 2023");

function richText(text: string) {
  const parts: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(
      <a
        key={m.index}
        href={m[2]}
        {...(m[2].startsWith("http")
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        className={styles.captionLink}
      >
        {m[1]}
      </a>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function Chip({ item }: { item: (typeof path)[number] }) {
  if (!item.logo) return null;
  return (
    <span
      className={`inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center overflow-hidden border border-[#262626] bg-[#1B1B1B] ${
        item.logoShape === "circle" ? "rounded-full" : "rounded-[5px]"
      }`}
    >
      <Image src={item.logo} alt="" width={22} height={22} className="h-full w-full object-cover" />
    </span>
  );
}

/* The clock: color brightens on hover; one slow quarter-turn of the
   hand when the timeline opens, back when it closes. Nothing else. */
function ClockIcon({ line }: { line: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 5.75C3 4.23122 4.23122 3 5.75 3H18.25C19.7688 3 21 4.23122 21 5.75V18.25C21 19.7688 19.7688 21 18.25 21H5.75C4.23122 21 3 19.7688 3 18.25V5.75ZM12 6.375C8.8934 6.375 6.375 8.8934 6.375 12C6.375 15.1066 8.8934 17.625 12 17.625C15.1066 17.625 17.625 15.1066 17.625 12C17.625 8.8934 15.1066 6.375 12 6.375Z"
        fill="currentColor"
      />
      <motion.g
        style={{ transformBox: "view-box", transformOrigin: "12px 12px" }}
        animate={{ rotate: line ? 90 : 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <path
          d="M12 9C12.4142 9 12.75 9.33579 12.75 9.75V11.6893L14.2803 13.2197C14.5732 13.5126 14.5732 13.9874 14.2803 14.2803C13.9874 14.5732 13.5126 14.5732 13.2197 14.2803L11.4697 12.5303C11.329 12.3897 11.25 12.1989 11.25 12V9.75C11.25 9.33579 11.5858 9 12 9Z"
          fill="currentColor"
        />
      </motion.g>
    </svg>
  );
}

/* One list row with FoldRow's exact touch/keyboard behavior: on touch a
   first tap unfolds (and arms the link), taps inside the note never
   toggle, and linkless rows are focusable so keyboards can unfold too. */
function ListRow({
  item,
  heading,
  note,
}: {
  item: (typeof path)[number];
  heading: ReactNode;
  note: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const onRowClick = (e: React.MouseEvent) => {
    // Hover-capable devices are handled purely by CSS
    if (window.matchMedia("(hover: hover)").matches) return;
    if ((e.target as Element).closest("[data-note]")) return;
    if (!item.href) {
      setOpen((o) => !o);
      return;
    }
    if (!open) {
      e.preventDefault(); // first tap opens instead of navigating
      setOpen(true);
    }
    // already open: let the title link navigate
  };

  return (
    <li
      id={item.anchor}
      data-open={String(open)}
      {...(item.href ? (item.anchor ? { tabIndex: -1 } : {}) : { tabIndex: 0 })}
    >
      <div
        className="grid grid-cols-[112px_1fr] gap-x-4 max-sm:grid-cols-1"
        onClick={onRowClick}
      >
        <p className="text-[12px] leading-6 tracking-[0.01em] text-[#7D7D7D] max-sm:mb-0.5 max-sm:leading-4">
          {item.years}
        </p>
        <div>
          {heading}
          {note && (
            <div className={styles.noteWrap} data-note>
              <div className={styles.noteInner}>{note}</div>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

type Rects = { chip: DOMRect | null; title: DOMRect | null }[];

export default function SoFarMorph() {
  const [mode, setMode] = useState<"list" | "line">("list");
  const [epoch, setEpoch] = useState(0); // remounts the target layer so its build-in replays
  const [height, setHeight] = useState<number | "auto">("auto");
  const narrow = useSyncExternalStore(narrowMq.subscribe, narrowMq.get, () => false);
  const reduce = useSyncExternalStore(reduceMq.subscribe, reduceMq.get, () => false);
  const line = mode === "line";
  const years = [2022, 2023, 2024, 2025, 2026];

  const wrapRef = useRef<HTMLDivElement>(null);
  const listLayerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const listChip = useRef<(HTMLElement | null)[]>([]);
  const listTitle = useRef<(HTMLElement | null)[]>([]);
  const lineChip = useRef<(HTMLElement | null)[]>([]);
  const lineTitle = useRef<(HTMLElement | null)[]>([]);
  const srcRects = useRef<Rects | null>(null);
  const busy = useRef(false);
  const releaseTimer = useRef<number | null>(null);

  const toggle = () => {
    if (busy.current) return;
    busy.current = true;
    if (releaseTimer.current !== null) {
      window.clearTimeout(releaseTimer.current);
      releaseTimer.current = null;
    }
    const src = mode === "list" ? { c: listChip, t: listTitle } : { c: lineChip, t: lineTitle };
    srcRects.current = path.map((_, i) => ({
      chip: src.c.current[i]?.getBoundingClientRect() ?? null,
      title: src.t.current[i]?.getBoundingClientRect() ?? null,
    }));
    const cur = wrapRef.current?.offsetHeight;
    if (cur) setHeight(cur);
    setMode(mode === "list" ? "line" : "list");
    setEpoch((e) => e + 1);
  };

  /* Orientation changes while resting in line mode retarget the height —
     without this the container keeps the other layout's height and
     either clips the rail or floats it over a dead gap */
  useEffect(() => {
    if (mode === "line" && !busy.current) {
      setHeight(narrow ? V_H : LINE_H);
    }
  }, [narrow, mode]);

  useEffect(
    () => () => {
      if (releaseTimer.current !== null) window.clearTimeout(releaseTimer.current);
    },
    [],
  );

  /* The flight: runs right after the destination layer mounts. Its
     cleanup settles everything it started, so an orientation flip (or
     unmount) mid-flight can't strand ghosts or hidden elements. */
  useLayoutEffect(() => {
    const src = srcRects.current;
    if (!src) return;
    srcRects.current = null;
    const overlay = overlayRef.current;
    const wrap = wrapRef.current;
    if (!overlay || !wrap) return;

    const toLine = mode === "line";
    const from = toLine ? { c: listChip, t: listTitle } : { c: lineChip, t: lineTitle };
    const to = toLine ? { c: lineChip, t: lineTitle } : { c: listChip, t: listTitle };

    const settle = () => {
      overlay.replaceChildren();
      [...listChip.current, ...listTitle.current, ...lineChip.current, ...lineTitle.current].forEach(
        (el) => {
          if (el) el.style.opacity = "";
        },
      );
      busy.current = false;
    };

    /* The list target comes from the list layer itself: the wrap's
       scrollHeight is floored by its own pinned inline height and
       inflated by the exiting absolute timeline layer */
    const targetHeight = () =>
      toLine
        ? narrow
          ? V_H
          : LINE_H
        : (listLayerRef.current?.scrollHeight ?? LINE_H);

    /* Reduced motion: no flights, no glide — states just are */
    if (reduce) {
      setHeight(targetHeight());
      if (!toLine) {
        releaseTimer.current = window.setTimeout(() => setHeight("auto"), 50);
      }
      settle();
      return;
    }

    const base = overlay.getBoundingClientRect();
    // glide the container to the destination height; timer (not
    // onAnimationComplete) releases list mode to auto so the fold-open
    // rows can grow even when the height value happens not to change
    const raf = requestAnimationFrame(() => {
      setHeight(targetHeight());
      if (!toLine) {
        releaseTimer.current = window.setTimeout(
          () => setHeight("auto"),
          FLY_S * 1000 + 80,
        );
      }
    });

    const controls: AnimationPlaybackControls[] = [];
    const flights: Promise<unknown>[] = [];
    path.forEach((_, i) => {
      (["chip", "title"] as const).forEach((k) => {
        const fromEl = (k === "chip" ? from.c : from.t).current[i];
        const toEl = (k === "chip" ? to.c : to.t).current[i];
        const s = src[i][k];
        if (!fromEl || !toEl || !s) return;
        const t = toEl.getBoundingClientRect();
        const ghost = fromEl.cloneNode(true) as HTMLElement;
        const cs = getComputedStyle(fromEl);
        Object.assign(ghost.style, {
          font: cs.font,
          fontWeight: cs.fontWeight,
          fontSize: cs.fontSize,
          lineHeight: cs.lineHeight,
          letterSpacing: cs.letterSpacing,
          color: cs.color,
          whiteSpace: "nowrap",
          position: "absolute",
          left: `${s.left - base.left}px`,
          top: `${s.top - base.top}px`,
          width: `${s.width}px`,
          height: `${s.height}px`,
          margin: "0",
          transformOrigin: "top left",
          willChange: "transform",
        });
        overlay.appendChild(ghost);
        fromEl.style.opacity = "0";
        toEl.style.opacity = "0";
        const ctrl = animate(
          ghost,
          { transform: `translate(${t.left - s.left}px, ${t.top - s.top}px)` },
          { duration: FLY_S, ease: EASE },
        );
        controls.push(ctrl);
        flights.push(
          ctrl.finished.then(() => {
            toEl.style.opacity = "";
            ghost.remove();
          }),
        );
      });
    });

    let done = false;
    Promise.allSettled(flights).then(() => {
      if (done) return;
      done = true;
      settle();
    });

    return () => {
      cancelAnimationFrame(raf);
      if (!done) {
        done = true;
        controls.forEach((c) => c.stop());
        settle();
      }
    };
  }, [mode, epoch, narrow, reduce]);

  return (
    <MotionConfig reducedMotion="user">
    <div className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={line}
        className="group mb-5 flex cursor-pointer items-center gap-2 text-[14px] font-semibold text-[#F5F5F5]"
      >
        <span
          className={`transition-colors duration-300 ${
            line ? "text-[#F5F5F5]" : "text-[#7D7D7D] group-hover:text-[#D4D4D4]"
          }`}
        >
          <ClockIcon line={line} />
        </span>
        So far
        <span className="sr-only">
          {line ? "(shown as timeline, press for list)" : "(shown as list, press for timeline)"}
        </span>
      </button>

      <motion.div
        ref={wrapRef}
        animate={{ height }}
        transition={{ duration: reduce ? 0 : FLY_S, ease: EASE }}
        className="relative overflow-hidden"
      >
        {/* ── List layer ── */}
        <motion.div
          key="list-layer"
          ref={listLayerRef}
          animate={{ opacity: line ? 0 : 1 }}
          initial={false}
          transition={{ duration: line ? 0.2 : 0.35, ease: "easeOut", delay: line ? 0 : 0.05 }}
          className={line ? "pointer-events-none" : ""}
          aria-hidden={line || undefined}
          inert={line || undefined}
        >
          <ul className={`${styles.list} space-y-5`}>
            {path.map((item, i) => {
              const external = item.href
                ? (item.external ?? /^https?:/.test(item.href))
                : false;
              const heading = (
                <h3 className="text-[16px] leading-6 font-semibold text-[#F5F5F5]">
                  {item.logo && (
                    <span ref={(el) => void (listChip.current[i] = el)} className="mr-2.5 inline-block align-[-5px]">
                      <Chip item={item} />
                    </span>
                  )}
                  <span ref={(el) => void (listTitle.current[i] = el)} className={`${styles.title} inline-block`}>
                    {item.title}
                  </span>
                  {item.role && (
                    <span className="font-normal text-[#A3A3A3]"> · {item.role}</span>
                  )}
                  {item.href && (
                    <>
                      {" "}
                      <span aria-hidden="true" className={`${styles.arrow} inline-block text-[#A3A3A3]`}>
                        ↗
                      </span>
                    </>
                  )}
                </h3>
              );
              return (
                <ListRow
                  key={item.title}
                  item={item}
                  heading={
                    item.href ? (
                      <a
                        href={item.href}
                        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="block"
                      >
                        {heading}
                      </a>
                    ) : (
                      heading
                    )
                  }
                  note={
                    item.note ? (
                      <p className="pt-1 text-[14px] leading-relaxed text-[#8A8A8A]">
                        {richText(item.note)}
                      </p>
                    ) : null
                  }
                />
              );
            })}
          </ul>
        </motion.div>

        {/* ── Timeline layer ── */}
        <AnimatePresence>
        {line && (
          <motion.div
            key={`line-${epoch}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
            className="absolute inset-x-0 top-0"
            style={{ height: narrow ? V_H : LINE_H }}
          >
          {narrow ? (
            /* ── Vertical timeline (mobile): rail left, chapters beside ── */
            <div className="relative h-full">
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1, transition: { duration: 0.7, ease: EASE } }}
                className="absolute top-1 bottom-4 left-[3px] w-px origin-top bg-[#2A2A2A]"
              />
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1, transition: { delay: 0.1, duration: 0.3, ease: EASE } }}
                className="absolute top-0 left-[1px] block h-[5px] w-[5px] rounded-full bg-[#F5F5F5]"
              />
              {path.map((item, i) => (
                <div key={item.title}>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, transition: { delay: 0.15 + i * 0.06, duration: 0.3, ease: EASE } }}
                    className={`absolute left-0 block h-[7px] w-[7px] rounded-full ${
                      i === 0 ? "bg-[#F5F5F5]" : "bg-[#3F3F3F]"
                    }`}
                    style={{ top: V_Y[i] + 9 }}
                  />
                  {/* the label block itself never fades — its chip/title
                      appear exactly when the ghosts land */}
                  <div className="absolute left-6" style={{ top: V_Y[i] }}>
                    <div className="flex items-center gap-2.5 whitespace-nowrap">
                      {item.logo && (
                        <span ref={(el) => void (lineChip.current[i] = el)} className="inline-block">
                          <Chip item={item} />
                        </span>
                      )}
                      <span ref={(el) => void (lineTitle.current[i] = el)} className="text-[16px] leading-6 font-semibold text-[#F5F5F5]">
                        {item.title}
                      </span>
                    </div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: 0.25 + i * 0.05, duration: 0.4 } }}
                      className="mt-0.5 text-[11px] leading-4 text-[#7D7D7D]"
                    >
                      {shortYears(item.years)}
                    </motion.p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
          <div className="relative h-full">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1, transition: { duration: 0.7, ease: EASE } }}
              className="absolute top-[3px] right-0 left-0 h-px origin-left bg-[#2A2A2A]"
            />
            {years.map((y, yi) => (
              <motion.div
                key={y}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.2 + yi * 0.05, duration: 0.4 } }}
                className="absolute top-0"
                style={{ left: `${pos(y)}%` }}
              >
                <span className="block h-[7px] w-px bg-[#242424]" />
                <span className="mt-1.5 block -translate-x-1/2 text-[10px] text-[#4A4A4A]">{y}</span>
              </motion.div>
            ))}
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1, transition: { delay: 0.4, duration: 0.3, ease: EASE } }}
              className="absolute top-[1px] right-0 block h-[5px] w-[5px] rounded-full bg-[#F5F5F5]"
            />
            {path.map((item, i) => {
              const m = META[i];
              const left = dotPos(m.start);
              return (
                <div key={item.title}>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, transition: { delay: 0.15 + i * 0.05, duration: 0.3, ease: EASE } }}
                    className={`absolute top-0 block h-[7px] w-[7px] -translate-x-1/2 rounded-full ${
                      i === 0 ? "bg-[#F5F5F5]" : "bg-[#3F3F3F]"
                    }`}
                    style={{ left: `${left}%` }}
                  />
                  <motion.span
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 1, scaleY: 1, transition: { delay: 0.25 + i * 0.05, duration: 0.35, ease: EASE } }}
                    className="absolute w-px origin-top bg-[#242424]"
                    style={{ left: `${left}%`, top: 10, height: LABEL_TOP[m.level] - 14 }}
                  />
                  {/* label — no transforms, so its rects are exact at
                      mount; opaque and above the leaders so lines never
                      cross text; never fades, so its chip/title appear
                      exactly when the ghosts land */}
                  <div
                    className="absolute z-10 bg-[#111111] pb-0.5"
                    style={{
                      top: LABEL_TOP[m.level],
                      left: m.anchor === "right" ? undefined : `${pos(m.start)}%`,
                      right: m.anchor === "right" ? 0 : undefined,
                      marginLeft:
                        m.anchor === "right" ? undefined : pos(m.start) < 4 ? 0 : -8,
                    }}
                  >
                    <div className="flex items-center gap-2.5 whitespace-nowrap">
                      {item.logo && (
                        <span ref={(el) => void (lineChip.current[i] = el)} className="inline-block">
                          <Chip item={item} />
                        </span>
                      )}
                      <span ref={(el) => void (lineTitle.current[i] = el)} className="text-[16px] leading-6 font-semibold text-[#F5F5F5]">
                        {item.title}
                      </span>
                    </div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: 0.25 + i * 0.05, duration: 0.4 } }}
                      className={`mt-1.5 text-[11px] leading-4 whitespace-nowrap text-[#7D7D7D] ${
                        m.anchor === "right" ? "text-right" : ""
                      }`}
                    >
                      {shortYears(item.years)}
                    </motion.p>
                  </div>
                </div>
              );
            })}
          </div>
          )}
          </motion.div>
        )}
        </AnimatePresence>
      </motion.div>

      {/* ── Flight overlay: outside the clipped container so ghosts are
          never cut off mid-flight ── */}
      <div ref={overlayRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-20" />
    </div>
    </MotionConfig>
  );
}
