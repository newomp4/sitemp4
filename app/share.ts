/**
 * The preview every page shows when it's shared: the rooftop photo in
 * app/opengraph-image.jpg. A page that sets its own `openGraph` replaces the
 * layout's whole object (Next merges metadata one level deep), so without
 * this the image would be dropped from every page except the home page.
 */
export const shareImage = {
  url: "/opengraph-image.jpg",
  width: 1200,
  height: 630,
  alt: "Owen, Galileo, and Ariel on a rooftop in front of the Williamsburg Bridge at dusk",
};
