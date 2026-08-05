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
};

/**
 * A photo placeholder — a 4:5 print resting on the shelf.
 * Focusable so keyboard users get the same pick-up interaction.
 */
export default function Print({ label, tone }: Props) {
  return (
    <figure className={styles.print} tabIndex={0}>
      {/*
        Replace with a real photo:
        <Image src="/photos/01.jpg" alt="…" fill className="object-cover" />
        (import Image from "next/image"; keep it inside this frame,
        delete the gradient div below.)
      */}
      <div aria-hidden="true" className={`${styles.art} ${ART[tone]}`} />
      <figcaption
        className={`${styles.printLabel} absolute bottom-2 left-2.5 font-mono text-[10px] tracking-wide`}
      >
        {label}
      </figcaption>
    </figure>
  );
}
