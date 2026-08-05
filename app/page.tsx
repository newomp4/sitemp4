import Link from "next/link";

/**
 * Version picker — temporary homepage while choosing a direction.
 * Round 4: five descendants of Slate, told as a story instead of a
 * portfolio — wider column, prominent @, career path over projects.
 * Once a version wins, its page.tsx replaces this file.
 */

const versions = [
  {
    n: "1",
    slug: "/y1",
    name: "Slate II",
    blurb: "Slate, refined — wider column, the @ up top, companies not projects.",
  },
  {
    n: "2",
    slug: "/y2",
    name: "Record",
    blurb: "Slate's calm with Ledger's move — career chapters breathe open.",
  },
  {
    n: "3",
    slug: "/y3",
    name: "Stills",
    blurb: "Slate with a strip of set-down photographs. Drop your images in.",
  },
  {
    n: "4",
    slug: "/y4",
    name: "Thread",
    blurb: "Slate with Reveal's move — roles and handles slide open inline.",
  },
  {
    n: "5",
    slug: "/y5",
    name: "Story",
    blurb: "The whole thing as a short letter — the path woven into sentences.",
  },
];

const earlier = [
  { slug: "/x1", name: "Slate", note: "parent" },
  { slug: "/x4", name: "Portrait", note: "donor" },
  { slug: "/x6", name: "Ledger", note: "donor" },
  { slug: "/x8", name: "Reveal", note: "donor" },
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
            Round four: five takes on Slate — wider, story-first, @ up front.
            Pick one and we refine from there.
          </p>
        </header>

        <ul className="mt-16">
          {versions.map((v, i) => (
            <li
              key={v.slug}
              className="rise border-t border-[#242424] last:border-b"
              style={{ "--rise-delay": `${0.08 * (i + 1)}s` } as React.CSSProperties}
            >
              <Link
                href={v.slug}
                className="group flex items-baseline gap-6 py-5 transition-colors duration-200 hover:bg-[#161616]"
              >
                <span className="w-8 shrink-0 text-xs text-[#5A5A5A] transition-colors duration-200 group-hover:text-[#EDEDED]">
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
          style={{ "--rise-delay": "0.56s" } as React.CSSProperties}
        >
          {earlier.map((p) => (
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
          style={{ "--rise-delay": "0.64s" } as React.CSSProperties}
        >
          All copy is placeholder — the career path, links, and socials all
          live in lib/content.ts.
        </footer>
      </main>
    </div>
  );
}
