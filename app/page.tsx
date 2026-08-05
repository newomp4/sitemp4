import Link from "next/link";

/**
 * Version picker — temporary homepage while choosing a direction.
 * Once a version wins, its page.tsx replaces this file and /v1–/v5 get deleted.
 */

const versions = [
  {
    n: "01",
    slug: "/v1",
    name: "Lite",
    blurb: "The Figma template, faithfully — avatar, quiet type, underlined ↗ links.",
  },
  {
    n: "02",
    slug: "/v2",
    name: "Terminal",
    blurb: "Dark, tiny, lowercase. Everything is a fragment.",
  },
  {
    n: "03",
    slug: "/v3",
    name: "Document",
    blurb: "Reads like a Notion page — blocks, hover highlights, one callout.",
  },
  {
    n: "04",
    slug: "/v4",
    name: "Index",
    blurb: "Swiss grid, hairlines, big type, a single red accent.",
  },
  {
    n: "05",
    slug: "/v5",
    name: "Letter",
    blurb: "Warm paper, one narrow column, links woven into sentences.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-24">
      <header className="rise" style={{ "--rise-delay": "0s" } as React.CSSProperties}>
        <h1 className="text-sm font-semibold tracking-tight">owen / newomp4</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Five takes on the same site. Same content, five personalities — pick
          one and we refine from there.
        </p>
      </header>

      <ul className="mt-16">
        {versions.map((v, i) => (
          <li
            key={v.slug}
            className="rise border-t border-neutral-200 last:border-b"
            style={{ "--rise-delay": `${0.08 * (i + 1)}s` } as React.CSSProperties}
          >
            <Link
              href={v.slug}
              className="group flex items-baseline gap-6 py-5 transition-colors duration-200 hover:bg-neutral-50"
            >
              <span className="w-8 shrink-0 font-mono text-xs text-neutral-400 transition-colors duration-200 group-hover:text-neutral-900">
                {v.n}
              </span>
              <span className="flex-1">
                <span className="block text-sm font-medium tracking-tight">
                  {v.name}
                </span>
                <span className="mt-0.5 block text-sm text-neutral-500">
                  {v.blurb}
                </span>
              </span>
              <span
                aria-hidden
                className="shrink-0 text-neutral-300 transition-all duration-200 group-hover:translate-x-1 group-hover:text-neutral-900"
              >
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <footer
        className="rise mt-16 text-xs text-neutral-400"
        style={{ "--rise-delay": "0.55s" } as React.CSSProperties}
      >
        All copy is placeholder — everything lives in lib/content.ts.
      </footer>
    </main>
  );
}
