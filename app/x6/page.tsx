import type { Metadata } from "next";
import Link from "next/link";
import { profile, work, links, socials, type LinkItem } from "@/lib/content";
import CopyDiscord from "./CopyDiscord";
import styles from "./styles.module.css";

export const metadata: Metadata = {
  title: "Owen Opacki — Ledger",
  description: profile.tagline,
};

function host(href: string): string {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

/* One ledger entry: index / title + dotted leader / meta, with the
   description collapsed beneath until the row breathes open. */
function Row({ item, index }: { item: LinkItem; index: number }) {
  const external = item.external ?? /^https?:/.test(item.href);
  const right = item.year ?? host(item.href);
  return (
    <li className={styles.row}>
      <a
        href={item.href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="grid grid-cols-[auto_1fr_auto] items-baseline gap-x-3 py-2.5"
      >
        <span
          aria-hidden="true"
          className={`${styles.index} font-mono text-[11px]`}
        >
          {String(index).padStart(2, "0")}
        </span>
        <span className="flex min-w-0 items-baseline gap-x-3">
          <span className={`${styles.title} text-[16px]`}>{item.title}</span>
          <span className={styles.leader} aria-hidden="true" />
        </span>
        <span className="flex items-baseline gap-x-2 font-mono text-[11px] lowercase">
          <span className={styles.year}>{right}</span>
          <span className={styles.arrow} aria-hidden="true">
            ↗
          </span>
        </span>
        {item.description && (
          <span className={`${styles.reveal} col-span-2 col-start-2`}>
            <span className={styles.revealInner}>
              <span className="block pt-1.5 text-[13px] leading-relaxed text-[#737373]">
                {item.description}
              </span>
            </span>
          </span>
        )}
      </a>
    </li>
  );
}

export default function LedgerPage() {
  const strip = (s: string) => s.replace(/\.\s*$/, "");
  const indexSentence = (profile.intro[1] ?? "").split(". ")[0];
  const bio =
    [profile.tagline, indexSentence].filter(Boolean).map(strip).join(". ") +
    ".";

  return (
    <div className={`${styles.root} min-h-dvh w-full bg-[#111] text-[#ededed]`}>
      <div className="mx-auto w-full max-w-xl px-5 pt-12 pb-24 sm:pt-16">
        <nav
          aria-label="site"
          className="flex items-center gap-5 font-mono lowercase"
        >
          <a href="#work" className={styles.navLink}>
            work
          </a>
          <a href="#links" className={styles.navLink}>
            links
          </a>
          <a href="#contact" className={styles.navLink}>
            contact
          </a>
        </nav>

        <header className="mt-14 sm:mt-16">
          <h1 className="text-[22px] font-semibold tracking-tight text-[#f5f5f5]">
            {profile.name}
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-[#a3a3a3]">
            {bio}
          </p>
          <p className="mt-4 font-mono text-[11px] lowercase text-[#525252]">
            {strip(profile.now)}
          </p>
        </header>

        <main>
          <section
            id="work"
            aria-labelledby="work-heading"
            className="mt-16 scroll-mt-10"
          >
            <h2
              id="work-heading"
              className="mb-2 font-mono text-xs font-normal lowercase text-[#525252]"
            >
              work
            </h2>
            <ul className={styles.list}>
              {work.map((item, i) => (
                <Row key={item.title} item={item} index={i + 1} />
              ))}
            </ul>
          </section>

          <section
            id="links"
            aria-labelledby="links-heading"
            className="mt-12 scroll-mt-10"
          >
            <h2
              id="links-heading"
              className="mb-2 font-mono text-xs font-normal lowercase text-[#525252]"
            >
              links
            </h2>
            <ul className={styles.list}>
              {links.map((item, i) => (
                <Row
                  key={item.title}
                  item={item}
                  index={work.length + i + 1}
                />
              ))}
            </ul>
          </section>
        </main>

        <footer
          id="contact"
          aria-labelledby="contact-heading"
          className="mt-14 scroll-mt-10"
        >
          <h2
            id="contact-heading"
            className="mb-4 font-mono text-xs font-normal lowercase text-[#525252]"
          >
            contact
          </h2>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2.5 lowercase">
            {socials.map((s) => (
              <li key={s.label}>
                {s.href ? (
                  <a
                    href={s.href}
                    {...(s.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    aria-label={`${s.label.toLowerCase()} — ${s.handle}`}
                    className="text-[13px] text-[#a3a3a3] transition-colors duration-150 ease-in-out hover:text-[#ededed] motion-reduce:transition-none"
                  >
                    {s.label}
                  </a>
                ) : (
                  <CopyDiscord label={s.label} handle={s.handle} />
                )}
              </li>
            ))}
          </ul>
        </footer>
      </div>

      {/* ── Version badge (m1 styling) ── */}
      <Link
        href="/"
        aria-label="Back to all versions"
        className="fixed right-4 bottom-4 z-50 rounded-full border border-[#262626] bg-[#161616]/90 px-2.5 py-1 font-mono text-[11px] text-[#6E6E6E] transition-colors duration-150 hover:text-[#F5F5F5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5F5F5]"
      >
        06 / 10
      </Link>
    </div>
  );
}
