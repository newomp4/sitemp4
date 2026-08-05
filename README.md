# owen — personal site

Personal "what I do" site for [@newomp4](https://github.com/newomp4). Ultra-minimal, inspired by
[Minimal Portfolio Lite](https://www.figma.com/community/file/1071188711165074571/minimal-portfolio-lite),
[krish.sh](https://www.krish.sh), [michieldegraaf.com](https://www.michieldegraaf.com), and the copy of [nickbig.com](https://nickbig.com).

Built with Next.js (App Router) + Tailwind CSS v4 + TypeScript.

## The versions

The homepage is a temporary picker. Each route is a complete, standalone take on the same content.

**Round 3 — ten tighter merges of Nightlite × Quiet** (all dark; `img` = has image placeholder slots):

| Route  | Name     | Personality                                                          |
| ------ | -------- | -------------------------------------------------------------------- |
| `/x1`  | Slate    | The straightest merge — rows dim their neighbors on hover            |
| `/x2`  | Frames   | Work as framed stills that breathe on hover · img                    |
| `/x3`  | Decode   | Calm until touched — link titles unscramble character by character   |
| `/x4`  | Portrait | A tilted photo shelf that straightens when you reach for it · img    |
| `/x5`  | Beam     | One orange dot that travels the nav with a springy overshoot         |
| `/x6`  | Ledger   | A folded index — rows breathe open to reveal their descriptions      |
| `/x7`  | Peek     | Hover a project and its picture floats up under the cursor · img     |
| `/x8`  | Reveal   | Years, hostnames, and handles slide open inline on demand            |
| `/x9`  | Gallery  | Sticky intro left, image stills drifting past on the right · img     |
| `/x10` | Morph    | Quiet's glyph chips, drawing themselves in ink on hover              |

Earlier generations, kept for reference: `/m1` Nightlite + `/m2` Quiet (round-2 parents),
`/m3` Dot Index, `/m4` Glow, `/m5` Prompt, and the round-1 originals `/v1` Lite + `/v2` Terminal.

Once a winner is chosen: its page becomes `app/page.tsx`, the other variant folders get deleted.

## Editing content

**All copy, work items, links, and socials live in [`lib/content.ts`](lib/content.ts).**
Edit that one file and every version updates. Everything in it right now is placeholder.

## Develop

```bash
npm install
npm run dev
```

## Deploy (Vercel + Namecheap)

1. Push this repo to GitHub (done).
2. Go to [vercel.com/new](https://vercel.com/new), import the repo, hit Deploy. Defaults are correct.
3. In the Vercel project → Settings → Domains, add your domain.
4. In Namecheap → Domain → Advanced DNS, add the records Vercel shows you
   (an `A` record `@ → 76.76.21.21` and a `CNAME` `www → cname.vercel-dns.com`).

Every push to `main` auto-deploys after that.
