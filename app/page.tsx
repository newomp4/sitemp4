import Link from "next/link";

/**
 * Version picker — temporary homepage while choosing a direction.
 * Round 3: ten tighter merges of Nightlite (m1) × Quiet (m2).
 * Once a version wins, its page.tsx replaces this file.
 */

const merges = [
  {
    n: "01",
    slug: "/x1",
    name: "Slate",
    blurb: "The straightest merge. Rows dim their neighbors when you hover.",
  },
  {
    n: "02",
    slug: "/x2",
    name: "Frames",
    blurb: "Work as framed stills — drop images in, they breathe on hover.",
    images: true,
  },
  {
    n: "03",
    slug: "/x3",
    name: "Decode",
    blurb: "Calm until you touch it — then the words unscramble.",
  },
  {
    n: "04",
    slug: "/x4",
    name: "Portrait",
    blurb: "Photos set down on a shelf, tilted. They straighten when you reach.",
    images: true,
  },
  {
    n: "05",
    slug: "/x5",
    name: "Beam",
    blurb: "One orange dot that travels the nav and settles under your cursor.",
  },
  {
    n: "06",
    slug: "/x6",
    name: "Ledger",
    blurb: "An index that stays folded. Rows breathe open on hover.",
  },
  {
    n: "07",
    slug: "/x7",
    name: "Peek",
    blurb: "Hover a project and its picture floats up under the cursor.",
    images: true,
  },
  {
    n: "08",
    slug: "/x8",
    name: "Reveal",
    blurb: "Nothing until you ask — years, hostnames, handles slide open inline.",
  },
  {
    n: "09",
    slug: "/x9",
    name: "Gallery",
    blurb: "Sticky intro on the left, image stills drifting past on the right.",
    images: true,
  },
  {
    n: "10",
    slug: "/x10",
    name: "Morph",
    blurb: "Quiet's glyph chips, now drawing themselves in ink on hover.",
  },
];

const earlier = [
  { slug: "/m1", name: "Nightlite", note: "parent" },
  { slug: "/m2", name: "Quiet", note: "parent" },
  { slug: "/m3", name: "Dot Index", note: "round two" },
  { slug: "/m4", name: "Glow", note: "round two" },
  { slug: "/m5", name: "Prompt", note: "round two" },
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
            Round three: ten tighter merges of Nightlite × Quiet — less stuff,
            better details. Pick one and we refine from there.
          </p>
        </header>

        <ul className="mt-16">
          {merges.map((v, i) => (
            <li
              key={v.slug}
              className="rise border-t border-[#242424] last:border-b"
              style={{ "--rise-delay": `${0.06 * (i + 1)}s` } as React.CSSProperties}
            >
              <Link
                href={v.slug}
                className="group flex items-baseline gap-6 py-4 transition-colors duration-200 hover:bg-[#161616]"
              >
                <span className="w-8 shrink-0 font-mono text-xs text-[#5A5A5A] transition-colors duration-200 group-hover:text-[#EDEDED]">
                  {v.n}
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-medium tracking-tight">
                    {v.name}
                    {v.images && (
                      <span className="ml-2 rounded-full border border-[#2A2A2A] px-1.5 py-0.5 align-middle font-mono text-[10px] font-normal text-[#5A5A5A]">
                        img
                      </span>
                    )}
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
          style={{ "--rise-delay": "0.72s" } as React.CSSProperties}
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
          style={{ "--rise-delay": "0.8s" } as React.CSSProperties}
        >
          All copy is placeholder — everything lives in lib/content.ts. The
          &ldquo;img&rdquo; versions have slots ready for real images.
        </footer>
      </main>
    </div>
  );
}
