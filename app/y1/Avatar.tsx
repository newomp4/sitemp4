"use client";

import Image from "next/image";
import { useState } from "react";
import { profile } from "@/lib/content";

/**
 * The little profile-picture circle in the headline. It loads live from
 * unavatar (which proxies the current Twitter avatar), so changing the
 * pfp on Twitter updates the site automatically. If that service is ever
 * unreachable, it falls back to the snapshot committed in /public.
 */
const LIVE = `https://unavatar.io/x/${profile.handle}`;
const SNAPSHOT = "/photos/avatar.jpg";

export default function Avatar() {
  const [src, setSrc] = useState(LIVE);
  return (
    <Image
      src={src}
      alt=""
      width={26}
      height={26}
      unoptimized
      onError={() => setSrc(SNAPSHOT)}
      className="rounded-full border border-[#3F3F3F] transition-[border-color,transform] duration-300 group-hover/handle:scale-105 group-hover/handle:border-[#6E6E6E] motion-reduce:transition-none motion-reduce:group-hover/handle:scale-100"
    />
  );
}
