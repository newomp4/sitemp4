import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { profile, work, links, socials } from "@/lib/content";
import CopyHandle from "./copy-handle";
import styles from "./styles.module.css";

export const metadata: Metadata = {
  title: "Owen — Lite",
  description: profile.tagline,
};

const rise = (step: number): CSSProperties =>
  ({ "--rise-delay": `${step * 0.06}s` }) as CSSProperties;

const textLink =
  "text-[15px] text-[#6B6B6B] underline underline-offset-2 transition-colors duration-150 hover:text-[#1A1A1A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A1A1A]";

const inlineLink =
  "text-[15px] text-[#6B6B6B] underline underline-offset-2 transition-colors duration-150 group-hover:text-[#1A1A1A]";

function PhoneSketch() {
  return (
    <svg
      width="56"
      height="88"
      viewBox="0 0 56 88"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="1.5"
        y="1.5"
        width="53"
        height="85"
        rx="10"
        fill="#FFFFFF"
        stroke="#DAD7D2"
        strokeWidth="1.5"
      />
      <rect x="20" y="7" width="16" height="3" rx="1.5" fill="#DAD7D2" />
      <rect x="10" y="22" width="36" height="4" rx="2" fill="#ECEAE7" />
      <rect x="10" y="32" width="26" height="4" rx="2" fill="#ECEAE7" />
      <rect x="10" y="42" width="32" height="4" rx="2" fill="#ECEAE7" />
      <rect x="10" y="56" width="36" height="18" rx="4" fill="#F0EEEB" />
    </svg>
  );
}

export default function LitePage() {
  return (
    <div className="w-full bg-white">
      <div className="mx-auto w-full max-w-[672px] px-6 py-16 sm:py-24">
        {/* ── Nav ── */}
        <header
          className="rise flex items-center justify-between"
          style={rise(0)}
        >
          <span className="text-[14px] font-semibold text-[#1A1A1A]">
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

        {/* ── Hero ── */}
        <section className="rise mt-16 sm:mt-20" style={rise(1)}>
          <div className="relative h-16 w-16" aria-hidden="true">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#F1EFEC] to-[#D9D6D1]" />
            <div className="absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-full bg-white text-[15px] shadow-[0_1px_4px_rgba(0,0,0,0.10)]">
              👋
            </div>
          </div>

          <h1 className="mt-6 text-[26px] font-semibold tracking-tight text-[#1A1A1A]">
            {profile.headline}
          </h1>

          {profile.intro.map((paragraph) => (
            <p
              key={paragraph}
              className="mt-4 text-[15px] leading-relaxed text-[#6B6B6B]"
            >
              {paragraph}
            </p>
          ))}

          <p className="mt-5 text-[15px] leading-relaxed text-[#9E9E9E]">
            {profile.now}
          </p>

          <p className="mt-6">
            <a href="#work" className={textLink}>
              Take me to the good stuff <span aria-hidden="true">↗</span>
            </a>
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
            className="mb-8 text-[14px] font-semibold text-[#1A1A1A]"
          >
            Selected work
          </h2>
          <ul>
            {work.map((item, i) => (
              <li key={item.title} className={i > 0 ? "mt-14" : undefined}>
                <a
                  href={item.href}
                  {...(item.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="group grid grid-cols-[1fr_auto] items-center gap-4 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1A1A1A] sm:gap-8"
                >
                  <div>
                    {item.year && (
                      <p className="text-[12px] text-[#9E9E9E]">{item.year}</p>
                    )}
                    <h3 className="mt-1 text-[16px] font-semibold text-[#1A1A1A]">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="mt-1 line-clamp-2 text-[15px] leading-relaxed text-[#6B6B6B]">
                        {item.description}
                      </p>
                    )}
                    <p className={`mt-2 ${inlineLink}`}>
                      Check it out <span aria-hidden="true">↗</span>
                    </p>
                  </div>
                  <div className="flex h-[136px] w-[112px] items-center justify-center rounded-2xl bg-[#F5F5F4] transition-[transform,box-shadow] duration-200 ease-out group-hover:-translate-y-0.5 group-hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)]">
                    <PhoneSketch />
                  </div>
                </a>
              </li>
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
            className="mb-8 text-[14px] font-semibold text-[#1A1A1A]"
          >
            Elsewhere
          </h2>
          <ul>
            {links.map((item, i) => (
              <li key={item.title} className={i > 0 ? "mt-10" : undefined}>
                <a
                  href={item.href}
                  {...(item.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="group block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1A1A1A]"
                >
                  {item.year && (
                    <p className="text-[12px] text-[#9E9E9E]">{item.year}</p>
                  )}
                  <h3 className="text-[16px] font-semibold text-[#1A1A1A]">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="mt-1 text-[15px] leading-relaxed text-[#6B6B6B]">
                      {item.description}
                    </p>
                  )}
                  <p className={`mt-2 ${inlineLink}`}>
                    Have a look <span aria-hidden="true">↗</span>
                  </p>
                </a>
              </li>
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
            className="mb-8 text-[14px] font-semibold text-[#1A1A1A]"
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
                      className={textLink}
                    >
                      {social.label} <span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    <CopyHandle label={social.label} handle={social.handle} />
                  )}
                </li>
              ))}
            </ul>
            <p className="shrink-0 text-[13px] text-[#9E9E9E]">
              © 2026 {profile.name} — made by me, for me.
            </p>
          </div>
        </footer>
      </div>

      {/* ── Version badge ── */}
      <Link
        href="/"
        aria-label="Back to all versions"
        className="fixed right-4 bottom-4 z-50 rounded-full border border-[#E7E5E1] bg-white/90 px-2.5 py-1 font-mono text-[11px] text-[#9E9E9E] transition-colors duration-150 hover:text-[#1A1A1A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A1A1A]"
      >
        1 / 05
      </Link>
    </div>
  );
}
