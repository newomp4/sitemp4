"use client";

import { useState, type ReactNode } from "react";
import styles from "./styles.module.css";

/**
 * One chapter row. On hover-capable devices the CSS handles everything
 * (hover breathes the note open). On touch there is no hover, so the row
 * becomes tappable: first tap expands the note (and reveals the ↗ for
 * linked rows), a second tap on the title follows the link. Taps inside
 * the note never toggle — its links stay links.
 */
export default function FoldRow({
  id,
  hasLink,
  years,
  heading,
  note,
}: {
  id?: string;
  hasLink: boolean;
  years: string;
  heading: ReactNode;
  note: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const onRowClick = (e: React.MouseEvent) => {
    // Hover-capable devices are handled purely by CSS
    if (window.matchMedia("(hover: hover)").matches) return;
    if ((e.target as Element).closest("[data-note]")) return;
    if (!hasLink) {
      setOpen((o) => !o);
      return;
    }
    if (!open) {
      e.preventDefault(); // first tap opens instead of navigating
      setOpen(true);
    }
    // already open: let the title link navigate
  };

  return (
    <li
      id={id}
      data-open={String(open)}
      // No-href rows are focusable to unfold their notes; anchored rows
      // take programmatic focus when a deep link glides to them.
      {...(hasLink ? (id ? { tabIndex: -1 } : {}) : { tabIndex: 0 })}
    >
      <div
        className="grid grid-cols-[112px_1fr] gap-x-4 max-sm:grid-cols-1"
        onClick={onRowClick}
      >
        <p className="text-[12px] leading-6 tracking-[0.01em] text-[#7D7D7D] max-sm:mb-0.5 max-sm:leading-4">
          {years}
        </p>
        <div>
          {heading}
          {note && (
            <div className={styles.noteWrap} data-note>
              <div className={styles.noteInner}>{note}</div>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
