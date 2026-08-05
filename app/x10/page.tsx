import type { Metadata } from "next";
import Link from "next/link";
import { profile, work, links, socials, type LinkItem } from "@/lib/content";
import Arrow from "./Arrow";
import CopyDiscord from "./CopyDiscord";
import styles from "./styles.module.css";

export const metadata: Metadata = {
  title: "Owen Opacki — Morph",
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
      strokeLinecap="round"
      className={styles.glyph}
    >
      {shape === "circle" && <circle cx="7" cy="7" r="5.25" pathLength={1} />}
      {shape === "square" && (
        <rect x="2" y="2" width="10" height="10" rx="1" pathLength={1} />
      )}
      {shape === "triangle" && (
        <path d="M7 2.2 12 11.8H2Z" strokeLinejoin="round" pathLength={1} />
      )}
    </svg>
  );
}

function Row({
  item,
  shape,
  withDescription = false,
}: {
  item: LinkItem;
  shape: Shape;
  withDescription?: boolean;
}) {
  const external = item.external ?? /^https?:/.test(item.href);
  return (
    <li>
      <a
        href={item.href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={`${styles.row} grid grid-cols-[28px_1fr] items-start gap-x-3`}
      >
        <span
          aria-hidden="true"
          className={`${styles.chip} flex h-7 w-7 items-center justify-center rounded-[6px] border bg-[#1B1B1B]`}
        >
          <Glyph shape={shape} />
        </span>
        <span className="flex min-h-7 flex-wrap items-center gap-x-2">
          <span className={styles.title}>{item.title}</span>
          {item.year && (
            <span className={`${styles.year} font-mono text-xs`}>
              {item.year}
            </span>
          )}
        </span>
        {withDescription && item.description && (
          <span className="col-start-2 mt-1 block text-sm leading-relaxed text-[#737373]">
            {item.description}
          </span>
        )}
      </a>
    </li>
  );
}

export default function MorphPage() {
  const strip = (s: string) => s.replace(/\.\s*$/, "");
  const indexLine = profile.intro[1] ?? "";
  const bio = [profile.tagline, indexLine.split(". ")[0]]
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
              className="mb-6 font-mono text-xs font-normal text-[#525252]"
            >
              work
            </h2>
            <ul className="space-y-8">
              {work.map((item, i) => (
                <Row
                  key={item.title}
                  item={item}
                  shape={SHAPES[i % SHAPES.length]}
                  withDescription
                />
              ))}
            </ul>
          </section>

          <section
            id="links"
            aria-labelledby="links-heading"
            className="mt-16 scroll-mt-10"
          >
            <h2
              id="links-heading"
              className="mb-6 font-mono text-xs font-normal text-[#525252]"
            >
              links
            </h2>
            <ul className="space-y-8">
              {links.map((item, i) => (
                <Row
                  key={item.title}
                  item={item}
                  shape={SHAPES[(work.length + i) % SHAPES.length]}
                />
              ))}
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
            className="mb-6 font-mono text-xs font-normal text-[#525252]"
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
                    className="inline-flex items-center gap-1.5 text-sm text-[#a3a3a3] transition-colors duration-150 ease-in-out hover:text-[#ededed] focus-visible:text-[#ededed] motion-reduce:transition-none"
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
        className="fixed right-4 bottom-4 z-50 rounded-full border border-[#262626] bg-[#161616]/90 px-2.5 py-1 font-mono text-[11px] text-[#6E6E6E] transition-colors duration-150 hover:text-[#F5F5F5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5F5F5] motion-reduce:transition-none"
      >
        10 / 10
      </Link>
    </div>
  );
}
