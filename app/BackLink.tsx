import Link from "next/link";
import type { CSSProperties } from "react";
import styles from "./styles.module.css";

/**
 * The way home from a sub-page. A small pill in the top-left corner,
 * identical on every page that has one, so it is always in the same
 * place. The arrow comes from the same icon set as the Gallery and
 * Tools icons on the homepage.
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
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.8839 18.6339C10.3957 19.122 9.60427 19.122 9.11612 18.6339L3.36612 12.8839C3.1317 12.6495 3 12.3315 3 12C3 11.6685 3.13169 11.3506 3.36612 11.1161L9.11612 5.36612C9.60427 4.87796 10.3957 4.87796 10.8839 5.36612C11.372 5.85427 11.372 6.64573 10.8839 7.13388L7.26776 10.75H19.75C20.4404 10.75 21 11.3097 21 12C21 12.6904 20.4404 13.25 19.75 13.25H7.26777L10.8839 16.8661C11.372 17.3543 11.372 18.1457 10.8839 18.6339Z"
          fill="currentColor"
        />
      </svg>
      <span>Back</span>
    </Link>
  );
}
