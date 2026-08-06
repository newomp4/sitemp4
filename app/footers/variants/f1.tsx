"use client";

import { useEffect, useRef } from "react";
import styles from "./f1.module.css";

/**
 * f1 — "Dia, in blues", rebuilt on canvas so banding is physically
 * impossible: nine overlapping bars with Dia's height arc and the
 * avatar's hue arc, blurred while drawing, dithered by cycling noise
 * plates every few frames (living grain). The reveal is choreographed:
 * each bar rises on its own offset — center leads, edges trail — all
 * riding the springed --reveal, so opening has cascade and tension
 * instead of a linear slide.
 */

const N = 9;

/* Hue arc indigo → royal → electric → azure → cyan → back (Dia symmetry) */
const BAR_RGB: [number, number, number][] = [
  [18, 63, 158], // indigo
  [23, 73, 182], // royal
  [13, 97, 240], // electric
  [12, 141, 249], // azure
  [42, 212, 255], // cyan (center)
  [12, 141, 249],
  [13, 97, 240],
  [23, 73, 182],
  [18, 63, 158],
];

/* Dia's height arc, edges → center */
const HEIGHT_FRAC = [0.54, 0.65, 0.76, 0.89, 0.98, 0.89, 0.76, 0.65, 0.54];

/* Reveal choreography: center leads, edges trail */
const REVEAL_OFFSET = [0.22, 0.16, 0.1, 0.05, 0, 0.05, 0.1, 0.16, 0.22];

const SWAY_SPEED = [0.052, 0.118, 0.071, 0.096, 0.06, 0.11, 0.083, 0.066, 0.104];
const SWAY_PHASE = [0.0, 1.3, 2.6, 3.9, 5.2, 0.7, 2.0, 3.3, 4.6];
const SWAY_AMP = [10, 14, 9, 15, 12, 10, 14, 11, 13];
const BREATHE_SPEED = [0.081, 0.057, 0.102, 0.064, 0.115, 0.049, 0.09, 0.12, 0.07];
const BREATHE_PHASE = [2.1, 4.4, 0.4, 5.0, 1.6, 3.2, 5.8, 0.9, 2.7];

/* Eased alpha falloff, bottom → top */
const ALPHA_STOPS: [number, number][] = [
  [0, 1],
  [0.14, 0.94],
  [0.3, 0.78],
  [0.48, 0.55],
  [0.66, 0.3],
  [0.84, 0.12],
  [1, 0],
];

const TILE = 256;
const LOW = 12; // fallback downscale factor where ctx.filter is unsupported

