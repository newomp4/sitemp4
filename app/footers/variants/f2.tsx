"use client";

import { useEffect, useRef } from "react";
import styles from "./f2.module.css";

/**
 * f2 — "Canvas dither". A ~30fps canvas paints nine hue-spread bars
 * (indigo → cyan left to right), each swaying and breathing on its own
 * slow sine clock, blurred with ctx.filter while drawing (with a
 * downscale-upscale fallback where ctx.filter is unsupported). On top,
 * one of three pre-generated noise plates — masked to a pool at bottom
 * center — is overlay-composited each frame, cycling plates every four
 * frames: living film grain that is also a mathematically band-proof
 * dither. The loop reads --reveal once per frame and goes idle when shut.
 */

const BAR_COUNT = 9;

/* Hue spread indigo → royal → electric → azure → cyan, left to right */
const BAR_RGB: [number, number, number][] = [
  [18, 63, 158], // #123f9e
  [23, 73, 182], // #1749b6
  [17, 85, 216], // #1155d8
  [13, 97, 240], // #0d61f0
  [14, 117, 255], // #0e75ff
  [12, 141, 249], // #0c8df9
  [20, 163, 250], // #14a3fa
  [31, 192, 254], // #1fc0fe
  [42, 212, 255], // #2ad4ff
];

/* Per-bar clocks: rad/s speeds and phases, deliberately incommensurate */
const SWAY_SPEED = [0.052, 0.118, 0.071, 0.096, 0.06, 0.11, 0.083, 0.066, 0.104];
const SWAY_PHASE = [0.0, 1.3, 2.6, 3.9, 5.2, 0.7, 2.0, 3.3, 4.6];
const SWAY_AMP = [12, 16, 10, 18, 14, 11, 17, 13, 15];
const BREATHE_SPEED = [0.081, 0.057, 0.102, 0.064, 0.115, 0.049, 0.09, 0.12, 0.07];
const BREATHE_PHASE = [2.1, 4.4, 0.4, 5.0, 1.6, 3.2, 5.8, 0.9, 2.7];
const HEIGHT_FRAC = [0.56, 0.66, 0.77, 0.9, 1.0, 0.9, 0.77, 0.66, 0.56];

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
const LOW = 16; // fallback downscale factor (16x bilinear upscale ≈ big blur)

export default function F2() {
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
    const rootStyle = getComputedStyle(root); // live — read per frame

    /* Feature-test ctx.filter (Safari shipped it late) */
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

    /* Three pre-masked full-size grain plates: noise tiled from a bitmap,
       then destination-in faded by a radial pooled at bottom center so
       the grain can never gray the bare page above the color. */
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

    const drawBars = (c: CanvasRenderingContext2D, t: number) => {
      const bw = (w / BAR_COUNT) * 1.65;
      for (let i = 0; i < BAR_COUNT; i++) {
        const [r, g, b] = BAR_RGB[i];
        const cx =
          ((i + 0.5) / BAR_COUNT) * w +
          Math.sin(t * SWAY_SPEED[i] + SWAY_PHASE[i]) * SWAY_AMP[i];
        const barH =
          h *
          HEIGHT_FRAC[i] *
          (1 + 0.055 * Math.sin(t * BREATHE_SPEED[i] + BREATHE_PHASE[i]));
        const grad = c.createLinearGradient(0, h, 0, h - barH);
        for (const [o, a] of ALPHA_STOPS) {
          grad.addColorStop(o, `rgba(${r},${g},${b},${a})`);
        }
        c.fillStyle = grad;
        /* overshoot below the bottom edge so the blur never lifts it */
        c.fillRect(cx - bw / 2, h - barH, bw, barH + 80);
      }
    };

    const render = (t: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      if (hasFilter) {
        ctx.save();
        ctx.filter = "blur(42px)";
        drawBars(ctx, t);
        ctx.restore();
      } else if (low && lowCtx) {
        lowCtx.setTransform(1, 0, 0, 1, 0, 0);
        lowCtx.clearRect(0, 0, low.width, low.height);
        lowCtx.setTransform(dpr / LOW, 0, 0, dpr / LOW, 0, 0);
        drawBars(lowCtx, t);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(low, 0, 0, low.width, low.height, 0, 0, w, h);
      }
      const plate = grains.length
        ? grains[(frame >> 2) % grains.length]
        : undefined;
      if (plate) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalCompositeOperation = "overlay";
        ctx.globalAlpha = 0.07;
        ctx.drawImage(plate, 0, 0);
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 1;
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < 31) return; // ~30fps cap
      last = now;
      const reveal =
        parseFloat(rootStyle.getPropertyValue("--reveal")) || 0;
      if (reveal <= 0.01) return; // shut — keep the loop idle-cheap
      frame++;
      render(now / 1000);
    };

    /* Three 256×256 noise tiles (Math.random is fine here) */
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
      if (reduced) render(0);
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
        render(0); // one static, still band-proof frame
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
