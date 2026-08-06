import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles.module.css";

export const metadata: Metadata = {
  title: "Owen Opacki · Photos",
  description: "Film photos. New York and Paris, mostly.",
};

const rise = (step: number): CSSProperties =>
  ({ "--rise-delay": `${step * 0.1}s` }) as CSSProperties;

function Cap({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.captionLink}
    >
      {children}
    </a>
  );
}

type Photo = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: ReactNode;
};

const PHOTOS: Photo[] = [
  {
    src: "/photos/owen-nyc-full.jpg",
    width: 1818,
    height: 1228,
    alt: "Owen, Galileo, and Ariel on a rooftop in front of the Williamsburg Bridge at dusk",
    caption: (
      <>
        Williamsburg, NYC @ <Cap href="https://whop.com">whop.com</Cap>&rsquo;s
        office with{" "}
        <Cap href="https://x.com/galileowilson">@galileowilson</Cap> and{" "}
        <Cap href="https://instagram.com/arielbrowerr">@arielbrowerr</Cap>
      </>
    ),
  },
  {
    src: "/photos/gallery/paris-eiffel.jpg",
    width: 1818,
    height: 1228,
    alt: "Three friends in front of the Eiffel Tower",
    caption: (
      <>
        Paris, France with{" "}
        <Cap href="https://x.com/yanalgrowth">@yanalgrowth</Cap> and{" "}
        <Cap href="https://x.com/danvsI">@danvsI</Cap>
      </>
    ),
  },
  {
    src: "/photos/gallery/soho-asspizza.jpg",
    width: 945,
    height: 1227,
    alt: "Owen and Austin Babbitt in front of a graffiti-covered wall",
    caption: (
      <>
        SoHo, NYC. Austin Babbitt (
        <Cap href="https://instagram.com/asspizza">@asspizza</Cap>) and I
      </>
    ),
  },
  {
    src: "/photos/gallery/chinatown.jpg",
    width: 1818,
    height: 1228,
    alt: "A graffiti-covered van parked on a Chinatown street",
    caption: <>Chinatown, NYC</>,
  },
  {
    src: "/photos/gallery/paris-team-dinner.jpg",
    width: 1818,
    height: 1228,
    alt: "The Content Rewards team at dinner in Paris",
    caption: (
      <>
        <Cap href="https://x.com/contentrewards">@contentrewards</Cap> team
        dinner, Paris, France
      </>
    ),
  },
  {
    src: "/photos/gallery/team-danvsl.jpg",
    width: 1818,
    height: 1228,
    alt: "Dan and the Content Rewards team in a hotel room",
    caption: (
      <>
        <Cap href="https://x.com/danvsI">@danvsI</Cap> and the{" "}
        <Cap href="https://x.com/contentrewards">@contentrewards</Cap> team
      </>
    ),
  },
];

export default function PhotosPage() {
  return (
    <div className={`${styles.root} min-h-dvh w-full bg-[#111111]`}>
      <div className="mx-auto w-full max-w-[42rem] px-6 py-12 sm:py-16">
        <header className="rise" style={rise(0)}>
          <Link href="/" className={styles.backLink}>
            <span aria-hidden="true" className={styles.backArrow}>
              ←
            </span>{" "}
            owen opacki
          </Link>
          <h1 className="mt-8 text-[26px] font-semibold tracking-tight text-[#F5F5F5]">
            Photos
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-[#A3A3A3]">
            Some photos I like.
          </p>
        </header>

        <ul className={`${styles.photoList} mt-12 space-y-14`}>
          {PHOTOS.map((photo, i) => (
            <li key={photo.src} className="rise" style={rise(i + 1)}>
              <figure className={styles.photoFig}>
                <div
                  className={`${styles.photoFrame} ${
                    photo.height > photo.width
                      ? "mx-auto max-w-[540px]"
                      : "w-full"
                  }`}
                >
                  {/* Hero loads immediately; the rest of the roll only
                      fetches as it approaches the viewport */}
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    unoptimized
                    preload={i === 0}
                    loading={i === 0 ? "eager" : "lazy"}
                    className={`${styles.photoImg} h-auto w-full`}
                  />
                </div>
                <figcaption className="mt-3 flex items-baseline gap-3">
                  <span className={styles.photoIndex}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[14px] leading-relaxed text-[#A3A3A3]">
                    {photo.caption}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <footer className="rise mt-16 pb-8" style={rise(7)}>
          <Link href="/" className={styles.backLink}>
            <span aria-hidden="true" className={styles.backArrow}>
              ←
            </span>{" "}
            back
          </Link>
        </footer>
      </div>
    </div>
  );
}
