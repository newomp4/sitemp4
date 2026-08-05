import type * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { profile, work, links, socials } from "@/lib/content";
import DiscordCopy from "./DiscordCopy";
import styles from "./styles.module.css";

export const metadata: Metadata = {
  title: "Owen — Document",
  description: profile.tagline,
};

/* ── Gray inline icons (Notion property / page glyphs) ─────────── */

function StatusIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true" {...props}>
      <circle cx="8" cy="8" r="5.75" />
      <circle cx="8" cy="8" r="1.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function PersonIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true" {...props}>
      <circle cx="8" cy="5.25" r="2.75" />
      <path d="M2.9 13.75a5.35 5.35 0 0 1 10.2 0" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true" {...props}>
      <circle cx="8" cy="8" r="5.75" />
      <path d="M8 5v3.2l2.1 1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PageGlyph(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true" {...props}>
      <path
        d="M4.25 1.75H9.5L12.5 4.75V13.25A1 1 0 0 1 11.5 14.25H4.25A1 1 0 0 1 3.25 13.25V2.75A1 1 0 0 1 4.25 1.75Z"
        strokeLinejoin="round"
      />
      <path d="M9.5 1.75V4.75H12.5" strokeLinejoin="round" />
      <path d="M5.5 8H10.25M5.5 10.5H10.25" strokeLinecap="round" />
    </svg>
  );
}

function GlobeIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true" {...props}>
      <circle cx="8" cy="8" r="5.75" />
      <ellipse cx="8" cy="8" rx="2.6" ry="5.75" />
      <path d="M2.25 8H13.75" />
    </svg>
  );
}

/* ── Small building blocks ─────────────────────────────────────── */

function PropertyRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`-mx-2 flex items-start gap-2 px-2 py-1 text-[14px] leading-[1.5] ${styles.block}`}>
      <span className="mt-[3px] shrink-0 text-[#9B9A97]">{icon}</span>
      <span className="w-24 shrink-0 text-[#787774]">{label}</span>
      <span className="min-w-0 text-[#37352F]">{children}</span>
    </div>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-2 mt-10 text-[24px] font-semibold leading-[1.3] text-[#37352F]">
      {children}
    </h2>
  );
}

function Divider() {
  return <div className="my-6 h-px bg-[#E9E9E7]" aria-hidden="true" />;
}

/* ── Page ──────────────────────────────────────────────────────── */

