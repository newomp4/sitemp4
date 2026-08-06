"use client";

/**
 * Footer bake-off — /footers
 * Ten completely different builds of the hidden footer, on the site's
 * own base. Click the pills (or press 1-9, 0 for ten) and scroll to the
 * bottom to feel each one. The winner replaces the production footer.
 */

import { useEffect, useRef, useState } from "react";
import { profile, path } from "@/lib/content";
import styles from "./styles.module.css";

import F1 from "./variants/f1";
import F2 from "./variants/f2";
import F3 from "./variants/f3";
import F4 from "./variants/f4";
import F5 from "./variants/f5";
import F6 from "./variants/f6";
import F7 from "./variants/f7";
import F8 from "./variants/f8";
import F9 from "./variants/f9";
import F10 from "./variants/f10";

const VARIANTS: { name: string; Layer: React.ComponentType }[] = [
  { name: "Dia, in blues", Layer: F1 },
  { name: "Canvas dither", Layer: F2 },
  { name: "Hue drift", Layer: F3 },
  { name: "Glow stack", Layer: F4 },
  { name: "Northern", Layer: F5 },
  { name: "Counterspin", Layer: F6 },
  { name: "Spotlight", Layer: F7 },
  { name: "Dia rainbow", Layer: F8 },
  { name: "Waves", Layer: F9 },
  { name: "Beams", Layer: F10 },
];

export default function FootersPage() {
  const [active, setActive] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);

  /* Scroll → --reveal / --revealE on the stage (same driver as production) */
  useEffect(() => {
    const stage = stageRef.current;
    const spacer = spacerRef.current;
    if (!stage || !spacer) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = spacer.getBoundingClientRect();
      const p = Math.min(
        1,
        Math.max(0, (window.innerHeight - rect.top) / rect.height),
      );
      stage.style.setProperty("--reveal", p.toFixed(4));
      stage.style.setProperty("--revealE", (1 - Math.pow(1 - p, 2)).toFixed(4));
      stage.dataset.open = p > 0.02 ? "true" : "false";
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /* Number keys switch variants */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const n = e.key === "0" ? 10 : parseInt(e.key, 10);
      if (n >= 1 && n <= 10) setActive(n - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const { name, Layer } = VARIANTS[active];

  return (
    <div
      ref={stageRef}
      className={`${styles.root} ${styles.rootStage} min-h-dvh w-full bg-[#111111] text-[#F5F5F5]`}
    >
      {/* Switcher */}
      <div className={styles.switcher} role="tablist" aria-label="Footer variants">
        {VARIANTS.map((v, i) => (
          <button
            key={v.name}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`${styles.pill} ${i === active ? styles.pillActive : ""}`}
          >
            {i + 1}
          </button>
        ))}
        <span className={styles.variantName}>{name}</span>
      </div>
      <p className={styles.hint}>press 1-9, 0 for ten · scroll to the bottom</p>

      {/* Abbreviated base page so the footer is judged in context */}
      <div className="mx-auto w-full max-w-[42rem] px-6 py-24 sm:py-32">
        <h1 className="text-[26px] font-semibold tracking-tight">
          {profile.headline}{" "}
          <span aria-hidden="true" className="font-normal text-[#3F3F3F]">
            /
          </span>{" "}
          <span className="text-[#A3A3A3]">@{profile.handle}</span>
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[#A3A3A3]">
          {profile.intro[0]}
        </p>
        <h2 className="mt-16 mb-5 text-[14px] font-semibold">The path</h2>
        <ul className="space-y-5">
          {path.map((item) => (
            <li key={item.title} className="grid grid-cols-[112px_1fr] gap-x-4">
              <p className="text-[12px] leading-6 text-[#6E6E6E]">
                {item.years}
              </p>
              <p className="text-[16px] leading-6 font-semibold">
                {item.title}
                {item.role && (
                  <span className="font-normal text-[#A3A3A3]">
                    {" "}
                    · {item.role}
                  </span>
                )}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-16 text-[13px] text-[#6E6E6E]">
          © 2026 {profile.name} · this is the footer test page
        </p>
      </div>

      {/* Dead space that drives the reveal */}
      <div ref={spacerRef} className={styles.spacer} />

      {/* The contender */}
      <Layer />

      {/* Shared quote/@ row on top of every variant */}
      <div className={styles.textLayer} aria-hidden="true">
        <div className={styles.textRow}>
          <p className={styles.quote}>
            &ldquo;It won&rsquo;t fail because of me&rdquo;
            <span className={styles.by}> - tom sachs</span>
          </p>
          <a
            href={profile.handleHref}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={-1}
            className={styles.at}
          >
            @{profile.handle}
          </a>
        </div>
      </div>
    </div>
  );
}
