"use client";

import Link from "next/link";
import styles from "./styles.module.css";

const iconProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

function MailIcon() {
  return (
    <svg {...iconProps}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
      <path d="m4.5 8 7.5 5 7.5-5" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg {...iconProps}>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.75" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.75" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.75" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.75" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg {...iconProps}>
      <path d="M12 19V5" />
      <path d="m5.5 11.5 6.5-6.5 6.5 6.5" />
    </svg>
  );
}

export default function Dock({ email }: { email: string }) {
  const scrollToTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <nav className={styles.dock} aria-label="Shortcuts">
      <a
        href={`mailto:${email}`}
        className={styles.dockButton}
        aria-label="Write me an email"
      >
        <MailIcon />
      </a>
      <Link href="/" className={styles.dockButton} aria-label="All versions">
        <GridIcon />
      </Link>
      <button
        type="button"
        onClick={scrollToTop}
        className={styles.dockButton}
        aria-label="Back to top"
      >
        <ArrowUpIcon />
      </button>
    </nav>
  );
}
