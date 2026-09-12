import type { Metadata } from "next";
import Link from "next/link";
import styles from "../styles.module.css";

export const metadata: Metadata = {
  title: "Owen Opacki · Tools",
  description: "Tools by Owen Opacki. Coming soon.",
  alternates: { canonical: "/tools" },
  openGraph: {
    title: "Owen Opacki · Tools",
    description: "Tools by Owen Opacki. Coming soon.",
    url: "/tools",
  },
};

export default function ToolsPage() {
  return (
    <main className={`${styles.root} relative flex min-h-svh w-full items-center justify-center bg-[#111111] px-6 py-16`}>
      <Link href="/" className={`${styles.backLink} absolute left-6 top-5`}>
        <span aria-hidden="true" className={styles.backArrow}>←</span> Back
      </Link>
      <h1 className="rise text-title font-strong tracking-tight text-[#F5F5F5]">
        Coming soon
      </h1>
    </main>
  );
}