export default function F1() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const rootStyle = getComputedStyle(root);

    ctx.filter = "blur(2px)";
    const hasFilter = ctx.filter !== "none";
    ctx.filter = "none";

    let w = 0;
    let h = 0;
    let dpr = 1;
    let low: HTMLCanvasElement | null = null;
    let lowCtx: CanvasRenderingContext2D | null = null;

    const bitmaps: ImageBitmap[] = [];
    const grains: HTMLCanvasElement[] = [];
    let disposed = false;
    let raf = 0;
    let last = 0;
    let frame = 0;

    const buildGrains = () => {
      grains.length = 0;
      for (const bm of bitmaps) {
        const g = document.createElement("canvas");
        g.width = canvas.width;
        g.height = canvas.height;
        const gc = g.getContext("2d");
        if (!gc) continue;
        for (let y = 0; y < g.height; y += TILE) {
          for (let x = 0; x < g.width; x += TILE) {
            gc.drawImage(bm, x, y);
          }
        }
        gc.globalCompositeOperation = "destination-in";
        gc.translate(g.width / 2, g.height);
        gc.scale(g.width * 0.72, g.height * 1.15);
        const m = gc.createRadialGradient(0, 0, 0, 0, 0, 1);
        m.addColorStop(0, "rgba(0,0,0,1)");
        m.addColorStop(0.45, "rgba(0,0,0,0.85)");
        m.addColorStop(0.7, "rgba(0,0,0,0.4)");
        m.addColorStop(1, "rgba(0,0,0,0)");
        gc.fillStyle = m;
        gc.fillRect(-2, -2, 4, 4);
        gc.setTransform(1, 0, 0, 1, 0, 0);
        grains.push(g);
      }
    };

    const size = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      if (!hasFilter) {
        low = low ?? document.createElement("canvas");
        low.width = Math.max(1, Math.ceil((w * dpr) / LOW));
        low.height = Math.max(1, Math.ceil((h * dpr) / LOW));
        lowCtx = low.getContext("2d");
      }
      if (bitmaps.length) buildGrains();
    };

    /* Each bar's own reveal: center leads, edges trail; the springed
       global value may overshoot 1, which passes straight through as a
       brief extra rise — the elastic settle. */
    const barReveal = (p: number, i: number) => {
      const o = REVEAL_OFFSET[i];
      return Math.max(0, Math.min(1.12, (p - o) / (1 - o)));
    };

    const drawBars = (c: CanvasRenderingContext2D, t: number, p: number) => {
      const bw = (w / N) * 1.62; // Dia-style overlap
      for (let i = 0; i < N; i++) {
        const rv = barReveal(p, i);
        if (rv <= 0.001) continue;
        const [r, g, b] = BAR_RGB[i];
        const cx =
          ((i + 0.5) / N) * w +
          Math.sin(t * SWAY_SPEED[i] + SWAY_PHASE[i]) * SWAY_AMP[i];
        const fullH =
          h *
          HEIGHT_FRAC[i] *
          (1 + 0.05 * Math.sin(t * BREATHE_SPEED[i] + BREATHE_PHASE[i]));
        const barH = fullH * rv;
        const grad = c.createLinearGradient(0, h, 0, h - barH);
        for (const [o, a] of ALPHA_STOPS) {
          grad.addColorStop(o, `rgba(${r},${g},${b},${a})`);
        }
        c.fillStyle = grad;
        c.fillRect(cx - bw / 2, h - barH, bw, barH + 80);
      }
    };

    const render = (t: number, p: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      if (hasFilter) {
        ctx.save();
        ctx.filter = "blur(30px)";
        drawBars(ctx, t, p);
        ctx.restore();
      } else if (low && lowCtx) {
        lowCtx.setTransform(1, 0, 0, 1, 0, 0);
        lowCtx.clearRect(0, 0, low.width, low.height);
        lowCtx.setTransform(dpr / LOW, 0, 0, dpr / LOW, 0, 0);
        drawBars(lowCtx, t, p);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(low, 0, 0, low.width, low.height, 0, 0, w, h);
      }
      const plate = grains.length
        ? grains[(frame >> 2) % grains.length]
        : undefined;
      if (plate && p > 0.01) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalCompositeOperation = "overlay";
        ctx.globalAlpha = Math.min(1, p) * 0.08;
        ctx.drawImage(plate, 0, 0);
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 1;
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < 31) return;
      last = now;
      const reveal = parseFloat(rootStyle.getPropertyValue("--reveal")) || 0;
      if (reveal <= 0.004) return;
      frame++;
      render(now / 1000, reveal);
    };

    const tiles: Promise<ImageBitmap>[] = [];
    for (let n = 0; n < 3; n++) {
      const img = new ImageData(TILE, TILE);
      const d = img.data;
      for (let p = 0; p < d.length; p += 4) {
        const v = (Math.random() * 255) | 0;
        d[p] = v;
        d[p + 1] = v;
        d[p + 2] = v;
        d[p + 3] = 255;
      }
      tiles.push(createImageBitmap(img));
    }

    size();
    const onResize = () => {
      size();
      if (reduced) render(0, 1);
    };
    window.addEventListener("resize", onResize, { passive: true });

    Promise.all(tiles).then((bms) => {
      if (disposed) {
        bms.forEach((b) => b.close());
        return;
      }
      bitmaps.push(...bms);
      buildGrains();
      if (reduced) {
        render(0, 1);
      } else {
        raf = requestAnimationFrame(loop);
      }
    });

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      bitmaps.forEach((b) => b.close());
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.layer} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
