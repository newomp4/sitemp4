import styles from "./styles.module.css";

/* Placeholder art — layered CSS gradients only, one look per index.
   Slate / dusk / ember-gray, cycling. */
const ART: string[] = [
  // 01 — slate
  "radial-gradient(120% 90% at 80% 10%, rgba(148, 163, 184, 0.14), transparent 60%), linear-gradient(135deg, #1d2229 0%, #161a1f 48%, #111317 100%)",
  // 02 — dusk
  "radial-gradient(110% 100% at 15% 90%, rgba(167, 139, 190, 0.12), transparent 55%), linear-gradient(160deg, #201d26 0%, #17151d 52%, #121116 100%)",
  // 03 — ember-gray
  "radial-gradient(130% 80% at 70% 85%, rgba(198, 150, 112, 0.1), transparent 55%), linear-gradient(145deg, #241f1b 0%, #1a1613 50%, #131110 100%)",
];

export default function Still({ index }: { index: number }) {
  const numeral = String(index + 1).padStart(2, "0");
  return (
    <div
      aria-hidden="true"
      className={`${styles.frame} relative aspect-[3/2] overflow-hidden rounded-xl border border-[#232323] bg-[#161616]`}
    >
      {/* Replace with <Image src="/stills/01.jpg" alt="" fill className="object-cover" /> */}
      <div
        className={styles.art}
        style={{ backgroundImage: ART[index % ART.length] }}
      />
      <div
        className={`${styles.numeral} absolute -bottom-4 right-5 font-mono text-[96px] leading-none tracking-[-0.04em] text-[#f5f5f5] select-none`}
      >
        {numeral}
      </div>
      <div className="absolute top-3.5 left-4 font-mono text-[10px] lowercase tracking-[0.08em] text-[#5c5c5c]">
        image · 3:2
      </div>
    </div>
  );
}
