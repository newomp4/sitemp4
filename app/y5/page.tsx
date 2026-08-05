import type { Metadata } from "next";
import { Fragment, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import {
  profile,
  path,
  links,
  socials,
  type PathItem,
  type Social,
} from "@/lib/content";
import CopyDiscord from "./copy-discord";
import styles from "./styles.module.css";

export const metadata: Metadata = {
  title: "Owen Opacki — Story",
  description: profile.tagline,
};

const rise = (step: number): CSSProperties =>
  ({ "--rise-delay": `${step * 0.06}s` }) as CSSProperties;

const blank = { target: "_blank", rel: "noopener noreferrer" } as const;

/** Lowercase a plainly-capitalized lead word so roles sit mid-sentence;
 *  acronyms and CamelCase names ("YouTube") pass through untouched. */
function lowerLead(text: string): string {
  const [first = "", ...rest] = text.split(" ");
  return /^[A-Z][a-z]*$/.test(first)
    ? [first.charAt(0).toLowerCase() + first.slice(1), ...rest].join(" ")
    : text;
}

/** Make sure a note reads as a full sentence. */
function endStop(text: string): string {
  const trimmed = text.trim();
  return /[.!?…]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

/** Comma-join keyed nodes with a closing "and" / "or". */
function joinNodes(nodes: ReactNode[], conj: "and" | "or" = "and"): ReactNode[] {
  return nodes.flatMap((node, i) => {
    if (i === 0) return [node];
    if (i === nodes.length - 1)
      return [nodes.length > 2 ? `, ${conj} ` : ` ${conj} `, node];
    return [", ", node];
  });
}

function ProseLink({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: ReactNode;
}) {
  const isExternal = external ?? /^https?:/.test(href);
  return (
    <a
      href={href}
      {...(isExternal ? blank : {})}
      className={styles.proseLink}
    >
      {children}
      <span aria-hidden="true" className={styles.miniArrow}>
        ↗
      </span>
    </a>
  );
}

/** A chapter's name: an inline link when it has one, plain emphasis when not. */
function ChapterName({ item }: { item: PathItem }) {
  if (!item.href) {
    return <span className="font-medium text-[#D4D4D4]">{item.title}</span>;
  }
  return (
    <ProseLink href={item.href} external={item.external}>
      {item.title}
    </ProseLink>
  );
}

/** One chapter of the path, folded into the running paragraph. */
function chapterSentence(item: PathItem, index: number, count: number): ReactNode {
  const isLast = count > 1 && index === count - 1;
  const lead = index === 0 ? "These days" : isLast ? "And it started" : "Before that";
  const joiner = index === 0 ? "I'm at" : isLast ? "with" : "I was at";
  return (
    <Fragment key={`${item.years} ${item.title}`}>
      {index > 0 ? " " : ""}
      {lead} <span className="text-[#6E6E6E]">({item.years})</span> {joiner}{" "}
      <ChapterName item={item} />
      {item.role ? <> — {lowerLead(item.role)}</> : null}
      {"."}
      {item.note ? <> {endStop(item.note)}</> : null}
    </Fragment>
  );
}

export default function StoryPage() {
  const socialLinks = socials.filter(
    (s): s is Social & { href: string } =>
      typeof s.href === "string" && !s.href.startsWith("mailto:"),
  );
  const copyables = socials.filter((s) => !s.href && s.copyToClipboard);
  const mail = socials.find((s) => s.href?.startsWith("mailto:"));

  return (
    <div className={`${styles.root} min-h-dvh w-full bg-[#111111]`}>
      <div className="mx-auto w-full max-w-[42rem] px-6 py-16 sm:py-24">
        {/* ── Top: just the name ── */}
        <header className="rise" style={rise(0)}>
          <span className="text-[14px] font-semibold text-[#F5F5F5]">
            {profile.name}
          </span>
        </header>

        <main>
          {/* ── The letter ── */}
          <section
            aria-labelledby="story-heading"
            className="mt-16 max-w-[38rem] sm:mt-20"
          >
            <h1
              id="story-heading"
              className="rise text-[26px] font-semibold tracking-tight text-[#F5F5F5]"
              style={rise(1)}
            >
              {profile.headline}
            </h1>

            {/* The byline — how people actually know him */}
            <p className="rise mt-3 font-mono text-[15px]" style={rise(2)}>
              <a href={profile.handleHref} {...blank} className={styles.handle}>
                <span className={styles.at}>@</span>
                {profile.handle}{" "}
                <span
                  aria-hidden="true"
                  className={`${styles.handleArrow} inline-block`}
                >
                  ↗
                </span>
              </a>
            </p>

            <div
              className="rise mt-10 space-y-5 text-[16px] leading-relaxed text-[#A3A3A3]"
              style={rise(3)}
            >
              {profile.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <p>
                {path.map((item, index) =>
                  chapterSentence(item, index, path.length),
                )}
              </p>
            </div>

            <p
              className="rise mt-10 font-mono text-xs text-[#6E6E6E]"
              style={rise(4)}
            >
              {profile.now}
            </p>

            {/* A quiet index of the same story, for scanners */}
            <ol
              aria-label="Timeline"
              className={`${styles.timeline} rise mt-10 space-y-2 font-mono text-[12px] text-[#6E6E6E]`}
              style={rise(4)}
            >
              {path.map((item) => {
                const label = `${item.years} · ${item.title}`;
                const isExternal =
                  item.external ?? /^https?:/.test(item.href ?? "");
                return (
                  <li key={`${item.years} ${item.title}`}>
                    {item.href ? (
                      <a
                        href={item.href}
                        {...(isExternal ? blank : {})}
                        className={styles.timeLink}
                      >
                        {label}
                      </a>
                    ) : (
                      <span>{label}</span>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>

          {/* ── Elsewhere, one line ── */}
          <section
            aria-labelledby="links-heading"
            className="rise mt-16 max-w-[38rem]"
            style={rise(5)}
          >
            <h2 id="links-heading" className="sr-only">
              Elsewhere
            </h2>
            <p className="text-[16px] leading-relaxed text-[#A3A3A3]">
              Elsewhere, a few things worth a click —{" "}
              {joinNodes(
                links.map((item) => (
                  <ProseLink
                    key={item.title}
                    href={item.href}
                    external={item.external}
                  >
                    {item.title}
                  </ProseLink>
                )),
              )}
              {"."}
            </p>
          </section>
        </main>

        {/* ── Contact, one sentence ── */}
        <footer
          aria-labelledby="contact-heading"
          className="rise mt-16 max-w-[38rem] pb-8"
          style={rise(6)}
        >
          <h2 id="contact-heading" className="sr-only">
            Contact
          </h2>
          <p className="text-[16px] leading-relaxed text-[#A3A3A3]">
            Find me on{" "}
            {joinNodes(
              socialLinks.map((s) => (
                <ProseLink key={s.label} href={s.href}>
                  {s.label}
                </ProseLink>
              )),
            )}
            {copyables.length > 0 && (
              <>
                , copy my{" "}
                {joinNodes(
                  copyables.map((s) => (
                    <CopyDiscord key={s.label} label={s.label} handle={s.handle} />
                  )),
                  "or",
                )}
              </>
            )}
            {mail?.href && (
              <>
                , or email me at{" "}
                <ProseLink href={mail.href}>{mail.handle}</ProseLink>
              </>
            )}
            {"."}
          </p>
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
        5 / 5
      </Link>
    </div>
  );
}
