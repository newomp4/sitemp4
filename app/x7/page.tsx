import type { Metadata } from "next";
import Link from "next/link";
import { profile, work, links, socials } from "@/lib/content";
import CopyDiscord from "./copy-discord";
import PeekList from "./peek-list";
import Row from "./row";
import styles from "./styles.module.css";

export const metadata: Metadata = {
  title: "Owen Opacki — Peek",
  description: profile.tagline,
};

export default function PeekPage() {
  const strip = (s: string) => s.replace(/\.\s*$/, "");
  const indexParts = (profile.intro[1] ?? "").split(". ");
  const bio = [profile.tagline, indexParts[0], indexParts[3]]
    .filter((s): s is string => Boolean(s))
    .map(strip)
    .join(". ");
  const now = strip(profile.now);

  return (
    <div
      className={`${styles.root} min-h-dvh w-full bg-[#111] lowercase text-[#ededed]`}
    >
      <div className="mx-auto w-full max-w-xl px-5 pt-12 pb-24 sm:pt-16">
        <nav aria-label="site" className="flex items-center gap-5">
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
          <h1 className="text-2xl font-semibold tracking-tight text-[#f5f5f5]">
            {profile.name}
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-[#a3a3a3]">
            {bio}
          </p>
          <p className="mt-4 font-mono text-xs text-[#525252]">{now}</p>
        </header>

        <main>
          <section
            id="work"
            aria-labelledby="work-heading"
            className="mt-16 scroll-mt-10"
          >
            <h2
              id="work-heading"
              className="mb-5 font-mono text-xs font-normal text-[#525252]"
            >
              work
            </h2>
            <PeekList items={work} />
          </section>

          <section
            id="links"
            aria-labelledby="links-heading"
            className="mt-14 scroll-mt-10"
          >
            <h2
              id="links-heading"
              className="mb-4 font-mono text-xs font-normal text-[#525252]"
            >
              links
            </h2>
            <ul className="space-y-5">
              {links.map((item) => (
                <li key={item.title}>
                  <Row item={item} />
                </li>
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
            className="mb-4 font-mono text-xs font-normal text-[#525252]"
          >
            contact
          </h2>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2.5">
            {socials.map((s) => (
              <li key={s.label}>
                {s.href ? (
                  <a
                    href={s.href}
                    {...(s.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    aria-label={`${s.label.toLowerCase()} — ${s.handle}`}
                    className="text-sm text-[#a3a3a3] transition-colors duration-150 ease-in-out hover:text-[#ededed] motion-reduce:transition-none"
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

      <Link
        href="/"
        aria-label="back to all versions"
        className="fixed right-4 bottom-4 z-50 rounded-full border border-[#262626] bg-[#161616]/90 px-2.5 py-1 font-mono text-[11px] text-[#6E6E6E] transition-colors duration-150 hover:text-[#F5F5F5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5F5F5]"
      >
        07 / 10
      </Link>
    </div>
  );
}
