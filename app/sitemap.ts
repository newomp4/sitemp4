import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://owenopacki.com/", lastModified: new Date() },
    { url: "https://owenopacki.com/photos", lastModified: new Date() },
  ];
}
