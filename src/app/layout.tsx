import type { Metadata } from "next";

import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { LanguageProvider } from "@/context/LanguageContext";

import TranslationDebugger from "@/components/TranslationDebugger";
import HardcodedTextScanner from "@/components/HardcodedTextScanner";

export const metadata: Metadata = {
  title:
    "EML — Ethiopia Machinery Link",

  description:
    "Enterprise machinery marketplace ecosystem for Ethiopia and Africa.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">

      <body className="bg-black text-white antialiased">

        <LanguageProvider>

          {/* GLOBAL NAVBAR */}
          <Navbar />

          {/* MAIN APP */}
          <main className="min-h-screen">
            {children}
          </main>

          {/* GLOBAL FOOTER */}
          <Footer />

          {/* ENTERPRISE I18N DEBUGGING */}
          <TranslationDebugger />

          {/* HARD-CODED TEXT DETECTOR */}
          <HardcodedTextScanner />

        </LanguageProvider>

      </body>

    </html>
  );
}