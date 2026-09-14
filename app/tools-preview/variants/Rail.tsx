"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import BackLink from "../../BackLink";
import useReducedMotionPreference from "../../useReducedMotionPreference";
import { github, tools, toolsIntro, updatedLabel } from "@/lib/tools";
import Cover from "./Cover";
import styles from "./rail.module.css";

/**
 * CONCEPT 3 — "Rail".
 *
 * A column of names on the left, one tool on the stage at a time. The
 * marker springs to whichever name you pick and the stage dissolves
 * through to the new one — outgoing lifts and blurs away, incoming
 * rises into focus, its lines landing one after another. Arrow keys
 * walk the rail; nothing ever reflows the page.
 */
export default function Rail() {
  const reduced = useReducedMotionPreference();
  const [index, setIndex] = useState(0);
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  const tool = tools[index];

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1
      : event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1
      : 0;
    if (!step) return;
    event.preventDefault();
    const next = (index + step + tools.length) % tools.length;
    setIndex(next);
    items.current[next]?.focus();
  }

  return (
    <main className={styles.stage}>
      <BackLink />

      <div className={styles.layout}>
        {/* ── The rail ── */}
        <div className={styles.rail}>
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

          <div className={styles.names} onKeyDown={onKeyDown} role="tablist" aria-label="Tools">
            {tools.map((item, i) => (
              <button
                key={item.name}
                ref={(element) => {
                  items.current[i] = element;
                }}
                type="button"
                role="tab"
                aria-selected={i === index}
                className={`${styles.name} rise`}
                style={{ "--rise-delay": `${0.22 + i * 0.03}s` } as CSSProperties}
                data-active={i === index || undefined}
                onClick={() => setIndex(i)}
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") setIndex(i);
                }}
              >
                {i === index && (
                  <motion.span
                    layoutId="rail-marker"
                    className={styles.marker}
                    transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 38, mass: 0.9 }}
                  />
                )}
                <span className={styles.nameText}>{item.name}</span>
                <span className={styles.nameLang}>{item.lang}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── The stage ── */}
        <div className={styles.panelStack}>
          <AnimatePresence initial={false}>
            <motion.article
              key={tool.name}
              className={styles.panel}
              initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
              transition={reduced ? { duration: 0 } : { duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={styles.art}>
                <Cover art={tool.art} active />
              </div>

              <div className={styles.panelBody}>
                <p className={styles.meta} style={{ "--in": "0.08s" } as CSSProperties}>
                  {tool.lang} · updated {updatedLabel(tool.updated)} · {tool.tags.join(" · ")}
                </p>
                <h2 className={styles.panelName} style={{ "--in": "0.12s" } as CSSProperties}>
                  {tool.name}
                </h2>
                <p className={styles.tagline} style={{ "--in": "0.16s" } as CSSProperties}>
                  {tool.tagline}
                </p>
                <p className={styles.note} style={{ "--in": "0.2s" } as CSSProperties}>
                  {tool.note}
                </p>
                <div className={styles.links} style={{ "--in": "0.24s" } as CSSProperties}>
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
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
