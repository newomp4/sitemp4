import styles from "./styles.module.css";

type Props = {
  /** Unique per instance — namespaces the SVG hatch pattern id. */
  patternId: string;
  label?: string;
};

/**
 * Image placeholder: fixed 16:10 box, layered gradient, faint diagonal
 * hatch, centered mono label. The hatch + label ("the veil") fade out on
 * frame hover so the art appears to clear.
 */
export default function Placeholder({
  patternId,
  label = "image · 16:10",
}: Props) {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#141414]">
      <div
        className={`${styles.art} absolute inset-0 bg-linear-to-br from-[#1B1B1B] to-[#141414]`}
      >
        {/* Replace with <Image src=... fill /> */}
        <div
          aria-hidden="true"
          className={`${styles.veil} absolute inset-0 flex items-center justify-center`}
        >
          <svg className="absolute inset-0 h-full w-full">
            <defs>
              <pattern
                id={patternId}
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M-1 1 1 -1 M0 10 10 0 M9 11 11 9"
                  stroke="#232323"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${patternId})`} />
          </svg>
          <span className="relative font-mono text-[11px] text-[#3F3F3F]">
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}
