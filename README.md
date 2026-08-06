# owenopacki — personal site

The personal site of [Owen Opacki](https://x.com/newomp4) (@newomp4): who he is, the path so far,
and where to find him. Dark, ultra-minimal, one page plus a film-photo gallery at [`/photos`](./app/photos).

Built with Next.js (App Router) + Tailwind CSS v4 + TypeScript. Fully static.

## Editing content

**All copy, the career path, links, and socials live in [`lib/content.ts`](lib/content.ts).**
Notes and intro lines support `[markdown links](https://...)`, including in-page anchors like
`[college](#bryant)`. Logos for path entries live in `public/logos/`; photos in `public/photos/`
(committed byte-for-byte from the original scans — never recompress them).

## Develop

```bash
npm install
npm run dev
```

## Deploy (Vercel + Namecheap)

1. Push to GitHub (done — this repo).
2. Go to [vercel.com/new](https://vercel.com/new), import the repo, hit Deploy. Defaults are correct.
3. In the Vercel project → Settings → Domains, add the domain.
4. In Namecheap → Domain → Advanced DNS, add the records Vercel shows
   (an `A` record `@ → 76.76.21.21` and a `CNAME` `www → cname.vercel-dns.com`).

Every push to `main` auto-deploys after that.
