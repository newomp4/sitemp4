import Link from "next/link";

/**
 * Version picker — temporary homepage while choosing a direction.
 * Round 2: five dark merges of Lite (v1) × Terminal (v2).
 * Once a version wins, its page.tsx replaces this file.
 */

const merges = [
  {
    n: "01",
    slug: "/m1",
    name: "Nightlite",
    blurb: "The Figma template's skeleton, wearing Terminal's skin.",
  },
  {
    n: "02",
    slug: "/m2",
    name: "Quiet",
    blurb: "Terminal's lowercase voice, grown into full sections.",
  },
  {
    n: "03",
    slug: "/m3",
    name: "Dot Index",
    blurb: "The little nav dot becomes the whole system — mono, numbered, dotted leaders.",
  },
  {
    n: "04",
    slug: "/m4",
    name: "Glow",
    blurb: "Dark cards with a spotlight that follows your cursor.",
  },
  {
    n: "05",
    slug: "/m5",
    name: "Prompt",
    blurb: "A terminal that types itself awake, then behaves beautifully.",
  },
];

const parents = [
  { slug: "/v1", name: "Lite", note: "parent — light" },
  { slug: "/v2", name: "Terminal", note: "parent — dark" },
];

export default function Home() {
  return (
    <div className="min-h-dvh bg-[#0E0E0E] text-[#EDEDED]">
      <main className="mx-auto w-full max-w-2xl px-6 py-24">
        <header className="rise" style={{ "--rise-delay": "0s" } as React.CSSProperties}>
          <h1 className="text-sm font-semibold tracking-tight">
            owen opacki / newomp4
          </h1>
          <p className="mt-2 text-sm text-[#8A8A8A]">
            Round two: five dark merges of Lite × Terminal. Pick one and we
            refine from there.
          </p>
        </header>

        <ul className="mt-16">
          {merges.map((v, i) => (
            <li
              key={v.slug}
              className="rise border-t border-[#242424] last:border-b"
              style={{ "--rise-delay": `${0.08 * (i + 1)}s` } as React.CSSProperties}
            >
              <Link
                href={v.slug}
                className="group flex items-baseline gap-6 py-5 transition-colors duration-200 hover:bg-[#161616]"
              >
                <span className="w-8 shrink-0 font-mono text-xs text-[#5A5A5A] transition-colors duration-200 group-hover:text-[#EDEDED]">
                  {v.n}
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-medium tracking-tight">
                    {v.name}
                  </span>
                  <span className="mt-0.5 block text-sm text-[#8A8A8A]">
                    {v.blurb}
                  </span>
                </span>
                <span
                  aria-hidden
                  className="shrink-0 text-[#3A3A3A] transition-all duration-200 group-hover:translate-x-1 group-hover:text-[#EDEDED]"
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div
          className="rise mt-12 flex flex-wrap items-baseline gap-x-6 gap-y-2"
          style={{ "--rise-delay": "0.5s" } as React.CSSProperties}
        >
          {parents.map((p) => (
            <Link
              key={p.slug}
              href={p.slug}
              className="group text-xs text-[#5A5A5A] transition-colors duration-200 hover:text-[#EDEDED]"
            >
              {p.name}{" "}
              <span className="text-[#3A3A3A] transition-colors duration-200 group-hover:text-[#8A8A8A]">
                · {p.note}
              </span>
            </Link>
          ))}
        </div>

        <footer
          className="rise mt-16 text-xs text-[#5A5A5A]"
          style={{ "--rise-delay": "0.58s" } as React.CSSProperties}
        >
          All copy is placeholder — everything lives in lib/content.ts.
        </footer>
      </main>
    </div>
  );
}
