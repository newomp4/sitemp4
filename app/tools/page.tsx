import type { Metadata } from "next";
import ToolsList from "./ToolsList";
import { toolsIntro } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Owen Opacki · Tools",
  description: toolsIntro,
  alternates: { canonical: "/tools" },
  openGraph: {
    title: "Owen Opacki · Tools",
    description: toolsIntro,
    url: "/tools",
  },
};

export default function ToolsPage() {
  return <ToolsList />;
}
