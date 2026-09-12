import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { profile, links, socials, type LinkItem } from "@/lib/content";
import AgeTicker from "../AgeTicker";
import AnchorLink from "../AnchorLink";
import Avatar from "../Avatar";
import CopyHandle from "../copy-handle";
import HiddenFooter from "../HiddenFooter";
import LocalTime from "../LocalTime";
import Print from "../Print";
import styles from "../styles.module.css";
import SoFarMorph from "./SoFarMorph";

export const metadata: Metadata = {
  title: "Owen Opacki · Timeline preview",
  robots: { index: false, follow: false },
};

const rise = (step: number): CSSProperties =>
  ({ "--rise-delay": `${step * 0.1}s` }) as CSSProperties;

/* Render [text](url) in copy as real links. */
function richText(text: string) {
  const parts: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(
      m[2] === "#age" ? (
        <AgeTicker key={m.index} birthday={profile.birthday}>
          {m[1]}
        </AgeTicker>
      ) : m[2].startsWith("#") ? (
        <AnchorLink key={m.index} href={m[2]} className={styles.captionLink}>
          {m[1]}
        </AnchorLink>
      ) : (
        <a
          key={m.index}
          href={m[2]}
          {...(m[2].startsWith("http")
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          className={styles.captionLink}
        >
          {m[1]}
        </a>
      ),
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function Row({ item }: { item: LinkItem }) {
  const external = item.external ?? /^https?:/.test(item.href);
  const body = (
    <>
      {item.year && <p className="text-[12px] text-[#7D7D7D]">{item.year}</p>}
      <h3
        className={`text-[16px] font-semibold text-[#F5F5F5] ${
          item.year ? "mt-1" : ""
        }`}
      >
        <span>{item.title}</span>{" "}
        <span
          aria-hidden="true"
          className={`${styles.arrow} inline-block text-[#A3A3A3]`}
        >
          ↗
        </span>
      </h3>
      {item.description && (
        <p className="mt-1 text-[15px] leading-relaxed text-[#A3A3A3]">
          {item.description}
        </p>
      )}
    </>
  );
  return (
    <li>
      {external ? (
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          {body}
        </a>
      ) : (
        <Link href={item.href} className="block">
          {body}
        </Link>
      )}
    </li>
  );
}

export default function TimelineContextTest() {
  return (
    <div className={`${styles.root} min-h-dvh w-full bg-[#111111]`}>
      <div className="mx-auto w-full max-w-[42rem] px-6 py-12 sm:py-16">
        <p className="mb-10 text-[13px] text-[#7D7D7D]">test page: the So far morph in full context. click “So far”.</p>
        {/* ── Hero ── */}
        <section
          aria-labelledby="intro-heading"
          className="rise"
          style={rise(0)}
        >
          {/* A single portrait, set down above the headline */}
          <Print />
          <h1
            id="intro-heading"
            className="mt-7 text-[26px] font-semibold tracking-tight text-[#F5F5F5]"
          >
            {profile.headline}{" "}
            <span aria-hidden="true" className="font-normal text-[#3F3F3F]">
              /
            </span>{" "}
            <a
              href={profile.handleHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`@${profile.handle} on X`}
              className={`${styles.handleLink} group/handle`}
            >
              <Avatar />
              <span>@{profile.handle}</span>
              <span
                aria-hidden="true"
                className={`${styles.handleArrow} inline-block text-[20px]`}
              >
                ↗
              </span>
            </a>
          </h1>
          {profile.intro.map((paragraph) => (
            <p
              key={paragraph}
              className="mt-3 text-[15px] leading-relaxed text-[#A3A3A3]"
            >
              {richText(paragraph)}
            </p>
          ))}
        </section>

        <main>
          {/* ── The path ── */}
          <section
            id="path"
            className="rise scroll-mt-10 pt-14"
            style={rise(1)}
          >
            <SoFarMorph />
          </section>

          {/* ── Elsewhere ── */}
          <section
            id="elsewhere"
            aria-labelledby="elsewhere-heading"
            className="rise scroll-mt-10 pt-14"
            style={rise(2)}
          >
            <h2
              id="elsewhere-heading"
              className="mb-5 text-[14px] font-semibold text-[#F5F5F5]"
            >
              Other things
            </h2>
            <ul className={`${styles.list} space-y-5`}>
              {links.map((item) => (
                <Row key={item.title} item={item} />
              ))}
            </ul>
          </section>
        </main>

        {/* ── Contact ── */}
        <footer
          id="contact"
          aria-labelledby="contact-heading"
          className="rise scroll-mt-10 pt-14 pb-6"
          style={rise(3)}
        >
          <h2
            id="contact-heading"
            className="mb-5 text-[14px] font-semibold text-[#F5F5F5]"
          >
            Contact
          </h2>
          <ul className="flex flex-wrap gap-x-5 gap-y-3">
            {socials.map((social) => (
              <li key={social.label}>
                {social.href ? (
                  <a
                    href={social.href}
                    {...(social.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    aria-label={`${social.label} · ${social.handle}`}
                    className={styles.social}
                  >
                    {social.label}{" "}
                    <span
                      aria-hidden="true"
                      className={`${styles.socialArrow} inline-block`}
                    >
                      ↗
                    </span>
                  </a>
                ) : (
                  <CopyHandle label={social.label} handle={social.handle} />
                )}
              </li>
            ))}
          </ul>
          <LocalTime />
          <p className="mt-2 text-[13px] text-[#7D7D7D]">
            © 2026 {profile.name}
          </p>
        </footer>
      </div>

      {/* ── The hidden footer — tug past the end and the blues rise ── */}
      <HiddenFooter />
    </div>
  );
}
