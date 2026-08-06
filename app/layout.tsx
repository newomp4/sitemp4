import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const TITLE = "Owen Opacki · newomp4";
const DESCRIPTION =
  "Owen Opacki makes things for the internet. @newomp4 everywhere.";

export const metadata: Metadata = {
  metadataBase: new URL("https://owenopacki.com"),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    siteName: "Owen Opacki",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@newomp4",
  },
};

export const viewport: Viewport = {
  themeColor: "#111111",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
