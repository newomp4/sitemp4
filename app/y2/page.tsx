import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import {
  profile,
  path,
  links,
  socials,
  type PathItem,
  type LinkItem,
} from "@/lib/content";
import CopyHandle from "./copy-handle";
import Placeholder, { type Tone } from "./placeholder";
import styles from "./styles.module.css";

export const metadata: Metadata = {
  title: "Owen Opacki — Record",
  description: profile.tagline,
};

const rise = (step: number): CSSProperties =>
  ({ "--rise-delay": `${step * 0.06}s` }) as CSSProperties;

/* Each chapter's thumbnail gets its own quiet gradient. */
const CHAPTER_TONES: Tone[] = ["slate", "moss", "char"];

/* One chapter of the path. Resting state is a single line — years,
   title, role — with the note folded shut beneath. On hover or
   keyboard focus the row breathes open — revealing the note and a
   small thumbnail beside it; linkless chapters get a tabIndex so
   keyboard users can unfold them too. */
function Chapter({ item, tone }: { item: PathItem; tone: Tone }) {
  const external = item.external ?? /^https?:/.test(item.href ?? "");
  const inner = (
    <>
      <span className={`${styles.years} text-[12px]`}>{item.years}</span>
      <span className="min-w-0 text-[16px]">
        <span className={`${styles.title} font-medium`}>{item.title}</span>
        {item.role && <span className="text-[#8A8A8A]"> · {item.role}</span>}
      </span>
      {item.href && (
        <span aria-hidden="true" className={`${styles.arrow} text-[#A3A3A3]`}>
          ↗
        </span>
      )}
      {item.note && (
        <span className={`${styles.reveal} col-span-2 col-start-2`}>
          <span className={styles.revealInner}>
            <span className="flex items-start gap-4 pt-2">
              <Placeholder
                tone={tone}
                className="aspect-[4/3] w-24 flex-none rounded-md"
              />
              <span className="min-w-0 text-[14px] leading-relaxed text-[#A3A3A3]">
                {item.note}
              </span>
            </span>
          </span>
        </span>
      )}
    </>
  );
  const grid =
    "grid grid-cols-[6rem_minmax(0,1fr)_auto] items-baseline gap-x-4 py-3";
  return (
    <li>
      {item.href ? (
        <a
          href={item.href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className={grid}
        >
          {inner}
        </a>
      ) : (
        <div tabIndex={0} className={grid}>
          {inner}
        </div>
      )}
    </li>
  );
}

/* Quiet single-line link row — underline draws, arrow slides in late. */
function QuietRow({ item }: { item: LinkItem }) {
  const external = item.external ?? /^https?:/.test(item.href);
  return (
    <li>
      <a
        href={item.href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={`${styles.linkRow} inline-flex flex-wrap items-baseline gap-x-2 text-[15px]`}
      >
        <span className={styles.linkTitle}>{item.title}</span>
        {item.description && (
          <span className="text-[#6E6E6E]">· {item.description}</span>
        )}
        <span aria-hidden="true" className={`${styles.linkArrow} text-[#A3A3A3]`}>
          ↗
        </span>
      </a>
    </li>
  );
}

export default function RecordPage() {
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
          <a
            href={profile.handleHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`@${profile.handle} on Twitter`}
            className={`${styles.handle} mt-3 text-[15px] font-medium`}
          >
            @{profile.handle}{" "}
            <span
              aria-hidden="true"
              className={`${styles.handleArrow} inline-block`}
            >
              ↗
            </span>
          </a>
          {profile.intro.map((paragraph) => (
            <p
              key={paragraph}
              className="mt-4 text-[15px] leading-relaxed text-[#A3A3A3] first-of-type:mt-6"
            >
              {paragraph}
            </p>
          ))}
          <p className="mt-6 text-xs text-[#6E6E6E]">{profile.now}</p>
        </section>

        {/* ── Photo — always visible, art breathes on hover ── */}
        <div className="rise mt-16" style={rise(2)}>
          <Placeholder
            tone="wide"
            className={`${styles.photo} aspect-[16/10] w-full rounded-lg`}
          />
        </div>

        <main>
          {/* ── The path ── */}
          <section
            id="path"
            aria-labelledby="path-heading"
            className="rise scroll-mt-10 pt-24"
            style={rise(3)}
          >
            <h2
              id="path-heading"
              className="mb-5 text-[14px] font-semibold text-[#F5F5F5]"
            >
              The path
            </h2>
            <ul className={styles.list}>
              {path.map((item, index) => (
                <Chapter
                  key={item.title}
                  item={item}
                  tone={CHAPTER_TONES[index % CHAPTER_TONES.length]}
                />
              ))}
            </ul>
          </section>

          {/* ── Links ── */}
          <section
            id="links"
            aria-labelledby="links-heading"
            className="rise scroll-mt-10 pt-24"
            style={rise(4)}
          >
            <h2
              id="links-heading"
              className="mb-6 text-[14px] font-semibold text-[#F5F5F5]"
            >
              Elsewhere
            </h2>
            <ul className="space-y-4">
              {links.map((item) => (
                <QuietRow key={item.title} item={item} />
              ))}
            </ul>
          </section>
        </main>

        {/* ── Contact ── */}
        <footer
          id="contact"
          aria-labelledby="contact-heading"
          className="rise scroll-mt-10 pt-24 pb-8"
          style={rise(5)}
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
        2 / 5
      </Link>
    </div>
  );
}
