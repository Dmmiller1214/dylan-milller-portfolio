import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";

import { DraftNotice } from "@/components/content";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { hasUnfinishedContent, plain, profile } from "@/content/portfolio";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  // 300 for display headings, 400 for section and card titles, 500 for the
  // wordmark. Nothing uses a heavier cut.
  weight: ["300", "400", "500"],
  display: "swap",
});

const name = plain(profile.name);
const description = `${profile.headline} ${profile.valueProposition}`;

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: {
    default: `${name} — ${profile.role}`,
    template: `%s — ${name}`,
  },
  description,
  openGraph: {
    type: "website",
    title: `${name} — ${profile.role}`,
    description,
    url: profile.siteUrl,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f7f4ef",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="stone-grain bg-background text-foreground flex min-h-full flex-col">
        <a
          href="#main"
          className="bg-charcoal text-alabaster focus-visible:outline-bronze sr-only rounded-sm px-4 py-2 text-sm focus-visible:not-sr-only focus-visible:absolute focus-visible:top-3 focus-visible:left-3 focus-visible:z-[60]"
        >
          Skip to content
        </a>
        {hasUnfinishedContent() ? <DraftNotice /> : null}
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
