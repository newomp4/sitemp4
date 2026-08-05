import Link from "next/link";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { profile, work, links, socials } from "@/lib/content";
import styles from "./styles.module.css";
import { RowCells } from "./RowCells";
import { CopyRow } from "./CopyRow";

export const metadata: Metadata = {
  title: "Owen — Index",
  description: `${profile.tagline} A running index of work, links, and where to find @${profile.handle}.`,
};

/* Stagger: 50ms increments, delay capped at 600ms so the page settles fast. */
const delayMs = (step: number) => `${Math.min(step * 50, 600)}ms`;
const rise = (step: number) =>
  ({ "--rise-delay": delayMs(step) }) as CSSProperties;

type Entry = {
  title: string;
  middle?: string;
  meta?: string;
  href?: string;
  copy?: boolean;
};

const sections: { label: string; entries: Entry[] }[] = [
  {
    label: "Work",
    entries: work.map((w) => ({
      title: w.title,
      middle: w.description,
      meta: w.year,
      href: w.href,
    })),
  },
  {
    label: "Links",
    entries: links.map((l) => ({
      title: l.title,
      middle: l.description,
      meta: l.year,
      href: l.href,
    })),
  },
  {
    label: "Elsewhere",
    entries: socials.map((s) => ({
      title: s.label,
      middle: s.handle,
      href: s.href,
      copy: s.copyToClipboard,
    })),
  },
];

/* Precomputed once at module init — render must stay pure.
   Steps 0–3 belong to header, h1, profile, and the Now row. */
const numberedSections = (() => {
  let step = 4;
  let index = 0;
  return sections.map((section) => ({
    label: section.label,
    labelStep: step++,
    entries: section.entries.map((entry) => ({
      entry,
      number: String(++index).padStart(2, "0"),
      step: step++,
    })),
  }));
})();

const footerStep =
  4 + numberedSections.length + sections.reduce((n, s) => n + s.entries.length, 0);

export default function V4Page() {
  return (
    <div className="min-h-screen bg-white text-[#0A0A0A]">
      <div className="mx-auto max-w-5xl px-6">
        <header
          className="rise flex items-baseline justify-between gap-4 border-b border-[#E5E5E5] py-4 font-mono text-[11px] uppercase tracking-[0.12em]"
          style={rise(0)}
        >
          <span>{profile.name} — Personal Index</span>
          <span className="hidden text-[#A3A3A3] sm:block">Est. 2026</span>
          <span>@{profile.handle}</span>
        </header>

        <main>
          {/* Hero — the specimen */}
          <section className="py-16 md:py-20">
            <h1
              className="rise text-[clamp(4rem,14vw,9rem)] font-bold leading-[0.95] tracking-[-0.04em]"
              style={rise(1)}
            >
              {profile.name}
              <span className="text-[#E30613]">.</span>
            </h1>
            <div
              className="rise mt-10 grid grid-cols-12 gap-x-4 md:mt-14"
              style={rise(2)}
            >
              <span className="col-span-12 font-mono text-[11px] uppercase tracking-[0.12em] text-[#A3A3A3] md:col-span-2">
                Profile
              </span>
              <div className="col-span-12 mt-3 max-w-md md:col-span-7 md:col-start-6 md:mt-0">
                <p className="text-[15px] leading-relaxed">{profile.intro[0]}</p>
                <p className="mt-3 text-[15px] leading-relaxed text-[#A3A3A3]">
                  {profile.intro[1]}
                </p>
              </div>
            </div>
          </section>

          {/* Now — standalone statement row */}
          <section
            className="rise grid grid-cols-12 items-baseline gap-x-4 border-t border-[#E5E5E5] py-5"
            style={rise(3)}
          >
            <h2 className="col-span-12 font-mono text-[11px] uppercase tracking-[0.12em] text-[#A3A3A3] sm:col-span-2">
              Now
            </h2>
            <p className="col-span-12 mt-2 text-[15px] leading-relaxed sm:col-span-10 sm:mt-0">
              {profile.now}
            </p>
          </section>

          {/* The index table — numbering runs continuously across sections */}
          <div className="mt-16">
            {numberedSections.map((section) => (
              <section key={section.label} className="mt-12 first:mt-0">
                <div
                  className="rise border-t border-[#E5E5E5] pb-3 pt-6"
                  style={rise(section.labelStep)}
                >
                  <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#A3A3A3]">
                    {section.label}
                  </h2>
                </div>

                {section.entries.map(({ entry, number, step }) => {
                  if (entry.copy || !entry.href) {
                    return (
                      <CopyRow
                        key={entry.title}
                        number={number}
                        label={entry.title}
                        handle={entry.middle ?? ""}
                        delay={delayMs(step)}
                      />
                    );
                  }

                  const isExternal = entry.href.startsWith("http");
                  return (
                    <a
                      key={entry.title}
                      href={entry.href}
                      {...(isExternal
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className={`${styles.row} rise grid grid-cols-12 items-baseline gap-x-4 border-t border-[#E5E5E5] py-5`}
                      style={rise(step)}
                    >
                      <RowCells
                        number={number}
                        title={entry.title}
                        middle={entry.middle}
                        meta={entry.meta}
                      />
                    </a>
                  );
                })}
              </section>
            ))}
          </div>
        </main>

        <footer
          className="rise mb-8 mt-20 flex items-baseline justify-between gap-4 border-t border-[#E5E5E5] py-8 font-mono text-[11px] uppercase tracking-[0.12em] text-[#A3A3A3]"
          style={rise(footerStep)}
        >
          <span>Made by me, for me</span>
          <span>{profile.name} © 2026</span>
        </footer>
      </div>

      <Link
        href="/"
        aria-label="Back to the version index"
        className={`${styles.badge} fixed bottom-4 right-4 z-50 border border-[#0A0A0A] bg-white px-2.5 py-1 font-mono text-[11px] tracking-[0.12em] text-[#0A0A0A] transition-colors duration-200 hover:bg-[#0A0A0A] hover:text-white`}
      >
        4 / 05
      </Link>
    </div>
  );
}
