import styles from "./styles.module.css";

/**
 * A photo placeholder — a 4:5 print set down beside the intro.
 * Rests at a slight tilt; hover/focus picks it up (straighten, lift,
 * deepen shadow). Focusable so keyboard users get the same interaction.
 */
export default function Portrait() {
  return (
    <figure
      className={styles.print}
      tabIndex={0}
      aria-label="Portrait placeholder"
    >
      {/*
        Replace with <Image src="/portrait.jpg" alt="Owen Opacki" fill className="object-cover" />
        (import Image from "next/image"; keep it inside this figure,
        delete the gradient div below.)
      */}
      <div aria-hidden="true" className={`${styles.printArt} absolute inset-0`} />
    </figure>
  );
}
