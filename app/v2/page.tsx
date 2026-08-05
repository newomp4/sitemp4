import type { Metadata } from "next";
import Link from "next/link";
import { profile, work, links, socials, type LinkItem } from "@/lib/content";
import Arrow from "./Arrow";
import CopyDiscord from "./CopyDiscord";
import styles from "./styles.module.css";

export const metadata: Metadata = {
  title: "Owen — Terminal",
  description: profile.tagline,
};

function Row({
  item,
  withDescription = false,
}: {
  item: LinkItem;
  withDescription?: boolean;
}) {
  const external = item.external ?? /^https?:/.test(item.href);
  return (
    <li>
      <a
        href={item.href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="inline-flex items-center gap-2 text-[#d4d4d4] transition-colors duration-150 ease-in-out hover:text-[#f5f5f5]"
      >
        <Arrow />
        <span className="text-base">{item.title}</span>
        {item.year && (
          <span className="font-mono text-xs text-[#525252]">{item.year}</span>
        )}
      </a>
      {withDescription && item.description && (
        <p className="mt-0.5 pl-5 text-sm text-[#737373]">{item.description}</p>
      )}
    </li>
  );
}

export default function TerminalPage() {
  const bio = [
    profile.tagline.replace(/\.\s*$/, ""),
    profile.intro[1].split(".")[0],
  ].join(". ");
  const now = profile.now.replace(/\.\s*$/, "");

  return (
    <div
      className={`${styles.root} min-h-dvh w-full bg-[#111] text-white lowercase`}
    >
      <main className="mx-auto w-full max-w-xl px-4 pt-24 pb-16">
        <header>
          <h1 className="text-2xl font-semibold tracking-[-0.05em] text-white">
            {profile.name}
            <span
              aria-hidden="true"
              className={`${styles.cursor} ml-1.5 inline-block h-[18px] w-[9px] bg-[#ec9d5d] align-[-2px]`}
            />
          </h1>
          <p className="mt-3 mb-4 text-base text-[#d4d4d4]">{bio}</p>
          <p className="font-mono text-xs text-[#525252]">{now}</p>
        </header>

        <section className="mt-14" aria-label="work">
          <h2 className="mb-4 font-mono text-xs font-normal text-[#525252]">
            work
          </h2>
          <ul className="space-y-4">
            {work.map((item) => (
              <Row key={item.title} item={item} withDescription />
            ))}
          </ul>
        </section>

        <section className="mt-12" aria-label="links">
          <h2 className="mb-3 font-mono text-xs font-normal text-[#525252]">
            links
          </h2>
          <ul className="space-y-2">
            {links.map((item) => (
              <Row key={item.title} item={item} />
            ))}
          </ul>
        </section>

        <footer className="mt-14">
          <ul className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
            {socials.map((s) => (
              <li key={s.label}>
                {s.href ? (
                  <a
                    href={s.href}
                    {...(s.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="inline-flex items-center gap-2 text-[#d4d4d4] transition-colors duration-150 ease-in-out hover:text-[#f5f5f5]"
                  >
                    <Arrow />
                    <span>{s.label}</span>
                  </a>
                ) : (
                  <CopyDiscord label={s.label} handle={s.handle} />
                )}
              </li>
            ))}
          </ul>
        </footer>
      </main>

      <Link
        href="/"
        className="fixed right-4 bottom-4 z-10 border border-[#525252] bg-[#111] px-2 py-1 font-mono text-[11px] leading-none text-[#525252] transition-colors duration-150 ease-in-out hover:border-[#d4d4d4] hover:text-[#d4d4d4]"
      >
        2 / 05
      </Link>
    </div>
  );
}
