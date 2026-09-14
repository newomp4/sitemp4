/**
 * ─────────────────────────────────────────────────────────────
 *  TOOLS, the free things on GitHub.
 *  Same idea as content.ts: edit here, every layout updates.
 * ─────────────────────────────────────────────────────────────
 */

export type Tool = {
  name: string;
  tagline: string; // one line, what it is
  note: string; // a sentence or two, the longer story
  repo: string;
  demo?: string; // a live one you can open right now
  lang: "TypeScript" | "JavaScript" | "Python" | "HTML" | "CSS";
  updated: string; // "2026-08", rendered as "Aug 2026"
  tags: string[];
};

export const github = "https://github.com/newomp4";

/* The line under the page title. It stands on its own, with no link
   running off the end of it, and it says what the things are, since
   "tools" by itself does not. */
export const toolsIntro =
  "Open source free apps and tools I've built for myself or for one off projects. Feel free to use and edit however you want!";

export const tools: Tool[] = [
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
    tags: ["3d", "browser"],
  },
  {
    name: "ID4",
    tagline: "Save YouTube videos as MP4 or MP3",
    note: "Paste a link, choose video or audio, and it saves to a folder on your computer.",
    repo: "https://github.com/newomp4/ID4",
    lang: "Python",
    updated: "2026-05",
    tags: ["local"],
  },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-08" → "Aug 2026" */
export function updatedLabel(updated: string): string {
  const [year, month] = updated.split("-");
  return `${MONTHS[Number(month) - 1]} ${year}`;
}

/** The short form the dense layouts use. */
export const SHORT_LANG: Record<Tool["lang"], string> = {
  TypeScript: "TS",
  JavaScript: "JS",
  Python: "PY",
  HTML: "HTML",
  CSS: "CSS",
};
