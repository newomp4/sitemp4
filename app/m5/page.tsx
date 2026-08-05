import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { profile, work, links, socials, type LinkItem } from "@/lib/content";
import Arrow from "./Arrow";
import SocialsRow from "./SocialsRow";
import styles from "./styles.module.css";

export const metadata: Metadata = {
  title: "Owen Opacki — Prompt",
  description: profile.tagline,
};

function Row({ item }: { item: LinkItem }) {
  const external = item.external ?? /^https?:/.test(item.href);
  return (
    <li>
      <a
        href={item.href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="group block"
      >
        {item.year && (
          <p className="font-mono text-[12px] text-[#525252]">{item.year}</p>
        )}
        <h3 className="mt-1 flex items-center gap-1.5 text-[15px] font-medium text-[#E8E8E8] transition-colors duration-150 group-hover:text-[#FAFAFA]">
          {item.title}
          <span
            aria-hidden="true"
            className="transition-transform duration-150 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
          >
            <Arrow />
          </span>
        </h3>
        {item.description && (
          <p className="mt-1 text-[14px] leading-relaxed text-[#737373]">
            {item.description}
          </p>
        )}
      </a>
    </li>
  );
}

export default function PromptPage() {
  const typedName = profile.name.toLowerCase();
  const bootVars = {
    "--typed-w": `${typedName.length}ch`,
    "--typed-steps": `${typedName.length}`,
    "--typed-dur": `${typedName.length * 60}ms`,
  } as CSSProperties;

  return (
    <div
      className={`${styles.root} min-h-dvh w-full bg-[#101010] text-[#EDEDED]`}
    >
      <main className="mx-auto w-full max-w-xl px-5 pt-24 pb-24">
        {/* ── Boot ── */}
        <header>
          <h1
            style={bootVars}
            className="font-mono text-[15px] font-medium text-[#EDEDED]"
          >
            <span aria-hidden="true" className="text-[#525252]">
              ~ %{" "}
            </span>
            <span className={styles.typed}>{typedName}</span>
            <span aria-hidden="true" className={styles.cursor} />
          </h1>

          <div className={`${styles.boot} mt-6`}>
            <div className="space-y-3">
              {profile.intro.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-[15px] leading-relaxed text-[#A3A3A3]"
                >
                  {paragraph.toLowerCase()}
                </p>
              ))}
            </div>
            <p className="mt-5 font-mono text-[12px] text-[#525252]">
              {profile.now.toLowerCase()}
            </p>
          </div>
        </header>

        {/* ── Everything after the prompt ── */}
        <div
          className={styles.boot}
          style={{ "--boot-delay": "1.05s" } as CSSProperties}
        >
          <div className="mt-16 space-y-16">
            <section aria-labelledby="work-heading">
              <h2
                id="work-heading"
                className="font-mono text-[12px] font-normal text-[#525252]"
              >
                <span aria-hidden="true">~ % ls </span>work
              </h2>
              <ul className="mt-6 space-y-8">
                {work.map((item) => (
                  <Row key={item.title} item={item} />
                ))}
              </ul>
            </section>

            <section aria-labelledby="links-heading">
              <h2
                id="links-heading"
                className="font-mono text-[12px] font-normal text-[#525252]"
              >
                <span aria-hidden="true">~ % ls </span>links
              </h2>
              <ul className="mt-6 space-y-7">
                {links.map((item) => (
                  <Row key={item.title} item={item} />
                ))}
              </ul>
            </section>

            <section aria-labelledby="socials-heading">
              <h2
                id="socials-heading"
                className="font-mono text-[12px] font-normal text-[#525252]"
              >
                <span aria-hidden="true">~ % whoami --</span>socials
              </h2>
              <div className="mt-6">
                <SocialsRow socials={socials} />
              </div>
            </section>
          </div>

          <footer className="mt-16">
            <p className="font-mono text-[11px] text-[#3F3F3F]">exit 0</p>
          </footer>
        </div>
      </main>

      {/* ── Version badge ── */}
      <Link
        href="/"
        aria-label="Back to all versions"
        className="fixed right-4 bottom-4 z-10 rounded-full border border-[#262626] bg-[#161616] px-2.5 py-1 font-mono text-[11px] leading-none text-[#6E6E6E] transition-colors duration-150 hover:text-[#E8E8E8]"
      >
        5 / 05
      </Link>
    </div>
  );
}
