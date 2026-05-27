"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import Image from "next/image";

import { useParams } from "next/navigation";

import {
  Phone,
  MessageCircle,
  Heart,
  ShieldCheck,
  Truck,
  Wrench,
  Banknote,
  MapPin,
  Calendar,
  Fuel,
  Settings,
  User,
  ChevronRight,
  Star,
  CheckCircle2,
  Clock3,
  Briefcase,
  Building2,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

import FavoriteButton from "@/components/FavoriteButton";

import InquiryForm from "@/components/InquiryForm";

import LanguageSwitcher from "@/components/LanguageSwitcher";

import { useLanguage } from "@/context/LanguageContext";

export default function MachineryDetailPage() {
  const params = useParams();

  const { t } = useLanguage();

  const [machinery, setMachinery] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (params?.id) {
      fetchMachinery(
        params.id as string
      );
    }
  }, [params]);

  async function fetchMachinery(
    id: string
  ) {
    setLoading(true);

    const { data } =
      await supabase
        .from("machinery")
        .select("*")
        .eq("id", id)
        .single();

    setMachinery(data);

    setLoading(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-2xl font-black">
          {t(
            "Loading Machinery...",
            "ማሽነሪው በመጫን ላይ..."
          )}
        </div>
      </main>
    );
  }

  if (!machinery) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-3xl font-black">
          {t(
            "Machinery Not Found",
            "ማሽነሪው አልተገኘም"
          )}
        </div>
      </main>
    );
  }

  const whatsappNumber =
    machinery.seller_phone
      ?.replace(/\s/g, "")
      ?.replace("+", "") || "";

  const whatsappMessage =
    encodeURIComponent(
      `Hello, I am interested in your machinery listing: ${machinery.title}`
    );

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      {/* HERO */}

      <section className="relative border-b border-zinc-800 overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 py-10">

          {/* TOP BAR */}

          <div className="flex flex-wrap items-center justify-between gap-5 mb-10">

            <div>

              <div className="text-yellow-400 font-black tracking-widest mb-2">
                ኢትዮ ማሽነሪ አገናኝ
              </div>

              <div className="text-zinc-400 font-bold">
                ETHIO MACHINERY LINK — EML
              </div>

            </div>

            <LanguageSwitcher />

          </div>

          {/* MAIN */}

          <div className="grid lg:grid-cols-2 gap-10 items-start">

            {/* IMAGE */}

            <div>

              <div className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900">

                {machinery.image_url ? (
                  <Image
                    src={
                      machinery.image_url
                    }
                    alt={
                      machinery.title
                    }
                    width={1200}
                    height={900}
                    priority
                    unoptimized
                    className="w-full h-[520px] object-cover"
                  />
                ) : (
                  <div className="w-full h-[520px] flex items-center justify-center text-8xl">
                    🚜
                  </div>
                )}

                {/* BADGES */}

                <div className="absolute top-5 left-5 flex flex-wrap gap-3">

                  <div className="bg-yellow-400 text-black px-4 py-2 rounded-full text-xs font-black">
                    PREMIUM
                  </div>

                  <div className="bg-green-500 text-white px-4 py-2 rounded-full text-xs font-black">
                    VERIFIED
                  </div>

                </div>

              </div>

            </div>

            {/* RIGHT */}

            <div>

              <div className="flex items-center gap-3 mb-4">

                <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full text-sm font-black">
                  {
                    machinery.listing_type
                  }
                </div>

                <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full text-sm font-bold">
                  {
                    machinery.category
                  }
                </div>

              </div>

              <h1 className="text-5xl font-black leading-tight">

                {machinery.title}

              </h1>

              <div className="flex items-center gap-3 text-zinc-400 mt-6">

                <MapPin size={20} />

                <span className="text-lg">
                  {
                    machinery.location
                  }
                </span>

              </div>

              {/* PRICE */}

              <div className="mt-10">

                <div className="text-zinc-500 mb-2">
                  {t(
                    "Price / Rental",
                    "ዋጋ / ኪራይ"
                  )}
                </div>

                <div className="text-6xl font-black text-yellow-400">
                  ETB {machinery.price}
                </div>

              </div>

              {/* ACTIONS */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">

                <a
                  href={`tel:${machinery.seller_phone}`}
                  className="h-16 rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-black flex items-center justify-center gap-3 font-black text-lg transition"
                >

                  <Phone />

                  {t(
                    "Call Owner",
                    "ለባለቤቱ ይደውሉ"
                  )}

                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-16 rounded-2xl bg-green-600 hover:bg-green-500 flex items-center justify-center gap-3 font-black text-lg transition"
                >

                  <MessageCircle />

                  WhatsApp

                </a>

                <Link
                  href={`/payment?machinery=${machinery.id}&seller=${machinery.user_id}&amount=${machinery.price}&type=machinery_sale`}
                  className="h-16 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-yellow-500 flex items-center justify-center gap-3 font-black text-lg transition"
                >

                  <Banknote />

                  {t(
                    "Secure Payment",
                    "ደህንነቱ የተጠበቀ ክፍያ"
                  )}

                </Link>

                <Link
                  href={`/logistics`}
                  className="h-16 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-yellow-500 flex items-center justify-center gap-3 font-black text-lg transition"
                >

                  <Truck />

                  {t(
                    "Request Transport",
                    "ትራንስፖርት ይጠይቁ"
                  )}

                </Link>

              </div>

              {/* FAVORITE */}

              <div className="mt-6">

                <FavoriteButton
                  machineryId={
                    machinery.id
                  }
                />

              </div>

              {/* TRUST */}

              <div className="mt-10 bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

                <div className="flex items-center gap-3 mb-5">

                  <ShieldCheck className="text-green-400" />

                  <div className="text-2xl font-black">
                    {t(
                      "Trust & Verification",
                      "የእምነት እና ማረጋገጫ ስርዓት"
                    )}
                  </div>

                </div>

                <div className="grid md:grid-cols-2 gap-4">

                  <TrustCard
                    label={t(
                      "Verified Seller",
                      "የተረጋገጠ ሻጭ"
                    )}
                  />

                  <TrustCard
                    label={t(
                      "EML Protected",
                      "በEML የተጠበቀ"
                    )}
                  />

                  <TrustCard
                    label={t(
                      "Inspection Available",
                      "ምርመራ ይገኛል"
                    )}
                  />

                  <TrustCard
                    label={t(
                      "Optional Escrow",
                      "አማራጭ ኤስክሮው"
                    )}
                  />

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* DETAILS */}

      <section className="max-w-7xl mx-auto px-4 py-20">

        <div className="grid xl:grid-cols-3 gap-10">

          {/* LEFT */}

          <div className="xl:col-span-2 space-y-10">

            {/* SPECIFICATIONS */}

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

              <div className="flex items-center gap-3 mb-8">

                <Settings className="text-yellow-400" />

                <h2 className="text-3xl font-black">

                  {t(
                    "Machinery Specifications",
                    "የማሽነሪ ዝርዝሮች"
                  )}

                </h2>

              </div>

              <div className="grid md:grid-cols-2 gap-5">

                <SpecCard
                  icon={Building2}
                  label={t(
                    "Brand",
                    "ብራንድ"
                  )}
                  value={
                    machinery.brand
                  }
                />

                <SpecCard
                  icon={Settings}
                  label={t(
                    "Model",
                    "ሞዴል"
                  )}
                  value={
                    machinery.model
                  }
                />

                <SpecCard
                  icon={Calendar}
                  label={t(
                    "Manufacturing Year",
                    "የምርት ዓመት"
                  )}
                  value={
                    machinery.manufacturing_year
                  }
                />

                <SpecCard
                  icon={Fuel}
                  label={t(
                    "Fuel Type",
                    "የነዳጅ አይነት"
                  )}
                  value={
                    machinery.fuel_type
                  }
                />

                <SpecCard
                  icon={Truck}
                  label={t(
                    "Capacity",
                    "አቅም"
                  )}
                  value={
                    machinery.capacity
                  }
                />

                <SpecCard
                  icon={Clock3}
                  label={t(
                    "Rental Period",
                    "የኪራይ ጊዜ"
                  )}
                  value={
                    machinery.rental_period
                  }
                />

              </div>

            </div>

            {/* DESCRIPTION */}

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

              <h2 className="text-3xl font-black mb-8">

                {t(
                  "Description",
                  "መግለጫ"
                )}

              </h2>

              <div className="text-zinc-300 leading-9 whitespace-pre-line text-lg">

                {
                  machinery.description
                }

              </div>

            </div>

            {/* SERVICES */}

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

              <h2 className="text-3xl font-black mb-8">

                {t(
                  "EML Connected Services",
                  "የEML ተያያዥ አገልግሎቶች"
                )}

              </h2>

              <div className="grid md:grid-cols-2 gap-5">

                <ServiceCard
                  icon={Truck}
                  title={t(
                    "Transport Providers",
                    "የትራንስፖርት አቅራቢዎች"
                  )}
                />

                <ServiceCard
                  icon={Wrench}
                  title={t(
                    "Mechanics",
                    "መካኒኮች"
                  )}
                />

                <ServiceCard
                  icon={Briefcase}
                  title={t(
                    "Operators",
                    "ኦፕሬተሮች"
                  )}
                />

                <ServiceCard
                  icon={Banknote}
                  title={t(
                    "Financing",
                    "ፋይናንስ"
                  )}
                />

              </div>

            </div>

          </div>

          {/* SIDEBAR */}

          <div className="space-y-8">

            {/* SELLER */}

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

              <div className="flex items-center gap-3 mb-6">

                <User className="text-yellow-400" />

                <h2 className="text-2xl font-black">

                  {t(
                    "Seller Information",
                    "የሻጭ መረጃ"
                  )}

                </h2>

              </div>

              <div className="space-y-5">

                <SidebarInfo
                  label={t(
                    "Name",
                    "ስም"
                  )}
                  value={
                    machinery.seller_name
                  }
                />

                <SidebarInfo
                  label={t(
                    "Phone",
                    "ስልክ"
                  )}
                  value={
                    machinery.seller_phone
                  }
                />

                <SidebarInfo
                  label="Email"
                  value={
                    machinery.seller_email
                  }
                />

              </div>

            </div>

            {/* FINANCE */}

            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-3xl p-8">

              <div className="text-yellow-400 font-black tracking-widest mb-3">
                EML FINANCE
              </div>

              <h3 className="text-3xl font-black mb-5">

                {t(
                  "Need Financing?",
                  "ፋይናንስ ይፈልጋሉ?"
                )}

              </h3>

              <p className="text-zinc-300 leading-8 mb-8">

                {t(
                  "Apply for machinery loans, leasing and installment payments.",
                  "የማሽነሪ ብድር፣ ሊዝ እና ክፍያ በክፍል ያግኙ።"
                )}

              </p>

              <Link
                href="/financing"
                className="inline-flex items-center gap-2 text-yellow-400 font-black"
              >

                {t(
                  "Apply Now",
                  "አሁን ያመልክቱ"
                )}

                <ChevronRight />

              </Link>

            </div>

            {/* INQUIRY */}

            <InquiryForm
              machineryId={
                machinery.id
              }
              ownerId={
                machinery.user_id
              }
            />

          </div>

        </div>

      </section>

    </main>
  );
}

/* ========================= */

function SpecCard({
  icon: Icon,
  label,
  value,
}: any) {
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5">

      <div className="flex items-center gap-3 mb-4">

        <Icon
          size={20}
          className="text-yellow-400"
        />

        <div className="text-zinc-400 text-sm font-bold">
          {label}
        </div>

      </div>

      <div className="text-xl font-black">
        {value || "-"}
      </div>

    </div>
  );
}

function ServiceCard({
  icon: Icon,
  title,
}: any) {
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 hover:border-yellow-500 transition">

      <Icon className="text-yellow-400 mb-5" />

      <div className="text-xl font-black">
        {title}
      </div>

    </div>
  );
}

function TrustCard({
  label,
}: any) {
  return (
    <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 rounded-2xl p-4">

      <CheckCircle2 className="text-green-400" />

      <div className="font-bold">
        {label}
      </div>

    </div>
  );
}

function SidebarInfo({
  label,
  value,
}: any) {
  return (
    <div>

      <div className="text-zinc-500 text-sm mb-1">
        {label}
      </div>

      <div className="font-bold text-lg">
        {value || "-"}
      </div>

    </div>
  );
}