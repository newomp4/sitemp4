import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { profile, work, links, socials, type LinkItem } from "@/lib/content";
import CopyRow from "./CopyRow";
import styles from "./styles.module.css";

export const metadata: Metadata = {
  title: "Owen Opacki — Dot Index",
  description: profile.tagline,
};

const rise = (step: number): CSSProperties =>
  ({ "--rise-delay": `${step * 0.04}s` }) as CSSProperties;

function host(href: string): string {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

/* Work + link rows: the one non-mono element is the Inter title. */
function TocRow({
  item,
  right,
  style,
}: {
  item: LinkItem;
  right?: string;
  style: CSSProperties;
}) {
  const external = item.external ?? /^https?:/.test(item.href);
  return (
    <li className="rise" style={style}>
      <a
        href={item.href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={`${styles.row} block py-4`}
      >
        <span className="flex items-baseline gap-3">
          <span className={styles.dot} aria-hidden="true" />
          <span className="font-sans text-[15px] leading-snug font-medium text-[#EDEDED]">
            {item.title}
          </span>
          <span className={styles.leader} aria-hidden="true" />
          {right && (
            <span className={`${styles.year} text-xs whitespace-nowrap`}>
              {right}
            </span>
          )}
        </span>
        {item.description && (
          <span className="mt-1.5 block pl-[17px] text-[13px] leading-relaxed lowercase text-[#6E6E6E]">
            {item.description}
          </span>
        )}
      </a>
    </li>
  );
}

export default function DotIndexPage() {
  // hero fragments, woven from the intro
  const [heroLead = "", heroRest = ""] = profile.intro[0].split(" — ");
  const sentences = profile.intro[1].split(". ");
  const heroLines = [
    `${heroLead}.`,
    heroRest,
    `${sentences[0]}. ${sentences[sentences.length - 1]}`,
  ];

  const index = [
    { label: "work", href: "#work", count: work.length },
    { label: "links", href: "#links", count: links.length },
    { label: "elsewhere", href: "#elsewhere", count: socials.length },
  ];

  // rise-stagger bookkeeping, 40ms per step
  const navBase = 2;
  const workLabelStep = navBase + index.length;
  const workBase = workLabelStep + 1;
  const linksLabelStep = workBase + work.length;
  const linksBase = linksLabelStep + 1;
  const socialLabelStep = linksBase + links.length;
  const socialBase = socialLabelStep + 1;
  const footerStep = socialBase + socials.length;

  return (
    <div
      className={`${styles.root} min-h-dvh w-full bg-[#0E0E0E] font-mono text-[14px] text-[#EDEDED]`}
    >
      <main className="mx-auto w-full max-w-2xl px-6 pt-20 pb-24 sm:pt-28">
        {/* ── Header ── */}
        <header
          className="rise flex items-baseline justify-between gap-4"
          style={rise(0)}
        >
          <h1 className="text-[14px] font-normal lowercase">
            {profile.name}
            <span className={styles.marker} aria-hidden="true" />
          </h1>
          <p className="text-xs text-[#525252]">@{profile.handle}</p>
        </header>

        {/* ── Hero ── */}
        <section className="rise mt-14" style={rise(1)} aria-label="intro">
          {heroLines.map((line) => (
            <p
              key={line}
              className="text-[14px] leading-relaxed lowercase text-[#A3A3A3]"
            >
              {line}
            </p>
          ))}
          <p className="mt-5 text-xs leading-relaxed lowercase text-[#525252]">
            {profile.now}
          </p>
        </section>

        {/* ── Index (nav) ── */}
        <nav className="mt-12" aria-label="index">
          <ul>
            {index.map((n, i) => (
              <li key={n.label} className="rise" style={rise(navBase + i)}>
                <a
                  href={n.href}
                  className={`${styles.row} flex items-baseline gap-3 py-2.5`}
                >
                  <span className={styles.dot} aria-hidden="true" />
                  <span className="text-[13px] lowercase text-[#A3A3A3]">
                    {n.label}
                  </span>
                  <span className={styles.leader} aria-hidden="true" />
                  <span className={`${styles.year} text-xs`}>
                    {String(n.count).padStart(2, "0")}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Work ── */}
        <section
          id="work"
          className="mt-14 scroll-mt-8"
          aria-labelledby="work-label"
        >
          <h2
            id="work-label"
            className="rise mb-1 text-xs font-normal lowercase text-[#525252]"
            style={rise(workLabelStep)}
          >
            <span aria-hidden="true" className="text-[#ec9d5d]/50">
              ·
            </span>{" "}
            work
          </h2>
          <ul>
            {work.map((item, i) => (
              <TocRow
                key={item.title}
                item={item}
                right={item.year}
                style={rise(workBase + i)}
              />
            ))}
          </ul>
        </section>

        {/* ── Links ── */}
        <section
          id="links"
          className="mt-12 scroll-mt-8"
          aria-labelledby="links-label"
        >
          <h2
            id="links-label"
            className="rise mb-1 text-xs font-normal lowercase text-[#525252]"
            style={rise(linksLabelStep)}
          >
            <span aria-hidden="true" className="text-[#ec9d5d]/50">
              ·
            </span>{" "}
            links
          </h2>
          <ul>
            {links.map((item, i) => (
              <TocRow
                key={item.title}
                item={item}
                right={host(item.href)}
                style={rise(linksBase + i)}
              />
            ))}
          </ul>
        </section>

        {/* ── Elsewhere (socials) ── */}
        <section
          id="elsewhere"
          className="mt-12 scroll-mt-8"
          aria-labelledby="elsewhere-label"
        >
          <h2
            id="elsewhere-label"
            className="rise mb-1 text-xs font-normal lowercase text-[#525252]"
            style={rise(socialLabelStep)}
          >
            <span aria-hidden="true" className="text-[#ec9d5d]/50">
              ·
            </span>{" "}
            elsewhere
          </h2>
          <ul>
            {socials.map((s, i) => (
              <li key={s.label} className="rise" style={rise(socialBase + i)}>
                {s.href ? (
                  <a
                    href={s.href}
                    {...(s.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    aria-label={`${s.label.toLowerCase()} — ${s.handle}`}
                    className={`${styles.row} flex items-baseline gap-3 py-2.5`}
                  >
                    <span className={styles.dot} aria-hidden="true" />
                    <span className="text-[13px] lowercase text-[#EDEDED]">
                      {s.label}
                    </span>
                    <span className={styles.leader} aria-hidden="true" />
                    <span
                      className={`${styles.year} shrink-0 text-xs whitespace-nowrap`}
                    >
                      {s.handle}
                    </span>
                  </a>
                ) : (
                  <CopyRow label={s.label} handle={s.handle} />
                )}
              </li>
            ))}
          </ul>
        </section>

        {/* ── End of index ── */}
        <footer className="rise mt-20" style={rise(footerStep)}>
          <p className="text-[11px] lowercase text-[#525252]">
            © 2026 {profile.name}
          </p>
        </footer>
      </main>

      {/* ── Version badge ── */}
      <Link
        href="/"
        aria-label="back to all versions"
        className="fixed right-4 bottom-4 z-50 rounded-full border border-[#232323] bg-[#161616] px-2.5 py-1 font-mono text-[11px] leading-none text-[#525252] transition-colors duration-150 ease-out hover:text-[#A3A3A3]"
      >
        3 / 05
      </Link>
    </div>
  );
}
