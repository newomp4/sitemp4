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
    "Nineteen, from Boston. I work at the intersection of content and commerce.",
    "Recently dropped out of college (Bryant '29) to be head of creative at [Content Rewards](https://contentrewards.com), the platform where brands pay creators to post.",
    "Prev: co-founded a real estate marketing company (13-person team), did ~$250k GMV on TikTok Shop, and ran [Polygon Media](https://whop.com/poly), editing for whop.com's top earners.",
  ],
  now: "Right now I'm head of creative at Content Rewards.",
};

// ── The path — how I got here, not a portfolio ──
// Companies you've worked at / chapters of what you've been doing.
// Newest first. Notes may contain [markdown links](https://...) —
// the page renders them as real anchors.
export type PathItem = {
  years: string; // "2024 – now"
  title: string; // company or chapter name
  role?: string; // plain descriptor of what it was, a few words
  note?: string; // the story, any length; [links](url) allowed
  href?: string; // optional link on the title
  external?: boolean;
  logo?: string; // optional square logo in /public, shown beside the title
};

export const path: PathItem[] = [
  {
    years: "2026 – present",
    title: "Content Rewards",
    role: "Head of creative",
    note: "Creative at [Content Rewards](https://contentrewards.com): the platform where brands pay creators for the content they post.",
    href: "https://contentrewards.com",
    external: true,
    logo: "/logos/content-rewards.png",
  },
  {
    years: "2025 – 2026",
    title: "Bryant University",
    role: "BA, digital marketing",
    note: "Minor in sales. Dropped out in March 2026 for [Content Rewards](https://contentrewards.com).",
    href: "https://www.bryant.edu",
    external: true,
    logo: "/logos/bryant.png",
  },
  {
    years: "2025",
    title: "Real estate marketing",
    role: "Marketing for realtors",
    note: "A summer business with a friend from high school: 30+ realtors, a team of 13 at the peak. I stepped back for school; he still runs it.",
  },
  {
    years: "2024 – 2025",
    title: "TikTok Shop",
    role: "Short-form e-commerce",
    note: "Multiple accounts, ~$250k combined GMV, Ruby seller level. Also ran netwrk, a small coaching community.",
  },
  {
    years: "2023 – 2025",
    title: "Polygon Media",
    role: "Video editing and motion design agency",
    note: "Freelance editing turned agency, now [@polyviral](https://x.com/polyviral). Edited for top [whop.com](https://whop.com) earners like [Chase Chappell](https://www.chasechappell.com), then made content for Whop itself.",
    href: "https://whop.com/poly",
    external: true,
  },
  {
    years: "– 2023",
    title: "Music video VFX",
    role: "VFX and compositing",
    note: "Music videos for Tana, autumn, UnoTheActivist and more: 10M+ combined views. Head of VFX on [the last one I cut](https://youtu.be/E-KVGKqMLZ4).",
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
    title: "Photos",
    description: "Some photos I like.",
    href: "/y1/photos",
  },
  {
    title: "Certifications",
    description:
      "Certified in most of the Adobe apps, plus OSHA 10 and HubSpot social media marketing.",
    href: "https://www.credly.com/users/owen-o",
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
