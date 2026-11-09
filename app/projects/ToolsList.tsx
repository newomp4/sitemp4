"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import BackLink from "../BackLink";
import useReducedMotionPreference from "../useReducedMotionPreference";
import { tools, toolsIntro, updatedLabel } from "@/lib/tools";
import { AppMark, PriceTail, flourishes, trackLight } from "./apps";
import Icon from "./Icon";
import { ID4_BURST_DURATION } from "./ID4Burst";
import { PETAL_BURST_DURATION } from "./PetalBurst";
import styles from "./tools.module.css";
import useBurst from "./useBurst";

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
 * The apps are marked three ways, none of them a badge saying so: a tile
 * in front of the name, the price at the end of the description, and a
 * soft band of light that crosses the row and loops. The row
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
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  const stage = useRef<HTMLElement>(null);
  const column = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotionPreference();
  const petalBurst = useBurst(PETAL_BURST_DURATION, reducedMotion);
  const id4Burst = useBurst(ID4_BURST_DURATION, reducedMotion);

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

  /* Pin the column where centring puts it at rest (see .stage[data-pinned]).
     Unpinning, measuring and pinning again happen in one go, so nothing
     moves on screen. It is measured again once the fonts are in and on
     resize, but never while an entry is open, since that is exactly the
     height it must not re-centre for. */
  useEffect(() => {
    const el = stage.current;
    const col = column.current;
    if (!el || !col) return;
    const pin = () => {
      if (el.querySelector("li[data-open]")) return;
      delete el.dataset.pinned;
      const top = col.offsetTop - parseFloat(getComputedStyle(el).paddingTop);
      el.style.setProperty("--rest-top", `${Math.max(0, top)}px`);
      el.dataset.pinned = "";
    };
    pin();
    let frame = 0;
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(pin);
    };
    let live = true;
    document.fonts?.ready.then(() => { if (live) pin(); });
    window.addEventListener("resize", onResize);
    return () => {
      live = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <main ref={stage} className={styles.stage}>
      <BackLink />

      <div ref={column} className={styles.column}>
        <h1 className={`${styles.title} rise`} style={{ "--rise-delay": "0.08s" } as CSSProperties}>
          <Icon name="hammer" size={20} className={styles.titleIcon} />
          Projects
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
          <span />
        </div>

        <ul className={styles.rows} onKeyDown={onListKeyDown}>
          {tools.map((tool, i) => {
            const isOpen = open === tool.name;
            const app = Boolean(tool.price);
            const burst = tool.name === "Petal" ? petalBurst : tool.name === "ID4" ? id4Burst : undefined;
            const Flourish = flourishes[tool.name]?.Burst;

            return (
              <li
                key={tool.name}
                className={`${styles.item} ${app ? styles.lit : ""}`}
                data-open={isOpen || undefined}
                style={{ "--line": `${i}` } as CSSProperties}
              >
                <div className={styles.rowFrame} ref={burst?.frame} data-bursting={burst?.playing || undefined}>
                  <button
                    ref={(element) => {
                      items.current[i] = element;
                    }}
                    type="button"
                    className={styles.row}
                    data-selected={i === cursor || undefined}
                    data-open={isOpen || undefined}
                    data-printing={typing ? "" : undefined}
                    aria-expanded={isOpen}
                    aria-controls={`entry-${tool.name}`}
                    onClick={() => {
                      if (!isOpen) burst?.play();
                      setOpen((prev) => (prev === tool.name ? null : tool.name));
                    }}
                    // The light sits on the button rather than the whole
                    // entry, which is what keeps an opened fold out of it.
                    onPointerMove={app && !reducedMotion ? trackLight : undefined}
                    onPointerEnter={(event) => {
                      if (event.pointerType === "mouse") {
                        setCursor(i);
                        burst?.play();
                      }
                    }}
                    onPointerLeave={(event) => {
                      if (document.activeElement !== event.currentTarget) setCursor(-1);
                    }}
                    onFocus={(event) => {
                      setCursor(i);
                      // Not when focus is coming back from the row's own
                      // entry (Escape, or Shift+Tab out of its links): that
                      // is the entry closing, not someone arriving.
                      const fromEntry = event.currentTarget.closest("li")?.contains(event.relatedTarget as Node | null);
                      if (!fromEntry && event.currentTarget.matches(":focus-visible")) burst?.play();
                    }}
                    onBlur={() => setCursor(-1)}
                  >
                    {/* Out of flow, so it is not a cell in the row's
                        grid, and clipped to the bar, so the band never runs
                        out into the fold below. */}
                    {app && <span className={styles.sweep} aria-hidden="true" />}

                    <span className={styles.colName}>
                      {/* Only the apps have artwork, so only they wear a
                          tile. The slot is held open on every row regardless,
                          or the marked names would sit 30px to the right of
                          all the others. */}
                      <span className={styles.markSlot} ref={burst?.mark} aria-hidden="true">
                        {app && (
                          <span className={styles.markTile}>
                            <AppMark tool={tool} />
                          </span>
                        )}
                      </span>
                      <span className={styles.nameText}>{tool.name}</span>
                    </span>

                    <span className={styles.colWhat}>
                      {tool.tagline}
                      {tool.price && (
                        <>
                          {" "}
                          <PriceTail price={tool.price} />
                        </>
                      )}
                    </span>


                    <Icon name="chevronRight" size={16} className={styles.caret} />
                  </button>

                  {burst?.playing && Flourish && <Flourish />}
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
                      {/* An app names no language and carries no date, so
                          its meta line is just what it is for. */}
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
                        {tool.site && (
                          <a className={styles.link} href={tool.site} target="_blank" rel="noopener noreferrer">
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
