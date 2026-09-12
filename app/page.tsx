import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { profile, path, socials, type PathItem } from "@/lib/content";
import AgeTicker from "./AgeTicker";
import AnchorLink from "./AnchorLink";
import Avatar from "./Avatar";
import CopyHandle from "./copy-handle";
import FoldRow from "./FoldRow";
import GalleryLink from "./GalleryLink";
import HiddenFooter from "./HiddenFooter";
import LocalTime from "./LocalTime";
import NamePortrait from "./NamePortrait";
import styles from "./styles.module.css";

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

/* Hover or keyboard focus unfolds the story beneath each chapter. */
function PathRow({ item, index }: { item: PathItem; index: number }) {
  const heading = (
    <h3 className={`relative text-body leading-6 font-strong text-[#F5F5F5] ${item.href ? "pr-5" : ""}`}>
      {item.logo && (
        <span
          className={`${styles.logoBox} mr-2.5 ${
            item.logoShape === "circle" ? styles.logoCircle : ""
          }`}
          aria-hidden="true"
        >
          <Image
            src={item.logo}
            alt=""
            width={22}
            height={22}
            className="h-full w-full object-cover"
          />
        </span>
      )}
      <span>{item.title}</span>
      {item.role && (
        <span className="font-regular text-[#A3A3A3]"> · {item.role}</span>
      )}
      {item.href && (
        <>
          {" "}
          <span
            aria-hidden="true"
            className={`${styles.arrow} absolute right-0 top-0 text-[#A3A3A3]`}
          >
            ↗
          </span>
        </>
      )}
    </h3>
  );

  const external = item.href
    ? (item.external ?? /^https?:/.test(item.href))
    : false;

  return (
    <FoldRow
      id={item.anchor}
      hasLink={Boolean(item.href)}
      index={index}
      years={item.years}
      heading={
        item.href ? (
          <a
            href={item.href}
            {...(external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="block"
          >
            {heading}
          </a>
        ) : (
          heading
        )
      }
      note={
        item.note ? (
          <p className="pt-1 text-body leading-relaxed text-[#A3A3A3]">
            {richText(item.note)}
          </p>
        ) : null
      }
    />
  );
}

export default function Home() {
  const firstName = profile.name.split(" ")[0];
  const nameIndex = profile.headline.indexOf(firstName);

  return (
    <div className={`${styles.root} min-h-dvh w-full bg-[#111111]`}>
      <div className={`${styles.homeContent} mx-auto w-full max-w-[35rem] px-6 py-12 max-sm:px-8 sm:py-16`}>
        {/* ── Hero ── */}
        <section aria-labelledby="intro-heading">
          <h1
            id="intro-heading"
            style={rise(0)}
            className="rise relative z-10 text-title font-strong tracking-tight text-[#F5F5F5]"
          >
            {profile.headline.slice(0, nameIndex)}
            <NamePortrait>{firstName}</NamePortrait>
            {profile.headline.slice(nameIndex + firstName.length)}{" "}
            <span aria-hidden="true" className="font-regular text-[#3F3F3F]">
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
                className={`${styles.handleArrow} inline-block`}
              >
                ↗
              </span>
            </a>
          </h1>
          {profile.intro.map((paragraph, index) => (
            <p
              key={paragraph}
              style={rise(index + 1)}
              className={`rise text-body leading-relaxed text-[#A3A3A3] ${index === 0 ? "mt-3" : "mt-1"}`}
            >
              {richText(paragraph)}
            </p>
          ))}
        </section>

        <main>
          {/* ── The path ── */}
          <section
            id="path"
            aria-labelledby="path-heading"
            className="scroll-mt-10 pt-12 max-sm:pt-8"
          >
            {/* Kept for section navigation. Restore the original visible styling:
                className="scroll-reveal mb-5 text-meta font-strong text-[#F5F5F5]" */}
            <h2 id="path-heading" className="sr-only">
              So far
            </h2>
            <ul className={`${styles.list} space-y-5 max-sm:space-y-4`}>
              {path.map((item, index) => (
                <PathRow key={item.title} item={item} index={index} />
              ))}
            </ul>
          </section>
        </main>

        {/* ── Contact ── */}
        <footer
          id="contact"
          aria-labelledby="contact-heading"
          className="scroll-reveal scroll-mt-10 pt-12 max-sm:pt-8"
        >
          <h2
            id="contact-heading"
            className="mb-5 text-meta font-strong text-[#F5F5F5] max-sm:mb-3"
          >
            Contact
          </h2>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 max-sm:gap-x-4 max-[360px]:gap-x-2">
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
          <div className="relative z-20 mt-3 flex items-center gap-16">
            <GalleryLink />
            <Link href="/tools" className={styles.footerLink}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="18" height="18" aria-hidden="true">
                <path d="M1.73717 12.7374C1.05375 12.054 1.05376 10.946 1.73717 10.2626L9.48717 2.51256C9.81536 2.18437 10.2605 2 10.7246 2H14.2749C14.739 2 15.1841 2.18437 15.5123 2.51256L16.2623 3.26256C16.9457 3.94598 16.9457 5.05402 16.2623 5.73744L6.73717 15.2626C6.05376 15.946 4.94572 15.946 4.2623 15.2626L1.73717 12.7374Z" fill="currentColor" />
                <path fillRule="evenodd" clipRule="evenodd" d="M20.2497 20.25C19.2832 21.2165 17.7162 21.2165 16.7497 20.25L10.2497 13.75L13.7497 10.25L20.2497 16.75C21.2162 17.7165 21.2162 19.2835 20.2497 20.25Z" fill="currentColor" />
              </svg>
              <span>Tools</span>
            </Link>
          </div>
          <LocalTime />
          <p className="mt-2 text-meta text-[#7D7D7D]">
            © 2026 {profile.name}
          </p>
        </footer>
      </div>

      {/* ── The hidden footer — tug past the end and the blues rise ── */}
      <HiddenFooter />
    </div>
  );
}
