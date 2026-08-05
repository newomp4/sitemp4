/**
 * Reusable image placeholder — pure CSS gradients, fixed 3:2 aspect.
 * Distinct quiet gradient per index, big mono numeral, tiny format label.
 */

const ART = [
  "bg-linear-to-br from-[#2a2119] via-[#1c1713] to-[#141110]",
  "bg-linear-to-br from-[#1a222b] via-[#141a20] to-[#101316]",
  "bg-linear-to-br from-[#1d2620] via-[#151d18] to-[#111511]",
];

export default function Placeholder({ index }: { index: number }) {
  const numeral = String(index + 1).padStart(2, "0");
  return (
    <div
      className={`relative aspect-[3/2] w-full overflow-hidden ${ART[index % ART.length]}`}
    >
      {/* Replace with <Image src="/work/….jpg" alt="" fill className="object-cover" /> */}
      <span
        aria-hidden="true"
        className="absolute bottom-2 left-3 font-mono text-[48px] leading-none font-medium text-white/10"
      >
        {numeral}
      </span>
      <span
        aria-hidden="true"
        className="absolute top-2.5 right-3 font-mono text-[10px] text-white/25"
      >
        image · 3:2
      </span>
    </div>
  );
}
