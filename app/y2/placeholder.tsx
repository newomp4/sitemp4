import styles from "./styles.module.css";

export type Tone = "wide" | "slate" | "moss" | "char";

const ART: Record<Tone, string> = {
  wide: styles.artWide,
  slate: styles.artSlate,
  moss: styles.artMoss,
  char: styles.artChar,
};

type Props = {
  /** Which gradient fills the frame — "wide" for the hero, one per chapter. */
  tone: Tone;
  /** Frame sizing from the call site — aspect ratio, width, rounding. */
  className?: string;
  label?: string;
};

/**
 * Photo placeholder — layered CSS-gradient art behind a tiny label.
 * Rendered as spans so it can sit inside the chapter rows' <a> tags.
 * Hover behavior belongs to the parent (the wide photo's styles.photo
 * frame scales the art; chapter thumbs just unfold with the note).
 */
export default function Placeholder({
  tone,
  className = "",
  label = "image",
}: Props) {
  return (
    <span className={`${styles.artFrame} ${className}`}>
      {/* Replace with <Image src="/photos/….jpg" alt="…" fill className="object-cover" /> */}
      <span aria-hidden="true" className={`${ART[tone]} ${styles.art}`} />
      <span
        aria-hidden="true"
        className="absolute bottom-2 left-2.5 text-[10px] tracking-wide text-[#3F3F3F]"
      >
        {label}
      </span>
    </span>
  );
}
