import type { Metadata } from "next";
import Link from "next/link";
import { profile, work, links, socials } from "@/lib/content";
import CopyDiscord from "./CopyDiscord";
import Still from "./Still";
import styles from "./styles.module.css";

export const metadata: Metadata = {
  title: "Owen Opacki — Gallery",
  description: profile.tagline,
};

const socialLink =
  "text-[13px] text-[#a3a3a3] transition-colors duration-150 ease-in-out hover:text-[#ededed] motion-reduce:transition-none";

export default function GalleryPage() {
  return (
    <div className={`${styles.root} min-h-dvh w-full bg-[#111] text-[#ededed]`}>
      <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-x-14 gap-y-16 px-6 py-16 sm:grid-cols-[260px_1fr] sm:py-24">
        {/* ── Left: sticky intro ── */}
        <div className="sm:sticky sm:top-24 sm:self-start">
          <header>
            <p className="text-[15px] font-semibold text-[#f5f5f5]">
              {profile.name}
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-[#a3a3a3]">
              {profile.intro[0]}
            </p>
            <p className="mt-4 font-mono text-[11px] text-[#525252]">
              {profile.now}
            </p>
          </header>

          <nav
            aria-label="Sections"
            className="mt-10 flex flex-col items-start gap-3 lowercase"
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

          <section
            id="contact"
            aria-labelledby="contact-heading"
            className="mt-10 scroll-mt-10"
          >
            <h2 id="contact-heading" className="sr-only">
              Contact
            </h2>
            <ul className="flex flex-col items-start gap-2.5">
              {socials.map((s) => (
                <li key={s.label}>
                  {s.href ? (
                    <a
                      href={s.href}
                      {...(s.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      aria-label={`${s.label} — ${s.handle}`}
                      className={socialLink}
                    >
                      {s.label}
                    </a>
                  ) : (
                    <CopyDiscord label={s.label} handle={s.handle} />
                  )}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* ── Right: the scroll ── */}
        <main className="min-w-0">
          <section
            id="work"
            aria-labelledby="work-heading"
            className="scroll-mt-10"
          >
            <h2
              id="work-heading"
              className="mb-6 font-mono text-[11px] font-normal lowercase text-[#525252]"
            >
              work
            </h2>
            <ul className="space-y-16">
              {work.map((item, i) => {
                const external = item.external ?? /^https?:/.test(item.href);
                return (
                  <li key={item.title}>
                    <a
                      href={item.href}
                      {...(external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className={`${styles.item} block rounded-xl`}
                    >
                      <Still index={i} />
                      <span className="mt-3 flex items-baseline justify-between gap-4">
                        <span
                          className={`${styles.title} min-w-0 truncate text-[15px] text-[#d4d4d4]`}
                        >
                          {item.title}
                        </span>
                        {item.year && (
                          <span
                            className={`${styles.year} shrink-0 font-mono text-[11px] text-[#525252]`}
                          >
                            {item.year}
                          </span>
                        )}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>

          <section
            id="links"
            aria-labelledby="links-heading"
            className="mt-20 scroll-mt-10"
          >
            <h2
              id="links-heading"
              className="mb-5 font-mono text-[11px] font-normal lowercase text-[#525252]"
            >
              links
            </h2>
            <ul className="space-y-4">
              {links.map((item) => {
                const external = item.external ?? /^https?:/.test(item.href);
                return (
                  <li key={item.title}>
                    <a
                      href={item.href}
                      {...(external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className={`${styles.item} inline-block`}
                    >
                      <span
                        className={`${styles.title} text-[15px] text-[#d4d4d4]`}
                      >
                        {item.title}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>
        </main>
      </div>

      {/* ── Version badge ── */}
      <Link
        href="/"
        aria-label="Back to all versions"
        className="fixed right-4 bottom-4 z-50 rounded-full border border-[#262626] bg-[#161616]/90 px-2.5 py-1 font-mono text-[11px] text-[#6E6E6E] transition-colors duration-150 hover:text-[#F5F5F5] motion-reduce:transition-none"
      >
        09 / 10
      </Link>
    </div>
  );
}
