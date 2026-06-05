import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";
import HardcodedTextScanner from "@/components/HardcodedTextScanner";

// Advanced Multilingual SEO Metadata with your unique Google Search Console verification key
export const metadata: Metadata = {
  title: {
    default: "ኢትዮ ማሽነሪ አገናኝ | Ethio Machinery Link (EML)",
    template: "%s | EML"
  },
  description: "ኢትዮ ማሽነሪ አገናኝ (EML) - የከባድ ማሽነሪዎች መገበያያ በኢትዮጵያ። Ethiopia's premier heavy machinery marketplace. Buy, sell, rent, and escrow heavy construction equipment securely.",
  keywords: [
    "ኢትዮ ማሽነሪ", 
    "የከባድ ማሽነሪ", 
    "ማሽነሪ ኪራይ", 
    "ኮንትራክተር", 
    "ኦፕሬተር",
    "Ethio Machinery Link", 
    "EML", 
    "heavy machinery Ethiopia", 
    "excavator rental Addis Ababa", 
    "construction equipment rent",
    "escrow machinery sales"
  ],
  metadataBase: new URL("https://www.ethiomachinerylink.com"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en",
      "am-ET": "/am",
      "om-ET": "/om",
      "ti-ET": "/ti"
    }
  },
  verification: {
    google: "7MBhfJWDcEaB7jNSJ8AkZcDGB5SQqNlWl2u9AHj3ro0" // Your verified Google Search Console key
  },
  openGraph: {
    title: "ኢትዮ ማሽነሪ አገናኝ | Ethio Machinery Link (EML)",
    description: "የከባድ ማሽነሪዎች መገበያያ በኢትዮጵያ። Rent, buy, or sell verified heavy construction equipment with secure escrow guarantees.",
    url: "https://www.ethiomachinerylink.com",
    siteName: "Ethio Machinery Link",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-black text-white antialiased min-h-screen flex flex-col">
        <LanguageProvider>
          {/* GLOBAL NAVBAR */}
          <Navbar />

          {/* MAIN APP */}
          <main className="flex-grow">
            {children}
          </main>

          {/* GLOBAL FOOTER */}
          <Footer />

          {/* DEVELOPMENT TOOLS — all disabled in production */}
          <HardcodedTextScanner />
        </LanguageProvider>
      </body>
    </html>
  );
}