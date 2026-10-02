"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import BackLink from "../BackLink";
import useReducedMotionPreference from "../useReducedMotionPreference";
import { SHORT_LANG, tools, toolsIntro, updatedLabel } from "@/lib/tools";
import Icon from "./Icon";
import PetalBurst, { PETAL_BURST_DURATION } from "./PetalBurst";
import styles from "./tools.module.css";

/**
 * The tools, as a directory listing.
 *
 * The rows print themselves in a line at a time. Clicking one breathes
 * it open in place, its cover, the longer story, and the ways in, on
 * the same fold the homepage chapters use. One entry is open at a time,
 * so the listing never grows past the length of itself plus one.
 *
 * The fold is driven by a click rather than a hover on purpose: an entry
 * that opened under the pointer would push the rest of the listing down,
 * out from under the very pointer that was choosing it.
 *
 * The ones I sell are marked three ways, none of them a badge saying so:
 * a tile in front of the name, the price at the end of the description,
 * and a soft band of light that crosses the row and loops. The row
 * itself is painted nothing at rest, because any grey still enough to
 * sit there is a grey some other state already owns; the light is what
 * a hover can never be mistaken for, since nothing else here moves on
 * its own.
 */
export default function ToolsList() {
  /* -1 until a pointer or an arrow key says otherwise: nothing on the
     page should look chosen before anyone has chosen it. */
  const [cursor, setCursor] = useState(-1);
  const [typing, setTyping] = useState(true);
  const [open, setOpen] = useState<string | null>(null);
  const [petalBurst, setPetalBurst] = useState(false);
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  const petalMark = useRef<HTMLSpanElement>(null);
  const petalFrame = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotionPreference();

  const celebratePetal = () => {
    if (reducedMotion || petalBurst || !petalMark.current || !petalFrame.current) return;
    // Measure once per burst, using the stable slot rather than the animated
    // icon. This also follows wrapped rows and larger text on small screens.
    const mark = petalMark.current.getBoundingClientRect();
    const frame = petalFrame.current.getBoundingClientRect();
    petalFrame.current.style.setProperty("--burst-x", `${mark.left + mark.width / 2 - frame.left}px`);
    petalFrame.current.style.setProperty("--burst-y", `${mark.top + mark.height / 2 - frame.top}px`);
    setPetalBurst(true);
  };

  // Let a burst finish after the pointer leaves. Repeated entries cannot
  // stack particles or restart it mid-flight, and nothing animates at rest.
  useEffect(() => {
    if (!petalBurst) return;
    const done = window.setTimeout(() => setPetalBurst(false), PETAL_BURST_DURATION);
    return () => window.clearTimeout(done);
  }, [petalBurst]);

  const onListKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;

    if (event.key === "Escape" && open) {
      event.preventDefault();
      const trigger = items.current[tools.findIndex((tool) => tool.name === open)];
      // Return focus before making the detail links inert.
      if (trigger?.closest("li")?.contains(event.target as Node)) {
        trigger.focus();
      }
      setOpen(null);
      return;
    }

    // Navigation belongs to the focused row; links and page scrolling
    // keep their usual keyboard behavior.
    const current = items.current.indexOf(event.target as HTMLButtonElement);
    if (current < 0) return;
    let next: number;
    switch (event.key) {
      case "ArrowDown": next = (current + 1) % tools.length; break;
      case "ArrowUp": next = (current - 1 + tools.length) % tools.length; break;
      case "Home": next = 0; break;
      case "End": next = tools.length - 1; break;
      default: return;
    }
    event.preventDefault();
    setCursor(next);
    setOpen(tools[next].name);
    items.current[next]?.focus();
  };

  /* The listing prints itself in, a line at a time. It starts out
     printing and only ever stops, so nothing has to be set from inside
     the effect. (With reduced motion the print keyframes never run, so
     this just resolves a beat later and changes nothing.) */
  useEffect(() => {
    // Let the final row finish its 420ms reveal after its staggered delay.
    const done = window.setTimeout(() => setTyping(false), 680 + (tools.length - 1) * 70);
    return () => window.clearTimeout(done);
  }, []);

  /* The light a paid row picks up follows the pointer across that row's
     own bar. Its position is written straight onto the button as a
     custom property rather than held in state: a re-render per pointer
     move would cost far more than the paint it is driving. Sitting on
     the button rather than on the whole entry is also what keeps an
     opened fold out of it. */
  const trackLight = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${event.clientX - box.left}px`);
    event.currentTarget.style.setProperty("--my", `${event.clientY - box.top}px`);
  };

  return (
    <main className={styles.stage}>
      <BackLink />

      <div className={styles.column}>
        <h1 className={`${styles.title} rise`} style={{ "--rise-delay": "0.08s" } as CSSProperties}>
          <Icon name="hammer" size={20} className={styles.titleIcon} />
          Tools
        </h1>

        <p className={`${styles.intro} rise`} style={{ "--rise-delay": "0.14s" } as CSSProperties}>
          {toolsIntro}
        </p>

        {/* The column headings, in the page's own type rather than the
            spaced-out capitals they started as. "Tool" is indented past
            the mark's gutter so it stands over the names themselves,
            which is where the column's content begins. */}
        <div
          className={`${styles.legendRow} rise`}
          style={{ "--rise-delay": "0.2s" } as CSSProperties}
          aria-hidden="true"
        >
          <span className={styles.legendName}>Tool</span>
          <span>What it does</span>
          <span className={styles.colLast}>Lang</span>
          <span />
        </div>

        <ul className={styles.rows} onKeyDown={onListKeyDown}>
          {tools.map((tool, i) => {
            const isOpen = open === tool.name;
            const paid = Boolean(tool.price);
            const isPetal = tool.name === "petal.bar";

            return (
              <li
                key={tool.name}
                className={`${styles.item} ${paid ? styles.lit : ""}`}
                data-open={isOpen || undefined}
                style={{ "--line": `${i}` } as CSSProperties}
              >
                <div className={styles.rowFrame} ref={isPetal ? petalFrame : undefined}>
                  <button
                    ref={(element) => {
                      items.current[i] = element;
                    }}
                    type="button"
                    className={`${styles.row} ${paid ? styles.priceRow : ""}`}
                    data-selected={i === cursor || undefined}
                    data-open={isOpen || undefined}
                    data-printing={typing ? "" : undefined}
                    aria-expanded={isOpen}
                    aria-controls={`entry-${tool.name}`}
                    onClick={() => {
                      if (isPetal && !isOpen) celebratePetal();
                      setOpen((prev) => (prev === tool.name ? null : tool.name));
                    }}
                    onPointerMove={paid && !reducedMotion ? trackLight : undefined}
                    onPointerEnter={(event) => {
                      if (event.pointerType === "mouse") {
                        setCursor(i);
                        if (isPetal) celebratePetal();
                      }
                    }}
                    onPointerLeave={(event) => {
                      if (document.activeElement !== event.currentTarget) setCursor(-1);
                    }}
                    onFocus={(event) => {
                      setCursor(i);
                      if (isPetal && event.currentTarget.matches(":focus-visible")) celebratePetal();
                    }}
                    onBlur={() => setCursor(-1)}
                  >
                    {/* Out of flow, so it is not a fifth cell in the row's
                        grid, and clipped to the bar, so the band never runs
                        out into the fold below. */}
                    {paid && <span className={styles.sweep} aria-hidden="true" />}

                    <span className={styles.colName}>
                      {/* Only the ones I sell have artwork, so only they
                          wear a tile. The slot is held open on every row
                          regardless, or the marked names would sit 30px to
                          the right of all the others. */}
                      <span className={styles.markSlot} ref={isPetal ? petalMark : undefined} aria-hidden="true">
                        {paid && (
                          <span className={styles.markTile}>
                            {tool.icon ? (
                              <Image src={tool.icon} alt="" width={22} height={22} className={styles.markArt} />
                            ) : (
                              <span className={styles.markLetter}>{tool.name.charAt(0).toUpperCase()}</span>
                            )}
                          </span>
                        )}
                      </span>
                      <span className={styles.nameText}>{tool.name}</span>
                    </span>

                    <span className={styles.colWhat}>
                      {tool.tagline}
                      {paid && (
                        <>
                          {" "}
                          {/* One unbreakable piece, so a description that
                              wraps on a phone never leaves the separator
                              stranded at the end of a line. */}
                          <span className={styles.priceTail}>
                            <span className={styles.sep} aria-hidden="true">·</span>{" "}
                            <span className={styles.price}>
                              <span className={styles.srOnly}>Paid, </span>
                              {tool.price}
                            </span>
                          </span>
                        </>
                      )}
                    </span>

                    {/* Empty for the ones I sell. The column belongs to the
                        open source rows, which are the ones with a language
                        you could go and read. */}
                    {tool.lang && <span className={styles.colLast}>{SHORT_LANG[tool.lang]}</span>}

                    <Icon name="chevronRight" size={16} className={styles.caret} />
                  </button>

                  {isPetal && petalBurst && !reducedMotion && <PetalBurst />}
                </div>

                {/* Rests folded at nought rows high; opening runs it out
                    to its own height, the way the homepage chapters go. */}
                {/* Closed, the fold is clipped to nothing but its links are
                    still in the document, inert keeps them out of the tab
                    order and the accessibility tree until it opens. */}
                <div
                  className={styles.fold}
                  id={`entry-${tool.name}`}
                  role="region"
                  aria-label={tool.name}
                  inert={!isOpen}
                >
                  <div className={styles.foldInner}>
                    <div className={styles.detail}>
                      {/* A paid entry names no language and carries no
                          date, so its meta line is just what it is for. */}
                      <p className={styles.meta}>
                        {[tool.lang, tool.updated && `updated ${updatedLabel(tool.updated)}`, ...tool.tags]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>

                      <p className={styles.note}>{tool.note}</p>

                      <div className={styles.links}>
                        {tool.repo && (
                          <a className={styles.link} href={tool.repo} target="_blank" rel="noopener noreferrer">
                            <Icon name="github" size={14} className={styles.linkIcon} />
                            Source
                          </a>
                        )}
                        {tool.buy && (
                          <a className={styles.link} href={tool.buy} target="_blank" rel="noopener noreferrer">
                            <Icon name="arrowUpRight" size={14} className={styles.linkIcon} />
                            Visit {tool.name}
                          </a>
                        )}
                        {tool.demo && (
                          <a className={styles.link} href={tool.demo} target="_blank" rel="noopener noreferrer">
                            <Icon name="arrowUpRight" size={14} className={styles.linkIcon} />
                            Live demo
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
