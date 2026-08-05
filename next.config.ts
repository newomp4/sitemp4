import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 restricts the quality prop to [75] by default; the hero
    // portrait renders small, so it gets a higher tier to stay crisp.
    qualities: [75, 90],
  },
};

export default nextConfig;
