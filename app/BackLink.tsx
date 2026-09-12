import Link from "next/link";
import type { CSSProperties } from "react";
import styles from "./styles.module.css";

/**
 * The way home from a sub-page. A small pill in the top-left corner,
 * identical on every page that has one, so it is always in the same
 * place. The arrow is drawn to match the Gallery and Tools icons on the
 * homepage: solid, 24-unit grid, rounded joins.
 */
export default function BackLink() {
  return (
    <Link
      href="/"
      className={`${styles.backLink} rise`}
      style={{ "--rise-delay": "0.05s" } as CSSProperties}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        width="15"
        height="15"
        aria-hidden="true"
        className={styles.backArrow}
      >
        <path
          d="M6 12L11.75 7.25V16.75L6 12Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <rect x="10" y="10.6" width="10.5" height="2.8" rx="1.4" fill="currentColor" />
      </svg>
      <span>Back</span>
    </Link>
  );
}
