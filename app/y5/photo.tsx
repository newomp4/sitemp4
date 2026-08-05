import styles from "./styles.module.css";

/**
 * A photograph enclosed with the letter — one landscape 3:2 print resting
 * at a slight tilt on the page. Hover (or keyboard focus) picks it up:
 * it straightens, lifts, and casts a deeper shadow.
 */
export default function Photo() {
  return (
    <figure className={styles.photoFigure}>
      <div
        role="img"
        aria-label="Photo placeholder"
        tabIndex={0}
        className={styles.photo}
      >
        {/* Replace with <Image src="/photos/letter.jpg" alt="…" fill className="object-cover" />
            (import Image from "next/image"; delete the gradient div below.) */}
        <div aria-hidden="true" className={styles.photoArt} />
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[#6E6E6E]">
        a picture goes here — proof I exist.
      </figcaption>
    </figure>
  );
}
