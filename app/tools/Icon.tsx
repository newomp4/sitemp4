/**
 * Four glyphs — three from the Central Icons set (v1.35, licensed) and
 * the homepage's own hammer — kept
 * inline rather than loaded: at this size a sprite or a fetch costs more
 * than the paths themselves. They are drawn on the same 24-unit grid as
 * the back arrow, and take their colour from the text around them.
 */

type Glyph = { d: string; evenOdd?: boolean; extra?: string };

const GLYPHS = {
  /* IconChevronRightSmall — the disclosure caret on each row. */
  chevronRight: {
    d: "M9.29289 7.29289C9.68342 6.90237 10.3166 6.90237 10.7071 7.29289L14 10.5858C14.781 11.3668 14.781 12.6332 14 13.4142L10.7071 16.7071C10.3166 17.0976 9.68342 17.0976 9.29289 16.7071C8.90237 16.3166 8.90237 15.6834 9.29289 15.2929L12.5858 12L9.29289 8.70711C8.90237 8.31658 8.90237 7.68342 9.29289 7.29289Z",
    evenOdd: true,
  },
  /* IconArrowUpRight — anything that leaves the page. */
  arrowUpRight: {
    d: "M8 6.5C8 5.67157 8.67157 5 9.5 5H17.5C18.3284 5 19 5.67157 19 6.5V14.5C19 15.3284 18.3284 16 17.5 16C16.6716 16 16 15.3284 16 14.5V10.1213L7.56066 18.5607C6.97487 19.1464 6.02513 19.1464 5.43934 18.5607C4.85355 17.9749 4.85355 17.0251 5.43934 16.4393L13.8787 8H9.5C8.67157 8 8 7.32843 8 6.5Z",
    evenOdd: true,
  },
  /* The hammer from the homepage footer's Tools link — the same mark
     that brings you here, standing at the head of the page it opens. */
  hammer: {
    d: "M1.73717 12.7374C1.05375 12.054 1.05376 10.946 1.73717 10.2626L9.48717 2.51256C9.81536 2.18437 10.2605 2 10.7246 2H14.2749C14.739 2 15.1841 2.18437 15.5123 2.51256L16.2623 3.26256C16.9457 3.94598 16.9457 5.05402 16.2623 5.73744L6.73717 15.2626C6.05376 15.946 4.94572 15.946 4.2623 15.2626L1.73717 12.7374Z",
    extra: "M20.2497 20.25C19.2832 21.2165 17.7162 21.2165 16.7497 20.25L10.2497 13.75L13.7497 10.25L20.2497 16.75C21.2162 17.7165 21.2162 19.2835 20.2497 20.25Z",
  },
  /* IconGithub — where the source lives. */
  github: {
    d: "M12 1.95068C17.525 1.95068 22 6.42568 22 11.9507C21.9995 14.0459 21.3419 16.0883 20.1198 17.7902C18.8977 19.4922 17.1727 20.768 15.1875 21.4382C14.6875 21.5382 14.5 21.2257 14.5 20.9632C14.5 20.6257 14.5125 19.5507 14.5125 18.2132C14.5125 17.2757 14.2 16.6757 13.8375 16.3632C16.0625 16.1132 18.4 15.2632 18.4 11.4257C18.4 10.3257 18.0125 9.43818 17.375 8.73818C17.475 8.48818 17.825 7.46318 17.275 6.08818C17.275 6.08818 16.4375 5.81318 14.525 7.11318C13.725 6.88818 12.875 6.77568 12.025 6.77568C11.175 6.77568 10.325 6.88818 9.525 7.11318C7.6125 5.82568 6.775 6.08818 6.775 6.08818C6.225 7.46318 6.575 8.48818 6.675 8.73818C6.0375 9.43818 5.65 10.3382 5.65 11.4257C5.65 15.2507 7.975 16.1132 10.2 16.3632C9.9125 16.6132 9.65 17.0507 9.5625 17.7007C8.9875 17.9632 7.55 18.3882 6.65 16.8757C6.4625 16.5757 5.9 15.8382 5.1125 15.8507C4.275 15.8632 4.775 16.3257 5.125 16.5132C5.55 16.7507 6.0375 17.6382 6.15 17.9257C6.35 18.4882 7 19.5632 9.5125 19.1007C9.5125 19.9382 9.525 20.7257 9.525 20.9632C9.525 21.2257 9.3375 21.5257 8.8375 21.4382C6.8458 20.7752 5.11342 19.502 3.88611 17.799C2.65881 16.096 1.9989 14.0498 2 11.9507C2 6.42568 6.475 1.95068 12 1.95068Z",
  },
} satisfies Record<string, Glyph>;

export type IconName = keyof typeof GLYPHS;

export default function Icon({
  name,
  size = 16,
  className,
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  const glyph: Glyph = GLYPHS[name];
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d={glyph.d}
        fill="currentColor"
        {...(glyph.evenOdd ? { fillRule: "evenodd" as const, clipRule: "evenodd" as const } : {})}
      />
      {glyph.extra && <path d={glyph.extra} fill="currentColor" fillRule="evenodd" clipRule="evenodd" />}
    </svg>
  );
}
