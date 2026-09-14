import type { Metadata } from "next";
import type { ReactNode } from "react";
import BackLink from "../BackLink";
import root from "../styles.module.css";
import styles from "./gallery.module.css";
import PhotoGrid, { type Photo } from "./PhotoGrid";

/* Imported rather than referenced by URL: that is what gives Next the
   real dimensions and a blur placeholder for each frame, and lets it
   serve a resized, modern-format copy instead of the 1818px original. */
import owenNycFull from "../../public/photos/owen-nyc-full.jpg";
import film16b from "../../public/photos/gallery/film-16b.jpg";
import sohoAsspizza from "../../public/photos/gallery/soho-asspizza.jpg";
import film09 from "../../public/photos/gallery/film-09.jpg";
import parisEiffel from "../../public/photos/gallery/paris-eiffel.jpg";
import film29 from "../../public/photos/gallery/film-29.jpg";
import chinatown from "../../public/photos/gallery/chinatown.jpg";
import film19 from "../../public/photos/gallery/film-19.jpg";
import parisTeamDinner from "../../public/photos/gallery/paris-team-dinner.jpg";
import film10 from "../../public/photos/gallery/film-10.jpg";
import film33 from "../../public/photos/gallery/film-33.jpg";
import film16a from "../../public/photos/gallery/film-16a.jpg";
import teamDanvsl from "../../public/photos/gallery/team-danvsl.jpg";
import film13 from "../../public/photos/gallery/film-13.jpg";
import film08 from "../../public/photos/gallery/film-08.jpg";
import placeholder1 from "../../public/photos/gallery/placeholder-1.jpg";

export const metadata: Metadata = {
  title: "Owen Opacki · Gallery",
  description: "Film photos. New York and Paris, mostly.",
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: "Owen Opacki · Gallery",
    description: "Film photos. New York and Paris, mostly.",
    url: "/gallery",
    siteName: "Owen Opacki",
    type: "website",
  },
};

function Cap({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

// Every photo, in grid order. Rows of four.
const ALL_PHOTOS: Photo[] = [
  {
    src: owenNycFull,
    alt: "Owen, Galileo, and Ariel on a rooftop in front of the Williamsburg Bridge at dusk",
    caption: (
      <>
        Williamsburg, NYC @ <Cap href="https://whop.com">whop.com</Cap>&rsquo;s
        office with <Cap href="https://x.com/galileowilson">@galileowilson</Cap>{" "}
        and <Cap href="https://instagram.com/arielbrowerr">@arielbrowerr</Cap>
      </>
    ),
  },
  {
    src: film16b,
    alt: "A Content Rewards billboard truck passing the Arc de Triomphe",
    caption: (
      <>
        <Cap href="https://x.com/contentrewards">@contentrewards</Cap> truck at
        the Arc de Triomphe, Paris
      </>
    ),
  },
  {
    src: sohoAsspizza,
    alt: "Owen and Austin Babbitt in front of a graffiti-covered wall in SoHo",
    caption: (
      <>
        SoHo, NYC. Austin Babbitt (
        <Cap href="https://instagram.com/asspizza">@asspizza</Cap>) and I
      </>
    ),
  },
  {
    src: film09,
    alt: "The Paris skyline and the Eiffel Tower from a rooftop under grey skies",
    caption: <>Paris from the roof of Galeries Lafayette</>,
  },
  {
    src: parisEiffel,
    alt: "Three friends in front of the Eiffel Tower",
    caption: (
      <>
        Paris, France with <Cap href="https://x.com/yanalgrowth">@yanalgrowth</Cap>{" "}
        and <Cap href="https://x.com/danvsI">@danvsI</Cap>
      </>
    ),
  },
  {
    src: film29,
    alt: "The team working on laptops around a long outdoor dinner table",
    caption: <>team bbq</>,
  },
  {
    src: chinatown,
    alt: "A graffiti-covered van parked on a Chinatown street",
    caption: <>Chinatown, NYC</>,
  },
  {
    src: film19,
    alt: "Two people standing in front of an orange Content Rewards billboard",
    caption: <>make content. get paid</>,
  },
  {
    src: parisTeamDinner,
    alt: "The Content Rewards team at dinner in Paris",
    caption: (
      <>
        <Cap href="https://x.com/contentrewards">@contentrewards</Cap> team
        dinner, Paris, France
      </>
    ),
  },
  {
    src: film10,
    alt: "Haussmann rooftops and a busy Paris intersection seen from above",
    caption: <>Boulevard Haussmann</>,
  },
  {
    src: film33,
    alt: "Two friends building a tower of Red Bull cans on a hotel room table",
    caption: <>diet.</>,
  },
  {
    src: film16a,
    alt: "Whop stickers on a construction sign on Broome Street",
    caption: (
      <>
        <Cap href="https://whop.com">whop.com</Cap> stickers on Broome St, NYC
      </>
    ),
  },
  {
    src: teamDanvsl,
    alt: "Dan and the Content Rewards team in a hotel room",
    caption: (
      <>
        <Cap href="https://x.com/danvsI">@danvsI</Cap> and the{" "}
        <Cap href="https://x.com/contentrewards">@contentrewards</Cap> team
      </>
    ),
  },
  {
    src: film13,
    alt: "A white room covered floor to ceiling in graffiti",
    caption: <>A room covered in graffiti</>,
  },
  {
    src: film08,
    alt: "A dark Paris street at dusk with a few lit shopfronts",
    caption: <>Paris at dusk, last frame on the roll</>,
  },
  {
    src: placeholder1,
    alt: "Placeholder",
    caption: <>Placeholder</>,
  },
];

// Showing three rows for now. Bump ROWS to 4 to bring the last row back.
const ROWS = 3;
const PHOTOS = ALL_PHOTOS.slice(0, ROWS * 4);

export default function PhotosPage() {
  return (
    <main className={`${root.root} ${styles.stage} w-full bg-[#111111]`}>
      <BackLink />
      <h1 className="sr-only">Gallery</h1>
      <PhotoGrid photos={PHOTOS} />
    </main>
  );
}
