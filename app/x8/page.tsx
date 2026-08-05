import type { Metadata } from "next";
import Link from "next/link";
import { profile, work, links, socials, type LinkItem } from "@/lib/content";
import CopyDiscord from "./CopyDiscord";
import styles from "./styles.module.css";

export const metadata: Metadata = {
  title: "Owen Opacki — Reveal",
  description: profile.tagline,
};

function host(href: string): string {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

/* Work + link rows: title only at rest; year + hostname slide open inline
   on hover/focus. Meta is computed here, on the server — no client JS. */
function Row({ item }: { item: LinkItem }) {
  const external = item.external ?? /^https?:/.test(item.href);
  const meta = [item.year, host(item.href)].filter(Boolean).join(" · ");
  return (
    <li>
      <a
        href={item.href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={`${styles.trigger} block`}
      >
        <span className="block text-[16px] leading-snug">
          <span className={styles.title}>{item.title}</span>
          {meta && (
            <span className={styles.reveal}>
              <span
                className={`${styles.revealInner} font-mono text-[11px] text-[#525252]`}
              >
                {` · ${meta}`}
              </span>
            </span>
          )}
        </span>
        {item.description && (
          <span className="mt-1 block text-[13px] leading-relaxed text-[#737373]">
            {item.description}
          </span>
        )}
      </a>
    </li>
  );
}

export default function RevealPage() {
  return (
    <div className={`${styles.root} min-h-dvh w-full bg-[#111111] text-[#ededed]`}>
      <div className="mx-auto w-full max-w-xl px-5 pt-16 pb-24 sm:pt-24">
        {/* ── Header ── */}
        <header>
          <h1 className="text-[22px] font-semibold tracking-tight text-[#f5f5f5]">
            {profile.name}
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-[#a3a3a3]">
            {profile.intro[0]}
          </p>
          <p className="mt-5 font-mono text-xs text-[#525252]">{profile.now}</p>
        </header>

        <main>
          {/* ── Work ── */}
          <section aria-labelledby="work-heading" className="mt-16">
            <h2
              id="work-heading"
              className="mb-5 font-mono text-[11px] font-normal text-[#525252]"
            >
              work
            </h2>
            <ul className="space-y-6">
              {work.map((item) => (
                <Row key={item.title} item={item} />
              ))}
            </ul>
          </section>

          {/* ── Links ── */}
          <section aria-labelledby="links-heading" className="mt-14">
            <h2
              id="links-heading"
              className="mb-5 font-mono text-[11px] font-normal text-[#525252]"
            >
              links
            </h2>
            <ul className="space-y-5">
              {links.map((item) => (
                <Row key={item.title} item={item} />
              ))}
            </ul>
          </section>
        </main>

        {/* ── Contact ── */}
        <footer aria-labelledby="contact-heading" className="mt-14">
          <h2
            id="contact-heading"
            className="mb-5 font-mono text-[11px] font-normal text-[#525252]"
          >
            contact
          </h2>
          <ul className="flex flex-wrap items-baseline gap-x-5 gap-y-2.5">
            {socials.map((s) => (
              <li key={s.label}>
                {s.href ? (
                  <a
                    href={s.href}
                    {...(s.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    aria-label={`${s.label} — ${s.handle}`}
                    className={`${styles.trigger} ${styles.social} text-[14px]`}
                  >
                    {s.label}
                    <span className={styles.reveal} aria-hidden="true">
                      <span
                        className={`${styles.revealInner} font-mono text-[12px] text-[#6E6E6E]`}
                      >
                        {` ${s.handle}`}
                      </span>
                    </span>
                  </a>
                ) : (
                  <CopyDiscord label={s.label} handle={s.handle} />
                )}
              </li>
            ))}
          </ul>
        </footer>
      </div>

      {/* ── Version badge ── */}
      <Link
        href="/"
        aria-label="Back to all versions"
        className="fixed right-4 bottom-4 z-50 rounded-full border border-[#262626] bg-[#161616]/90 px-2.5 py-1 font-mono text-[11px] text-[#6E6E6E] transition-colors duration-150 hover:text-[#F5F5F5] motion-reduce:transition-none"
      >
        08 / 10
      </Link>
    </div>
  );
}
