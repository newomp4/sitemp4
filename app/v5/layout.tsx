import type { ReactNode } from "react";
import { Newsreader } from "next/font/google";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["italic"],
});

export default function LetterLayout({ children }: { children: ReactNode }) {
  return <div className={newsreader.variable}>{children}</div>;
}
