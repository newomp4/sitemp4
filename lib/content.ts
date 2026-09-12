/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONTENT — single source of truth.
 *  Edit copy, the path, links, and socials here; the site updates.
 * ─────────────────────────────────────────────────────────────
 */

export const profile = {
  name: "Owen Opacki",
  handle: "newomp4",
  birthday: "2006-12-01T00:00:00-05:00",
  // Where the @ points — it's how people know him, so the site links it big.
  handleHref: "https://x.com/newomp4",
  email: "owen@contentrewards.com",
  headline: "Hi, I'm Owen",
  tagline: "I make things for the internet.",
  intro: ["I'm [19](#age), from Boston."],
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
    role: "Head of Creative",
    note: "The Marketplace for Virality where - brands pay creators for their content.",
    href: "https://contentrewards.com",
    external: true,
    logo: "/logos/content-rewards.png",
  },
  {
    years: "2025 – 2026",
    title: "Bryant University",
    role: "Student",
    note: "Studied business and digital marketing. Dropped out in my second semester, March 2026, to join [Content Rewards](https://contentrewards.com).",
    href: "https://www.bryant.edu",
    external: true,
    logo: "/logos/bryant.png",
    logoShape: "circle",
    anchor: "bryant",
  },
  {
    years: "2024 – 2025",
    title: "TikTok Shop",
    role: "Ruby affiliate",
    note: "~$250k combined GMV across multiple accounts, reaching Ruby seller level. Also ran netwrk, a small coaching community.",
  },
  {
    years: "2023 – 2025",
    title: "polyviral",
    role: "Short-form marketing agency",
    note: "Ran an editing and motion design agency for top [Whop](https://whop.com) earners like [Chase Chappell](https://www.instagram.com/realchasechappell) and [Ads Mastery](https://www.adsmastery.com/).",
    href: "https://polyviral.org",
    external: true,
    logo: "/logos/polyviral.png",
  },
  {
    years: "– 2023",
    title: "VFX artist",
    role: "Compositing",
    note: "VFX on music videos for Tana, autumn, and UnoTheActivist, working with directors like [@tinytapes](https://instagram.com/tinytapes) and [@dotcomnirvan](https://instagram.com/dotcomnirvan). 10M+ combined views. [The last music video I ever edited](https://youtu.be/E-KVGKqMLZ4).",
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
  { label: "YouTube", handle: "@newomp4", href: "https://youtube.com/@newomp4" },
  { label: "Discord", handle: "newomp4" },
];
