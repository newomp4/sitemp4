import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  profile,
  path,
  links,
  socials,
  type LinkItem,
  type PathItem,
} from "@/lib/content";
import AnchorLink from "./AnchorLink";
import Avatar from "./Avatar";
import CopyHandle from "./copy-handle";
import FoldRow from "./FoldRow";
import HiddenFooter from "./HiddenFooter";
import Print from "./Print";
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
      m[2].startsWith("#") ? (
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

/* ── A chapter of the path: one compact line at rest — years, title, role.
   Hover/focus breathes the note open beneath it. The title alone is the
   row's link, so notes can carry their own links. ── */
function PathRow({ item }: { item: PathItem }) {
  const heading = (
    <h3 className="text-[16px] leading-6 font-semibold text-[#F5F5F5]">
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
      <span className={styles.title}>{item.title}</span>
      {item.role && (
        <span className="font-normal text-[#A3A3A3]"> · {item.role}</span>
      )}
      {item.href && (
        <>
          {" "}
          <span
            aria-hidden="true"
            className={`${styles.arrow} inline-block text-[#A3A3A3]`}
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
          <p className="pt-1 text-[14px] leading-relaxed text-[#8A8A8A]">
            {richText(item.note)}
          </p>
        ) : null
      }
    />
  );
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
        <span className={styles.title}>{item.title}</span>{" "}
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

export default function Home() {
  return (
    <div className={`${styles.root} min-h-dvh w-full bg-[#111111]`}>
      <div className="mx-auto w-full max-w-[42rem] px-6 py-12 sm:py-16">
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
              <span className={styles.handle}>@{profile.handle}</span>
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
            aria-labelledby="path-heading"
            className="rise scroll-mt-10 pt-14"
            style={rise(1)}
          >
            <h2
              id="path-heading"
              className="mb-5 text-[14px] font-semibold text-[#F5F5F5]"
            >
              So far
            </h2>
            <ul className={`${styles.list} space-y-5`}>
              {path.map((item) => (
                <PathRow key={item.title} item={item} />
              ))}
            </ul>
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
          <p className="mt-8 text-[13px] text-[#7D7D7D]">
            © 2026 {profile.name}
          </p>
        </footer>
      </div>

      {/* ── The hidden footer — tug past the end and the blues rise ── */}
      <HiddenFooter />
    </div>
  );
}
