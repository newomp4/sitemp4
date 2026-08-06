import type { CSSProperties } from "react";
import Link from "next/link";
import styles from "./styles.module.css";

/**
 * 404 — nothing here. The glow rests half-open at the bottom, alive but
 * unbothered.
 */
export default function NotFound() {
  return (
    <div
      className={`${styles.root} relative min-h-dvh w-full overflow-hidden bg-[#111111]`}
    >
      <div className="mx-auto flex min-h-dvh w-full max-w-[42rem] flex-col justify-center px-6 pb-[26vh]">
        <p className="text-[13px] text-[#7D7D7D]">404</p>
        <h1 className="mt-2 text-[26px] font-semibold tracking-tight text-[#F5F5F5]">
          Nothing here.
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[#A3A3A3]">
          Probably never was.
        </p>
        <p className="mt-8">
          <Link href="/" className={styles.backLink}>
            <span aria-hidden="true" className={styles.backArrow}>
              ←
            </span>{" "}
            Back
          </Link>
        </p>
      </div>

      {/* The glow, resting half-open */}
      <div
        className={styles.reveal}
        data-open="true"
        aria-hidden="true"
        style={{ "--reveal": 0.55, "--revealSoft": 0.55 } as CSSProperties}
      >
        <div className={styles.revealLayer}>
          <div className={styles.gsLiftSoft}>
            <div className={`${styles.gsGlow} ${styles.gsBack}`} />
          </div>
          <div className={styles.gsLiftTense}>
            <div className={`${styles.gsGlow} ${styles.gsMid}`} />
          </div>
          <div className={styles.gsLiftTense}>
            <div className={`${styles.gsGlow} ${styles.gsFront}`} />
            <div className={styles.revealGrain} />
          </div>
        </div>
      </div>
    </div>
  );
}
