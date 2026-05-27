"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function PricingPage() {
  const { t } = useLanguage();

  const plans = [
    {
      name: t("Free", "ነፃ"),
      price: "$0",
      monthly: t("Forever", "ለዘላለም"),
      badge: "",
      button: t("Start Free", "በነፃ ጀምር"),
      href: "/signup",
      features: [
        t("Browse marketplace", "ገበያ ይመልከቱ"),
        t("Post 1 listing", "1 ማስታወቂያ ያስገቡ"),
        t("Basic support", "መሰረታዊ ድጋፍ"),
        t("Standard visibility", "መደበኛ ታይነት"),
      ],
    },
    {
      name: t("Pro Seller", "ፕሮ ሻጭ"),
      price: "$19",
      monthly: t("/month", "/ወር"),
      badge: t("MOST POPULAR", "በጣም ተወዳጅ"),
      button: t("Upgrade Now", "አሁን ያሻሽሉ"),
      href: "/premium",
      featured: true,
      features: [
        t("Unlimited listings", "ያልተገደበ ማስታወቂያ"),
        t("Priority ranking", "ከፍተኛ ደረጃ"),
        t("Verified badge", "የተረጋገጠ ምልክት"),
        t("Lead analytics", "የደንበኛ ትንታኔ"),
        t("WhatsApp leads", "WhatsApp ደንበኞች"),
      ],
    },
    {
      name: t("Enterprise", "ኢንተርፕራይዝ"),
      price: "$99",
      monthly: t("/month", "/ወር"),
      badge: t("BEST VALUE", "ምርጥ ዋጋ"),
      button: t("Contact Sales", "ሽያጭ ያነጋግሩ"),
      href: "/contact",
      features: [
        t("Multi-user accounts", "ብዙ ተጠቃሚ አካውንት"),
        t("Fleet management", "የፍሊት አስተዳደር"),
        t("Dedicated manager", "ልዩ አስተዳዳሪ"),
        t("Priority support", "ፈጣን ድጋፍ"),
        t("Custom integrations", "ልዩ ግንኙነቶች"),
      ],
    },
  ];

  return (
    <main className="bg-white text-gray-900 min-h-screen">
      {/* HERO */}
      <section className="bg-gradient-to-br from-slate-950 via-slate-800 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <div className="inline-block px-4 py-2 rounded-full bg-white/10 mb-6 text-sm font-bold">
            💰 {t("Choose a plan that grows your business", "ንግድዎን የሚያሳድግ እቅድ ይምረጡ")}
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight">
            {t("Simple Pricing. Serious Growth.", "ቀላል ዋጋ። ከባድ እድገት።")}
          </h1>

          <p className="mt-6 text-lg md:text-xl text-slate-200 max-w-3xl mx-auto">
            {t(
              "Upgrade visibility, win more leads, close more deals, and dominate Ethiopia’s machinery market.",
              "ታይነት ያሻሽሉ፣ ብዙ ደንበኞች ያግኙ፣ ብዙ ግብይቶች ይዝጉ፣ የኢትዮጵያን የማሽነሪ ገበያ ይቆጣጠሩ።"
            )}
          </p>
        </div>
      </section>

      {/* PLANS */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`rounded-3xl border p-8 relative transition hover:shadow-2xl ${
                plan.featured
                  ? "border-blue-600 scale-105 shadow-2xl"
                  : "border-gray-200"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-bold">
                  {plan.badge}
                </div>
              )}

              <h2 className="text-3xl font-black">{plan.name}</h2>

              <div className="mt-4 flex items-end gap-2">
                <span className="text-5xl font-black">{plan.price}</span>
                <span className="text-gray-500 pb-2">{plan.monthly}</span>
              </div>

              <ul className="mt-8 space-y-4">
                {plan.features.map((f, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="text-green-600">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`mt-10 block text-center py-4 rounded-2xl font-bold transition ${
                  plan.featured
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-slate-900 text-white hover:bg-slate-800"
                }`}
              >
                {plan.button}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* TRUST */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-4 gap-8 text-center">
          <Stat number="4,500+" label={t("Listings", "ማስታወቂያ")} />
          <Stat number="12,000+" label={t("Users", "ተጠቃሚዎች")} />
          <Stat number="98%" label={t("Trust Score", "እምነት")} />
          <Stat number="10x" label={t("Lead Growth", "የደንበኛ እድገት")} />
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-5xl mx-auto px-4 py-24">
        <h3 className="text-4xl font-black text-center mb-14">
          {t("Frequently Asked Questions", "ብዙ ጊዜ የሚጠየቁ")}
        </h3>

        <div className="space-y-6">
          <Faq
            q={t("Can I cancel anytime?", "ማንኛውንም ጊዜ ማቋረጥ እችላለሁ?")}
            a={t("Yes. No contracts required.", "አዎን። ውል አያስፈልግም።")}
          />
          <Faq
            q={t("Do verified badges help?", "የተረጋገጠ ምልክት ይረዳል?")}
            a={t("Yes. Verified sellers get more trust and leads.", "አዎን። የተረጋገጡ ሻጮች ብዙ እምነት እና ደንበኛ ያገኛሉ።")}
          />
          <Faq
            q={t("Can enterprises get custom plans?", "ኢንተርፕራይዞች ልዩ እቅድ ያገኛሉ?")}
            a={t("Yes. Contact our sales team.", "አዎን። የሽያጭ ቡድናችንን ያነጋግሩ።")}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-700 to-cyan-500 text-white">
        <div className="max-w-5xl mx-auto px-4 py-24 text-center">
          <h3 className="text-5xl font-black">
            {t("Ready to Grow Faster?", "ፈጣን ለመድገፍ ዝግጁ ነዎት?")}
          </h3>

          <p className="mt-6 text-lg text-white/90">
            {t(
              "Upgrade today and unlock more customers.",
              "ዛሬ ያሻሽሉ እና ብዙ ደንበኞችን ይክፈቱ።"
            )}
          </p>

          <Link
            href="/premium"
            className="inline-block mt-8 px-10 py-5 rounded-2xl bg-white text-blue-700 font-black hover:scale-105 transition"
          >
            {t("Upgrade Now", "አሁን ያሻሽሉ")}
          </Link>
        </div>
      </section>
    </main>
  );
}

function Stat({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow">
      <div className="text-4xl font-black text-blue-600">{number}</div>
      <div className="mt-2 text-gray-600">{label}</div>
    </div>
  );
}

function Faq({
  q,
  a,
}: {
  q: string;
  a: string;
}) {
  return (
    <div className="rounded-2xl border p-6">
      <h4 className="font-bold text-xl">{q}</h4>
      <p className="mt-3 text-gray-600">{a}</p>
    </div>
  );
}