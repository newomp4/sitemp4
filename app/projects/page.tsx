import type { Metadata } from "next";
import ToolsList from "./ToolsList";
import { toolsIntro } from "@/lib/tools";
import { shareImage } from "../share";

export const metadata: Metadata = {
  title: "Owen Opacki · Projects",
  description: toolsIntro,
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Owen Opacki · Projects",
    description: toolsIntro,
    url: "/projects",
    siteName: "Owen Opacki",
    type: "website",
    images: [shareImage],
  },
};

export default function ToolsPage() {
  return <ToolsList />;
}
