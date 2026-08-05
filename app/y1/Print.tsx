import styles from "./styles.module.css";

/**
 * A photo placeholder — a single 4:5 portrait print set down above the
 * headline, resting at a slight tilt. Hover/focus picks it up: it
 * straightens, lifts, and the shadow deepens. Focusable so keyboard
 * users get the same pick-up interaction.
 */
export default function Print() {
  return (
    <figure className={styles.print} tabIndex={0}>
      {/*
        Replace with <Image src="/photos/portrait.jpg" alt="Owen Opacki" fill className="object-cover" />
        (import Image from "next/image"; keep it inside this figure,
        delete the gradient div below.)
      */}
      <div aria-hidden="true" className={`${styles.printArt} absolute inset-0`} />
      <figcaption className="absolute bottom-2 left-2.5 text-[10px] tracking-[0.01em] text-[#3F3F3F]">
        photo
      </figcaption>
    </figure>
  );
}
