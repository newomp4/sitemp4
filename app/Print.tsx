import Image from "next/image";
import Link from "next/link";
import styles from "./styles.module.css";

/**
 * The portrait print, resting at a slight tilt above the headline.
 * Hover picks it up; clicking goes to the photo gallery.
 */
export default function Print() {
  return (
    <Link
      href="/photos"
      aria-label="See the photo gallery"
      className={`${styles.print} block`}
    >
      <Image
        src="/photos/owen-nyc.jpg"
        alt="Owen in front of the Williamsburg Bridge"
        fill
        sizes="128px"
        quality={90}
        preload
        className={`${styles.printImg} object-cover`}
      />
    </Link>
  );
}
