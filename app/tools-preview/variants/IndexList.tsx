"use client";

import { useRef, useState, type CSSProperties, type MouseEvent } from "react";
import BackLink from "../../BackLink";
import { github, tools, toolsIntro, updatedLabel, type Tool } from "@/lib/tools";
import styles from "./indexList.module.css";

/**
 * CONCEPT 1 — "Index".
 *
 * The homepage's own grammar, pointed at tools: a left column of
 * language, a title line, and a note that breathes open when the row is
 * regarded. Nothing here is new to the site — which is the argument for
 * it. The rest of the list steps back so the row you are reading is the
 * only one at full strength.
 */
export default function IndexList() {
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
              GitHub
              <span aria-hidden="true" className={styles.introArrow}>
                ↗
              </span>
            </a>
            .
          </p>
        </header>

        <ul className={styles.list}>
          {tools.map((tool, index) => (
            <Row key={tool.name} tool={tool} index={index} />
          ))}
        </ul>

        <footer
          className={`${styles.foot} rise`}
          style={{ "--rise-delay": `${0.28 + tools.length * 0.04}s` } as CSSProperties}
        >
          <a className={styles.footLink} href={github} target="_blank" rel="noopener noreferrer">
            All {tools.length} repositories
            <span aria-hidden="true" className={styles.footArrow}>
              ↗
            </span>
          </a>
        </footer>
      </div>
    </main>
  );
}

function Row({ tool, index }: { tool: Tool; index: number }) {
  /* Hover does the work on a mouse. On touch there is no hover, so the
     first tap unfolds the note and the second one follows the link —
     the same bargain the homepage rows strike. */
  const [open, setOpen] = useState(false);
  const pointerType = useRef("mouse");

  const onClick = (event: MouseEvent) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.detail === 0) return;
    if (pointerType.current === "mouse" && window.matchMedia("(hover: hover)").matches) return;
    if ((event.target as Element).closest("[data-note]")) return;
    if (!open && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      event.preventDefault();
      setOpen(true);
    }
  };

  return (
    <li
      className={`${styles.row} rise`}
      data-open={open || undefined}
      style={{ "--rise-delay": `${0.24 + index * 0.04}s` } as CSSProperties}
      onPointerDown={(event) => {
        pointerType.current = event.pointerType;
      }}
      onClick={onClick}
    >
      <p className={styles.lang}>{tool.lang}</p>

      <div className={styles.body}>
        <a className={styles.head2} href={tool.repo} target="_blank" rel="noopener noreferrer">
          <h2 className={styles.name}>
            <span className={styles.mark} aria-hidden="true">
              {tool.name[0].toLowerCase()}
            </span>
            {tool.name}
            <span className={styles.sep} aria-hidden="true">
              {" · "}
            </span>
            <span className={styles.tagline}>{tool.tagline}</span>
          </h2>
          <span className={styles.arrow} aria-hidden="true">
            ↗
          </span>
        </a>

        <div className={styles.fold} data-note>
          <div className={styles.foldInner}>
            <p className={styles.note}>{tool.note}</p>
            <p className={styles.meta}>
              <span>{updatedLabel(tool.updated)}</span>
              {tool.demo && (
                <>
                  <span aria-hidden="true"> · </span>
                  <a className={styles.demo} href={tool.demo} target="_blank" rel="noopener noreferrer">
                    Try it in the browser
                    <span aria-hidden="true" className={styles.demoArrow}>
                      ↗
                    </span>
                  </a>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}