export default function DocumentPage() {
  const bioBlocks = profile.intro.filter((_, i) => i !== 1);
  const moreLine = profile.intro[1];

  return (
    <main className={`min-h-screen w-full bg-white text-[#37352F] ${styles.page}`}>
      <div className="mx-auto w-full max-w-[708px] px-6 pb-28 pt-24">
        {/* Page icon */}
        <span
          className={`inline-block cursor-default select-none text-[56px] leading-none ${styles.icon}`}
          aria-hidden="true"
        >
          🗿
        </span>

        {/* Title */}
        <h1 className="mt-4 text-[40px] font-bold leading-[1.2] tracking-tight text-[#37352F]">
          {profile.name}
        </h1>

        {/* Properties */}
        <div className="mt-6 flex flex-col">
          <PropertyRow icon={<StatusIcon className="h-4 w-4" />} label="Status">
            {profile.tagline}
          </PropertyRow>
          <PropertyRow icon={<PersonIcon className="h-4 w-4" />} label="Handle">
            @{profile.handle}
          </PropertyRow>
          <PropertyRow icon={<ClockIcon className="h-4 w-4" />} label="Now">
            {profile.now}
          </PropertyRow>
        </div>

        <Divider />

        {/* Bio blocks */}
        <div className="flex flex-col">
          {bioBlocks.map((paragraph) => (
            <p
              key={paragraph}
              className={`-mx-2 px-2 py-[3px] text-[16px] leading-[1.5] text-[#37352F] ${styles.block}`}
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Callout */}
        <div className="mt-4 flex gap-3 rounded-[6px] bg-[#F1F1EF] p-4 text-[14.5px] leading-[1.5] text-[#37352F]">
          <span className="mt-px select-none text-[17px] leading-[1.3]" aria-hidden="true">
            💡
          </span>
          <p>{profile.now}</p>
        </div>

        {/* Toggle */}
        {moreLine && (
          <details className={`mt-3 ${styles.toggle}`}>
            <summary
              className={`-mx-2 flex cursor-pointer select-none items-center gap-1 px-2 py-1 text-[16px] leading-[1.5] text-[#37352F] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#37352F] ${styles.block}`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center ${styles.caret}`}
                aria-hidden="true"
              >
                <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
                  <path d="M4 2.5L9 6L4 9.5Z" fill="currentColor" />
                </svg>
              </span>
              More about me
            </summary>
            <p className="py-[3px] pl-[24px] text-[16px] leading-[1.5] text-[#37352F]">
              {moreLine}
            </p>
          </details>
        )}

        {/* Work — sub-page rows */}
        <H2>Working on</H2>
        <div className="flex flex-col">
          {work.map((item) => (
            <a
              key={item.title}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group -mx-2 flex flex-col gap-0.5 px-2 py-1.5 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#37352F] ${styles.block}`}
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <PageGlyph className="h-[18px] w-[18px] shrink-0 text-[#9B9A97]" />
                <span className="border-b border-[rgba(55,53,47,0.16)] text-[16px] leading-[1.4] text-[#37352F]">
                  {item.title}
                </span>
                <span
                  aria-hidden="true"
                  className="-translate-x-1 text-[14px] text-[#9B9A97] opacity-0 transition-all duration-150 group-hover:translate-x-0 group-hover:text-[#37352F] group-hover:opacity-100"
                >
                  ↗
                </span>
              </span>
              {(item.year || item.description) && (
                <span className="pl-[28px] text-[14px] leading-[1.5] text-[#787774]">
                  {item.year}
                  {item.year && item.description ? " · " : ""}
                  {item.description}
                </span>
              )}
            </a>
          ))}
        </div>

        {/* Links — web bookmark cards */}
        <H2>Reading / using / linking</H2>
        <div className="flex flex-col gap-2">
          {links.map((item) => (
            <a
              key={item.href + item.title}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`block rounded-[6px] border border-[#E9E9E7] px-4 py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37352F] ${styles.card}`}
            >
              <span className="block truncate text-[14px] leading-[1.4] text-[#37352F]">
                {item.title}
              </span>
              {item.description && (
                <span className="mt-0.5 block truncate text-[12px] leading-[1.4] text-[#787774]">
                  {item.description}
                </span>
              )}
              <span className="mt-1.5 flex min-w-0 items-center gap-1.5 text-[12px] leading-[1.4] text-[#787774]">
                <GlobeIcon className="h-3 w-3 shrink-0" />
                <span className="truncate">{item.href}</span>
              </span>
            </a>
          ))}
        </div>

        {/* Socials */}
        <H2>Find me</H2>
        <div className="flex flex-col">
          {socials.map((social) =>
            social.copyToClipboard && !social.href ? (
              <DiscordCopy
                key={social.label}
                label={social.label}
                handle={social.handle}
              />
            ) : (
              <div
                key={social.label}
                className={`-mx-2 flex items-start gap-2 px-2 py-1 text-[14px] leading-[1.5] ${styles.block}`}
              >
                <span className="w-24 shrink-0 text-[#787774]">{social.label}</span>
                {social.href ? (
                  <a
                    href={social.href}
                    {...(social.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="min-w-0 break-all rounded-[2px] text-[#37352F] underline decoration-[rgba(55,53,47,0.3)] underline-offset-2 hover:decoration-[rgba(55,53,47,0.6)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37352F]"
                  >
                    {social.handle}
                  </a>
                ) : (
                  <span className="min-w-0 break-all text-[#37352F]">
                    {social.handle}
                  </span>
                )}
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16">
          <div className="mb-4 h-px bg-[#E9E9E7]" aria-hidden="true" />
          <p className="text-[12px] leading-[1.5] text-[#787774]">
            made by me, for me.{" "}
            <span className="text-[#9B9A97]">
              (the strings live in lib/content.ts)
            </span>
          </p>
        </footer>
      </div>

      {/* Version badge */}
      <Link
        href="/"
        aria-label="Back to the version index"
        className="fixed bottom-4 right-4 z-20 rounded-full border border-[#E9E9E7] bg-white px-2.5 py-1 font-mono text-[11px] text-[#787774] transition-colors duration-150 hover:bg-[#FAFAFA] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#37352F]"
      >
        3 / 05
      </Link>
    </main>
  );
}
