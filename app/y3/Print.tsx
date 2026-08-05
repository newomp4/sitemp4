import type { CSSProperties } from "react";
import styles from "./styles.module.css";

export type Tone = "dusk" | "slate" | "char";

const ART: Record<Tone, string> = {
  dusk: styles.artDusk,
  slate: styles.artSlate,
  char: styles.artChar,
};

type Props = {
  label: string;
  tone: Tone;
  /** Position in the entrance stagger — 0, 1, 2 left to right. */
  step: number;
};

/**
 * A photo placeholder — a 4:5 print set down on the page.
 * The outer frame carries the entrance stagger and neighbor nudges;
 * the figure keeps its transform free for the rest/pick-up physics.
 * Focusable so keyboard users get the same pick-up interaction.
 */
export default function Print({ label, tone, step }: Props) {
  return (
    <div
      className={styles.frame}
      style={{ "--settle-delay": `${0.2 + step * 0.08}s` } as CSSProperties}
    >
      <figure className={styles.print} tabIndex={0}>
        {/*
          Replace with <Image src="/photos/01.jpg" alt="…" fill className="object-cover" />
          (import Image from "next/image"; keep it inside this frame,
          delete the gradient div below.)
        */}
        <div aria-hidden="true" className={`${ART[tone]} absolute inset-0`} />
        <figcaption
          className={`${styles.printLabel} absolute bottom-2 left-2.5 text-[10px] tracking-wide`}
        >
          {label}
        </figcaption>
      </figure>
    </div>
  );
}
