import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Analytics from "./GoogleAnalytics";
import { Providers } from "./Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SPAIK Logomaker",
  description:
    "Create consistent logos for SPAIK tools and products. Internal branding tool with export presets for marketing, sales, and product launches.",
  applicationName: "SPAIK Logomaker",
  keywords: [
    "logo maker",
    "branding tool",
    "internal tools",
    "micro-saas branding",
    "export presets",
    "spaik",
  ],
  creator: "SPAIK",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://logomaker.spaik.io/",
    title: "SPAIK Logomaker",
    description:
      "Create consistent logos for SPAIK tools and products. Internal branding tool with export presets for marketing, sales, and product launches.",
    images: [
      {
        url: "/SPAIK-OG.png",
        width: 1200,
        height: 630,
        alt: "SPAIK Logomaker",
      },
    ],
    siteName: "SPAIK Logomaker",
  },
  abstract: "SPAIK Logomaker - Internal branding tool.",
  themeColor: "#ff7150",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className + ""}>
        <Analytics />
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
