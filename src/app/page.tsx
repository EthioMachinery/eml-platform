"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

export default function HomePage() {
  const { lang } = useLanguage();

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center">

      {/* LANGUAGE SWITCH (TOP RIGHT) */}
      <div className="absolute top-4 right-6 flex gap-2">
        <Link href="#">
          <button className="bg-yellow-500 text-black px-3 py-1 rounded text-sm font-bold">
            አማ
          </button>
        </Link>
        <Link href="#">
          <button className="bg-gray-700 text-white px-3 py-1 rounded text-sm">
            EN
          </button>
        </Link>
      </div>

      {/* TITLE */}
      <h1 className="text-3xl md:text-5xl font-bold text-yellow-400 mb-3">
        {lang === "am" ? "ኢትዮ ማሽነሪ አገናኝ" : "Ethio Machinery Link"}
      </h1>

      {/* SUBTITLE */}
      <h2 className="text-lg md:text-xl mb-4">
        {lang === "am"
          ? "(EML)"
          : "(EML)"}
      </h2>

      {/* DESCRIPTION */}
      <p className="text-gray-400 max-w-xl mb-10">
        {lang === "am"
          ? "ከማሽነሪ ባለቤቶች፣ ተከራዮች፣ ኦፕሬተሮች እና የአገልግሎት አቅራቢዎች ጋር ይገናኙ።"
          : "Connect with machinery owners, renters, operators, and service providers across Ethiopia."}
      </p>

      {/* ACTION BUTTONS */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">

        <Link href="/browse">
          <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded transition">
            {lang === "am" ? "ማሽነሪ ኪራይ" : "Rent Machinery"}
          </button>
        </Link>

        <Link href="/browse">
          <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded transition">
            {lang === "am" ? "ማሽነሪ ግዢ" : "Buy Machinery"}
          </button>
        </Link>

        <Link href="/browse-requests">
          <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded transition">
            {lang === "am" ? "ኦፕሬተሮች ቅጥር" : "Hire Operators"}
          </button>
        </Link>

        <Link href="/services">
          <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded transition">
            {lang === "am" ? "አገልግሎቶች" : "Get Services"}
          </button>
        </Link>

      </div>

      {/* FOOTER */}
      <p className="text-gray-500 text-sm mt-10">
        {lang === "am"
          ? "በኢትዮጵያ የተገነባ | በEML የተደገፈ"
          : "Built for Ethiopia | Powered by EML"}
      </p>

    </main>
  );
}