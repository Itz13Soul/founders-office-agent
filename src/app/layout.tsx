import type { Metadata } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import ConsentAnalytics, { AnalyticsSettingsButton } from "../components/ConsentAnalytics";
import Link from "next/link";
import Nav from "../components/Nav";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const display = Instrument_Serif({ variable: "--font-display", subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Founder's Office Agent",
  description: "Cited decision memos, a commitment ledger and Hinglish voice notes for a founder's office. Runs on a labelled sample company.",
  authors: [{ name: "Divyansh Srivastava" }],
  creator: "Divyansh Srivastava",
  openGraph: { title: "Founder's Office Agent", type: "website", siteName: "Founder's Office Agent" },
  twitter: { card: "summary", title: "Founder's Office Agent" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${display.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col text-zinc-100">
        <a href="#main" className="skip-link">Skip to content</a>
        <Nav />
        <div id="main" tabIndex={-1} className="flex-1 outline-none">{children}</div>
        <footer className="mx-auto w-full max-w-6xl px-4 py-8 text-xs text-zinc-400">
          © 2026 Divyansh Srivastava. All rights reserved. Developed by Divyansh Srivastava. Demo runs on fictional sample data.{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-zinc-300">Privacy</Link>{" · "}<AnalyticsSettingsButton />
        </footer>
        <Analytics />
        <ConsentAnalytics app="Founder's Office Agent" />
      </body>
    </html>
  );
}
