/**
 * ─────────────────────────────────────────────────────────────
 *  TOOLS — the free things on GitHub.
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
  updated: string; // "2026-08" — rendered as "Aug 2026"
  tags: string[];
  art: Art; // which generated cover it gets
};

export type Art =
  | "scan"
  | "chat"
  | "board"
  | "device"
  | "frame"
  | "mesh"
  | "type"
  | "wave"
  | "wall"
  | "ascii"
  | "split"
  | "arrow";

export const github = "https://github.com/newomp4";

/* One canonical intro line, so the five layouts differ in form, not copy.
   Each one sets the GitHub link after it in its own way. */
export const toolsIntro =
  "Small things I built because I needed them. Free to use, open to read, all of them on";

export const tools: Tool[] = [
  {
    name: "phosphor",
    tagline: "CRT, VHS and datamosh, frame-exact",
    note: "Signal-accurate composite video emulation in the browser, on the GPU. Load footage, dial in the artifacts, export frame for frame.",
    repo: "https://github.com/newomp4/phosphor",
    demo: "https://newomp4.github.io/phosphor/",
    lang: "TypeScript",
    updated: "2026-08",
    tags: ["video", "webgl"],
    art: "scan",
  },
  {
    name: "twitchsim",
    tagline: "Twitch chat with an alpha channel",
    note: "A chat simulator that exports transparent video — WebM VP9 alpha, ProRes 4444 or a PNG sequence, up to 4K. Drops straight over an edit.",
    repo: "https://github.com/newomp4/twitchsim",
    demo: "https://newomp4.github.io/twitchsim/",
    lang: "TypeScript",
    updated: "2026-08",
    tags: ["video", "overlay"],
    art: "chat",
  },
  {
    name: "crboard",
    tagline: "An infinite canvas where the reels actually play",
    note: "Miro-like, except the Instagram and YouTube embeds play in place. Exports the whole board as one self-contained HTML file.",
    repo: "https://github.com/newomp4/crboard",
    demo: "https://newomp4.github.io/crboard/",
    lang: "TypeScript",
    updated: "2026-08",
    tags: ["canvas", "browser"],
    art: "board",
  },
  {
    name: "mok",
    tagline: "3D device mockups in the browser",
    note: "Screenshots and video on procedurally built iPhone, iPad, MacBook, Watch and desktop displays. Nothing to render out and wait on.",
    repo: "https://github.com/newomp4/mok",
    lang: "TypeScript",
    updated: "2026-09",
    tags: ["3d", "browser"],
    art: "device",
  },
  {
    name: "guidemaker",
    tagline: "Screenshots into SOPs, fast",
    note: "Drop in a screenshot, mark it up with boxes, arrows and text, export a PNG. For writing process docs without opening Figma.",
    repo: "https://github.com/newomp4/guidemaker",
    lang: "HTML",
    updated: "2026-09",
    tags: ["docs", "browser"],
    art: "frame",
  },
  {
    name: "Gradiafy",
    tagline: "Procedural gradients that move",
    note: "Orbs, blobs, turbulence and mesh engines for motion graphics, with WebM export.",
    repo: "https://github.com/newomp4/Gradiafy",
    lang: "HTML",
    updated: "2026-06",
    tags: ["motion", "browser"],
    art: "mesh",
  },
  {
    name: "typearrange",
    tagline: "Captions that arrange themselves",
    note: "Automatic captioning with animated, geometrically arranged typography. Runs locally — Whisper for the transcript, canvas for the render.",
    repo: "https://github.com/newomp4/typearrange",
    lang: "JavaScript",
    updated: "2026-04",
    tags: ["video", "local"],
    art: "type",
  },
  {
    name: "autocut",
    tagline: "Silence out, timeline in",
    note: "A monochrome local dashboard for auto-editor. Drop a video, pick a preset, get the cut — or an XML timeline for Premiere, Resolve, FCP and Shotcut.",
    repo: "https://github.com/newomp4/autocut",
    lang: "Python",
    updated: "2026-04",
    tags: ["video", "local"],
    art: "wave",
  },
  {
    name: "wallmaker",
    tagline: "Walls of video, as real After Effects layers",
    note: "CCTV-style monitor grids built as actual layers, with power-on reveals driven by expression controls.",
    repo: "https://github.com/newomp4/wallmaker",
    lang: "JavaScript",
    updated: "2026-08",
    tags: ["after effects", "motion"],
    art: "wall",
  },
  {
    name: "asciimp4",
    tagline: "ASCII art that moves",
    note: "An After Effects extension for ASCII motion graphics: character sets, dynamic scaling, colour modes, cluster tracking, data overlays.",
    repo: "https://github.com/newomp4/asciimp4",
    lang: "JavaScript",
    updated: "2026-05",
    tags: ["after effects", "motion"],
    art: "ascii",
  },
  {
    name: "Splitup",
    tagline: "One long video, many verticals",
    note: "Splits a horizontal video into 1080×1920 clips with a blurred bed and editable per-clip text. Self-contained — ffmpeg and the output live in the folder.",
    repo: "https://github.com/newomp4/Splitup",
    lang: "JavaScript",
    updated: "2026-04",
    tags: ["video", "local"],
    art: "split",
  },
  {
    name: "ID4",
    tagline: "A quiet YouTube downloader",
    note: "MP4 or MP3, monochrome, self-contained: Flask, yt-dlp and a bundled ffmpeg.",
    repo: "https://github.com/newomp4/ID4",
    lang: "CSS",
    updated: "2026-05",
    tags: ["local"],
    art: "arrow",
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
