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

  /* Scroll → springs → --reveal / --revealE / --revealSoft on the stage.
     The scroll position only sets a TARGET; two springs chase it with
     weight and a slight overshoot when you stop — the tension/friction
     that a raw linear mapping can never have. --revealSoft is a lazier
     spring so layered variants get elastic depth between their planes. */
  useEffect(() => {
    const stage = stageRef.current;
    const spacer = spacerRef.current;
    if (!stage || !spacer) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let raf = 0;
    let running = false;
    let lastT = 0;
    let target = 0;
    const s1 = { x: 0, v: 0, k: 170, c: 18 }; // tense, ~5% overshoot
    const s2 = { x: 0, v: 0, k: 80, c: 13 }; // soft, lags behind

    const measure = () => {
      const rect = spacer.getBoundingClientRect();
      target = Math.min(
        1,
        Math.max(0, (window.innerHeight - rect.top) / rect.height),
      );
    };
    const apply = () => {
      stage.style.setProperty("--reveal", s1.x.toFixed(4));
      stage.style.setProperty("--revealE", s1.x.toFixed(4));
      stage.style.setProperty("--revealSoft", s2.x.toFixed(4));
      stage.dataset.open = Math.max(target, s1.x) > 0.02 ? "true" : "false";
    };
    const stepSpring = (s: { x: number; v: number; k: number; c: number }, dt: number) => {
      const a = s.k * (target - s.x) - s.c * s.v;
      s.v += a * dt;
      s.x += s.v * dt;
    };
    const settled = (s: { x: number; v: number }) =>
      Math.abs(s.x - target) < 0.0004 && Math.abs(s.v) < 0.002;
    const tick = (now: number) => {
      const dt = Math.min(0.032, (now - lastT) / 1000 || 0.016);
      lastT = now;
      stepSpring(s1, dt);
      stepSpring(s2, dt);
      apply();
      if (settled(s1) && settled(s2)) {
        s1.x = target;
        s2.x = target;
        s1.v = 0;
        s2.v = 0;
        apply();
        running = false;
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      measure();
      if (reduced) {
        s1.x = target;
        s2.x = target;
        apply();
        return;
      }
      if (!running) {
        running = true;
        lastT = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    kick();
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick, { passive: true });
    return () => {
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
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
