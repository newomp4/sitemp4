"use client";

import { useEffect, useState } from "react";
import IndexList from "./variants/IndexList";
import Sheet from "./variants/Sheet";
import Rail from "./variants/Rail";
import Register from "./variants/Register";
import Board from "./variants/Board";
import styles from "./preview.module.css";

const VARIANTS = [
  { name: "Index", hint: "the site's own voice — a list that unfolds", Component: IndexList },
  { name: "Contact sheet", hint: "the gallery's language, applied to tools", Component: Sheet },
  { name: "Rail", hint: "pick a name, the stage changes", Component: Rail },
  { name: "Register", hint: "a directory listing you can drive from the keyboard", Component: Register },
  { name: "Board", hint: "a moving wall of names", Component: Board },
];

/** Five ways to do /tools. Click a pill or press 1–5. */
export default function Preview() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      /* The Register variant reads typing for its filter; it opts out
         while the filter has the caret. */
      if ((event.target as HTMLElement | null)?.dataset?.swallowKeys) return;
      const n = Number.parseInt(event.key, 10);
      if (n >= 1 && n <= VARIANTS.length) setIndex(n - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const Current = VARIANTS[index].Component;

  return (
    <div className={styles.root}>
      {/* Remounting on every switch replays each concept's entrance,
          which is half of what is being judged here. */}
      <Current key={index} />

      <nav className={styles.bar} aria-label="Concept switcher">
        {VARIANTS.map((variant, i) => (
          <button
            key={variant.name}
            type="button"
            className={styles.pill}
            data-active={i === index || undefined}
            onClick={() => setIndex(i)}
          >
            <span className={styles.pillNumber}>{i + 1}</span>
            {variant.name}
          </button>
        ))}
      </nav>
      <p className={styles.hint}>{VARIANTS[index].hint}</p>
    </div>
  );
}
