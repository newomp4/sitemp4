"use client";

import type { CSSProperties } from "react";
import type { Art } from "@/lib/tools";
import styles from "./cover.module.css";

/**
 * A generated cover per tool — no images, no canvas, just layers that
 * behave like the thing they stand for. They idle still and start moving
 * when the tool is regarded (`active`): the scan rolls, the silence in
 * the waveform collapses, the wall powers on one cell at a time.
 *
 * Grayscale on purpose. The site has no colour outside the photographs.
 */
export default function Cover({ art, active }: { art: Art; active?: boolean }) {
  return (
    <span
      className={`${styles.cover} ${styles[art]}`}
      data-active={active || undefined}
      aria-hidden="true"
    >
      {layers(art)}
      <span className={styles.vignette} />
    </span>
  );
}

const bars = [12, 34, 18, 46, 26, 8, 5, 6, 7, 5, 30, 44, 22, 38, 16, 28];
const wall = Array.from({ length: 12 }, (_, i) => i);
const chat = [
  { w: 62, a: 0.9 },
  { w: 44, a: 0.7 },
  { w: 74, a: 0.85 },
  { w: 38, a: 0.6 },
  { w: 56, a: 0.75 },
  { w: 68, a: 0.55 },
];
const words = [
  [30, 52, 22],
  [44, 26],
  [18, 38, 30],
];
const cards = [
  { x: 8, y: 12, w: 30, h: 40 },
  { x: 44, y: 6, w: 22, h: 30 },
  { x: 70, y: 18, w: 24, h: 34 },
  { x: 14, y: 60, w: 26, h: 30 },
  { x: 46, y: 46, w: 30, h: 44 },
  { x: 78, y: 62, w: 18, h: 26 },
];

function layers(art: Art) {
  switch (art) {
    case "scan":
      return (
        <>
          <span className={styles.scanImage} />
          <span className={styles.scanLines} />
          <span className={styles.scanRoll} />
        </>
      );

    case "chat":
      return (
        <>
          <span className={styles.checker} />
          <span className={styles.chatStack}>
            {[...chat, ...chat].map((line, i) => (
              <span key={i} className={styles.chatLine} style={{ opacity: line.a }}>
                <span className={styles.chatDot} />
                <span className={styles.chatBar} style={{ width: `${line.w}%` }} />
              </span>
            ))}
          </span>
        </>
      );

    case "board":
      return (
        <span className={styles.boardField}>
          {cards.map((card, i) => (
            <span
              key={i}
              className={styles.boardCard}
              data-play={i === 4 || undefined}
              style={{
                left: `${card.x}%`,
                top: `${card.y}%`,
                width: `${card.w}%`,
                height: `${card.h}%`,
                "--drift-x": `${(card.x - 50) / 12}px`,
                "--drift-y": `${(card.y - 50) / 12}px`,
              } as CSSProperties}
            >
              {i === 4 && <span className={styles.boardPlay} />}
            </span>
          ))}
        </span>
      );

    case "device":
      return (
        <span className={styles.deviceScene}>
          <span className={styles.deviceBody}>
            <span className={styles.deviceNotch} />
            <span className={styles.deviceScreen} />
            <span className={styles.deviceSheen} />
          </span>
        </span>
      );

    case "frame":
      return (
        <>
          <span className={styles.frameShot} />
          <span className={styles.frameMarquee} />
          <span className={styles.frameChip} />
          <span className={styles.frameArrow} />
        </>
      );

    case "mesh":
      return (
        <>
          <span className={`${styles.blob} ${styles.blobA}`} />
          <span className={`${styles.blob} ${styles.blobB}`} />
          <span className={`${styles.blob} ${styles.blobC}`} />
        </>
      );

    case "type":
      return (
        <span className={styles.typeStack}>
          {words.map((line, i) => (
            <span key={i} className={styles.typeLine}>
              {line.map((w, j) => (
                <span key={j} className={styles.typeWord} style={{ width: `${w}%`, "--n": `${i + j}` } as CSSProperties} />
              ))}
            </span>
          ))}
        </span>
      );

    case "wave":
      return (
        <span className={styles.waveRow}>
          {bars.map((h, i) => (
            <span
              key={i}
              className={styles.waveBar}
              data-silent={h < 10 || undefined}
              style={{ height: `${h}%` }}
            />
          ))}
          <span className={styles.wavePlayhead} />
        </span>
      );

    case "wall":
      return (
        <span className={styles.wallGrid}>
          {wall.map((i) => (
            <span key={i} className={styles.wallCell} style={{ "--i": i } as CSSProperties} />
          ))}
        </span>
      );

    case "ascii":
      return (
        <span className={styles.asciiStack}>
          <span className={styles.asciiA}>
            {"##@@%%++==--..\n@@%%++==--..::\n%%++==--..::  \n++==--..::  ,,\n==--..::  ,,''"}
          </span>
          <span className={styles.asciiB}>
            {"..::--==++%%@@\n::--==++%%@@##\n--==++%%@@##%%\n==++%%@@##%%++\n++%%@@##%%++=="}
          </span>
        </span>
      );

    case "split":
      return (
        <span className={styles.splitScene}>
          <span className={styles.splitSource} />
          <span className={styles.splitOut}>
            {[0, 1, 2].map((i) => (
              <span key={i} className={styles.splitPiece} style={{ "--i": i } as CSSProperties} />
            ))}
          </span>
        </span>
      );

    case "arrow":
      return (
        <span className={styles.arrowScene}>
          <span className={styles.arrowTrack} />
          <span className={styles.arrowDot} />
          <span className={styles.arrowHead} />
          <span className={styles.arrowFloor} />
        </span>
      );
  }
}
