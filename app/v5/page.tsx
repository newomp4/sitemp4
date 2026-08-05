import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { profile, work, links, socials } from "@/lib/content";
import Dock from "./Dock";
import DiscordCopy from "./DiscordCopy";
import WaveName from "./WaveName";
import styles from "./styles.module.css";

export const metadata: Metadata = {
  title: "Owen — Letter",
  description: profile.tagline,
};

function lowerFirst(s: string) {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

function externalProps(href: string) {
  return href.startsWith("http")
    ? ({ target: "_blank", rel: "noopener noreferrer" } as const)
    : {};
}

export default function LetterPage() {
  const nameAt = profile.headline.indexOf(profile.name);
  const beforeName = nameAt >= 0 ? profile.headline.slice(0, nameAt) : null;
  const afterName =
    nameAt >= 0 ? profile.headline.slice(nameAt + profile.name.length) : null;

  // Descriptions woven into one conversational paragraph, letter-style.
  const workNotes = work
    .map((item) => item.description)
    .filter((d): d is string => Boolean(d))
    .map((d, i) => (i === 0 ? lowerFirst(d) : d))
    .join(" ");

  return (
    <div className={styles.root}>
      <main className={styles.column}>
        <h1 className="font-semibold">
          {beforeName !== null ? (
            <>
              {beforeName}
              <WaveName text={profile.name} />
              {afterName}
            </>
          ) : (
            profile.headline
          )}
        </h1>

        {profile.intro.map((line) => (
          <p key={line} className="mt-6">
            {line}
          </p>
        ))}

        <p className={`mt-6 ${styles.serifAccent}`}>{profile.now}</p>

        <h2 className="mt-12 font-semibold">Work</h2>
        <p className="mt-6">
          These days I&apos;m making{" "}
          {work.map((item, i) => (
            <Fragment key={item.title}>
              {i > 0 && ", "}
              <a
                className={styles.link}
                href={item.href}
                {...externalProps(item.href)}
              >
                {item.title}
              </a>
            </Fragment>
          ))}
          , and a few things I can&apos;t show yet.
        </p>
        {workNotes.length > 0 && (
          <p className={`mt-4 ${styles.small}`}>In order: {workNotes}</p>
        )}

        <h2 className="mt-12 font-semibold">Lately</h2>
        <p className="mt-6">
          Some things I&apos;ve been looking into:{" "}
          {links.map((item, i) => (
            <Fragment key={item.title}>
              {i > 0 && (i === links.length - 1 ? ", and " : ", ")}
              <a
                className={styles.link}
                href={item.href}
                {...externalProps(item.href)}
              >
                {item.title}
              </a>
            </Fragment>
          ))}
          .
        </p>

        <h2 className="mt-12 font-semibold">Elsewhere</h2>
        <p className="mt-6">
          You can find me here.{" "}
          <span className={styles.small}>
            (it&apos;s @{profile.handle} everywhere)
          </span>
        </p>
        <p className="mt-2">
          {socials.map((social, i) => (
            <Fragment key={social.label}>
              {i > 0 && ", "}
              {social.href ? (
                <a
                  className={styles.link}
                  href={social.href}
                  {...externalProps(social.href)}
                >
                  {social.label.toLowerCase()}
                </a>
              ) : (
                <DiscordCopy
                  handle={social.handle}
                  label={social.label.toLowerCase()}
                />
              )}
            </Fragment>
          ))}
          .
        </p>

        <h2 className="mt-16 text-center font-semibold">Fin.</h2>
        <p className={`mt-6 text-center ${styles.footerLine}`}>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p className={`mt-2 text-center ${styles.footnote}`}>
          * made by me, for me.
        </p>
      </main>

      <Dock email={profile.email} />

      <Link href="/" className={styles.badge} aria-label="All versions">
        5 / 05
      </Link>
    </div>
  );
}
