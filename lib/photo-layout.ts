export type PhotoBox = { top: number; left: number; width: number; height: number };

/** Reserve room for the caption as well as the photo, including landscape phones. */
export function fitPhoto(ratio: number, viewportWidth: number, viewportHeight: number, hasCaption: boolean): PhotoBox {
  const aspect = Number.isFinite(ratio) && ratio > 0 ? ratio : 1;
  const captionSpace = hasCaption ? 104 : 0;
  const maxWidth = Math.min(viewportWidth * 0.86, 760);
  const maxHeight = Math.max(1, Math.min(viewportHeight * 0.66, 680, viewportHeight - captionSpace - 48));
  const height = Math.min(maxWidth / aspect, maxHeight);
  const width = aspect * height;
  return {
    width,
    height,
    left: (viewportWidth - width) / 2,
    top: Math.max(24, (viewportHeight - height - captionSpace) / 2),
  };
}
