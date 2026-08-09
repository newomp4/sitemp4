"use client";

/**
 * ARCHIVED CONCEPTS — ten ways to sell ad space on the site.
 * Not routed. To preview: copy to app/ads/page.tsx and fix the
 * styles import back to "../styles.module.css".
 * Ten ways to sell ad space on a personal site without breaking its
 * voice: all grayscale, all deadpan, all pointing at the DMs.
 * Pills or keys 1-9, 0 for ten.
 */

import { useEffect, useState, type ReactNode } from "react";
import { profile, path, links, socials } from "@/lib/content";
import styles from "@/app/styles.module.css";

const X = "https://x.com/newomp4";

const AdLink = ({ children, href = X }: { children: ReactNode; href?: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={styles.captionLink}
  >
    {children}
  </a>
);

/* The empty-frame hatch used by billboard-style variants */
const hatch = {
  backgroundImage:
    "repeating-linear-gradient(45deg, #1B1B1B 0, #1B1B1B 1px, transparent 1px, transparent 9px)",
};

const VARIANTS = [
  { name: "The missing chapter" },
  { name: "Other things slot" },
  { name: "The classified" },
  { name: "The billboard" },
  { name: "The sponsor bar" },
  { name: "The second print" },
  { name: "The parenthetical" },
  { name: "The empty chip" },
  { name: "The ticker" },
  { name: "The sponsors section" },
];

export default function AdsPage() {
  const [v, setV] = useState(0);
  const [barOpen, setBarOpen] = useState(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const n = e.key === "0" ? 10 : parseInt(e.key, 10);
      if (n >= 1 && n <= 10) {
        setV(n - 1);
        setBarOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const is = (n: number) => v === n - 1;

  return (
    <div
      className={`${styles.root} min-h-dvh w-full bg-[#111111] text-[#F5F5F5]`}
    >
      <style>{`@keyframes ads-ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>

      {/* switcher */}
      <div className="fixed top-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-[#262626] bg-[#111111]/90 px-3 py-2 backdrop-blur-sm">
        {VARIANTS.map((x, i) => (
          <button
            key={x.name}
            type="button"
            onClick={() => {
              setV(i);
              setBarOpen(true);
            }}
            className={`h-7 w-7 cursor-pointer rounded-full text-[12px] transition-colors duration-150 ${
              i === v
                ? "bg-[#F5F5F5] text-[#111111]"
                : "text-[#8A8A8A] hover:text-[#F5F5F5]"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <span className="ml-1.5 border-l border-[#262626] pl-2.5 text-[12px] whitespace-nowrap text-[#A3A3A3]">
          {VARIANTS[v].name}
        </span>
      </div>

      {/* 5 ── sponsor bar (above everything) */}
      {is(5) && barOpen && (
        <div className="flex items-center justify-center gap-3 border-b border-[#1F1F1F] bg-[#141414] px-4 py-2 text-[12.5px] text-[#8A8A8A]">
          <span>
            This week&rsquo;s sponsor: nobody.{" "}
            <AdLink>It could be you</AdLink>
          </span>
          <button
            type="button"
            onClick={() => setBarOpen(false)}
            aria-label="Dismiss"
            className="cursor-pointer text-[#5A5A5A] transition-colors duration-150 hover:text-[#F5F5F5]"
          >
            ×
          </button>
        </div>
      )}

      <div className="mx-auto w-full max-w-[42rem] px-6 py-24">
        {/* ── Hero ── */}
        <div className="flex items-start gap-4">
          <div
            className="h-[160px] w-[128px] shrink-0 rounded-lg border border-[#262626] bg-[#161616]"
            style={{ transform: "rotate(-2deg)" }}
          />
          {/* 6 ── the second print */}
          {is(6) && (
            <div className="mt-3">
              <div
                className="flex h-[130px] w-[104px] items-center justify-center rounded-lg border border-[#262626]"
                style={{ transform: "rotate(2.5deg)", ...hatch }}
              >
                <span className="px-2 text-center text-[10px] leading-4 text-[#5A5A5A]">
                  your logo here
                </span>
              </div>
              <p className="mt-2 ml-1 text-[10px] text-[#5A5A5A]">
                <AdLink>inquire</AdLink>
              </p>
            </div>
          )}
        </div>

        <h1 className="mt-7 text-[26px] font-semibold tracking-tight">
          {profile.headline}{" "}
          <span aria-hidden="true" className="font-normal text-[#3F3F3F]">
            /
          </span>{" "}
          <span className="text-[#A3A3A3]">@{profile.handle}</span>
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[#A3A3A3]">
          I&rsquo;m 19, from Boston, and I make things for the internet.
        </p>
        <p className="mt-3 text-[15px] leading-relaxed text-[#A3A3A3]">
          Recently dropped out of college (class of 2029) to be head of
          creative at Content Rewards, The Marketplace for Virality.
          {/* 7 ── the parenthetical */}
          {is(7) && (
            <span className="text-[#6E6E6E]">
              {" "}
              (A sentence about your brand could live right here.{" "}
              <AdLink>Rates</AdLink>.)
            </span>
          )}
        </p>

        {/* 9 ── the ticker */}
        {is(9) && (
          <div className="mt-6 overflow-hidden border-y border-[#1F1F1F] py-1.5">
            <div
              className="flex w-max whitespace-nowrap"
              style={{ animation: "ads-ticker 28s linear infinite" }}
            >
              {[0, 1].map((n) => (
                <span key={n} className="text-[11px] tracking-[0.08em] text-[#5A5A5A]">
                  AD SPACE AVAILABLE · SERIOUS INQUIRIES ONLY · ZERO IMPRESSIONS
                  SO FAR · A LANDMARK OPPORTUNITY · AD SPACE AVAILABLE · DM
                  @NEWOMP4 · THIS TICKER IS ALSO FOR SALE ·&nbsp;
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── So far ── */}
        <h2 className="mt-14 mb-5 text-[14px] font-semibold">So far</h2>
        <ul className="space-y-5">
          {/* 1 ── the missing chapter */}
          {is(1) && (
            <li className="grid grid-cols-[112px_1fr] gap-x-4">
              <p className="text-[12px] leading-6 text-[#5A5A5A]">2027 – ???</p>
              <div>
                <h3 className="text-[16px] leading-6 font-semibold text-[#8A8A8A]">
                  <span
                    className="mr-2.5 inline-flex h-[22px] w-[22px] items-center justify-center rounded-[5px] border border-dashed border-[#3A3A3A] align-[-5px] text-[11px] text-[#5A5A5A]"
                    style={hatch}
                  >
                    ?
                  </span>
                  Your company
                  <span className="font-normal text-[#6E6E6E]"> · This chapter is for sale</span>
                </h3>
                <p className="mt-1 text-[14px] leading-relaxed text-[#6E6E6E]">
                  The next thing I work on could be yours. Speculative,
                  ambitious, and open to offers. <AdLink>Make one</AdLink>.
                </p>
              </div>
            </li>
          )}
          {path.map((item) => (
            <li key={item.title} className="grid grid-cols-[112px_1fr] gap-x-4">
              <p className="text-[12px] leading-6 text-[#7D7D7D]">{item.years}</p>
              <p className="text-[16px] leading-6 font-semibold">
                {item.title}
                {item.role && (
                  <span className="font-normal text-[#A3A3A3]"> · {item.role}</span>
                )}
              </p>
            </li>
          ))}
        </ul>

        {/* 4 ── the billboard */}
        {is(4) && (
          <div className="mt-14">
            <div
              className="flex h-[120px] items-center justify-center rounded-lg border border-[#262626]"
              style={hatch}
            >
              <p className="text-[12px] text-[#5A5A5A]">
                ad space · 672 × 120 · zero impressions so far
              </p>
            </div>
            <p className="mt-2 text-[12px] text-[#6E6E6E]">
              Never been used. Barely been seen. <AdLink>Fix that</AdLink>.
            </p>
          </div>
        )}

        {/* ── Other things ── */}
        <h2 className="mt-14 mb-5 text-[14px] font-semibold">Other things</h2>
        <ul className="space-y-5">
          {links.map((item) => (
            <li key={item.title}>
              <p className="text-[16px] font-semibold">{item.title} ↗</p>
            </li>
          ))}
          {/* 2 ── other things slot */}
          {is(2) && (
            <li>
              <p className="text-[16px] font-semibold text-[#8A8A8A]">
                Your ad <span className="text-[#5A5A5A]">↗</span>
              </p>
              <p className="mt-1 text-[15px] leading-relaxed text-[#6E6E6E]">
                One slot. Never used. Discerning audience of dozens.{" "}
                <AdLink>Inquire</AdLink>.
              </p>
            </li>
          )}
        </ul>

        {/* 10 ── the sponsors section */}
        {is(10) && (
          <section className="mt-14">
            <h2 className="mb-5 text-[14px] font-semibold">Sponsors</h2>
            <div className="flex items-center gap-3">
              {[0, 1, 2].map((n) => (
                <span
                  key={n}
                  className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-[7px] border border-dashed border-[#333333] text-[10px] text-[#4A4A4A]"
                  style={hatch}
                />
              ))}
              <p className="text-[14px] text-[#8A8A8A]">
                None yet. Be the first and only.{" "}
                <AdLink>Talk to me</AdLink>.
              </p>
            </div>
          </section>
        )}

        {/* ── Contact ── */}
        <h2 className="mt-14 mb-5 text-[14px] font-semibold">Contact</h2>
        <ul className="flex flex-wrap items-center gap-x-5 gap-y-3">
          {socials.map((s) => (
            <li key={s.label} className="text-[15px] text-[#A3A3A3]">
              {s.label} {s.href && "↗"}
            </li>
          ))}
          {/* 8 ── the empty chip */}
          {is(8) && (
            <li className="flex items-center gap-2">
              <span
                className="inline-flex h-[22px] w-[22px] rounded-[5px] border border-dashed border-[#3A3A3A]"
                style={hatch}
              />
              <span className="text-[15px] text-[#6E6E6E]">
                your logo · <AdLink>claim</AdLink>
              </span>
            </li>
          )}
        </ul>

        <p className="mt-8 text-[13px] text-[#7D7D7D]">
          © 2026 {profile.name}
        </p>
        {/* 3 ── the classified */}
        {is(3) && (
          <p className="mt-2 text-[11px] leading-5 text-[#5A5A5A]">
            classifieds: this line of pixels is available. previous tenants:
            none. <AdLink>write in</AdLink>
          </p>
        )}

        <p className="mt-16 text-[12px] text-[#4A4A4A]">
          test page · keys 1-9, 0 for ten · not on the real site
        </p>
      </div>
    </div>
  );
}
