/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONTENT — single source of truth.
 *  Every version of the site (v1–v5) reads from this file, so
 *  edit your copy, links, and socials here and all of them update.
 *  All copy below is PLACEHOLDER — rewrite it in your own voice.
 * ─────────────────────────────────────────────────────────────
 */

export const profile = {
  name: "Owen Opacki",
  firstName: "Owen",
  handle: "newomp4",
  // Where the @ points — it's how people know you, so versions link it big.
  handleHref: "https://x.com/newomp4",
  email: "owen@contentrewards.com",
  headline: "Hi, I'm Owen",
  // Short one-liner used under the name in some versions
  tagline: "I make things for the internet.",
  intro: [
    "I make things for the internet: content, small tools, and the systems that connect the two.",
    "This site is the index. What I'm building, what I've shipped, where to find me. No case studies. Just the links.",
  ],
  now: "Right now I'm heads-down on something new. More soon.",
};

// ── The path — how I got here, not a portfolio ──
// Companies you've worked at / chapters of what you've been doing.
// Newest first. Keep notes to one line; this is a story, not case studies.
export type PathItem = {
  years: string; // "2024 — now"
  title: string; // company or chapter name
  role?: string; // what you were / did there, a few words
  note?: string; // one line of color, optional
  href?: string; // optional link to the company/thing
  external?: boolean;
};

export const path: PathItem[] = [
  {
    years: "2024 – now",
    title: "Company One",
    role: "Content & growth",
    note: "The short version of what you actually do there.",
    href: "https://example.com",
    external: true,
  },
  {
    years: "2023 – 2024",
    title: "Company Two",
    role: "Made videos",
    note: "One line on what that chapter taught you.",
    href: "https://example.com",
    external: true,
  },
  {
    years: "2022 – 2023",
    title: "On my own",
    role: "Building an audience",
    note: "What you were figuring out before anyone paid you to. This entry is deliberately longer to show the layout stretches with you: write two, three, four sentences about a chapter and the row simply grows to fit. No truncation, no cut-off text, just more story where you want more story.",
  },
];

export type LinkItem = {
  year?: string;
  title: string;
  description?: string;
  href: string;
  external?: boolean;
};

// "What I do / have made" — placeholder entries, swap in your real stuff
export const work: LinkItem[] = [
  {
    year: "2025 – now",
    title: "Project One",
    description: "A one-liner about what this is and why it exists.",
    href: "https://example.com",
    external: true,
  },
  {
    year: "2024 – now",
    title: "Project Two",
    description: "The outcome, a success metric, or a cheesy tagline.",
    href: "https://example.com",
    external: true,
  },
  {
    year: "2023",
    title: "Project Three",
    description: "Something you shipped, sold, or sunset. It counts.",
    href: "https://example.com",
    external: true,
  },
];

// Misc links — writing, clips, favorite stuff, whatever you want to point at
export const links: LinkItem[] = [
  {
    title: "Some link",
    description: "A thing worth clicking.",
    href: "https://example.com",
    external: true,
  },
  {
    title: "Another link",
    description: "Also worth clicking.",
    href: "https://example.com",
    external: true,
  },
  {
    title: "A third link",
    description: "You get the idea.",
    href: "https://example.com",
    external: true,
  },
];

export type Social = {
  label: string;
  handle: string;
  href?: string; // omitted => not a link (Discord: click-to-copy instead)
  copyToClipboard?: boolean;
};

export const socials: Social[] = [
  { label: "Twitter", handle: "@newomp4", href: "https://x.com/newomp4" },
  { label: "Instagram", handle: "@newomp4", href: "https://instagram.com/newomp4" },
  { label: "YouTube (I don't post haha)", handle: "@newomp4", href: "https://youtube.com/@newomp4" },
  { label: "Discord", handle: "newomp4", copyToClipboard: true },
];
