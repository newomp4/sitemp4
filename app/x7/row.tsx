import type { LinkItem } from "@/lib/content";
import styles from "./styles.module.css";

/**
 * Bare row shared by work + links: title with underline-draw,
 * mono year, muted description. No cards, no chips.
 */
export default function Row({ item }: { item: LinkItem }) {
  const external = item.external ?? /^https?:/.test(item.href);
  return (
    <a
      href={item.href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`${styles.row} block`}
    >
      <span className="flex flex-wrap items-baseline gap-x-2">
        <span className={`${styles.rowTitle} text-[16px] text-[#d4d4d4]`}>
          {item.title}
        </span>
        {item.year && (
          <span className="font-mono text-[11px] text-[#525252]">
            {item.year}
          </span>
        )}
      </span>
      {item.description && (
        <span className="mt-1 block text-[13px] leading-relaxed text-[#737373]">
          {item.description}
        </span>
      )}
    </a>
  );
}
