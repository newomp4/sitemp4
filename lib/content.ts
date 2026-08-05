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
  now: "Right now I'm head of creative at Content Rewards.",
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
    years: "2026 – present",
    title: "Content Rewards",
    role: "Head of creative",
    note: "Running creative at contentrewards.com, @contentrewards everywhere else. The thing worth dropping out for.",
    href: "https://contentrewards.com",
    external: true,
  },
  {
    years: "2025 – 2026",
    title: "Bryant University",
    role: "Business administration",
    note: "A concentration in digital marketing and a minor in sales. Dropped out in March 2026 to go all in on Content Rewards.",
  },
  {
    years: "2025",
    title: "Real estate marketing",
    role: "Co-founder",
    note: "Started with a friend from high school the summer before college. We serviced 30+ realtors across the state and grew to a team of 13 working full and part time. I never loved working with realtors, and college needed the focus, so we wound down operations. My co-founder still runs it to this day.",
  },
  {
    years: "2024 – 2025",
    title: "TikTok Shop",
    role: "Seller",
    note: "Multiple accounts doing a combined ~$250k in GMV, Ruby seller level. Also started netwrk, a community and coaching program that never really took off, but I coached a few people along the way.",
  },
  {
    years: "2023 – 2025",
    title: "Polygon Media",
    role: "Founder",
    note: "Freelance editing that grew into an agency, now @polyviral. Edited for some of the top earners on whop.com, including Chase Chappell of Ads Mastery, then made content for Whop itself. They still follow me on X.",
    href: "https://whop.com/poly",
    external: true,
  },
  {
    years: "– 2023",
    title: "Music video VFX",
    role: "Freelance",
    note: "VFX and compositing for underground artists like Tana, autumn, and UnoTheActivist, with 10M+ combined views on videos I worked on. Credited as head of VFX on the last one I cut (@vfxnewo).",
    href: "https://youtu.be/E-KVGKqMLZ4",
    external: true,
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
  { label: "X", handle: "@newomp4", href: "https://x.com/newomp4" },
  { label: "Instagram", handle: "@newomp4", href: "https://instagram.com/newomp4" },
  { label: "YouTube (I don't post haha)", handle: "@newomp4", href: "https://youtube.com/@newomp4" },
  { label: "Discord", handle: "newomp4", copyToClipboard: true },
];
