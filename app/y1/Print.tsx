import Image from "next/image";
import styles from "./styles.module.css";

/**
 * The portrait — a 4:5 print set down above the headline, resting at a
 * slight tilt. Hover picks it up: it straightens and lifts.
 */
export default function Print() {
  return (
    <figure className={styles.print}>
      <Image
        src="/photos/owen-nyc.jpg"
        alt="Owen in front of the Williamsburg Bridge"
        fill
        sizes="128px"
        quality={90}
        priority
        className={`${styles.printImg} object-cover`}
      />
    </figure>
  );
}
