"use client";

import { useEffect, useState } from "react";

/**
 * "Boston · 2:41 AM" — always Boston time, whoever's
 * looking. Renders nothing until mounted so the static build never
 * carries a stale clock.
 */
export default function LocalTime() {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZone: "America/New_York",
      }).format(new Date());
    const t = window.setTimeout(() => setNow(fmt()), 0);
    const id = window.setInterval(() => setNow(fmt()), 30_000);
    return () => {
      window.clearTimeout(t);
      window.clearInterval(id);
    };
  }, []);

  return (
    <p className="mt-8 min-h-5 text-meta tabular-nums text-[#7D7D7D] max-sm:mt-6">
      {now && <>Boston <span aria-hidden="true">·</span> {now}</>}
    </p>
  );
}
