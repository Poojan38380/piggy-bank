import type { Metadata } from "next";
import { Work_Sans, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui";

/* ── Font Definitions ──────────────────────────────────────
   Work Sans   → Display, headings (H1–H3)
   Inter       → Body copy, descriptions, UI text
   IBM Plex Mono → ALL rupee amounts, buttons, tags, filters
   ──────────────────────────────────────────────────────── */
const workSans = Work_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/* ── Metadata ──────────────────────────────────────────────
   Landing page SEO — individual pages should override
   ──────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: {
    default: "PiggyBank — Your money, clearly.",
    template: "%s | PiggyBank",
  },
  description:
    "Track every rupee with precision. Filter, sort, and understand your spending — no dashboards, just numbers. Built with Fenmo AI.",
  keywords: [
    "expense tracker",
    "personal finance",
    "piggybank",
    "fenmo",
    "rupee tracker",
    "spending tracker",
  ],
  authors: [{ name: "Fenmo AI", url: "https://fenmo.ai" }],
  creator: "Fenmo AI",
  metadataBase: new URL("https://piggybank.fenmo.ai"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://piggybank.fenmo.ai",
    siteName: "PiggyBank by Fenmo",
    title: "PiggyBank — Your money, clearly.",
    description:
      "Track every rupee with precision. Filter, sort, and understand your spending — no dashboards, just numbers.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PiggyBank — Your money, clearly.",
    description: "Track every rupee with precision. Built with Fenmo AI.",
    creator: "@fenmoai",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${workSans.variable} ${inter.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
