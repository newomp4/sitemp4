/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONTENT — single source of truth.
 *  Every version of the site (v1–v5) reads from this file, so
 *  edit your copy, links, and socials here and all of them update.
 *  All copy below is PLACEHOLDER — rewrite it in your own voice.
 * ─────────────────────────────────────────────────────────────
 */

export const profile = {
  name: "Owen",
  handle: "newomp4",
  email: "owen@contentrewards.com",
  headline: "I make things for the internet.",
  // Short one-liner used under the name in some versions
  tagline: "Building, filming, shipping — mostly at the same time.",
  intro: [
    "I spend most of my time making things on the internet — content, small tools, and the systems that connect the two.",
    "This site is a running index of what I'm up to: what I'm building, what I've made, and where to find me. No case studies, no fluff — just the links.",
  ],
  now: "Right now I'm heads-down on something new. More on that soon.",
};

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
    year: "2025 — now",
    title: "Project One",
    description: "A one-liner about what this is and why it exists.",
    href: "https://example.com",
    external: true,
  },
  {
    year: "2024 — now",
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
  { label: "YouTube", handle: "@newomp4", href: "https://youtube.com/@newomp4" },
  { label: "GitHub", handle: "@newomp4", href: "https://github.com/newomp4" },
  { label: "Discord", handle: "newomp4", copyToClipboard: true },
  { label: "Email", handle: "owen@contentrewards.com", href: "mailto:owen@contentrewards.com" },
];
