import type { Metadata } from "next";
import Link from "next/link";
import { profile, work, links, socials, type LinkItem } from "@/lib/content";
import Nav from "./Nav";
import CopyDiscord from "./CopyDiscord";
import styles from "./styles.module.css";

export const metadata: Metadata = {
  title: "Owen Opacki — Beam",
  description: profile.tagline,
};

function Row({ item }: { item: LinkItem }) {
  const external = item.external ?? /^https?:/.test(item.href);
  return (
    <li className={styles.row}>
      <a
        href={item.href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="block pl-4"
      >
        <span aria-hidden="true" className={styles.tick} />
        <span className="flex flex-wrap items-baseline gap-x-2">
          <span className={`${styles.rowTitle} text-[16px]`}>{item.title}</span>
          {item.year && (
            <span className="font-mono text-xs text-[#525252]">
              {item.year}
            </span>
          )}
        </span>
        {item.description && (
          <span
            className={`${styles.rowDesc} mt-1 block text-sm leading-relaxed`}
          >
            {item.description}
          </span>
        )}
      </a>
    </li>
  );
}

export default function BeamPage() {
  const strip = (s: string) => s.replace(/\.\s*$/, "");
  const indexLine = profile.intro[1] ?? "";
  const parts = indexLine.split(". ");
  const bio = [profile.tagline, parts[0], parts[2], parts[3]]
    .filter((s): s is string => Boolean(s))
    .map(strip)
    .join(". ");
  const now = strip(profile.now);

  return (
    <div
      className={`${styles.root} min-h-dvh w-full bg-[#111] lowercase text-[#ededed]`}
    >
      <div className="mx-auto w-full max-w-xl px-5 pt-12 pb-24 sm:pt-16">
        <Nav />

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
            <ul className="space-y-7">
              {work.map((item) => (
                <Row key={item.title} item={item} />
              ))}
            </ul>
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
                <Row key={item.title} item={item} />
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
          <ul className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5">
            {socials.map((s) => (
              <li key={s.label}>
                {s.href ? (
                  <a
                    href={s.href}
                    {...(s.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    aria-label={`${s.label.toLowerCase()} — ${s.handle}`}
                    className={`${styles.social} text-sm`}
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
        05 / 10
      </Link>
    </div>
  );
}
