/**
 * ─────────────────────────────────────────────────────────────
 *  TOOLS, the free things on GitHub and the apps.
 *  Same idea as content.ts: edit here, every layout updates.
 * ─────────────────────────────────────────────────────────────
 */

/**
 * An entry is one of two things, and which one is decided by whether it
 * has a price.
 *
 * Open source: a repo, maybe a demo, the language it is written in and
 * when it last moved. An app: a price, even if the price is "Free", a site
 * of its own, and a mark. An app names no language on purpose, since you
 * cannot go and read the source of it.
 */
export type Lang = "TypeScript" | "JavaScript" | "Python" | "HTML" | "CSS";

export type Tool = {
  name: string;
  tagline: string; // one line, what it is
  note: string; // a sentence or two, the longer story
  tags: string[];

  // ── the open source ones ──
  repo?: string;
  demo?: string; // a live one you can open right now
  lang?: Lang;
  updated?: string; // "2026-08", rendered as "Aug 2026"

  // ── the apps ──
  price?: string; // "$5" or "Free", shown at the end of the tagline
  site?: string; // its own page
  icon?: string; // a file in /public; falls back to a monogram
};

export const github = "https://github.com/newomp4";

/* The line under the page title. It stands on its own, with no link
   running off the end of it, and it says what the things are, since
   "tools" by itself does not. */
export const toolsIntro =
  "Apps and tools I've built, mostly for myself or for one-off projects. The open-source ones are free to use and edit however you want.";

export const tools: Tool[] = [
  {
    name: "Petal",
    tagline: "AI usage in your Mac menu bar",
    note: "Keep an eye on your Codex and Claude limits, see when they reset, and get a reminder before you run out. Runs on macOS 14 or later, on Apple silicon and Intel. One-time purchase with lifetime updates.",
    tags: ["Mac", "menu bar"],
    price: "$3.99",
    site: "https://petal.bar",
    icon: "/logos/petal.png",
  },
  {
    name: "ID4",
    tagline: "Download anything on the internet",
    note: "Paste a link and save the video, the audio or the transcript, from YouTube, TikTok, Instagram and about 1,800 other sites. Runs on macOS 14 or later, on Apple silicon. Free, with no account to make.",
    tags: ["Mac", "video", "audio"],
    price: "Free",
    site: "https://polyviral.org/id4",
  },
  {
    name: "twitchsim",
    tagline: "Fake Twitch chat simulator",
    note: "Makes a Twitch chat that looks real, then saves it as a video you can put on top of your own video.",
    repo: "https://github.com/newomp4/twitchsim",
    demo: "https://newomp4.github.io/twitchsim/",
    lang: "TypeScript",
    updated: "2026-08",
    tags: ["video", "overlay"],
  },
  {
    name: "crboard",
    tagline: "A board for collecting links, images and notes",
    note: "Pin videos, pictures and notes anywhere on one giant page. Videos play right there. Send the whole board to someone as a single file.",
    repo: "https://github.com/newomp4/crboard",
    demo: "https://newomp4.github.io/crboard/",
    lang: "TypeScript",
    updated: "2026-08",
    tags: ["canvas", "browser"],
  },
  {
    name: "mok",
    tagline: "Put a screenshot on a 3D phone or laptop",
    note: "Drop in a screenshot, choose a phone or a laptop to put it on, and save the result as a picture or a short video.",
    repo: "https://github.com/newomp4/mok",
    lang: "TypeScript",
    updated: "2026-09",
    tags: ["3D", "browser"],
  },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-08" → "Aug 2026". Apps carry no date, hence the guard. */
export function updatedLabel(updated: string | undefined): string {
  if (!updated) return "";
  const [year, month] = updated.split("-");
  return `${MONTHS[Number(month) - 1]} ${year}`;
}
