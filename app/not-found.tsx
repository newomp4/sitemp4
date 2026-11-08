import type { CSSProperties } from "react";
import Link from "next/link";
import DotGlyph from "./DotGlyph";
import site from "./styles.module.css";
import styles from "./not-found.module.css";

const rise = (step: number): CSSProperties =>
  ({ "--rise-delay": `${step * 0.05}s` }) as CSSProperties;

/**
 * 404. The number as a field of dots that lift under the pointer, one
 * plain line of explanation, and the way home.
 */
export default function NotFound() {
  return (
    <div className={`${site.root} min-h-dvh w-full overflow-x-clip bg-[#111111]`}>
      <main className="mx-auto flex min-h-dvh w-full max-w-[35rem] flex-col justify-center px-6 py-16 max-sm:px-8">
        <div style={rise(0)} className="rise">
          <DotGlyph text="404" />
        </div>

        <h1
          style={rise(1)}
          className="rise mt-8 text-title font-strong tracking-tight text-[#F5F5F5]"
        >
          Page not found
        </h1>
        <p style={rise(2)} className="rise mt-2 text-body leading-relaxed text-[#A3A3A3]">
          The link may be broken or out of date.
        </p>

        <p style={rise(3)} className="rise mt-8">
          <Link href="/" className={`${site.footerLink} ${styles.home}`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="18" height="18" aria-hidden="true">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.8839 18.6339C10.3957 19.122 9.60427 19.122 9.11612 18.6339L3.36612 12.8839C3.1317 12.6495 3 12.3315 3 12C3 11.6685 3.13169 11.3506 3.36612 11.1161L9.11612 5.36612C9.60427 4.87796 10.3957 4.87796 10.8839 5.36612C11.372 5.85427 11.372 6.64573 10.8839 7.13388L7.26776 10.75H19.75C20.4404 10.75 21 11.3097 21 12C21 12.6904 20.4404 13.25 19.75 13.25H7.26777L10.8839 16.8661C11.372 17.3543 11.372 18.1457 10.8839 18.6339Z"
                fill="currentColor"
              />
            </svg>
            <span>Back home</span>
          </Link>
        </p>
      </main>
    </div>
  );
}
