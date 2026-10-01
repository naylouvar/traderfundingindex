import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TraderFundingIndex: the honest futures prop firm index",
    template: "%s | TraderFundingIndex",
  },
  description:
    "Compare futures prop firms on real payouts, hidden rules and country restrictions, backed by verified trader experiences.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b border-white/10">
          <nav className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-4 text-sm">
            <Link href="/" className="text-base font-semibold">
              TraderFundingIndex
            </Link>
            <Link href="/firms" className="text-muted hover:text-foreground">
              Firms
            </Link>
            <span className="text-muted/60" title="Coming in phase 2">
              Forum
            </span>
            <span className="text-muted/60" title="Coming in phase 3">
              Strategies
            </span>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
          {children}
        </main>
        <footer className="border-t border-white/10 px-4 py-6 text-center text-xs text-muted">
          Reviews are traders&apos; own experiences. Rankings are never paid for.
        </footer>
      </body>
    </html>
  );
}
