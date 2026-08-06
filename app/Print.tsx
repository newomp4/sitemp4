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
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAUABADASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAUGA//EACAQAAIBBAMAAwAAAAAAAAAAAAECAwAEERIhMVEGE3H/xAAVAQEBAAAAAAAAAAAAAAAAAAACAf/EABYRAQEBAAAAAAAAAAAAAAAAAAABEf/aAAwDAQACEQMRAD8A3uDAlgFlKgtKpAP5T6K6gKKRNEcgcbioi4uEcxRuoZhljs2oAx7Ty3t447AXRQMv0Z04Jz353R2liPlHCnJJPtPZmKfHIwpIwMd+miirBf/Z"
        className={`${styles.printImg} object-cover`}
      />
    </Link>
  );
}
