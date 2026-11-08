import { useEffect, useRef, useState } from "react";

/**
 * One play of a row's flourish. The refs go on the row's frame, which the
 * burst is positioned in, and on its mark slot, which the burst starts from.
 * `disabled` holds it still: under reduced motion, or for a row with no
 * flourish of its own.
 */
export default function useBurst(duration: number, disabled: boolean) {
  const [playing, setPlaying] = useState(false);
  const frame = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLSpanElement>(null);

  const play = () => {
    if (disabled || playing || !mark.current || !frame.current) return;
    // Measure once per burst, using the stable slot rather than the animated
    // icon. This also follows wrapped rows and larger text on small screens.
    const slot = mark.current.getBoundingClientRect();
    const box = frame.current.getBoundingClientRect();
    frame.current.style.setProperty("--burst-x", `${slot.left + slot.width / 2 - box.left}px`);
    frame.current.style.setProperty("--burst-y", `${slot.top + slot.height / 2 - box.top}px`);
    setPlaying(true);
  };

  // Let a burst finish after the pointer leaves. Repeated entries cannot
  // stack particles or restart it mid-flight, and nothing animates at rest.
  useEffect(() => {
    if (!playing) return;
    const done = window.setTimeout(() => setPlaying(false), duration);
    return () => window.clearTimeout(done);
  }, [playing, duration]);

  return { playing, frame, mark, play };
}
