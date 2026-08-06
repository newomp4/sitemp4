/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONTENT — single source of truth.
 *  Edit copy, the path, links, and socials here; the site updates.
 * ─────────────────────────────────────────────────────────────
 */

export const profile = {
  name: "Owen Opacki",
  handle: "newomp4",
  // PLACEHOLDER — set the real birthday so the hover age ticks true
  birthday: "2006-12-15T00:00:00-05:00",
  // Where the @ points — it's how people know him, so the site links it big.
  handleHref: "https://x.com/newomp4",
  email: "owen@contentrewards.com",
  headline: "Hi, I'm Owen",
  tagline: "I make things for the internet.",
  intro: [
    "I'm [19](#age), from Boston, and I make things for the internet.",
    "Recently dropped out of [college](#bryant) (class of 2029) to be head of creative at [Content Rewards](https://contentrewards.com), The Marketplace for Virality.",
    "Prev: co-founded a real estate marketing company (13-person team), did ~$250k GMV on TikTok Shop, and ran [polyviral](https://polyviral.org), editing for [whop.com](https://whop.com)'s top earners.",
  ],
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
  logo?: string; // optional logo in /public, shown beside the title
  logoShape?: "square" | "circle"; // default square
  anchor?: string; // optional id so copy can deep-link to this chapter
};

export const path: PathItem[] = [
  {
    years: "2026 – present",
    title: "Content Rewards",
    role: "Head of creative",
    note: "Head of creative at [Content Rewards](https://contentrewards.com): the platform where brands pay creators for the content they post.",
    href: "https://contentrewards.com",
    external: true,
    logo: "/logos/content-rewards.png",
  },
  {
    years: "2025 – 2026",
    title: "Bryant University",
    role: "Student, briefly",
    note: "I was going for a master's in business administration with a concentration in digital marketing and a minor in sales and psychology. Dropped out during my second semester in March 2026 for [Content Rewards](https://contentrewards.com).",
    href: "https://www.bryant.edu",
    external: true,
    logo: "/logos/bryant.png",
    logoShape: "circle",
    anchor: "bryant",
  },
  {
    years: "2025",
    title: "Real estate marketing",
    role: "Media agency for realtors",
    note: "Co-founded and grew to 70+ realtor clients across the state, with a team of 13 at the peak.",
  },
  {
    years: "2024 – 2025",
    title: "TikTok Shop",
    role: "Short-form e-com",
    note: "Multiple accounts, ~$250k combined GMV, Ruby seller level. Also ran netwrk, a small coaching community.",
  },
  {
    years: "2023 – 2025",
    title: "polyviral",
    role: "Video editing and motion design agency",
    note: "Full-service editing agency. Edited for top [whop.com](https://whop.com) earners like [Chase Chappell](https://www.instagram.com/realchasechappell) and [Ads Mastery](https://www.adsmastery.com/), then made content for Whop itself.",
    href: "https://polyviral.org",
    external: true,
    logo: "/logos/polyviral.png",
  },
  {
    years: "– 2023",
    title: "Music video VFX",
    role: "VFX and compositing",
    note: "VFX and compositing on music videos for Tana, autumn, UnoTheActivist and more, editing for directors around the world like [@tinytapes](https://instagram.com/tinytapes) and [@dotcomnirvan](https://instagram.com/dotcomnirvan). 10M+ combined views. [The last music video I ever edited](https://youtu.be/E-KVGKqMLZ4).",
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

// Misc links — writing, clips, favorite stuff, whatever you want to point at
export const links: LinkItem[] = [
  {
    title: "Photos",
    href: "/photos",
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
  href?: string; // omitted => rendered as click-to-copy (Discord)
};

export const socials: Social[] = [
  { label: "X", handle: "@newomp4", href: "https://x.com/newomp4" },
  { label: "Instagram", handle: "@newomp4", href: "https://instagram.com/newomp4" },
  { label: "YouTube (I don't post haha)", handle: "@newomp4", href: "https://youtube.com/@newomp4" },
  { label: "Discord", handle: "newomp4" },
];
