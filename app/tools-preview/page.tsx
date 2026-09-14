import type { Metadata } from "next";
import Preview from "./Preview";

/* Not linked from anywhere and kept out of the index: this page exists
   to click through the five ways /tools could go, and goes away once
   one of them is chosen. */
export const metadata: Metadata = {
  title: "Owen Opacki · Tools preview",
  robots: { index: false, follow: false },
};

export default function ToolsPreviewPage() {
  return <Preview />;
}
