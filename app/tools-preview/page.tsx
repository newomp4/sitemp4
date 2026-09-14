import type { Metadata } from "next";
import Register from "./variants/Register";

/* Not linked from anywhere and kept out of the index: this is where the
   tools page is being worked out before it replaces /tools. */
export const metadata: Metadata = {
  title: "Owen Opacki · Tools preview",
  robots: { index: false, follow: false },
};

export default function ToolsPreviewPage() {
  return <Register />;
}
