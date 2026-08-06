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
  blur: string; // tiny base64 preview shown while the scan loads
};

const PHOTOS: Photo[] = [
  {
    src: "/photos/owen-nyc.jpg",
    blur:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAUABADASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAIFBv/EACMQAAICAQIGAwAAAAAAAAAAAAECAwQABRESEyExQXEGQoH/xAAVAQEBAAAAAAAAAAAAAAAAAAACAf/EABcRAQEBAQAAAAAAAAAAAAAAAAABESH/2gAMAwEAAhEDEQA/AHtagK9GQIA/M2Uk/X3j6RrDJXZRXaQKAWKnt0yRZt8MSwoFMjsuxbsPeUtIjNtraTJF4HEvUecM0uMxMzOQzkkkecr/ABZmF+QAnblk7fuGGWDX/9k=",
    width: 970,
    height: 1200,
    alt: "Owen in front of the Williamsburg Bridge at dusk",
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
    blur:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAALABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAUG/8QAIRAAAgEDBAMBAAAAAAAAAAAAAQIDAAQREiExQQUTUYH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFREBAQAAAAAAAAAAAAAAAAAAABH/2gAMAwEAAhEDEQA/AAW9peCFbonClgwOsZ27A/a048zZxQr75AJQo1LjO/HVQ5II45kVVAVIiyj4ciksigEBQBtwMdUo/9k=",
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
    blur:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAVABADASIAAhEBAxEB/8QAGAAAAgMAAAAAAAAAAAAAAAAAAAQBAgX/xAAjEAACAQQBBAMBAAAAAAAAAAABAgMABBEFBhIhMUGR/8QAFgEBAQEAAAAAAAAAAAAAAAAAAgAB/8QAGBEBAQEBAQAAAAAAAAAAAAAAAQARIUH/2gAMAwEAAhEDEQA/AL8hYC8lgDuUOpydDjyf5T3EW8drbNEriTuJLAEfH3Sb3EjLlWYv5GcAD1U2M0plURksWGzqR0x7/etLPYrmFjNM55Irk6741B6eKZ427kE0pGO2M4oorNaQ5f/Z",
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
    blur:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAALABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAIF/8QAIBAAAgEDBQEBAAAAAAAAAAAAAQIRAAMEEiEiMVFhcf/EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAFxEAAwEAAAAAAAAAAAAAAAAAAAESEf/aAAwDAQACEQMRAD8AysS7eu23YIvAATI2gfTSXv5DY7s2PbCKBBQ6Z6976FFsclGrf9qcvYQABPgik6Smf//Z",
    width: 1818,
    height: 1228,
    alt: "A graffiti-covered van parked on a Chinatown street",
    caption: <>Chinatown, NYC</>,
  },
  {
    src: "/photos/gallery/paris-team-dinner.jpg",
    blur:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAALABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQME/8QAIRAAAgEEAgIDAAAAAAAAAAAAAQIDAAQREgUxIWEycZH/xAAUAQEAAAAAAAAAAAAAAAAAAAAC/8QAFhEBAQEAAAAAAAAAAAAAAAAAAAEh/9oADAMBAAIRAxEAPwDFyXF29rOVtZQyIE3BbJGez9dftGyWxUMVcMqfIq3j1Tt7EknKjdQd4o9veSc1GYCCwvGiAQsFU4HYzijCuP/Z",
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
    blur:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAALABADASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAABQT/xAAgEAACAQMEAwAAAAAAAAAAAAABAgMABBEFBhIhMUGR/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAVEQEBAAAAAAAAAAAAAAAAAAAAEf/aAAwDAQACEQMRAD8AO0qAX0ohjZY5SOsLilL1LVIn5dccDx7NB7fYrqcZB7JOfhqOWWRizlzyLHJqEf/Z",
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
            Back
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
                    placeholder="blur"
                    blurDataURL={photo.blur}
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
            Back
          </Link>
        </footer>
      </div>
    </div>
  );
}
