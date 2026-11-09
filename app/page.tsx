import { Fragment, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ageAt } from "@/lib/age";
import { profile, path, socials, type PathItem } from "@/lib/content";
import AgeTicker from "./AgeTicker";
import AnchorLink from "./AnchorLink";
import Avatar from "./Avatar";
import FoldRow from "./FoldRow";
import GalleryLink from "./GalleryLink";
import HiddenFooter from "./HiddenFooter";
import LocalTime from "./LocalTime";
import NamePortrait from "./NamePortrait";
import SocialIcon from "./SocialIcon";
import styles from "./styles.module.css";

/* One staggered entrance runs down the page: headline, the two intro
   lines (the second ends with the contact marks), each chapter, then the
   footer. */
const RISE_STEP = 0.05;
const PATH_RISE_START = 3;

/* The age and the year in the footer are worked out when the page is
   built, and the page is rebuilt once a day, so neither goes stale
   between deploys. (The age also updates itself in the browser.) */
export const revalidate = 86400;

const rise = (step: number): CSSProperties =>
  ({ "--rise-delay": `${step * RISE_STEP}s` }) as CSSProperties;

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
          {Math.floor(ageAt(profile.birthday, Date.now())) || m[1]}
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

/* An intro line is plain copy, or a list of clauses that each hold
   together, so the line can break between them and nowhere else. */
function introLine(line: string | readonly string[]) {
  if (typeof line === "string") return richText(line);
  return line.map((clause, index) => (
    <Fragment key={clause}>
      {index > 0 && " "}
      <span className="whitespace-nowrap">{richText(clause)}</span>
    </Fragment>
  ));
}

/* Hover or keyboard focus unfolds the story beneath each chapter. */
function PathRow({ item, index }: { item: PathItem; index: number }) {
  const heading = (
    <h3 className={`relative text-body leading-6 font-strong text-[#F5F5F5] ${item.href ? "pr-6" : ""}`}>
      {item.logo && (
        <span
          className={`${styles.logoBox} mr-2 ${
            item.logoShape === "circle" ? styles.logoCircle : ""
          }`}
          aria-hidden="true"
        >
          <Image
            src={item.logo}
            alt=""
            width={22}
            height={22}
            loading="eager"
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
      style={rise(PATH_RISE_START + index)}
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
  const nameIndex = profile.headline.indexOf(profile.name);

  return (
    <div className={`${styles.root} min-h-dvh w-full bg-[#111111]`}>
      <div className={`${styles.homeContent} mx-auto w-full max-w-[35rem] px-6 py-12 max-sm:px-8 sm:py-16`}>
        {/* The introduction and the path together are the page's main
            content; the footer sits outside it. */}
        <main>
        {/* ── Hero ── */}
        <section aria-labelledby="intro-heading">
          <h1
            id="intro-heading"
            style={rise(0)}
            className="rise relative z-10 text-title font-strong tracking-tight text-[#F5F5F5]"
          >
            {nameIndex < 0 ? (
              profile.headline
            ) : (
              <>
                {profile.headline.slice(0, nameIndex)}
                <NamePortrait>{profile.name}</NamePortrait>
                {profile.headline.slice(nameIndex + profile.name.length)}
              </>
            )}{" "}
            {/* A phone has no room for the name and the handle on one line,
                so it sets the handle on its own rather than letting it wrap
                and strand the slash at the end of the first. */}
            <span aria-hidden="true" className="font-regular text-[#3F3F3F] max-sm:hidden">
              /
            </span>{" "}
            <br className="sm:hidden" />
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
          {profile.intro.map((line, index) => {
            const last = index === profile.intro.length - 1;
            /* The last line carries the contact marks, so it is a block
               rather than a paragraph: a list cannot sit inside a <p>. */
            const Line = last ? "div" : "p";
            return (
              <Line
                key={typeof line === "string" ? line : line.join(" ")}
                style={rise(index + 1)}
                className={`rise text-body leading-relaxed text-[#A3A3A3] ${index === 0 ? "mt-4" : "mt-1"}`}
              >
                {introLine(line)}
                {last && (
                  <>
                    {" "}
                    <span aria-hidden="true">·</span>{" "}
                    {/* Where to find me, closing the line that says where
                        I am, rather than a row of its own. */}
                    <ul id="contact" aria-label="Contact" className={`${styles.contactIcons} scroll-mt-10`}>
                      {socials.map((social) => (
                        <li key={social.label} className="flex">
                          <a
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${social.label} · ${social.handle}`}
                            title={social.label}
                            className={styles.socialIcon}
                          >
                            <SocialIcon name={social.label} />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </Line>
            );
          })}
        </section>

          {/* On a phone the chapters stack their years over their titles, so
              the page leans on spacing to keep its three parts apart: 4px
              inside a chapter, 24px between chapters, 48px between the
              introduction, the path and the footer. */}
          {/* ── The path ── */}
          <section
            id="path"
            aria-labelledby="path-heading"
            className="scroll-mt-10 pt-8 max-sm:pt-12"
          >
            {/* Kept for section navigation. Restore the original visible styling:
                className="mb-6 text-meta font-strong text-[#F5F5F5]" */}
            <h2 id="path-heading" className="sr-only">
              So far
            </h2>
            <ul className={`${styles.list} space-y-4 max-sm:space-y-6`}>
              {path.map((item, index) => (
                <PathRow key={item.title} item={item} index={index} />
              ))}
            </ul>
          </section>
        </main>

        {/* ── The end of the page: where else to go, and when it is here ── */}
        <footer
          style={rise(PATH_RISE_START + path.length)}
          className="rise pt-8 max-sm:pt-12"
        >
          <div className="relative z-20 flex items-center gap-8">
            <GalleryLink />
            <Link href="/tools" className={styles.footerLink}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="18" height="18" aria-hidden="true">
                <path d="M1.73717 12.7374C1.05375 12.054 1.05376 10.946 1.73717 10.2626L9.48717 2.51256C9.81536 2.18437 10.2605 2 10.7246 2H14.2749C14.739 2 15.1841 2.18437 15.5123 2.51256L16.2623 3.26256C16.9457 3.94598 16.9457 5.05402 16.2623 5.73744L6.73717 15.2626C6.05376 15.946 4.94572 15.946 4.2623 15.2626L1.73717 12.7374Z" fill="currentColor" />
                <path fillRule="evenodd" clipRule="evenodd" d="M20.2497 20.25C19.2832 21.2165 17.7162 21.2165 16.7497 20.25L10.2497 13.75L13.7497 10.25L20.2497 16.75C21.2162 17.7165 21.2162 19.2835 20.2497 20.25Z" fill="currentColor" />
              </svg>
              <span>Projects</span>
            </Link>
          </div>
          <LocalTime />
          <p className="mt-2 text-meta text-[#7D7D7D]">
            © {new Date().getFullYear()} {profile.name}
          </p>
        </footer>
      </div>

      {/* ── The hidden footer, tug past the end and the blues rise ── */}
      <HiddenFooter />
    </div>
  );
}
