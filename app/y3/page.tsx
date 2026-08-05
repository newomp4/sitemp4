import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import {
  profile,
  path,
  links,
  socials,
  type LinkItem,
  type PathItem,
} from "@/lib/content";
import CopyHandle from "./copy-handle";
import Print, { type Tone } from "./Print";
import styles from "./styles.module.css";

export const metadata: Metadata = {
  title: "Owen Opacki — Stills",
  description: profile.tagline,
};

const rise = (step: number): CSSProperties =>
  ({ "--rise-delay": `${step * 0.06}s` }) as CSSProperties;

const prints: { label: string; tone: Tone }[] = [
  { label: "photo 01", tone: "dusk" },
  { label: "photo 02", tone: "slate" },
  { label: "photo 03", tone: "char" },
];

function PathRow({ item }: { item: PathItem }) {
  const external = item.external ?? /^https?:/.test(item.href ?? "");
  const meta = [item.role, item.note].filter(Boolean).join(" · ");
  const inner = (
    <>
      <p className="text-[12px] leading-6 text-[#6E6E6E]">
        {item.years}
      </p>
      <div>
        <h3 className="text-[16px] font-semibold text-[#F5F5F5]">
          {item.href ? (
            <>
              <span className={styles.title}>{item.title}</span>{" "}
              <span
                aria-hidden="true"
                className={`${styles.arrow} inline-block text-[#A3A3A3]`}
              >
                ↗
              </span>
            </>
          ) : (
            item.title
          )}
        </h3>
        {meta && (
          <p className="mt-1 text-[15px] leading-relaxed text-[#A3A3A3]">
            {meta}
          </p>
        )}
      </div>
    </>
  );

  return (
    <li>
      {item.href ? (
        <a
          href={item.href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="grid grid-cols-[92px_1fr] gap-x-4"
        >
          {inner}
        </a>
      ) : (
        <div className="grid grid-cols-[92px_1fr] gap-x-4">{inner}</div>
      )}
    </li>
  );
}

function LinkRow({ item }: { item: LinkItem }) {
  const external = item.external ?? /^https?:/.test(item.href);
  return (
    <li>
      <a
        href={item.href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="block"
      >
        <h3 className="text-[16px] font-semibold text-[#F5F5F5]">
          <span className={styles.title}>{item.title}</span>{" "}
          <span
            aria-hidden="true"
            className={`${styles.arrow} inline-block text-[#A3A3A3]`}
          >
            ↗
          </span>
        </h3>
        {item.description && (
          <p className="mt-1 text-[15px] leading-relaxed text-[#A3A3A3]">
            {item.description}
          </p>
        )}
      </a>
    </li>
  );
}

export default function StillsPage() {
  return (
    <div className={`${styles.root} min-h-dvh w-full bg-[#111111]`}>
      <div className="mx-auto w-full max-w-[42rem] px-6 py-16 sm:py-24">
        {/* ── Nav ── */}
        <header
          className="rise flex items-center justify-between"
          style={rise(0)}
        >
          <span className="text-[14px] font-semibold text-[#F5F5F5]">
            {profile.name}
          </span>
          <nav aria-label="Site" className="flex items-center gap-7">
            <a href="#path" className={styles.navLink}>
              Path
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
        <section
          aria-labelledby="intro-heading"
          className="rise mt-16 sm:mt-20"
          style={rise(1)}
        >
          <h1
            id="intro-heading"
            className="text-[26px] font-semibold tracking-tight text-[#F5F5F5]"
          >
            {profile.headline}
          </h1>
          <p className="mt-3">
            <a
              href={profile.handleHref}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.handle} text-[15px]`}
            >
              @{profile.handle}{" "}
              <span aria-hidden="true" className={styles.handleArrow}>
                ↗
              </span>
            </a>
          </p>
          {profile.intro.map((paragraph) => (
            <p
              key={paragraph}
              className="mt-4 text-[15px] leading-relaxed text-[#A3A3A3]"
            >
              {paragraph}
            </p>
          ))}

          {/* ── The strip: three photographs, set down ── */}
          <div className="mt-10 flex items-start gap-3">
            {prints.map((print, index) => (
              <Print
                key={print.label}
                label={print.label}
                tone={print.tone}
                step={index}
              />
            ))}
          </div>

          <p className="mt-8 text-xs text-[#6E6E6E]">{profile.now}</p>
        </section>

        <main>
          {/* ── The path ── */}
          <section
            id="path"
            aria-labelledby="path-heading"
            className="rise scroll-mt-10 pt-24"
            style={rise(2)}
          >
            <h2
              id="path-heading"
              className="mb-8 text-[14px] font-semibold text-[#F5F5F5]"
            >
              How I got here
            </h2>
            <ul className={`${styles.list} space-y-10`}>
              {path.map((item) => (
                <PathRow key={item.title} item={item} />
              ))}
            </ul>
          </section>

          {/* ── Links ── */}
          <section
            id="links"
            aria-labelledby="links-heading"
            className="rise scroll-mt-10 pt-24"
            style={rise(3)}
          >
            <h2
              id="links-heading"
              className="mb-8 text-[14px] font-semibold text-[#F5F5F5]"
            >
              Elsewhere
            </h2>
            <ul className={`${styles.list} space-y-8`}>
              {links.map((item) => (
                <LinkRow key={item.title} item={item} />
              ))}
            </ul>
          </section>
        </main>

        {/* ── Contact ── */}
        <footer
          id="contact"
          aria-labelledby="contact-heading"
          className="rise scroll-mt-10 pt-24 pb-8"
          style={rise(4)}
        >
          <h2
            id="contact-heading"
            className="mb-8 text-[14px] font-semibold text-[#F5F5F5]"
          >
            Contact
          </h2>
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
                    className={styles.social}
                  >
                    {social.label}{" "}
                    <span
                      aria-hidden="true"
                      className={`${styles.socialArrow} inline-block`}
                    >
                      ↗
                    </span>
                  </a>
                ) : (
                  <CopyHandle label={social.label} handle={social.handle} />
                )}
              </li>
            ))}
          </ul>
          <p className="mt-10 text-[13px] text-[#6E6E6E]">
            © 2026 {profile.name}
          </p>
        </footer>
      </div>

      {/* ── Version badge ── */}
      <Link
        href="/"
        aria-label="Back to all versions"
        className="fixed right-4 bottom-4 z-50 rounded-full border border-[#262626] bg-[#161616]/90 px-2.5 py-1 text-[11px] text-[#6E6E6E] transition-colors duration-150 hover:text-[#F5F5F5] motion-reduce:transition-none"
      >
        3 / 5
      </Link>
    </div>
  );
}
