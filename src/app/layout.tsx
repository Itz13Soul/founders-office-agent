import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import Nav from "../components/Nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Founder's Office Agent",
  description: "Cited decision memos, a commitment ledger and Hinglish voice notes for a founder's office. Runs on a labelled sample company.",
  authors: [{ name: "Divyansh Srivastava" }],
  creator: "Divyansh Srivastava",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col text-zinc-100">
        <Nav />
        {children}
        <footer className="mx-auto w-full max-w-5xl px-4 py-8 text-xs text-zinc-500">
          © 2026 Divyansh Srivastava. All rights reserved. Developed by Divyansh Srivastava. Demo runs on fictional sample data.
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
