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
    "Nineteen, from Boston, MA. I make things for the internet: content, small tools, and the systems that connect the two.",
    "This site is the index. What I'm building, what I've shipped, where to find me. No case studies. Just the links.",
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
};

export const path: PathItem[] = [
  {
    years: "2026 – present",
    title: "Content Rewards",
    role: "Head of creative",
    note: "I lead creative at [Content Rewards](https://contentrewards.com), the platform where brands pay creators for the content they post about them. I work on the brand, the campaigns, and the content itself alongside the [@contentrewards](https://x.com/contentrewards) team.",
    href: "https://contentrewards.com",
    external: true,
  },
  {
    years: "2025 – 2026",
    title: "Bryant University",
    role: "BA with a concentration in digital marketing",
    note: "Plus a minor in sales. I dropped out in March 2026 to go all in on [Content Rewards](https://contentrewards.com).",
    href: "https://www.bryant.edu",
    external: true,
  },
  {
    years: "2025",
    title: "Real estate marketing",
    role: "Marketing for realtors",
    note: "A summer business with a friend from high school. We handled marketing for 30+ realtors and had 13 people working with us at the peak. I didn't love the work and school was starting, so I stepped back. He still runs it today.",
  },
  {
    years: "2024 – 2025",
    title: "TikTok Shop",
    role: "Short-form e-commerce",
    note: "Multiple accounts doing a combined ~$250k in GMV, up to the Ruby seller level. I also started netwrk, a small community and coaching program. It never really took off, but I coached a few people along the way.",
  },
  {
    years: "2023 – 2025",
    title: "Polygon Media",
    role: "Video editing and motion design agency",
    note: "Freelance editing that grew into an agency, now [@polyviral](https://x.com/polyviral). We edited for some of the top earners on [whop.com](https://whop.com), including [Chase Chappell](https://www.chasechappell.com) of Ads Mastery, and later I made content for Whop itself. They still follow me on X.",
    href: "https://whop.com/poly",
    external: true,
  },
  {
    years: "– 2023",
    title: "Music video VFX",
    role: "VFX and compositing",
    note: "Music videos for underground artists like Tana, autumn, and UnoTheActivist, with 10M+ combined views on videos I worked on. Credited as head of VFX on [the last one I cut](https://youtu.be/E-KVGKqMLZ4), from my VFX account @vfxnewo.",
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
