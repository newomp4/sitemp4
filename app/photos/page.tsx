import type { Metadata } from "next";
import type { ReactNode } from "react";
import BackLink from "../BackLink";
import root from "../styles.module.css";
import styles from "./photos.module.css";
import PhotoGrid, { type Photo } from "./PhotoGrid";

export const metadata: Metadata = {
  title: "Owen Opacki · Photos",
  description: "Film photos. New York and Paris, mostly.",
  alternates: { canonical: "/photos" },
  openGraph: {
    title: "Owen Opacki · Photos",
    description: "Film photos. New York and Paris, mostly.",
    url: "/photos",
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
    src: "/photos/owen-nyc-full.jpg",
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
    src: "/photos/gallery/film-16b.jpg",
    alt: "A Content Rewards billboard truck passing the Arc de Triomphe",
    caption: (
      <>
        <Cap href="https://x.com/contentrewards">@contentrewards</Cap> truck at
        the Arc de Triomphe, Paris
      </>
    ),
  },
  {
    src: "/photos/gallery/soho-asspizza.jpg",
    alt: "Owen and Austin Babbitt in front of a graffiti-covered wall in SoHo",
    caption: (
      <>
        SoHo, NYC. Austin Babbitt (
        <Cap href="https://instagram.com/asspizza">@asspizza</Cap>) and I
      </>
    ),
  },
  {
    src: "/photos/gallery/film-09.jpg",
    alt: "The Paris skyline and the Eiffel Tower from a rooftop under grey skies",
    caption: <>Paris from the roof of Galeries Lafayette</>,
  },
  {
    src: "/photos/gallery/paris-eiffel.jpg",
    alt: "Three friends in front of the Eiffel Tower",
    caption: (
      <>
        Paris, France with <Cap href="https://x.com/yanalgrowth">@yanalgrowth</Cap>{" "}
        and <Cap href="https://x.com/danvsI">@danvsI</Cap>
      </>
    ),
  },
  {
    src: "/photos/gallery/film-29.jpg",
    alt: "The team working on laptops around a long outdoor dinner table",
    caption: <>team bbq</>,
  },
  {
    src: "/photos/gallery/chinatown.jpg",
    alt: "A graffiti-covered van parked on a Chinatown street",
    caption: <>Chinatown, NYC</>,
  },
  {
    src: "/photos/gallery/film-19.jpg",
    alt: "Two people standing in front of an orange Content Rewards billboard",
    caption: <>make content. get paid</>,
  },
  {
    src: "/photos/gallery/paris-team-dinner.jpg",
    alt: "The Content Rewards team at dinner in Paris",
    caption: (
      <>
        <Cap href="https://x.com/contentrewards">@contentrewards</Cap> team
        dinner, Paris, France
      </>
    ),
  },
  {
    src: "/photos/gallery/film-10.jpg",
    alt: "Haussmann rooftops and a busy Paris intersection seen from above",
    caption: <>Boulevard Haussmann</>,
  },
  {
    src: "/photos/gallery/film-33.jpg",
    alt: "Two friends building a tower of Red Bull cans on a hotel room table",
    caption: <>diet.</>,
  },
  {
    src: "/photos/gallery/film-16a.jpg",
    alt: "Whop stickers on a construction sign on Broome Street",
    caption: (
      <>
        <Cap href="https://whop.com">whop.com</Cap> stickers on Broome St, NYC
      </>
    ),
  },
  {
    src: "/photos/gallery/team-danvsl.jpg",
    alt: "Dan and the Content Rewards team in a hotel room",
    caption: (
      <>
        <Cap href="https://x.com/danvsI">@danvsI</Cap> and the{" "}
        <Cap href="https://x.com/contentrewards">@contentrewards</Cap> team
      </>
    ),
  },
  {
    src: "/photos/gallery/film-13.jpg",
    alt: "A white room covered floor to ceiling in graffiti",
    caption: <>A room covered in graffiti</>,
  },
  {
    src: "/photos/gallery/film-08.jpg",
    alt: "A dark Paris street at dusk with a few lit shopfronts",
    caption: <>Paris at dusk, last frame on the roll</>,
  },
  {
    src: "/photos/gallery/placeholder-1.jpg",
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
      <h1 className="sr-only">Photos</h1>
      <PhotoGrid photos={PHOTOS} />
    </main>
  );
}
