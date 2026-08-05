import type { Metadata } from "next";
import Link from "next/link";
import { profile, work, links, socials, type LinkItem } from "@/lib/content";
import Scramble from "./Scramble";
import SocialsRow from "./SocialsRow";
import styles from "./styles.module.css";

export const metadata: Metadata = {
  title: "Owen Opacki — Decode",
  description: profile.tagline,
};

function Row({ item }: { item: LinkItem }) {
  return (
    <li>
      <Scramble
        text={item.title}
        href={item.href}
        external={item.external ?? item.href.startsWith("http")}
        description={item.description}
      />
    </li>
  );
}

export default function DecodePage() {
  const strip = (s: string) => s.replace(/\.\s*$/, "");
  const indexLine = profile.intro[1] ?? "";
  const parts = indexLine.split(". ");
  const bio = [profile.tagline, parts[0], parts[3]]
    .filter((s): s is string => Boolean(s))
    .map(strip)
    .join(". ");
  const now = strip(profile.now);

  return (
    <div
      className={`${styles.root} min-h-dvh w-full bg-[#111] lowercase text-[#ededed]`}
    >
      <div className="mx-auto w-full max-w-xl px-5 pt-12 pb-24 sm:pt-16">
        <nav aria-label="site" className="flex items-center gap-3">
          <a href="#work" className={styles.navLink}>
            work
          </a>
          <span aria-hidden="true" className="text-[13px] text-[#3f3f3f]">
            /
          </span>
          <a href="#links" className={styles.navLink}>
            links
          </a>
          <span aria-hidden="true" className="text-[13px] text-[#3f3f3f]">
            /
          </span>
          <a href="#contact" className={styles.navLink}>
            contact
          </a>
        </nav>

        <header className="mt-14 sm:mt-16">
          <h1 className="text-2xl font-semibold tracking-[-0.05em] text-[#f5f5f5]">
            {profile.name}
            <span
              aria-hidden="true"
              className={`${styles.cursor} ml-1.5 inline-block h-[18px] w-[9px] bg-[#ec9d5d] align-[-2px]`}
            />
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
            <ul className="space-y-6">
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
              className="mb-5 font-mono text-xs font-normal text-[#525252]"
            >
              links
            </h2>
            <ul className="space-y-6">
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
          <SocialsRow socials={socials} />
        </footer>
      </div>

      <Link
        href="/"
        aria-label="back to all versions"
        className="fixed right-4 bottom-4 z-50 rounded-full border border-[#262626] bg-[#161616]/90 px-2.5 py-1 font-mono text-[11px] text-[#6e6e6e] transition-colors duration-150 hover:text-[#f5f5f5] focus-visible:text-[#f5f5f5] motion-reduce:transition-none"
      >
        03 / 10
      </Link>
    </div>
  );
}
