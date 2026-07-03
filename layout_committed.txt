import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";
import HardcodedTextScanner from "@/components/HardcodedTextScanner";

// Advanced Multilingual SEO Metadata with dynamic Google Search Console verification key
export const metadata: Metadata = {
  title: {
    default: "ኢትዮ ማሽነሪ አገናኝ | Ethio Machinery Link (EML)",
    template: "%s | EML"
  },
  description: "ኢትዮ ማሽነሪ አገናኝ (EML) - የከባድ ማሽነሪዎች መገበያያ በኢትዮጵያ። Ethiopia's premier heavy machinery marketplace. Buy, sell, rent, and escrow heavy construction equipment securely.",
  keywords: [
    "ኢትዮ ማሽነሪ አገናኝ",
    "ኢትዮ ማሽነሪ", 
    "የከባድ ማሽነሪ", 
    "ማሽነሪ ኪራይ", 
    "ኮንትራክተር", 
    "ኦፕሬተር",
    "Ethio Machinery Link", 
    "EML Marketplace",
    "EML", 
    "heavy machinery Ethiopia", 
    "excavator rental Addis Ababa", 
    "construction equipment rent",
    "escrow machinery sales",
    "Machinery rental Ethiopia",
    "Heavy equipment sales Addis Ababa",
    "የኮንስትራክشون ማሽነሪዎች",
    "ትራክተሮች እና የግብርና መሣሪያዎች",
    "Spare parts supply Ethiopia"
  ],
  metadataBase: new URL("https://ethiomachinery.vercel.app"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en",
      "am-ET": "/am",
      "or-ET": "/or",
      "ti-ET": "/ti"
    }
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "5GQa2rRrEiIn-xt_rPKBVGe8iJfDFPsXUPt0yY3Sdcc"
  },
  openGraph: {
    title: "ኢትዮ ማሽነሪ አገናኝ | Ethio Machinery Link (EML)",
    description: "የከባድ ማሽነሪዎች መገበያያ በኢትዮጵያ። Rent, buy, or sell verified heavy construction equipment with secure escrow guarantees.",
    url: "https://ethiomachinery.vercel.app",
    siteName: "Ethio Machinery Link",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ኢትዮ ማሽነሪ አገናኝ | Ethio Machinery Link (EML)",
    description: "የከባድ ማሽነሪዎች መገበያያ በኢትዮጵያ። Rent, buy, or sell verified heavy construction equipment with secure escrow guarantees.",
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoRental",
    "name": "Ethio Machinery Link (EML) | ኢትዮ ማሽነሪ አገናኝ",
    "url": "https://ethiomachinery.vercel.app",
    "logo": "https://ethiomachinery.vercel.app/logo.png",
    "description": "Ethiopia's premier heavy machinery marketplace and digital economic infrastructure. Buy, rent, transport, and repair excavators, loaders, dozers, and agricultural tools.",
    "alternateName": [
      "ኢትዮ ማሽነሪ አገናኝ",
      "EML Marketplace",
      "የኮንስትራክشون ማሽነሪዎች",
      "ትራክተሮች እና የግብርና መሣሪያዎች"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "machinerymatchmaker@gmail.com",
      "contactType": "customer service",
      "availableLanguage": ["en", "am", "or", "ti"]
    },
    "areaServed": {
      "@type": "Country",
      "name": "Ethiopia"
    },
    "knowsAbout": [
      "Machinery rental Ethiopia",
      "Heavy equipment sales Addis Ababa",
      "Spare parts supply Ethiopia"
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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