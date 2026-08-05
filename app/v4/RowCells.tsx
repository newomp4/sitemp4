import styles from "./styles.module.css";

/**
 * Shared cell layout for every index row (anchor rows and the Discord
 * copy button). Pure presentational — safe in both server and client trees.
 *
 * 12-col map (sm+): 01 number / title ×4 / middle ×4 / meta ×2 / arrow.
 * Below sm: number ×2 / title ×8 / arrow ×2.
 */
export function RowCells({
  number,
  title,
  middle,
  meta,
  copied = false,
}: {
  number: string;
  title: string;
  middle?: string;
  meta?: string;
  copied?: boolean;
}) {
  return (
    <>
      <span
        className={`${styles.num} col-span-2 font-mono text-[12px] sm:col-span-1`}
      >
        {number}
      </span>
      <span className="col-span-8 text-[18px] font-medium tracking-tight sm:col-span-4">
        {title}
      </span>
      <span
        className={`${styles.mutedCell} hidden text-[14px] leading-snug sm:col-span-4 sm:block`}
      >
        {middle ?? ""}
      </span>
      <span
        className={`${styles.mutedCell} hidden whitespace-nowrap font-mono text-[12px] uppercase sm:col-span-2 sm:block`}
      >
        {meta ?? ""}
      </span>
      <span
        className={`${styles.arrow} col-span-2 whitespace-nowrap text-right text-[16px] sm:col-span-1`}
        aria-hidden="true"
      >
        {copied ? (
          <span className="font-mono text-[11px] tracking-[0.12em] text-[#E30613]">
            COPIED
          </span>
        ) : (
          "→"
        )}
      </span>
    </>
  );
}
