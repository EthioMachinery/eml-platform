import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

export const metadata: Metadata = {
  title: {
    default: "ኢትዮ ማሽነሪ አገናኝ | Ethio Machinery Link (EML)",
    template: "%s | EML"
  },
  description: "ኢትዮ ማሽነሪ አገናኝ (EML) — Ethiopia's #1 heavy machinery marketplace. Buy, sell, rent excavators, loaders, cranes, bulldozers & more. Secure escrow. Verified listings. Addis Ababa & all regions.",
  keywords: [
    "ኢትዮ ማሽነሪ አገናኝ",
    "ከባድ ማሽነሪ",
    "ማሽነሪ ኪራይ",
    "ኤክስካቫተር ኪራይ",
    "ቡልዶዘር ሽያጭ",
    "ክሬን ኪራይ አዲስ አበባ",
    "የግንባታ ማሽነሪ",
    "ማሽነሪ ሽያጭ ኢትዮጵያ",
    "Maashinarii Itoophiyaa",
    "Eskavaatarii kiraa",
    "Maashinarii ulfaatoo",
    "Gabaa maashinarii",
    "ማሽነሪ ኢትዮጵያ",
    "ከበድቲ ማሽነሪታት",
    "ኤክስካቫተር ምክራይ",
    "Ethio Machinery Link",
    "EML",
    "EML Marketplace",
    "heavy machinery Ethiopia",
    "excavator rental Ethiopia",
    "excavator rental Addis Ababa",
    "bulldozer for rent Ethiopia",
    "crane hire Ethiopia",
    "wheel loader rental",
    "dump truck Ethiopia",
    "construction equipment Ethiopia",
    "heavy equipment marketplace Africa",
    "machinery escrow Ethiopia",
    "buy excavator Ethiopia",
    "sell heavy machinery Ethiopia",
    "machinery operators Ethiopia",
    "spare parts heavy equipment Ethiopia",
    "lowbed transport Ethiopia",
    "construction tenders Ethiopia",
    "industrial machinery East Africa"
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
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/icon-512.png" },
    ],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "EML",
  },
  openGraph: {
    title: "ኢትዮ ማሽነሪ አገናኝ | Ethio Machinery Link (EML)",
    description: "Ethiopia's #1 heavy machinery marketplace. Buy, sell, rent excavators, loaders, cranes & more with secure escrow.",
    url: "https://ethiomachinery.vercel.app",
    siteName: "Ethio Machinery Link",
    images: [{ url: "/icon-512.png", width: 512, height: 512, alt: "Ethio Machinery Link Logo" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ኢትዮ ማሽነሪ አገናኝ | Ethio Machinery Link (EML)",
    description: "Ethiopia's #1 heavy machinery marketplace. Buy, sell, rent excavators, loaders, cranes & more.",
    images: ["/icon-512.png"],
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
    "name": "Ethio Machinery Link (EML)",
    "alternateName": [
      "ኢትዮ ማሽነሪ አገናኝ",
      "EML Marketplace",
      "Maashinarii Itoophiyaa",
      "ከበድቲ ማሽነሪታት ኢትዮጵያ"
    ],
    "url": "https://ethiomachinery.vercel.app",
    "logo": "https://ethiomachinery.vercel.app/logo.png",
    "image": "https://ethiomachinery.vercel.app/icon-512.png",
    "description": "Ethiopia's premier heavy machinery marketplace and digital economic infrastructure. Buy, rent, transport, and repair excavators, loaders, dozers, cranes, and agricultural tools.",
    "foundingLocation": {
      "@type": "Place",
      "name": "Addis Ababa, Ethiopia"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "machinerymatchmaker@gmail.com",
      "contactType": "customer service",
      "availableLanguage": ["English", "Amharic", "Afaan Oromo", "Tigrinya"]
    },
    "areaServed": {
      "@type": "Country",
      "name": "Ethiopia"
    },
    "knowsAbout": [
      "Excavator rental Ethiopia",
      "Heavy machinery sales Addis Ababa",
      "Construction equipment marketplace Africa",
      "Bulldozer hire Ethiopia",
      "Crane rental Ethiopia",
      "Machinery escrow service",
      "Heavy equipment operators Ethiopia",
      "Spare parts supply Ethiopia",
      "Lowbed transport Ethiopia"
    ],
    "sameAs": [
      "https://ethiomachinery.vercel.app"
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#F59E0B" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="EML" />
        <meta name="application-name" content="Ethio Machinery Link" />
        <meta name="msapplication-TileColor" content="#F59E0B" />
        <meta name="msapplication-TileImage" content="/icon-192.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-black text-white antialiased min-h-screen flex flex-col">
        <LanguageProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <PWAInstallPrompt />
        </LanguageProvider>
      </body>
    </html>
  );
}