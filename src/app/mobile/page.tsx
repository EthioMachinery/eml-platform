"use client";

import { useState } from "react";
import Link from "next/link";

type Lang = "en" | "am";

type Feature = {
  icon: string;
  title: string;
  desc: string;
};

export default function MobilePage() {
  const [lang, setLang] =
    useState<Lang>("en");

  const isAm =
    lang === "am";

  const features: Feature[] = [
    {
      icon: "📲",
      title: isAm
        ? "ፈጣን Android App"
        : "Fast Android App",
      desc: isAm
        ? "ለኢትዮጵያ ተጠቃሚዎች"
        : "Built for Ethiopian users",
    },
    {
      icon: "📸",
      title: isAm
        ? "በካሜራ መለጠፍ"
        : "Camera Listing Upload",
      desc: isAm
        ? "ማሽን ፎቶ በፍጥነት አክል"
        : "Post machines instantly",
    },
    {
      icon: "📍",
      title: isAm
        ? "ቅርብ ማሽነሪ"
        : "Nearby Machinery",
      desc: isAm
        ? "GPS መፈለጊያ"
        : "GPS search by distance",
    },
    {
      icon: "💬",
      title: isAm
        ? "ቀጥታ ውይይት"
        : "Live Chat",
      desc: isAm
        ? "እንደ WhatsApp"
        : "WhatsApp-style messaging",
    },
    {
      icon: "🔔",
      title: isAm
        ? "Push Notifications"
        : "Push Notifications",
      desc: isAm
        ? "አዲስ ሊድ በቅጽበት"
        : "Instant new lead alerts",
    },
    {
      icon: "📶",
      title: isAm
        ? "ዝቅተኛ ኔት ሁኔታ"
        : "Offline Lite",
      desc: isAm
        ? "ዝቅተኛ ኔት ይሰራል"
        : "Works in weak network areas",
    },
  ];

  const t = {
    title: isAm
      ? "TM ሞባይል ኢኮሲስተም"
      : "TM Mobile App Ecosystem",

    sub: isAm
      ? "ሞባይል ቀዳሚ እድገት"
      : "Mobile-First Growth Engine",

    android: isAm
      ? "Android ቀዳሚ"
      : "Android First",

    ios: isAm
      ? "iOS ቀጣይ"
      : "iOS Later",

    users: isAm
      ? "የመጀመሪያ ግብ"
      : "First Target",

    download: isAm
      ? "መተግበሪያ በቅርብ"
      : "App Launch Soon",

    web: isAm
      ? "ወደ Web"
      : "Go Web",

    pricing: isAm
      ? "አባልነት"
      : "Pricing",
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">

        {/* Language */}
        <div className="flex justify-end gap-3 mb-6">
          <button
            onClick={() =>
              setLang("en")
            }
            className={`px-4 py-2 rounded-xl ${
              lang === "en"
                ? "bg-green-600"
                : "bg-zinc-800"
            }`}
          >
            EN
          </button>

          <button
            onClick={() =>
              setLang("am")
            }
            className={`px-4 py-2 rounded-xl ${
              lang === "am"
                ? "bg-green-600"
                : "bg-zinc-800"
            }`}
          >
            አማ
          </button>
        </div>

        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-cyan-400 via-green-500 to-yellow-500 bg-clip-text text-transparent">
            {t.title}
          </h1>

          <p className="text-zinc-400 text-xl">
            {t.sub}
          </p>
        </div>

        {/* Strategy Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div className="bg-zinc-900 rounded-3xl p-6">
            <p className="text-zinc-400">
              Platform
            </p>
            <p className="text-3xl font-black text-green-400">
              {t.android}
            </p>
          </div>

          <div className="bg-zinc-900 rounded-3xl p-6">
            <p className="text-zinc-400">
              Next
            </p>
            <p className="text-3xl font-black text-cyan-400">
              {t.ios}
            </p>
          </div>

          <div className="bg-zinc-900 rounded-3xl p-6">
            <p className="text-zinc-400">
              Users
            </p>
            <p className="text-3xl font-black text-yellow-400">
              100K+
            </p>
          </div>

        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7 mb-10">

          {features.map(
            (f, i) => (
              <div
                key={i}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6"
              >
                <div className="text-5xl mb-4">
                  {f.icon}
                </div>

                <h3 className="text-2xl font-bold mb-2">
                  {f.title}
                </h3>

                <p className="text-zinc-400">
                  {f.desc}
                </p>
              </div>
            )
          )}

        </div>

        {/* CTA */}
        <div className="grid md:grid-cols-3 gap-4">

          <Link
            href="/machines"
            className="bg-green-600 text-center py-3 rounded-2xl font-bold"
          >
            {t.web}
          </Link>

          <Link
            href="/pricing"
            className="bg-yellow-500 text-black text-center py-3 rounded-2xl font-bold"
          >
            {t.pricing}
          </Link>

          <button className="bg-cyan-600 py-3 rounded-2xl font-bold">
            {t.download}
          </button>

        </div>

      </div>
    </main>
  );
}