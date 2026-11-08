"use client";

import { useEffect, useRef } from "react";
import useReducedMotionPreference from "./useReducedMotionPreference";
import styles from "./not-found.module.css";

/* The numerals are set in the site's own face, then sampled onto a fine
   grid of dots, so they read as Inter rather than a pixel font. */
const PITCH = 5;
const DOT = 1.2; // resting dot radius, css px

/* Under the pointer, nearby dots brighten a little and grow a hair.
   Kept low on purpose: it should be noticed late, not announced. Eases
   in, and lets go more slowly still. */
const REACH = 56; // css px
const LIFT = 0.62; // how far toward white a fully lit dot goes
const GROW = 0.15; // extra radius a fully lit dot gains, as a fraction
const RISE = 0.12; // per frame, toward a brighter target
const FALL = 0.05; // per frame, back toward rest

const PAGE = 17; // #111
const REST = 0.4; // resting brightness, 0 = page, 1 = white
const WHITE = 245; // #F5F5F5

/* x, y: where the dot samples the numerals and meets the pointer.
   px, py: where it is drawn, snapped to the centre of a device pixel so
   every dot rasterises identically instead of each blurring its own way. */
type Dot = { x: number; y: number; px: number; py: number; delay: number; glow: number };

const smooth = (k: number) => k * k * (3 - 2 * k);

/**
 * The 404 as a grid of dots. It arrives as one sweep left to right; after
 * that the only movement is the dots nearest the pointer lifting a little
 * and settling again.
 */
export default function DotGlyph({ text }: { text: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotionPreference();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let dots: Dot[] = [];
    let width = 0;
    let height = 0;
    let pointer: { x: number; y: number } | null = null;
    let born = performance.now();
    let raf = 0;
    let alive = true;

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Set the numerals so their cap height fills the box, flush left.
      const off = document.createElement("canvas");
      off.width = Math.ceil(width);
      off.height = Math.ceil(height);
      const o = off.getContext("2d", { willReadFrequently: true });
      if (!o) return;
      const family = getComputedStyle(document.body).fontFamily;
      o.font = `600 100px ${family}`;
      const probe = o.measureText(text);
      const size = (100 * (height - PITCH)) / probe.actualBoundingBoxAscent;
      o.font = `600 ${size}px ${family}`;
      const m = o.measureText(text);
      o.fillStyle = "#fff";
      o.fillText(text, m.actualBoundingBoxLeft, PITCH / 2 + m.actualBoundingBoxAscent);
      const pixels = o.getImageData(0, 0, off.width, off.height).data;

      const snap = (v: number) => (Math.floor(v * dpr) + 0.5) / dpr;
      const glyphWidth = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
      dots = [];
      for (let y = PITCH / 2; y < height; y += PITCH) {
        for (let x = PITCH / 2; x < width; x += PITCH) {
          if (pixels[(Math.floor(y) * off.width + Math.floor(x)) * 4 + 3] <= 127) continue;
          dots.push({
            x,
            y,
            px: snap(x),
            py: snap(y),
            // The arrival sweeps left to right, with a little scatter so it
            // reads as a signal coming in rather than a wipe.
            delay: (x / Math.max(glyphWidth, 1)) * 520 + Math.random() * 140,
            glow: 0,
          });
        }
      }
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, width, height);
      const age = reduced ? Infinity : now - born;
      let busy = age < 1200;

      for (const dot of dots) {
        // Arrival: each dot fades up on its turn with a brief lift.
        let rest = REST;
        let flare = 0;
        if (age < 1200) {
          const t = Math.min(1, Math.max(0, (age - dot.delay) / 380));
          rest = REST * t;
          flare = t > 0 && t < 1 ? Math.sin(t * Math.PI) * 0.6 : 0;
        }

        let target = 0;
        if (pointer) {
          const d = Math.hypot(dot.x - pointer.x, dot.y - pointer.y);
          if (d < REACH) target = smooth(1 - d / REACH);
        }
        const before = dot.glow;
        dot.glow += (target - dot.glow) * (target > dot.glow ? RISE : FALL);
        if (Math.abs(dot.glow - target) < 0.002) dot.glow = target;
        if (dot.glow !== before) busy = true;

        const lit = Math.max(flare, dot.glow);
        const level = rest + (LIFT - rest) * lit;
        const shade = Math.round(PAGE + (WHITE - PAGE) * Math.max(rest, level));
        ctx.fillStyle = `rgb(${shade} ${shade} ${shade})`;
        ctx.beginPath();
        ctx.arc(dot.px, dot.py, DOT * (1 + GROW * lit), 0, Math.PI * 2);
        ctx.fill();
      }

      raf = busy && alive ? requestAnimationFrame(draw) : 0;
    };

    const wake = () => {
      if (!raf && alive) raf = requestAnimationFrame(draw);
    };

    const onMove = (event: PointerEvent) => {
      if (reduced) return;
      // Touch only lifts the dots while a finger is down.
      if (event.pointerType !== "mouse" && event.buttons === 0) return;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const near = x > -REACH && x < rect.width + REACH && y > -REACH && y < rect.height + REACH;
      if (!near && !pointer) return;
      pointer = near ? { x, y } : null;
      wake();
    };
    const onLeave = () => {
      pointer = null;
      wake();
    };
    const onLift = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") onLeave();
    };

    let cancelled = false;
    // Wait for Inter, or the numerals are sampled from the fallback face.
    document.fonts.ready.then(() => {
      if (cancelled) return;
      build();
      born = performance.now();
      wake();
    });

    const resize = new ResizeObserver(() => {
      if (!dots.length) return;
      build();
      wake();
    });
    resize.observe(canvas);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    window.addEventListener("pointerup", onLift);
    window.addEventListener("pointercancel", onLift);
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      cancelled = true;
      alive = false;
      cancelAnimationFrame(raf);
      resize.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      window.removeEventListener("pointerup", onLift);
      window.removeEventListener("pointercancel", onLift);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced, text]);

  return <canvas ref={canvasRef} className={styles.glyph} role="img" aria-label={text} />;
}
