import Image from "next/image";
import type { ComponentType, PointerEvent } from "react";
import type { Tool } from "@/lib/tools";
import ID4Burst, { ID4Spark } from "./ID4Burst";
import PetalBurst from "./PetalBurst";
import styles from "./tools.module.css";

/**
 * What an app's row carries on the Tools page: the mark in its tile, the
 * price after its description, the flourish that plays from the mark, and
 * the light that follows the pointer across it.
 */

/** Each app's own moment, keyed by name. */
export const flourishes: Partial<Record<string, { Burst: ComponentType }>> = {
  Petal: { Burst: PetalBurst },
  ID4: { Burst: ID4Burst },
};

/** ID4's mark is drawn so it can turn in its tile; the others wear their
    artwork, or their initial until they have some. The artwork is a few
    kilobytes and sits at the top of the page, so it is fetched at once and
    served as it is: going through the image optimizer left the tile an
    empty grey square for a second or two whenever its cache was cold. */
export function AppMark({ tool }: { tool: Tool }) {
  if (tool.name === "ID4") return <ID4Spark className={styles.spark} />;
  if (tool.icon) {
    return (
      <Image
        src={tool.icon}
        alt=""
        width={22}
        height={22}
        loading="eager"
        unoptimized
        className={styles.markArt}
      />
    );
  }
  return <span className={styles.markLetter}>{tool.name.charAt(0).toUpperCase()}</span>;
}

/** The price at the end of the description, after the middle dot the rest
    of the site separates clauses with. One unbreakable piece, so a line
    that wraps on a phone never strands the dot at the end of it. */
export function PriceTail({ price }: { price: string }) {
  return (
    <span className={styles.priceTail}>
      <span className={styles.sep} aria-hidden="true">·</span>{" "}
      <span className={styles.price}>
        {price !== "Free" && <span className={styles.srOnly}>Paid, </span>}
        {price}
      </span>
    </span>
  );
}

/** The light follows the pointer across the bar it sits on. Its position is
    written straight onto the element as a custom property rather than held
    in state: a re-render per pointer move would cost far more than the
    paint it is driving. */
export function trackLight(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== "mouse") return;
  const box = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--mx", `${event.clientX - box.left}px`);
  event.currentTarget.style.setProperty("--my", `${event.clientY - box.top}px`);
}
