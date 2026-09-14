"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";
import BackLink from "../../BackLink";
import useReducedMotionPreference from "../../useReducedMotionPreference";
import { SHORT_LANG, github, tools, updatedLabel } from "@/lib/tools";
import styles from "./register.module.css";

/**
 * CONCEPT 4 — "Register".
 *
 * A directory listing. The rows print in, one line at a time, and the
 * caret is left blinking at the end like something is waiting for you.
 * It is: ↑↓ walks the list, ⏎ opens the source, d opens the live one,
 * and / filters — rows slide out of the way as the list narrows rather
 * than snapping to their new places.
 */
export default function Register() {
  const reduced = useReducedMotionPreference();
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const [typing, setTyping] = useState(true);
  const filter = useRef<HTMLInputElement>(null);

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return tools;
    return tools.filter((tool) =>
      [tool.name, tool.tagline, tool.lang, ...tool.tags].join(" ").toLowerCase().includes(needle),
    );
  }, [query]);

  /* A narrowing list must never leave the cursor pointing past its end. */
  const selected = rows.length ? Math.min(cursor, rows.length - 1) : 0;
  const current = rows[selected];

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const inFilter = document.activeElement === filter.current;

      if (event.key === "/" && !inFilter) {
        event.preventDefault();
        filter.current?.focus();
        return;
      }
      if (event.key === "Escape" && inFilter) {
        filter.current?.blur();
        if (query) setQuery("");
        return;
      }
      if (event.key === "ArrowDown" || (event.key === "j" && !inFilter)) {
        event.preventDefault();
        setCursor((c) => (rows.length ? (Math.min(c, rows.length - 1) + 1) % rows.length : 0));
        return;
      }
      if (event.key === "ArrowUp" || (event.key === "k" && !inFilter)) {
        event.preventDefault();
        setCursor((c) => (rows.length ? (Math.min(c, rows.length - 1) - 1 + rows.length) % rows.length : 0));
        return;
      }
      if (event.key === "Enter" && current) {
        window.open(current.repo, "_blank", "noopener,noreferrer");
        return;
      }
      if (event.key === "d" && !inFilter && current?.demo) {
        window.open(current.demo, "_blank", "noopener,noreferrer");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [rows.length, current, query]);

  /* The listing prints itself in, then hands the caret over. It starts
     out printing and only ever stops, so nothing has to be set from
     inside the effect. (With reduced motion the print keyframes never
     run, so this just resolves a beat later and changes nothing.) */
  useEffect(() => {
    const done = window.setTimeout(() => setTyping(false), 340 + tools.length * 70);
    return () => window.clearTimeout(done);
  }, []);

  return (
    <main className={styles.stage}>
      <BackLink />

      <div className={styles.column}>
        <header className={styles.head}>
          <h1 className={`${styles.title} rise`} style={{ "--rise-delay": "0.08s" } as CSSProperties}>
            Tools
          </h1>
          <p className={`${styles.prompt} rise`} style={{ "--rise-delay": "0.14s" } as CSSProperties}>
            <span className={styles.dim}>~/tools —</span> {tools.length} free things, all of them on{" "}
            <a className={styles.link} href={github} target="_blank" rel="noopener noreferrer">
              GitHub ↗
            </a>
          </p>

          <div className={`${styles.filter} rise`} style={{ "--rise-delay": "0.2s" } as CSSProperties}>
            <span className={styles.slash} aria-hidden="true">
              /
            </span>
            <input
              ref={filter}
              data-swallow-keys="true"
              className={styles.input}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setCursor(0);
              }}
              placeholder="filter"
              aria-label="Filter tools"
              spellCheck={false}
              autoComplete="off"
            />
            {query && (
              <button type="button" className={styles.clear} onClick={() => setQuery("")}>
                clear
              </button>
            )}
            <span className={styles.count}>
              {rows.length}/{tools.length}
            </span>
          </div>
        </header>

        <div className={styles.legendRow} aria-hidden="true">
          <span className={styles.colName}>tool</span>
          <span className={styles.colWhat}>what it does</span>
          <span className={styles.colLang}>lang</span>
          <span className={styles.colWhen}>updated</span>
        </div>

        <div className={styles.rows} role="listbox" aria-label="Tools" tabIndex={-1}>
          <AnimatePresence initial={false} mode="popLayout">
            {rows.map((tool, i) => (
              <motion.a
                key={tool.name}
                layout={!reduced}
                role="option"
                aria-selected={i === selected}
                href={tool.repo}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.row}
                data-selected={i === selected || undefined}
                style={{ "--line": `${i}` } as CSSProperties}
                data-printing={typing && !query ? "" : undefined}
                initial={reduced ? false : { opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: 4, transition: { duration: 0.14 } }}
                transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 44, mass: 0.8 }}
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") setCursor(i);
                }}
                onFocus={() => setCursor(i)}
              >
                <span className={styles.colName}>
                  {/* Always present, so every name sits on the same
                      baseline whether or not it is the selected one. */}
                  <span className={styles.caretSlot} data-on={i === selected || undefined} aria-hidden="true">
                    ›
                  </span>
                  {tool.name}
                </span>
                <span className={styles.colWhat}>{tool.tagline}</span>
                <span className={styles.colLang}>{SHORT_LANG[tool.lang]}</span>
                <span className={styles.colWhen}>{updatedLabel(tool.updated)}</span>
                <span className={styles.rowArrow} aria-hidden="true">
                  ↗
                </span>
              </motion.a>
            ))}
          </AnimatePresence>

          {!rows.length && (
            <p className={styles.empty}>
              nothing matches <span className={styles.dim}>{query}</span>
            </p>
          )}
        </div>

        {/* The prompt the listing hands back to you. */}
        <p className={styles.footer}>
          <span className={styles.caret} data-blink={!typing || undefined} aria-hidden="true" />
          <span className={styles.keys}>
            <kbd>↑</kbd>
            <kbd>↓</kbd> move · <kbd>⏎</kbd> source
            {current?.demo && (
              <>
                {" · "}
                <kbd>d</kbd> demo
              </>
            )}{" "}
            · <kbd>/</kbd> filter
          </span>
        </p>
      </div>
    </main>
  );
}
