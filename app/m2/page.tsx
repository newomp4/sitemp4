import type { Metadata } from "next";
import Link from "next/link";
import { profile, work, links, socials, type LinkItem } from "@/lib/content";
import Arrow from "./Arrow";
import CopyDiscord from "./CopyDiscord";
import styles from "./styles.module.css";

export const metadata: Metadata = {
  title: "Owen Opacki — Quiet",
  description: profile.tagline,
};

type Shape = "circle" | "square" | "triangle";

const SHAPES: Shape[] = ["circle", "square", "triangle"];

function Glyph({ shape }: { shape: Shape }) {
  return (
    <svg
      viewBox="0 0 14 14"
      width="14"
      height="14"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      {shape === "circle" && <circle cx="7" cy="7" r="5.25" />}
      {shape === "square" && <rect x="2" y="2" width="10" height="10" rx="1" />}
      {shape === "triangle" && (
        <path d="M7 2.2 12 11.8H2Z" strokeLinejoin="round" />
      )}
    </svg>
  );
}

function Row({ item, shape }: { item: LinkItem; shape?: Shape }) {
  const external = item.external ?? /^https?:/.test(item.href);
  return (
    <li>
      <a
        href={item.href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={`group grid items-start ${
          shape ? "grid-cols-[28px_1fr] gap-x-3" : "grid-cols-1"
        }`}
      >
        {shape && (
          <span
            aria-hidden="true"
            className="flex h-7 w-7 items-center justify-center rounded-[6px] border border-[#232323] bg-[#1B1B1B] text-[#525252] transition-colors duration-150 ease-in-out group-hover:border-[#3F3F3F] group-hover:text-[#8C8C8C] motion-reduce:transition-none"
          >
            <Glyph shape={shape} />
          </span>
        )}
        <span
          className={`flex flex-wrap items-center gap-x-2 ${
            shape ? "min-h-7" : ""
          }`}
        >
          <span className="text-[16px] text-[#d4d4d4] decoration-[#3F3F3F] underline-offset-[3px] transition-colors duration-150 ease-in-out group-hover:text-[#f5f5f5] group-hover:underline motion-reduce:transition-none">
            {item.title}
          </span>
          {item.year && (
            <span className="font-mono text-xs text-[#525252]">
              {item.year}
            </span>
          )}
        </span>
        {item.description && (
          <span
            className={`mt-1 block text-sm leading-relaxed text-[#737373] ${
              shape ? "col-start-2" : ""
            }`}
          >
            {item.description}
          </span>
        )}
      </a>
    </li>
  );
}

export default function QuietPage() {
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
            <ul className="space-y-7">
              {work.map((item, i) => (
                <Row
                  key={item.title}
                  item={item}
                  shape={SHAPES[i % SHAPES.length]}
                />
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
                    className="inline-flex items-center gap-1.5 text-sm text-[#a3a3a3] transition-colors duration-150 ease-in-out hover:text-[#ededed] motion-reduce:transition-none"
                  >
                    <span>{s.label}</span>
                    <Arrow />
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
        className="fixed right-4 bottom-4 z-10 rounded-full bg-[#1b1b1b] px-2.5 py-1 font-mono text-[11px] leading-none text-[#6e6e6e] transition-colors duration-150 ease-in-out hover:text-[#ededed] motion-reduce:transition-none"
      >
        2 / 05
      </Link>
    </div>
  );
}
