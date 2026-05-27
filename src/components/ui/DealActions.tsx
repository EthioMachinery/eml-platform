"use client";

import Link from "next/link";

import {
  Banknote,
  Heart,
  Phone,
  ShieldCheck,
  Truck,
  UserCog,
  Wallet,
  MessageCircle,
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

type Props = {
  machinery: any;

  compact?: boolean;
};

export default function DealActions({
  machinery,
  compact = false,
}: Props) {
  const { t } = useLanguage();

  const whatsappNumber =
    machinery?.seller_phone
      ?.replace(/\s/g, "")
      ?.replace("+", "") || "";

  const whatsappMessage =
    encodeURIComponent(
      `Hello, I am interested in your machinery listing: ${machinery?.title}`
    );

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const callUrl = `tel:${machinery?.seller_phone}`;

  const dealAmount =
    machinery?.price || 0;

  const listingType =
    machinery?.listing_type ||
    "sale";

  const dealType =
    listingType === "rental"
      ? "rental"
      : "sale";

  const actionHeight = compact
    ? "h-12"
    : "h-14";

  return (
    <div className="space-y-5">

      {/* PRIMARY ACTIONS */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* BUY / RENT */}

        <Link
          href={`/payment?machinery=${machinery?.id}&seller=${machinery?.user_id}&amount=${dealAmount}&type=${dealType}`}
          className={`${actionHeight} rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-black font-black flex items-center justify-center gap-3 transition`}
        >
          <Wallet size={20} />

          {listingType ===
          "rental"
            ? t(
                "Rent Machinery",
                "ማሽነሪ ይከራዩ"
              )
            : t(
                "Buy Machinery",
                "ማሽነሪ ይግዙ"
              )}
        </Link>

        {/* WHATSAPP */}

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${actionHeight} rounded-2xl bg-green-600 hover:bg-green-500 text-white font-black flex items-center justify-center gap-3 transition`}
        >
          <MessageCircle
            size={20}
          />

          WhatsApp
        </a>

      </div>

      {/* SECONDARY ACTIONS */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        {/* TRANSPORT */}

        <Link
          href={`/transport?machinery=${machinery?.id}`}
          className="bg-zinc-900 border border-zinc-800 hover:border-yellow-500/40 rounded-2xl p-5 transition"
        >
          <Truck className="text-yellow-400 mb-4" />

          <div className="font-black text-sm leading-6">
            {t(
              "Transport",
              "ትራንስፖርት"
            )}
          </div>

          <div className="text-zinc-500 text-xs mt-2 leading-5">
            {t(
              "Heavy haulage & logistics",
              "ከባድ ጭነት እና ሎጂስቲክስ"
            )}
          </div>

        </Link>

        {/* OPERATOR */}

        <Link
          href={`/services?type=operator&machinery=${machinery?.id}`}
          className="bg-zinc-900 border border-zinc-800 hover:border-yellow-500/40 rounded-2xl p-5 transition"
        >
          <UserCog className="text-yellow-400 mb-4" />

          <div className="font-black text-sm leading-6">
            {t(
              "Operator",
              "ኦፕሬተር"
            )}
          </div>

          <div className="text-zinc-500 text-xs mt-2 leading-5">
            {t(
              "Certified machinery operators",
              "የተረጋገጡ ኦፕሬተሮች"
            )}
          </div>

        </Link>

        {/* FINANCING */}

        <Link
          href={`/financing?machinery=${machinery?.id}`}
          className="bg-zinc-900 border border-zinc-800 hover:border-yellow-500/40 rounded-2xl p-5 transition"
        >
          <Banknote className="text-yellow-400 mb-4" />

          <div className="font-black text-sm leading-6">
            {t(
              "Financing",
              "ፋይናንስ"
            )}
          </div>

          <div className="text-zinc-500 text-xs mt-2 leading-5">
            {t(
              "Loans & leasing",
              "ብድር እና ሊዝ"
            )}
          </div>

        </Link>

        {/* INSURANCE */}

        <Link
          href={`/insurance?machinery=${machinery?.id}`}
          className="bg-zinc-900 border border-zinc-800 hover:border-yellow-500/40 rounded-2xl p-5 transition"
        >
          <ShieldCheck className="text-yellow-400 mb-4" />

          <div className="font-black text-sm leading-6">
            {t(
              "Insurance",
              "ኢንሹራንስ"
            )}
          </div>

          <div className="text-zinc-500 text-xs mt-2 leading-5">
            {t(
              "Protect machinery investment",
              "የማሽነሪ ጥበቃ"
            )}
          </div>

        </Link>

      </div>

      {/* THIRD ACTIONS */}

      <div className="grid grid-cols-2 gap-4">

        {/* CALL */}

        <a
          href={callUrl}
          className={`${actionHeight} rounded-2xl border border-zinc-700 hover:border-yellow-500 transition bg-zinc-900 flex items-center justify-center gap-3 font-bold`}
        >
          <Phone size={18} />

          {t(
            "Call Owner",
            "ለባለቤቱ ይደውሉ"
          )}
        </a>

        {/* SAVE */}

        <button
          className={`${actionHeight} rounded-2xl border border-zinc-700 hover:border-red-500 transition bg-zinc-900 flex items-center justify-center gap-3 font-bold`}
        >
          <Heart size={18} />

          {t(
            "Save Listing",
            "ዝርዝሩን ያስቀምጡ"
          )}
        </button>

      </div>

      {/* EML TRUST */}

      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-3xl p-6">

        <div className="flex items-start gap-4">

          <div className="w-14 h-14 rounded-2xl bg-yellow-500/20 flex items-center justify-center shrink-0">

            <ShieldCheck className="text-yellow-400" />

          </div>

          <div>

            <div className="text-yellow-400 font-black text-lg mb-2">
              {t(
                "EML Secure Deal Workflow",
                "የEML ደህንነቱ የተጠበቀ ግብይት"
              )}
            </div>

            <div className="text-zinc-300 leading-7 text-sm">

              {t(
                "EML supports secure Ethiopian payments including Telebirr, bank transfer and mobile banking. Optional escrow protection is available but never mandatory.",
                "EML ቴሌብር፣ የባንክ ዝውውር እና ሞባይል ባንኪንግን ይደግፋል። ኤስክሮው አማራጭ ነው እንጂ ግዴታ አይደለም።"
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}