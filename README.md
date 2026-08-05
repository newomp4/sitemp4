# owen — personal site

Personal "what I do" site for [@newomp4](https://github.com/newomp4). Ultra-minimal, inspired by
[Minimal Portfolio Lite](https://www.figma.com/community/file/1071188711165074571/minimal-portfolio-lite),
[krish.sh](https://www.krish.sh), [michieldegraaf.com](https://www.michieldegraaf.com), and the copy of [nickbig.com](https://nickbig.com).

Built with Next.js (App Router) + Tailwind CSS v4 + TypeScript.

## The five versions

The homepage is a temporary picker. Each route is a complete, standalone take on the same content:

| Route | Name     | Personality                                                        |
| ----- | -------- | ------------------------------------------------------------------ |
| `/v1` | Lite     | The Figma template, faithfully — avatar, quiet type, ↗ links       |
| `/v2` | Terminal | Dark `#111`, tiny, lowercase, anti-promotional                     |
| `/v3` | Document | A Notion page — blocks, hover highlights, callout, a real toggle   |
| `/v4` | Index    | Swiss grid, hairlines, huge type, rows that invert on hover        |
| `/v5` | Letter   | 420px of warm cream paper, links woven into sentences, a glass dock |

Once a winner is chosen: its page becomes `app/page.tsx`, the other `v*` folders get deleted.

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
