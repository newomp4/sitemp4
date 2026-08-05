import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { profile, work, links, socials, type LinkItem } from "@/lib/content";
import CopyHandle from "./CopyHandle";
import Print from "./Print";
import styles from "./styles.module.css";

export const metadata: Metadata = {
  title: "Owen Opacki — Portrait",
  description: profile.tagline,
};

const rise = (step: number): CSSProperties =>
  ({ "--rise-delay": `${step * 0.06}s` }) as CSSProperties;

function Row({ item }: { item: LinkItem }) {
  const external = item.external ?? /^https?:/.test(item.href);
  return (
    <li>
      <a
        href={item.href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={`${styles.row} grid gap-x-5 ${
          item.year ? "grid-cols-[88px_1fr]" : "grid-cols-1"
        }`}
      >
        {item.year && (
          <span
            className={`${styles.rowYear} pt-px font-mono text-[12px] leading-relaxed`}
          >
            {item.year}
          </span>
        )}
        <span className={item.year ? "col-start-2" : undefined}>
          <span
            className={`${styles.rowTitle} text-[16px] font-semibold leading-relaxed`}
          >
            {item.title}
          </span>
          {item.description && (
            <span
              className={`${styles.rowDesc} mt-0.5 block text-[15px] leading-relaxed`}
            >
              {item.description}
            </span>
          )}
        </span>
      </a>
    </li>
  );
}

export default function PortraitPage() {
  return (
    <div className={`${styles.root} min-h-dvh w-full bg-[#111111]`}>
      <div className="mx-auto w-full max-w-[672px] px-6 py-16 sm:py-24">
        {/* ── Nav ── */}
        <header
          className="rise flex items-center justify-between"
          style={rise(0)}
        >
          <span className="text-[14px] font-semibold text-[#F5F5F5]">
            {profile.name}
          </span>
          <nav aria-label="Site" className="flex items-center gap-7">
            <a href="#work" className={styles.navLink}>
              Work
            </a>
            <a href="#links" className={styles.navLink}>
              Links
            </a>
            <a href="#contact" className={styles.navLink}>
              Contact
            </a>
          </nav>
        </header>

        {/* ── Hero: the shelf, then the words ── */}
        <section className="rise mt-16 sm:mt-20" style={rise(1)}>
          <div className={styles.shelf} role="group" aria-label="Photo shelf">
            <Print label="photo 01" tone="dusk" />
            <Print label="photo 02" tone="slate" />
            <Print label="photo 03" tone="char" />
          </div>

          <h1 className="mt-10 text-[26px] font-semibold tracking-tight text-[#F5F5F5]">
            {profile.headline}
          </h1>

          {profile.intro.map((paragraph) => (
            <p
              key={paragraph}
              className="mt-4 text-[15px] leading-relaxed text-[#A3A3A3]"
            >
              {paragraph}
            </p>
          ))}

          <p className="mt-6 font-mono text-[12px] text-[#6E6E6E]">
            {profile.now}
          </p>
        </section>

        {/* ── Work ── */}
        <section
          id="work"
          className="rise scroll-mt-10 pt-24"
          style={rise(2)}
          aria-labelledby="work-heading"
        >
          <h2
            id="work-heading"
            className="mb-8 text-[14px] font-semibold text-[#F5F5F5]"
          >
            Selected work
          </h2>
          <ul className="space-y-8">
            {work.map((item) => (
              <Row key={item.title} item={item} />
            ))}
          </ul>
        </section>

        {/* ── Links ── */}
        <section
          id="links"
          className="rise scroll-mt-10 pt-24"
          style={rise(3)}
          aria-labelledby="links-heading"
        >
          <h2
            id="links-heading"
            className="mb-8 text-[14px] font-semibold text-[#F5F5F5]"
          >
            Elsewhere
          </h2>
          <ul className="space-y-6">
            {links.map((item) => (
              <Row key={item.title} item={item} />
            ))}
          </ul>
        </section>

        {/* ── Contact / footer ── */}
        <footer
          id="contact"
          className="rise scroll-mt-10 pt-24 pb-8"
          style={rise(4)}
          aria-labelledby="contact-heading"
        >
          <h2
            id="contact-heading"
            className="mb-8 text-[14px] font-semibold text-[#F5F5F5]"
          >
            Contact
          </h2>
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <ul className="flex flex-wrap gap-x-5 gap-y-3">
              {socials.map((social) => (
                <li key={social.label}>
                  {social.href ? (
                    <a
                      href={social.href}
                      {...(social.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      aria-label={`${social.label} — ${social.handle}`}
                      className="text-[15px] text-[#A3A3A3] transition-colors duration-150 hover:text-[#F5F5F5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5F5F5] motion-reduce:transition-none"
                    >
                      {social.label} <span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    <CopyHandle label={social.label} handle={social.handle} />
                  )}
                </li>
              ))}
            </ul>
            <p className="shrink-0 text-[13px] text-[#6E6E6E]">
              © 2026 {profile.name} — made by me, for me.
            </p>
          </div>
        </footer>
      </div>

      {/* ── Version badge ── */}
      <Link
        href="/"
        aria-label="Back to all versions"
        className="fixed right-4 bottom-4 z-50 rounded-full border border-[#262626] bg-[#161616]/90 px-2.5 py-1 font-mono text-[11px] text-[#6E6E6E] transition-colors duration-150 hover:text-[#F5F5F5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5F5F5] motion-reduce:transition-none"
      >
        04 / 10
      </Link>
    </div>
  );
}
