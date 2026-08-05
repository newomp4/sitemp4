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
import CopyDiscord from "./CopyDiscord";
import styles from "./styles.module.css";

export const metadata: Metadata = {
  title: "Owen Opacki — Thread",
  description: profile.tagline,
};

const rise = (step: number): CSSProperties =>
  ({ "--rise-delay": `${step * 0.06}s` }) as CSSProperties;

function host(href: string): string {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

/* ── A chapter of the path ──
   Rests as years + title. On hover/focus-within the role slides open
   inline after the title (x8's 0fr → 1fr), the note rises in beneath a
   beat later, and — on linked rows — the ↗ arrives last. */
function PathRow({ item }: { item: PathItem }) {
  const inner = (
    <>
      <span className="block font-mono text-[12px] text-[#6E6E6E]">
        {item.years}
      </span>
      <span className="mt-1 block sm:mt-0">
        <span className="block text-[16px] leading-snug font-medium">
          <span className={styles.pathTitle}>{item.title}</span>
          {item.role && (
            <span className={styles.reveal}>
              <span
                className={`${styles.revealInner} font-mono text-[12px] text-[#6E6E6E]`}
              >
                {` · ${item.role}`}
              </span>
            </span>
          )}
          {item.href && (
            <>
              {" "}
              <span
                aria-hidden="true"
                className={`${styles.pathArrow} inline-block text-[#A3A3A3]`}
              >
                ↗
              </span>
            </>
          )}
        </span>
        {item.note && (
          <span
            className={`${styles.note} mt-1 block text-[14px] leading-relaxed text-[#A3A3A3]`}
          >
            {item.note}
          </span>
        )}
      </span>
    </>
  );
  const layout = "sm:grid sm:grid-cols-[6.5rem_1fr] sm:items-baseline sm:gap-x-6";
  const external = item.external ?? /^https?:/.test(item.href ?? "");
  return (
    <li>
      {item.href ? (
        <a
          href={item.href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className={`block ${layout}`}
        >
          {inner}
        </a>
      ) : (
        <div className={layout}>{inner}</div>
      )}
    </li>
  );
}

/* Link rows: single line, hostname slides open — same mechanic, quieter. */
function LinkRow({ item }: { item: LinkItem }) {
  const external = item.external ?? /^https?:/.test(item.href);
  const hostname = host(item.href);
  return (
    <li>
      <a
        href={item.href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={`${styles.trigger} block text-[15px] leading-snug`}
      >
        <span className={styles.linkTitle}>{item.title}</span>
        {hostname && (
          <span className={styles.reveal}>
            <span
              className={`${styles.revealInner} font-mono text-[12px] text-[#6E6E6E]`}
            >
              {` · ${hostname}`}
            </span>
          </span>
        )}
      </a>
    </li>
  );
}

export default function ThreadPage() {
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
          {/* The @ is the identity of the page. */}
          <p className="mt-3">
            <a
              href={profile.handleHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`@${profile.handle} on Twitter`}
              className={`${styles.trigger} ${styles.handle} font-mono text-[17px]`}
            >
              <span className={styles.handleText}>@{profile.handle}</span>
              <span className={styles.reveal} aria-hidden="true">
                <span
                  className={`${styles.revealInner} text-[13px] text-[#6E6E6E]`}
                >
                  {" · this is where to find me"}
                </span>
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
          <p className="mt-6 font-mono text-xs text-[#6E6E6E]">{profile.now}</p>
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
              The path so far
            </h2>
            <ul className={`${styles.pathList} space-y-8`}>
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
              Along the way
            </h2>
            <ul className="space-y-4">
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
            Pick up the thread
          </h2>
          <ul className="flex flex-wrap items-baseline gap-x-5 gap-y-3">
            {socials.map((social) => (
              <li key={social.label}>
                {social.href ? (
                  <a
                    href={social.href}
                    {...(social.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    aria-label={`${social.label} — ${social.handle}`}
                    className={`${styles.trigger} ${styles.social} text-[15px]`}
                  >
                    {social.label}
                    <span className={styles.reveal} aria-hidden="true">
                      <span
                        className={`${styles.revealInner} font-mono text-[12px] text-[#6E6E6E]`}
                      >
                        {` ${social.handle}`}
                      </span>
                    </span>
                  </a>
                ) : (
                  <CopyDiscord label={social.label} handle={social.handle} />
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
        className="fixed right-4 bottom-4 z-50 rounded-full border border-[#262626] bg-[#161616]/90 px-2.5 py-1 font-mono text-[11px] text-[#6E6E6E] transition-colors duration-150 hover:text-[#F5F5F5] motion-reduce:transition-none"
      >
        4 / 5
      </Link>
    </div>
  );
}
