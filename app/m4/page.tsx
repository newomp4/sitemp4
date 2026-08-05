import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { profile, work, links, socials } from "@/lib/content";
import CopyHandle from "./copy-handle";
import SpotlightCard from "./spotlight-card";
import styles from "./styles.module.css";

export const metadata: Metadata = {
  title: "Owen Opacki — Glow",
  description: profile.tagline,
};

const rise = (step: number): CSSProperties =>
  ({ "--rise-delay": `${step * 0.06}s` }) as CSSProperties;

const flatLink =
  "text-[15px] text-[#9A9A9A] underline decoration-[#3A3A3A] underline-offset-2 transition-colors duration-150 hover:text-[#EDEDED] hover:decoration-white";

const visitLink = `${styles.visit} ${styles.stretch} mt-3 inline-block text-[13px] text-[#9A9A9A] underline decoration-[#3A3A3A] underline-offset-2 transition-colors duration-150`;

function PhoneSketch() {
  return (
    <svg
      viewBox="0 0 88 108"
      fill="none"
      aria-hidden="true"
      className="h-auto w-[64px] sm:w-[88px]"
    >
      <rect
        x="1.5"
        y="1.5"
        width="85"
        height="105"
        rx="12"
        stroke="#303030"
        strokeWidth="1.5"
      />
      <rect x="34" y="9" width="20" height="3.5" rx="1.75" fill="#303030" />
      <rect x="14" y="26" width="56" height="5" rx="2.5" fill="#242424" />
      <rect x="14" y="38" width="40" height="5" rx="2.5" fill="#242424" />
      <rect x="14" y="50" width="50" height="5" rx="2.5" fill="#242424" />
      <rect x="14" y="68" width="60" height="26" rx="5" fill="#212121" />
    </svg>
  );
}

export default function GlowPage() {
  return (
    <div className={`${styles.root} min-h-dvh w-full bg-[#0F0F0F] text-[#EDEDED]`}>
      <div className="mx-auto w-full max-w-[672px] px-6 py-16 sm:py-24">
        {/* ── Nav ── */}
        <header
          className="rise flex items-center justify-between"
          style={rise(0)}
        >
          <span className="text-[14px] font-semibold text-[#F0F0F0]">
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
          <div
            aria-hidden="true"
            className="flex h-16 w-16 items-center justify-center rounded-full border border-[#232323] bg-[#1B1B1B] text-[14px] font-medium tracking-[0.08em] text-[#525252]"
          >
            OO
          </div>

          <h1 className="mt-6 text-[26px] font-semibold tracking-tight text-[#F0F0F0]">
            {profile.headline}
          </h1>

          {profile.intro.map((paragraph) => (
            <p
              key={paragraph}
              className="mt-4 text-[15px] leading-relaxed text-[#9A9A9A]"
            >
              {paragraph}
            </p>
          ))}

          <p className="mt-5 text-[14px] leading-relaxed text-[#6E6E6E]">
            {profile.now}
          </p>

          <p className="mt-6">
            <a href="#work" className={flatLink}>
              Skip to the work <span aria-hidden="true">↗</span>
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
            className="mb-5 text-[14px] font-medium text-[#EDEDED]"
          >
            Selected work
          </h2>
          <ul className="space-y-4">
            {work.map((item) => (
              <li key={item.title}>
                <SpotlightCard className="p-5">
                  <div className="grid grid-cols-[1fr_auto] items-center gap-4 sm:gap-6">
                    <div>
                      {item.year && (
                        <p className="font-mono text-[11px] text-[#6E6E6E]">
                          {item.year}
                        </p>
                      )}
                      <h3 className="mt-1.5 text-[16px] font-medium text-[#F0F0F0]">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="mt-1 text-[14px] leading-relaxed text-[#9A9A9A]">
                          {item.description}
                        </p>
                      )}
                      <a
                        href={item.href}
                        {...(item.external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        aria-label={`Visit ${item.title}`}
                        className={visitLink}
                      >
                        Visit <span aria-hidden="true">↗</span>
                      </a>
                    </div>
                    <div className="flex h-[112px] w-[92px] items-center justify-center rounded-xl bg-[#1B1B1B] sm:h-[132px] sm:w-[112px]">
                      <PhoneSketch />
                    </div>
                  </div>
                </SpotlightCard>
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
            className="mb-5 text-[14px] font-medium text-[#EDEDED]"
          >
            Elsewhere
          </h2>
          <ul className="space-y-4">
            {links.map((item) => (
              <li key={item.title}>
                <SpotlightCard className="p-5">
                  {item.year && (
                    <p className="font-mono text-[11px] text-[#6E6E6E]">
                      {item.year}
                    </p>
                  )}
                  <h3 className="text-[16px] font-medium text-[#F0F0F0]">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="mt-1 text-[14px] leading-relaxed text-[#9A9A9A]">
                      {item.description}
                    </p>
                  )}
                  <a
                    href={item.href}
                    {...(item.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    aria-label={`Visit ${item.title}`}
                    className={visitLink}
                  >
                    Visit <span aria-hidden="true">↗</span>
                  </a>
                </SpotlightCard>
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
            className="mb-5 text-[14px] font-medium text-[#EDEDED]"
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
                      className={flatLink}
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
              © 2026 {profile.name}. Bring your own light.
            </p>
          </div>
        </footer>
      </div>

      {/* ── Version badge ── */}
      <Link
        href="/"
        aria-label="Back to all versions"
        className="fixed right-4 bottom-4 z-50 rounded-full border border-[#232323] bg-[#161616] px-2.5 py-1 font-mono text-[11px] text-[#6E6E6E] transition-colors duration-150 hover:text-[#EDEDED]"
      >
        4 / 05
      </Link>
    </div>
  );
}
