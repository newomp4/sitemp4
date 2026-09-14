import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 restricts the quality prop to [75] by default; the hero
    // portrait renders small, so it gets a higher tier to stay crisp.
    qualities: [75, 90],
  },
  // The gallery used to live at /photos. Anything already shared out
  // there — links, the old sitemap entry — still lands on it. Matching
  // is exact on purpose: the photos themselves are served from
  // /photos/... in /public, and a wildcard here would redirect them.
  redirects() {
    return [{ source: "/photos", destination: "/gallery", permanent: true }];
  },
};

export default nextConfig;
