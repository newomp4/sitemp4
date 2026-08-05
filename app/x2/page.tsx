import type { Metadata } from "next";
import Link from "next/link";
import { profile, work, links, socials } from "@/lib/content";
import CopyDiscord from "./CopyDiscord";
import Placeholder from "./Placeholder";
import styles from "./styles.module.css";

export const metadata: Metadata = {
  title: "Owen Opacki — Frames",
  description: profile.tagline,
};

const quietLink =
  "text-[#a3a3a3] decoration-[#3f3f3f] underline-offset-[3px] transition-colors duration-150 ease-in-out hover:text-[#ededed] hover:underline motion-reduce:transition-none";

export default function FramesPage() {
  const strip = (s: string) => s.replace(/\.\s*$/, "");
  const sentences = (profile.intro[1] ?? "").split(". ");
  const bioLineOne = strip(profile.tagline);
  const bioLineTwo = sentences.slice(0, 2).filter(Boolean).map(strip).join(". ");
  const now = strip(profile.now);

  return (
    <div
      className={`${styles.root} min-h-dvh w-full bg-[#111111] lowercase text-[#ededed]`}
    >
      <div className="mx-auto w-full max-w-[600px] px-5 pt-12 pb-24 sm:pt-16">
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
          <h1 className="text-[22px] font-semibold tracking-[-0.04em] text-[#f5f5f5]">
            {profile.name}
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-[#a3a3a3]">
            <span className="block">{bioLineOne}</span>
            {bioLineTwo && <span className="block">{bioLineTwo}</span>}
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
              {work.map((item, i) => {
                const external = item.external ?? /^https?:/.test(item.href);
                return (
                  <li key={item.title}>
                    <a
                      href={item.href}
                      {...(external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className={styles.frame}
                    >
                      <Placeholder patternId={`x2-hatch-${i}`} />
                      <div className="flex items-baseline gap-x-2.5 border-t border-[#1f1f1f] px-4 py-3">
                        <span className={`${styles.title} text-[15px]`}>
                          {item.title}
                        </span>
                        {item.year && (
                          <span className="font-mono text-[11px] text-[#525252]">
                            {item.year}
                          </span>
                        )}
                        <span
                          aria-hidden="true"
                          className={`${styles.arrow} ml-auto text-[14px]`}
                        >
                          →
                        </span>
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>

          <section
            id="links"
            aria-labelledby="links-heading"
            className="mt-16 scroll-mt-10"
          >
            <h2
              id="links-heading"
              className="mb-4 font-mono text-xs font-normal text-[#525252]"
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
                      className="group block"
                    >
                      <span className="text-[15px] text-[#a3a3a3] decoration-[#3f3f3f] underline-offset-[3px] transition-colors duration-150 ease-in-out group-hover:text-[#ededed] group-hover:underline motion-reduce:transition-none">
                        {item.title}
                      </span>
                      {item.description && (
                        <span className="mt-0.5 block text-[13px] leading-relaxed text-[#525252]">
                          {item.description}
                        </span>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>
        </main>

        <footer
          id="contact"
          aria-labelledby="contact-heading"
          className="mt-16 scroll-mt-10"
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
                    className={`text-sm ${quietLink}`}
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
        02 / 10
      </Link>
    </div>
  );
}
