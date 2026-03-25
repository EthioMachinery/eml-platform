"use client";
import { useState } from "react";

type Lang = "am" | "en";

export default function Home() {
  const [lang, setLang] = useState<Lang>("am");

  const content: Record<Lang, {
    title: string;
    subtitle: string;
    tagline: string;
    rent: string;
    buy: string;
    hire: string;
    service: string;
  }> = {
    am: {
      title: "ኢትዮ ማሽነሪ አገናኝ",
      subtitle: "Ethio Machinery Link (EML)",
      tagline:
        "በኢትዮጵያ ውስጥ ከማሽነሪ ባለቤቶች፣ አከራዮች፣ ኦፕሬተሮች እና አገልግሎት ሰጪዎች ጋር ይገናኙ።",
      rent: "ማሽነሪ ኪራይ",
      buy: "ማሽነሪ ግዥ",
      hire: "ኦፕሬተር መቅጠር",
      service: "አገልግሎት ማግኘት",
    },
    en: {
      title: "ኢትዮ ማሽነሪ አገናኝ",
      subtitle: "Ethio Machinery Link (EML)",
      tagline:
        "Connect with machinery owners, renters, operators, and service providers across Ethiopia.",
      rent: "Rent Machinery",
      buy: "Buy Machinery",
      hire: "Hire Operators",
      service: "Get Services",
    },
  };

  const t = content[lang];

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center">

      {/* Language Toggle */}
      <div className="absolute top-5 right-5 space-x-2">
        <button
          onClick={() => setLang("am")}
          className="bg-yellow-500 text-black px-3 py-1 rounded"
        >
          አማ
        </button>
        <button
          onClick={() => setLang("en")}
          className="bg-gray-700 px-3 py-1 rounded"
        >
          EN
        </button>
      </div>

      {/* Titles */}
      <h1 className="text-3xl md:text-5xl font-bold text-yellow-400 mb-2">
        {t.title}
      </h1>

      <h2 className="text-xl md:text-2xl text-gray-300 mb-6">
        {t.subtitle}
      </h2>

      {/* Tagline */}
      <p className="max-w-xl text-gray-400 mb-10">
        {t.tagline}
      </p>

      {/* Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
        <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-xl">
          {t.rent}
        </button>

        <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-xl">
          {t.buy}
        </button>

        <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-xl">
          {t.hire}
        </button>

        <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-xl">
          {t.service}
        </button>
      </div>

      {/* Footer */}
      <p className="mt-12 text-gray-500 text-sm">
        Built for Ethiopia 🇪🇹 | Powered by EML
      </p>
    </main>
  );
}