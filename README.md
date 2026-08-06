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

Domains: **owenopacki.com** and **newomp4.com**, both pointing at this site.

1. Push to GitHub (done — this repo).
2. Go to [vercel.com/new](https://vercel.com/new), import `newomp4/sitemp4`, hit Deploy. Defaults are correct.
3. In the Vercel project → Settings → Domains, add all four:
   `owenopacki.com`, `www.owenopacki.com`, `newomp4.com`, `www.newomp4.com`.
   Pick one as the primary (e.g. `owenopacki.com`); Vercel will offer to redirect
   the others to it — accept. One canonical URL is better for sharing and search.
4. In Namecheap, for **each** domain → Advanced DNS, add:
   - `A` record, host `@`, value `76.76.21.21`
   - `CNAME` record, host `www`, value `cname.vercel-dns.com`
   (Delete any parking-page records Namecheap pre-filled.)
5. Back in Vercel → Domains, wait for both to show "Valid Configuration"
   (DNS can take a few minutes to a few hours).

Every push to `main` auto-deploys after that.
