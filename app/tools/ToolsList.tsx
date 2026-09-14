"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import BackLink from "../BackLink";
import { SHORT_LANG, tools, toolsIntro, updatedLabel } from "@/lib/tools";
import Icon from "./Icon";
import styles from "./tools.module.css";

/**
 * The tools, as a directory listing.
 *
 * The rows print themselves in a line at a time. Clicking one breathes
 * it open in place — its cover, the longer story, and the ways in — on
 * the same fold the homepage chapters use. One entry is open at a time,
 * so the listing never grows past the length of itself plus one.
 *
 * The fold is driven by a click rather than a hover on purpose: an entry
 * that opened under the pointer would push the rest of the listing down,
 * out from under the very pointer that was choosing it.
 */
export default function ToolsList() {
  /* -1 until a pointer or an arrow key says otherwise: nothing on the
     page should look chosen before anyone has chosen it. */
  const [cursor, setCursor] = useState(-1);
  const [typing, setTyping] = useState(true);
  const [open, setOpen] = useState<string | null>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      if (event.key === "Escape" && open) {
        setOpen(null);
        return;
      }

      const step = event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0;
      if (!step) return;
      event.preventDefault();
      const next =
        cursor < 0 ? (step > 0 ? 0 : tools.length - 1) : (cursor + step + tools.length) % tools.length;
      setCursor(next);
      /* An arrow key opens as it goes: walking the listing reads every
         entry in turn rather than only moving a highlight over them. */
      setOpen(tools[next].name);
      items.current[next]?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cursor, open]);

  /* The listing prints itself in, a line at a time. It starts out
     printing and only ever stops, so nothing has to be set from inside
     the effect. (With reduced motion the print keyframes never run, so
     this just resolves a beat later and changes nothing.) */
  useEffect(() => {
    const done = window.setTimeout(() => setTyping(false), 340 + tools.length * 70);
    return () => window.clearTimeout(done);
  }, []);

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
            spaced-out capitals they started as. */}
        <div
          className={`${styles.legendRow} rise`}
          style={{ "--rise-delay": "0.2s" } as CSSProperties}
          aria-hidden="true"
        >
          <span>Tool</span>
          <span>What it does</span>
          <span className={styles.colLang}>Lang</span>
          <span />
        </div>

        <ul className={styles.rows}>
          {tools.map((tool, i) => {
            const isOpen = open === tool.name;
            return (
              <li
                key={tool.name}
                className={styles.item}
                data-open={isOpen || undefined}
                style={{ "--line": `${i}` } as CSSProperties}
              >
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
                  onClick={() => setOpen((prev) => (prev === tool.name ? null : tool.name))}
                  onPointerEnter={(event) => {
                    if (event.pointerType === "mouse") setCursor(i);
                  }}
                  onFocus={() => setCursor(i)}
                >
                  <span className={styles.colName}>{tool.name}</span>
                  <span className={styles.colWhat}>{tool.tagline}</span>
                  <span className={styles.colLang}>{SHORT_LANG[tool.lang]}</span>
                  <Icon name="chevronRight" size={16} className={styles.caret} />
                </button>

                {/* Rests folded at nought rows high; opening runs it out
                    to its own height, the way the homepage chapters go. */}
                {/* Closed, the fold is clipped to nothing but its links are
                    still in the document — inert keeps them out of the tab
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
                      <p className={styles.meta}>
                        {tool.lang} · updated {updatedLabel(tool.updated)} · {tool.tags.join(" · ")}
                      </p>

                      <p className={styles.note}>{tool.note}</p>

                      <div className={styles.links}>
                        <a className={styles.link} href={tool.repo} target="_blank" rel="noopener noreferrer">
                          <Icon name="github" size={14} className={styles.linkIcon} />
                          Source
                        </a>
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
