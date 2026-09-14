export type PhotoBox = { top: number; left: number; width: number; height: number };

/* Room set aside under the print for its caption: the 16px gap plus the
   couple of lines the caption itself can run to. */
const CAPTION_SPACE = 104;

/**
 * The open print's box: as large as fits comfortably, at the photo's own
 * ratio, centred in the window — which is where the grid behind it is
 * centred too, so the two stay concentric. Only a print tall enough that
 * a centred box would push its caption off the bottom edge rides up, and
 * then only by as much as the caption needs.
 */
export function fitPhoto(ratio: number, viewportWidth: number, viewportHeight: number, hasCaption: boolean): PhotoBox {
  const aspect = Number.isFinite(ratio) && ratio > 0 ? ratio : 1;
  const captionSpace = hasCaption ? CAPTION_SPACE : 0;
  const maxWidth = Math.min(viewportWidth * 0.86, 760);
  const maxHeight = Math.max(1, Math.min(viewportHeight * 0.66, 680, viewportHeight - captionSpace - 48));
  const height = Math.min(maxWidth / aspect, maxHeight);
  const width = aspect * height;
  /* The lowest the print can sit and still leave the caption its room.
     On any window with the height for it, the centred position is the
     higher of the two, so it wins and the print lands dead centre. */
  const lowest = viewportHeight - captionSpace - height;
  return {
    width,
    height,
    left: (viewportWidth - width) / 2,
    top: Math.max(24, Math.min((viewportHeight - height) / 2, lowest)),
  };
}
